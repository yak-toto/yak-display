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
    @click="handleClick"
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
import { ref } from 'vue';
import SpinnerIcon from '@/components/icons/SpinnerIcon.vue';

const props = defineProps<{
  disabled?: boolean;
  onSubmit: () => Promise<'success' | 'error' | 'info'>;
  statusDuration?: number;
  defaultText: string;
  loadingText?: string;
  successText: string;
  errorText: string;
  infoText: string;
}>();

const loading = ref(false);
const showStatus = ref(false);
const status = ref<'success' | 'error' | 'info' | null>(null);

const handleClick = async () => {
  showStatus.value = false;
  loading.value = true;

  try {
    status.value = await props.onSubmit();
    showStatus.value = true;
    setTimeout(() => {
      showStatus.value = false;
      status.value = null;
    }, props.statusDuration ?? 4000);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped lang="css">
.status-button {
  cursor: pointer;
  padding: 0.5rem 2rem;
  background-color: #363636;
  border: none;
  color: whitesmoke;
  border-radius: 4px;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.status-button:hover:not(:disabled) {
  background-color: #2c2c2c;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.status-button:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.status-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.button-success {
  background-color: #22c55e !important;
  animation: statusPulse 0.3s ease;
}

.button-success:hover {
  background-color: #16a34a !important;
}

.button-error {
  background-color: #ef4444 !important;
  animation: statusPulse 0.3s ease;
}

.button-error:hover {
  background-color: #dc2626 !important;
}

.button-info {
  background-color: #3b82f6 !important;
  animation: statusPulse 0.3s ease;
}

.button-info:hover {
  background-color: #2563eb !important;
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
