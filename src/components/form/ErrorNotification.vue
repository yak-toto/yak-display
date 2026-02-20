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

<style scoped lang="css">
.notification {
  padding: 1rem 1.25rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  animation: slideDown 0.3s ease-out;
}

.notification.is-danger {
  background-color: #fef2f2;
  border: 1px solid #fca5a5;
  color: #991b1b;
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
