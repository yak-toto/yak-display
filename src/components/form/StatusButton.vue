<template>
  <button
    type="submit"
    class="status-button"
    :class="{
      'button-success': showStatus && status === 'success',
      'button-error': showStatus && status === 'error',
      'button-info': showStatus && status === 'info',
    }"
    :disabled="disabled || loading"
  >
    <template v-if="loading">
      <SpinnerIcon />
      {{ loadingText }}
    </template>
    <template v-else-if="showStatus && status === 'success'">
      ✓ {{ successText }}
    </template>
    <template v-else-if="showStatus && status === 'error'">
      ✗ {{ errorText }}
    </template>
    <template v-else-if="showStatus && status === 'info'">
      ✓ {{ infoText }}
    </template>
    <template v-else>
      {{ defaultText }}
    </template>
  </button>
</template>

<script setup lang="ts">
import SpinnerIcon from '@/components/icons/SpinnerIcon.vue';

defineProps<{
  disabled: boolean;
  loading?: boolean;
  showStatus: boolean;
  status?: 'success' | 'error' | 'info' | null;
  defaultText: string;
  loadingText?: string;
  successText: string;
  errorText: string;
  infoText: string;
}>();
</script>

<style scoped>
.status-button {
  cursor: pointer;
  padding: 0.5rem 2rem;
  background-color: var(--color-primary);
  border: none;
  color: var(--color-text-light);
  border-radius: var(--border-radius-sm);
  font-size: 1rem;
  transition: all 0.2s ease;
}

.status-button:hover:not(:disabled) {
  background-color: var(--color-primary-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.status-button:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}

.status-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.button-success {
  background-color: var(--color-success) !important;
  animation: statusPulse 0.3s ease;
}

.button-success:hover {
  background-color: var(--color-success-hover) !important;
}

.button-error {
  background-color: var(--color-error) !important;
  animation: statusPulse 0.3s ease;
}

.button-error:hover {
  background-color: var(--color-error-hover) !important;
}

.button-info {
  background-color: var(--color-info) !important;
  animation: statusPulse 0.3s ease;
}

.button-info:hover {
  background-color: var(--color-info-hover) !important;
}

@keyframes statusPulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

@media screen and (max-width: 600px) {
  .status-button {
    width: 100%;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  }
}
</style>
