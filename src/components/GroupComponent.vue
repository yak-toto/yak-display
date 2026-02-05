<template>
  <div class="grid-group">
    <div class="navbar-group">
      <GroupNavbar />
    </div>
    <div class="table-group">
      <h3 class="title">{{ group.description }}</h3>
      <GroupRank :groupRank="groupRank" />

      <div class="box-group">
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
            <StatusButton
              :disabled="scoreBets.map((bet) => bet.locked).some((x) => x === true)"
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
        </form>
      </div>
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
import StatusButton from './form/StatusButton.vue';
import GroupNavbar from './GroupNavbar.vue';
import GroupRank from './GroupRank.vue';
import MatchBetRow from './MatchBetRow.vue';

const props = defineProps({ groupName: String });

const yakStore = useYakStore();

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

const buttonStatus = computed<'success' | 'error' | 'info'>(() => {
  if (updateProperly.value === true) {
    return 'success';
  }

  if (updateProperly.value === false) {
    return 'error';
  }

  return 'info';
});

const patchGroup = () => {
  displayStatus.value = false;
  loading.value = true;

  const modifyBets: ScoreBetOut[] = [];

  for (const [groupBet, groupBetCopy] of zip(scoreBets.value, scoreBetsCopy.value)) {
    if (groupBet && groupBetCopy && !isEqual(groupBet, groupBetCopy)) {
      modifyBets.push(groupBet);
    }
  }

  if (modifyBets.length !== 0) {
    Promise.all(
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
    )
      .then(() => {
        loading.value = false;
        scoreBetsCopy.value = cloneDeep(scoreBets.value);

        updateProperly.value = true;
        displayStatus.value = true;

        getGroupRankByCode(group.value.code);

        setTimeout(() => {
          displayStatus.value = false;
          updateProperly.value = null;
        }, 2000);
      })
      .catch(() => {
        loading.value = false;
        scoreBets.value = cloneDeep(scoreBetsCopy.value);

        updateProperly.value = false;
        displayStatus.value = true;

        setTimeout(() => {
          displayStatus.value = false;
          updateProperly.value = null;
        }, 2000);
      });
  } else {
    loading.value = false;
    displayStatus.value = true;
    setTimeout(() => {
      displayStatus.value = false;
    }, 2000);
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

.box-group {
  border: solid;
  border-width: 1px;
  border-color: #53535321;
  border-radius: 6px;
  color: #535353;
  display: block;
  padding: 1.25rem;
  width: 100%;
}

.result-group {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
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
</style>
