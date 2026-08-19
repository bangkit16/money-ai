# Dompety — Page Build Spec

> Gunakan berdampingan dengan `DESIGN.md` (design tokens, komponen, warna, tipografi). File ini menjelaskan **struktur & konten tiap halaman** supaya bisa langsung diimplementasikan (React/Vue/HTML apa pun stack-nya).

## Shared App Shell

Semua halaman berbagi shell yang sama — implementasikan sebagai layout/komponen bersama, jangan diulang per halaman.

### Top App Bar
- Fixed/sticky, tinggi 64px, background blur (glassmorphism), full width, konten dibatasi `max-w-container-max` (1200px) dan center.
- **Varian "Home" (Dashboard, Activity, Analytics)**: kiri = avatar bulat (40px) + wordmark "Dompety"; kanan = ikon notifikasi.
- **Varian "Modal/Form" (Add Transaction)**: kiri = ikon close (kembali/batal); tengah = judul halaman; kanan = spacer kosong agar judul tetap center.

### Bottom Navigation
- Fixed di bawah, full width, blur background, 4 tab: **Dashboard**, **Activity**, **Analytics**, **Settings** (Settings belum punya halaman — beri placeholder/disabled state).
- Tiap tab: ikon + label kecil (uppercase). Tab aktif memakai warna primary + ikon filled + label bold.
- Tidak muncul di halaman Add Transaction (halaman itu full-screen modal dengan tombol aksi sendiri, bukan bottom nav).

### Floating Action Button (opsional, muncul di Dashboard)
- Tombol bulat mengambang di atas bottom nav, ikon petir/aksi cepat → navigasi ke **Add Transaction**.

---

## 1. Dashboard (`/` atau `/dashboard`)

**Tujuan**: ringkasan kondisi finansial pengguna saat pertama membuka app.

### Konten & urutan section
1. **Kartu Saldo Utama** (hero card, gradient navy)
   - Label kecil "TOTAL NET WORTH" + angka besar (mata uang, format ribuan)
   - Badge tren persentase (naik/turun) di kanan atas
   - Dua sub-angka berdampingan: "Available Cash" dan "Investments"
2. **Ringkasan Income vs Expenses** (2 kolom, grid 2 kartu di desktop)
   - Kartu kiri: total Income bulan berjalan + bar progress tipis
   - Kartu kanan: total Expenses bulan berjalan + bar progress tipis (dipisah garis vertikal dari kartu income jika digabung jadi satu card)
3. **Kartu Tren Kekayaan (chart)**
   - Judul "Wealth Trend" + label "LAST 30 DAYS"
   - Bar chart sederhana (7 bar merepresentasikan periode), bar terbaru/tertinggi di-highlight warna primary
4. **Recent Transactions**
   - Header section + tombol "VIEW ALL" (link ke halaman Activity)
   - List 3 transaksi terbaru (icon kategori, nama merchant, kategori + waktu relatif, nominal ± dengan warna, sumber pembayaran)

### Data yang dibutuhkan (per item)
- Net worth, cash, investments, % tren
- Income total, expense total (bulan berjalan)
- Deret data untuk bar chart (mis. 7 titik)
- List transaksi: `{icon, merchant, category, timeAgo, amount, isIncome, paymentSource}`

### Interaksi
- Tap kartu transaksi → detail transaksi (opsional, belum ada desain detail — buat modal sederhana jika diperlukan)
- Tap "VIEW ALL" → ke halaman Activity
- Tap FAB → ke halaman Add Transaction
- Animasi fade+slide-up saat kartu-kartu dimuat (staggered)

---

## 2. Transaction Activity / Riwayat (`/activity`)

**Tujuan**: histori transaksi lengkap, bisa dicari dan difilter.

### Konten & urutan section
1. **Search bar**
   - Input teks dengan ikon search di kiri, placeholder "Search transactions..."
   - Filter realtime terhadap list transaksi (client-side search di nama merchant/kategori)
2. **Quick filter chips** (scrollable horizontal)
   - "All" (default aktif), "Income", "Expenses", "Investments"
   - Filter mengubah data yang ditampilkan di list bawah
3. **List transaksi dikelompokkan per tanggal**
   - Group header: label tanggal (mis. "Today", "Yesterday", "October 22") + garis pembatas
   - Tiap group berisi card putih berisi baris-baris transaksi (divider tipis antar baris)
   - Baris: icon kategori (bulat, warna tint sesuai kategori), nama merchant (semibold), sub-label "Kategori • Jam", nominal di kanan (merah untuk pengeluaran, hijau/gold untuk pemasukan)
   - Jika grup kosong setelah filter/search → sembunyikan grup tsb

### Data yang dibutuhkan
- List transaksi lengkap: `{id, merchant, category, type: income|expense|investment, datetimeLabel, dateGroup, amount, icon}`

### Interaksi
- Ketik di search → filter list secara live (match ke merchant & kategori)
- Tap chip filter → filter berdasarkan `type`
- Tap baris transaksi → buka detail (opsional)
- Hover/tap state: sedikit highlight background pada baris

---

## 3. Analytics / Laporan (`/analytics`)

**Tujuan**: insight & breakdown pengeluaran bulanan.

### Konten & urutan section
1. **Header halaman**: judul "Financial Analytics" + subjudul periode (mis. "Insights for September 2023") — subjudul dinamis sesuai bulan aktif, idealnya ada picker bulan.
2. **Bento grid 2 kartu (span 2:1 di desktop, stack di mobile)**
   - **Kartu Donut Chart "Spending Structure"**: donut SVG dengan minimal 4 segmen kategori, total di tengah donut, legend warna + persentase di bawah chart.
   - **Kartu Insight**: ikon tren, judul "Spending Insight", teks insight singkat (auto-generated dari data, mis. perubahan % vs bulan lalu), angka besar delta di bawah + label "VS PREVIOUS MONTH".
3. **Top Spending Categories** (list breakdown)
   - Header + tombol "View All Reports"
   - Card putih berisi baris per kategori: icon bulat bertint warna kategori, nama kategori + deskripsi singkat, nominal di kanan + progress bar tipis menunjukkan proporsi terhadap kategori terbesar
4. **Banner visual "Yearly Projection"** (opsional dekoratif)
   - Gambar/ilustrasi background dengan overlay gelap semi-transparan, judul singkat + teks proyeksi tahunan

### Data yang dibutuhkan
- Segmen donut: `{category, percentage, colorToken}` (jumlah harus 100%)
- Insight: teks + nilai delta (naik/turun) dibanding bulan sebelumnya
- Top categories: `{icon, name, subtitle, amount, percentOfMax}`
- (Opsional) Angka proyeksi tahunan untuk banner

### Interaksi
- Animasi donut chart mengisi dari 0% ke nilai aktual saat halaman dimuat
- Tap "View All Reports" → halaman laporan lebih detail (belum ada desain — bisa jadi placeholder)
- (Opsional) picker bulan untuk mengganti periode data

---

## 4. Add Transaction (`/add-transaction`, tampil sebagai modal/full-screen overlay)

**Tujuan**: form cepat untuk mencatat transaksi baru.

### Konten & urutan section
1. **Header modal**: tombol close (kembali tanpa simpan) + judul "Add Transaction" + spacer kanan
2. **Input Nominal** (fokus utama halaman)
   - Label uppercase kecil "Amount"
   - Input angka besar (font display), prefix simbol mata uang, auto-focus saat halaman dibuka, centered
3. **Grid Kategori** (4 kolom)
   - 8 kategori: Shopping, Food, Travel, Bills, Fun/Entertainment, Health, Auto/Transport, Others — tiap item: icon bulat + label singkat uppercase
   - Single-select: tap satu kategori men-deselect kategori lain, kategori terpilih berubah jadi solid primary background + icon putih
   - Default salah satu kategori terpilih (mis. Food) saat halaman dibuka
4. **Form detail**
   - Field **Date**: date picker native, default hari ini
   - Field **Note**: textarea 3 baris, placeholder "What was this for?"
   - (Opsional tambahan yang belum ada di desain tapi wajar dibutuhkan agent: toggle Income/Expense, dropdown akun/sumber dana — beri catatan ke agent untuk konfirmasi sebelum menambah field baru)
5. **Tombol aksi bawah** (fixed footer, di luar scroll area)
   - Tombol full-width "Save Transaction" + ikon check, solid primary
   - Disable/validasi: tombol tidak aktif bila Amount kosong/0 atau Kategori belum dipilih

### Data yang di-submit
`{amount, category, date, note, type: income|expense}` → simpan ke data source lalu redirect ke Dashboard atau Activity dengan transaksi baru muncul di paling atas.

### Interaksi
- Tap kategori → update selection state (hanya satu aktif)
- Input amount → hanya menerima angka desimal, format tampilan mengikuti pola mata uang project
- Tap "Save Transaction" → validasi → simpan → tampilkan konfirmasi singkat (toast/snackbar) → tutup modal/kembali
- Tap tombol close → konfirmasi jika sudah ada data terisi (opsional), atau langsung kembali tanpa simpan

---

## Catatan untuk Agent Implementasi

- Semua styling (warna, radius, spacing, shadow, tipografi, motion) mengikuti `DESIGN.md` — jangan membuat token baru tanpa alasan kuat.
- Gunakan Material Symbols Outlined untuk semua ikon, konsisten dengan referensi.
- Struktur data (transaksi, kategori, chart) sebaiknya dipisah dari komponen UI agar mudah dihubungkan ke API/backend nanti — semua angka di atas saat ini masih **dummy/statis** dari desain asal dan perlu diganti dengan data dinamis.
- Halaman "Settings" dan detail transaksi/laporan disebut di navigasi tapi **belum punya desain** — agent boleh membuat versi minimal placeholder, atau bertanya dulu sebelum membangun dari nol.
- Prioritas build yang disarankan: **Dashboard → Add Transaction → Activity → Analytics** (mengikuti alur penggunaan paling umum: lihat ringkasan → catat transaksi → cek riwayat → lihat laporan).
