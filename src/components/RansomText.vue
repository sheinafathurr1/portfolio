<script setup lang="ts">
import { computed } from 'vue'
import { ransomWords } from '../utils/ransom'

// Ransom-note lettering (see utils/ransom.ts). A seed keeps the look stable between renders and visits.
const props = withDefaults(defineProps<{ text: string; seed?: number; size?: string; nowrap?: boolean }>(), {
  seed: 7,
  size: '3rem',
  nowrap: false,
})

// Letters are grouped per word so lines break between words, not in the middle of one
const words = computed(() =>
  ransomWords(props.text, props.seed).map((word) =>
    word.map((l) => ({
      ch: l.ch,
      style: {
        background: l.background,
        color: l.color,
        fontFamily: l.font,
        transform: `rotate(${l.rotate}deg) translateY(${l.shiftY}em) scale(${l.scale})`,
      },
    })),
  ),
)
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
