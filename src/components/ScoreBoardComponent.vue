<template>
  <div class="table-score-board">
    <h3 class="title">Classement</h3>
    <table class="table-custom">
      <thead>
        <tr>
          <th>Joueur</th>
          <th>Points</th>
          <th>Nombre de matchs trouvés</th>
          <th>Nombre de scores trouvés</th>
          <th>Nombre de qualifiés trouvés</th>
          <th>Nombre de premier trouvés</th>
          <th v-for="group in scoreBoardResource.groups" :key="group.id">{{ group.description }}</th>
          <th>Vainqueur trouvé</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="res in scoreBoardResource.results" :key="res.full_name">
          <td>{{ res.full_name }}</td>
          <td>{{ res.points }}</td>
          <td>{{ res.number_match_guess }}</td>
          <td>{{ res.number_score_guess }}</td>
          <td>{{ res.number_qualified_teams_guess }}</td>
          <td>{{ res.number_first_qualified_guess }}</td>
          <td v-for="group in scoreBoardResource.groups" :key="group.id">{{ res.knockout_rounds.find(r => r.group_id === group.id)?.count ?? 0 }}</td>
          <td>{{ res.number_winner_guess }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { ScoreBoardResponse } from '@/client';
import { retrieveScoreBoardApiV1ScoreBoardGet } from '@/client';

const scoreBoardResource = ref<ScoreBoardResponse>({ groups: [], results: [] });

const getScoreBoard = async () => {
  const { data } = await retrieveScoreBoardApiV1ScoreBoardGet();
  if (data) {
    scoreBoardResource.value = data.result;
  }
};

onMounted(getScoreBoard);
</script>

<style scoped lang="css">
.table-score-board {
  grid-column: 1 / -1;
  padding: 0 1.5rem;
}

.title {
  font-size: 2rem;
  font-weight: 600;
  line-height: 1.125;
  text-align: center;
}

.table-custom {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.table-custom th,
.table-custom td {
  border-width: 0 0 1px;
  border-style: solid;
  border-color: #53535321;
  padding: 0.5em 0.75em;
}

.table-custom th {
  color: #363636;
  border-bottom-width: 2px;
}

@media screen and (max-width: 600px) {
  .table-score-board {
    padding: 0;
  }

  .table-custom {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
    font-size: 0.85rem;
  }

  .table-custom th,
  .table-custom td {
    padding: 0.4em 0.5em;
  }

  .table-custom thead th:first-child,
  .table-custom tbody td:first-child {
    position: sticky;
    left: 0;
    background-color: white;
    z-index: 1;
  }

  .table-custom tbody tr:nth-child(even) td:first-child {
    background-color: #fafafa;
  }
}
</style>
