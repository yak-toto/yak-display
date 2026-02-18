<template>
  <div class="navbar-layout">
    <div class="navbar-layout__sidebar">
      <GroupNavbar />
    </div>
    <div class="navbar-layout__content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import GroupNavbar from './GroupNavbar.vue';
</script>

<style scoped lang="css">
.navbar-layout {
  display: grid;
  grid-template-columns: minmax(200px, 250px) 1fr;
  grid-gap: 1.5rem;
  align-items: start;
}

.navbar-layout__sidebar {
  grid-column: 1;
  position: sticky;
  top: 2rem;
  align-self: start;
  max-height: calc(100vh - 4rem);
  overflow-y: auto;
}

.navbar-layout__content {
  grid-column: 2;
}

@media screen and (max-width: 600px) {
  .navbar-layout {
    display: block;
  }

  .navbar-layout__sidebar {
    position: static;
    margin-bottom: 1.5rem;
  }
}
</style>
