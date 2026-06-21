<template>
  <div class="navbar-yaktoto">
    <div class="navbar-left">
      <template v-if="!$route.meta.allowAnonymous">
        <HomeButton />
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
      <a @click="logout" class="navbar-item-custom clickable" v-if="isAuthenticated()">
        Se déconnecter
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { logoutApiV1UsersLogoutPost } from '@/client';
import { executeRuleApiV1RulesRuleIdPost } from '@/client/sdk.gen';
import router from '@/router';
import useYakStore from '@/store';
import HomeButton from './HomeButton.vue';

const yakStore = useYakStore();

// Reactive data
const displayStatus = ref(false);
const pointsComputedProperly = ref(false);

// Methods
const isAuthenticated = () => yakStore.isAuthenticated();
const getUserName = () => yakStore.getUserName;

const computePoints = async () => {
  try {
    const ruleId = '62d46542-8cf1-4a3b-af77-a5086f10ac59';
    await executeRuleApiV1RulesRuleIdPost({
      path: { rule_id: ruleId },
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

async function logout(): Promise<void> {
  await logoutApiV1UsersLogoutPost();
  useYakStore().eraseAuthState();
  router.push('/login');
}
</script>

<style scoped lang="css">
.navbar-yaktoto {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 45px;
  padding: 0 1rem;
  border-bottom: 1px solid #e9e9e7;
  background-color: #ffffff;
  flex-shrink: 0;
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.navbar-item-custom {
  font-size: 0.875rem;
  color: #37352f;
  padding: 0.35rem 0.65rem;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  text-decoration: none;
}

.navbar-item-custom.clickable {
  cursor: pointer;
}

.navbar-item-custom.clickable:hover {
  background-color: #efefed;
}

.navbar-item-custom.success {
  color: #0f7b0f;
  font-weight: 500;
}

.navbar-item-custom.error {
  color: #d44c47;
  font-weight: 500;
}
</style>
