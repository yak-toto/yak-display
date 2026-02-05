<template>
  <div class="grid-bet">
    <div class="team-bet-1">{{ team1Name }}</div>
    <div class="input-bet-1">
      <input
        min="0"
        type="number"
        :value="team1Score"
        @input="updateTeam1Score"
        :readonly="locked"
      />
    </div>
    <div class="input-bet-2">
      <input
        min="0"
        type="number"
        :value="team2Score"
        @input="updateTeam2Score"
        :readonly="locked"
      />
    </div>
    <div class="team-bet-2">{{ team2Name }}</div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  team1Name: string;
  team2Name: string;
  team1Score: number | null | undefined;
  team2Score: number | null | undefined;
  locked: boolean;
}>();

const emit = defineEmits<{
  'update:team1Score': [score: number | null];
  'update:team2Score': [score: number | null];
}>();

const updateTeam1Score = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = target.value;
  const score = value === '' ? null : Number.parseInt(value, 10);
  emit('update:team1Score', score);
};

const updateTeam2Score = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = target.value;
  const score = value === '' ? null : Number.parseInt(value, 10);
  emit('update:team2Score', score);
};
</script>

<style scoped>
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
  .team-bet-1 {
    grid-column: 1 / 5;
  }
  .input-bet-1 {
    grid-column: 5 / 8;
  }
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
  .input-bet-2 {
    grid-column: 8 / 11;
  }
  .team-bet-2 {
    grid-column: 11 / 15;
  }
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
  background-color: #f5f5f5;
  border-width: 1px;
  border-color: #e0e0e0;
  border-style: solid;
  color: #999;
}
</style>
