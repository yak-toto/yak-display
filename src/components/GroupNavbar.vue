<template>
  <div class="vertical-menu">
    <h1>Groupes</h1>
    <router-link
      v-for="groupName in groupsNames"
      :key="groupName['id']"
      :to="`/groups/${groupName['code']}`"
    >
      {{ groupName['description'] }}
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
      groupsNames: [],
    };
  },
  methods: {
    getGroupList() {
      this.$store.dispatch('getGroupNames', { phaseName: 'GROUP' })
        .then((res) => {
          this.groupsNames = res.data.result;
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
