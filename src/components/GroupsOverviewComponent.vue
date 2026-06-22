<template>
  <div class="groups-overview">
    <PageTitle title="Phase de groupes" />
    <div class="groups-grid" v-if="groups.length">
      <router-link
        v-for="group in groups"
        :key="group.id"
        :to="`/groups/${group.code}`"
        class="group-card"
      >
        <span class="group-card__icon">⚽</span>
        <span class="group-card__name">{{ group.description }}</span>
      </router-link>
    </div>
    <p class="empty" v-else>Chargement des groupes…</p>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import useYakStore from '@/store';
import PageTitle from './PageTitle.vue';

const yakStore = useYakStore();

const groupPhase = computed(() => yakStore.allBets?.phases.find((phase) => phase.code === 'GROUP'));

const groups = computed(() => {
  const gp = groupPhase.value;
  if (!gp) return [];
  return yakStore.allBets?.groups.filter((group) => group.phase.id === gp.id) ?? [];
});

onMounted(async () => {
  if (!yakStore.allBets) {
    await yakStore.fetchAllBets();
  }
});
</script>

<style scoped lang="css">
.groups-overview {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 800px;
}

.groups-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 0.75rem;
}

.group-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 1rem;
  border: 1px solid #e9e9e7;
  border-radius: 6px;
  text-decoration: none;
  color: #37352f;
  transition: background-color 0.15s ease, border-color 0.15s ease;
}

.group-card:hover {
  background-color: #f7f6f3;
  border-color: #c7c6c3;
}

.group-card__icon {
  font-size: 1.25rem;
  line-height: 1;
}

.group-card__name {
  font-size: 0.95rem;
  font-weight: 500;
}

.empty {
  color: #9b9a97;
  font-size: 0.9rem;
}
</style>
