<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const roles = ['Technical Lead', 'AI Researcher', 'Full-Stack Developer', 'Server Engineer']
const currentRole = ref(0)
const displayedRole = ref('')
const isDeleting = ref(false)
let typingTimer: ReturnType<typeof setTimeout>

const typeRole = () => {
  const target = roles[currentRole.value]
  if (!isDeleting.value) {
    displayedRole.value = target.substring(0, displayedRole.value.length + 1)
    if (displayedRole.value === target) {
      typingTimer = setTimeout(() => {
        isDeleting.value = true
        typeRole()
      }, 2200)
      return
    }
  } else {
    displayedRole.value = target.substring(0, displayedRole.value.length - 1)
    if (displayedRole.value === '') {
      isDeleting.value = false
      currentRole.value = (currentRole.value + 1) % roles.length
    }
  }
  typingTimer = setTimeout(typeRole, isDeleting.value ? 55 : 100)
}

onMounted(() => {
  typingTimer = setTimeout(typeRole, 600)
})

onUnmounted(() => {
  clearTimeout(typingTimer)
})
</script>

<template>
  <section
    id="about"
    class="relative min-h-screen flex flex-col justify-center items-center px-4 pt-20 pb-10 overflow-hidden transition-colors duration-300"
  >
    <!-- Background blobs -->
    <div
      class="absolute top-1/4 left-1/6 w-80 h-80 bg-blue-400/20 dark:bg-blue-600/15 rounded-full blur-[120px] pointer-events-none animate-pulse"
    ></div>
    <div
      class="absolute bottom-1/4 right-1/6 w-96 h-96 bg-cyan-400/20 dark:bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none animate-pulse"
      style="animation-delay: 2s"
    ></div>
    <div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-violet-400/10 dark:bg-violet-600/10 rounded-full blur-[100px] pointer-events-none animate-pulse"
      style="animation-delay: 4s"
    ></div>

    <div class="relative z-10 text-center max-w-4xl w-full">
      <!-- Avatar with animated gradient ring -->
      <div data-aos="zoom-in" class="flex justify-center mb-8">
        <div class="relative inline-block">
          <div
            class="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-violet-500 opacity-80 blur-sm animate-spin"
            style="animation-duration: 4s"
          ></div>
          <div
            class="relative w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-4xl md:text-5xl font-black text-white shadow-2xl border-4 border-white dark:border-gray-900"
          >
            S
          </div>
          <!-- Available badge -->
          <div
            class="absolute -bottom-1 -right-1 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full px-2.5 py-0.5 flex items-center gap-1.5 text-white text-xs font-bold shadow-md"
          >
            <span class="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
            Open to work
          </div>
        </div>
      </div>

      <!-- Name -->
      <h1
        data-aos="fade-up"
        data-aos-delay="100"
        class="text-5xl md:text-7xl font-extrabold mb-4 text-gray-900 dark:text-white tracking-tight transition-colors"
      >
        Halo, Saya
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-400 to-violet-500"
          >Switch</span
        >
      </h1>

      <!-- Typing animation role -->
      <h2
        data-aos="fade-up"
        data-aos-delay="200"
        class="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-6 font-medium transition-colors h-8 flex items-center justify-center gap-1"
      >
        <span>{{ displayedRole }}</span>
        <span class="inline-block w-0.5 h-6 bg-blue-500 animate-pulse ml-0.5"></span>
      </h2>

      <!-- Description -->
      <p
        data-aos="fade-up"
        data-aos-delay="300"
        class="text-gray-600 dark:text-gray-300 text-base md:text-lg mb-10 leading-relaxed max-w-2xl mx-auto transition-colors"
      >
        Berfokus pada pengembangan full-stack, manajemen infrastruktur server, serta riset automasi
        AI. Aktif meneliti implementasi Dynamic API dan membangun integrasi workflow cerdas.
      </p>

      <!-- Tech chips -->
      <div
        data-aos="fade-up"
        data-aos-delay="350"
        class="flex flex-wrap gap-2 justify-center mb-10"
      >
        <span
          v-for="tech in ['Vue.js', 'Laravel', 'Python', 'n8n', 'AI/ML', 'Linux Server']"
          :key="tech"
          class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-mono font-semibold"
        >
          {{ tech }}
        </span>
      </div>

      <!-- CTA Buttons -->
      <div
        data-aos="zoom-in"
        data-aos-delay="450"
        class="flex flex-col sm:flex-row gap-4 justify-center mb-10"
      >
        <a
          href="#projects"
          class="relative group bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-3.5 rounded-xl font-semibold text-white transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0l-4-4m4 4l-4 4"/>
          </svg>
          Lihat Proyek
        </a>
        <a
          href="#contact"
          class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-white hover:border-blue-500 hover:bg-white dark:hover:bg-gray-700/60 px-8 py-3.5 rounded-xl font-semibold transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
          Hubungi Saya
        </a>
      </div>

      <!-- Social Links -->
      <div
        data-aos="fade-up"
        data-aos-delay="500"
        class="flex justify-center gap-4"
      >
        <a
          href="https://github.com"
          target="_blank"
          class="group w-10 h-10 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-white dark:hover:bg-gray-700/60 flex items-center justify-center transition-all duration-300 hover:-translate-y-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white"
        >
          <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
          </svg>
        </a>
        <a
          href="https://linkedin.com"
          target="_blank"
          class="group w-10 h-10 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-white dark:hover:bg-gray-700/60 flex items-center justify-center transition-all duration-300 hover:-translate-y-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white"
        >
          <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </a>
        <a
          href="mailto:contact@switch.dev"
          class="group w-10 h-10 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-white dark:hover:bg-gray-700/60 flex items-center justify-center transition-all duration-300 hover:-translate-y-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
        </a>
      </div>
    </div>

    <!-- Scroll indicator -->
    <div
      data-aos="fade-up"
      data-aos-delay="600"
      class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400 dark:text-gray-600"
    >
      <span class="text-xs font-medium tracking-widest uppercase">Scroll</span>
      <div class="w-px h-10 bg-gradient-to-b from-gray-400 dark:from-gray-600 to-transparent animate-pulse"></div>
    </div>
  </section>
</template>
