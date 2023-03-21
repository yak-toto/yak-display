<template>
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
</template>

<script>
export default {
  name: 'GroupRank',
  props: {
    groupRank: Array,
  },
};
</script>

<style>
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
</style>
