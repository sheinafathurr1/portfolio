<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const CIRC = 2 * Math.PI * 38  // 238.76

const stats = [
  {
    target: 3,
    decimals: 0,
    suffix: '+',
    visualPct: 75,
    label: 'Tahun Freelance',
    desc: 'Membangun aplikasi web & mobile produksi sejak 2023',
    gradFrom: '#3b82f6',
    gradTo: '#06b6d4',
    textClass: 'from-blue-500 to-cyan-500',
    trackClass: 'stroke-blue-100 dark:stroke-blue-950',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>`,
  },
  {
    target: 7,
    decimals: 0,
    suffix: '',
    visualPct: 70,
    label: 'Klien Freelance',
    desc: 'Termasuk dua unit pemerintah kota dan dua perusahaan teknologi',
    gradFrom: '#8b5cf6',
    gradTo: '#a855f7',
    textClass: 'from-violet-500 to-purple-500',
    trackClass: 'stroke-violet-100 dark:stroke-violet-950',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>`,
  },
  {
    target: 8,
    decimals: 0,
    suffix: '',
    visualPct: 80,
    label: 'Publikasi Ilmiah',
    desc: 'Konferensi IEEE & jurnal nasional, 2025–2026',
    gradFrom: '#10b981',
    gradTo: '#14b8a6',
    textClass: 'from-emerald-500 to-teal-500',
    trackClass: 'stroke-emerald-100 dark:stroke-emerald-950',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>`,
  },
  {
    target: 3.49,
    decimals: 2,
    suffix: '',
    visualPct: 87,
    label: 'IPK Magister',
    desc: 'Magister Informatika, Telkom University',
    gradFrom: '#f59e0b',
    gradTo: '#f97316',
    textClass: 'from-amber-500 to-orange-500',
    trackClass: 'stroke-amber-100 dark:stroke-amber-950',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/></svg>`,
  },
]

const displayValues = ref(stats.map(() => '0'))
const animated = ref(false)
let hasAnimated = false
let observer: IntersectionObserver | null = null

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

const animateCounter = (index: number) => {
  const stat = stats[index]
  if (!stat) return
  const { target, suffix } = stat
  const duration = 1600
  const start = performance.now()
  const tick = (now: number) => {
    const progress = Math.min((now - start) / duration, 1)
    const current = target * easeOutCubic(progress)
    displayValues.value[index] = (progress < 1 ? current : target).toFixed(stat.decimals) + suffix
    if (progress < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

onMounted(() => {
  const section = document.getElementById('stats-section')
  if (!section) return
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting && !hasAnimated) {
        hasAnimated = true
        animated.value = true
        stats.forEach((_, i) => setTimeout(() => animateCounter(i), i * 150))
      }
    },
    { threshold: 0.3 }
  )
  observer.observe(section)
})

onUnmounted(() => observer?.disconnect())
</script>

<template>
  <section id="stats-section" class="py-12 px-4 relative z-10">
    <div class="max-w-6xl mx-auto">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div
          v-for="(stat, index) in stats"
          :key="index"
          :data-aos-delay="index * 80"
          data-aos="zoom-in"
          class="group relative glass-card hover:border-blue-500/30 p-5 md:p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md shadow-black/5 dark:shadow-black/20 overflow-hidden"
        >
          <!-- Subtle bg glow on hover -->
          <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div class="absolute inset-0 rounded-2xl" :style="{ background: `radial-gradient(circle at 50% 0%, ${stat.gradFrom}10, transparent 70%)` }"></div>
          </div>

          <!-- SVG Arc Ring -->
          <div class="relative w-24 h-24 mx-auto mb-4">
            <svg viewBox="0 0 100 100" class="w-full h-full -rotate-90" overflow="visible">
              <defs>
                <linearGradient :id="`sg-${index}`" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" :stop-color="stat.gradFrom"/>
                  <stop offset="100%" :stop-color="stat.gradTo"/>
                </linearGradient>
              </defs>
              <!-- Track -->
              <circle cx="50" cy="50" r="38" fill="none" stroke-width="6" :class="stat.trackClass"/>
              <!-- Progress arc -->
              <circle
                cx="50" cy="50" r="38" fill="none" stroke-width="6"
                stroke-linecap="round"
                :stroke="`url(#sg-${index})`"
                :stroke-dasharray="CIRC"
                :stroke-dashoffset="animated ? CIRC * (1 - stat.visualPct / 100) : CIRC"
                :style="{ transition: `stroke-dashoffset 1.5s ease-out ${index * 180}ms` }"
              />
            </svg>

            <!-- Value inside ring -->
            <div class="absolute inset-0 flex items-center justify-center">
              <span
                :class="['text-xl font-extrabold font-mono text-transparent bg-clip-text bg-gradient-to-r tabular-nums', stat.textClass]"
              >
                {{ displayValues[index] }}
              </span>
            </div>
          </div>

          <!-- Icon + Label -->
          <div class="text-center">
            <div class="inline-flex items-center gap-1.5 text-gray-500 dark:text-gray-400 mb-1.5">
              <span v-html="stat.icon" class="opacity-70"></span>
            </div>
            <p class="text-sm font-bold text-gray-900 dark:text-white mb-1">{{ stat.label }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-500 leading-snug hidden md:block">{{ stat.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
