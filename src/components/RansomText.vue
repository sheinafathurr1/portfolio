<script setup lang="ts">
import { computed } from 'vue'

// Ransom-note lettering: every character gets its own font, colour block and tilt.
// A seed keeps the look stable between renders (and between visits).
const props = withDefaults(defineProps<{ text: string; seed?: number; size?: string; nowrap?: boolean }>(), {
  seed: 7,
  size: '3rem',
  nowrap: false,
})

const FONTS = ["'Anton'", "'Archivo Black'", "'Abril Fatface'", "'Permanent Marker'", "'Special Elite'", "'Bebas Neue'"]
const LOOKS = [
  { background: '#ffffff', color: '#0b0b0b' },
  { background: '#0b0b0b', color: '#ffffff' },
  { background: '#e60012', color: '#ffffff' },
  { background: '#ffffff', color: '#e60012' },
  { background: '#0b0b0b', color: '#e60012' },
]

function mulberry32(seed: number) {
  let s = seed
  return () => {
    s += 0x6d2b79f5
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Letters are grouped per word so lines break between words, not in the middle of one
const words = computed(() => {
  const rand = mulberry32(props.seed)
  return props.text
    .split(/\s+/)
    .filter(Boolean)
    .map((word) =>
      [...word].map((ch) => {
        const look = LOOKS[Math.floor(rand() * LOOKS.length)] ?? LOOKS[0]!
        return {
          ch,
          style: {
            ...look,
            fontFamily: FONTS[Math.floor(rand() * FONTS.length)],
            transform: `rotate(${((rand() - 0.5) * 16).toFixed(1)}deg) translateY(${((rand() - 0.5) * 0.14).toFixed(2)}em) scale(${(0.88 + rand() * 0.26).toFixed(2)})`,
          },
        }
      }),
    )
})
</script>

<template>
  <span class="ransom" :class="{ 'ransom--nowrap': nowrap }" :style="{ fontSize: size }">
    <span class="sr-only">{{ text }}</span>
    <span v-for="(word, w) in words" :key="w" class="ransom__word" aria-hidden="true">
      <span v-for="(l, i) in word" :key="i" class="ransom__ch" :style="l.style">{{ l.ch }}</span>
    </span>
  </span>
</template>

<style scoped>
.ransom {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.08em 0.37em;
  line-height: 1;
}
/* A word only splits when it can't fit on a line by itself */
.ransom__word {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.05em;
}
.ransom--nowrap,
.ransom--nowrap .ransom__word {
  flex-wrap: nowrap;
}
.ransom__ch {
  display: inline-block;
  padding: 0.07em 0.13em 0.03em;
  text-transform: uppercase;
  box-shadow: 0.06em 0.06em 0 rgba(0, 0, 0, 0.55);
}
</style>
