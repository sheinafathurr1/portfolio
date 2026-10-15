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
import PhoneChat from './components/PhoneChat.vue'
import HelpOverlay from './components/HelpOverlay.vue'
import AllOutAttack from './components/AllOutAttack.vue'
import RankUpToast from './components/RankUpToast.vue'
import { NAV, inputBlocked, isTypingTarget, type ScreenId, type SectionId } from './composables/nav'
import { closeOverlay, openOverlay, overlay } from './composables/overlay'
import { BOND_MAX, bondRank, markVisited } from './composables/bond'
import { sfx } from './composables/sfx'
import { menuItems } from './data/phantom'
import { burstConfetti } from './utils/confetti'

const SECTIONS: Record<SectionId, Component> = {
  status: StatusScreen,
  persona: PersonaScreen,
  skill: SkillScreen,
  confidant: ConfidantScreen,
  missions: MissionsScreen,
  den: DenScreen,
  card: CallingCardScreen,
}
const isSection = (id: ScreenId): id is SectionId => id in SECTIONS

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

// ── Bond with Switch: the first visit to each section ranks the bond up ──
const toast = ref<{ rank: number; line: string } | null>(null)
let toastTimer: ReturnType<typeof setTimeout>

const dismissToast = () => {
  clearTimeout(toastTimer)
  toast.value = null
}

const trackBond = (id: ScreenId) => {
  if (!isSection(id) || !markVisited(id)) return
  const line = menuItems.find((m) => m.id === id)?.bond ?? ''
  clearTimeout(toastTimer)
  // Wait for the transition slashes to clear before the toast slides in
  toastTimer = setTimeout(() => {
    const rank = bondRank.value
    toast.value = { rank, line }
    sfx.rankUp()
    if (rank >= BOND_MAX) {
      setTimeout(() => burstConfetti(window.innerWidth - Math.min(window.innerWidth / 2, 190), 140, 60), 250)
    }
    toastTimer = setTimeout(dismissToast, rank >= BOND_MAX ? 6500 : 3600)
  }, 450)
}

const toastToCard = () => {
  dismissToast()
  goTo('card')
}

// ── Screen change: slashes sweep in, the screen swaps while covered, slashes sweep out ──
const wipe = ref<'idle' | 'in' | 'out'>('idle')
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
let pending: ScreenId | null = null
let fallbackTimer: ReturnType<typeof setTimeout>

const focusScreen = () => (document.querySelector('.screen') as HTMLElement | null)?.focus({ preventScroll: true })

const swap = () => {
  if (pending) {
    current.value = pending
    trackBond(pending)
  }
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

/** Open the n-th section (0-based) and keep the menu cursor in sync. */
const jumpTo = (i: number) => {
  const item = menuItems[i]
  if (!item) return
  menuIndex.value = i
  goTo(item.id)
}

const step = (dir: 1 | -1) => {
  // Measure from where we're heading, so fast repeated presses keep advancing
  const from = menuItems.findIndex((m) => m.id === (pending ?? current.value))
  if (from < 0) return
  jumpTo((from + dir + menuItems.length) % menuItems.length)
}

provide(NAV, { current, goTo, back, menuIndex, step })

// ── Secret codes: the Konami code or typing "showtime" unleashes an All-Out Attack ──
const KONAMI = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a']
const WORD = 'showtime'
let keyBuffer: string[] = []

const secretEntered = (key: string) => {
  keyBuffer = [...keyBuffer, key].slice(-KONAMI.length)
  const konami = keyBuffer.join(',') === KONAMI.join(',')
  const word = keyBuffer.slice(-WORD.length).join('') === WORD
  if (konami || word) keyBuffer = []
  return konami || word
}

// ── Global shortcuts ──
const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    if (overlay.value !== 'none') {
      sfx.back()
      closeOverlay()
    } else if (!isTypingTarget(e) && current.value !== 'title') {
      sfx.back()
      back()
    }
    return
  }
  if (inputBlocked(e)) return

  const key = e.key.toLowerCase()
  if (secretEntered(key)) {
    e.preventDefault()
    dismissToast()
    openOverlay('attack')
    return
  }
  if (current.value === 'title' || e.repeat) return

  if (/^[1-9]$/.test(key) && Number(key) <= menuItems.length) {
    e.preventDefault()
    sfx.confirm()
    jumpTo(Number(key) - 1)
  } else if ((key === 'q' || key === 'e') && isSection(current.value)) {
    e.preventDefault()
    sfx.move()
    step(key === 'q' ? -1 : 1)
  } else if (key === 'c') {
    e.preventDefault()
    sfx.confirm()
    openOverlay('phone')
  } else if (key === '?') {
    e.preventDefault()
    sfx.confirm()
    openOverlay('help')
  }
}

// Give focus back to where it was once an overlay closes
let lastFocus: HTMLElement | null = null
watch(overlay, (now, before) => {
  if (before === 'none') lastFocus = document.activeElement as HTMLElement | null
  if (now === 'none') {
    nextTick(() => {
      if (lastFocus?.isConnected) lastFocus.focus({ preventScroll: true })
      else focusScreen()
      lastFocus = null
    })
  }
})

const syncFromUrl = () => show(fromHash())

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
  trackBond(current.value) // deep link straight into a section
})
onUnmounted(() => {
  window.removeEventListener('popstate', syncFromUrl)
  window.removeEventListener('keydown', onKey)
  clearTimeout(fallbackTimer)
  clearTimeout(toastTimer)
})
</script>

<template>
  <component :is="screen" :key="current" />

  <Transition name="toast">
    <RankUpToast
      v-if="toast"
      :key="toast.rank"
      :rank="toast.rank"
      :max="BOND_MAX"
      :line="toast.line"
      :cta="current !== 'card'"
      @dismiss="dismissToast"
      @card="toastToCard"
    />
  </Transition>

  <PhoneChat v-if="overlay === 'phone'" />
  <HelpOverlay v-else-if="overlay === 'help'" />
  <AllOutAttack v-else-if="overlay === 'attack'" />

  <div class="wipe" :class="`is-${wipe}`" aria-hidden="true" @animationend="onWipeEnd">
    <span class="wipe__bar wipe__bar--red"></span>
    <span class="wipe__bar wipe__bar--black"></span>
    <span class="wipe__star"></span>
  </div>
</template>

<style>
.toast-enter-active {
  transition: transform 0.4s var(--snap), opacity 0.2s ease;
}
.toast-leave-active {
  transition: transform 0.25s ease-in, opacity 0.25s ease-in;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(120%) rotate(8deg);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(60%);
}
</style>
