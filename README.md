# portofolio

Portofolio Switch (Sheina Fathur) bertema **Persona 5 Royal**: seluruh situs tampil seperti menu game
(merah–hitam–putih, huruf ala *ransom note*, panel miring, transisi tebasan merah/hitam). Semua aset dibuat sendiri
dengan CSS/SVG + Google Fonts, tanpa gambar, logo, atau audio dari game aslinya.

| Menu game | Isi portofolio |
| --- | --- |
| Title screen | Kartu panggilan pembuka, "Press any key" |
| **STATUS** | Tentang saya, *Social Stats* (Knowledge, Guts, Proficiency, Kindness, Charm), catatan rekor |
| **PERSONA** | Empat peran sebagai Persona + Arcana; stats diambil dari level skill sungguhan |
| **SKILL** | Skill per kategori (tab ←/→) + daftar confidant/misi yang memakai skill itu |
| **CONFIDANT** | Pengalaman; rank naik 1 tiap 2 bulan kerja sama (maks. 10) |
| **MISSIONS** | Proyek & riset gaya *Mementos request* |
| **THIEVES DEN** | Galeri pencapaian + rencana yang sedang berjalan |
| **CALLING CARD** | Formulir kontak (Web3Forms) dengan pratinjau kartu panggilan langsung |

Kontrol: `↑↓` / `W S` pilih, `Enter` buka, `Esc` kembali, `←→` ganti tab skill. Setiap layar punya URL sendiri
(`/#/status`, `/#/skill`, …) sehingga tombol *back* browser dan tautan langsung berfungsi. Efek suara (disintesis,
bukan file audio) mati secara default dan bisa dinyalakan lewat tombol **SFX**.

Struktur penting:

| Path | Isi |
| --- | --- |
| `src/data/portfolio.ts` | **Semua konten** (profil, pengalaman, proyek, skill, pencapaian, sosial). |
| `src/data/phantom.ts` | Lapisan tema P5R: menu, Social Stats, Persona, Arcana confidant. Ubah sesuka hati. |
| `src/screens/*.vue` | Satu file per layar (Title, MainMenu, Status, Persona, Skill, Confidant, Missions, Den, CallingCard). |
| `src/components/*.vue` | Komponen bersama: `RansomText`, `P5Background`, `ScreenShell`, `HintBar`, `MaskEmblem`. |
| `src/App.vue` | Pergantian layar, URL hash, dan transisi tebasan. |

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
