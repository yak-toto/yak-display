<template>
  <h1 class="page-title">{{ title }}</h1>
</template>

<script setup lang="ts">
defineProps<{ title: string }>();
</script>

<style scoped>
.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text);
}
</style>
