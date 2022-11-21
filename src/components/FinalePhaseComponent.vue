<template>
    <div class="grid-group">
      <div class="navbar-group">
        <GroupNavbar />
      </div>
      <div class="table-group">
        <h3 class="title">{{ phase.description }}</h3>

        <div class="box-group">
          <form v-on:submit.prevent="postGroup">
            <table class="table-final-phase">
              <thead>
                <tr>
                  <template v-for="group in Object.values(groups)" :key="group.id">
                    <th v-if="group.code !== '3'">{{ group.description }}</th>
                  </template>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <a>{{ finalePhaseBet['8'][0]['team1']['description'] }}</a>
                  </td>
                  <td rowspan="2" v-if="'4' in finalePhaseBet && finalePhaseBet['4'].length > 0">
                    <a>{{ finalePhaseBet['4'][0]['team1']['description'] }}</a>
                  </td>
                  <td rowspan="4" v-if="'2' in finalePhaseBet && finalePhaseBet['2'].length > 0">
                    <a>{{ finalePhaseBet['2'][0]['team1']['description'] }}</a>
                  </td>
                  <td rowspan="8" v-if="'1' in finalePhaseBet && finalePhaseBet['1'].length > 0">
                    <a>{{ finalePhaseBet['1'][0]['team1']['description'] }}</a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <a>{{ finalePhaseBet['8'][0]['team2']['description'] }}</a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <a>{{ finalePhaseBet['8'][1]['team1']['description'] }}</a>
                  </td>
                  <td rowspan="2" v-if="'4' in finalePhaseBet && finalePhaseBet['4'].length > 0">
                    <a>{{ finalePhaseBet['4'][0]['team2']['description'] }}</a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <a>{{ finalePhaseBet['8'][1]['team2']['description'] }}</a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <a>{{ finalePhaseBet['8'][2]['team1']['description'] }}</a>
                  </td>
                  <td rowspan="2" v-if="'4' in finalePhaseBet && finalePhaseBet['4'].length > 1">
                    <a>{{ finalePhaseBet['4'][1]['team1']['description'] }}</a>
                  </td>
                  <td rowspan="4" v-if="'2' in finalePhaseBet && finalePhaseBet['2'].length > 0">
                    <a>{{ finalePhaseBet['2'][0]['team2']['description'] }}</a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <a>{{ finalePhaseBet['8'][2]['team2']['description'] }}</a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <a>{{ finalePhaseBet['8'][3]['team1']['description'] }}</a>
                  </td>
                  <td rowspan="2" v-if="'4' in finalePhaseBet && finalePhaseBet['4'].length > 1">
                    <a>{{ finalePhaseBet['4'][1]['team2']['description'] }}</a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <a>{{ finalePhaseBet['8'][3]['team2']['description'] }}</a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <a>{{ finalePhaseBet['8'][4]['team1']['description'] }}</a>
                  </td>
                  <td rowspan="2" v-if="'4' in finalePhaseBet && finalePhaseBet['4'].length > 2">
                    <a>{{ finalePhaseBet['4'][2]['team1']['description'] }}</a>
                  </td>
                  <td rowspan="4" v-if="'2' in finalePhaseBet && finalePhaseBet['2'].length > 1">
                    <a>{{ finalePhaseBet['2'][1]['team1']['description'] }}</a>
                  </td>
                  <td rowspan="8" v-if="'1' in finalePhaseBet && finalePhaseBet['1'].length > 0">
                    <a>{{ finalePhaseBet['1'][0]['team2']['description'] }}</a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <a>{{ finalePhaseBet['8'][4]['team2']['description'] }}</a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <a>{{ finalePhaseBet['8'][5]['team1']['description'] }}</a>
                  </td>
                  <td rowspan="2" v-if="'4' in finalePhaseBet && finalePhaseBet['4'].length > 2">
                    <a>{{ finalePhaseBet['4'][2]['team2']['description'] }}</a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <a>{{ finalePhaseBet['8'][5]['team2']['description'] }}</a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <a>{{ finalePhaseBet['8'][6]['team1']['description'] }}</a>
                  </td>
                  <td rowspan="2" v-if="'4' in finalePhaseBet && finalePhaseBet['4'].length > 3">
                    <a>{{ finalePhaseBet['4'][3]['team1']['description'] }}</a>
                  </td>
                  <td rowspan="4" v-if="'2' in finalePhaseBet && finalePhaseBet['2'].length > 1">
                    <a>{{ finalePhaseBet['2'][1]['team2']['description'] }}</a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <a>{{ finalePhaseBet['8'][6]['team2']['description'] }}</a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <a>{{ finalePhaseBet['8'][7]['team1']['description'] }}</a>
                  </td>
                  <td rowspan="2" v-if="'4' in finalePhaseBet && finalePhaseBet['4'].length > 3">
                    <a>{{ finalePhaseBet['8'][3]['team2']['description'] }}</a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <a>{{ finalePhaseBet['8'][7]['team2']['description'] }}</a>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="div-button-group">
              <button type="submit" class="button-group">Valider</button>
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
  name: 'GroupComponent',
  components: {
    GroupNavbar,
  },
  data() {
    return {
      finalePhaseBet: {},
      groups: {},
      phase: {},
      // keep copy of group resource to send only PATCH /match of the updated matches
      groupResourceCopy: [],
      groupResult: [],
      displayStatus: false,
      updateProperly: [],
      groupsNames: [],
    };
  },
  methods: {
    getGroupList() {
      this.$store.dispatch('getBetByPhase', { phaseName: 'FINAL' })
        .then((res) => {
          this.phase = res.data.result['phase'];
          for (const group of res.data.result['groups']) {
            this.groups[group.id] = group
          }

          for (const binary_bets of res.data.result['binary_bets']) {
            if (!(this.groups[binary_bets.group.id].code in this.finalePhaseBet)) {
              this.finalePhaseBet[this.groups[binary_bets.group.id].code] = [];
            }
            this.finalePhaseBet[this.groups[binary_bets.group.id].code].push(binary_bets);
          }

          console.log(this.finalePhaseBet);
          console.log(this.groups);
        });
    },
    getGroupResult(groupName) {
      this.$store.dispatch('getGroupResult', { groupName })
        .then((res) => {
          this.groupResult = res.data.result;
        });
    },
    postGroup() {
      this.displayStatus = false;

      const modifyBets = [];

      for (const [group, groupCopy] of _.zip(this.groupResource, this.groupResourceCopy)) {
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
        this.$store.dispatch('patchBets', { bets: modifyBets })
          .then(() => {
            this.groupResourceCopy = _.cloneDeep(this.groupResource);
            this.updateProperly.push(true);
            this.displayStatus = true;

            this.getGroupResult(this.$route.params.groupName);

            setTimeout(
              () => {
                this.displayStatus = false;
                this.updateProperly.length = 0;
              },
              2000,
            );
          })
          .catch(() => {
            this.groupResource = _.cloneDeep(this.groupResourceCopy);
            this.updateProperly.push(false);
            this.displayStatus = true;

            setTimeout(
              () => {
                this.displayStatus = false;
                this.updateProperly.length = 0;
              },
              2000,
            );
          });
      } else {
        this.displayStatus = true;
        setTimeout(
          () => {
            this.displayStatus = false;
          },
          2000,
        );
      }
    },
  },
  beforeRouteUpdate(to, from, next) {
    //   this.getGroup(to.params.groupName);
    //   this.getGroupResult(to.params.groupName);
    //   this.displayStatus = false;
    next();
  },
  created() {
    this.getGroupList();
    //   this.getGroup(this.$route.params.groupName);
    //   this.getGroupResult(this.$route.params.groupName);
  },
};

</script>

<style lang="css">
.float-container {
  border: 3px solid #fff;
  padding: 2px;
}

.float-child {
  width: 25%;
  float: left;
  padding: 5px;
}

.blabla {
  padding: 20px;
  height: 100%;
}

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

.table-final-phase a {
  cursor: pointer;
  color: black;
  display: block;
  padding: 0.35rem;
  text-decoration: none;
}

.table-final-phase a:hover {
  background-color: #fafafa;
}

  .table-final-phase {
  width: 100%;
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
