<script setup lang="ts">
import { computed } from 'vue'
import RansomText from './RansomText.vue'

/** `cta` shows the "send a calling card" button at MAX (pointless when already on that screen). */
const props = defineProps<{ rank: number; max: number; line: string; cta?: boolean }>()
const emit = defineEmits<{ card: []; dismiss: [] }>()
const isMax = computed(() => props.rank >= props.max)
</script>

<template>
  <div class="rankup" :class="{ 'rankup--max': isMax }" role="status" aria-live="polite" @click="emit('dismiss')">
    <div class="rankup__head">
      <RansomText :text="isMax ? 'MAX RANK!' : 'RANK UP!'" :seed="rank * 3 + 1" size="clamp(1.5rem, 4vw, 2.2rem)" nowrap />
    </div>
    <p class="rankup__who">Switch <span>×</span> You · <b>Rank {{ isMax ? 'MAX' : rank }}</b></p>
    <div class="rankup__stars" :aria-label="`Bond rank ${rank} of ${max}`">
      <i v-for="n in max" :key="n" :class="{ on: n <= rank, new: n === rank }"></i>
    </div>
    <p class="rankup__line">{{ line }}</p>
    <p v-if="isMax" class="rankup__max">
      {{ cta ? 'You know Switch inside out. Time to send that calling card?' : 'You know Switch inside out. Now send that calling card!' }}
    </p>
    <button v-if="isMax && cta" class="p5-btn p5-btn--red rankup__btn" @click.stop="emit('card')">Send a calling card ▶</button>
  </div>
</template>

<style scoped>
.rankup {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 70;
  width: min(92vw, 340px);
  padding: 1rem 1.3rem 1.1rem;
  cursor: pointer;
  background: var(--ink);
  border: 3px solid var(--paper);
  clip-path: polygon(0 4%, 100% 0, 98% 100%, 2% 96%);
  box-shadow: 10px 10px 0 var(--red);
}
.rankup--max {
  border-color: var(--red);
}
.rankup__head {
  margin-bottom: 0.5rem;
}
.rankup__who {
  margin: 0 0 0.4rem;
  font-family: var(--font-display);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.rankup__who span {
  color: var(--red);
}
.rankup__who b {
  font-weight: 400;
  color: var(--red);
}
.rankup__stars {
  display: flex;
  gap: 4px;
  margin-bottom: 0.6rem;
}
.rankup__stars i {
  width: 1.1rem;
  height: 1.1rem;
  background: rgba(255, 255, 255, 0.18);
  clip-path: polygon(50% 0, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
}
.rankup__stars i.on {
  background: var(--red);
}
.rankup__stars i.new {
  background: var(--paper);
  animation: starPop 0.6s var(--snap) 0.25s both;
}
.rankup__line {
  margin: 0;
  font-family: var(--font-marker);
  font-size: 1rem;
  line-height: 1.4;
}
.rankup__max {
  margin: 0.5rem 0 0.8rem;
  font-size: 0.9rem;
  color: var(--muted);
}
.rankup__btn {
  font-size: 0.95rem;
}

@keyframes starPop {
  0% { transform: scale(0) rotate(-90deg); }
  70% { transform: scale(1.5) rotate(10deg); }
  100% { transform: scale(1) rotate(0); }
}
</style>
