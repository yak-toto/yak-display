<template>
  <AuthFormContainer title="Se connecter">
    <form v-on:submit.prevent="login">
      <TextInput
        v-model="name"
        label="Pseudo"
        input-id="pseudo"
        name="pseudo"
        placeholder="pseudo"
      />

      <PasswordInput
        v-model="password"
        label="Mot de passe"
        input-id="password"
        name="password"
        placeholder="mot de passe"
      />

      <ErrorNotification :show="invalidLogin" :message="errorMessage" />

      <LoadingButton
        :loading="loading"
        text="Se connecter"
        loading-text="Connexion en cours..."
      />
    </form>
  </AuthFormContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import type { ErrorOut } from '@/client';
import { loginApiV1UsersLoginPost } from '@/client';
import AuthFormContainer from '@/components/form/AuthFormContainer.vue';
import ErrorNotification from '@/components/form/ErrorNotification.vue';
import LoadingButton from '@/components/form/LoadingButton.vue';
import PasswordInput from '@/components/form/PasswordInput.vue';
import TextInput from '@/components/form/TextInput.vue';
import useYakStore from '@/store';

const router = useRouter();
const yakStore = useYakStore();

// Reactive data
const name = ref('');
const password = ref('');
const invalidLogin = ref(false);
const errorMessage = ref('');
const loading = ref(false);

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

