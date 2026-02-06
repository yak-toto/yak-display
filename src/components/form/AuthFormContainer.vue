<template>
  <BoxContainer class="auth-container">
    <h3 class="title">{{ title }}</h3>
    <div class="box">
      <slot />
    </div>
  </BoxContainer>
</template>

<script setup lang="ts">
import BoxContainer from '../BoxContainer.vue';

defineProps<{
  title: string;
}>();
</script>

<style scoped>
.auth-container {
  border-radius: 12px;
  padding: 2rem;
  max-width: 450px;
  margin: auto;
}

.title {
  font-size: 2rem;
  font-weight: 600;
  line-height: 1.125;
  text-align: center;
  margin-bottom: 1.5rem;
  color: var(--color-text-dark);
}
</style>
