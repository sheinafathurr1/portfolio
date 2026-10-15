<script setup lang="ts">
import { inject, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { NAV, isTypingTarget, type SectionId } from '../composables/nav'
import { closeOverlay, openOverlay, overlay } from '../composables/overlay'
import { sfx } from '../composables/sfx'
import { ask, choices, messages, resetChat, startChat, typing } from '../composables/chat'
import type { ChatTopic } from '../data/phantom'
import { profile } from '../data/portfolio'

const nav = inject(NAV)
const log = ref<HTMLElement | null>(null)
const closeBtn = ref<HTMLButtonElement | null>(null)

const scrollDown = () =>
  nextTick(() => log.value?.scrollTo({ top: log.value.scrollHeight, behavior: 'smooth' }))
watch(() => messages.value.length, scrollDown)
watch(typing, scrollDown)

const pick = async (topic: ChatTopic) => {
  if (typing.value) return
  sfx.confirm()
  const effect = await ask(topic)
  // Only if the phone is still open; the visitor may have closed it while Switch was typing
  if (effect === 'attack') setTimeout(() => overlay.value === 'phone' && openOverlay('attack'), 600)
}

const go = (to: SectionId) => {
  sfx.confirm()
  closeOverlay()
  nav?.goTo(to)
}

const restart = () => {
  sfx.move()
  resetChat()
}

// Number keys pick a dialogue choice, like the game's 1–4 shortcuts
const onKey = (e: KeyboardEvent) => {
  if (isTypingTarget(e) || e.altKey || e.ctrlKey || e.metaKey) return
  const n = Number(e.key)
  const topic = Number.isInteger(n) ? choices.value[n - 1] : undefined
  if (topic) {
    e.preventDefault()
    pick(topic)
  }
}

onMounted(() => {
  startChat()
  scrollDown()
  closeBtn.value?.focus()
  window.addEventListener('keydown', onKey)
})
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div class="layer" role="dialog" aria-modal="true" aria-label="Phan-Chat with Switch" @click.self="closeOverlay">
    <div class="phone">
      <header class="phone__head">
        <span class="phone__avatar" aria-hidden="true">S</span>
        <div class="phone__title">
          <p class="phone__app">PHAN-CHAT</p>
          <p class="phone__who">{{ profile.alias }} <span>● online</span></p>
        </div>
        <button ref="closeBtn" class="phone__close" aria-label="Close chat" @click="closeOverlay">✕</button>
      </header>

      <div ref="log" class="phone__log" aria-live="polite">
        <div v-for="m in messages" :key="m.id" class="bubble" :class="`bubble--${m.from}`">
          <p>{{ m.text }}</p>
          <button v-if="m.action" class="bubble__action" @click="go(m.action.to)">{{ m.action.label }} ▶</button>
        </div>
        <div v-if="typing" class="bubble bubble--switch bubble--typing" aria-label="Switch is typing">
          <i></i><i></i><i></i>
        </div>
      </div>

      <div class="phone__choices">
        <template v-if="choices.length">
          <button v-for="(t, i) in choices" :key="t.id" class="choice" :style="{ '--i': i }" :disabled="typing" @click="pick(t)">
            <kbd>{{ i + 1 }}</kbd>{{ t.question }}
          </button>
        </template>
        <button v-else class="choice" :disabled="typing" @click="restart"><kbd>↺</kbd>That’s everything. Start over?</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.layer {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: grid;
  place-items: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.65);
  animation: fadeIn 0.2s ease both;
}
.phone {
  display: flex;
  flex-direction: column;
  width: min(94vw, 390px);
  height: min(86dvh, 700px);
  overflow: hidden;
  background: var(--ink);
  border: 4px solid var(--paper);
  border-radius: 30px;
  box-shadow: 14px 14px 0 var(--red);
  transform: rotate(-2deg);
  animation: p5Pop 0.4s var(--snap) both;
}

.phone__head {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.9rem 1rem 0.8rem;
  background: var(--red);
}
.phone__avatar {
  display: grid;
  place-items: center;
  width: 2.6rem;
  height: 2.6rem;
  flex-shrink: 0;
  font-family: var(--font-display);
  font-size: 1.5rem;
  color: var(--red);
  background: var(--paper);
  border: 3px solid var(--ink);
  border-radius: 50%;
}
.phone__title {
  flex: 1;
}
.phone__app {
  margin: 0;
  font-family: var(--font-display);
  letter-spacing: 0.18em;
}
.phone__who {
  margin: 0;
  font-weight: 600;
  font-size: 0.85rem;
}
.phone__who span {
  margin-left: 0.3rem;
  color: #bbf7d0;
}
.phone__close {
  border: 0;
  width: 2.2rem;
  height: 2.2rem;
  font-size: 1rem;
  color: var(--paper);
  background: var(--ink);
  clip-path: polygon(10% 0, 100% 8%, 90% 100%, 0 92%);
}

.phone__log {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 1rem 0.9rem;
  overflow-y: auto;
  background:
    radial-gradient(rgba(230, 0, 18, 0.18) 1px, transparent 1.4px) 0 0 / 9px 9px,
    #141414;
  scrollbar-width: thin;
}
.bubble {
  max-width: 82%;
  padding: 0.55rem 0.8rem;
  animation: bubbleIn 0.25s var(--snap) both;
}
.bubble p {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.45;
  white-space: pre-line;
}
.bubble--switch {
  align-self: flex-start;
  color: var(--ink);
  background: var(--paper);
  clip-path: polygon(0 0, 100% 4%, 97% 100%, 4% 94%);
}
.bubble--you {
  align-self: flex-end;
  color: var(--paper);
  background: var(--red);
  clip-path: polygon(3% 4%, 100% 0, 96% 94%, 0 100%);
}
.bubble__action {
  margin-top: 0.5rem;
  border: 0;
  padding: 0.2rem 0.7rem;
  font-family: var(--font-display);
  font-size: 0.85rem;
  letter-spacing: 0.06em;
  color: var(--paper);
  background: var(--ink);
  transform: skewX(-10deg);
}
.bubble__action:hover {
  background: var(--red);
}
.bubble--typing {
  display: flex;
  gap: 0.3rem;
  padding: 0.8rem 1rem;
}
.bubble--typing i {
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 50%;
  background: var(--ink);
  animation: dot 0.9s ease-in-out infinite;
}
.bubble--typing i:nth-child(2) { animation-delay: 0.15s; }
.bubble--typing i:nth-child(3) { animation-delay: 0.3s; }

.phone__choices {
  display: grid;
  gap: 0.45rem;
  padding: 0.8rem 0.8rem 1rem;
  background: var(--ink);
  border-top: 3px solid var(--red);
}
.choice {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  border: 2px solid var(--paper);
  padding: 0.45rem 0.8rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.92rem;
  color: var(--paper);
  background: var(--ink);
  transform: skewX(-8deg);
  animation: p5SlideIn 0.3s var(--snap) both;
  animation-delay: calc(var(--i, 0) * 50ms);
  transition: background-color 0.12s ease, color 0.12s ease, transform 0.15s var(--snap);
}
.choice:hover:not(:disabled),
.choice:focus-visible {
  color: var(--ink);
  background: var(--paper);
  transform: skewX(-8deg) translateX(6px);
}
.choice:disabled {
  opacity: 0.45;
  cursor: wait;
}
.choice kbd {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 1.4rem;
  height: 1.4rem;
  font-family: var(--font-display);
  font-size: 0.85rem;
  color: var(--paper);
  background: var(--red);
}

@keyframes fadeIn { from { opacity: 0; } }
@keyframes bubbleIn { from { opacity: 0; transform: translateY(8px) scale(0.92); } }
@keyframes dot { 50% { transform: translateY(-4px); opacity: 0.4; } }
</style>
