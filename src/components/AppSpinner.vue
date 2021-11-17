<template>
  <span class="spinner" :style="{ fontSize: (size ? `${size}em` : null) }" />
</template>

<script>
export default {
  props: {
    size: {
      type: Number,
      default: null
    }
  }
};
</script>

<style>
.spinner {
  width: 1em;
  height: 1em;
  border: none;
  border-bottom: .04em solid;
  border-radius: 50%;
  display: inline-block;
  opacity: .5;
  animation: spinner linear .5s infinite;
}

@keyframes spinner {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
