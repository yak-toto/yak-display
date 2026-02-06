<template>
  <div class="navbar-yaktoto">
    <div class="navbar-left">
      <template v-if="!$route.meta.allowAnonymous">
        <div class="navbar-item-custom">
          Utilisateur:&nbsp;<strong>{{ getUserName() }}</strong>
        </div>
        <template v-if="getUserName() === 'admin' && !$route.meta.allowAnonymous">
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
      <router-link to="/login" class="navbar-item-custom clickable" v-if="$route.name === 'signup'">
        Se connecter
      </router-link>
      <router-link to="/signup" class="navbar-item-custom clickable" v-if="$route.name == 'login'">
        Créer un compte
      </router-link>
      <router-link to="/logout" class="navbar-item-custom clickable" v-if="isAuthenticated()">
        Se déconnecter
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { executeRuleApiV1RulesRuleIdPost } from '@/client/sdk.gen';
import useYakStore from '@/store';

const yakStore = useYakStore();

// Reactive data
const displayStatus = ref(false);
const pointsComputedProperly = ref(false);

// Methods
const isAuthenticated = () => yakStore.isAuthenticated();
const getUserName = () => yakStore.getUserName;

const computePoints = async () => {
  try {
    const jwt = yakStore.jwt;
    const ruleId = '62d46542-8cf1-4a3b-af77-a5086f10ac59';
    await executeRuleApiV1RulesRuleIdPost({
      path: { rule_id: ruleId },
      headers: { Authorization: `Bearer ${jwt}` },
    });
    pointsComputedProperly.value = true;
    displayStatus.value = true;
    setTimeout(() => {
      displayStatus.value = false;
      pointsComputedProperly.value = false;
    }, 2000);
  } catch (_) {
    pointsComputedProperly.value = false;
    displayStatus.value = true;
    setTimeout(() => {
      displayStatus.value = false;
      pointsComputedProperly.value = false;
    }, 2000);
  }
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
  border-color: var(--color-border);
  padding: 0.5rem;
  grid-column: 2 / 6;
  text-align: left;
}

.navbar-right {
  border-bottom: solid;
  border-width: 1px;
  border-color: var(--color-border);
  padding: 0.5rem;
  grid-column: 6 / 8;
  text-align: right;
}

.navbar-item-custom {
  align-items: center;
  padding: 0.5rem 0.75rem;
  color: var(--color-black);
  display: inline;
  text-decoration: none;
}

.navbar-item-custom.clickable:hover {
  cursor: pointer;
  background-color: var(--color-bg-hover);
}

.navbar-item-custom.success {
  color: var(--color-success-text);
  font-weight: bold;
}

.navbar-item-custom.error {
  color: var(--color-error-text);
  font-weight: bold;
}
</style>
