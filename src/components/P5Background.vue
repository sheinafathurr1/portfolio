<script setup lang="ts">
withDefaults(defineProps<{ variant?: 'red' | 'black' }>(), { variant: 'black' })
</script>

<template>
  <div class="bg" :class="`bg--${variant}`" aria-hidden="true">
    <div class="bg__rays"></div>
    <div class="bg__dots"></div>
    <div class="bg__slash bg__slash--top"></div>
    <div class="bg__slash bg__slash--bottom"></div>
  </div>
</template>

<style scoped>
.bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}
.bg--red {
  --ray: rgba(0, 0, 0, 0.1);
  --dot: rgba(0, 0, 0, 0.32);
  --slash-top: rgba(0, 0, 0, 0.85);
  --slash-bottom: var(--ink);
  background: radial-gradient(ellipse at 30% 40%, #ff1d2e 0%, var(--red) 45%, var(--red-deep) 100%);
}
.bg--black {
  --ray: rgba(230, 0, 18, 0.07);
  --dot: rgba(230, 0, 18, 0.3);
  --slash-top: rgba(255, 255, 255, 0.05);
  --slash-bottom: rgba(230, 0, 18, 0.9);
  background: radial-gradient(ellipse at 70% 25%, #222 0%, var(--ink) 60%);
}

/* Slowly turning sunburst */
.bg__rays {
  position: absolute;
  left: 30%;
  top: 45%;
  width: 260vmax;
  height: 260vmax;
  margin: -130vmax 0 0 -130vmax;
  background: repeating-conic-gradient(from 0deg, var(--ray) 0deg 7deg, transparent 7deg 15deg);
  animation: p5Spin 120s linear infinite;
}

/* Halftone fading in toward the bottom-right corner */
.bg__dots {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(var(--dot) 1.3px, transparent 1.7px);
  background-size: 10px 10px;
  -webkit-mask-image: linear-gradient(135deg, transparent 45%, #000 90%);
  mask-image: linear-gradient(135deg, transparent 45%, #000 90%);
}

.bg__slash {
  position: absolute;
  left: -30vw;
  width: 160vw;
  transform: rotate(-12deg);
}
.bg__slash--top {
  top: -6%;
  height: 10vh;
  background: var(--slash-top);
}
.bg__slash--bottom {
  top: 86%;
  height: 26vh;
  background: var(--slash-bottom);
}
</style>
