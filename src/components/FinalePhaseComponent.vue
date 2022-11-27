<template>
    <div class="grid-finale-phase">
      <div class="navbar-finale-phase">
        <GroupNavbar />
      </div>
      <div class="table-finale-phase">
        <h3 class="title">{{ phase.description }}</h3>

        <div class="box-group">
          <form v-on:submit.prevent="postGroup">
            <table class="table-final-phase">
              <thead>
                <tr>
                  <th v-for="group of groups" :key="group.id">{{ group.description }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="index in Array(finalePhaseBet[groups[0].id].length).keys()">
                  <template v-for="[groupIndex, group] in groups.entries()" class="box-match" :key="group.id">
                    <td
                      :rowspan="Math.pow(2, groupIndex)" v-if="index % Math.pow(2, groupIndex) === 0"
                    >
                      <div class="box-match">
                        <template v-if="finalePhaseBet[group.id][index/Math.pow(2, groupIndex)].team1.description === ''
                          || finalePhaseBet[group.id][index/Math.pow(2, groupIndex)].team2.description === ''"
                        >
                          <div>
                            &#8205;{{ finalePhaseBet[group.id][index/Math.pow(2, groupIndex)].team1.description }}
                          </div>
                          <div>
                            &#8205;{{ finalePhaseBet[group.id][index/Math.pow(2, groupIndex)].team2.description }}
                          </div>
                        </template>
                        <template v-else>
                          <a
                            @click="pushBet(groupIndex, index/Math.pow(2, groupIndex), finalePhaseBet[group.id][index/Math.pow(2, groupIndex)].team1, true)"
                          >
                            &#8205;{{ finalePhaseBet[group.id][index/Math.pow(2, groupIndex)].team1.description }}
                          </a>
                          <a
                            @click="pushBet(groupIndex, index/Math.pow(2, groupIndex), finalePhaseBet[group.id][index/Math.pow(2, groupIndex)].team2, false)"
                          >
                            &#8205;{{ finalePhaseBet[group.id][index/Math.pow(2, groupIndex)].team2.description }}
                          </a>
                        </template>
                      </div>
                    </td>
                  </template>
                </tr>
              </tbody>
            </table>
            <div class="div-button-finale-phase">
              <button type="submit" class="button-finale-phase">Valider</button>
              <div class="updated-properly" v-if="displayStatus && updateProperly.length !== 0 && updateProperly.every(v => v === true)">
                Résultats soumis &#10003;
              </div>
              <div class="not-updated-properly" v-else-if="displayStatus && updateProperly.some(v => v === false)">
                Erreur : Résultats non synchronisés &#10005;
              </div>
              <div class="updated-properly" v-else-if="displayStatus && updateProperly.length === 0">
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
import GroupNavbar from './GroupNavbar.vue';

export default {
  name: 'FinalPhaseComponent',
  components: {
    GroupNavbar,
  },
  data() {
    return {
      finalePhaseBet: {},
      groups: [],
      phase: {},
      displayStatus: false,
      updateProperly: [],
    };
  },
  methods: {
    getFinalePhase() {
      this.$store.dispatch('postBetsFinalePhase')
        .then((res) => {
          this.phase = res.data.result.phase;
          this.groups = res.data.result.groups.filter(group => group.code !== '3');

          this.groups.sort((group1, group2) => parseInt(group2.code) - parseInt(group1.code));

          for (const group of this.groups) {
            this.finalePhaseBet[group.id] = Array
              .from(
                { length: parseInt(group.code) },
                () => ({
                  is_one_won: null,
                  group: {
                    id: group.id,
                  },
                  team1: {
                    description: '',
                  },
                  team2: {
                    description: '',
                  },
                }),
              );
          }

          for (const binary_bets of res.data.result.binary_bets) {
            this.finalePhaseBet[binary_bets.group.id][binary_bets.index - 1] = binary_bets;
          }
        });
    },
    pushBet(groupIndex, betIndex, team, isOneWon) {
      this.finalePhaseBet[this.groups[groupIndex].id][betIndex].is_one_won = isOneWon;

      var teamIndex = betIndex % 2 === 0 ? 1 : 2;
      var newBetIndex = betIndex % 2 === 0 ? betIndex/2 : (betIndex - 1)/2
      var originalTeamDescription = this.finalePhaseBet[this.groups[groupIndex + 1].id][newBetIndex][`team${teamIndex}`].description;

      this.finalePhaseBet[this.groups[groupIndex + 1].id][newBetIndex][`team${teamIndex}`] = _.clone(team);

      for (const group of this.groups.slice(groupIndex + 2)) {
        for ( const bet of this.finalePhaseBet[group.id]) {
          if (bet.team1.description === originalTeamDescription) {
            bet.team1.description = ""
          }
          if (bet.team2.description === originalTeamDescription) {
            bet.team2.description = ""
          }
        }
      }
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
  .grid-finale-phase {display: block;}
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

.table-final-phase th, .table-final-phase td {
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
