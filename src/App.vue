<template>
  <div class="app-root">
    <TopNavbar />
    <div class="app-body">
      <router-view class="app-page" />
    </div>
  </div>
</template>

<script setup lang="ts">
import TopNavbar from '@/components/TopNavbar.vue';
</script>

<style scoped lang="css">
.app-root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-body {
  flex: 1;
  display: flex;
}

.app-page {
  flex: 1;
  min-width: 0;
}
</style>
