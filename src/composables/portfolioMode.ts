import type { InjectionKey, Ref } from 'vue'

export type PortfolioMode = 'world' | 'classic'

export interface PortfolioModeApi {
  mode: Ref<PortfolioMode>
  /** Switch layouts; `section` scrolls the classic layout to that section id. */
  setMode: (mode: PortfolioMode, section?: string) => void
  /** False when the browser has no WebGL, so the 3D world can't be offered. */
  canUseWorld: boolean
}

export const PORTFOLIO_MODE: InjectionKey<PortfolioModeApi> = Symbol('portfolio-mode')

const STORAGE_KEY = 'portfolio-mode'

export function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

export function loadSavedMode(): PortfolioMode | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved === 'world' || saved === 'classic' ? saved : null
  } catch {
    return null
  }
}

export function saveMode(mode: PortfolioMode) {
  try {
    localStorage.setItem(STORAGE_KEY, mode)
  } catch {
    // Private mode / blocked storage: the choice just won't persist.
  }
}
