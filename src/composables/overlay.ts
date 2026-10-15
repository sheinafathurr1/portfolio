import { ref } from 'vue'

// Full-screen layers that sit on top of whatever screen is showing.
export type OverlayId = 'none' | 'phone' | 'help' | 'attack'

export const overlay = ref<OverlayId>('none')

export const openOverlay = (id: Exclude<OverlayId, 'none'>) => {
  overlay.value = id
}

export const closeOverlay = () => {
  overlay.value = 'none'
}
