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
| **THIEVES DEN** | Galeri pencapaian, rencana yang sedang berjalan, dan papan *Mementos Requests* |
| **BATTLE** | Mini-game: lawan Shadow bertema masalah developer dengan skill asli Switch |
| **CALLING CARD** | Formulir kontak (Web3Forms) dengan pratinjau kartu panggilan langsung |

Fitur interaktif:

- **Résumé mode** (`/#/resume`): CV satu halaman yang bersih untuk recruiter, tanpa elemen game, dan bisa langsung
  di-print / *Save as PDF* (tata letak print rapi, ±2 halaman A4). Bisa dibuka dari layar judul ("Skip the game"),
  tombol *Résumé / CV* di STATUS, Help, atau Phan-Chat. Kalau ingin menyediakan file PDF sendiri, taruh di `public/`
  dan isi `profile.cvUrl` di `src/data/portfolio.ts`; tombol *Download PDF* akan muncul otomatis.
- **Calling Card maker**: kartu panggilan di layar CALLING CARD bisa diunduh sebagai gambar PNG 1200×630
  (gaya yang sama dengan pratinjau, siap dibagikan).
- **Cuaca live Bandung** di widget kalender menu (Open-Meteo, tanpa API key, cache 30 menit). Saat hujan/badai,
  menu ikut turun hujan. Pratinjau kondisi lain dengan `?weather=rain` (atau `clear`, `cloudy`, `fog`, `snow`, `storm`).
- **Phan-Chat** (tombol 📱 Chat atau tombol `C`): ponsel dalam game, pengunjung memilih pertanyaan (klik atau `1`–`4`)
  dan Switch membalas dengan jawaban yang disusun dari `src/data/portfolio.ts`, lengkap dengan tombol pintas ke layar terkait.
  Termasuk ramalan tarot harian (kartu berganti tiap hari, waktu WIB) dan jalan pintas untuk recruiter.
- **Bond with Switch**: kunjungan pertama ke tiap bagian memunculkan notifikasi *RANK UP!*; kedelapan bagian = *MAX RANK*
  (dengan konfeti). Progres tersimpan di `localStorage` dan terlihat di menu (bintang di HUD, label *NEW* di menu).
- **Shadow Battle**: tiga Shadow (Spaghetti Code, Manual Busywork, Clunky Interface, dst.) masing-masing lemah
  terhadap satu elemen skill (PHYS = backend, PSY = AI, ELEC = frontend). Kena *weakness* → **DOWN** + **1 MORE**;
  salah pilih → Shadow bangun dan menyerang. Jatuhkan semuanya → **HOLD UP!** → All-Out Attack. Rekor giliran tercepat tersimpan.
- **Mementos Requests**: 10 tantangan untuk pengunjung (jelajahi semua bagian, ngobrol di Phan-Chat, menang battle,
  menang dalam satu giliran, kode rahasia, kirim/unduh calling card, ramalan, buka résumé, dll.) dengan notifikasi *REQUEST CLEARED!*.
  Daftarnya ada di Thieves Den; progres juga tampil di layar judul dan Help.
- **All-Out Attack**: easter egg lewat kode Konami (`↑ ↑ ↓ ↓ ← → ← → B A`), mengetik `showtime`, atau pilihan di Phan-Chat.
- **Navigasi cepat**: `1`–`8` langsung ke bagian, `Q`/`E` bagian sebelumnya/berikutnya, tombol ◀ ▶ di bawah tiap
  bagian, dan geser kiri/kanan di ponsel.
- **Help** (tombol `?`): daftar kontrol, progres, saklar SFX & getar (haptics di ponsel), dan reset progres.
- Detail kecil: judul tab berubah jadi *"Take your time."* saat pengunjung pindah tab.

Kontrol: `↑↓` / `W S` pilih, `Enter` buka, `Esc` kembali/tutup, `←→` ganti tab skill. Setiap layar punya URL sendiri
(`/#/status`, `/#/skill`, …) sehingga tombol *back* browser dan tautan langsung berfungsi. Efek suara (disintesis,
bukan file audio) mati secara default dan bisa dinyalakan lewat tombol **SFX**.

Struktur penting:

| Path | Isi |
| --- | --- |
| `src/data/portfolio.ts` | **Semua konten** (profil, pengalaman, proyek, skill, pencapaian, sosial). |
| `src/data/phantom.ts` | Lapisan tema P5R: menu (+ kalimat bond), Social Stats, Persona, Arcana confidant, elemen skill, daftar Shadow, naskah Phan-Chat. Ubah sesuka hati. |
| `src/screens/*.vue` | Satu file per layar (Title, MainMenu, Status, Persona, Skill, Confidant, Missions, Den, Battle, CallingCard, Resume). |
| `src/utils/*.ts` | Generator huruf *ransom*, bentuk topeng, render kartu ke PNG, konfeti. |
| `src/components/*.vue` | Komponen bersama: `RansomText`, `P5Background`, `ScreenShell`, `HintBar`, `MaskEmblem`, serta overlay `PhoneChat`, `HelpOverlay`, `AllOutAttack`, `RankUpToast`, `RequestToast`. |
| `src/composables/*.ts` | State kecil: navigasi, overlay, bond, requests, antrean toast, chat, cuaca, SFX. |
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
