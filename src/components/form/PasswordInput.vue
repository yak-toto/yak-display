<template>
  <div class="field control">
    <label class="label" :for="inputId">
      {{ label }}
      <div class="password-input-wrapper">
        <input
          :id="inputId"
          :type="showPassword ? 'text' : 'password'"
          :name="name"
          :placeholder="placeholder"
          :value="modelValue"
          @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
          class="input is-large"
        />
        <button
          type="button"
          class="password-toggle"
          @click="showPassword = !showPassword"
          :aria-label="showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
        >
          <EyeIcon :visible="showPassword" />
        </button>
      </div>
    </label>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import EyeIcon from '@/components/icons/EyeIcon.vue';

defineProps<{
  label: string;
  modelValue: string;
  inputId: string;
  name: string;
  placeholder: string;
}>();

defineEmits<{
  'update:modelValue': [value: string];
}>();

const showPassword = ref(false);
</script>

<style scoped>
.label {
  text-align: left;
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-label);
  margin-bottom: 0.5rem;
}

.field {
  text-align: left;
  margin-bottom: 1.25rem;
}

.input {
  width: 100%;
  border: 1px solid var(--color-border-input);
  border-radius: var(--border-radius);
  padding: 0.75rem;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: var(--color-focus);
  box-shadow: 0 0 0 3px var(--color-focus-shadow);
}

.input.is-large {
  font-size: medium;
}

.password-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input-wrapper input {
  padding-right: 3rem;
}

.password-toggle {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
  transition: color 0.2s ease;
}

.password-toggle:hover {
  color: var(--color-text-label);
}

.password-toggle:focus {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
  border-radius: var(--border-radius-sm);
}
</style>
