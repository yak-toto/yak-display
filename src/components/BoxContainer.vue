<template>
  <div class="box-container">
    <slot />
  </div>
</template>

<style scoped>
.box-container {
  border: 1px solid var(--color-border-solid);
  border-radius: var(--border-radius);
  color: var(--color-text);
  display: block;
  padding: 1.25rem;
  width: 100%;
  box-shadow: var(--shadow-md);
  transition: box-shadow 0.3s ease;
}

.box-container:hover {
  box-shadow: var(--shadow-lg);
}

@media screen and (max-width: 600px) {
  .box-container {
    padding: 0.75rem;
    border-radius: var(--border-radius-sm);
  }
}
</style>
