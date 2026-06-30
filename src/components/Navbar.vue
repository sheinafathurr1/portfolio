<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isDark = ref(true)
const isMenuOpen = ref(false) // State untuk mendeteksi apakah menu HP terbuka

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

onMounted(() => {
  if (localStorage.theme === 'light') {
    isDark.value = false
    document.documentElement.classList.remove('dark')
  } else {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  }
})
</script>

<template>
  <nav
    class="fixed w-full top-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 z-50 transition-colors duration-300"
  >
    <div class="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
      <!-- Logo -->
      <a
        href="#"
        @click="closeMenu"
        class="text-xl font-bold text-gray-900 dark:text-white tracking-wider transition-colors z-50 relative"
      >
        SWITCH<span class="text-blue-500">.</span>
      </a>

      <!-- Menu Desktop -->
      <div class="hidden md:flex gap-6 text-gray-600 dark:text-gray-300 font-medium items-center">
        <a href="#about" class="hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          >Tentang</a
        >
        <a href="#experience" class="hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          >Pengalaman</a
        >
        <a href="#skills" class="hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          >Keahlian</a
        >
        <a href="#projects" class="hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          >Proyek</a
        >

        <!-- Tombol Download CV (Desktop) -->
        <a
          href="/cv-switch.pdf"
          target="_blank"
          class="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 px-4 py-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          CV
        </a>
      </div>

      <!-- Kumpulan Tombol Kanan (Mode Gelap & Hubungi Saya & Hamburger) -->
      <div class="flex items-center gap-3 z-50 relative">
        <!-- Tombol Toggle Tema -->
        <button
          @click="toggleTheme"
          class="p-2 rounded-lg bg-white/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
        >
          <svg
            v-if="!isDark"
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.22 4.22a1 1 0 011.415 0l.884.884a1 1 0 01-1.414 1.415l-.884-.884a1 1 0 010-1.415zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zm-4.22 4.22a1 1 0 010 1.415l-.884.884a1 1 0 01-1.414-1.415l.884-.884a1 1 0 011.415 0zM10 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-4.22-4.22a1 1 0 01-1.415 0l-.884-.884a1 1 0 011.414-1.415l.884.884a1 1 0 010 1.415zM2 10a1 1 0 011-1h1a1 1 0 110 2H3a1 1 0 01-1-1zm4.22-4.22a1 1 0 010-1.415l.884-.884a1 1 0 011.414 1.415l-.884.884a1 1 0 01-1.415 0zM10 6a4 4 0 100 8 4 4 0 000-8z"
              clip-rule="evenodd"
            />
          </svg>
        </button>

        <!-- Tombol CTA (Disembunyikan di layar HP terkecil) -->
        <a
          href="#contact"
          @click="closeMenu"
          class="hidden sm:block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors text-sm shadow-md"
        >
          Hubungi Saya
        </a>

        <!-- Tombol Hamburger Mobile -->
        <button
          @click="toggleMenu"
          class="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
        >
          <svg
            v-if="!isMenuOpen"
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Dropdown Menu Mobile -->
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
        class="md:hidden absolute top-full left-0 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-xl"
      >
        <div class="flex flex-col px-4 py-6 space-y-4 text-center">
          <a
            href="#about"
            @click="closeMenu"
            class="text-gray-700 dark:text-gray-300 font-medium hover:text-blue-500 transition-colors"
            >Tentang</a
          >
          <a
            href="#experience"
            @click="closeMenu"
            class="text-gray-700 dark:text-gray-300 font-medium hover:text-blue-500 transition-colors"
            >Pengalaman</a
          >
          <a
            href="#skills"
            @click="closeMenu"
            class="text-gray-700 dark:text-gray-300 font-medium hover:text-blue-500 transition-colors"
            >Keahlian</a
          >
          <a
            href="#projects"
            @click="closeMenu"
            class="text-gray-700 dark:text-gray-300 font-medium hover:text-blue-500 transition-colors"
            >Proyek</a
          >

          <div class="h-px bg-gray-200 dark:bg-gray-800 my-2"></div>

          <a
            href="/cv-switch.pdf"
            target="_blank"
            @click="closeMenu"
            class="text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download CV
          </a>
          <a
            href="#contact"
            @click="closeMenu"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold w-full mt-2 sm:hidden"
          >
            Hubungi Saya
          </a>
        </div>
      </div>
    </transition>
  </nav>
</template>
