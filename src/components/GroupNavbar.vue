<template>
  <div class="vertical-menu">
    <h1 v-if="groupPhase">{{ groupPhase.description }}</h1>
    <router-link v-for="group in groups" :key="group.id" :to="`/groups/${group.code}`">
      {{ group.description }}
    </router-link>
    <h1 v-if="finalePhase">{{ finalePhase.description }}</h1>
    <router-link v-if="finalePhase" to="/finale_phase">{{ finalePhase.description }}</router-link>
    <h1>Classement</h1>
    <router-link to="/score_board">Classement</router-link>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { GroupWithPhaseIdOut, PhaseOut } from '@/client';
import { retrieveAllGroupsApiV1GroupsGet } from '@/client';
import useYakStore from '@/store';

const yakStore = useYakStore();

// Reactive data
const groupPhase = ref<PhaseOut | undefined>(undefined);
const finalePhase = ref<PhaseOut | undefined>(undefined);
const groups = ref<GroupWithPhaseIdOut[]>([]);

// Methods
const getGroups = async () => {
  const { data } = await retrieveAllGroupsApiV1GroupsGet({
    headers: { Authorization: `Bearer ${yakStore.jwt}` },
  });
  if (data) {
    groupPhase.value = data.result.phases.find((phase) => phase.code === 'GROUP');
    finalePhase.value = data.result.phases.find((phase) => phase.code === 'FINAL');
    if (groupPhase.value) {
      groups.value = data.result.groups.filter((group) => group.phase.id === groupPhase.value!.id);
    }
  }
};

// Equivalent to created() lifecycle hook
onMounted(getGroups);
</script>

<style lang="css">
.vertical-menu {
  width: 100%;
}

.vertical-menu a {
  cursor: pointer;
  color: black;
  display: block;
  padding: 0.35rem;
  text-decoration: none;
}

.vertical-menu a:hover {
  background-color: #fafafa;
}

.vertical-menu h1 {
  font-size: 1.5rem;
  padding-bottom: 0.35rem;
  padding-top: 0.7rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 0.15em;
}
</style>
