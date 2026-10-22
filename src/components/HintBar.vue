<script setup lang="ts">
import { openOverlay } from '../composables/overlay'
import { sfx, sfxEnabled, toggleSfx } from '../composables/sfx'

defineProps<{ hints: [string, string][] }>()
const isTouch = window.matchMedia('(pointer: coarse)').matches

const open = (id: 'phone' | 'help' | 'search') => {
  sfx.confirm()
  openOverlay(id)
}
</script>

<template>
  <div class="hints">
    <template v-if="!isTouch">
      <span v-for="[key, label] in hints" :key="key" class="hints__item">
        <kbd class="p5-kbd">{{ key }}</kbd>{{ label }}
      </span>
    </template>
    <button class="hints__btn hints__btn--search" aria-label="Search (Third Eye)" title="Search ( / )" @click.stop="open('search')">
      <span aria-hidden="true">◉</span> Search
    </button>
    <button class="hints__btn hints__btn--chat" aria-label="Open Phan-Chat" @click.stop="open('phone')">
      <span aria-hidden="true">📱</span> Chat
    </button>
    <button class="hints__btn" :aria-pressed="sfxEnabled" @click.stop="toggleSfx">
      SFX <strong>{{ sfxEnabled ? 'ON' : 'OFF' }}</strong>
    </button>
    <button class="hints__help" aria-label="Controls and settings" @click.stop="open('help')">?</button>
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
  padding: 0.5rem 1rem 0.5rem 2.2rem;
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
.hints__btn {
  border: 0;
  background: none;
  padding: 0;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #bbb;
}
.hints__btn strong {
  color: var(--red);
}
.hints__btn:hover {
  color: var(--paper);
}
.hints__btn--chat,
.hints__btn--search {
  color: var(--paper);
}
.hints__btn--chat:hover,
.hints__btn--search:hover {
  color: var(--red);
}
.hints__help {
  display: grid;
  place-items: center;
  width: 1.7rem;
  height: 1.7rem;
  border: 0;
  font-family: var(--font-display);
  font-size: 1rem;
  color: var(--ink);
  background: var(--red);
  clip-path: polygon(10% 0, 100% 8%, 90% 100%, 0 92%);
  transition: transform 0.15s var(--snap);
}
.hints__help:hover {
  transform: rotate(-10deg) scale(1.1);
}
@media (max-width: 760px) {
  /* Narrow windows: keep only the buttons */
  .hints__item {
    display: none;
  }
}
</style>
