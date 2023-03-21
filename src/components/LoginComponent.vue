<template>
  <div class="grid-login">
    <div class="box-login">
      <h3 class="title">Se connecter</h3>
      <div class="box">
        <div class="notification is-danger" v-if="invalidLogin">
          Veuillez vérifier vos identifiants et réessayer.
        </div>

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
  </div>
</template>

<script>
import useYakStore from '@/store';
import api from '@/api';

export default {
  name: 'LoginComponent',
  data() {
    return {
      name: '',
      password: '',
      invalidLogin: false,
    };
  },
  methods: {
    login() {
      api.postLogin({ name: this.name, password: this.password })
        .then((response) => {
          const yakStore = useYakStore();
          yakStore.setJwtToken({ jwt: response.data.result.token });
          yakStore.setUserName({ userName: response.data.result.name });

          this.$router.push('/groups/A');
        })
        .catch(() => {
          this.invalidLogin = true;
        });
    },
  },
};
</script>

<style lang="css">
.grid-login {
  /* display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px; */
}

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
