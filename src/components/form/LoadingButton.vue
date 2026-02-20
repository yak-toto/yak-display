<template>
  <button class="button is-block is-info is-large is-fullwidth" :disabled="loading" type="submit">
    <span v-if="loading">
      <SpinnerIcon />
      {{ loadingText }}
    </span>
    <span v-else>{{ text }}</span>
  </button>
</template>

<script setup lang="ts">
import SpinnerIcon from '@/components/icons/SpinnerIcon.vue';

defineProps<{
  loading: boolean;
  text: string;
  loadingText: string;
}>();
</script>

<style scoped lang="css">
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
</style>
