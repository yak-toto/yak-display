<template>
  <div class="navbar-yaktoto">
    <div class="navbar-left">
      <template v-if="!$route.meta.allowAnonymous">
        <div class="navbar-item-custom">
          Utilisateur:&nbsp;<strong>{{ getUserName() }}</strong>
        </div>
        <template
          v-if="
            getUserName() === 'admin' &&
            !$route.meta.allowAnonymous
          "
        >
          <a @click="computePoints" class="navbar-item-custom clickable"> Calculer les points </a>
          <template v-if="displayStatus">
            <div class="navbar-item-custom success" v-if="pointsComputedProperly">
              Points calculés &#10003;
            </div>
            <div class="navbar-item-custom error" v-else>
              Erreur : les points n'ont pas été calculés &#10005;
            </div>
          </template>
        </template>
      </template>
    </div>
    <div class="navbar-right">
      <router-link
        to="/login"
        class="navbar-item-custom clickable"
        v-if="$route.name === 'signup'"
      >
        Se connecter
      </router-link>
      <router-link
        to="/signup"
        class="navbar-item-custom clickable"
        v-if="$route.name == 'login'"
      >
        Créer un compte
      </router-link>
      <router-link to="/logout" class="navbar-item-custom clickable" v-if="isAuthenticated()">
        Se déconnecter
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'pinia';

import useYakStore from '@/store';

export default {
  name: 'TopNavbar',
  data() {
    return {
      displayStatus: false,
      pointsComputedProperly: false,
    };
  },
  methods: {
    ...mapActions(useYakStore, ['isAuthenticated']),
    ...mapState(useYakStore, ['getUserName']),
    computePoints() {
      const yakStore = useYakStore();

      yakStore.computePoints()
        .then(() => {
          this.pointsComputedProperly = true;
          this.displayStatus = true;

          setTimeout(() => {
            this.displayStatus = false;
            this.pointsComputedProperly = false;
          }, 2000);
        })
        .catch(() => {
          this.pointsComputedProperly = false;
          this.displayStatus = true;

          setTimeout(() => {
            this.displayStatus = false;
            this.pointsComputedProperly = false;
          }, 2000);
        });
    },
  },
};
</script>

<style lang="css">
.navbar-yaktoto {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
}

.navbar-left {
  border-bottom: solid;
  border-width: 1px;
  border-color: #53535321;
  padding: 0.5rem;
  grid-column: 2 / 6;
  text-align: left;
}

.navbar-right {
  border-bottom: solid;
  border-width: 1px;
  border-color: #53535321;
  padding: 0.5rem;
  grid-column: 6 / 8;
  text-align: right;
}

.navbar-item-custom {
  align-items: center;
  padding: 0.5rem 0.75rem;
  color: black;
  display: inline;
  text-decoration: none;
}

.navbar-item-custom.clickable:hover {
  cursor: pointer;
  background-color: #fafafa;
}

.navbar-item-custom.success {
  color: green;
  font-weight: bold;
}

.navbar-item-custom.error {
  color: red;
  font-weight: bold;
}
</style>
