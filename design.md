# Dompety Landing Page — Design & Technical Specification

Dokumen spesifikasi desain dan arsitektur landing page konversi tinggi untuk aplikasi mobile **Dompety** (Google Play Store: `com.bangkit16.dompety`).

---

## 1. Brand Identity & Visual Tokens

### 1.1 Brand Essence
* **App Name:** Dompety
* **Tagline Resmi:** *"Quiet confidence for your money"* / *"Kelola Keuangan Pintar Tanpa Ribet"*
* **App Slug / Package ID:** `com.bangkit16.dompety`
* **Brand Tone:** Tenang, elegan, terpercaya, modern, bersahabat dengan maskot *Dompety*.

### 1.2 Color Palette (Diekstrak dari `src/theme/colors.ts`)

| Token Name | Hex Code | Deskripsi & Peruntukan |
| :--- | :--- | :--- |
| **Primary (Dark Green)** | `#0a2505` | Brand core, button CTA utama, headline gelap |
| **Hero Gradient Start** | `#102010` | Latar belakang hero dark mode & icon adaptive |
| **Hero Gradient Mid** | `#0a430a` | Gradasi aksen hero banner |
| **Hero Gradient End** | `#034903` | Gradasi aksen hero banner |
| **Secondary (Sage Green)** | `#4c7e47` | Sub-headline, secondary badges, icon container |
| **Accent / Success** | `#10b981` / `#34C759` | Status surplus, indikator hemat, konfirmasi |
| **Warning / Pro Gold** | `#F59E0B` / `#FEF08A` | Badge Pro, bintang rating, diskon paket tahunan |
| **Pro Gold Text** | `#B45309` / `#78350F` | Teks badge Pro VIP |
| **Surface Light** | `#fbf8fb` | Background utama landing page (light mode) |
| **Card Light** | `#F2F2F7` | Kartu fitur, container FAQ |
| **Border Light** | `#C6C6C8` / `#E5E7EB` | Garis pembatas kartu & input |
| **Text Primary** | `#000000` / `#051125` | Teks utama judul & bodi |
| **Text Muted** | `#71717a` / `#6B7280` | Deskripsi pelengkap, caption, footer note |
| **Dark Mode Background** | `#000000` / `#101013` | Basis tema gelap |
| **Dark Mode Card** | `#1C1C1E` | Kartu pada tema gelap |

### 1.3 Typography Scale (Diekstrak dari `src/constants/theme.ts`)
* **Font Family:** `Poppins`, `Inter`, atau `System UI Sans`
* **Display Hero:** 48px – 56px (Bold 700, Line Height 1.15)
* **Section Heading:** 32px – 36px (Bold 700, Line Height 1.2)
* **Card Title:** 18px – 20px (SemiBold 600, Line Height 1.3)
* **Body Text:** 15px – 16px (Regular 400, Line Height 1.6)
* **Caption / Badge:** 12px – 13px (Medium 500, Letter Spacing +0.5px)

### 1.4 Elevation & Border Radius
* **Border Radius:** Kartu `16px` – `20px`, Button `12px` – `9999px (Pill)`
* **Shadow:** `0 10px 24px rgba(5, 17, 37, 0.08)` (Material Hero Card Elevation)

---

## 2. Dedicated Mascot Placeholder Slots ("Dompety")

Karakter maskot **Dompety** (dompet hidup ramah berwarna hijau khas dengan ekspresi ekspresif) ditempatkan pada titik-titik krusial landing page:

```
+-----------------------------------------------------------------------------------+
| [SLOT MASCOT 1: DOMPETY_HERO_WELCOMING]                                           |
| Posisi: Hero Section (Kanan atas mockup HP)                                       |
| Karakter: Melambaikan tangan menyapa user dengan koin emas melayang di sekitar.  |
| Dimensi: 360x360 px (PNG Transparent / WebP / SVG Vector)                         |
+-----------------------------------------------------------------------------------+

+-----------------------------------------------------------------------------------+
| [SLOT MASCOT 2: DOMPETY_AI_ASSISTANT]                                             |
| Posisi: Fitur AI Voice & Text (Samping demo chat suara)                           |
| Karakter: Memakai headphone / mikrofon kecil, mencatat nota dengan pensil kilat.  |
| Dimensi: 320x320 px                                                               |
+-----------------------------------------------------------------------------------+

+-----------------------------------------------------------------------------------+
| [SLOT MASCOT 3: DOMPETY_MULTI_ACCOUNT]                                            |
| Posisi: Fitur Multi-Rekening & Transfer                                           |
| Karakter: Memegang kartu bank & smartphone, menyulap koin antar dompet.           |
| Dimensi: 300x300 px                                                               |
+-----------------------------------------------------------------------------------+

+-----------------------------------------------------------------------------------+
| [SLOT MASCOT 4: DOMPETY_ANALYTICS]                                                |
| Posisi: Fitur Grafik & Analitik Pengeluaran                                       |
| Karakter: Memakai kacamata detektif dengan kaca pembesar menatap grafik diagram.  |
| Dimensi: 300x300 px                                                               |
+-----------------------------------------------------------------------------------+

+-----------------------------------------------------------------------------------+
| [SLOT MASCOT 5: DOMPETY_PRO_CROWN]                                                |
| Posisi: Pricing Card Section (Tier Tahunan / Pro VIP)                             |
| Karakter: Memakai mahkota emas berkilau dan membawa lencana "PRO" berpita hijau.  |
| Dimensi: 280x280 px                                                               |
+-----------------------------------------------------------------------------------+

+-----------------------------------------------------------------------------------+
| [SLOT MASCOT 6: DOMPETY_SECURITY]                                                 |
| Posisi: Trust, Security & Privacy Section                                         |
| Karakter: Berdiri kokoh membawa perisai hijau berlogo gembok keamanan data.       |
| Dimensi: 260x260 px                                                               |
+-----------------------------------------------------------------------------------+

+-----------------------------------------------------------------------------------+
| [SLOT MASCOT 7: DOMPETY_CELEBRATION]                                              |
| Posisi: Bottom CTA Pre-Footer                                                     |
| Karakter: Melompat gembira merayakan kebebasan finansial bebas stres finansial.   |
| Dimensi: 340x340 px                                                               |
+-----------------------------------------------------------------------------------+
```

---

## 3. Struktur Halaman & Konten (Play Store Ready Landing Page)

### 3.1 Sticky Navigation Bar
* **Kiri:** Logo Dompety (`assets/images/logo-dompety.png`) + Text Brand `Dompety`
* **Tengah:** Link Navigasi:
  * Fitur AI (`#fitur-ai`)
  * Multi-Akun (`#multi-akun`)
  * Analitik (`#analitik`)
  * Harga (`#harga`)
  * FAQ (`#faq`)
* **Kanan:**
  * Tombol CTA: *"Download APK / Play Store"* (Tombol warna `#0a2505` dengan icon Google Play)

---

### 3.2 Hero Section (First Fold Conversion)
* **Headline:** *"Catat Keuangan Cukup Bicara, Biarkan AI yang Bekerja."*
* **Subheadline:** *"Dompety adalah asisten finansial cerdas yang mengubah ucapan dan ketikan santaimu menjadi pencatatan keuangan instan, rapi, dan otomatis terstruktur."*
* **Primary CTA:**
  * Tombol Resmi: **Get it on Google Play** (Badge resmi SVG Play Store).
  * URL Target: `https://play.google.com/store/apps/details?id=com.bangkit16.dompety`
* **Secondary Micro-Copy:**
  * *"Gratis selamanya • Tanpa kartu kredit • Aman & Terenkripsi"*
* **Visual Elements:**
  * Mockup Smartphone (Frame Android Modern menampilkan UI Dashboard Dompety).
  * Floating Card Preview: *"Makan siang Padang Rp25.000 (BCA)"* dengan status centang hijau.
  * **`[SLOT MASCOT 1: DOMPETY_HERO_WELCOMING]`** berada di samping mockup melambaikan tangan.

---

### 3.3 Social Proof & Trust Strip
Banner ringkas di bawah hero penambah keyakinan calon pengguna:
* **4.8+ Bintang** Kepuasan Pengguna
* **100% Data Terisolasi** (Supabase Row-Level Security)
* **Pengenalan Suara Cepat** (Native Speech Engine)
* **Zero Lag Reactive State** (Didukung Legend-State)

---

### 3.4 Feature Deep-Dives

#### Showcase 1: AI Voice & Natural Language Transaction
* **Kategori:** *Smart Input Technology*
* **Judul:** *"Bicara Santai, Transaksi Langsung Tercatat"*
* **Deskripsi:** *"Cukup tekan mikrofon dan ucapkan kalimat seperti 'Beli bensin 50 ribu pakai ShopeePay'. AI Dompety otomatis mendeteksi nominal, kategori pengeluaran, serta akun pembayaranmu dalam sekejap."*
* **Highlight Poin:**
  * Input suara instan via *Expo Speech Recognition*.
  * Deteksi transfer, pemasukan, dan pengeluaran secara cerdas.
  * Modal konfirmasi anti-salah sebelum data tersimpan permanen.
* **Slot Gambar:** **`[SLOT MASCOT 2: DOMPETY_AI_ASSISTANT]`**

#### Showcase 2: Natural Language Query — Tanya Keuangan ke Dompety
* **Kategori:** *Conversational Financial Insights*
* **Judul:** *"Tanya Pengeluaran Seperti Chat ke Teman Akrab"*
* **Deskripsi:** *"Penasaran ke mana uangmu habis? Tanya langsung ke Dompety tanpa perlu membuka puluhan menu."*
* **Contoh Pertanyaan yang Didukung:**
  * *"Berapa pengeluaran terbesar saya bulan ini?"*
  * *"Sisa saldo akun Mandiri berapa?"*
  * *"Kategori apa yang paling banyak keluar uang?"*
* **Komponen Visual:** Interactive chat-bubble mockup menunjukkan jawaban kalkulasi cerdas dari AI.

#### Showcase 3: Multi-Rekening, E-Wallet & Transfer Bersih
* **Kategori:** *Unified Balance Management*
* **Judul:** *"Semua Dompet, Bank & E-Wallet dalam Satu Kendali"*
* **Deskripsi:** *"Kelola saldo BCA, Mandiri, GoPay, OVO, Dana hingga uang tunai di dompet fisikmu. Catat perpindahan dana antar rekening dengan fitur transfer otomatis yang langsung menyeimbangkan saldo kedua akun."*
* **Highlight Poin:**
  * Multi-akun fleksibel (Bank, Dompet Digital, Kas Tunai).
  * Penyesuaian saldo (*Balance adjustment*) kapan saja jika ada selisih.
  * Riwayat transfer transparan tanpa double input.
* **Slot Gambar:** **`[SLOT MASCOT 3: DOMPETY_MULTI_ACCOUNT]`**

#### Showcase 4: Analitik Grafik & Kategori Finansial
* **Kategori:** *Financial Visualizer*
* **Judul:** *"Pahami Arus Kas Secara Visual Tanpa Pusing"*
* **Deskripsi:** *"Lihat ringkasan pemasukan vs pengeluaran bulananmu dalam grafik batang dan diagram kategori yang bersih dan mudah dibaca."*
* **Highlight Poin:**
  * Breakdown kategori warna-warni (Makanan, Transport, Tagihan, Belanja).
  * Ringkasan bulanan otomatis reset & perbandingan periode.
* **Slot Gambar:** **`[SLOT MASCOT 4: DOMPETY_ANALYTICS]`**

---

### 3.5 Skema Harga: Free vs Pro (Tabel Komparasi Transparan)
Data harga langsung diambil dari `PRO_PRICING` (`src/services/proService.ts`):

| Fitur | Dompety Free | Dompety Pro VIP |
| :--- | :---: | :---: |
| **Pencatatan Manual Transaksi** | Unlimited | Unlimited |
| **Multi-Rekening & E-Wallet** | Didukung | Didukung |
| **Kueri & Input Suara AI** | Kuota Harian (Reset tiap hari) | **Prioritas & Ekstra Kuota** |
| **Opsi Bonus Kuota AI** | Tonton Iklan Rewarded | **Bebas Kuota Tanpa Iklan** |
| **Iklan Banner Aplikasi** | Ada iklan ringan | **100% Bebas Iklan** |
| **Backup Cloud & Multi-Perangkat** | Ya (Supabase Cloud) | **Ya + Prioritas Dukungan** |
| **Harga** | **Gratis Rp0** | **Rp14.900 / bulan** atau **Rp129.000 / tahun** *(Hemat 28%)* |

* **Kartu Pro Highlight:**
  * Badge: `Hemat 28%` dengan label `Tahunan`.
  * Garansi: *"Dapat dibatalkan kapan saja lewat Google Play Store subscriptions"*.
  * **Slot Gambar:** **`[SLOT MASCOT 5: DOMPETY_PRO_CROWN]`**

---

### 3.6 Keamanan, Privasi & Kepatuhan Google Play Store
Bagian wajib untuk membangun kredibilitas dan lolos audit Play Store:

1. **Privasi & Kepemilikan Data:**
   * Data finansial milik pengguna sepenuhnya.
   * Tidak ada penjualan data ke pihak ketiga atau broker pinjaman online.
2. **Arsitektur Keamanan:**
   * Supabase PostgreSQL dengan *Row Level Security (RLS)* — pengguna hanya dapat melihat datanya sendiri.
   * Google Sign-In OAuth 2.0 terenkripsi standar industri.
3. **Hak Penghapusan Akun (*Google Play Requirement*):**
   * Pengguna dapat menghapus akun dan seluruh riwayat transaksi secara permanen langsung dari aplikasi melalui menu Pengaturan.
4. **Slot Gambar:** **`[SLOT MASCOT 6: DOMPETY_SECURITY]`**

---

### 3.7 Tanya Jawab Sering Diajukan (FAQ)

* **Q: Apakah Dompety memerlukan izin akses ke rekening bank saya?**
  * *A: Tidak sama sekali. Dompety tidak pernah meminta password, PIN, atau kredensial perbankan Anda. Pencatatan dilakukan mandiri atau melalui perintah suara pintar.*
* **Q: Bagaimana cara kerja input suara AI?**
  * *A: Cukup tekan tombol mikrofon dan sebutkan transaksi Anda seperti berbicara normal. Teknologi speech-recognition dan AI kami akan langsung mengekstrak nominal, kategori, dan akun pembayaran.*
* **Q: Apakah saya bisa menggunakan aplikasi secara gratis?**
  * *A: Ya! Semua fitur pencatatan manual dan fitur dasar AI gratis selamanya. Tersedia juga fitur tonton iklan untuk menambah kuota AI gratis setiap hari.*
* **Q: Bagaimana jika saya berganti HP?**
  * *A: Cukup login dengan akun Google yang sama, seluruh akun dan riwayat transaksi Anda akan otomatis tersinkronisasi kembali.*
* **Q: Di mana saya bisa membaca Kebijakan Privasi dan Ketentuan Layanan?**
  * *A: Tautan lengkap tersedia di footer halaman ini dan dapat diakses publik kapan saja.*

---

### 3.8 Penutup & Call to Action Final
* **Heading:** *"Mulai Bangun Kebiasaan Finansial yang Tenang Hari Ini"*
* **Subheading:** *"Unduh Dompety sekarang di Google Play Store dan rasakan mudahnya mengatur uang dengan bantuan AI."*
* **Tombol:** Google Play Store Download Button (Primary Green `#0a2505` dengan border neon `#34C759`).
* **Slot Gambar:** **`[SLOT MASCOT 7: DOMPETY_CELEBRATION]`**

---

### 3.9 Footer & Tautan Legalitas Wajib Play Store
* **Kolom 1 - Brand:**
  * Logo Dompety + Deskripsi singkat *"Asisten finansial cerdas dengan sentuhan AI."*
  * Hak Cipta: `© 2026 Dompety by bangkit16. All rights reserved.`
* **Kolom 2 - Legal & Compliance:**
  * [Kebijakan Privasi (Privacy Policy)](https://bangkit16.github.io/dompety-privacy-policy)
  * [Ketentuan Layanan (Terms of Service)](https://bangkit16.github.io/dompety-privacy-policy/terms.html)
  * Permintaan Penghapusan Akun & Data (Petunjuk via aplikasi / email)
* **Kolom 3 - Teknis & Kontak:**
  * Versi: `1.0.0`
  * Package: `com.bangkit16.dompety`
  * Platform: Android 7.0+ (Google Play Store)
  * Kontak Pengembang: GitHub `@bangkit16`

---

## 4. Panduan Implementasi Teknis Landing Page

Untuk performa tinggi (SEO 100/100, Core Web Vitals hijau):
1. **Rekomendasi Stack Web:** Next.js / Astro / Tailwind CSS atau HTML5 statis.
2. **Format Gambar:** Semua slot karakter maskot Dompety menggunakan format `.webp` / `.svg` dengan `loading="lazy"` (kecuali Hero fold yang menggunakan `priority`).
3. **Responsive Breakpoints:**
   * Mobile (< 640px): 1 kolom kartu, menu hamburger, mockup hero vertikal.
   * Tablet (640px – 1024px): 2 kolom fitur, mockup tablet view.
   * Desktop (> 1024px): Layout 2 kolom split hero, perbandingan harga 2 kartu sejajar.
