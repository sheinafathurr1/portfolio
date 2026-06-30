<script setup lang="ts">
import { ref } from 'vue'

const formData = ref({
  name: '',
  email: '',
  message: '',
})

const isSubmitting = ref(false)
const isSuccess = ref(false)

// Taruh Access Key dari Web3Forms di sini
const accessKey = '1a9ce086-062c-4623-aa28-623947941fc4'

const submitForm = async () => {
  isSubmitting.value = true

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        access_key: accessKey,
        ...formData.value,
      }),
    })

    const result = await response.json()
    if (result.success) {
      isSuccess.value = true
      // Kosongkan form setelah berhasil
      formData.value = { name: '', email: '', message: '' }
      // Hilangkan pesan sukses setelah 5 detik
      setTimeout(() => {
        isSuccess.value = false
      }, 5000)
    }
  } catch (error) {
    console.error('Error submitting form:', error)
    alert('Maaf, terjadi kesalahan. Silakan coba lagi.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <footer
    id="contact"
    class="bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm pt-24 pb-10 border-t border-gray-200/50 dark:border-gray-800/50 px-4 transition-colors duration-300 relative z-10"
  >
    <div data-aos="zoom-in" class="max-w-4xl mx-auto text-center">
      <h2
        class="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-6 transition-colors"
      >
        Mari Berkolaborasi
      </h2>
      <p
        class="text-gray-700 dark:text-gray-400 mb-10 text-lg md:text-xl leading-relaxed transition-colors"
      >
        Baik untuk diskusi teknis mengenai infrastruktur server, eksplorasi AI, atau sekadar
        bertukar pikiran tentang teknologi terbaru. Kotak masuk saya selalu terbuka!
      </p>

      <form
        @submit.prevent="submitForm"
        class="max-w-2xl mx-auto text-left mb-16 bg-white/80 dark:bg-gray-900/60 backdrop-blur-md p-8 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg shadow-black/5 dark:shadow-black/20 transition-colors"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >Nama Lengkap</label
            >
            <input
              v-model="formData.name"
              type="text"
              required
              class="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >Email</label
            >
            <input
              v-model="formData.email"
              type="email"
              required
              class="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="john@example.com"
            />
          </div>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >Pesan</label
          >
          <textarea
            v-model="formData.message"
            rows="4"
            required
            class="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
            placeholder="Halo, saya tertarik untuk berdiskusi mengenai..."
          ></textarea>
        </div>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full relative group bg-blue-600 px-8 py-3 rounded-lg font-semibold text-white transition-all duration-300 hover:bg-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <span v-if="!isSubmitting">Kirim Pesan Sekarang</span>
          <span v-else class="flex items-center justify-center gap-2">
            <svg
              class="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Mengirim...
          </span>
        </button>

        <div
          v-if="isSuccess"
          class="mt-4 p-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-center font-medium border border-green-200 dark:border-green-800/50 transition-colors"
        >
          Pesan berhasil terkirim! Saya akan segera membalasnya.
        </div>
      </form>

      <div
        class="flex justify-center gap-8 border-t border-gray-200 dark:border-gray-800 pt-10 transition-colors"
      >
        <a
          href="https://github.com"
          target="_blank"
          class="text-gray-500 hover:text-blue-600 dark:hover:text-white transition-colors font-medium"
          >GitHub</a
        >
        <a
          href="https://linkedin.com"
          target="_blank"
          class="text-gray-500 hover:text-blue-600 dark:hover:text-white transition-colors font-medium"
          >LinkedIn</a
        >
      </div>

      <p class="text-gray-500 dark:text-gray-600 text-sm mt-10 transition-colors font-mono">
        &copy; {{ new Date().getFullYear() }} Switch. Dibangun dengan Vue 3 & Tailwind CSS.
      </p>
    </div>
  </footer>
</template>
