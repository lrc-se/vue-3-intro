<template>
  <input type="text" :value="modelValue" @input="updateValue">
</template>

<script>
// Vue 2 component options format, for variety
export default {
  props: {
    modelValue: {
      type: Number,
      default: null
    }
  },

  emits: ["update:modelValue"],

  methods: {
    updateValue(e) {
      const value = parseFloat(e.target.value);
      this.$emit("update:modelValue", !isNaN(value) ? value : null);
    }
  }
};
</script>
