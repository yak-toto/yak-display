<template>
  <div class="content-rules">
    <h1 class="page-title">Règles du jeu</h1>

    <template v-if="rules">
      <BoxContainer v-if="rules.compute_points">
        <h2 class="section-title">Calcul des points</h2>

        <div class="rules-list">
          <div class="rule-item">
            <span class="rule-item__label">Bon résultat (victoire/nul/défaite)</span>
            <span class="rule-item__formula">
              {{ rules.compute_points.base_correct_result }} +
              {{ rules.compute_points.multiplying_factor_correct_result }} × (1 - proportion de joueurs ayant trouvé)
            </span>
          </div>

          <div class="rule-item">
            <span class="rule-item__label">Score exact</span>
            <span class="rule-item__formula">
              {{ rules.compute_points.base_correct_score }} +
              {{ rules.compute_points.multiplying_factor_correct_score }} × (1 - proportion de joueurs ayant trouvé)
            </span>
          </div>

          <div class="rule-item">
            <span class="rule-item__label">Équipe qualifiée en 1re ou 2e place de groupe</span>
            <span class="rule-item__value">{{ rules.compute_points.team_qualified }} pt</span>
          </div>

          <div class="rule-item">
            <span class="rule-item__label">Équipe qualifiée en 1re place de groupe</span>
            <span class="rule-item__value">{{ rules.compute_points.first_team_qualified }} pt</span>
          </div>

          <div class="rule-item" v-for="round in rules.compute_points.knockout_rounds" :key="round.group_code">
            <span class="rule-item__label">Équipe correctement placée en phase éliminatoire (groupe {{ round.group_code }})</span>
            <span class="rule-item__value">{{ round.points_per_team }} pt</span>
          </div>

          <div class="rule-item">
            <span class="rule-item__label">Vainqueur du tournoi</span>
            <span class="rule-item__value">{{ rules.compute_points.winner_points }} pts</span>
          </div>
        </div>
      </BoxContainer>

      <BoxContainer v-if="rules.compute_points" class="formula-box">
        <h2 class="section-title">Formule de bonus rareté</h2>
        <p class="formula-description">
          Pour les résultats et scores exacts, le bonus dépend du nombre de joueurs ayant trouvé la même réponse :
          plus votre pronostic est rare, plus il rapporte.
        </p>
        <div class="formula-examples">
          <div class="formula-example" v-for="ex in rarityExamples(rules.compute_points!)" :key="ex.label">
            <span class="formula-example__label">{{ ex.label }}</span>
            <strong class="formula-example__value">{{ ex.pts }} pts</strong>
          </div>
        </div>
      </BoxContainer>
    </template>

    <BoxContainer v-else-if="loading">
      <p class="loading-text">Chargement des règles…</p>
    </BoxContainer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Rules } from '@/client';
import { retrieveRulesConfigurationApiV1RulesGet } from '@/client';
import BoxContainer from './BoxContainer.vue';

const rules = ref<Rules | null>(null);
const loading = ref(true);

const rarityExamples = (cp: NonNullable<Rules['compute_points']>) => {
  const N = 10; // illustrative total players
  return [1, Math.round(N / 2), N].map((k) => {
    const rarity = (N - k) / (N - 1);
    const pts = cp.base_correct_result + cp.multiplying_factor_correct_result * rarity;
    return {
      label: `Bon résultat trouvé par ${k} joueur${k > 1 ? 's' : ''} sur ${N}`,
      pts: pts.toFixed(1),
    };
  });
};

onMounted(async () => {
  const { data } = await retrieveRulesConfigurationApiV1RulesGet();
  if (data) {
    rules.value = data.result;
  }
  loading.value = false;
});
</script>

<style scoped lang="css">
.content-rules {
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

.section-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: #9b9a97;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  margin-bottom: 1rem;
}

.rules-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.rule-item {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.6rem 0;
  border-bottom: 1px solid #e9e9e7;
  font-size: 0.9rem;
  color: #37352f;
}

.rule-item:last-child {
  border-bottom: none;
}

.rule-item__label {
  flex: 1;
}

.rule-item__value {
  font-weight: 700;
  white-space: nowrap;
}

.rule-item__formula {
  font-size: 0.8rem;
  color: #6b6b6b;
  white-space: nowrap;
}

.formula-box {
  background-color: #f7f6f3;
}

.formula-examples {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.formula-example {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #6b6b6b;
}

.formula-example__label {
  flex: 1;
}

.formula-example__value {
  white-space: nowrap;
  color: #37352f;
}

.formula-description {
  font-size: 0.9rem;
  color: #37352f;
  margin-bottom: 0.75rem;
  line-height: 1.5;
}

.formula-example {
  font-size: 0.85rem;
  color: #6b6b6b;
}

.loading-text {
  font-size: 0.9rem;
  color: #9b9a97;
}
</style>
