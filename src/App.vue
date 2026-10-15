<script setup lang="ts">
import { ref, provide, onMounted, onUnmounted } from 'vue'
import ClassicPortfolio from './components/ClassicPortfolio.vue'
// Small UI shell; it lazy-loads three.js + the world itself, so classic visitors never download it
import WorldExperience from './components/WorldExperience.vue'
import { PORTFOLIO_MODE, hasWebGL, loadSavedMode, saveMode, type PortfolioMode } from './composables/portfolioMode'
import { burstConfetti } from './utils/confetti'

const canUseWorld = hasWebGL()

const initialMode = (): PortfolioMode => {
  if (!canUseWorld) return 'classic'
  // Deep links like /#projects point at the classic layout
  if (window.location.hash.length > 1) return 'classic'
  return loadSavedMode() ?? 'world'
}

const mode = ref<PortfolioMode>(initialMode())
const targetSection = ref<string | null>(null)
const switchedFromWorld = ref(false)

const setMode = (next: PortfolioMode, section?: string) => {
  if (next === 'world' && !canUseWorld) return
  switchedFromWorld.value = mode.value === 'world'
  targetSection.value = section ?? null
  mode.value = next
  saveMode(next)
  window.scrollTo(0, 0)
}

provide(PORTFOLIO_MODE, { mode, setMode, canUseWorld })

// Konami code easter egg (works in both layouts)
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA']
const konamiBuffer: string[] = []
const showEasterEgg = ref(false)
let easterEggTimer: ReturnType<typeof setTimeout>

const triggerEasterEgg = () => {
  showEasterEgg.value = true
  clearTimeout(easterEggTimer)
  easterEggTimer = setTimeout(() => { showEasterEgg.value = false }, 3500)
  const points = [
    { x: window.innerWidth * 0.2, y: window.innerHeight * 0.3 },
    { x: window.innerWidth * 0.5, y: window.innerHeight * 0.2 },
    { x: window.innerWidth * 0.8, y: window.innerHeight * 0.3 },
  ]
  points.forEach((p, i) => setTimeout(() => burstConfetti(p.x, p.y, 50), i * 200))
}

const handleKonami = (e: KeyboardEvent) => {
  konamiBuffer.push(e.code)
  if (konamiBuffer.length > konamiSequence.length) konamiBuffer.shift()
  if (konamiBuffer.length === konamiSequence.length && konamiBuffer.every((k, i) => k === konamiSequence[i])) {
    konamiBuffer.length = 0
    triggerEasterEgg()
  }
}

onMounted(() => window.addEventListener('keydown', handleKonami))
onUnmounted(() => window.removeEventListener('keydown', handleKonami))
</script>

<template>
  <WorldExperience v-if="mode === 'world'" />
  <ClassicPortfolio v-else :skip-preloader="switchedFromWorld" :target-section="targetSection" />

  <!-- Konami code easter egg banner -->
  <Transition name="egg">
    <div v-if="showEasterEgg" class="fixed top-20 left-1/2 -translate-x-1/2 z-[9500] pointer-events-none px-4 w-full flex justify-center">
      <div class="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold text-sm shadow-2xl shadow-blue-500/40 text-center">
        🎉 Easter egg ditemukan! Kamu tahu Konami Code!
      </div>
    </div>
  </Transition>
</template>
