# portofolio

Portofolio Switch (Sheina Fathur) bertema **Persona 5 Royal**: seluruh situs tampil seperti menu game
(merah–hitam–putih, huruf ala *ransom note*, panel miring, transisi tebasan merah/hitam). Semua aset dibuat sendiri
dengan CSS/SVG + Google Fonts, tanpa gambar, logo, atau audio dari game aslinya. Seluruh teks di situs berbahasa **Inggris**.

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

Fitur interaktif:

- **Phan-Chat** (tombol 📱 Chat atau tombol `C`): ponsel dalam game, pengunjung memilih pertanyaan (klik atau `1`–`4`)
  dan Switch membalas dengan jawaban yang disusun dari `src/data/portfolio.ts`, lengkap dengan tombol pintas ke layar terkait.
- **Bond with Switch**: kunjungan pertama ke tiap bagian memunculkan notifikasi *RANK UP!*; ketujuh bagian = *MAX RANK*
  (dengan konfeti). Progres tersimpan di `localStorage` dan terlihat di menu (bintang di HUD, label *NEW* di menu).
- **All-Out Attack**: easter egg lewat kode Konami (`↑ ↑ ↓ ↓ ← → ← → B A`), mengetik `showtime`, atau pilihan di Phan-Chat.
- **Navigasi cepat**: `1`–`7` langsung ke bagian, `Q`/`E` bagian sebelumnya/berikutnya, tombol ◀ ▶ di bawah tiap
  bagian, dan geser kiri/kanan di ponsel.
- **Help** (tombol `?`): daftar kontrol, saklar SFX, dan reset bond.

Kontrol: `↑↓` / `W S` pilih, `Enter` buka, `Esc` kembali/tutup, `←→` ganti tab skill. Setiap layar punya URL sendiri
(`/#/status`, `/#/skill`, …) sehingga tombol *back* browser dan tautan langsung berfungsi. Efek suara (disintesis,
bukan file audio) mati secara default dan bisa dinyalakan lewat tombol **SFX**.

Struktur penting:

| Path | Isi |
| --- | --- |
| `src/data/portfolio.ts` | **Semua konten** (profil, pengalaman, proyek, skill, pencapaian, sosial). |
| `src/data/phantom.ts` | Lapisan tema P5R: menu (+ kalimat bond), Social Stats, Persona, Arcana confidant, naskah Phan-Chat. Ubah sesuka hati. |
| `src/screens/*.vue` | Satu file per layar (Title, MainMenu, Status, Persona, Skill, Confidant, Missions, Den, CallingCard). |
| `src/components/*.vue` | Komponen bersama: `RansomText`, `P5Background`, `ScreenShell`, `HintBar`, `MaskEmblem`, serta overlay `PhoneChat`, `HelpOverlay`, `AllOutAttack`, `RankUpToast`. |
| `src/composables/*.ts` | State kecil: navigasi, overlay, bond, chat, SFX. |
| `src/App.vue` | Pergantian layar, URL hash, transisi tebasan, shortcut global, dan notifikasi rank up. |

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
