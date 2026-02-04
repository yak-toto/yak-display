<template>
  <div class="box-login">
    <h3 class="title">Se connecter</h3>
    <div class="box">
      <form v-on:submit.prevent="login">
        <div class="field control">
          <label class="label" for="pseudo">
            Pseudo
            <input
              type="text"
              class="input is-large"
              id="pseudo"
              name="pseudo"
              placeholder="pseudo"
              v-model="name"
            />
          </label>
        </div>

        <div class="field control">
          <label class="label" for="password">
            Mot de passe
            <div class="password-input-wrapper">
              <input
                :type="showPassword ? 'text' : 'password'"
                class="input is-large"
                name="password"
                placeholder="mot de passe"
                v-model="password"
              />
              <button
                type="button"
                class="password-toggle"
                @click="showPassword = !showPassword"
                :aria-label="showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
              >
                <EyeIcon :visible="showPassword" />
              </button>
            </div>
          </label>
        </div>

        <div class="notification is-danger" v-if="invalidLogin">{{ errorMessage }}</div>

        <button class="button is-block is-info is-large is-fullwidth" :disabled="loading">
          <span v-if="loading">
            <SpinnerIcon />
            Connexion en cours...
          </span>
          <span v-else>Se connecter</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import type { ErrorOut } from '@/client';
import { loginApiV1UsersLoginPost } from '@/client';
import EyeIcon from '@/components/icons/EyeIcon.vue';
import SpinnerIcon from '@/components/icons/SpinnerIcon.vue';
import useYakStore from '@/store';

const router = useRouter();
const yakStore = useYakStore();

// Reactive data
const name = ref('');
const password = ref('');
const invalidLogin = ref(false);
const errorMessage = ref('');
const loading = ref(false);
const showPassword = ref(false);

// Methods
const login = async () => {
  if (loading.value) {
    return;
  }

  loading.value = true;

  const { data, error } = await loginApiV1UsersLoginPost({
    body: {
      name: name.value,
      password: password.value,
    },
  });

  if (data) {
    yakStore.setJwtToken(data.result.access_token);
    yakStore.setUserName(data.result.name);

    router.push('/groups/A');
  } else {
    loading.value = false;
    invalidLogin.value = true;
    errorMessage.value =
      (error as ErrorOut)?.description || 'Une erreur est survenue lors de la connexion';
  }
};
</script>

<style lang="css">
.box-login {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  color: #535353;
  display: block;
  padding: 2rem;
  max-width: 450px;
  width: 100%;
  margin: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.3s ease;
}

.box-login:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.title {
  font-size: 2rem;
  font-weight: 600;
  line-height: 1.125;
  text-align: center;
  margin-bottom: 1.5rem;
  color: #2c2c2c;
}

.label {
  text-align: left;
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4a5568;
  margin-bottom: 0.5rem;
}

.field {
  text-align: left;
  margin-bottom: 1.25rem;
}

.button {
  margin-top: 1rem;
  padding: 0.5rem;
  width: 100%;
  cursor: pointer;
  background-color: #363636;
  color: whitesmoke;
  border-radius: 4px;
  border-color: transparent;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.button:hover:not(:disabled) {
  background-color: #2c2c2c;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.button:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.input {
  width: 100%;
  border: 1px solid #dbdbdb;
  border-radius: 6px;
  padding: 0.75rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: #3273dc;
  box-shadow: 0 0 0 3px rgba(50, 115, 220, 0.1);
}

.input.is-large {
  font-size: medium;
}

.notification {
  padding: 1rem 1.25rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  animation: slideDown 0.3s ease-out;
}

.notification.is-danger {
  background-color: #fef2f2;
  border: 1px solid #fca5a5;
  color: #991b1b;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.password-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input-wrapper input {
  padding-right: 3rem;
}

.password-toggle {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #718096;
  transition: color 0.2s ease;
}

.password-toggle:hover {
  color: #4a5568;
}

.password-toggle:focus {
  outline: 2px solid #3273dc;
  outline-offset: 2px;
  border-radius: 4px;
}
</style>
