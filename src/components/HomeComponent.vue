<template>
  <div class="content-home">
    <h1 class="page-title">Bienvenue, {{ userResult.first_name }}</h1>

    <div class="stats-overview">
      <BoxContainer>
        <div class="stat-highlight">
          <span class="stat-highlight__icon">🏅</span>
          <span class="stat-highlight__value">{{ userResult.rank }} / {{ userResult.number_of_players }}</span>
          <span class="stat-highlight__label">Classement</span>
        </div>
      </BoxContainer>

      <BoxContainer>
        <div class="stat-highlight">
          <span class="stat-highlight__icon">⭐</span>
          <span class="stat-highlight__value">{{ userResult.points }}</span>
          <span class="stat-highlight__label">Points</span>
        </div>
      </BoxContainer>
    </div>

    <BoxContainer>
      <h2 class="section-title">Détail des résultats</h2>
      <div class="stats-grid">
        <div class="stat-item" v-for="stat in stats" :key="stat.label">
          <span class="stat-item-icon">{{ stat.icon }}</span>
          <span class="stat-item-value">{{ stat.value }}</span>
          <span class="stat-item-label">{{ stat.label }}</span>
        </div>
      </div>
    </BoxContainer>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { UserResult } from '@/client';
import { retrieveUserResultsApiV1ResultsGet } from '@/client';
import BoxContainer from './BoxContainer.vue';

const userResult = ref<UserResult>({
  rank: 0,
  number_of_players: 0,
  first_name: '',
  last_name: '',
  full_name: '',
  number_match_guess: 0,
  number_score_guess: 0,
  number_qualified_teams_guess: 0,
  number_first_qualified_guess: 0,
  knockout_rounds: [],
  number_winner_guess: 0,
  points: 0,
});

const stats = computed(() => [
  { label: 'Matchs trouvés', value: userResult.value.number_match_guess, icon: '⚽' },
  { label: 'Scores trouvés', value: userResult.value.number_score_guess, icon: '🎯' },
  { label: 'Qualifiés trouvés', value: userResult.value.number_qualified_teams_guess, icon: '✅' },
  { label: 'Premiers trouvés', value: userResult.value.number_first_qualified_guess, icon: '🥇' },
  ...userResult.value.knockout_rounds.map((round) => ({
    label: round.group.description,
    value: round.count,
    icon: '🏆',
  })),
  { label: 'Vainqueur trouvé', value: userResult.value.number_winner_guess, icon: '👑' },
]);

const getUserResults = async () => {
  const { data } = await retrieveUserResultsApiV1ResultsGet();
  if (data) {
    userResult.value = data.result;
  }
};

onMounted(getUserResults);
</script>

<style scoped lang="css">
.content-home {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 800px;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #37352f;
}

.stats-overview {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media screen and (max-width: 600px) {
  .stats-overview {
    grid-template-columns: 1fr;
  }
}

.stat-highlight {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
  padding: 0.25rem 0;
}

.stat-highlight__icon {
  font-size: 1.25rem;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stat-highlight__value {
  font-size: 2rem;
  font-weight: 700;
  color: #37352f;
  line-height: 1.1;
}

.stat-highlight__label {
  font-size: 0.8rem;
  color: #9b9a97;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: 500;
}

.section-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: #9b9a97;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  margin-bottom: 1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
}

@media screen and (max-width: 600px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.2rem;
  padding: 0.75rem;
  border: 1px solid #e9e9e7;
  border-radius: 6px;
}

.stat-item-icon {
  font-size: 1rem;
  line-height: 1;
}

.stat-item-value {
  font-size: 1.35rem;
  font-weight: 700;
  color: #37352f;
}

.stat-item-label {
  font-size: 0.72rem;
  color: #9b9a97;
}
</style>
