<script setup lang="ts">
import { ref, onMounted } from 'vue'

const stats = [
  {
    value: '99.9%',
    label: 'Server Uptime',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"/></svg>`,
    color: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-500/10',
  },
  {
    value: '10+',
    label: 'AI Automations',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>`,
    color: 'from-violet-500 to-purple-500',
    bg: 'bg-violet-500/10',
  },
  {
    value: '5+',
    label: 'Riset & Publikasi',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>`,
    color: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-500/10',
  },
  {
    value: '3+',
    label: 'Tim Dikelola',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>`,
    color: 'from-orange-500 to-amber-500',
    bg: 'bg-orange-500/10',
  },
]
</script>

<template>
  <section class="py-10 px-4 relative z-10">
    <div class="max-w-6xl mx-auto">
      <div
        data-aos="fade-up"
        class="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div
          v-for="(stat, index) in stats"
          :key="index"
          :data-aos-delay="index * 80"
          data-aos="zoom-in"
          class="bg-white/70 dark:bg-gray-900/50 backdrop-blur-md p-6 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-500/40 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md shadow-black/5 dark:shadow-black/20 group text-center"
        >
          <div
            :class="['w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-110', stat.bg]"
          >
            <div
              :class="['text-transparent bg-clip-text bg-gradient-to-br', stat.color, '[&>svg]:stroke-current']"
              v-html="stat.icon"
            ></div>
          </div>
          <div
            :class="['text-2xl md:text-3xl font-extrabold font-mono mb-1 text-transparent bg-clip-text bg-gradient-to-r', stat.color]"
          >
            {{ stat.value }}
          </div>
          <div class="text-xs md:text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            {{ stat.label }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
