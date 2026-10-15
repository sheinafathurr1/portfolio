import { MASK_PATH, MASK_VIEWBOX } from './mask'
import { RANSOM_FONTS, ransomWords } from './ransom'

// Renders the visitor's calling card as a 1200×630 PNG (a good size for sharing), in the same style as the page.
const W = 1200
const H = 630
const RED = '#e60012'
const INK = '#0b0b0b'
const PAPER = '#ffffff'

const rad = (deg: number) => (deg * Math.PI) / 180

async function ensureFonts() {
  if (!document.fonts) return
  const faces = RANSOM_FONTS.map((f) => `64px ${f}`)
  await Promise.all(faces.map((f) => document.fonts.load(f).catch(() => [])))
}

function background(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = RED
  ctx.fillRect(0, 0, W, H)

  // Sunburst rays from behind the card
  ctx.save()
  ctx.translate(W * 0.42, H * 0.5)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.13)'
  for (let i = 0; i < 18; i++) {
    ctx.rotate(rad(20))
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(1400, -120)
    ctx.lineTo(1400, 120)
    ctx.closePath()
    ctx.fill()
  }
  ctx.restore()

  // Halftone dots fading in from the right
  for (let y = 8; y < H; y += 16) {
    for (let x = W * 0.55; x < W; x += 16) {
      const r = 1 + ((x - W * 0.55) / (W * 0.45)) * 3
      ctx.fillStyle = 'rgba(0, 0, 0, 0.16)'
      ctx.beginPath()
      ctx.arc(x + ((y / 16) % 2) * 8, y, r, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // Black slab across the bottom
  ctx.fillStyle = INK
  ctx.beginPath()
  ctx.moveTo(0, H * 0.86)
  ctx.lineTo(W, H * 0.66)
  ctx.lineTo(W, H)
  ctx.lineTo(0, H)
  ctx.closePath()
  ctx.fill()
}

const letterWidth = (ctx: CanvasRenderingContext2D, ch: string, font: string, size: number) => {
  ctx.font = `400 ${size}px ${font}`
  return ctx.measureText(ch.toUpperCase()).width + size * 0.26
}

function ransomWidth(ctx: CanvasRenderingContext2D, text: string, seed: number, size: number) {
  const words = ransomWords(text, seed)
  const letters = words.flat().reduce((sum, l) => sum + letterWidth(ctx, l.ch, l.font, size) + size * 0.05, 0)
  return letters + Math.max(0, words.length - 1) * size * 0.32
}

/** Draws ransom letters starting at (x, y = vertical centre); returns the width used. */
function ransom(ctx: CanvasRenderingContext2D, text: string, seed: number, size: number, x: number, y: number) {
  let cx = x
  for (const word of ransomWords(text, seed)) {
    for (const l of word) {
      const w = letterWidth(ctx, l.ch, l.font, size)
      const h = size * 1.1
      ctx.save()
      ctx.translate(cx + w / 2, y + l.shiftY * size)
      ctx.rotate(rad(l.rotate))
      ctx.scale(l.scale, l.scale)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.55)'
      ctx.fillRect(-w / 2 + size * 0.06, -h / 2 + size * 0.06, w, h)
      ctx.fillStyle = l.background
      ctx.fillRect(-w / 2, -h / 2, w, h)
      ctx.fillStyle = l.color
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(l.ch.toUpperCase(), 0, size * 0.04)
      ctx.restore()
      cx += w + size * 0.05
    }
    cx += size * 0.32
  }
  return cx - x
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number) {
  const lines: string[] = []
  let line = ''
  for (const word of text.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = next
    }
  }
  if (line) lines.push(line)
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines)
    kept[maxLines - 1] = `${kept[maxLines - 1]!.replace(/\s+\S*$/, '')}…`
    return kept
  }
  return lines
}

export async function renderCallingCard({ message, from }: { message: string; from: string }): Promise<Blob | null> {
  await ensureFonts()
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  background(ctx)

  // The card itself: tilted paper with a hard black shadow
  const cw = 900
  const ch = 470
  ctx.save()
  ctx.translate(W * 0.47, H * 0.47)
  ctx.rotate(rad(-3))
  const card = new Path2D()
  card.moveTo(-cw / 2 + 24, -ch / 2)
  card.lineTo(cw / 2, -ch / 2 + 14)
  card.lineTo(cw / 2 - 26, ch / 2)
  card.lineTo(-cw / 2, ch / 2 - 18)
  card.closePath()
  ctx.save()
  ctx.translate(18, 18)
  ctx.fillStyle = INK
  ctx.fill(card)
  ctx.restore()
  ctx.fillStyle = PAPER
  ctx.fill(card)

  // Red dot texture inside the card
  ctx.save()
  ctx.clip(card)
  ctx.fillStyle = 'rgba(230, 0, 18, 0.16)'
  for (let y = -ch / 2; y < ch / 2; y += 12) {
    for (let x = -cw / 2; x < cw / 2; x += 12) {
      ctx.beginPath()
      ctx.arc(x, y, 1.4, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  ctx.restore()

  const left = -cw / 2 + 60
  let y = -ch / 2 + 62

  ctx.fillStyle = RED
  ctx.font = "24px 'Special Elite'"
  ctx.textBaseline = 'alphabetic'
  ctx.textAlign = 'left'
  if ('letterSpacing' in ctx) ctx.letterSpacing = '7px'
  ctx.fillText('— CALLING CARD —', left, y)
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0px'

  y += 64
  ransom(ctx, 'To Switch', 3, 66, left, y)

  // Message
  y += 78
  ctx.fillStyle = INK
  ctx.font = "27px 'Special Elite'"
  for (const line of wrap(ctx, message, cw - 140, 5)) {
    ctx.fillText(line, left, y)
    y += 38
  }

  // Signature
  const signY = ch / 2 - 62
  ctx.fillStyle = RED
  ctx.font = "30px 'Permanent Marker'"
  ctx.fillText('From', left, signY + 10)
  const signX = left + ctx.measureText('From').width + 22
  const room = cw / 2 - 70 - signX
  const signSize = Math.min(40, (40 * room) / ransomWidth(ctx, from, from.length + 9, 40))
  ransom(ctx, from, from.length + 9, signSize, signX, signY)

  // Mask emblem, top right
  const mask = new Path2D(MASK_PATH)
  ctx.save()
  ctx.translate(cw / 2 - 210, -ch / 2 + 36)
  ctx.rotate(rad(-8))
  const scale = 150 / MASK_VIEWBOX.width
  ctx.scale(scale, scale)
  ctx.fillStyle = INK
  ctx.fill(mask, 'evenodd')
  ctx.restore()

  ctx.restore()

  // Footer on the black slab
  ctx.fillStyle = PAPER
  ctx.font = "26px 'Anton'"
  ctx.textAlign = 'right'
  if ('letterSpacing' in ctx) ctx.letterSpacing = '4px'
  ctx.fillText('SWITCH · PHANTOM PORTFOLIO', W - 40, H - 34)

  return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
}
