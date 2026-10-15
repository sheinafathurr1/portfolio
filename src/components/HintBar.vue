<script setup lang="ts">
import { sfxEnabled, toggleSfx } from '../composables/sfx'

defineProps<{ hints: [string, string][] }>()
const isTouch = window.matchMedia('(pointer: coarse)').matches
</script>

<template>
  <div class="hints">
    <template v-if="!isTouch">
      <span v-for="[key, label] in hints" :key="key" class="hints__item">
        <kbd class="p5-kbd">{{ key }}</kbd>{{ label }}
      </span>
    </template>
    <button class="hints__sfx" :aria-pressed="sfxEnabled" @click.stop="toggleSfx">
      SFX <strong>{{ sfxEnabled ? 'ON' : 'OFF' }}</strong>
    </button>
  </div>
</template>

<style scoped>
.hints {
  position: fixed;
  right: 0;
  bottom: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 1.1rem;
  padding: 0.55rem 1.4rem 0.55rem 2.2rem;
  background: var(--ink);
  clip-path: polygon(0.9rem 0, 100% 0, 100% 100%, 0 100%);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.hints__item {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}
.hints__sfx {
  border: 0;
  background: none;
  padding: 0;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #bbb;
}
.hints__sfx strong {
  color: var(--red);
}
.hints__sfx:hover {
  color: var(--paper);
}
</style>
