<script setup lang="ts">
import { ref, computed, inject, onMounted, onUnmounted } from 'vue'
import type { World } from '../world/World'
import { ISLAND_RADIUS, ZONES, type ZoneId } from '../world/layout'
import { PORTFOLIO_MODE } from '../composables/portfolioMode'
import { profile, experiences, projects, featuredProjects, categoryLabel, skillCategories, milestones, currentFocus, publications, socialLinks } from '../data/portfolio'
import { burstConfetti } from '../utils/confetti'

const modeApi = inject(PORTFOLIO_MODE, null)
const goClassic = (section?: string) => modeApi?.setMode('classic', section)

const canvasRef = ref<HTMLCanvasElement | null>(null)
const labelsRef = ref<HTMLDivElement | null>(null)
const minimapRef = ref<HTMLCanvasElement | null>(null)
const bigMapRef = ref<HTMLCanvasElement | null>(null)
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

// ── Exploration: every area visited at least once (saved per browser) ──
const VISITED_KEY = 'world-visited'
const loadVisited = (): ZoneId[] => {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(VISITED_KEY) ?? '[]')
    return Array.isArray(parsed) ? (parsed.filter((id) => ZONES.some((z) => z.id === id)) as ZoneId[]) : []
  } catch {
    return []
  }
}
const visited = ref<ZoneId[]>(loadVisited())
const celebrate = () => {
  const w = window.innerWidth
  const h = window.innerHeight
  ;[0.25, 0.5, 0.75].forEach((fx, i) => setTimeout(() => burstConfetti(w * fx, h * 0.35, 60), i * 180))
}
const markVisited = (id: ZoneId) => {
  if (visited.value.includes(id)) return
  visited.value = [...visited.value, id]
  try {
    localStorage.setItem(VISITED_KEY, JSON.stringify(visited.value))
  } catch {
    // storage blocked: progress just won't persist
  }
  const label = ZONES.find((z) => z.id === id)?.label ?? ''
  if (visited.value.length === ZONES.length) {
    showToast('🧭 Semua area sudah kamu jelajahi! Terima kasih sudah mampir.', 4500)
    celebrate()
  } else {
    showToast(`🧭 Area baru: ${label} (${visited.value.length}/${ZONES.length})`)
  }
}

// ── Map + fast travel ──
const mapOpen = ref(false)
const openMap = () => {
  if (phase.value !== 'playing') return
  mapOpen.value = true
  world?.setControlsEnabled(false)
}
const closeMap = () => {
  mapOpen.value = false
  world?.setControlsEnabled(true)
  canvasRef.value?.focus()
}
const travel = (id: ZoneId) => {
  world?.travelTo(id)
  dismissedZone.value = null
  closeMap()
}
const onMapClick = (e: MouseEvent) => {
  const canvas = bigMapRef.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  const scale = (rect.width / 2 - 6) / ISLAND_RADIUS
  const wx = (e.clientX - rect.left - rect.width / 2) / scale
  const wz = (e.clientY - rect.top - rect.height / 2) / scale
  const hit = ZONES.map((z) => ({ z, d: Math.hypot(wx - z.x, wz - z.z) }))
    .filter(({ z, d }) => d < z.radius + 2)
    .sort((a, b) => a.d - b.d)[0]
  if (hit) travel(hit.z.id)
}

// ── Photo mode: grab the current frame, stamp a caption, and download it ──
const flash = ref(false)
const takePhoto = () => {
  const url = world?.capture()
  if (!url) {
    showToast('Foto belum bisa dibuat di browser ini 😕')
    return
  }
  flash.value = true
  setTimeout(() => { flash.value = false }, 380)
  const img = new Image()
  img.onload = () => {
    const out = document.createElement('canvas')
    out.width = img.width
    out.height = img.height
    const ctx = out.getContext('2d')
    if (!ctx) return
    ctx.drawImage(img, 0, 0)
    const k = img.width / 1440
    const barH = Math.round(86 * k)
    const g = ctx.createLinearGradient(0, img.height - barH * 1.8, 0, img.height)
    g.addColorStop(0, 'rgba(5,8,19,0)')
    g.addColorStop(1, 'rgba(5,8,19,0.9)')
    ctx.fillStyle = g
    ctx.fillRect(0, img.height - barH * 1.8, img.width, barH * 1.8)
    ctx.textBaseline = 'alphabetic'
    ctx.fillStyle = '#ffffff'
    ctx.font = `800 ${Math.round(34 * k)}px 'Plus Jakarta Sans', system-ui, sans-serif`
    ctx.fillText('Pulau Switch', 32 * k, img.height - 40 * k)
    const titleW = ctx.measureText('Pulau Switch').width
    ctx.fillStyle = '#67e8f9'
    ctx.font = `600 ${Math.round(18 * k)}px 'Fira Code', ui-monospace, monospace`
    ctx.fillText(`· ${profile.name}`, 32 * k + titleW + 14 * k, img.height - 44 * k)
    ctx.textAlign = 'right'
    ctx.fillStyle = 'rgba(255,255,255,0.7)'
    ctx.fillText(`◆ ${collected.value}/${totalCores.value}  🧭 ${visited.value.length}/${ZONES.length}`, img.width - 32 * k, img.height - 44 * k)
    out.toBlob((blob) => {
      if (!blob) return
      const link = document.createElement('a')
      const stamp = new Date().toISOString().slice(0, 16).replace(/[-:T]/g, '')
      link.href = URL.createObjectURL(blob)
      link.download = `pulau-switch-${stamp}.png`
      document.body.appendChild(link)
      link.click()
      link.remove()
      setTimeout(() => URL.revokeObjectURL(link.href), 2000)
    }, 'image/png')
  }
  img.src = url
  showToast('📸 Cekrek! Foto pulau tersimpan.')
}

// ── Zone panel ──
const panelZone = computed(() =>
  phase.value === 'playing' && activeZone.value && activeZone.value !== dismissedZone.value ? activeZone.value : null,
)
const zoneMeta = computed(() => ZONES.find((z) => z.id === panelZone.value))
const zoneNumber = computed(() => Number(panelZone.value?.split('-')[1] ?? 0) - 1)
const panelExperience = computed(() => (panelZone.value?.startsWith('exp-') ? experiences[zoneNumber.value] : undefined))
const panelProject = computed(() => (panelZone.value?.startsWith('project-') ? featuredProjects[zoneNumber.value] : undefined))
const pad = (n: number) => String(n).padStart(2, '0')
const scholarUrl = socialLinks.find((l) => l.label === 'Google Scholar')?.href
const panelHeader = computed(() => {
  if (panelExperience.value) return { kicker: `Pengalaman · ${pad(panelExperience.value.id)}`, title: panelExperience.value.title }
  if (panelProject.value) return { kicker: `Proyek unggulan · #${pad(panelProject.value.id)}`, title: panelProject.value.title }
  switch (panelZone.value) {
    case 'about': return { kicker: 'Tentang Saya', title: profile.name }
    case 'skills': return { kicker: 'Tech Stack', title: 'Keahlian & Teknologi' }
    case 'library': return { kicker: 'Perpustakaan', title: 'Publikasi Ilmiah' }
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
  if (phase.value !== 'playing' || e.ctrlKey || e.metaKey || e.altKey || e.repeat) return
  if (mapOpen.value) {
    if (e.key === 'Escape' || e.code === 'KeyM') closeMap()
    return
  }
  if (e.code === 'KeyH') showControls.value = !showControls.value
  if (e.code === 'KeyM') openMap()
  if (e.code === 'KeyP') takePhoto()
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
          if (id) markVisited(id)
        },
        onCollect: (count, total) => {
          collected.value = count
          if (count === total) {
            showToast('🎉 Semua data core terkumpul! Kamu penjelajah sejati.', 4500)
            celebrate()
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

// ── Minimap (and the big map when it's open) ──
let mapRaf = 0
const drawMinimap = () => {
  mapRaf = requestAnimationFrame(drawMinimap)
  if (!world || phase.value !== 'playing') return
  drawMap(minimapRef.value, false)
  if (mapOpen.value) drawMap(bigMapRef.value, true)
}

const drawMap = (canvas: HTMLCanvasElement | null, detailed: boolean) => {
  if (!canvas || !world) return
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
    if (detailed) {
      ctx.globalAlpha = visited.value.includes(zone.id) ? 1 : 0.45
      ctx.font = `${Math.round(zone.radius * scale * 0.9)}px 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(zone.icon, c + zone.x * scale, c + zone.z * scale)
      ctx.globalAlpha = 1
    }
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
            <span class="world-key-hint"><kbd>M</kbd> peta</span>
            <span class="world-key-hint"><kbd>P</kbd> foto</span>
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
        <button
          class="world-hud-chip font-mono text-xs sm:text-sm hover:text-white"
          :class="{ 'text-amber-300': visited.length === ZONES.length }"
          title="Area dijelajahi · buka peta (M)"
          @click="openMap"
        >
          🧭 {{ visited.length }}/{{ ZONES.length }}
        </button>
      </div>

      <!-- Actions -->
      <div class="absolute top-4 right-4 z-20 flex items-center gap-2">
        <button @click="openMap" class="world-hud-btn" title="Peta & fast travel (M)">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
          <span class="hidden md:inline">Peta</span>
        </button>
        <button @click="takePhoto" class="world-hud-btn" title="Ambil foto (P)">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          <span class="hidden md:inline">Foto</span>
        </button>
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
            <li class="flex justify-between gap-2"><span>Peta & teleport</span><kbd>M</kbd></li>
            <li class="flex justify-between gap-2"><span>Ambil foto</span><kbd>P</kbd></li>
            <li class="flex justify-between gap-2"><span>Zoom</span><span class="text-slate-400">scroll</span></li>
          </ul>
          <p class="mt-3 pt-3 border-t border-white/10 text-slate-400 leading-relaxed">
            Ikuti titik bercahaya ke tiap area. Tip: lompat di ujung ramp 😉
          </p>
        </div>
      </Transition>

      <!-- Minimap -->
      <button
        class="absolute z-20 world-glass rounded-full p-1.5 right-4 hidden sm:block cursor-pointer"
        :class="isTouch ? 'top-20' : 'bottom-4'"
        title="Buka peta (M)"
        @click="openMap"
      >
        <canvas ref="minimapRef" class="block w-36 h-36 rounded-full" aria-hidden="true"></canvas>
      </button>

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
              <a v-if="profile.cvUrl" :href="profile.cvUrl" target="_blank" class="world-action world-action--primary">Download CV</a>
              <button @click="goClassic('academic')" class="world-action" :class="{ 'world-action--primary': !profile.cvUrl }">Pendidikan &amp; publikasi</button>
              <button @click="goClassic()" class="world-action">Versi klasik</button>
            </div>
            <p class="mt-4 text-xs text-slate-500 leading-relaxed">
              👉 Ikuti titik bercahaya: pengalaman di barat, keahlian &amp; perpustakaan di timur, proyek di utara, pencapaian &amp; kontak di selatan.
              Buka <strong class="text-slate-300">peta (M)</strong> untuk teleport.
            </p>
          </template>

          <!-- Experience -->
          <template v-else-if="panelExperience">
            <div class="flex flex-wrap items-center gap-2 mb-3">
              <span class="world-chip font-mono">{{ panelExperience.period }}</span>
              <span v-if="panelExperience.current" class="text-xs font-semibold text-green-400">● Saat ini</span>
            </div>
            <p class="text-sm font-semibold mb-2" :style="{ color: zoneMeta.color }">{{ panelExperience.company }}</p>
            <ul class="text-sm text-slate-300 leading-relaxed mb-4 space-y-1.5 list-disc pl-4">
              <li v-for="point in panelExperience.points" :key="point">{{ point }}</li>
            </ul>
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
              <span class="absolute top-2 left-2 text-[10px] font-mono font-bold text-white bg-black/30 px-2 py-0.5 rounded-md">{{ panelProject.badge }}</span>
            </div>
            <span class="world-chip font-mono mb-3 inline-block">{{ categoryLabel(panelProject.category) }} · {{ panelProject.org }}</span>
            <p class="text-sm text-slate-300 leading-relaxed mb-4">{{ panelProject.fullDesc }}</p>
            <div class="flex flex-wrap gap-1.5 mb-5">
              <span v-for="tag in panelProject.tags" :key="tag" class="world-chip font-mono">{{ tag }}</span>
            </div>
            <button @click="goClassic('projects')" class="world-action">Lihat semua {{ projects.length }} proyek →</button>
          </template>

          <!-- Library -->
          <template v-else-if="panelZone === 'library'">
            <p class="text-xs text-slate-400 mb-4 leading-relaxed">
              {{ publications.length }} paper di konferensi IEEE dan jurnal nasional (2025–2026). Buku emas di rak = penulis pertama.
            </p>
            <ol class="space-y-3 mb-5">
              <li v-for="(paper, i) in publications" :key="paper.title" class="flex gap-2.5">
                <span class="font-mono text-[11px] font-bold pt-0.5" :class="paper.lead ? 'text-amber-300' : 'text-slate-500'">{{ pad(i + 1) }}</span>
                <div class="min-w-0">
                  <p class="text-sm text-white font-semibold leading-snug">{{ paper.title }}</p>
                  <p class="text-[11px] text-slate-400 leading-snug mt-0.5">{{ paper.venue }}, {{ paper.year }}</p>
                  <p class="text-[10px] font-mono mt-0.5" :class="paper.lead ? 'text-amber-300' : 'text-slate-500'">{{ paper.lead ? '★ ' : '' }}{{ paper.role }}</p>
                </div>
              </li>
            </ol>
            <div class="flex gap-2">
              <a v-if="scholarUrl" :href="scholarUrl" target="_blank" rel="noopener noreferrer" class="world-action world-action--primary">Google Scholar</a>
              <button @click="goClassic('academic')" class="world-action">Versi klasik</button>
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
            <ul class="space-y-2 mb-5">
              <li v-for="f in currentFocus" :key="f.label" class="flex gap-2 text-xs">
                <span>{{ f.icon }}</span>
                <span><span class="text-slate-200 font-semibold">{{ f.label }}</span> <span class="font-mono text-amber-300">· {{ f.note }}</span></span>
              </li>
            </ul>
            <p class="text-[10px] font-mono font-bold uppercase tracking-widest text-violet-300 mb-2">📚 {{ publications.length }} publikasi ilmiah</p>
            <p class="text-xs text-slate-400 leading-relaxed mb-3">
              Konferensi IEEE dan jurnal nasional (2025–2026), {{ publications.filter((p) => p.lead).length }} sebagai penulis pertama.
            </p>
            <button @click="goClassic('academic')" class="world-action">Lihat publikasi →</button>
          </template>

          <!-- Contact -->
          <template v-else-if="panelZone === 'contact'">
            <p class="text-sm text-slate-300 leading-relaxed mb-4">
              Punya proyek web atau mobile, ide AI &amp; IoT, atau ajakan kolaborasi riset? Kotak masuk saya selalu terbuka!
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

    <!-- Map & fast travel -->
    <Transition name="fade">
      <div
        v-if="mapOpen"
        class="absolute inset-0 z-40 flex items-center justify-center p-3 sm:p-6 bg-[#050813]/75 backdrop-blur-sm"
        role="dialog"
        aria-label="Peta pulau"
        @click.self="closeMap"
      >
        <div class="world-glass rounded-3xl p-4 sm:p-6 w-full max-w-4xl max-h-[92vh] overflow-y-auto grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] items-center">
          <canvas
            ref="bigMapRef"
            class="block w-full max-w-[420px] mx-auto aspect-square rounded-full cursor-crosshair"
            aria-hidden="true"
            @click="onMapClick"
          ></canvas>
          <div>
            <div class="flex items-start justify-between gap-3 mb-1">
              <div>
                <p class="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-cyan-300">Fast travel</p>
                <h2 class="text-white text-2xl font-extrabold">Peta Pulau</h2>
              </div>
              <button class="text-slate-400 hover:text-white p-1" aria-label="Tutup peta" @click="closeMap">✕</button>
            </div>
            <p class="text-xs text-slate-400 mb-4">
              Klik area di peta atau di daftar untuk teleport. {{ visited.length }}/{{ ZONES.length }} area sudah dijelajahi.
            </p>
            <div class="grid grid-cols-2 gap-2">
              <button
                v-for="zone in ZONES"
                :key="zone.id"
                class="world-travel"
                :class="{ 'is-here': zone.id === activeZone }"
                :style="{ '--zone-color': zone.color }"
                @click="travel(zone.id)"
              >
                <span class="text-lg leading-none">{{ zone.icon }}</span>
                <span class="flex-1 min-w-0 truncate text-left">{{ zone.label }}</span>
                <span v-if="zone.id === activeZone" class="text-[10px] font-mono text-cyan-300">di sini</span>
                <span v-else-if="visited.includes(zone.id)" class="text-[11px] text-emerald-400" aria-label="sudah dijelajahi">✓</span>
                <span v-else class="text-[10px] font-mono text-amber-300">baru</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Photo flash -->
    <div v-if="flash" class="world-flash absolute inset-0 z-50 pointer-events-none"></div>

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="toast" :key="toast.id" class="absolute top-20 left-1/2 -translate-x-1/2 z-40 pointer-events-none px-4 w-full flex justify-center">
        <div class="world-glass rounded-2xl px-5 py-3 text-sm font-semibold text-white text-center shadow-xl">{{ toast.text }}</div>
      </div>
    </Transition>
  </div>
</template>
