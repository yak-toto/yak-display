<template>
  <div class="vertical-menu">
    <h1>{{ phase["description"] }}</h1>
    <router-link
      v-for="group in groups"
      :key="group['id']"
      :to="`/groups/${group['code']}`"
    >
      {{ group['description'] }}
    </router-link>
    <h1>Classement</h1>
    <router-link to="/score_board">Classement</router-link>
  </div>
</template>

<script>
export default {
  name: 'GroupNavbar',
  data() {
    return {
      phase: {},
      groups: [],
    };
  },
  methods: {
    getGroupList() {
      this.$store.dispatch('getGroupNames', { phaseName: 'GROUP' })
        .then((res) => {
          this.phase = res.data.result.phase;
          this.groups = res.data.result.groups;
        });
    },
  },
  created() {
    this.getGroupList();
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
