<script setup lang="ts">
const experiences = [
  {
    id: 1,
    title: 'Tenaga Lepas Harian (TLH)',
    company: 'CoE CAATIS',
    period: 'Jan 2026 – Sekarang',
    description: 'Mengelola infrastruktur operasional secara menyeluruh, termasuk pengawasan performa server dan manajemen backup data berkala. Bertanggung jawab dalam mengoordinasikan penugasan teknis harian untuk tim.',
  },
  {
    id: 2,
    title: 'Peneliti AI & Mahasiswa S2IF',
    company: 'Telkom University',
    period: '2025 – Sekarang',
    description: 'Menjalankan riset akademik jenjang magister Informatika dengan fokus pada arsitektur Dynamic API, Machine Learning, dan keamanan siber. Aktif memetakan arsitektur sistem menggunakan metodologi Design Science Research (DSR).',
  },
  {
    id: 3,
    title: 'Lead Developer',
    company: 'HEI APP',
    period: 'Maret 2026 – Sekarang',
    description: 'Membangun dan mendokumentasikan sistem aplikasi HEI APP untuk mendigitalkan alur proses evaluasi karakter mahasiswa serta mengintegrasikan nilai-nilai universitas secara terpusat.',
  },
]
</script>

<template>
  <section id="experience" class="py-24 px-4 transition-colors duration-300 relative">
    <div class="max-w-4xl mx-auto">
      <div data-aos="fade-up" class="text-center mb-16">
        <span class="inline-block text-xs font-bold font-mono uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-3 bg-blue-50 dark:bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-200 dark:border-blue-500/20">
          Perjalanan Karir
        </span>
        <h2 class="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 transition-colors">
          Rekam Jejak & Pengalaman
        </h2>
        <div class="w-16 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full"></div>
      </div>

      <div class="relative z-10">
        <!-- Vertical line -->
        <div class="absolute left-[19px] md:left-[23px] top-2 bottom-2 w-px bg-gradient-to-b from-blue-500 via-gray-200 dark:via-gray-700 to-transparent"></div>

        <div class="space-y-8">
          <div
            v-for="(exp, index) in experiences"
            :key="exp.id"
            class="flex gap-6 md:gap-8"
            data-aos="fade-up"
            :data-aos-delay="index * 100"
          >
            <!-- Timeline dot -->
            <div class="flex-shrink-0 relative">
              <div
                :class="[
                  'w-10 h-10 rounded-xl flex items-center justify-center z-10 relative shadow-lg',
                  index === 0
                    ? 'bg-gradient-to-br from-blue-500 to-cyan-500 shadow-blue-500/30'
                    : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700'
                ]"
              >
                <svg
                  :class="index === 0 ? 'text-white' : 'text-gray-400 dark:text-gray-500'"
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
            </div>

            <!-- Content card -->
            <div
              class="flex-1 mb-2 bg-white/80 dark:bg-gray-900/60 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-500/40 transition-all duration-300 hover:-translate-y-1 shadow-md hover:shadow-lg shadow-black/5 dark:shadow-black/20 p-6 md:p-7 rounded-2xl group"
            >
              <div class="flex flex-wrap items-center gap-2 mb-3">
                <span class="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 text-xs font-bold tracking-wider uppercase font-mono bg-blue-50 dark:bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-100 dark:border-blue-500/20">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  {{ exp.period }}
                </span>
                <span v-if="index === 0" class="inline-flex items-center gap-1 text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 px-2.5 py-1 rounded-md border border-green-100 dark:border-green-500/20">
                  <span class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  Saat Ini
                </span>
              </div>
              <h3 class="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {{ exp.title }}
              </h3>
              <h4 class="text-gray-500 dark:text-gray-400 font-medium text-sm mb-4 flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
                {{ exp.company }}
              </h4>
              <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {{ exp.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
