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

<style scoped>
.button {
  margin-top: 1rem;
  padding: 0.5rem;
  width: 100%;
  cursor: pointer;
  background-color: var(--color-primary);
  color: var(--color-text-light);
  border-radius: var(--border-radius-sm);
  border-color: transparent;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.button:hover:not(:disabled) {
  background-color: var(--color-primary-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.button:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}

.button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
