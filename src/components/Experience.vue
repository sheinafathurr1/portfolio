<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const experiences = [
  {
    id: 1,
    title: 'Tenaga Lepas Harian (TLH)',
    company: 'CoE CAATIS',
    period: 'Jan 2026 – Sekarang',
    description: 'Mengelola infrastruktur operasional secara menyeluruh, termasuk pengawasan performa server dan manajemen backup data berkala. Bertanggung jawab dalam mengoordinasikan penugasan teknis harian untuk tim.',
    tags: ['Server Mgmt', 'Infrastructure', 'Linux'],
    accent: 'blue',
  },
  {
    id: 2,
    title: 'Peneliti AI & Mahasiswa S2IF',
    company: 'Telkom University',
    period: '2025 – Sekarang',
    description: 'Menjalankan riset akademik jenjang magister Informatika dengan fokus pada arsitektur Dynamic API, Machine Learning, dan keamanan siber. Aktif memetakan arsitektur sistem menggunakan metodologi Design Science Research (DSR).',
    tags: ['Machine Learning', 'Dynamic API', 'DSR'],
    accent: 'violet',
  },
  {
    id: 3,
    title: 'Lead Developer',
    company: 'HEI APP',
    period: 'Maret 2026 – Sekarang',
    description: 'Membangun dan mendokumentasikan sistem aplikasi HEI APP untuk mendigitalkan alur proses evaluasi karakter mahasiswa serta mengintegrasikan nilai-nilai universitas secara terpusat.',
    tags: ['Vue.js', 'Laravel', 'Team Lead'],
    accent: 'emerald',
  },
]

const accentConfig: Record<string, { dot: string; ping: string; bar: string; border: string; shadow: string }> = {
  blue:    { dot: 'from-blue-500 to-cyan-500 shadow-blue-500/30',    ping: 'bg-blue-500',    bar: 'from-blue-500 to-cyan-500',    border: 'hover:border-blue-500/40',    shadow: 'hover:shadow-blue-500/10' },
  violet:  { dot: 'from-violet-500 to-purple-500 shadow-violet-500/30', ping: 'bg-violet-500', bar: 'from-violet-500 to-purple-500', border: 'hover:border-violet-500/40', shadow: 'hover:shadow-violet-500/10' },
  emerald: { dot: 'from-emerald-500 to-teal-500 shadow-emerald-500/30', ping: 'bg-emerald-500', bar: 'from-emerald-500 to-teal-500', border: 'hover:border-emerald-500/40', shadow: 'hover:shadow-emerald-500/10' },
}

const timelineContainer = ref<HTMLElement>()
const lineAnimated = ref(false)
let observer: IntersectionObserver | null = null

onMounted(() => {
  if (!timelineContainer.value) return
  observer = new IntersectionObserver(
    ([entry]) => { if (entry.isIntersecting) lineAnimated.value = true },
    { threshold: 0.1 }
  )
  observer.observe(timelineContainer.value)
})

onUnmounted(() => observer?.disconnect())
</script>

<template>
  <section id="experience" class="py-24 px-4 transition-colors duration-300 relative">
    <div class="max-w-4xl mx-auto">
      <div data-aos="fade-up" class="text-center mb-16">
        <span class="section-badge mb-3">
          Perjalanan Karir
        </span>
        <h2 class="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 transition-colors">
          Rekam Jejak & Pengalaman
        </h2>
        <div class="section-divider"></div>
      </div>

      <div ref="timelineContainer" class="relative z-10">
        <!-- Animated vertical line -->
        <div
          class="absolute left-[19px] md:left-[23px] top-2 w-px bg-gradient-to-b from-blue-500 via-blue-300/60 dark:via-gray-700 to-transparent transition-[height] duration-[1600ms] ease-out"
          :style="{ height: lineAnimated ? 'calc(100% - 8px)' : '4px' }"
        ></div>

        <div class="space-y-8">
          <div
            v-for="(exp, index) in experiences"
            :key="exp.id"
            class="flex gap-6 md:gap-8"
            data-aos="fade-up"
            :data-aos-delay="index * 120"
          >
            <!-- Timeline dot -->
            <div class="flex-shrink-0 relative mt-1">
              <div
                :class="['w-10 h-10 rounded-xl flex items-center justify-center z-10 relative shadow-lg bg-gradient-to-br', accentConfig[exp.accent].dot]"
              >
                <svg class="text-white h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <!-- Pulse ring -->
              <div :class="['absolute inset-0 rounded-xl animate-ping opacity-20', accentConfig[exp.accent].ping]"></div>
            </div>

            <!-- Content card -->
            <div
              :class="[
                'flex-1 mb-2 glass-card transition-all duration-300 hover:-translate-y-1 shadow-md hover:shadow-lg shadow-black/5 dark:shadow-black/20 p-6 md:p-7 rounded-2xl group overflow-hidden relative',
                accentConfig[exp.accent].border,
                accentConfig[exp.accent].shadow,
              ]"
            >
              <!-- Top accent bar on hover -->
              <div
                :class="['absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r', accentConfig[exp.accent].bar]"
              ></div>

              <div class="flex flex-wrap items-center gap-2 mb-3">
                <span class="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 text-xs font-bold tracking-wider uppercase font-mono bg-blue-50 dark:bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-100 dark:border-blue-500/20">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  {{ exp.period }}
                </span>
                <span class="inline-flex items-center gap-1 text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 px-2.5 py-1 rounded-md border border-green-100 dark:border-green-500/20">
                  <span class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  Saat Ini
                </span>
              </div>

              <h3 class="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {{ exp.title }}
              </h3>
              <h4 class="text-gray-500 dark:text-gray-400 font-medium text-sm mb-3 flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
                {{ exp.company }}
              </h4>
              <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                {{ exp.description }}
              </p>

              <!-- Skill tags -->
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="tag in exp.tags"
                  :key="tag"
                  class="bg-gray-100/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-md text-xs font-mono border border-gray-200/50 dark:border-gray-700/50"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
