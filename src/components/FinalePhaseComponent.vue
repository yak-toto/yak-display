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
            <tbody>
              <tr
                v-for="index in Array(finalePhaseBet[groups[0].id].length).keys()"
                :key="index" v-if="groups.length !== 0"
              >
                <template v-for="[groupIndex, group] in groups.entries()" :key="group.id">
                  <td :rowspan="Math.pow(2, groupIndex)" v-if="index % Math.pow(2, groupIndex) === 0">
                    <div class="box-match">
                      <template
                        v-if="
                          finalePhaseBet[group.id][index / Math.pow(2, groupIndex)].team1.description ===
                            '' ||
                          finalePhaseBet[group.id][index / Math.pow(2, groupIndex)].team2.description === ''
                        "
                      >
                        <div>
                          &#8205;{{
                            finalePhaseBet[group.id][index / Math.pow(2, groupIndex)].team1.description
                          }}
                        </div>
                        <hr />
                        <div>
                          &#8205;{{
                            finalePhaseBet[group.id][index / Math.pow(2, groupIndex)].team2.description
                          }}
                        </div>
                      </template>
                      <template v-else>
                        <div class="box-team">
                          <div v-if="isLocked">
                            &#8205;{{
                              finalePhaseBet[group.id][index / Math.pow(2, groupIndex)].team1.description
                            }}
                          </div>
                          <a
                            v-else
                            @click="
                              pushBet(
                                groupIndex,
                                index / Math.pow(2, groupIndex),
                                finalePhaseBet[group.id][index / Math.pow(2, groupIndex)].team1,
                                true
                              )
                            "
                          >
                            &#8205;{{
                              finalePhaseBet[group.id][index / Math.pow(2, groupIndex)].team1.description
                            }}
                          </a>
                          <div
                            class="box-match-tick-green"
                            v-if="
                              finalePhaseBet[group.id][index / Math.pow(2, groupIndex)].is_one_won === true
                            "
                          >
                            V
                          </div>
                          <div
                            class="box-match-tick-red"
                            v-else-if="
                              finalePhaseBet[group.id][index / Math.pow(2, groupIndex)].is_one_won === false
                            "
                          >
                            D
                          </div>
                        </div>
                        <hr />
                        <div class="box-team">
                          <div v-if="isLocked">
                            &#8205;{{
                              finalePhaseBet[group.id][index / Math.pow(2, groupIndex)].team2.description
                            }}
                          </div>
                          <a
                            v-else
                            @click="
                              pushBet(
                                groupIndex,
                                index / Math.pow(2, groupIndex),
                                finalePhaseBet[group.id][index / Math.pow(2, groupIndex)].team2,
                                false
                              )
                            "
                          >
                            &#8205;{{
                              finalePhaseBet[group.id][index / Math.pow(2, groupIndex)].team2.description
                            }}
                          </a>
                          <div
                            class="box-match-tick-green"
                            v-if="
                              finalePhaseBet[group.id][index / Math.pow(2, groupIndex)].is_one_won === false
                            "
                          >
                            V
                          </div>
                          <div
                            class="box-match-tick-red"
                            v-else-if="
                              finalePhaseBet[group.id][index / Math.pow(2, groupIndex)].is_one_won === true
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

<script>
import _ from 'lodash';
import useYakStore from '@/store';
import { ref } from 'vue';
import GroupNavbar from './GroupNavbar.vue';

export default {
  name: 'FinalPhaseComponent',
  components: {
    GroupNavbar,
  },
  setup() {
    return {
      yakStore: useYakStore(),
      finalePhaseBet: ref({}),
      finalePhaseBetCopy: ref({}),
      groups: ref([]),
      phase: ref({}),
      isLocked: ref(false),
      displayStatus: ref(false),
      updateProperly: ref(null),
    };
  },
  methods: {
    getFinalePhase() {
      this.yakStore.executeRule('492345de-8d4a-45b6-8b94-d219f2b0c3e9')
        .then((res) => {

          this.yakStore.getBetsByPhaseCode({ phaseCode: 'FINAL' })
            .then((res) => {
              this.phase = res.data.result.phase;
              this.groups = res.data.result.groups.filter((group) => group.code !== '3');

              this.groups.sort(
                (group1, group2) => parseInt(group2.code, 10) - parseInt(group1.code, 10),
              );

              for (const group of this.groups) {
                this.finalePhaseBet[group.id] = [];

                for (const index of _.range(0, parseInt(group.code, 10))) {
                  this.finalePhaseBet[group.id].push({
                    is_one_won: null,
                    index: index + 1,
                    group: {
                      id: group.id,
                    },
                    team1: {
                      description: '',
                    },
                    team2: {
                      description: '',
                    },
                  });
                }
              }

              for (const binaryBets of res.data.result.binary_bets) {
                if (binaryBets.team1.won === null) {
                  binaryBets.is_one_won = null;
                } else {
                  binaryBets.is_one_won = binaryBets.team1.won;
                }

                if (binaryBets.locked) {
                  this.isLocked = true;
                }

                this.finalePhaseBet[binaryBets.group.id][binaryBets.index - 1] = binaryBets;
              }

              if (res.data.result.binary_bets.length === 0) {
                this.isLocked = true;
              }

              this.finalePhaseBetCopy = _.cloneDeep(this.finalePhaseBet);
            })
          })
    },
    pushBet(groupIndex, betIndex, team, isOneWon) {
      this.finalePhaseBet[this.groups[groupIndex].id][betIndex].is_one_won = isOneWon;

      const teamIndex = betIndex % 2 === 0 ? 1 : 2;
      const newBetIndex = betIndex % 2 === 0 ? betIndex / 2 : (betIndex - 1) / 2;
      const originalTeamDescription = this.finalePhaseBet[this.groups[groupIndex + 1].id][newBetIndex][`team${teamIndex}`].description;

      this.finalePhaseBet[this.groups[groupIndex + 1].id][newBetIndex][`team${teamIndex}`] = _.clone(team);

      for (const group of this.groups.slice(groupIndex + 2)) {
        for (const bet of this.finalePhaseBet[group.id]) {
          if (bet.team1.description === originalTeamDescription) {
            bet.team1.description = '';
          }
          if (bet.team2.description === originalTeamDescription) {
            bet.team2.description = '';
          }
        }
      }
    },
    putFinalePhaseBet() {
      const putFinalePhaseBody = Object.values(this.finalePhaseBet)
        .flat()
        .filter(
          (bet) => Object.prototype.hasOwnProperty.call(bet.team1, 'id')
            && Object.prototype.hasOwnProperty.call(bet.team2, 'id'),
        );

      this.yakStore.putBetsByPhase({ phaseCode: 'FINAL', bets: putFinalePhaseBody })
        .then(() => {
          this.finalePhaseBetCopy = _.cloneDeep(this.finalePhaseBet);

          this.updateProperly = true;
          this.displayStatus = true;

          setTimeout(() => {
            this.displayStatus = false;
            this.updateProperly = null;
          }, 2000);
        })
        .catch(() => {
          this.finalePhaseBet = _.cloneDeep(this.finalePhaseBetCopy);

          this.updateProperly = false;
          this.displayStatus = true;

          setTimeout(() => {
            this.displayStatus = false;
            this.updateProperly = null;
          }, 2000);
        });
    },
  },
  created() {
    this.getFinalePhase();
  },
};
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
