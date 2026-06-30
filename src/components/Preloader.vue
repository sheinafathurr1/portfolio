<script setup lang="ts">
import { ref, onMounted } from 'vue'

const visible = ref(true)
const barWidth = ref(0)

onMounted(() => {
  setTimeout(() => { barWidth.value = 100 }, 80)
  setTimeout(() => { visible.value = false }, 1700)
})
</script>

<template>
  <Transition name="preloader">
    <div
      v-if="visible"
      class="fixed inset-0 z-[9000] flex flex-col items-center justify-center bg-[#050813] select-none"
    >
      <!-- Glow -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Logo -->
      <div class="relative mb-8 text-2xl font-black tracking-widest">
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">SW</span>
        <span class="text-white">ITCH</span>
        <span class="text-blue-500">.</span>
      </div>

      <!-- Progress bar -->
      <div class="w-44 h-[2px] bg-gray-800/80 rounded-full overflow-hidden">
        <div
          class="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-violet-500 rounded-full"
          :style="{ width: `${barWidth}%`, transition: 'width 1.3s cubic-bezier(0.4, 0, 0.2, 1)' }"
        ></div>
      </div>

      <p class="mt-5 text-[10px] font-mono tracking-[0.35em] text-gray-600 uppercase">Memuat...</p>
    </div>
  </Transition>
</template>
