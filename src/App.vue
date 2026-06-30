<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Navbar from './components/Navbar.vue'
import HeroSection from './components/HeroSection.vue'
import Experience from './components/Experience.vue'
import Skills from './components/Skills.vue'
import Projects from './components/Projects.vue'
import Contact from './components/Contact.vue'
import Stats from './components/Stats.vue'

const mouseX = ref(0)
const mouseY = ref(0)

const updateMousePosition = (e: MouseEvent) => {
  mouseX.value = e.clientX
  mouseY.value = e.clientY
}

onMounted(() => {
  window.addEventListener('mousemove', updateMousePosition)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', updateMousePosition)
})
</script>

<template>
  <div
    class="bg-gray-50 dark:bg-[#080c14] min-h-screen text-gray-900 dark:text-gray-100 selection:bg-blue-500/30 overflow-x-hidden transition-colors duration-300 relative"
  >
    <!-- Mouse spotlight -->
    <div
      class="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 hidden lg:block"
      :style="{
        background: `radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(59, 130, 246, 0.08), transparent 70%)`,
      }"
    ></div>

    <!-- Subtle dot grid -->
    <div
      class="fixed inset-0 z-0 pointer-events-none"
      style="
        background-image: radial-gradient(circle, #94a3b8 1px, transparent 1px);
        background-size: 28px 28px;
        opacity: 0.15;
      "
    ></div>
    <div
      class="dark:block hidden fixed inset-0 z-0 pointer-events-none"
      style="
        background-image: radial-gradient(circle, #1e40af 1px, transparent 1px);
        background-size: 28px 28px;
        opacity: 0.08;
      "
    ></div>

    <!-- Top-right decorative glow -->
    <div class="fixed top-0 right-0 w-[600px] h-[600px] pointer-events-none z-0 opacity-30 dark:opacity-20">
      <div class="absolute inset-0 bg-gradient-to-bl from-blue-500/30 to-transparent rounded-full blur-[120px]"></div>
    </div>
    <!-- Bottom-left decorative glow -->
    <div class="fixed bottom-0 left-0 w-[500px] h-[500px] pointer-events-none z-0 opacity-20 dark:opacity-15">
      <div class="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-transparent rounded-full blur-[100px]"></div>
    </div>

    <div class="relative z-10">
      <Navbar />
      <main>
        <HeroSection />
        <Stats />
        <Experience />
        <Skills />
        <Projects />
      </main>
      <Contact />
    </div>
  </div>
</template>
