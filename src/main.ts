import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'

import AOS from 'aos'
import 'aos/dist/aos.css'

const app = createApp(App)

app.use(router)

app.mount('#app')

AOS.init({
  once: true, // Animasi hanya berjalan sekali (tidak berulang saat scroll ke atas)
  offset: 100, // Elemen akan mulai animasi ketika jaraknya 100px dari bawah layar
  duration: 800, // Durasi animasi dalam milidetik
  easing: 'ease-out-cubic', // Efek perlambatan di akhir animasi
})
