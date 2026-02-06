<template>
  <div class="grid-group">
    <div class="navbar-group">
      <GroupNavbar />
    </div>
    <div class="table-group">
      <h3 class="title">{{ group.description }}</h3>
      <GroupRank :groupRank="groupRank" />

      <BoxContainer>
        <form v-on:submit.prevent="patchGroup">
          <MatchBetRow
            v-for="(match, index) in scoreBets"
            :key="match.id"
            :team1Name="match.team1?.description || ''"
            :team2Name="match.team2?.description || ''"
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
                :disabled="isButtonDisabled"
                :loading="loading"
                :show-status="displayStatus"
                :status="buttonStatus"
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
  </div>
</template>

<script setup lang="ts">
import { cloneDeep, isEqual, zip } from 'lodash';
import { computed, ref } from 'vue';
import { onBeforeRouteUpdate, type RouteLocationNormalizedLoaded } from 'vue-router';
import type { GroupOut, GroupPositionOut, ScoreBetOut } from '@/client';
import {
  modifyScoreBetApiV1ScoreBetsBetIdPatch,
  retrieveBetsByGroupCodeApiV1BetsGroupsGroupCodeGet,
  retrieveGroupRankByCodeApiV1BetsGroupsRankGroupCodeGet,
} from '@/client';
import useYakStore from '@/store';
import BoxContainer from './BoxContainer.vue';
import StatusButton from './form/StatusButton.vue';
import GroupNavbar from './GroupNavbar.vue';
import GroupRank from './GroupRank.vue';
import MatchBetRow from './MatchBetRow.vue';

const props = defineProps({ groupName: String });

const yakStore = useYakStore();

// Constants
const STATUS_DISPLAY_DURATION = 4000;

// Reactive data
const group = ref<GroupOut>({} as GroupOut);
const scoreBets = ref<ScoreBetOut[]>([]);
// keep copy of group resource to send only PATCH /match of the updated matches
const scoreBetsCopy = ref<ScoreBetOut[]>([]);
const groupRank = ref<GroupPositionOut[]>([]);
const displayStatus = ref(false);
const updateProperly = ref<boolean | null>(null);
const loading = ref(false);

// Methods
const getBetsByGroupCode = async (groupName: string) => {
  const { data } = await retrieveBetsByGroupCodeApiV1BetsGroupsGroupCodeGet({
    path: { group_code: groupName },
    headers: { Authorization: `Bearer ${yakStore.jwt}` },
  });
  if (data) {
    group.value = data.result.group;
    scoreBets.value = data.result.score_bets;
    scoreBetsCopy.value = cloneDeep(scoreBets.value);
  }
};

const getGroupRankByCode = async (groupName: string) => {
  const { data } = await retrieveGroupRankByCodeApiV1BetsGroupsRankGroupCodeGet({
    path: { group_code: groupName },
    headers: { Authorization: `Bearer ${yakStore.jwt}` },
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

const buttonStatus = computed<'success' | 'error' | 'info'>(() => {
  if (updateProperly.value === true) {
    return 'success';
  }

  if (updateProperly.value === false) {
    return 'error';
  }

  return 'info';
});

const showStatusTemporarily = (status: boolean | null) => {
  updateProperly.value = status;
  displayStatus.value = true;

  setTimeout(() => {
    updateProperly.value = null;
    displayStatus.value = false;
  }, STATUS_DISPLAY_DURATION);
};

const getModifiedBets = (current: ScoreBetOut[], original: ScoreBetOut[]): ScoreBetOut[] => {
  const modified: ScoreBetOut[] = [];

  for (const [currentBet, originalBet] of zip(current, original)) {
    if (currentBet && originalBet && !isEqual(currentBet, originalBet)) {
      modified.push(currentBet);
    }
  }

  return modified;
};

const patchGroup = async () => {
  displayStatus.value = false;
  loading.value = true;

  const modifyBets = getModifiedBets(scoreBets.value, scoreBetsCopy.value);

  // Early return: no changes to submit
  if (modifyBets.length === 0) {
    loading.value = false;
    showStatusTemporarily(null);
    return;
  }

  // Submit modified bets
  try {
    await Promise.all(
      modifyBets.map((bet) =>
        modifyScoreBetApiV1ScoreBetsBetIdPatch({
          path: { bet_id: bet.id },
          body: {
            team1: { id: bet.team1?.id || '', score: bet.team1?.score },
            team2: { id: bet.team2?.id || '', score: bet.team2?.score },
          },
          headers: { Authorization: `Bearer ${yakStore.jwt}` },
        }),
      ),
    );

    scoreBetsCopy.value = cloneDeep(scoreBets.value);
    await getGroupRankByCode(group.value.code);
    showStatusTemporarily(true);
  } catch (error) {
    console.error('Failed to update bets:', error);
    scoreBets.value = cloneDeep(scoreBetsCopy.value);
    showStatusTemporarily(false);
  } finally {
    loading.value = false;
  }
};

// Route navigation guard
onBeforeRouteUpdate((to: RouteLocationNormalizedLoaded) => {
  getBetsByGroupCode(to.params.groupName as string);
  getGroupRankByCode(to.params.groupName as string);
  displayStatus.value = false;
});

// Equivalent to created() lifecycle hook
getBetsByGroupCode(props.groupName || '');
getGroupRankByCode(props.groupName || '');
</script>

<style lang="css">
.grid-group {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 10px;
}

@media screen and (max-width: 600px) {
  .grid-group {
    display: block;
  }
}

.navbar-group {
  grid-column: 1;
}

.table-group {
  grid-column: 2 / 7;
}

.title {
  font-size: 2rem;
  font-weight: 600;
  line-height: 1.125;
  text-align: center;
}

.result-group {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5rem;
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
