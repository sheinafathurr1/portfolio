// Ransom-note lettering shared by <RansomText> and the calling-card image export:
// every character gets its own font, colour block and tilt. A seed keeps the look stable.
export const RANSOM_FONTS = ["'Anton'", "'Archivo Black'", "'Abril Fatface'", "'Permanent Marker'", "'Special Elite'", "'Bebas Neue'"]

const LOOKS = [
  { background: '#ffffff', color: '#0b0b0b' },
  { background: '#0b0b0b', color: '#ffffff' },
  { background: '#e60012', color: '#ffffff' },
  { background: '#ffffff', color: '#e60012' },
  { background: '#0b0b0b', color: '#e60012' },
]

export interface RansomLetter {
  ch: string
  background: string
  color: string
  font: string
  /** degrees */
  rotate: number
  /** em */
  shiftY: number
  scale: number
}

function mulberry32(seed: number) {
  let s = seed
  return () => {
    s += 0x6d2b79f5
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Letters grouped per word, so lines can break between words. */
export function ransomWords(text: string, seed: number): RansomLetter[][] {
  const rand = mulberry32(seed)
  return text
    .split(/\s+/)
    .filter(Boolean)
    .map((word) =>
      [...word].map((ch) => {
        const look = LOOKS[Math.floor(rand() * LOOKS.length)] ?? LOOKS[0]!
        return {
          ch,
          ...look,
          font: RANSOM_FONTS[Math.floor(rand() * RANSOM_FONTS.length)] ?? RANSOM_FONTS[0]!,
          rotate: Number(((rand() - 0.5) * 16).toFixed(1)),
          shiftY: Number(((rand() - 0.5) * 0.14).toFixed(2)),
          scale: Number((0.88 + rand() * 0.26).toFixed(2)),
        }
      }),
    )
}
