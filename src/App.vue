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

<style lang="css">
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  overflow-x: hidden;
  overflow-y: scroll;
}

body,
button,
input,
select,
textarea {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #37352f;
  background-color: #ffffff;
}

a {
  color: inherit;
  text-decoration: none;
}

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
