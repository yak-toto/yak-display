<template>
  <div class="navbar-layout">
    <div class="navbar-layout__sidebar">
      <GroupNavbar />
    </div>
    <div class="navbar-layout__content">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import GroupNavbar from './GroupNavbar.vue';
</script>

<style scoped lang="css">
.navbar-layout {
  display: flex;
  flex: 1;
  min-height: calc(100vh - 45px);
}

.navbar-layout__sidebar {
  width: 240px;
  flex-shrink: 0;
  background-color: #f7f6f3;
  border-right: 1px solid #e9e9e7;
  position: sticky;
  top: 45px;
  height: calc(100vh - 45px);
  overflow-y: auto;
}

.navbar-layout__content {
  flex: 1;
  min-width: 0;
  padding: 2rem 2.5rem;
}

@media screen and (max-width: 600px) {
  .navbar-layout {
    flex-direction: column;
  }

  .navbar-layout__sidebar {
    width: 100%;
    height: auto;
    position: static;
    border-right: none;
    border-bottom: 1px solid #e9e9e7;
  }

  .navbar-layout__content {
    padding: 1.25rem 1rem;
  }
}
</style>
