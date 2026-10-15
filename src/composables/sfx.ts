import { ref, watch } from 'vue'

// Tiny synthesized UI sounds (no audio files). Off by default; visitors opt in from the title screen.
const STORAGE_KEY = 'p5-sfx'

const load = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'on'
  } catch {
    return false
  }
}

export const sfxEnabled = ref(load())

watch(sfxEnabled, (on) => {
  try {
    localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off')
  } catch {
    // storage blocked: the choice just won't persist
  }
})

let ctx: AudioContext | null = null

function tone(freq: number, duration: number, type: OscillatorType = 'square', delay = 0, volume = 0.035) {
  if (!sfxEnabled.value) return
  try {
    ctx ??= new AudioContext()
    const start = ctx.currentTime + delay
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, start)
    gain.gain.setValueAtTime(volume, start)
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)
    osc.connect(gain).connect(ctx.destination)
    osc.start(start)
    osc.stop(start + duration)
  } catch {
    // Audio unavailable; stay silent
  }
}

export const sfx = {
  move: () => tone(1320, 0.04),
  confirm: () => {
    tone(880, 0.06)
    tone(1320, 0.1, 'square', 0.06)
  },
  back: () => {
    tone(700, 0.05)
    tone(440, 0.08, 'square', 0.05)
  },
  slam: () => {
    tone(140, 0.28, 'sawtooth', 0, 0.06)
    tone(70, 0.35, 'square', 0.02, 0.05)
  },
}

export function toggleSfx() {
  sfxEnabled.value = !sfxEnabled.value
  if (sfxEnabled.value) sfx.confirm() // also unlocks the AudioContext inside this user gesture
}
