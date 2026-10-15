<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, provide, ref, watch, type Component } from 'vue'
import TitleScreen from './screens/TitleScreen.vue'
import MainMenu from './screens/MainMenu.vue'
import StatusScreen from './screens/StatusScreen.vue'
import PersonaScreen from './screens/PersonaScreen.vue'
import SkillScreen from './screens/SkillScreen.vue'
import ConfidantScreen from './screens/ConfidantScreen.vue'
import MissionsScreen from './screens/MissionsScreen.vue'
import DenScreen from './screens/DenScreen.vue'
import CallingCardScreen from './screens/CallingCardScreen.vue'
import { NAV, isTypingTarget, type ScreenId, type SectionId } from './composables/nav'
import { sfx } from './composables/sfx'
import { menuItems } from './data/phantom'

const SECTIONS: Record<SectionId, Component> = {
  status: StatusScreen,
  persona: PersonaScreen,
  skill: SkillScreen,
  confidant: ConfidantScreen,
  missions: MissionsScreen,
  den: DenScreen,
  card: CallingCardScreen,
}

// Screens live in the URL hash (#/status, #/skill, …) so links can be shared and the back button works
const fromHash = (): ScreenId => {
  const id = window.location.hash.replace(/^#\/?/, '')
  if (id === 'menu') return 'menu'
  return id in SECTIONS ? (id as SectionId) : 'title'
}

const current = ref<ScreenId>(fromHash())
const menuIndex = ref(Math.max(0, menuItems.findIndex((m) => m.id === current.value)))
const screen = computed<Component>(() => {
  if (current.value === 'title') return TitleScreen
  if (current.value === 'menu') return MainMenu
  return SECTIONS[current.value]
})

// ── Screen change: slashes sweep in, the screen swaps while covered, slashes sweep out ──
const wipe = ref<'idle' | 'in' | 'out'>('idle')
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
let pending: ScreenId | null = null
let fallbackTimer: ReturnType<typeof setTimeout>

const focusScreen = () => (document.querySelector('.screen') as HTMLElement | null)?.focus({ preventScroll: true })

const swap = () => {
  if (pending) current.value = pending
  pending = null
  nextTick(focusScreen)
}

const finishWipe = () => {
  clearTimeout(fallbackTimer)
  swap()
  wipe.value = 'idle'
}

const show = (next: ScreenId) => {
  if (next === (pending ?? current.value)) return
  pending = next
  if (reduceMotion) {
    swap()
    return
  }
  wipe.value = 'in'
  // If animations never report back (e.g. a background tab), don't leave navigation stuck
  clearTimeout(fallbackTimer)
  fallbackTimer = setTimeout(finishWipe, 1200)
}

const onWipeEnd = (e: AnimationEvent) => {
  const bar = e.target as HTMLElement
  if (wipe.value === 'in' && bar.classList.contains('wipe__bar--black')) {
    swap()
    nextTick(() => { wipe.value = 'out' })
  } else if (wipe.value === 'out' && bar.classList.contains('wipe__bar--red')) {
    clearTimeout(fallbackTimer)
    wipe.value = 'idle'
  }
}

const goTo = (next: ScreenId) => {
  const hash = next === 'title' ? '' : `#/${next}`
  if (window.location.hash !== hash) {
    history.pushState(null, '', hash || window.location.pathname + window.location.search)
  }
  show(next)
}

const back = () => goTo(current.value === 'menu' || current.value === 'title' ? 'title' : 'menu')

provide(NAV, { current, goTo, back, menuIndex })

const syncFromUrl = () => show(fromHash())
const onKey = (e: KeyboardEvent) => {
  if (e.key !== 'Escape' || isTypingTarget(e) || current.value === 'title') return
  sfx.back()
  back()
}

watch(
  current,
  (id) => {
    const item = menuItems.find((m) => m.id === id)
    document.title = item ? `${item.label} · Switch` : id === 'menu' ? 'Menu · Switch' : 'Switch | Technical Lead & AI Researcher'
  },
  { immediate: true },
)

onMounted(() => {
  window.addEventListener('popstate', syncFromUrl)
  window.addEventListener('keydown', onKey)
})
onUnmounted(() => {
  window.removeEventListener('popstate', syncFromUrl)
  window.removeEventListener('keydown', onKey)
  clearTimeout(fallbackTimer)
})
</script>

<template>
  <component :is="screen" :key="current" />

  <div class="wipe" :class="`is-${wipe}`" aria-hidden="true" @animationend="onWipeEnd">
    <span class="wipe__bar wipe__bar--red"></span>
    <span class="wipe__bar wipe__bar--black"></span>
    <span class="wipe__star"></span>
  </div>
</template>
