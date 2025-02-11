<template>
  <v-text-field
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :label="label"
    :type="type"
    :rules="rules"
    :error-messages="errorMessages"
    variant="outlined"
    class="mb-2"
  ></v-text-field>
</template>

<script setup>
defineProps({
  modelValue: {
    type: [String, Number],
    required: true
  },
  label: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'text'
  },
  rules: {
    type: Array,
    default: () => []
  },
  errorMessages: {
    type: Array,
    default: () => []
  }
});

defineEmits(['update:modelValue']);
</script> 