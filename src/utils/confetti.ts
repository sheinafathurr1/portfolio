const COLORS = ['#3b82f6', '#06b6d4', '#8b5cf6', '#f59e0b', '#10b981', '#ec4899']

export function burstConfetti(originX: number, originY: number, count = 36) {
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div')
    const size = 5 + Math.random() * 6
    const color = COLORS[Math.floor(Math.random() * COLORS.length)]
    const angle = Math.random() * Math.PI * 2
    const distance = 70 + Math.random() * 150
    const dx = Math.cos(angle) * distance
    const dy = Math.sin(angle) * distance - 50
    const rotate = Math.random() * 720 - 360
    const duration = 700 + Math.random() * 500
    const isCircle = Math.random() > 0.5

    el.style.cssText = `
      position: fixed;
      left: ${originX}px;
      top: ${originY}px;
      width: ${size}px;
      height: ${isCircle ? size : size * 2.4}px;
      background: ${color};
      border-radius: ${isCircle ? '50%' : '2px'};
      pointer-events: none;
      z-index: 9998;
      opacity: 1;
      transform: translate(-50%, -50%) rotate(0deg);
      transition: transform ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity ${duration}ms ease-in;
      will-change: transform, opacity;
    `
    document.body.appendChild(el)

    requestAnimationFrame(() => {
      el.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${rotate}deg)`
      el.style.opacity = '0'
    })

    setTimeout(() => el.remove(), duration + 120)
  }
}
