<template>
  <router-link to="/home" class="home-button" title="Accueil">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="home-icon"
    >
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
      <polyline points="9 21 9 12 15 12 15 21" />
    </svg>
  </router-link>
</template>

<style scoped>
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
