<script setup lang="ts">
import { ref, computed, inject, onMounted, onUnmounted } from 'vue'
import type { World } from '../world/World'
import { ISLAND_RADIUS, ZONES, type ZoneId } from '../world/layout'
import { PORTFOLIO_MODE } from '../composables/portfolioMode'
import { profile, experiences, projects, skillCategories, milestones, currentFocus, socialLinks } from '../data/portfolio'
import { burstConfetti } from '../utils/confetti'

const modeApi = inject(PORTFOLIO_MODE, null)
const goClassic = (section?: string) => modeApi?.setMode('classic', section)

const canvasRef = ref<HTMLCanvasElement | null>(null)
const labelsRef = ref<HTMLDivElement | null>(null)
const minimapRef = ref<HTMLCanvasElement | null>(null)
const joyBaseRef = ref<HTMLDivElement | null>(null)

let world: World | null = null
let disposed = false
const phase = ref<'loading' | 'intro' | 'playing'>('loading')
const failed = ref(false)
const activeZone = ref<ZoneId | null>(null)
const dismissedZone = ref<ZoneId | null>(null)
const collected = ref(0)
const totalCores = ref(8)
const showControls = ref(true)
const emailCopied = ref(false)
const isTouch = window.matchMedia('(pointer: coarse)').matches

// ── Toasts ──
const toast = ref<{ id: number; text: string } | null>(null)
let toastTimer: ReturnType<typeof setTimeout>
const showToast = (text: string, ms = 2800) => {
  clearTimeout(toastTimer)
  toast.value = { id: Date.now(), text }
  toastTimer = setTimeout(() => { toast.value = null }, ms)
}

// ── Zone panel ──
const panelZone = computed(() =>
  phase.value === 'playing' && activeZone.value && activeZone.value !== dismissedZone.value ? activeZone.value : null,
)
const zoneMeta = computed(() => ZONES.find((z) => z.id === panelZone.value))
const zoneNumber = computed(() => Number(panelZone.value?.split('-')[1] ?? 0) - 1)
const panelExperience = computed(() => (panelZone.value?.startsWith('exp-') ? experiences[zoneNumber.value] : undefined))
const panelProject = computed(() => (panelZone.value?.startsWith('project-') ? projects[zoneNumber.value] : undefined))
const panelHeader = computed(() => {
  if (panelExperience.value) return { kicker: `Pengalaman · 0${panelExperience.value.id}`, title: panelExperience.value.title }
  if (panelProject.value) return { kicker: `Proyek · #0${panelProject.value.id}`, title: panelProject.value.title }
  switch (panelZone.value) {
    case 'about': return { kicker: 'Tentang Saya', title: profile.name }
    case 'skills': return { kicker: 'Tech Stack', title: 'Keahlian & Teknologi' }
    case 'achievements': return { kicker: 'Highlight', title: 'Pencapaian & Fokus' }
    case 'contact': return { kicker: 'Get in Touch', title: 'Mari Berkolaborasi' }
    default: return { kicker: '', title: '' }
  }
})

const copyEmail = () => {
  navigator.clipboard.writeText(profile.email).then(() => {
    emailCopied.value = true
    setTimeout(() => { emailCopied.value = false }, 2200)
  }).catch(() => {})
}

// ── Lifecycle ──
const start = () => {
  if (!world || phase.value !== 'intro') return
  world.start()
  phase.value = 'playing'
  canvasRef.value?.focus()
}

const resetWorld = () => {
  world?.resetWorld()
  showToast('Dunia direset — semua peti & huruf kembali ke tempatnya')
}

const handleKeys = (e: KeyboardEvent) => {
  if (phase.value === 'intro' && e.key === 'Enter') start()
  if (phase.value !== 'playing') return
  if (e.code === 'KeyH') showControls.value = !showControls.value
  if (e.key === 'Escape' && panelZone.value) dismissedZone.value = panelZone.value
}

onMounted(async () => {
  document.documentElement.classList.add('world-mode')
  window.addEventListener('keydown', handleKeys)
  mapRaf = requestAnimationFrame(drawMinimap)

  const canvas = canvasRef.value
  const labelRoot = labelsRef.value
  if (!canvas || !labelRoot) return
  const highQuality = !isTouch && window.innerWidth >= 900 && (navigator.hardwareConcurrency ?? 4) >= 4
  try {
    const { World, TOTAL_CORES } = await import('../world/World')
    if (disposed) return
    totalCores.value = TOTAL_CORES
    const created = await World.create({
      canvas,
      labelRoot,
      highQuality,
      callbacks: {
        onZoneChange: (id) => {
          activeZone.value = id
          dismissedZone.value = null
        },
        onCollect: (count, total) => {
          collected.value = count
          if (count === total) {
            showToast('🎉 Semua data core terkumpul! Kamu penjelajah sejati.', 4500)
            const w = window.innerWidth
            const h = window.innerHeight
            ;[0.25, 0.5, 0.75].forEach((fx, i) => setTimeout(() => burstConfetti(w * fx, h * 0.35, 60), i * 180))
          } else {
            showToast(`✨ Data core ${count}/${total} terkumpul`)
          }
        },
        onFall: () => showToast('Ups! Kamu jatuh dari pulau 😅 Kembali ke titik awal.'),
      },
    })
    if (disposed) {
      created.dispose()
      return
    }
    world = created
    phase.value = 'intro'
    // Handy for poking at the world from the console while developing; stripped from production builds
    if (import.meta.env.DEV) (window as unknown as { __world?: World }).__world = created
  } catch (err) {
    console.error('[world] failed to start', err)
    failed.value = true
  }
})

onUnmounted(() => {
  disposed = true
  document.documentElement.classList.remove('world-mode')
  window.removeEventListener('keydown', handleKeys)
  cancelAnimationFrame(mapRaf)
  clearTimeout(toastTimer)
  world?.dispose()
  world = null
})

// ── Minimap ──
let mapRaf = 0
const drawMinimap = () => {
  mapRaf = requestAnimationFrame(drawMinimap)
  const canvas = minimapRef.value
  if (!canvas || !world || phase.value !== 'playing') return
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const dpr = Math.min(window.devicePixelRatio, 2)
  const css = canvas.clientWidth
  if (css === 0) return // minimap is hidden on small screens
  if (canvas.width !== Math.round(css * dpr)) {
    canvas.width = Math.round(css * dpr)
    canvas.height = Math.round(css * dpr)
  }
  const size = canvas.width
  const c = size / 2
  const scale = (size / 2 - 6 * dpr) / ISLAND_RADIUS
  const state = world.getMapState()

  ctx.clearRect(0, 0, size, size)
  ctx.beginPath()
  ctx.arc(c, c, ISLAND_RADIUS * scale, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(15,23,42,0.85)'
  ctx.fill()
  ctx.lineWidth = 1.5 * dpr
  ctx.strokeStyle = 'rgba(56,189,248,0.6)'
  ctx.stroke()

  for (const zone of ZONES) {
    ctx.beginPath()
    ctx.arc(c + zone.x * scale, c + zone.z * scale, zone.radius * scale, 0, Math.PI * 2)
    ctx.fillStyle = zone.id === activeZone.value ? `${zone.color}88` : `${zone.color}33`
    ctx.fill()
    ctx.strokeStyle = zone.color
    ctx.lineWidth = dpr
    ctx.stroke()
  }

  ctx.fillStyle = '#67e8f9'
  for (const core of state.cores) {
    if (core.collected) continue
    const x = c + core.x * scale
    const y = c + core.z * scale
    const r = 3 * dpr
    ctx.beginPath()
    ctx.moveTo(x, y - r)
    ctx.lineTo(x + r, y)
    ctx.lineTo(x, y + r)
    ctx.lineTo(x - r, y)
    ctx.closePath()
    ctx.fill()
  }

  const px = c + state.player.x * scale
  const py = c + state.player.z * scale
  const dx = Math.sin(state.player.yaw)
  const dy = Math.cos(state.player.yaw)
  const s = 6 * dpr
  ctx.beginPath()
  ctx.moveTo(px + dx * s, py + dy * s)
  ctx.lineTo(px - dx * s * 0.6 - dy * s * 0.6, py - dy * s * 0.6 + dx * s * 0.6)
  ctx.lineTo(px - dx * s * 0.6 + dy * s * 0.6, py - dy * s * 0.6 - dx * s * 0.6)
  ctx.closePath()
  ctx.fillStyle = '#ffffff'
  ctx.shadowColor = '#22d3ee'
  ctx.shadowBlur = 8 * dpr
  ctx.fill()
  ctx.shadowBlur = 0
}

// ── Touch controls ──
const knob = ref({ x: 0, y: 0 })
let joyPointer: number | null = null
const onJoyStart = (e: PointerEvent) => {
  joyPointer = e.pointerId
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  onJoyMove(e)
}
const onJoyMove = (e: PointerEvent) => {
  if (e.pointerId !== joyPointer || !joyBaseRef.value) return
  const rect = joyBaseRef.value.getBoundingClientRect()
  const dx = e.clientX - (rect.left + rect.width / 2)
  const dy = e.clientY - (rect.top + rect.height / 2)
  const max = rect.width / 2 - 12
  const len = Math.hypot(dx, dy)
  const k = len > max ? max / len : 1
  knob.value = { x: dx * k, y: dy * k }
  const nx = (dx * k) / max
  const ny = (-dy * k) / max
  world?.setJoystick(nx, ny)
  world?.setBoost(Math.hypot(nx, ny) > 0.95)
}
const jump = () => world?.jump()
const onJoyEnd = (e: PointerEvent) => {
  if (e.pointerId !== joyPointer) return
  joyPointer = null
  knob.value = { x: 0, y: 0 }
  world?.setJoystick(0, 0)
  world?.setBoost(false)
}
</script>

<template>
  <div class="fixed inset-0 bg-[#050813] text-slate-200 overflow-hidden select-none">
    <canvas ref="canvasRef" tabindex="0" class="absolute inset-0 w-full h-full outline-none touch-none" aria-label="Dunia 3D portofolio Switch"></canvas>
    <div ref="labelsRef" class="absolute inset-0 pointer-events-none" :class="{ 'opacity-0': phase !== 'playing' }"></div>

    <!-- ═════ Intro / loading ═════ -->
    <Transition name="world-intro">
      <div
        v-if="phase !== 'playing'"
        class="absolute inset-0 z-30 flex items-end sm:items-center justify-center p-5 sm:p-8 bg-gradient-to-t from-[#050813] via-[#050813]/75 to-[#050813]/10"
      >
        <div class="w-full max-w-xl text-center pb-6 sm:pb-0">
          <span class="inline-flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-cyan-300 bg-cyan-400/10 border border-cyan-400/25 px-4 py-1.5 rounded-full mb-5">
            <span class="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse"></span>
            Portofolio Interaktif
          </span>
          <h1 class="text-5xl sm:text-7xl font-black tracking-tight text-white mb-4 leading-none">
            Pulau
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-violet-400 animate-shimmer-text">Switch</span>
          </h1>
          <p class="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 max-w-lg mx-auto">
            Halo, saya <strong class="text-white">{{ profile.name }}</strong>. Gelindingkan bot kecil di pulau digital ini untuk
            menjelajahi pengalaman, proyek, dan keahlian saya. Tabrak peti skill dan kumpulkan semua
            <span class="text-cyan-300 font-semibold">data core</span>!
          </p>

          <div v-if="!isTouch" class="flex flex-wrap justify-center gap-2 mb-7 text-xs text-slate-400">
            <span class="world-key-hint"><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> / <kbd>↑</kbd><kbd>↓</kbd><kbd>←</kbd><kbd>→</kbd> gerak</span>
            <span class="world-key-hint"><kbd>Space</kbd> lompat</span>
            <span class="world-key-hint"><kbd>Shift</kbd> boost</span>
            <span class="world-key-hint"><kbd>R</kbd> ulang</span>
          </div>
          <p v-else class="text-xs text-slate-400 mb-7">Geser joystick di kiri bawah untuk bergerak, dorong penuh untuk boost, dan tekan tombol lompat.</p>

          <div v-if="!failed" class="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              @click="start"
              :disabled="phase === 'loading'"
              class="shine-sweep w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-wait"
            >
              <svg v-if="phase === 'loading'" class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <svg v-else class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
              {{ phase === 'loading' ? 'Membangun pulau…' : 'Mulai Jelajah' }}
            </button>
            <button
              @click="goClassic()"
              class="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-slate-300 border border-white/15 bg-white/5 hover:bg-white/10 hover:text-white transition-colors"
            >
              Lihat versi klasik
            </button>
          </div>
          <div v-else class="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-sm text-red-200">
            Perangkat ini belum bisa menampilkan dunia 3D.
            <button @click="goClassic()" class="block mx-auto mt-3 px-5 py-2 rounded-lg bg-white/10 hover:bg-white/20 font-semibold text-white">
              Buka versi klasik
            </button>
          </div>
          <p v-if="phase === 'intro' && !isTouch" class="mt-4 text-[11px] font-mono text-slate-500">tekan Enter untuk mulai</p>
        </div>
      </div>
    </Transition>

    <!-- ═════ HUD ═════ -->
    <template v-if="phase === 'playing'">
      <!-- Brand + core counter -->
      <div class="absolute top-4 left-4 z-20 flex items-center gap-2 sm:gap-3">
        <div class="world-hud-chip font-black tracking-widest text-sm sm:text-base">
          <span><span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">SW</span><span class="text-white">ITCH</span><span class="text-cyan-400">.</span></span>
        </div>
        <div class="world-hud-chip font-mono text-xs sm:text-sm" :class="{ 'text-amber-300': collected === totalCores }" title="Data core terkumpul">
          <span class="text-cyan-300">◆</span> {{ collected }}/{{ totalCores }}
        </div>
      </div>

      <!-- Actions -->
      <div class="absolute top-4 right-4 z-20 flex items-center gap-2">
        <button @click="resetWorld" class="world-hud-btn" title="Reset dunia">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          <span class="hidden md:inline">Reset</span>
        </button>
        <button v-if="!isTouch" @click="showControls = !showControls" class="world-hud-btn" title="Kontrol (H)">
          <span class="font-mono font-bold">?</span>
        </button>
        <button @click="goClassic()" class="world-hud-btn world-hud-btn--primary">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h10" /></svg>
          <span class="hidden sm:inline">Versi Klasik</span>
        </button>
      </div>

      <!-- Controls help -->
      <Transition name="fade">
        <div v-if="showControls && !isTouch" class="absolute bottom-4 left-4 z-20 world-glass rounded-2xl p-4 text-xs text-slate-300 w-64">
          <div class="flex items-center justify-between mb-3">
            <p class="font-mono font-bold uppercase tracking-widest text-[10px] text-cyan-300">Kontrol</p>
            <button @click="showControls = false" class="text-slate-500 hover:text-white" aria-label="Sembunyikan kontrol">✕</button>
          </div>
          <ul class="space-y-2">
            <li class="flex justify-between gap-2"><span>Gerak</span><span><kbd>WASD</kbd> / <kbd>↑↓←→</kbd></span></li>
            <li class="flex justify-between gap-2"><span>Lompat</span><kbd>Space</kbd></li>
            <li class="flex justify-between gap-2"><span>Boost</span><kbd>Shift</kbd></li>
            <li class="flex justify-between gap-2"><span>Kembali ke awal</span><kbd>R</kbd></li>
            <li class="flex justify-between gap-2"><span>Zoom</span><span class="text-slate-400">scroll</span></li>
          </ul>
          <p class="mt-3 pt-3 border-t border-white/10 text-slate-400 leading-relaxed">
            Ikuti titik bercahaya ke tiap area. Tip: lompat di ujung ramp 😉
          </p>
        </div>
      </Transition>

      <!-- Minimap -->
      <div class="absolute z-20 world-glass rounded-full p-1.5 right-4 hidden sm:block" :class="isTouch ? 'top-20' : 'bottom-4'">
        <canvas ref="minimapRef" class="block w-36 h-36 rounded-full" aria-hidden="true"></canvas>
      </div>

      <!-- Zone panel -->
      <Transition name="world-panel" mode="out-in">
        <aside
          v-if="panelZone && zoneMeta"
          :key="panelZone"
          class="world-glass world-panel absolute z-20 left-3 right-3 top-[68px] max-h-[42vh] sm:left-auto sm:right-4 sm:top-20 sm:w-[380px] rounded-2xl p-5 overflow-y-auto"
          :class="isTouch ? '' : 'sm:max-h-[calc(100vh-280px)]'"
          :style="{ '--zone-color': zoneMeta.color }"
        >
          <header class="flex items-start gap-3 mb-4">
            <span class="world-panel__icon">{{ zoneMeta.icon }}</span>
            <div class="flex-1 min-w-0">
              <p class="text-[10px] font-mono font-bold uppercase tracking-[0.2em] mb-0.5" :style="{ color: zoneMeta.color }">{{ panelHeader.kicker }}</p>
              <h2 class="text-white font-extrabold text-lg leading-snug">{{ panelHeader.title }}</h2>
            </div>
            <button @click="dismissedZone = panelZone" class="text-slate-500 hover:text-white p-1 -m-1" aria-label="Tutup panel">✕</button>
          </header>

          <!-- About -->
          <template v-if="panelZone === 'about'">
            <div class="flex items-center gap-3 mb-4">
              <div class="relative w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 via-cyan-400 to-violet-500 flex items-center justify-center text-white font-black text-xl shrink-0">
                S
                <span class="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-green-500 border-2 border-slate-900"></span>
              </div>
              <div>
                <p class="text-white font-bold">"{{ profile.alias }}"</p>
                <p class="text-xs text-green-400 font-semibold">● Available for collaboration</p>
              </div>
            </div>
            <div class="flex flex-wrap gap-1.5 mb-3">
              <span v-for="role in profile.roles" :key="role" class="world-chip">{{ role }}</span>
            </div>
            <p class="text-sm text-slate-300 leading-relaxed mb-4">{{ profile.summary }}</p>
            <div class="flex flex-wrap gap-1.5 mb-5">
              <span v-for="tech in profile.stack" :key="tech" class="world-chip font-mono">{{ tech }}</span>
            </div>
            <div class="flex gap-2">
              <a :href="profile.cvUrl" target="_blank" class="world-action world-action--primary">Download CV</a>
              <button @click="goClassic()" class="world-action">Versi klasik</button>
            </div>
            <p class="mt-4 text-xs text-slate-500 leading-relaxed">
              👉 Ikuti titik bercahaya: pengalaman di barat, keahlian di timur, proyek di utara, pencapaian & kontak di selatan.
            </p>
          </template>

          <!-- Experience -->
          <template v-else-if="panelExperience">
            <div class="flex flex-wrap items-center gap-2 mb-3">
              <span class="world-chip font-mono">{{ panelExperience.period }}</span>
              <span class="text-xs font-semibold text-green-400">● Saat ini</span>
            </div>
            <p class="text-sm font-semibold mb-2" :style="{ color: zoneMeta.color }">{{ panelExperience.company }}</p>
            <p class="text-sm text-slate-300 leading-relaxed mb-4">{{ panelExperience.description }}</p>
            <div class="flex flex-wrap gap-1.5">
              <span v-for="tag in panelExperience.tags" :key="tag" class="world-chip font-mono">{{ tag }}</span>
            </div>
          </template>

          <!-- Skills -->
          <template v-else-if="panelZone === 'skills'">
            <p class="text-xs text-slate-400 mb-4">Psst… peti-peti di sini bisa kamu tabrak 💥</p>
            <div v-for="cat in skillCategories" :key="cat.key" class="mb-5 last:mb-0">
              <p class="text-xs font-bold text-white mb-2.5 flex items-center gap-2">
                <span class="w-2 h-2 rounded-full" :style="{ background: cat.hex }"></span>{{ cat.label }}
              </p>
              <div v-for="skill in cat.skills" :key="skill.name" class="mb-2">
                <div class="flex justify-between text-[11px] font-mono mb-1">
                  <span class="text-slate-300">{{ skill.name }}</span><span class="text-slate-500">{{ skill.level }}%</span>
                </div>
                <div class="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div class="h-full rounded-full world-bar" :style="{ width: `${skill.level}%`, background: cat.hex }"></div>
                </div>
              </div>
            </div>
          </template>

          <!-- Project -->
          <template v-else-if="panelProject">
            <div class="h-24 rounded-xl mb-4 relative overflow-hidden flex items-center justify-center text-5xl" :style="{ background: `linear-gradient(135deg, ${panelProject.colors.join(', ')})` }">
              <span class="opacity-80">{{ panelProject.icon }}</span>
              <span class="absolute top-2 left-2 text-[10px] font-mono font-bold text-white bg-black/30 px-2 py-0.5 rounded-md">{{ panelProject.year }}</span>
            </div>
            <span class="world-chip font-mono mb-3 inline-block">{{ panelProject.category === 'riset' ? 'Academic Research' : 'System Development' }}</span>
            <p class="text-sm text-slate-300 leading-relaxed mb-4">{{ panelProject.fullDesc }}</p>
            <div class="flex flex-wrap gap-1.5">
              <span v-for="tag in panelProject.tags" :key="tag" class="world-chip font-mono">{{ tag }}</span>
            </div>
          </template>

          <!-- Achievements -->
          <template v-else-if="panelZone === 'achievements'">
            <ul class="space-y-3 mb-5">
              <li v-for="m in milestones" :key="m.title" class="flex gap-3">
                <span class="text-xl leading-none mt-0.5">{{ m.icon }}</span>
                <div>
                  <p class="text-sm font-bold text-white leading-snug">{{ m.title }} <span class="text-[10px] font-mono text-amber-300 ml-1">{{ m.year }}</span></p>
                  <p class="text-xs text-slate-400 leading-relaxed">{{ m.desc }}</p>
                </div>
              </li>
            </ul>
            <p class="text-[10px] font-mono font-bold uppercase tracking-widest text-green-400 mb-3">● Currently working on</p>
            <div v-for="f in currentFocus" :key="f.label" class="mb-2.5">
              <div class="flex justify-between text-xs mb-1"><span class="text-slate-300">{{ f.icon }} {{ f.label }}</span><span class="font-mono text-amber-300">{{ f.pct }}%</span></div>
              <div class="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div class="h-full rounded-full world-bar bg-gradient-to-r from-amber-400 to-orange-500" :style="{ width: `${f.pct}%` }"></div>
              </div>
            </div>
            <p class="mt-4 text-xs text-slate-500">Ada data core di atas balok sebelah sana. Bisa lompat setinggi itu? 🧗</p>
          </template>

          <!-- Contact -->
          <template v-else-if="panelZone === 'contact'">
            <p class="text-sm text-slate-300 leading-relaxed mb-4">
              Diskusi infrastruktur server, eksplorasi AI, atau sekadar bertukar pikiran — kotak masuk saya selalu terbuka!
            </p>
            <div class="grid grid-cols-3 gap-2 mb-3">
              <a
                v-for="link in socialLinks"
                :key="link.label"
                :href="link.href"
                :target="link.href.startsWith('mailto') ? undefined : '_blank'"
                rel="noopener noreferrer"
                class="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-400/50 hover:bg-emerald-400/10 text-slate-300 hover:text-white transition-colors text-xs font-semibold"
              >
                <span v-html="link.icon"></span>{{ link.label }}
              </a>
            </div>
            <button @click="copyEmail" class="world-action w-full mb-2 font-mono text-xs">
              {{ emailCopied ? '✓ Email tersalin!' : `📋 ${profile.email}` }}
            </button>
            <button @click="goClassic('contact')" class="world-action world-action--primary w-full">Kirim pesan lewat formulir</button>
          </template>
        </aside>
      </Transition>

      <!-- Touch controls -->
      <template v-if="isTouch">
        <div
          ref="joyBaseRef"
          class="absolute bottom-6 left-6 z-20 w-32 h-32 rounded-full world-glass touch-none"
          @pointerdown="onJoyStart"
          @pointermove="onJoyMove"
          @pointerup="onJoyEnd"
          @pointercancel="onJoyEnd"
        >
          <div
            class="absolute top-1/2 left-1/2 w-14 h-14 -ml-7 -mt-7 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/40"
            :style="{ transform: `translate(${knob.x}px, ${knob.y}px)` }"
          ></div>
        </div>
        <button
          class="absolute bottom-10 right-6 z-20 w-20 h-20 rounded-full world-glass text-cyan-200 font-bold text-sm active:scale-95 transition-transform touch-none"
          @pointerdown.prevent="jump"
        >
          LOMPAT
        </button>
      </template>
    </template>

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="toast" :key="toast.id" class="absolute top-20 left-1/2 -translate-x-1/2 z-40 pointer-events-none px-4 w-full flex justify-center">
        <div class="world-glass rounded-2xl px-5 py-3 text-sm font-semibold text-white text-center shadow-xl">{{ toast.text }}</div>
      </div>
    </Transition>
  </div>
</template>
