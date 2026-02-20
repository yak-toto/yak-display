<template>
  <div class="field control">
    <label class="label" :for="inputId">
      {{ label }}
      <input
        :id="inputId"
        :type="type"
        :name="name"
        :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        class="input is-large"
      />
    </label>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  modelValue: string;
  inputId: string;
  name: string;
  placeholder: string;
  type?: string;
}>();

defineEmits<{
  'update:modelValue': [value: string];
}>();
</script>

<style scoped lang="css">
.label {
  text-align: left;
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4a5568;
  margin-bottom: 0.5rem;
}

.field {
  text-align: left;
  margin-bottom: 1.25rem;
}

.input {
  width: 100%;
  border: 1px solid #dbdbdb;
  border-radius: 6px;
  padding: 0.75rem;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: #3273dc;
  box-shadow: 0 0 0 3px rgba(50, 115, 220, 0.1);
}

.input.is-large {
  font-size: medium;
}
</style>
