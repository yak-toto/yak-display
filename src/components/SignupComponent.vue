<template>
  <div class="grid-signup">
    <div class="box-signup">
      <h3 class="title">Créer un compte</h3>
      <div class="box-signup-form">
        <div class="notification is-danger" v-if="invalidSignup">{{ errorMessage }}</div>

        <form v-on:submit.prevent="signup">
          <div class="field control">
            <label class="label" for="pseudo">
              Pseudo
              <input
                type="text"
                class="input is-large"
                id="pseudo"
                placeholder="pseudo"
                v-model="name"
              />
            </label>
          </div>

          <div class="field control">
            <label class="label" for="firstName">
              Prénom
              <input
                type="text"
                class="input is-large"
                id="firstName"
                placeholder="prénom"
                v-model="firstName"
              />
            </label>
          </div>

          <div class="field control">
            <label class="label" for="lastName">
              Nom de famille
              <input
                type="text"
                class="input is-large"
                id="lastName"
                placeholder="nom de famille"
                v-model="lastName"
              />
            </label>
          </div>

          <div class="field control">
            <label class="label" for="password">
              Mot de passe
              <input
                type="password"
                class="input is-large"
                placeholder="mot de passe"
                v-model="password"
              />
            </label>
          </div>

          <button class="button is-block is-info is-large is-fullwidth">Créer un compte</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import useYakStore from '@/store';
import api from '@/api';

const router = useRouter();
const yakStore = useYakStore();

// Reactive data
const name = ref('');
const firstName = ref('');
const lastName = ref('');
const password = ref('');
const invalidSignup = ref(false);
const errorMessage = ref('');

// Methods
const signup = () => {
  api
    .postSignup({
      name: name.value,
      first_name: firstName.value,
      last_name: lastName.value,
      password: password.value,
    })
    .then((response) => {
      yakStore.setJwtToken({ jwt: response.data.result.access_token });
      yakStore.setUserName({ userName: response.data.result.name });

      router.push('/groups/A');
    })
    .catch((error) => {
      invalidSignup.value = true;
      errorMessage.value = error.response.data.description;

      setTimeout(() => {
        invalidSignup.value = false;
        errorMessage.value = '';
      }, 2000);
    });
};
</script>

<style lang="css">
.grid-signup {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
}

.box-signup {
  grid-column: 2;
}

.box-signup-form {
  background-color: white;
  border-radius: 6px;
  box-shadow:
    0 2px 3px rgb(10 10 10 / 10%),
    0 0 0 1px rgb(10 10 10 / 10%);
  color: #4a4a4a;
  display: block;
  padding: 1.25rem;
}

.button-signup {
  border-width: 1px;
  cursor: pointer;
  text-align: center;
  white-space: nowrap;
}
</style>
