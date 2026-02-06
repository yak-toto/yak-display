<template>
  <div class="box-container">
    <slot />
  </div>
</template>

<style scoped>
.box-container {
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  color: #535353;
  display: block;
  padding: 1.25rem;
  width: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.3s ease;
}

.box-container:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}
</style>
