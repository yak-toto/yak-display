<template>
  <div class="grid-group">
    <div class="navbar-group">
      <GroupNavbar />
    </div>
    <div class="table-group">
      <h3 class="title">{{ group.description }}</h3>
      <table class="result-group">
        <thead>
          <tr>
            <th />
            <th>Équipe</th>
            <th>
              <abbr title="Points">Pts</abbr>
            </th>
            <th>
              <abbr title="Joué">J</abbr>
            </th>
            <th>
              <abbr title="Gagné">G</abbr>
            </th>
            <th>
              <abbr title="Nul">N</abbr>
            </th>
            <th>
              <abbr title="Perdu">P</abbr>
            </th>
            <th>
              <abbr title="Buts pour">BP</abbr>
            </th>
            <th>
              <abbr title="Buts contre">BC</abbr>
            </th>
            <th>
              <abbr title="Différence de buts">Diff</abbr>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="[index, result] in groupRank.entries()" :key="result.team.id">
            <td>{{ index + 1 }}</td>
            <td>{{ result.team.description }}</td>
            <td>{{ result.points }}</td>
            <td>{{ result.played }}</td>
            <td>{{ result.won }}</td>
            <td>{{ result.drawn }}</td>
            <td>{{ result.lost }}</td>
            <td>{{ result.goals_for }}</td>
            <td>{{ result.goals_against }}</td>
            <td>{{ result.goals_difference }}</td>
          </tr>
        </tbody>
      </table>

      <div class="box-group">
        <form v-on:submit.prevent="patchGroup">
          <div class="grid-bet" v-for="match in scoreBets" :key="match.id">
            <div class="team-bet-1">{{ match.team1.description }}</div>
            <div class="input-bet-1">
              <input min="0" type="number" v-model="match.team1.score" :readonly="match.locked">
            </div>
            <div class="input-bet-2">
              <input min="0" type="number" v-model="match.team2.score" :readonly="match.locked">
            </div>
            <div class="team-bet-2">{{ match.team2.description }}</div>
          </div>
          <div class="div-button-group">
            <button type="submit" class="button-group"
              :disabled="scoreBets.map(bet => bet.locked).some(x => x === true)"
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
              <div class="updated-properly" v-else>
                Aucuns changements observés &#10003;
              </div>
            </template>
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
  name: 'GroupComponent',
  components: {
    GroupNavbar,
  },
  props: {
    groupName: String,
  },
  data() {
    return {
      group: {},
      scoreBets: [],
      // keep copy of group resource to send only PATCH /match of the updated matches
      scoreBetsCopy: [],
      groupRank: [],
      displayStatus: false,
      updateProperly: null,
    };
  },
  methods: {
    getGroup(groupName) {
      this.$store.dispatch('getGroup', { groupName })
        .then((res) => {
          this.group = res.data.result.group;
          this.scoreBets = res.data.result.score_bets;
          this.scoreBetsCopy = _.cloneDeep(this.scoreBets);
        });
    },
    getGroupResult(groupName) {
      this.$store.dispatch('getGroupResult', { groupName })
        .then((res) => {
          this.groupRank = res.data.result.group_rank;
        });
    },
    patchGroup() {
      this.displayStatus = false;

      const modifyBets = [];

      for (const [group, groupCopy] of _.zip(this.scoreBets, this.scoreBetsCopy)) {
        if (!_.isEqual(group, groupCopy)) {
          if (group.team1.score === '') {
            group.team1.score = null;
          }
          if (group.team2.score === '') {
            group.team2.score = null;
          }
          modifyBets.push(group);
        }
      }

      if (modifyBets.length !== 0) {
        Promise.all(modifyBets.map((bet) => this.$store.dispatch('patchScoreBet', { betId: bet.id, score1: bet.team1.score, score2: bet.team2.score })))
          .then(() => {
            this.scoreBetsCopy = _.cloneDeep(this.scoreBets);

            this.updateProperly = true;
            this.displayStatus = true;

            this.getGroupResult(this.group.code);

            setTimeout(
              () => {
                this.displayStatus = false;
                this.updateProperly = null;
              },
              2000,
            );
          })
          .catch(() => {
            this.scoreBets = _.cloneDeep(this.scoreBetsCopy);

            this.updateProperly = false;
            this.displayStatus = true;

            setTimeout(
              () => {
                this.displayStatus = false;
                this.updateProperly = null;
              },
              2000,
            );
          });
      } else {
        this.displayStatus = true;
        setTimeout(() => { this.displayStatus = false; }, 2000);
      }
    },
  },
  beforeRouteUpdate(to, _, next) {
    this.getGroup(to.params.groupName);
    this.getGroupResult(to.params.groupName);
    this.displayStatus = false;
    next();
  },
  created() {
    this.getGroup(this.groupName);
    this.getGroupResult(this.groupName);
  },
};

</script>

<style lang="css">
.grid-group {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 10px;
}

@media screen and (max-width: 600px) {
  .grid-group {display: block;}
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

.result-group th, .result-group td {
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
  .team-bet-1 {grid-column: 1 / 5;}
  .input-bet-1 {grid-column: 5 / 8;}
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
  .input-bet-2 {grid-column: 8 / 11;}
  .team-bet-2 {grid-column: 11 / 15;}
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
