<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isDark = ref(true)
const isMenuOpen = ref(false)
const activeSection = ref('about')
const isScrolled = ref(false)

const sections = ['about', 'experience', 'skills', 'projects', 'contact']

const toggleTheme = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20

  for (const id of [...sections].reverse()) {
    const el = document.getElementById(id)
    if (el && window.scrollY >= el.offsetTop - 120) {
      activeSection.value = id
      break
    }
  }
}

onMounted(() => {
  if (localStorage.theme === 'light') {
    isDark.value = false
    document.documentElement.classList.remove('dark')
  } else {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  }
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <nav
    :class="[
      'fixed w-full top-0 z-50 transition-all duration-300',
      isScrolled
        ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/80 dark:border-gray-800/80 shadow-sm shadow-black/5'
        : 'bg-transparent border-b border-transparent'
    ]"
  >
    <div class="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
      <!-- Logo -->
      <a
        href="#"
        @click="closeMenu"
        class="text-xl font-black text-gray-900 dark:text-white tracking-widest transition-colors z-50 relative flex items-center gap-1"
      >
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">SW</span><span>ITCH</span><span class="text-blue-500">.</span>
      </a>

      <!-- Menu Desktop -->
      <div class="hidden md:flex gap-1 text-gray-600 dark:text-gray-300 font-medium items-center">
        <a
          v-for="item in [
            { id: 'about', label: 'Tentang' },
            { id: 'experience', label: 'Pengalaman' },
            { id: 'skills', label: 'Keahlian' },
            { id: 'projects', label: 'Proyek' },
          ]"
          :key="item.id"
          :href="`#${item.id}`"
          :class="[
            'relative px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
            activeSection === item.id
              ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10'
              : 'hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/60'
          ]"
        >
          {{ item.label }}
          <span
            v-if="activeSection === item.id"
            class="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"
          ></span>
        </a>

        <!-- Download CV -->
        <a
          href="/cv-switch.pdf"
          target="_blank"
          class="flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 px-4 py-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors ml-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          CV
        </a>
      </div>

      <!-- Right buttons -->
      <div class="flex items-center gap-2 z-50 relative">
        <!-- Theme toggle -->
        <button
          @click="toggleTheme"
          class="p-2 rounded-lg bg-white/60 dark:bg-gray-800/60 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700 backdrop-blur-sm"
        >
          <svg v-if="!isDark" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.22 4.22a1 1 0 011.415 0l.884.884a1 1 0 01-1.414 1.415l-.884-.884a1 1 0 010-1.415zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zm-4.22 4.22a1 1 0 010 1.415l-.884.884a1 1 0 01-1.414-1.415l.884-.884a1 1 0 011.415 0zM10 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-4.22-4.22a1 1 0 01-1.415 0l-.884-.884a1 1 0 011.414-1.415l.884.884a1 1 0 010 1.415zM2 10a1 1 0 011-1h1a1 1 0 110 2H3a1 1 0 01-1-1zm4.22-4.22a1 1 0 010-1.415l.884-.884a1 1 0 011.414 1.415l-.884.884a1 1 0 01-1.415 0zM10 6a4 4 0 100 8 4 4 0 000-8z" clip-rule="evenodd"/>
          </svg>
        </button>

        <!-- Hubungi CTA -->
        <a
          href="#contact"
          @click="closeMenu"
          class="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-lg font-semibold transition-all duration-300 text-sm shadow-md shadow-blue-500/20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
          Kontak
        </a>

        <!-- Hamburger Mobile -->
        <button
          @click="toggleMenu"
          class="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
        >
          <svg v-if="!isMenuOpen" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Dropdown Mobile -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform -translate-y-4 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-4 opacity-0"
    >
      <div
        v-if="isMenuOpen"
        class="md:hidden absolute top-full left-0 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 shadow-xl"
      >
        <div class="flex flex-col px-4 py-6 space-y-2 text-center">
          <a
            v-for="item in [
              { id: 'about', label: 'Tentang' },
              { id: 'experience', label: 'Pengalaman' },
              { id: 'skills', label: 'Keahlian' },
              { id: 'projects', label: 'Proyek' },
            ]"
            :key="item.id"
            :href="`#${item.id}`"
            @click="closeMenu"
            :class="[
              'px-4 py-2.5 rounded-lg font-medium text-sm transition-colors',
              activeSection === item.id
                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            ]"
          >
            {{ item.label }}
          </a>

          <div class="h-px bg-gray-200 dark:bg-gray-800 my-2"></div>

          <a
            href="/cv-switch.pdf"
            target="_blank"
            @click="closeMenu"
            class="text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center gap-2 px-4 py-2.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            Download CV
          </a>
          <a
            href="#contact"
            @click="closeMenu"
            class="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2.5 rounded-lg font-semibold mt-1"
          >
            Hubungi Saya
          </a>
        </div>
      </div>
    </transition>
  </nav>
</template>
