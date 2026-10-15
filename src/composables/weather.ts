import { computed, ref } from 'vue'

// Live weather for the menu's calendar widget, like the game's date display. Bandung, where Switch is based.
// Open-Meteo is free and needs no API key; on any failure the widget simply shows no weather.
// Preview a condition with ?weather=rain (or clear, cloudy, fog, snow, storm).
export type WeatherKind = 'clear' | 'cloudy' | 'fog' | 'rain' | 'snow' | 'storm'

export interface Weather {
  kind: WeatherKind
  label: string
  icon: string
  temp: number | null
}

const CITY = 'Bandung'
const API =
  'https://api.open-meteo.com/v1/forecast?latitude=-6.9175&longitude=107.6191&current=weather_code,temperature_2m,is_day&timezone=Asia%2FJakarta'
const CACHE_KEY = 'p5-weather'
const CACHE_MS = 30 * 60 * 1000

const LOOK: Record<WeatherKind, { label: string; icon: string }> = {
  clear: { label: 'Clear', icon: '☀' },
  cloudy: { label: 'Cloudy', icon: '☁' },
  fog: { label: 'Fog', icon: '≋' },
  rain: { label: 'Rain', icon: '☂' },
  snow: { label: 'Snow', icon: '❄' },
  storm: { label: 'Storm', icon: '⚡' },
}

/** WMO weather code → our handful of kinds */
function kindOf(code: number): WeatherKind {
  if (code === 0 || code === 1) return 'clear'
  if (code === 2 || code === 3) return 'cloudy'
  if (code === 45 || code === 48) return 'fog'
  if (code >= 95) return 'storm'
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'snow'
  return 'rain' // drizzle, rain, freezing rain, showers
}

const describe = (kind: WeatherKind, temp: number | null, isDay = true): Weather => ({
  kind,
  temp,
  label: LOOK[kind].label,
  icon: kind === 'clear' && !isDay ? '☾' : LOOK[kind].icon,
})

export const weather = ref<Weather | null>(null)
export const weatherCity = CITY
export const raining = computed(() => weather.value?.kind === 'rain' || weather.value?.kind === 'storm')

let started = false

export function loadWeather() {
  if (started) return
  started = true

  const forced = new URLSearchParams(window.location.search).get('weather')
  if (forced && forced in LOOK) {
    weather.value = describe(forced as WeatherKind, null)
    return
  }

  try {
    const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) ?? 'null') as { at: number; value: Weather } | null
    if (cached && Date.now() - cached.at < CACHE_MS) {
      weather.value = cached.value
      return
    }
  } catch {
    // no cache available
  }

  fetch(API)
    .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
    .then((data: { current?: { weather_code?: number; temperature_2m?: number; is_day?: number } }) => {
      const code = data.current?.weather_code
      if (typeof code !== 'number') return
      const temp = data.current?.temperature_2m
      weather.value = describe(kindOf(code), typeof temp === 'number' ? Math.round(temp) : null, data.current?.is_day !== 0)
      try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), value: weather.value }))
      } catch {
        // storage blocked: we'll just fetch again next time
      }
    })
    .catch(() => {
      // offline or blocked: no weather shown
    })
}
