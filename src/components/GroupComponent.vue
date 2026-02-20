<template>
  <NavbarLayout>
    <div class="table-group">
      <h3 class="title">{{ group.description }}</h3>
      <GroupRank :groupRank="groupRank" />

      <BoxContainer>
        <form @submit.prevent>
          <MatchBetRow
            v-for="(match, index) in scoreBets"
            :key="match.id"
            :team1Name="match.team1?.description || ''"
            :team2Name="match.team2?.description || ''"
            :team1Flag="match.team1?.flag.url"
            :team2Flag="match.team2?.flag.url"
            :team1Score="match.team1?.score"
            :team2Score="match.team2?.score"
            :locked="match.locked"
            @update:team1Score="(score) => updateTeamScore(index, 'team1', score)"
            @update:team2Score="(score) => updateTeamScore(index, 'team2', score)"
          />
          <div class="div-button-group">
            <div class="button-container">
              <div v-if="isButtonDisabled" class="disabled-message">
                <span class="icon">ℹ️</span>
                <span>{{ disabledMessage }}</span>
              </div>
              <StatusButton
                :key="group.id"
                :disabled="isButtonDisabled"
                :on-submit="patchGroup"
                default-text="Valider"
                loading-text="Envoi en cours..."
                success-text="Résultats soumis"
                error-text="Erreur de synchronisation"
                info-text="Aucun changement"
              />
            </div>
          </div>
        </form>
      </BoxContainer>
    </div>
  </NavbarLayout>
</template>

<script setup lang="ts">
import { cloneDeep, isEqual, zip } from 'lodash';
import { computed, ref } from 'vue';
import { onBeforeRouteUpdate, type RouteLocationNormalizedLoaded } from 'vue-router';
import type { GroupOut, GroupPositionOut, ScoreBetWithGroupIdOut } from '@/client';
import {
  modifyScoreBetApiV1ScoreBetsBetIdPatch,
  retrieveGroupRankByCodeApiV1BetsGroupsRankGroupIdGet,
} from '@/client';
import useYakStore from '@/store';
import BoxContainer from './BoxContainer.vue';
import StatusButton from './form/StatusButton.vue';
import GroupRank from './GroupRank.vue';
import MatchBetRow from './MatchBetRow.vue';
import NavbarLayout from './NavbarLayout.vue';

const props = defineProps({ groupName: String });

const yakStore = useYakStore();

// Reactive data
const group = ref<GroupOut>({} as GroupOut);
const scoreBets = ref<ScoreBetWithGroupIdOut[]>([]);
// keep copy of group resource to send only PATCH /match of the updated matches
const scoreBetsCopy = ref<ScoreBetWithGroupIdOut[]>([]);
const groupRank = ref<GroupPositionOut[]>([]);

// Methods
const loadGroupFromStore = (groupName: string) => {
  const found = yakStore.allBets?.groups.find((g) => g.code === groupName);
  if (found) {
    group.value = found;
    const bets = yakStore.allBets?.score_bets.filter((bet) => bet.group.id === found.id) ?? [];
    scoreBets.value = bets;
    scoreBetsCopy.value = cloneDeep(bets);
  }
};

const getGroupRankByCode = async (groupId: string) => {
  const { data } = await retrieveGroupRankByCodeApiV1BetsGroupsRankGroupIdGet({
    path: { group_id: groupId },
  });
  if (data) {
    groupRank.value = data.result.group_rank;
  }
};

const updateTeamScore = (index: number, teamKey: 'team1' | 'team2', score: number | null) => {
  const match = scoreBets.value[index];
  const team = match?.[teamKey];
  if (team) {
    team.score = score;
  }
};

const isButtonDisabled = computed(() => {
  return scoreBets.value.every((bet) => bet.locked);
});

const disabledMessage = computed(() => {
  if (!isButtonDisabled.value) {
    return '';
  }

  const lockedCount = scoreBets.value.filter((bet) => bet.locked).length;
  const totalCount = scoreBets.value.length;

  if (lockedCount === totalCount) {
    return 'Tous les matchs sont verrouillés et ne peuvent plus être modifiés';
  }

  return `${lockedCount} match${lockedCount > 1 ? 's' : ''} verrouillé${lockedCount > 1 ? 's' : ''} - seuls les matchs non verrouillés peuvent être modifiés`;
});

const getModifiedBets = (
  current: ScoreBetWithGroupIdOut[],
  original: ScoreBetWithGroupIdOut[],
): ScoreBetWithGroupIdOut[] => {
  const modified: ScoreBetWithGroupIdOut[] = [];

  for (const [currentBet, originalBet] of zip(current, original)) {
    if (currentBet && originalBet && !isEqual(currentBet, originalBet)) {
      modified.push(currentBet);
    }
  }

  return modified;
};

const patchGroup = async (): Promise<'success' | 'error' | 'info'> => {
  const modifyBets = getModifiedBets(scoreBets.value, scoreBetsCopy.value);

  if (modifyBets.length === 0) {
    return 'info';
  }

  try {
    await Promise.all(
      modifyBets.map((bet) =>
        modifyScoreBetApiV1ScoreBetsBetIdPatch({
          path: { bet_id: bet.id },
          body: {
            team1: { id: bet.team1?.id || '', score: bet.team1?.score },
            team2: { id: bet.team2?.id || '', score: bet.team2?.score },
          },
        }),
      ),
    );

    scoreBetsCopy.value = cloneDeep(scoreBets.value);
    yakStore.updateStoreBets(scoreBets.value);
    await getGroupRankByCode(group.value.id);
    return 'success';
  } catch (error) {
    console.error('Failed to update bets:', error);
    scoreBets.value = cloneDeep(scoreBetsCopy.value);
    return 'error';
  }
};

const loadGroup = async (groupName: string) => {
  if (!yakStore.allBets) {
    await yakStore.fetchAllBets();
  }
  loadGroupFromStore(groupName);
  getGroupRankByCode(group.value.id);
};

// Route navigation guard
onBeforeRouteUpdate((to: RouteLocationNormalizedLoaded) => {
  loadGroup(to.params.groupName as string);
});

loadGroup(props.groupName || '');
</script>

<style scoped lang="css">
.title {
  font-size: 2rem;
  font-weight: 600;
  line-height: 1.125;
  text-align: center;
}

@media screen and (max-width: 600px) {
  .title {
    font-size: 1.5rem;
    margin-bottom: 0.75rem;
  }
}

.result-group {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 3rem;
}

.result-group tbody tr:nth-child(even) {
  background-color: #fafafa;
}

.result-group tbody tr:nth-child(odd) {
  background-color: white;
}

.result-group th,
.result-group td {
  border: 1px solid;
  border-width: 0 0 1px;
  border-color: #53535321;
  text-align: left;
  padding: 0.5em 0.75em;
}

.result-group abbr {
  cursor: help;
}

.div-button-group {
  padding-top: 1rem;
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.button-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
}

.disabled-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #666;
  background-color: #f5f5f5;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border-left: 3px solid #ffa500;
  max-width: 500px;
  text-align: left;
}

.disabled-message .icon {
  font-size: 1rem;
  flex-shrink: 0;
}

@media screen and (max-width: 600px) {
  .disabled-message {
    font-size: 0.8125rem;
    padding: 0.5rem 0.75rem;
    max-width: 100%;
  }
}
</style>
