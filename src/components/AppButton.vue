<template>
  <button type="button" :disabled="disabled" @click.stop="$emit('click')">
    <span v-if="$slots.before" class="before">
      <slot name="before" />
    </span>
    <slot />
    <span v-if="$slots.after" class="after">
      <slot name="after" />
    </span>
  </button>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean
    }
  },

  emits: ["click"]
};
</script>

<style scoped>
button {
  margin: 0 .75em .75em 0;
  padding: .5em 1em;
  color: #fff;
  background-color: #207;
  border: none;
  cursor: pointer;
}

button:disabled {
  color: #ccc;
  background-color: #555;
  cursor: not-allowed;
}

.before {
  margin-right: .5em;
}

.after {
  margin-left: .5em;
}
</style>
