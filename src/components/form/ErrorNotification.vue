<template>
  <div v-if="show && message" class="notification is-danger">
    {{ message }}
  </div>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean;
  message: string;
}>();
</script>

<style scoped>
.notification {
  padding: 1rem 1.25rem;
  border-radius: var(--border-radius);
  margin-bottom: 1rem;
  animation: slideDown 0.3s ease-out;
}

.notification.is-danger {
  background-color: var(--color-danger-bg);
  border: 1px solid var(--color-danger-border);
  color: var(--color-danger-text);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
