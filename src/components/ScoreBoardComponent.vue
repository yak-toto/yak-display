<template>
  <div class="table-score-board">
      <h3 class="title">Classement</h3>
      <div class="box-score-board">
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
        </table>
      </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { ScoreBoardResponse } from '@/client';
import { retrieveScoreBoardApiV1ScoreBoardGet } from '@/client';

// Reactive data
const scoreBoardResource = ref<ScoreBoardResponse>({ groups: [], results: [] });

// Methods
const getScoreBoard = async () => {
  const { data } = await retrieveScoreBoardApiV1ScoreBoardGet();
  if (data) {
    scoreBoardResource.value = data.result;
  }
};

// Equivalent to created() lifecycle hook
onMounted(getScoreBoard);
</script>

<style scoped lang="css">

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

@media screen and (max-width: 600px) {
  .box-score-board {
    overflow-x: auto;
    white-space: nowrap;
    font-size: 0.85rem;
    padding: 0.75rem;
  }

  .table-custom th,
  .table-custom td {
    padding: 0.4em 0.5em;
  }
}
</style>
