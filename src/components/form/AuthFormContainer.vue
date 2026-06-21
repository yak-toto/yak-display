<template>
  <div class="auth-page">
    <BoxContainer class="auth-container">
      <h3 class="title">{{ title }}</h3>
      <div class="box">
        <slot />
      </div>
    </BoxContainer>
  </div>
</template>

<script setup lang="ts">
import BoxContainer from '../BoxContainer.vue';

defineProps<{
  title: string;
}>();
</script>

<style scoped lang="css">
.auth-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  padding: 1.5rem 1rem;
  width: 100%;
}

.auth-container {
  border-radius: 12px;
  padding: 2rem;
  width: 100%;
  max-width: 420px;
}

.title {
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1.5rem;
  color: #37352f;
}
</style>
