<template>
  <div class="grid-score-board">
    <div class="navbar-score-board">
      <GroupNavbar />
    </div>
    <div class="table-score-board">
      <h3 class="title">Classement</h3>
      <div class="box-score-board">
        <table class="table-custom">
          <thead>
            <tr>
              <th>Joueur</th>
              <th>Nombre de matchs trouvés</th>
              <th>Nombre de scores trouvés</th>
              <th>Nombre de qualifiés trouvés</th>
              <th>Nombre de premier trouvés</th>
              <th>Nombre de quart de finalistes</th>
              <th>Nombre de demi-finalistes</th>
              <th>Nombre de finalistes</th>
              <th>Vainqueur trouvé</th>
              <th>Points</th>
            </tr>
          </thead>
          <tr v-for="res in scoreBoardResource" :key="res.full_name">
            <td>{{ res.full_name }}</td>
            <td>{{ res.number_match_guess }}</td>
            <td>{{ res.number_score_guess }}</td>
            <td>{{ res.number_qualified_teams_guess }}</td>
            <td>{{ res.number_first_qualified_guess }}</td>
            <td>{{ res.number_quarter_final_guess }}</td>
            <td>{{ res.number_semi_final_guess }}</td>
            <td>{{ res.number_final_guess }}</td>
            <td>{{ res.number_winner_guess }}</td>
            <td>{{ res.points }}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { retrieveScoreBoardApiV1ScoreBoardGet } from '@/client';
import type { UserResult } from '@/client';
import useYakStore from '@/store';
import GroupNavbar from './GroupNavbar.vue';

const yakStore = useYakStore();

// Reactive data
const scoreBoardResource = ref<UserResult[]>([]);

// Methods
const getScoreBoard = async () => {
  const { data } = await retrieveScoreBoardApiV1ScoreBoardGet({
    headers: { Authorization: `Bearer ${yakStore.jwt}` },
  });
  if (data) {
    scoreBoardResource.value = data.result;
  }
};

// Equivalent to created() lifecycle hook
onMounted(getScoreBoard);
</script>

<style lang="css">
.grid-score-board {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 10px;
}

@media screen and (max-width: 800px) {
  .grid-score-board {
    display: block;
  }
}

.navbar-score-board {
  grid-column: 1;
}

.table-score-board {
  grid-column: 2 / 7;
}

.box-score-board {
  border: solid;
  border-width: 1px;
  border-color: #53535321;
  border-radius: 6px;
  color: #535353;
  display: block;
  padding: 1.25rem;
  width: 100%;
}

.title {
  font-size: 2rem;
  font-weight: 600;
  line-height: 1.125;
  text-align: center;
}

.table-custom {
  width: 100%;
  text-align: left;
  border-collapse: collapse;
}

.table-custom thead {
  background-color: transparent;
}

.table-custom th {
  border-width: 0 0 2px;
  color: #363636;
  padding: 0.5em 0.75em;
}

.table-custom td {
  border: 1px solid #dbdbdb;
  border-width: 0 0 1px;
  padding: 0.5em 0.75em;
  vertical-align: top;
}
</style>
