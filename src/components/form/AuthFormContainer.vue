<template>
  <div class="auth-container">
    <h3 class="title">{{ title }}</h3>
    <div class="box">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>

<style scoped>
.auth-container {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  color: #535353;
  display: block;
  padding: 2rem;
  max-width: 450px;
  width: 100%;
  margin: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.3s ease;
}

.auth-container:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.title {
  font-size: 2rem;
  font-weight: 600;
  line-height: 1.125;
  text-align: center;
  margin-bottom: 1.5rem;
  color: #2c2c2c;
}
</style>
