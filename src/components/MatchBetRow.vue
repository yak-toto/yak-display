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

<style scoped lang="css">
.grid-bet {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.25rem;
}

.team-bet-1 {
  flex: 1;
  min-width: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.4em;
  font-size: 0.9rem;
  text-align: right;
  word-break: break-word;
  overflow-wrap: break-word;
}

.input-bet-1,
.input-bet-2 {
  flex: 0 0 52px;
}

.team-bet-2 {
  flex: 1;
  min-width: 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0.4em;
  font-size: 0.9rem;
  word-break: break-word;
  overflow-wrap: break-word;
}

@media screen and (max-width: 600px) {
  .team-bet-1,
  .team-bet-2 {
    font-size: 0.82rem;
  }

  .input-bet-1,
  .input-bet-2 {
    flex: 0 0 44px;
  }
}

input {
  width: 100%;
  padding: 0.4rem 0.25rem;
  border-radius: 4px;
  border: 1px solid #e9e9e7;
  font-family: inherit;
  font-size: 0.95rem;
  color: #37352f;
  background-color: #ffffff;
  text-align: center;
  outline: none;
  transition: border-color 0.15s ease;
}

input:focus {
  border-color: #37352f;
}

.team-flag {
  height: 1.1em;
  width: auto;
  border-radius: 2px;
  border: 1px solid rgb(0 0 0 / 10%);
  flex-shrink: 0;
}

input:read-only {
  cursor: not-allowed;
  background-color: #f7f6f3;
  border-color: #e9e9e7;
  color: #9b9a97;
}
</style>
