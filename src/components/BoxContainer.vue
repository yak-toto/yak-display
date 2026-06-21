<template>
  <div class="box-container">
    <slot />
  </div>
</template>

<style scoped lang="css">
.box-container {
  border: 1px solid #e9e9e7;
  border-radius: 6px;
  color: #37352f;
  display: block;
  padding: 1.25rem;
  width: 100%;
}

@media screen and (max-width: 600px) {
  .box-container {
    padding: 0.875rem;
  }
}
</style>
