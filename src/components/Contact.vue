<script setup lang="ts">
import { ref, computed } from 'vue'
import { burstConfetti } from '../utils/confetti'
import { socialLinks } from '../data/portfolio'

const formData = ref({
  name: '',
  email: '',
  message: '',
})

const maxChars = 500
const charCount = computed(() => formData.value.message.length)
const charRemaining = computed(() => maxChars - charCount.value)

const isSubmitting = ref(false)
const emailCopied = ref(false)
let emailCopyTimer: ReturnType<typeof setTimeout>
const submitBtnRef = ref<HTMLButtonElement | null>(null)

const toastVisible = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')
let toastTimer: ReturnType<typeof setTimeout>

const showToast = (msg: string, type: 'success' | 'error') => {
  clearTimeout(toastTimer)
  toastMessage.value = msg
  toastType.value = type
  toastVisible.value = true
  toastTimer = setTimeout(() => { toastVisible.value = false }, 4000)
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
      if (submitBtnRef.value) {
        const rect = submitBtnRef.value.getBoundingClientRect()
        burstConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2)
      }
    } else {
      showToast('Gagal mengirim pesan. Silakan coba lagi.', 'error')
    }
  } catch {
    showToast('Maaf, terjadi kesalahan. Silakan coba lagi.', 'error')
  } finally {
    isSubmitting.value = false
  }
}

const copyEmailToClipboard = () => {
  navigator.clipboard.writeText('sheinafathur@gmail.com').then(() => {
    clearTimeout(emailCopyTimer)
    emailCopied.value = true
    emailCopyTimer = setTimeout(() => { emailCopied.value = false }, 2500)
  }).catch(() => {})
}

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
        <span class="section-badge mb-3">
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
      <div data-aos="fade-up" data-aos-delay="100" class="flex justify-center gap-4 mb-6 flex-wrap">
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

      <!-- Copy email chip -->
      <div data-aos="fade-up" data-aos-delay="150" class="flex justify-center mb-10">
        <button
          @click="copyEmailToClipboard"
          :class="[
            'flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono font-semibold transition-all duration-300 hover:-translate-y-0.5',
            emailCopied
              ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-500/20 shadow-sm shadow-green-500/10'
              : 'bg-gray-100 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400',
          ]"
        >
          <svg v-if="!emailCopied" xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          {{ emailCopied ? 'Email tersalin!' : 'sheinafathur@gmail.com' }}
        </button>
      </div>

      <!-- Contact Form -->
      <div data-aos="zoom-in" data-aos-delay="150">
        <form
          @submit.prevent="submitForm"
          class="glass-card p-8 rounded-2xl shadow-xl shadow-black/5 dark:shadow-black/20 transition-colors"
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
            <div class="flex items-center justify-between mb-2">
              <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pesan</label>
            </div>
            <textarea
              v-model="formData.message"
              rows="5"
              required
              :maxlength="maxChars"
              class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-500 outline-none transition-all resize-none text-sm placeholder:text-gray-400"
              placeholder="Halo, saya tertarik untuk berdiskusi mengenai..."
            ></textarea>
            <!-- Char counter -->
            <div class="flex justify-end mt-1.5">
              <span
                :class="[
                  'text-xs font-mono transition-colors',
                  charRemaining <= 0
                    ? 'text-red-500'
                    : charRemaining <= 50
                      ? 'text-amber-500'
                      : 'text-gray-400 dark:text-gray-600',
                ]"
              >
                {{ charCount }}/{{ maxChars }}
              </span>
            </div>
          </div>

          <button
            ref="submitBtnRef"
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
          &copy; {{ new Date().getFullYear() }} <span class="text-gray-600 dark:text-gray-400 font-semibold">Switch</span>. Dibangun dengan Vue 3 &amp; Tailwind CSS.
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
