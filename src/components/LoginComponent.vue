<template>
  <div class="box-login">
    <h3 class="title">Se connecter</h3>
    <div class="box">
      <div class="notification is-danger" v-if="invalidLogin">{{ errorMessage }}</div>

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
            <input
              type="password"
              class="input is-large"
              name="password"
              placeholder="mot de passe"
              v-model="password"
            />
          </label>
        </div>

        <button class="button is-block is-info is-large is-fullwidth">Se connecter</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import useYakStore from '@/store';
import api from '@/api';

const router = useRouter();
const yakStore = useYakStore();

// Reactive data
const name = ref('');
const password = ref('');
const invalidLogin = ref(false);
const errorMessage = ref('');

// Methods
const login = () => {
  api
    .postLogin({ name: name.value, password: password.value })
    .then((response) => {
      yakStore.setJwtToken({ jwt: response.data.result.access_token });
      yakStore.setUserName({ userName: response.data.result.name });

      router.push('/groups/A');
    })
    .catch((error) => {
      invalidLogin.value = true;
      errorMessage.value = error.response.data.description;

      setTimeout(() => {
        invalidLogin.value = false;
        errorMessage.value = '';
      }, 2000);
    });
};
</script>

<style lang="css">
.box-login {
  border: solid;
  border-width: 1px;
  border-color: #53535321;
  border-radius: 6px;
  color: #535353;
  display: block;
  padding: 1.25rem;
  width: 450px;
  margin: auto;
}

.title {
  font-size: 2rem;
  font-weight: 600;
  line-height: 1.125;
  text-align: center;
}

.label {
  text-align: left;
}

.field {
  text-align: left;
  font-size: large;
  padding: 0.5rem 0rem;
}

.button {
  margin-top: 1rem;
  padding: 0.5rem;
  font-size: large;
  width: 100%;
  cursor: pointer;
  background-color: #363636;
  color: whitesmoke;
  border-radius: 4px;
  border-color: transparent;
  font-size: 1rem;
}

.input {
  width: 100%;
}

.input.is-large {
  font-size: medium;
}
</style>
