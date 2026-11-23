# JobHub Design System & UI Mockup Specification

Dokumen ini mendefinisikan panduan implementasi **Design System (Modern Flat 2.0 / Playful Bento)** untuk aplikasi **JobHub**, mencakup token visual, arsitektur komponen, serta representasi mockup layar sebelum tahap penulisan kode antarmuka.

---

## 1. Prinsip Utama Desain (Design Philosophy)

1. **Simple & Elegan**: 
   - Tidak ada bayangan blur pekat (*no heavy drop shadows*).
   - Menggunakan kanvas krem hangat (*Warm Oat Milk* `#F8F7F2`) untuk kenyamanan visual jangka panjang.
   - Jarak antar elemen (*whitespace*) yang lega dan proporsional.
2. **Profesional & Terpercaya**:
   - Tipografi sans-serif tebal dan tegas (*bold grotesque*).
   - Tombol aksi utama (*primary CTA*) menggunakan bentuk kapsul hitam arang (*Deep Obsidian* `#121212`) yang kokoh.
3. **Cheerful & Youthful**:
   - Aksen utama **Electric Lime** (`#B8F23E`) yang membawa simbol pertumbuhan (*growth*) dan optimisme.
   - Sudut kartu membulat empuk (`Radius.lg = 24px`) dan tombol serba kapsul (`Radius.full = 9999px`).
   - Ikon diagonal panah `( ↗ )` dan mikro-interaksi kenyal (*spring physics*).

---

## 2. Token Desain (Design Tokens)

### A. Palet Warna (Color Palette)

```
┌────────────────────────────────────────────────────────────────────────┐
│  CANVAS / BACKGROUND       SURFACE / CARDS        PRIMARY BRAND        │
│  ██████████████████        ██████████████████     ██████████████████   │
│  #F8F7F2 (Warm Milk)       #FFFFFF (Pure White)   #B8F23E (Lime)       │
├────────────────────────────────────────────────────────────────────────┤
│  DARK ANCHOR (CTA)         TEXT MUTED             BORDER / DIVIDER     │
│  ██████████████████        ██████████████████     ██████████████████   │
│  #121212 (Obsidian)        #6B6D66 (Warm Gray)    #ECE9DF (Subtle Line)│
└────────────────────────────────────────────────────────────────────────┘
```

| Token | Nilai Hex | Fungsi / Penggunaan |
|---|---|---|
| `background` | `#F8F7F2` | Latar belakang layar utama (tidak menyilaukan mata). |
| `card` | `#FFFFFF` | Latar belakang kartu modular bento standar. |
| `primary` | `#B8F23E` | Warna aksen brand (Electric Lime) untuk badge aktif & highlight. |
| `darkAnchor` | `#121212` | Tombol CTA utama (kapsul hitam), teks judul, dan kontras visual. |
| `textSecondary` | `#6B6D66` | Teks keterangan, lokasi, dan tanggal posting. |
| `border` | `#ECE9DF` | Garis tepi kartu halus (1px border, tanpa bayangan). |

#### Functional Category Badges (Untuk Tag Pekerjaan):
* **Tech / Software**: `#635BFF` (Royal Purple) · Latar Badge: `#F0EEFF`
* **Finance / Business**: `#F5C242` (Mustard Gold) · Latar Badge: `#FFF8E7`
* **Creative / Design**: `#B8F23E` (Lime Green) · Latar Badge: `#F4FDE5`
* **Urgent / Hot**: `#FF6B57` (Coral Red) · Latar Badge: `#FFF0ED`

### B. Ukuran Sudut (Radius Tokens)
* `Radius.sm` : `10px` (Input field & checkbox)
* `Radius.md` : `16px` (Modal & dropdown container)
* `Radius.lg` : `24px` (**Bento Cards** standar & job cards)
* `Radius.full`: `9999px` (**Pill Buttons**, badges, & avatar containers)

### C. Tipografi (Typography Hierarchy)
* **Display / Hero**: `32px` · ExtraBold (900) · e.g., `EXPLORE VACANCIES`
* **Section Title**: `20px` · Bold (700) · e.g., `Featured Jobs`, `Stages`
* **Card Headline**: `17px` · Bold (700) · e.g., `Senior Mobile Engineer`
* **Body Text**: `14px` · Regular (400) / Medium (500)
* **Metadata / Chips**: `12px` · SemiBold (600) · e.g., `$150k/yr`, `Remote`

---

## 3. Mockup Komponen Inti (Component Mockups)

### Komponen 1: Bento Job Card (Kartu Lowongan Kerja)
Kartu modular dengan sudut `rounded-3xl` (24px), logo lingkaran di kiri atas, tag pill, dan tombol bulat `↗`.

```
┌──────────────────────────────────────────────────────────────┐
│  ┌───┐                                                       │
│  │ G │  Google                                       ( ↗ )   │
│  └───┘  Mountain View, USA · Full-time                       │
│                                                              │
│  Software Development Engineer                               │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐  │
│  │ $150k - 180k │  │  ⚡ Remote   │  │  Mid / Senior L4   │  │
│  └──────────────┘  └──────────────┘  └────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

### Komponen 2: Quick Filter Pill Bar
Pill tombol horizontal yang dapat digulir. Item aktif diberi latar belakang **Electric Lime** (`#B8F23E`).

```
  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────
  │ ● All (48)   │  │ ⚡ Remote    │  │ 💻 Tech      │  │ 🎨 Design
  └──────────────┘  └──────────────┘  └──────────────┘  └──────────
   (Latar: Lime)     (Latar: Putih)    (Latar: Putih)
```

### Komponen 3: Interview Stages (Tahapan Rekrutmen - Gambar 5)
Visualisasi tahapan wawancara berjenjang dengan kartu berwarna solid:

```
┌──────────────────────────────────────────────────────────────┐
│  Stage 1                                              ( ↗ )  │
│  Resume Screening                                            │
│  Kesesuaian CV dengan kriteria utama dan ATS review          │
└──────────────────────────────────────────────────────────────┘ (Warna: Lilac/Purple)
                               ▼
┌──────────────────────────────────────────────────────────────┐
│  Stage 2                                              ( ↗ )  │
│  Recruiter Call (30 min)                                     │
│  Wawancara pengenalan budaya perusahaan dan ekspektasi gaji  │
└──────────────────────────────────────────────────────────────┘ (Warna: Coral/Salmon)
                               ▼
┌──────────────────────────────────────────────────────────────┐
│  Stage 3                                              ( ↗ )  │
│  Technical Assessment                                        │
│  Live coding React Native / Expo & diskusi arsitektur mobile │
└──────────────────────────────────────────────────────────────┘ (Warna: Mustard/Yellow)
```

### Komponen 4: Floating Pill Bottom Navigation
Bar navigasi bawah melayang (*floating capsule dock*):

```
        ┌────────────────────────────────────────────────┐
        │   [🏠 Home]    [💼 Jobs]    [🤖 AI]    [👤]    │
        └────────────────────────────────────────────────┘
           (Active: Lime Pill)
```

---

## 4. Mockup Layar Lengkap (Full Screen Mockups)

### Layar A: Home / Explore Vacancies Screen

```
┌──────────────────────────────────────────────────────────────┐
│ [9:41]                                             [🔋 100%] │
│                                                              │
│  (👤 Avatar)  Michel Clark                           (🔍)    │
│               Frontend Developer                             │
│                                                              │
│  EXPLORE                                                     │
│  VACANCIES                                      [⚡ Filters] │
│                                                              │
│  ┌──────┐ ┌────────────┐ ┌────────────┐ ┌────────────────┐   │
│  │ All  │ │ ⚡ Remote  │ │ 💻 Tech    │ │ 🎨 Design      │   │
│  └──────┘ └────────────┘ └────────────┘ └────────────────┘   │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ (🟣 Uber)                                       ( ↗ )  │  │
│  │ San Francisco, USA · Hybrid                            │  │
│  │                                                        │  │
│  │ Senior React Native Engineer                           │  │
│  │ [ $140k - 170k/yr ] [ Full-time ] [ 5+ Yrs ]           │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ (🟡 Amazon)                                     ( ↗ )  │  │
│  │ Seattle, WA · On-Site                                  │  │
│  │                                                        │  │
│  │ Mobile Solutions Architect                             │  │
│  │ [ $180k - 210k/yr ] [ Full-time ] [ Lead ]             │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ (🟢 Spotify)                                    ( ↗ )  │  │
│  │ Stockholm · Remote                                     │  │
│  │                                                        │  │
│  │ Product Mobile Designer (UI/UX)                        │  │
│  │ [ $115k - 135k/yr ] [ Contract ] [ Figma ]             │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│          ┌────────────────────────────────────────┐          │
│          │  [🏠 Home]   [💼 Jobs]   [🤖 AI]  [👤]  │          │
│          └────────────────────────────────────────┘          │
└──────────────────────────────────────────────────────────────┘
```

### Layar B: Job Details & Interview Stages Screen

```
┌──────────────────────────────────────────────────────────────┐
│  ( < Back )                                      ( 🔖 Save ) │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                          ┌───┐                         │  │
│  │                          │ a │ (Amazon Logo)           │  │
│  │                          └───┘                         │  │
│  │                         Amazon                         │  │
│  │             Software Development Engineer              │  │
│  │                 📍 California, USA                     │  │
│  │                                                        │  │
│  │     [ $150k - $200k ]    [ On-Site ]    [ 5+ Yrs ]     │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  Interview Stages (3 Steps)                                  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Stage 1                                         ( ↗ )  │  │
│  │ Resume Screen (Review Portofolio & Pengalaman)         │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Stage 2                                         ( ↗ )  │  │
│  │ Recruiter Phone Call (30 menit)                        │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Stage 3                                         ( ↗ )  │  │
│  │ Technical Assessment & System Design                   │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                 APPLY FOR THIS JOB                     │  │
│  └────────────────────────────────────────────────────────┘  │
│                 (Tombol Kapsul Hitam Pekat)                  │
└──────────────────────────────────────────────────────────────┘
```

---

## 5. Rencana Arsitektur Berkas Komponen di `jobhub-fe`

Setelah mockup ini Anda setujui, komponen akan kita susun ke dalam struktur modular:
```
jobhub-fe/
├── src/
│   ├── components/
│   │   ├── bento-job-card.tsx    <-- Kartu pekerjaan modular
│   │   ├── filter-pill-bar.tsx   <-- Bar filter horizontal
│   │   ├── interview-stages.tsx  <-- Komponen tahapan interview bertingkat
│   │   ├── floating-tab-bar.tsx  <-- Bottom nav kapsul melayang
│   │   └── ui/
│   │       ├── pill-button.tsx   <-- Tombol kapsul hitam (#121212)
│   │       └── badge-chip.tsx    <-- Tag kategori & gaji
│   ├── constants/
│   │   └── theme.ts              <-- Token warna & radius (sudah aktif)
│   └── app/
│       ├── (tabs)/
│       │   ├── index.tsx         <-- Explore Vacancies (Home)
│       │   ├── jobs.tsx          <-- Saved / Applied Jobs
│       │   ├── agent.tsx         <-- AI Career Assistant
│       │   └── profile.tsx       <-- User Profile
│       └── job/
│           └── [id].tsx          <-- Detail Pekerjaan & Apply
```
