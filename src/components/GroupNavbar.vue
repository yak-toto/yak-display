<template>
  <div class="vertical-menu">
    <h1>{{ groupPhase.description }}</h1>
    <router-link v-for="group in groups" :key="group.id" :to="`/groups/${group.code}`">
      {{ group.description }}
    </router-link>
    <h1>{{ finalePhase.description }}</h1>
    <router-link to="/finale_phase">{{ finalePhase.description }}</router-link>
    <h1>Classement</h1>
    <router-link to="/score_board">Classement</router-link>
  </div>
</template>

<script>
import useYakStore from '@/store';
import { ref } from 'vue';

export default {
  name: 'GroupNavbar',
  setup() {
    return {
      yakStore: useYakStore(),
      groupPhase: ref({}),
      finalePhase: ref({}),
      groups: ref([]),
    };
  },
  methods: {
    getGroups() {
      this.yakStore.getGroups().then((response) => {
        this.groupPhase = response.data.result.phases.find((phase) => phase.code === 'GROUP');
        this.finalePhase = response.data.result.phases.find((phase) => phase.code === 'FINAL');
        this.groups = response.data.result.groups.filter(
          (group) => group.phase.id === this.groupPhase.id,
        );
      });
    },
  },
  created() {
    this.getGroups();
  },
};
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
