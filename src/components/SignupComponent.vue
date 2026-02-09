<template>
  <AuthFormContainer title="Créer un compte">
    <form v-on:submit.prevent="signup">
      <TextInput
        v-model="name"
        label="Pseudo"
        input-id="pseudo"
        name="pseudo"
        placeholder="pseudo"
      />

      <TextInput
        v-model="firstName"
        label="Prénom"
        input-id="firstName"
        name="firstName"
        placeholder="prénom"
      />

      <TextInput
        v-model="lastName"
        label="Nom de famille"
        input-id="lastName"
        name="lastName"
        placeholder="nom de famille"
      />

      <PasswordInput
        v-model="password"
        label="Mot de passe"
        input-id="password"
        name="password"
        placeholder="mot de passe"
      />

      <ErrorNotification :show="invalidSignup" :message="errorMessage" />

      <LoadingButton
        :loading="loading"
        text="Créer un compte"
        loading-text="Création en cours..."
      />
    </form>
  </AuthFormContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import type { ErrorOut, SignupIn } from '@/client';
import { signupApiV1UsersSignupPost } from '@/client';
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
const firstName = ref('');
const lastName = ref('');
const password = ref('');
const invalidSignup = ref(false);
const errorMessage = ref('');
const loading = ref(false);

const signup = async () => {
  if (loading.value) {
    return;
  }

  loading.value = true;

  const signupData: SignupIn = {
    name: name.value,
    first_name: firstName.value,
    last_name: lastName.value,
    password: password.value,
  };

  const { data, error } = await signupApiV1UsersSignupPost({ body: signupData });

  if (data) {
    yakStore.setLoggedIn(true);
    yakStore.setUserName(data.result.name);

    router.push('/groups/A');
  } else {
    loading.value = false;
    invalidSignup.value = true;
    errorMessage.value =
      (error as ErrorOut)?.description || 'Une erreur est survenue lors de la création du compte';
  }
};
</script>
