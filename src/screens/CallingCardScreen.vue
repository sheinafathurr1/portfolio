<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import ScreenShell from '../components/ScreenShell.vue'
import RansomText from '../components/RansomText.vue'
import MaskEmblem from '../components/MaskEmblem.vue'
import { clearRequest } from '../composables/requests'
import { sfx } from '../composables/sfx'
import { profile, socialLinks } from '../data/portfolio'
import { renderCallingCard } from '../utils/callingCard'
import { burstConfetti } from '../utils/confetti'

const ACCESS_KEY = '1a9ce086-062c-4623-aa28-623947941fc4' // Web3Forms public access key
const MAX_CHARS = 500
const PLACEHOLDER = 'I know you’re sitting on a big idea that hasn’t come to life yet. I’m coming to collaborate. Be ready.'

const form = ref({ name: '', email: '', message: '' })
const status = ref<'idle' | 'sending' | 'sent' | 'error'>('idle')
const copied = ref(false)
const submitBtn = ref<HTMLButtonElement | null>(null)
let resetTimer: ReturnType<typeof setTimeout>

const signature = computed(() => (form.value.name.trim() || 'Mysterious Visitor').slice(0, 24))
const preview = computed(() => form.value.message.trim() || PLACEHOLDER)

const submit = async () => {
  if (status.value === 'sending') return
  status.value = 'sending'
  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: ACCESS_KEY,
        subject: `Calling card from ${form.value.name}`,
        ...form.value,
      }),
    })
    const data = await res.json()
    if (!data.success) throw new Error(data.message)
    status.value = 'sent'
    sfx.slam()
    clearRequest('card')
    const rect = submitBtn.value?.getBoundingClientRect()
    if (rect) burstConfetti(rect.left + rect.width / 2, rect.top, 48, ['#e60012', '#0b0b0b', '#ffffff'])
    form.value = { name: '', email: '', message: '' }
    clearTimeout(resetTimer)
    resetTimer = setTimeout(() => { status.value = 'idle' }, 3200)
  } catch {
    status.value = 'error'
  }
}

const copyEmail = () => {
  navigator.clipboard.writeText(profile.email).then(() => {
    copied.value = true
    setTimeout(() => { copied.value = false }, 2200)
  }).catch(() => {})
}

// Export the live preview as a PNG the visitor can keep or share
const exporting = ref(false)
const exportFailed = ref(false)
const downloadCard = async () => {
  if (exporting.value) return
  exporting.value = true
  exportFailed.value = false
  try {
    const blob = await renderCallingCard({ message: preview.value, from: signature.value })
    if (!blob) throw new Error('canvas unavailable')
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `calling-card-${signature.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'phantom'}.png`
    document.body.appendChild(link)
    link.click()
    link.remove()
    setTimeout(() => URL.revokeObjectURL(url), 2000)
    sfx.confirm()
    clearRequest('forger')
  } catch {
    exportFailed.value = true
  } finally {
    exporting.value = false
  }
}

onUnmounted(() => clearTimeout(resetTimer))
</script>

<template>
  <ScreenShell title="CALLING CARD" subtitle="Let’s Collaborate" number="08" variant="red">
    <div class="cc">
      <!-- Form -->
      <form class="ccform p5-enter" @submit.prevent="submit">
        <p class="ccform__intro">
          Got a web or mobile project, an AI or IoT idea, or a research collaboration in mind? Write your calling card and I’ll answer it.
        </p>
        <label class="field">
          <span class="field__label">Name</span>
          <input v-model="form.name" type="text" required maxlength="60" autocomplete="name" placeholder="Your name" />
        </label>
        <label class="field">
          <span class="field__label">Email</span>
          <input v-model="form.email" type="email" required autocomplete="email" placeholder="you@email.com" />
        </label>
        <label class="field">
          <span class="field__label">
            Message
            <small :class="{ warn: form.message.length > MAX_CHARS - 50 }">{{ form.message.length }}/{{ MAX_CHARS }}</small>
          </span>
          <textarea v-model="form.message" required rows="5" :maxlength="MAX_CHARS" placeholder="Hi Switch, I’d like to talk about…"></textarea>
        </label>

        <button ref="submitBtn" type="submit" class="p5-btn ccform__send" :disabled="status === 'sending'">
          {{ status === 'sending' ? 'Sending…' : 'Send Card ▶' }}
        </button>
        <p v-if="status === 'error'" class="ccform__error" role="alert">The card didn’t go through. Try again, or reach out by email.</p>

        <div class="ccform__links">
          <a
            v-for="link in socialLinks"
            :key="link.label"
            :href="link.href"
            :target="link.href.startsWith('mailto') ? undefined : '_blank'"
            rel="noopener noreferrer"
            class="p5-btn p5-btn--light ccform__link"
          >
            <span v-html="link.icon"></span>{{ link.label }}
          </a>
          <button type="button" class="p5-btn p5-btn--red ccform__link" @click="copyEmail">
            {{ copied ? '✔ Copied' : 'Copy Email' }}
          </button>
        </div>
      </form>

      <!-- Live preview -->
      <div class="cc__side">
        <aside class="card p5-enter" style="--i: 1" aria-label="Calling card preview">
          <p class="card__label">— Calling Card —</p>
          <h2 class="card__to"><RansomText text="To Switch" :seed="3" size="clamp(1.8rem, 4.5vw, 2.6rem)" /></h2>
          <p class="card__body" :class="{ 'is-placeholder': !form.message.trim() }">{{ preview }}</p>
          <div class="card__sign">
            <span class="card__from">From</span>
            <RansomText :text="signature" :seed="signature.length + 9" size="clamp(1.1rem, 3vw, 1.5rem)" />
          </div>
          <MaskEmblem class="card__mask" />
        </aside>
        <div class="cc__export p5-enter" style="--i: 2">
          <button type="button" class="p5-btn" :disabled="exporting" @click="downloadCard">
            {{ exporting ? 'Forging…' : 'Download card as image ⬇' }}
          </button>
          <small v-if="exportFailed" role="alert">Couldn’t create the image in this browser.</small>
          <small v-else>Your message and name, as a PNG you can share.</small>
        </div>
      </div>
    </div>

    <!-- Success splash -->
    <Transition name="splash">
      <div v-if="status === 'sent'" class="splash" role="status">
        <div class="splash__burst" aria-hidden="true"></div>
        <RansomText text="Card Sent!" :seed="42" size="clamp(2.6rem, 9vw, 5.5rem)" />
        <p class="splash__sub">Thank you! A reply will be heading to your inbox soon.</p>
      </div>
    </Transition>
  </ScreenShell>
</template>

<style scoped>
.cc {
  display: grid;
  gap: 2rem;
}
@media (min-width: 960px) {
  .cc { grid-template-columns: 1.05fr 0.95fr; align-items: start; }
}

.ccform {
  display: grid;
  gap: 1rem;
  padding: 1.6rem 1.8rem 1.8rem;
  background: var(--ink);
  clip-path: polygon(0 1.5%, 100% 0, 98.5% 100%, 1% 98%);
}
.ccform__intro {
  margin: 0 0 0.4rem;
  font-size: 1.05rem;
  line-height: 1.6;
  color: #e5e5e5;
}
.field {
  display: grid;
  gap: 0.35rem;
}
.field__label {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-display);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--red);
}
.field__label small {
  font-family: var(--font-body);
  letter-spacing: 0.05em;
  color: var(--muted);
}
.field__label small.warn {
  color: var(--red);
}
.field input,
.field textarea {
  width: 100%;
  border: 0;
  border-bottom: 3px solid var(--paper);
  padding: 0.65rem 0.8rem;
  font-family: var(--font-body);
  font-size: 1.05rem;
  color: var(--ink);
  background: var(--paper);
  transform: skewX(-4deg);
  resize: vertical;
  outline: none;
  transition: box-shadow 0.15s ease;
}
.field input:focus,
.field textarea:focus {
  box-shadow: 6px 6px 0 var(--red);
}
.field input::placeholder,
.field textarea::placeholder {
  color: #888;
}
.ccform__send {
  justify-self: start;
  margin-top: 0.4rem;
  padding: 0.7em 2em;
  font-size: 1.3rem;
  background: var(--red);
}
.ccform__send:hover,
.ccform__send:focus-visible {
  background: var(--paper);
  color: var(--ink);
}
.ccform__error {
  margin: 0;
  font-weight: 600;
  color: #fca5a5;
}
.ccform__links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.6rem;
  padding-top: 1.2rem;
  border-top: 1px dashed rgba(255, 255, 255, 0.2);
}
.ccform__link {
  font-size: 0.9rem;
  padding: 0.5em 1.2em;
}
.ccform__link :deep(svg) {
  width: 1rem;
  height: 1rem;
}

/* ── The calling card itself ── */
.card {
  position: relative;
  padding: 2rem 2rem 2.4rem;
  color: var(--ink);
  background:
    radial-gradient(rgba(230, 0, 18, 0.18) 1.2px, transparent 1.6px) 0 0 / 10px 10px,
    var(--paper);
  clip-path: polygon(3% 0, 100% 3%, 97% 100%, 0 96%);
  transform: rotate(3deg);
  box-shadow: 14px 14px 0 var(--ink);
}
.cc__side {
  display: grid;
  gap: 1.6rem;
}
@media (min-width: 960px) {
  .cc__side { position: sticky; top: 1.5rem; }
}
.cc__export {
  display: grid;
  justify-items: start;
  gap: 0.4rem;
}
.cc__export small {
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--paper);
  text-shadow: 1px 1px 0 var(--ink);
}
.card__label {
  margin: 0 0 0.6rem;
  font-family: var(--font-type);
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--red);
}
.card__to {
  margin: 0 0 1rem;
  font-weight: 400;
}
.card__body {
  min-height: 6rem;
  margin: 0 0 1.4rem;
  font-family: var(--font-type);
  font-size: 1.1rem;
  line-height: 1.65;
  white-space: pre-wrap;
  word-break: break-word;
}
.card__body.is-placeholder {
  color: #555;
}
.card__sign {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.6rem;
}
.card__from {
  font-family: var(--font-marker);
  font-size: 1.2rem;
  color: var(--red);
}
.card__mask {
  position: absolute;
  right: 1.4rem;
  top: 1.4rem;
  width: 3.6rem;
  color: var(--red);
  opacity: 0.85;
}

/* ── Success splash ── */
.splash {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.2rem;
  padding: 1rem;
  text-align: center;
  background: rgba(11, 11, 11, 0.88);
}
.splash > :not(.splash__burst) {
  position: relative;
  animation: p5Pop 0.5s var(--snap) both;
}
.splash__burst {
  position: absolute;
  width: 110vmin;
  height: 110vmin;
  background: var(--red);
  clip-path: polygon(50% 0, 57% 30%, 85% 12%, 70% 40%, 100% 45%, 72% 58%, 92% 88%, 60% 72%, 50% 100%, 42% 70%, 10% 90%, 28% 58%, 0 48%, 30% 40%, 14% 10%, 44% 28%);
  animation: p5Spin 8s linear infinite;
}
.splash__sub {
  margin: 0;
  padding: 0.4rem 1.2rem;
  font-size: 1.1rem;
  font-weight: 600;
  background: var(--ink);
}
.splash-enter-active, .splash-leave-active { transition: opacity 0.25s ease; }
.splash-enter-from, .splash-leave-to { opacity: 0; }
</style>
