<template>
  <div class="grid-finale-phase">
    <div class="navbar-finale-phase">
      <GroupNavbar />
    </div>
    <div class="table-finale-phase">
      <h3 class="title">{{ phase.description }}</h3>

      <div class="box-group">
        <form v-on:submit.prevent="putFinalePhaseBet">
          <table class="table-final-phase">
            <thead>
              <tr>
                <th v-for="group of groups" :key="group.id">{{ group.description }}</th>
              </tr>
            </thead>
            <tbody v-if="groups.length !== 0">
              <tr v-for="index in range(finalePhaseBet[groups[0].id].length)" :key="index">
                <template v-for="[groupIndex, group] in groups.entries()" :key="group.id">
                  <td
                    :rowspan="Math.pow(2, groupIndex)"
                    v-if="index % Math.pow(2, groupIndex) === 0"
                  >
                    <div class="box-match">
                      <template
                        v-if="
                          finalePhaseBet[group.id][index / Math.pow(2, groupIndex)].team1
                            .description === '' ||
                          finalePhaseBet[group.id][index / Math.pow(2, groupIndex)].team2
                            .description === ''
                        "
                      >
                        <div>
                          &#8205;{{
                            finalePhaseBet[group.id][index / Math.pow(2, groupIndex)].team1
                              .description
                          }}
                        </div>
                        <hr />
                        <div>
                          &#8205;{{
                            finalePhaseBet[group.id][index / Math.pow(2, groupIndex)].team2
                              .description
                          }}
                        </div>
                      </template>
                      <template v-else>
                        <div class="box-team">
                          <div v-if="isLocked">
                            &#8205;{{
                              finalePhaseBet[group.id][index / Math.pow(2, groupIndex)].team1
                                .description
                            }}
                          </div>
                          <a
                            v-else
                            @click="
                              pushBet(
                                groupIndex,
                                index / Math.pow(2, groupIndex),
                                finalePhaseBet[group.id][index / Math.pow(2, groupIndex)].team1,
                                true,
                              )
                            "
                          >
                            &#8205;{{
                              finalePhaseBet[group.id][index / Math.pow(2, groupIndex)].team1
                                .description
                            }}
                          </a>
                          <div
                            class="box-match-tick-green"
                            v-if="
                              finalePhaseBet[group.id][index / Math.pow(2, groupIndex)]
                                .is_one_won === true
                            "
                          >
                            V
                          </div>
                          <div
                            class="box-match-tick-red"
                            v-else-if="
                              finalePhaseBet[group.id][index / Math.pow(2, groupIndex)]
                                .is_one_won === false
                            "
                          >
                            D
                          </div>
                        </div>
                        <hr />
                        <div class="box-team">
                          <div v-if="isLocked">
                            &#8205;{{
                              finalePhaseBet[group.id][index / Math.pow(2, groupIndex)].team2
                                .description
                            }}
                          </div>
                          <a
                            v-else
                            @click="
                              pushBet(
                                groupIndex,
                                index / Math.pow(2, groupIndex),
                                finalePhaseBet[group.id][index / Math.pow(2, groupIndex)].team2,
                                false,
                              )
                            "
                          >
                            &#8205;{{
                              finalePhaseBet[group.id][index / Math.pow(2, groupIndex)].team2
                                .description
                            }}
                          </a>
                          <div
                            class="box-match-tick-green"
                            v-if="
                              finalePhaseBet[group.id][index / Math.pow(2, groupIndex)]
                                .is_one_won === false
                            "
                          >
                            V
                          </div>
                          <div
                            class="box-match-tick-red"
                            v-else-if="
                              finalePhaseBet[group.id][index / Math.pow(2, groupIndex)]
                                .is_one_won === true
                            "
                          >
                            D
                          </div>
                        </div>
                      </template>
                    </div>
                  </td>
                </template>
              </tr>
            </tbody>
          </table>
          <div class="div-button-finale-phase">
            <button type="submit" class="button-finale-phase" :disabled="isLocked">Valider</button>
            <div class="updated-properly" v-if="displayStatus && updateProperly === true">
              Résultats soumis &#10003;
            </div>
            <div class="not-updated-properly" v-else-if="displayStatus && updateProperly === false">
              Erreur : Résultats non synchronisés &#10005;
            </div>
            <div class="updated-properly" v-else-if="displayStatus && updateProperly === null">
              Aucuns changements observés &#10003;
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import _, { range } from 'lodash';
import { ref } from 'vue';
import useYakStore from '@/store';
import GroupNavbar from './GroupNavbar.vue';

const yakStore = useYakStore();

// Reactive data
const finalePhaseBet = ref({});
const finalePhaseBetCopy = ref({});
const groups = ref([]);
const phase = ref({});
const isLocked = ref(false);
const displayStatus = ref(false);
const updateProperly = ref(null);

// Methods
const getFinalePhase = () => {
  yakStore.executeRule('492345de-8d4a-45b6-8b94-d219f2b0c3e9').then(() => {
    yakStore.getBetsByPhaseCode({ phaseCode: 'FINAL' }).then((res) => {
      phase.value = res.data.result.phase;
      groups.value = res.data.result.groups.filter((group) => group.code !== '3');

      for (const group of groups.value) {
        finalePhaseBet.value[group.id] = [];
      }

      for (const binaryBets of res.data.result.binary_bets) {
        if (binaryBets.team1 === null && binaryBets.team2 === null) {
          binaryBets.is_one_won = null;
          binaryBets.team1 = {
            description: '',
          };
          binaryBets.team2 = {
            description: '',
          };
        } else if (binaryBets.team1 === null) {
          if (binaryBets.team2.won === null) {
            binaryBets.is_one_won = null;
          } else {
            binaryBets.is_one_won = !binaryBets.team2.won;
          }

          binaryBets.team1 = {
            description: '',
          };
        } else if (binaryBets.team2 === null) {
          if (binaryBets.team1.won === null) {
            binaryBets.is_one_won = null;
          } else {
            binaryBets.is_one_won = binaryBets.team1.won;
          }

          binaryBets.team2 = {
            description: '',
          };
        } else if (binaryBets.team1.won === null) {
          binaryBets.is_one_won = null;
        } else {
          binaryBets.is_one_won = binaryBets.team1.won;
        }

        if (binaryBets.locked) {
          isLocked.value = true;
        }

        finalePhaseBet.value[binaryBets.group.id].push(binaryBets);
      }

      if (res.data.result.binary_bets.length === 0) {
        isLocked.value = true;
      }

      finalePhaseBetCopy.value = _.cloneDeep(finalePhaseBet.value);
    });
  });
};

const pushBet = (groupIndex, betIndex, team, isOneWon) => {
  finalePhaseBet.value[groups.value[groupIndex].id][betIndex].is_one_won = isOneWon;

  const teamIndex = betIndex % 2 === 0 ? 1 : 2;
  const newBetIndex = betIndex % 2 === 0 ? betIndex / 2 : (betIndex - 1) / 2;
  const originalTeamDescription =
    finalePhaseBet.value[groups.value[groupIndex + 1].id][newBetIndex][`team${teamIndex}`]
      .description;

  finalePhaseBet.value[groups.value[groupIndex + 1].id][newBetIndex][`team${teamIndex}`] =
    _.clone(team);

  for (const group of groups.value.slice(groupIndex + 2)) {
    for (const bet of finalePhaseBet.value[group.id]) {
      if (bet.team1.description === originalTeamDescription) {
        bet.team1.description = '';
      }
      if (bet.team2.description === originalTeamDescription) {
        bet.team2.description = '';
      }
    }
  }
};

const putFinalePhaseBet = () => {
  for (const [newBet, originalBet] of _.zip(
    Object.values(finalePhaseBet.value)
      .flat()
      .sort((bet) => bet.id),
    Object.values(finalePhaseBetCopy.value)
      .flat()
      .sort((bet) => bet.id),
  )) {
    const requestBody = {};
    let isUpdateRequired = false;

    if (newBet.team1.id !== originalBet.team1.id) {
      isUpdateRequired = true;
      requestBody.team1 = { id: newBet.team1.id };
    }

    if (newBet.team2.id !== originalBet.team2.id) {
      isUpdateRequired = true;
      requestBody.team2 = { id: newBet.team2.id };
    }

    if (newBet.is_one_won !== originalBet.is_one_won) {
      isUpdateRequired = true;
      requestBody.is_one_won = newBet.is_one_won;
    }

    if (isUpdateRequired === true) {
      yakStore.modifyBinaryBet(newBet.id, requestBody);
    }
  }
};

// Equivalent to created() lifecycle hook
getFinalePhase();
</script>

<style lang="css">
.grid-finale-phase {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 10px;
}

@media screen and (max-width: 600px) {
  .grid-finale-phase {
    display: block;
  }
}

.navbar-finale-phase {
  grid-column: 1;
}

.table-finale-phase {
  grid-column: 2 / 7;
}

.title {
  font-size: 2rem;
  font-weight: 600;
  line-height: 1.125;
  text-align: center;
}

.box-match {
  border: solid;
  border-width: 1px;
  border-color: #53535321;
  border-radius: 6px;
  color: #535353;
  display: block;
  padding: 0.3rem;
}

.box-team {
  display: flex;
  justify-content: space-between;
}

.box-match-tick-green {
  color: green;
}

.box-match-tick-red {
  color: red;
}

.box-match hr {
  margin: 0px;
  border-color: #53535321;
}

.table-final-phase a {
  cursor: pointer;
  color: black;
  display: block;
  text-decoration: none;
}

.table-final-phase a:hover {
  background-color: #fafafa;
}

.table-final-phase {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  margin-bottom: 2rem;
}

.table-final-phase th,
.table-final-phase td {
  border-width: 0 0 1px;
  border-color: #53535321;
  text-align: left;
  padding: 0.5em 0.75em;
}

.table-final-phase abbr {
  cursor: help;
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

.div-button-finale-phase {
  padding-top: 1rem;
  display: grid;
  grid-template-columns: repeat(9, 1fr);
}

.button-finale-phase {
  grid-column: 5;
  cursor: pointer;
  padding: 0.35rem;
  background-color: #363636;
  border-color: transparent;
  color: whitesmoke;
  border-radius: 4px;
  font-size: 1rem;
}

.button-finale-phase:active {
  border-color: #363636;
  background-color: white;
  color: #363636;
}

.button-finale-phase:disabled {
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
