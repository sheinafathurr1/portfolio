# portofolio

Portofolio Switch (Sheina Fathur) dengan dua mode tampilan:

- **Dunia 3D (default)**: pulau interaktif berbasis [three.js](https://threejs.org/) + [cannon-es](https://github.com/pmndrs/cannon-es).
  Pengunjung menggelindingkan bot kecil (WASD/panah, Space lompat, Shift boost, R ulang; joystick di HP) ke tiap area:
  Tentang, Pengalaman, Keahlian (peti yang bisa ditabrak), Proyek, Pencapaian, dan Kontak. Ada 8 *data core* untuk dikumpulkan.
- **Versi klasik**: halaman scroll biasa. Bisa dibuka lewat tombol "Versi Klasik", dan otomatis dipakai bila browser
  tidak mendukung WebGL atau URL berisi anchor (mis. `/#projects`). Pilihan terakhir pengunjung diingat di `localStorage`.

Struktur penting:

| Path | Isi |
| --- | --- |
| `src/data/portfolio.ts` | **Semua konten** (profil, pengalaman, proyek, skill, pencapaian, sosial). Dipakai oleh kedua mode. |
| `src/world/layout.ts` | Posisi zona, ramp, platform, dan data core di pulau 3D. |
| `src/world/*.ts` | Scene 3D: `World` (renderer, loop, kamera), `Player`, `Environment`, `Zones`, `Props`. |
| `src/components/WorldExperience.vue` | UI mode 3D: layar intro, HUD, panel info zona, minimap, kontrol sentuh. |
| `src/components/ClassicPortfolio.vue` | Layout versi klasik. |

three.js hanya diunduh saat mode 3D dibuka (chunk terpisah ~180 kB gzip). Kualitas grafis (bloom, resolusi)
turun otomatis bila frame rate perangkat rendah.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
