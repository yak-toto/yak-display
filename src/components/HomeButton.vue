<template>
  <router-link to="/home" class="home-button" title="Accueil">
    <HomeIcon class="home-icon" />
  </router-link>
</template>

<script setup lang="ts">
import HomeIcon from './icons/HomeIcon.vue';
</script>

<style scoped lang="css">
.home-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.4rem;
  border-radius: 6px;
  color: #4a4a4a;
  text-decoration: none;
  transition: background-color 0.2s ease, color 0.2s ease;
  vertical-align: middle;
}

.home-button:hover {
  background-color: #f0f0f0;
  color: #1a1a1a;
}

.home-button.router-link-active {
  color: #4a90e2;
}

.home-icon {
  width: 1.25rem;
  height: 1.25rem;
}
</style>
