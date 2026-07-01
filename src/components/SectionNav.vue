<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const sections = [
  { id: 'about',        label: 'Tentang' },
  { id: 'experience',   label: 'Pengalaman' },
  { id: 'skills',       label: 'Keahlian' },
  { id: 'projects',     label: 'Proyek' },
  { id: 'testimonials', label: 'Testimoni' },
  { id: 'contact',      label: 'Kontak' },
]

const activeSection = ref('about')

const handleScroll = () => {
  for (const s of [...sections].reverse()) {
    const el = document.getElementById(s.id)
    if (el && window.scrollY >= el.offsetTop - 200) {
      activeSection.value = s.id
      return
    }
  }
}

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

onMounted(() => window.addEventListener('scroll', handleScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<template>
  <div
    class="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-4"
    aria-label="Navigasi section"
  >
    <button
      v-for="section in sections"
      :key="section.id"
      @click="scrollTo(section.id)"
      class="group flex items-center gap-2.5 justify-end"
      :aria-label="section.label"
    >
      <!-- Label -->
      <span
        :class="[
          'text-xs font-mono font-semibold whitespace-nowrap transition-all duration-200 pointer-events-none',
          activeSection === section.id
            ? 'text-blue-600 dark:text-blue-400 opacity-100 translate-x-0'
            : 'text-gray-500 dark:text-gray-500 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0',
        ]"
      >
        {{ section.label }}
      </span>
      <!-- Dot -->
      <div
        :class="[
          'rounded-full transition-all duration-300 flex-shrink-0',
          activeSection === section.id
            ? 'w-3 h-3 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.7)]'
            : 'w-2 h-2 bg-gray-300 dark:bg-gray-600 group-hover:bg-blue-400 dark:group-hover:bg-blue-500',
        ]"
      ></div>
    </button>
  </div>
</template>
