<script setup lang="ts">
import { ref } from 'vue'

const formData = ref({
  name: '',
  email: '',
  message: '',
})

const isSubmitting = ref(false)

const toastVisible = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')
let toastTimer: ReturnType<typeof setTimeout>

const showToast = (msg: string, type: 'success' | 'error') => {
  clearTimeout(toastTimer)
  toastMessage.value = msg
  toastType.value = type
  toastVisible.value = true
  toastTimer = setTimeout(() => {
    toastVisible.value = false
  }, 4000)
}

const accessKey = '1a9ce086-062c-4623-aa28-623947941fc4'

const submitForm = async () => {
  isSubmitting.value = true
  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ access_key: accessKey, ...formData.value }),
    })
    const result = await response.json()
    if (result.success) {
      formData.value = { name: '', email: '', message: '' }
      showToast('Pesan berhasil terkirim! Saya akan segera membalasnya.', 'success')
    } else {
      showToast('Gagal mengirim pesan. Silakan coba lagi.', 'error')
    }
  } catch {
    showToast('Maaf, terjadi kesalahan. Silakan coba lagi.', 'error')
  } finally {
    isSubmitting.value = false
  }
}

const socialLinks = [
  {
    label: 'GitHub',
    href: 'https://github.com/sheinafathurr1',
    icon: `<svg fill="currentColor" viewBox="0 0 24 24" class="h-5 w-5"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>`,
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/sheinafathur',
    icon: `<svg fill="currentColor" viewBox="0 0 24 24" class="h-5 w-5"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
  },
  {
    label: 'Email',
    href: 'mailto:sheinafathur@gmail.com',
    icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>`,
  },
]
</script>

<template>
  <footer
    id="contact"
    class="relative pt-24 pb-10 px-4 transition-colors duration-300 z-10 overflow-hidden"
  >
    <!-- Background gradient -->
    <div class="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-blue-500/10 dark:via-blue-500/5 dark:to-blue-500/10 pointer-events-none"></div>
    <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>

    <div class="relative max-w-4xl mx-auto">
      <!-- Header -->
      <div data-aos="fade-up" class="text-center mb-12">
        <span class="inline-block text-xs font-bold font-mono uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-3 bg-blue-50 dark:bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-200 dark:border-blue-500/20">
          Get in Touch
        </span>
        <h2 class="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 transition-colors">
          Mari Berkolaborasi
        </h2>
        <p class="text-gray-600 dark:text-gray-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
          Baik untuk diskusi teknis mengenai infrastruktur server, eksplorasi AI, atau sekadar
          bertukar pikiran tentang teknologi terbaru. Kotak masuk saya selalu terbuka!
        </p>
      </div>

      <!-- Social quick links -->
      <div data-aos="fade-up" data-aos-delay="100" class="flex justify-center gap-4 mb-12">
        <a
          v-for="social in socialLinks"
          :key="social.label"
          :href="social.href"
          :target="social.href.startsWith('mailto') ? undefined : '_blank'"
          rel="noopener noreferrer"
          class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white hover:border-blue-500 hover:bg-white dark:hover:bg-gray-700/70 transition-all duration-300 hover:-translate-y-0.5 text-sm font-medium shadow-sm"
        >
          <span v-html="social.icon"></span>
          {{ social.label }}
        </a>
      </div>

      <!-- Contact Form -->
      <div data-aos="zoom-in" data-aos-delay="150">
        <form
          @submit.prevent="submitForm"
          class="bg-white/80 dark:bg-gray-900/60 backdrop-blur-md p-8 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl shadow-black/5 dark:shadow-black/20 transition-colors"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Nama Lengkap</label>
              <input
                v-model="formData.name"
                type="text"
                required
                class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-500 outline-none transition-all text-sm placeholder:text-gray-400"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Email</label>
              <input
                v-model="formData.email"
                type="email"
                required
                class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-500 outline-none transition-all text-sm placeholder:text-gray-400"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div class="mb-6">
            <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Pesan</label>
            <textarea
              v-model="formData.message"
              rows="4"
              required
              class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-500 outline-none transition-all resize-none text-sm placeholder:text-gray-400"
              placeholder="Halo, saya tertarik untuk berdiskusi mengenai..."
            ></textarea>
          </div>

          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 px-8 py-3.5 rounded-xl font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
          >
            <svg v-if="!isSubmitting" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
            </svg>
            <svg v-else class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ isSubmitting ? 'Mengirim...' : 'Kirim Pesan' }}</span>
          </button>
        </form>
      </div>

      <!-- Footer bottom -->
      <div class="mt-12 pt-8 border-t border-gray-200/50 dark:border-gray-800/50 text-center">
        <p class="text-gray-400 dark:text-gray-600 text-sm font-mono">
          &copy; {{ new Date().getFullYear() }} <span class="text-gray-600 dark:text-gray-400 font-semibold">Switch</span>. Dibangun dengan Vue 3 & Tailwind CSS.
        </p>
      </div>
    </div>

    <!-- Toast notification -->
    <Transition name="toast">
      <div
        v-if="toastVisible"
        class="fixed bottom-6 left-0 right-0 flex justify-center pointer-events-none z-[200]"
      >
        <div
          :class="[
            'pointer-events-auto flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-semibold backdrop-blur-md border',
            toastType === 'success'
              ? 'bg-green-50/95 dark:bg-green-900/90 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700/50 shadow-green-500/20'
              : 'bg-red-50/95 dark:bg-red-900/90 text-red-800 dark:text-red-300 border-red-200 dark:border-red-700/50 shadow-red-500/20',
          ]"
        >
          <svg v-if="toastType === 'success'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          {{ toastMessage }}
          <button
            @click="toastVisible = false"
            class="ml-2 opacity-60 hover:opacity-100 transition-opacity"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </footer>
</template>
