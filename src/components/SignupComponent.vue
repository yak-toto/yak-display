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
              <input type="text" class="input is-large"
                id="pseudo" placeholder="pseudo" v-model="name" />
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
              <input type="password" class="input is-large"
                placeholder="mot de passe" v-model="password" />
            </label>
          </div>

          <button class="button is-block is-info is-large is-fullwidth">Créer un compte</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import useYakStore from '@/store';
import api from '@/api';

export default {
  name: 'SignupComponent',
  data() {
    return {
      name: '',
      firstName: '',
      lastName: '',
      password: '',
      invalidSignup: false,
      errorMessage: '',
    };
  },
  methods: {
    signup() {
      api.postSignup({
        name: this.name,
        first_name: this.firstName,
        last_name: this.lastName,
        password: this.password,
      })
        .then((response) => {
          const yakStore = useYakStore();
          yakStore.setJwtToken({ jwt: response.data.result.token });
          yakStore.setUserName({ userName: response.data.result.name });

          this.$router.push('/groups/A');
        })
        .catch((error) => {
          this.invalidSignup = true;
          this.errorMessage = error.response.data.description;

          setTimeout(() => {
            this.invalidSignup = false;
            this.errorMessage = '';
          }, 2000);
        });
    },
  },
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
  box-shadow: 0 2px 3px rgb(10 10 10 / 10%), 0 0 0 1px rgb(10 10 10 / 10%);
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
