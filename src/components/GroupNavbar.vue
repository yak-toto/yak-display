<template>
  <div class="vertical-menu">
    <div v-if="groupPhase" class="section">
      <h1 @click="toggleSection('groups')" class="section-header">
        <span class="chevron" :class="{ expanded: sections.groups }">▶</span>
        {{ groupPhase.description }}
      </h1>
      <transition name="slide">
        <div v-show="sections.groups" class="section-content">
          <router-link v-for="group in groups" :key="group.id" :to="`/groups/${group.code}`">
            {{ group.description }}
          </router-link>
        </div>
      </transition>
    </div>

    <div v-if="finalePhase" class="section">
      <h1 @click="toggleSection('finale')" class="section-header">
        <span class="chevron" :class="{ expanded: sections.finale }">▶</span>
        {{ finalePhase.description }}
      </h1>
      <transition name="slide">
        <div v-show="sections.finale" class="section-content">
          <router-link to="/finale_phase">{{ finalePhase.description }}</router-link>
        </div>
      </transition>
    </div>

    <div class="section">
      <h1 @click="toggleSection('classement')" class="section-header">
        <span class="chevron" :class="{ expanded: sections.classement }">▶</span>
        Classement
      </h1>
      <transition name="slide">
        <div v-show="sections.classement" class="section-content">
          <router-link to="/score_board">Classement</router-link>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import type { GroupWithPhaseIdOut, PhaseOut } from '@/client';
import { retrieveAllGroupsApiV1GroupsGet } from '@/client';
import useYakStore from '@/store';

const yakStore = useYakStore();

// Reactive data
const groupPhase = ref<PhaseOut | undefined>(undefined);
const finalePhase = ref<PhaseOut | undefined>(undefined);
const groups = ref<GroupWithPhaseIdOut[]>([]);

// Section collapse state - all collapsed by default
const sections = reactive({
  groups: false,
  finale: false,
  classement: false,
});

// Toggle section visibility
const toggleSection = (section: keyof typeof sections) => {
  sections[section] = !sections[section];
};

// Methods
const getGroups = async () => {
  const { data } = await retrieveAllGroupsApiV1GroupsGet({
    headers: { Authorization: `Bearer ${yakStore.jwt}` },
  });
  if (data) {
    groupPhase.value = data.result.phases.find((phase) => phase.code === 'GROUP');
    finalePhase.value = data.result.phases.find((phase) => phase.code === 'FINAL');
    if (groupPhase.value) {
      groups.value = data.result.groups.filter((group) => group.phase.id === groupPhase.value?.id);
    }
  }
};

// Equivalent to created() lifecycle hook
onMounted(getGroups);
</script>

<style lang="css">
.vertical-menu {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 2rem;
}

.section {
  display: flex;
  flex-direction: column;
}

.section:first-child .section-header {
  margin-top: 0;
}

.section-header {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #999;
  margin-top: 0.5rem;
  margin-bottom: 0;
  padding: 0.5rem 1.25rem;
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.2s ease;
  border-radius: 6px;
}

.section-header:hover {
  color: #666;
  background-color: #f5f5f5;
}

.chevron {
  font-size: 0.6rem;
  color: #999;
  transition: transform 0.2s ease;
  display: inline-block;
}

.chevron.expanded {
  transform: rotate(90deg);
}

.section-content {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  padding-top: 0.5rem;
}

.vertical-menu a {
  cursor: pointer;
  color: var(--color-black);
  display: block;
  padding: 0.65rem 1rem;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  border: 2px solid transparent;
  position: relative;
}

.vertical-menu a:hover {
  background-color: var(--color-bg-hover);
}

.vertical-menu a.router-link-active {
  background-color: #f0f7ff;
  color: #1a1a1a;
  font-weight: 600;
  border: 2px solid #4a90e2;
  box-shadow: 0 2px 8px rgba(74, 144, 226, 0.15);
}

/* Slide transition */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
  max-height: 1000px;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
