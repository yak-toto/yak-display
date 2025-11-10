<template>
  <section class="hero is-fullheight">
    <TopNavbar />

    <div class="body-yaktoto">
      <router-view class="body-yaktoto-page" />
    </div>
  </section>
</template>

<script setup>
import TopNavbar from '@/components/TopNavbar.vue';
</script>

<style lang="css">
body {
  color: #4a4a4a;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
}

html {
  box-sizing: border-box;
  background-color: white;
  font-size: 16px;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  min-width: 300px;
  overflow-x: scroll;
  overflow-y: scroll;
  text-rendering: optimizeLegibility;
  -webkit-text-size-adjust: 100%;
  -moz-text-size-adjust: 100%;
  text-size-adjust: 100%;
}

body,
button,
input,
select,
textarea {
  font-family:
    BlinkMacSystemFont,
    -apple-system,
    'Segoe UI',
    'Roboto',
    'Oxygen',
    'Ubuntu',
    'Cantarell',
    'Fira Sans',
    'Droid Sans',
    'Helvetica Neue',
    'Helvetica',
    'Arial',
    sans-serif;
}

.hero {
  align-items: stretch;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.hero.is-fullheight {
  min-height: 100vh;
}

*,
*::before,
*::after {
  box-sizing: inherit;
}

.body-yaktoto {
  flex-grow: 1;
  flex-shrink: 0;
  align-items: center;
  text-align: center !important;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
}

.body-yaktoto-page {
  grid-column: 2 / 8;
}
</style>
