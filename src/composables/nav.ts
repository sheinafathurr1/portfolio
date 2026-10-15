import type { InjectionKey, Ref } from 'vue'

export type SectionId = 'status' | 'persona' | 'skill' | 'confidant' | 'missions' | 'den' | 'card'
export type ScreenId = 'title' | 'menu' | SectionId

export interface Nav {
  current: Ref<ScreenId>
  goTo: (id: ScreenId) => void
  /** Section → menu, menu → title. */
  back: () => void
  /** Last highlighted main-menu entry, so the cursor stays put when you return (like the game). */
  menuIndex: Ref<number>
}

export const NAV: InjectionKey<Nav> = Symbol('nav')

/** Keys pressed while typing in a form field must not drive the game-style navigation. */
export function isTypingTarget(e: Event): boolean {
  const t = e.target as HTMLElement | null
  return !!t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)
}

/** Enter on a focused button/link already fires its click; don't handle it twice. */
export function isActivatable(e: Event): boolean {
  const t = e.target as HTMLElement | null
  return !!t?.closest('button, a, [role="button"]')
}
