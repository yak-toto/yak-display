<template>
  <router-link to="/home" class="home-button" title="Accueil">
    <img :src="'/api/v1/competition/logo'" alt="Accueil" class="home-icon" />
  </router-link>
</template>

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

.home-icon {
  width: 1.25rem;
  height: 1.25rem;
  opacity: 0.5;
  transition: opacity 0.2s ease;
}

.home-button.router-link-active .home-icon,
.home-button:hover .home-icon {
  opacity: 1;
}
</style>
