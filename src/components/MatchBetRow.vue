<template>
  <div class="grid-bet">
    <div class="team-bet-1">
      {{ team1Name }}
      <img v-if="team1Flag" :src="team1Flag" :alt="team1Name" class="team-flag" />
    </div>
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
    <div class="team-bet-2">
      <img v-if="team2Flag" :src="team2Flag" :alt="team2Name" class="team-flag" />
      {{ team2Name }}
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  team1Name: string;
  team2Name: string;
  team1Flag?: string;
  team2Flag?: string;
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
  justify-content: flex-end;
  align-items: center;
  gap: 0.4em;
  grid-column: 1 / 3;
}

.input-bet-1 {
  grid-column: 3 / 8;
}

.input-bet-2 {
  grid-column: 8 / 13;
}

.team-bet-2 {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0.4em;
  grid-column: 13 / 15;
}

/* Tablet */
@media screen and (max-width: 900px) {
  .team-bet-1 {
    grid-column: 1 / 5;
  }
  .input-bet-1 {
    grid-column: 5 / 8;
  }
  .input-bet-2 {
    grid-column: 8 / 11;
  }
  .team-bet-2 {
    grid-column: 11 / 15;
  }
}

/* Mobile */
@media screen and (max-width: 600px) {
  .grid-bet {
    grid-template-columns: 1fr auto auto 1fr;
    grid-gap: 8px;
    padding: 0.5rem;
  }

  .team-bet-1 {
    grid-column: 1;
    justify-content: flex-end;
    font-size: 0.9rem;
  }

  .input-bet-1 {
    grid-column: 2;
  }

  .input-bet-2 {
    grid-column: 3;
  }

  .team-bet-2 {
    grid-column: 4;
    justify-content: flex-start;
    font-size: 0.9rem;
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

@media screen and (max-width: 600px) {
  input {
    width: 50px;
    padding: 0.4rem 0.25rem;
    text-align: center;
    font-size: 1rem;
  }
}

.team-flag {
  height: 1.1em;
  width: auto;
  border-radius: 2px;
  border: 1px solid rgb(0 0 0 / 12%);
  flex-shrink: 0;
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
