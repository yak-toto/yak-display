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
          <div class="grid-bet" v-for="match in scoreBets" :key="match.id">
            <div class="team-bet-1">{{ match.team1?.description }}</div>
            <div class="input-bet-1">
              <input min="0" type="number" v-model="match.team1!.score" :readonly="match.locked" />
            </div>
            <div class="input-bet-2">
              <input min="0" type="number" v-model="match.team2!.score" :readonly="match.locked" />
            </div>
            <div class="team-bet-2">{{ match.team2?.description }}</div>
          </div>
          <div class="div-button-group">
            <button
              type="submit"
              class="button-group"
              :disabled="scoreBets.map((bet) => bet.locked).some((x) => x === true)"
            >
              Valider
            </button>
            <template v-if="displayStatus">
              <div class="updated-properly" v-if="updateProperly === true">
                Résultats soumis &#10003;
              </div>
              <div class="not-updated-properly" v-else-if="updateProperly === false">
                Erreur : Résultats non synchronisés &#10005;
              </div>
              <div class="updated-properly" v-else>Aucuns changements observés &#10003;</div>
            </template>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { cloneDeep, isEqual, zip } from 'lodash';
import { ref } from 'vue';
import { onBeforeRouteUpdate, type RouteLocationNormalizedLoaded } from 'vue-router';
import type { GroupOut, GroupPositionOut, ScoreBetOut } from '@/client';
import {
  modifyScoreBetApiV1ScoreBetsBetIdPatch,
  retrieveBetsByGroupCodeApiV1BetsGroupsGroupCodeGet,
  retrieveGroupRankByCodeApiV1BetsGroupsRankGroupCodeGet,
} from '@/client';
import useYakStore from '@/store';
import GroupNavbar from './GroupNavbar.vue';
import GroupRank from './GroupRank.vue';

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

const patchGroup = () => {
  displayStatus.value = false;

  const modifyBets = [];

  for (const [groupBet, groupBetCopy] of zip(scoreBets.value, scoreBetsCopy.value)) {
    if (groupBet && groupBetCopy && !isEqual(groupBet, groupBetCopy)) {
      if ((groupBet.team1?.score as any) === '') {
        groupBet.team1!.score = null;
      }
      if ((groupBet.team2?.score as any) === '') {
        groupBet.team2!.score = null;
      }
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
        scoreBets.value = cloneDeep(scoreBetsCopy.value);

        updateProperly.value = false;
        displayStatus.value = true;

        setTimeout(() => {
          displayStatus.value = false;
          updateProperly.value = null;
        }, 2000);
      });
  } else {
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

input {
  width: 100%;
  padding: 0.5rem;
  border-radius: 6px;
  border-width: 1px;
  border-color: rgb(10 10 10 / 10%);
  border-style: solid;
}

input:read-only {
  cursor: not-allowed;
  border: 0;
  outline: 0;
}

.grid-bet {
  display: grid;
  grid-template-columns: repeat(14, 1fr);
  grid-gap: 10px;
  padding: 0.25rem;
}

.team-bet-1 {
  display: flex;
  justify-content: center;
  align-items: center;
  grid-column: 1 / 3;
}

.input-bet-1 {
  grid-column: 3 / 8;
}

@media screen and (max-width: 900px) {
  .team-bet-1 {
    grid-column: 1 / 5;
  }
  .input-bet-1 {
    grid-column: 5 / 8;
  }
}

.input-bet-2 {
  grid-column: 8 / 13;
}

.team-bet-2 {
  display: flex;
  justify-content: center;
  align-items: center;
  grid-column: 13 / 15;
}

@media screen and (max-width: 900px) {
  .input-bet-2 {
    grid-column: 8 / 11;
  }
  .team-bet-2 {
    grid-column: 11 / 15;
  }
}

.div-button-group {
  padding-top: 1rem;
  display: grid;
  grid-template-columns: repeat(9, 1fr);
}

.button-group {
  grid-column: 5;
  cursor: pointer;
  padding: 0.35rem;
  background-color: #363636;
  border-color: transparent;
  color: whitesmoke;
  border-radius: 4px;
  font-size: 1rem;
}

.button-group:active {
  border-color: #363636;
  background-color: white;
  color: #363636;
}

.button-group:disabled {
  display: none;
}

.updated-properly {
  text-align: right;
  padding: 0.35rem;
  grid-column: 6 / 10;
  color: green;
  font-weight: bold;
  border-color: green;
  font-size: 1rem;
}

.not-updated-properly {
  text-align: right;
  padding: 0.35rem;
  grid-column: 6 / 10;
  color: red;
  font-weight: bold;
  border-color: red;
  font-size: 1rem;
}
</style>
