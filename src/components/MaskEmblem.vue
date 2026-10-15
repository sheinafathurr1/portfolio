<script setup lang="ts">
import { MASK_PATH, MASK_VIEWBOX } from '../utils/mask'
</script>

<template>
  <!-- Original domino-mask emblem (not a game asset) -->
  <svg class="mask-emblem" :viewBox="`0 0 ${MASK_VIEWBOX.width} ${MASK_VIEWBOX.height}`" aria-hidden="true">
    <path fill="currentColor" fill-rule="evenodd" :d="MASK_PATH" />
  </svg>
</template>

<style scoped>
.mask-emblem {
  display: block;
  width: 100%;
  height: auto;
}
</style>
