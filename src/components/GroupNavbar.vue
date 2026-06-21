<template>
  <nav class="vertical-menu">
    <router-link to="/home" class="nav-link">🏠 Accueil</router-link>

    <div class="nav-link--toggle">
      <router-link to="/groups" class="nav-link--toggle-label">⚽ Phase de groupes</router-link>
      <button type="button" class="chevron-btn" @click="toggleGroups">
        <span class="chevron" :class="{ open: groupsOpen }">›</span>
      </button>
    </div>

    <div v-if="groupsOpen" class="nav-submenu">
      <router-link
        v-for="group in groups"
        :key="group.id"
        :to="`/groups/${group.code}`"
        class="nav-link nav-link--sub"
      >
        {{ group.description }}
      </router-link>
    </div>

    <router-link to="/finale_phase" class="nav-link">🏆 Phase finale</router-link>
    <router-link to="/score_board" class="nav-link">📊 Classement</router-link>
  </nav>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import useYakStore from '@/store';

const yakStore = useYakStore();
const route = useRoute();

const isOnGroupDetailRoute = () => route.path.startsWith('/groups/');

const groupsOpen = ref(isOnGroupDetailRoute());

const toggleGroups = () => {
  groupsOpen.value = !groupsOpen.value;
};

watch(
  () => route.path,
  (path) => {
    if (path.startsWith('/groups/')) {
      groupsOpen.value = true;
    }
  },
);

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
.vertical-menu {
  display: flex;
  flex-direction: column;
  padding: 0.75rem 0.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  font-size: 0.9rem;
  color: #37352f;
  text-decoration: none;
  border-radius: 4px;
  border-left: 3px solid transparent;
  margin-bottom: 0.125rem;
  transition: background-color 0.15s ease;
}

.nav-link:hover {
  background-color: #efefed;
}

.nav-link.router-link-active {
  border-left-color: #37352f;
  font-weight: 500;
  background-color: #efefed;
}

.nav-link--toggle {
  display: flex;
  align-items: center;
  padding: 0;
  cursor: default;
  margin-bottom: 0.125rem;
}

.nav-link--toggle-label {
  flex: 1;
  padding: 0.5rem 0.75rem;
  font-size: 0.9rem;
  color: #37352f;
  text-decoration: none;
  border-radius: 4px 0 0 4px;
}

.nav-link--toggle-label:hover {
  background-color: #efefed;
}

.nav-link--toggle-label.router-link-active {
  font-weight: 500;
}

.chevron-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem 0.5rem;
  display: flex;
  align-items: center;
  border-radius: 0 4px 4px 0;
  color: #9b9a97;
}

.chevron-btn:hover {
  background-color: #efefed;
}

.chevron {
  font-size: 1rem;
  color: #9b9a97;
  transition: transform 0.2s ease;
  display: inline-block;
  line-height: 1;
}

.chevron.open {
  transform: rotate(90deg);
}

.nav-submenu {
  display: flex;
  flex-direction: column;
  margin-bottom: 0.125rem;
}

.nav-link--sub {
  font-size: 0.82rem;
  padding-left: 1.75rem;
  color: #6b6b6b;
}

.nav-link--sub.router-link-active {
  color: #37352f;
}
</style>
