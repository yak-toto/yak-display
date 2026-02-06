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

<script setup lang="ts">
import type { GroupPositionOut } from '@/client';

defineProps<{
  groupRank: GroupPositionOut[];
}>();
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
  border-color: var(--color-border);
  text-align: left;
  padding: 0.5em 0.75em;
}

.result-group abbr {
  cursor: help;
}

/* Mobile: make table scrollable and reduce font size */
@media screen and (max-width: 600px) {
  .result-group {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
    font-size: 0.85rem;
    margin-bottom: 1.5rem;
  }

  .result-group th,
  .result-group td {
    padding: 0.4em 0.5em;
  }

  .result-group thead th:first-child,
  .result-group tbody td:first-child {
    position: sticky;
    left: 0;
    background-color: white;
    z-index: 1;
  }

  .result-group tbody tr:nth-child(even) td:first-child {
    background-color: #fafafa;
  }
}
</style>
