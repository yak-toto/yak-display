<template>
  <div class="grid-home">
    <div class="navbar-home">
      <GroupNavbar />
    </div>
    <div class="content-home">
      <h3 class="title">Bienvenue, {{ userResult.first_name }}</h3>

      <div class="stats-overview">
        <BoxContainer>
          <div class="stat-highlight">
            <span class="stat-label">Classement</span>
            <span class="stat-value">{{ userResult.rank }}</span>
          </div>
        </BoxContainer>

        <BoxContainer>
          <div class="stat-highlight">
            <span class="stat-label">Points</span>
            <span class="stat-value">{{ userResult.points }}</span>
          </div>
        </BoxContainer>
      </div>

      <BoxContainer>
        <h4 class="section-title">Détail des résultats</h4>
        <div class="stats-grid">
          <div class="stat-item" v-for="stat in stats" :key="stat.label">
            <span class="stat-item-value">{{ stat.value }}</span>
            <span class="stat-item-label">{{ stat.label }}</span>
          </div>
        </div>
      </BoxContainer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { UserResult } from '@/client';
import { retrieveUserResultsApiV1ResultsGet } from '@/client';
import BoxContainer from './BoxContainer.vue';
import GroupNavbar from './GroupNavbar.vue';

const userResult = ref<UserResult>({
  rank: 0,
  first_name: '',
  last_name: '',
  full_name: '',
  number_match_guess: 0,
  number_score_guess: 0,
  number_qualified_teams_guess: 0,
  number_first_qualified_guess: 0,
  number_quarter_final_guess: 0,
  number_semi_final_guess: 0,
  number_final_guess: 0,
  number_winner_guess: 0,
  points: 0,
});

const stats = computed(() => [
  { label: 'Matchs trouvés', value: userResult.value.number_match_guess },
  { label: 'Scores trouvés', value: userResult.value.number_score_guess },
  { label: 'Qualifiés trouvés', value: userResult.value.number_qualified_teams_guess },
  { label: 'Premiers trouvés', value: userResult.value.number_first_qualified_guess },
  { label: 'Quart de finalistes', value: userResult.value.number_quarter_final_guess },
  { label: 'Demi-finalistes', value: userResult.value.number_semi_final_guess },
  { label: 'Finalistes', value: userResult.value.number_final_guess },
  { label: 'Vainqueur trouvé', value: userResult.value.number_winner_guess },
]);

const getUserResults = async () => {
  const { data } = await retrieveUserResultsApiV1ResultsGet();
  if (data) {
    userResult.value = data.result;
  }
};

onMounted(getUserResults);
</script>

<style lang="css">
.grid-home {
  display: grid;
  grid-template-columns: minmax(200px, 250px) 1fr;
  grid-gap: 1.5rem;
  align-items: start;
}

@media screen and (max-width: 600px) {
  .grid-home {
    display: block;
  }

  .navbar-home {
    position: static;
    margin-bottom: 1.5rem;
  }
}

.navbar-home {
  grid-column: 1;
  position: sticky;
  top: 2rem;
  align-self: start;
  max-height: calc(100vh - 4rem);
  overflow-y: auto;
}

.content-home {
  grid-column: 2;
}

.stats-overview {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

@media screen and (max-width: 600px) {
  .stats-overview {
    grid-template-columns: 1fr;
  }
}

.stat-highlight {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0;
}

.stat-label {
  font-size: 0.875rem;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a1a1a;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #363636;
  margin-bottom: 1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

@media screen and (max-width: 600px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.75rem 0.5rem;
  border-radius: 6px;
  background-color: #fafafa;
}

.stat-item-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
}

.stat-item-label {
  font-size: 0.75rem;
  color: #666;
  text-align: center;
}
</style>
