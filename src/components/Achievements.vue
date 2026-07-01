<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const milestones = [
  {
    year: '2026',
    title: 'Lead Developer — HEI APP',
    desc: 'Memimpin pengembangan sistem digital evaluasi karakter mahasiswa untuk Telkom University.',
    icon: '🏆',
    color: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-200 dark:border-blue-500/20',
    text: 'text-blue-600 dark:text-blue-400',
  },
  {
    year: '2026',
    title: 'Tenaga Lepas Harian — CoE CAATIS',
    desc: 'Mengelola infrastruktur server dan koordinasi teknis harian untuk pusat keunggulan AI.',
    icon: '⚙️',
    color: 'from-cyan-500 to-teal-500',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-200 dark:border-cyan-500/20',
    text: 'text-cyan-600 dark:text-cyan-400',
  },
  {
    year: '2025',
    title: 'Peneliti AI — Telkom University',
    desc: 'Memulai riset S2IF dengan fokus Dynamic API, Machine Learning, dan keamanan siber berbasis DSR.',
    icon: '🔬',
    color: 'from-violet-500 to-purple-500',
    bg: 'bg-violet-500/10',
    border: 'border-violet-200 dark:border-violet-500/20',
    text: 'text-violet-600 dark:text-violet-400',
  },
  {
    year: '2025',
    title: 'Automasi AI Pipeline',
    desc: 'Membangun 10+ workflow n8n terintegrasi Google Gemini API untuk otomatisasi ekstraksi jurnal.',
    icon: '🤖',
    color: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-200 dark:border-emerald-500/20',
    text: 'text-emerald-600 dark:text-emerald-400',
  },
]

const currentFocus = [
  { label: 'Riset Dynamic API',  icon: '🔬', pct: 90 },
  { label: 'ML Model Training',  icon: '🧠', pct: 70 },
  { label: 'HEI APP v2',         icon: '💻', pct: 55 },
  { label: 'Server Hardening',   icon: '🛡️', pct: 80 },
]

const animated = ref(false)
let observer: IntersectionObserver | null = null

onMounted(() => {
  const section = document.getElementById('achievements')
  if (!section) return
  observer = new IntersectionObserver(
    ([entry]) => { if (entry.isIntersecting && !animated.value) animated.value = true },
    { threshold: 0.2 }
  )
  observer.observe(section)
})

onUnmounted(() => observer?.disconnect())
</script>

<template>
  <section id="achievements" class="py-24 px-4 relative z-10 transition-colors duration-300">
    <div class="max-w-6xl mx-auto">

      <!-- Header -->
      <div data-aos="fade-up" class="text-center mb-16">
        <span class="section-badge mb-3">
          Highlight
        </span>
        <h2 class="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
          Pencapaian & Fokus Saat Ini
        </h2>
        <div class="section-divider"></div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">

        <!-- Milestones (left, 3 cols) -->
        <div class="lg:col-span-3 space-y-4">
          <div
            v-for="(m, i) in milestones"
            :key="i"
            data-aos="fade-right"
            :data-aos-delay="i * 100"
            class="group flex gap-4 glass-card p-5 rounded-2xl hover:-translate-y-0.5 transition-all duration-300 shadow-sm hover:shadow-md shadow-black/5 dark:shadow-black/20 overflow-hidden relative"
          >
            <div :class="['absolute inset-0 opacity-0 group-hover:opacity-[0.04] bg-gradient-to-br transition-opacity duration-500 pointer-events-none', m.color]"></div>

            <div :class="['w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300', m.bg]">
              {{ m.icon }}
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1 flex-wrap">
                <h3 class="text-sm font-bold text-gray-900 dark:text-white leading-snug">{{ m.title }}</h3>
                <span :class="['text-[10px] font-bold font-mono px-2 py-0.5 rounded-full border', m.bg, m.border, m.text]">
                  {{ m.year }}
                </span>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{{ m.desc }}</p>
            </div>
          </div>
        </div>

        <!-- Current focus (right, 2 cols) -->
        <div class="lg:col-span-2" data-aos="fade-left" data-aos-delay="200">
          <div class="glass-card p-6 rounded-2xl shadow-lg shadow-black/5 dark:shadow-black/20 h-full">

            <div class="flex items-center gap-2 mb-6">
              <div class="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
              <h3 class="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider font-mono">Currently Working On</h3>
            </div>

            <div class="space-y-5">
              <div v-for="(item, i) in currentFocus" :key="i">
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center gap-2">
                    <span class="text-base">{{ item.icon }}</span>
                    <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">{{ item.label }}</span>
                  </div>
                  <span class="text-xs font-bold font-mono text-blue-600 dark:text-blue-400">{{ item.pct }}%</span>
                </div>
                <div class="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    class="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-[width] duration-[1400ms] ease-out"
                    :style="{ width: animated ? `${item.pct}%` : '0%', transitionDelay: `${i * 120 + 300}ms` }"
                  ></div>
                </div>
              </div>
            </div>

            <div class="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800">
              <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
                <span class="font-mono">Status</span>
                <span class="flex items-center gap-1.5 text-green-600 dark:text-green-400 font-semibold">
                  <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  Open to Collaboration
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
