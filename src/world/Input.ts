const CAPTURED_KEYS = new Set([
  'KeyW', 'KeyA', 'KeyS', 'KeyD',
  'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
  'Space', 'ShiftLeft', 'ShiftRight',
])

/** Keyboard + on-screen joystick input. Movement is in world space: -z is "forward" (north). */
export class Input {
  enabled = false
  onRespawn: (() => void) | null = null

  private keys = new Set<string>()
  private joystick = { x: 0, y: 0 }
  private touchBoost = false
  private jumpQueued = false

  constructor() {
    window.addEventListener('keydown', this.handleDown)
    window.addEventListener('keyup', this.handleUp)
    window.addEventListener('blur', this.handleBlur)
  }

  private isTyping(e: KeyboardEvent) {
    const t = e.target as HTMLElement | null
    return !!t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)
  }

  private handleDown = (e: KeyboardEvent) => {
    if (!this.enabled || this.isTyping(e) || e.ctrlKey || e.metaKey || e.altKey) return
    if (CAPTURED_KEYS.has(e.code)) e.preventDefault()
    if (e.code === 'Space' && !e.repeat) this.jumpQueued = true
    if (e.code === 'KeyR' && !e.repeat) this.onRespawn?.()
    this.keys.add(e.code)
  }

  private handleUp = (e: KeyboardEvent) => {
    this.keys.delete(e.code)
  }

  private handleBlur = () => {
    this.keys.clear()
    this.joystick.x = 0
    this.joystick.y = 0
    this.touchBoost = false
  }

  /** x/y in -1..1, y positive = forward. */
  setJoystick(x: number, y: number) {
    this.joystick.x = x
    this.joystick.y = y
  }

  setBoost(active: boolean) {
    this.touchBoost = active
  }

  queueJump() {
    if (this.enabled) this.jumpQueued = true
  }

  consumeJump(): boolean {
    const queued = this.jumpQueued
    this.jumpQueued = false
    return queued
  }

  get boost(): boolean {
    return this.keys.has('ShiftLeft') || this.keys.has('ShiftRight') || this.touchBoost
  }

  /** Normalised move vector in world XZ, length ≤ 1. */
  get move(): { x: number; z: number } {
    if (!this.enabled) return { x: 0, z: 0 }
    const k = this.keys
    let x = (k.has('KeyD') || k.has('ArrowRight') ? 1 : 0) - (k.has('KeyA') || k.has('ArrowLeft') ? 1 : 0)
    let z = (k.has('KeyS') || k.has('ArrowDown') ? 1 : 0) - (k.has('KeyW') || k.has('ArrowUp') ? 1 : 0)
    x += this.joystick.x
    z -= this.joystick.y
    const len = Math.hypot(x, z)
    return len > 1 ? { x: x / len, z: z / len } : { x, z }
  }

  dispose() {
    window.removeEventListener('keydown', this.handleDown)
    window.removeEventListener('keyup', this.handleUp)
    window.removeEventListener('blur', this.handleBlur)
  }
}
