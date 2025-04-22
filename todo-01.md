# TODO List: hsb-yatim-ticketting - Fase 1 (MVP Core)

**Tujuan Fase 1:** Membangun fondasi aplikasi, mengimplementasikan manajemen data inti (Pelanggan, Institusi, Ukuran), dan fungsi dasar pembuatan serta pelacakan status pesanan.

---

## A. Persiapan & Setup Proyek (Foundation)

*   [ ] **A-01:** Inisialisasi proyek SvelteKit.
    *   [x] `pnpx sv create` (pilih Skeleton project, TypeScript, Eslint, Prettier).
    *   [x] `pnpm install`
*   [ ] **A-02:** Instalasi & Konfigurasi TailwindCSS + DaisyUI.
    *   [x] `pnpm add -D daisyui@latest`
    *   [x] `npx tailwindcss init -p`
    *   [x] Pilih dan terapkan tema default DaisyUI di `+layout.svelte`.
*   [ ] **A-03:** Instalasi Lucide Icons.
    *   [x] `pnpm install lucide-svelte`
*   [ ] **A-04:** Setup Database (Turso & Drizzle).
    *   [x] Instal Drizzle ORM & Kit: `pnpm add drizzle-orm @libsql/client dotenv`
    *   [x] Instal Drizzle Kit (dev): `pnpm add -D drizzle-kit tsx`
    *   [x] Setup Turso:
        *   [x] Instal Turso CLI (jika belum): `brew install turso` atau dari web.
        *   [x] Login Turso: `turso auth login`.
        *   [x] Buat database di Turso: `turso db create hsb-yatim-ticketting-db`.
        *   [x] Dapatkan URL Database: `turso db show hsb-yatim-ticketting-db --url`.
        *   [x] Dapatkan Auth Token: `turso db tokens create hsb-yatim-ticketting-db`.
        *   [x] Simpan URL dan Token di file `.env` (e.g., `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`). Jangan commit `.env`.
    *   [x] Konfigurasi Drizzle Kit: Buat `drizzle.config.ts`.
    *   [x] Buat file helper koneksi DB (e.g., `src/lib/server/db.ts`) untuk menginisialisasi client Drizzle dengan Turso credentials dari `.env`.
*   [x] **A-05:** Buat Struktur Layout Dasar.
    *   [x] Edit `src/routes/+layout.svelte`.
    *   [x] Tambahkan struktur dasar (misal: Sidebar navigasi statis, area konten utama).
    *   [x] Tambahkan link navigasi awal (Home, Pelanggan, Institusi, Pesanan, Pengaturan).

## B. Definisi Skema Database & Migrasi Awal

*   [x] **B-01:** Buat file skema (`src/lib/db/schema.ts`).
*   [x] **B-02:** Definisikan tabel `institutions`.
*   [x] **B-03:** Definisikan tabel `customers`.
*   [x] **B-04:** Definisikan tabel junction `customerToInstitution`.
*   [x] **B-05:** Definisikan tabel `garmentTypes`.
*   [x] **B-06:** Definisikan tabel `measurementPoints`.
*   [x] **B-07:** Definisikan tabel `measurementSets` (tanpa `isArchived` dulu).
*   [x] **B-08:** Definisikan tabel `measurementDetails`.
*   [x] **B-09:** Definisikan tabel `orders` (kolom dasar: id, orderNumber [nullable dulu?], customerId, institutionId, orderDate, dueDate, notes, currentStatus, isPaid, createdAt).
*   [x] **B-10:** Definisikan tabel `orderItems` (kolom dasar: id, orderId, customerId, measurementSetId, quantity, material, color, itemNotes, ticketPrintedAt [nullable]).
*   [x] **B-11:** Definisikan tabel `orderStatusHistory` (kolom dasar: id, orderId, status, changedAt, notes).
*   [x] **B-12:** Definisikan relasi antar tabel menggunakan `relations()` dari Drizzle.
*   [x] **B-13:** Generate migrasi awal.
    *   [x] `pnpm run db:generate`
*   [x] **B-14:** Terapkan migrasi ke database Turso.
    *   [x] `pnpm run db:migrate` (atau metode migrasi lain jika preferensi berbeda).

## C. Manajemen Institusi (CRUD)

*   [x] **C-01:** Buat halaman daftar Institusi (`src/routes/institutions/+page.svelte`).
    *   [x] Fetch data institusi menggunakan `load` function (`+page.server.ts`).
    *   [x] Tampilkan data dalam tabel DaisyUI.
    *   [x] Tambahkan tombol "Tambah Institusi Baru".
    *   [x] Tambahkan link/tombol "Edit" & "Hapus" per baris.
*   [x] **C-02:** Buat halaman tambah Institusi (`src/routes/institutions/new/+page.svelte`).
    *   [x] Buat form dengan input fields (Nama, PIC, Kontak, Alamat) menggunakan komponen DaisyUI.
    *   [x] Implementasikan form action (`+page.server.ts`) untuk menyimpan data baru ke DB.
    *   [x] Tambahkan validasi dasar (misal: nama tidak boleh kosong).
    *   [x] Redirect ke halaman daftar setelah berhasil.
*   [ ] **C-03:** Buat halaman edit Institusi (`src/routes/institutions/[id]/edit/+page.svelte`).
    *   [x] `load` function untuk fetch data institusi berdasarkan `params.id`.
    *   [x] Pre-fill form dengan data yang ada.
    *   [x] Implementasikan form action untuk update data di DB.
    *   [x] Redirect ke halaman daftar atau detail setelah berhasil.
*   [ ] **C-04:** Implementasikan fungsi Hapus Institusi.
    *   [ ] Tambahkan form action atau API endpoint untuk menghapus.
    *   [ ] Tambahkan konfirmasi sebelum menghapus (misal: modal DaisyUI).
    *   [ ] Handle penghapusan dari halaman daftar.

## D. Manajemen Pelanggan Pribadi (CRUD)

*   [ ] **D-01:** Buat halaman daftar Pelanggan (`src/routes/customers/+page.svelte`). (Struktur mirip C-01).
*   [ ] **D-02:** Buat halaman tambah Pelanggan (`src/routes/customers/new/+page.svelte`). (Struktur mirip C-02).
*   [ ] **D-03:** Buat halaman edit Pelanggan (`src/routes/customers/[id]/edit/+page.svelte`). (Struktur mirip C-03).
*   [ ] **D-04:** Implementasikan fungsi Hapus Pelanggan. (Struktur mirip C-04).

## E. Relasi Pelanggan - Institusi

*   [ ] **E-01:** Modifikasi halaman detail/edit Institusi (`src/routes/institutions/[id]/edit/+page.svelte` atau buat halaman detail terpisah).
    *   [ ] Tampilkan daftar Anggota (Pelanggan) yang terhubung saat ini.
    *   [ ] Tambahkan fitur untuk mengaitkan Pelanggan yang ada (misal: autocomplete/search & add).
    *   [ ] Tambahkan fitur untuk menghapus kaitan Anggota dari Institusi ini.
    *   [ ] Implementasikan logic backend (form actions) untuk update tabel `customerToInstitution`.
*   [ ] **E-02:** (Opsional Fase 1) Modifikasi halaman detail/edit Pelanggan untuk menunjukkan/mengelola keanggotaan Institusi.

## F. Manajemen Master Data Ukuran (CRUD)

*   [ ] **F-01:** Buat halaman CRUD untuk Tipe Pakaian (`src/routes/settings/garment-types/...`). (Struktur mirip C).
*   [ ] **F-02:** Buat halaman CRUD untuk Detail Ukuran (`src/routes/settings/measurement-points/...`). (Struktur mirip C, tambahkan input 'unit').

## G. Manajemen Set Ukuran Pelanggan (CRUD)

*   [ ] **G-01:** Buat halaman/komponen untuk menampilkan daftar Set Ukuran di halaman Detail Pelanggan (`src/routes/customers/[id]/+page.svelte` - buat halaman detail jika belum ada).
    *   [ ] `load` function untuk fetch `measurementSets` milik pelanggan tsb.
    *   [ ] Tampilkan daftar Set Ukuran (Label, Tipe Pakaian, Tanggal Buat).
    *   [ ] Tambahkan tombol "Tambah Set Ukuran Baru".
    *   [ ] Tambahkan link/tombol "Lihat/Edit" & "Hapus" per set.
*   [ ] **G-02:** Buat halaman tambah/edit Set Ukuran (`src/routes/customers/[customerId]/measurements/[setId=new_or_id]/edit/+page.svelte`).
    *   [ ] `load` function (jika edit, fetch data set & detailnya; fetch juga master Tipe Pakaian & Detail Ukuran).
    *   [ ] Form:
        *   [ ] Pilih Pelanggan (hidden input atau dari URL).
        *   [ ] Dropdown pilih Tipe Pakaian.
        *   [ ] Input Label Set Ukuran (opsional).
        *   [ ] Tampilkan daftar Detail Ukuran (dari master).
        *   [ ] Input field untuk Nilai setiap Detail Ukuran.
        *   [ ] Input field untuk Label/Catatan custom per Detail Ukuran (opsional).
    *   [ ] Implementasikan form action untuk menyimpan/update `measurementSets` dan `measurementDetails` terkait. Handle transaksi jika perlu.
*   [ ] **G-03:** Implementasikan fungsi Hapus Set Ukuran (termasuk detailnya via cascade atau logic).

## H. Manajemen Pesanan (Pembuatan Dasar & Daftar)

*   [ ] **H-01:** Buat halaman daftar Pesanan (`src/routes/orders/+page.svelte`).
    *   [ ] `load` function untuk fetch data pesanan (join dengan customer/institution jika perlu).
    *   [ ] Tampilkan data dalam tabel (No Order, Pelanggan/Institusi, Tgl Pesan, Status, Lunas?).
    *   [ ] Tambahkan tombol "Buat Pesanan Baru".
    *   [ ] Tambahkan link ke halaman Detail Pesanan per baris.
*   [ ] **H-02:** Buat halaman Buat Pesanan Baru (`src/routes/orders/new/+page.svelte`).
    *   [ ] `load` function untuk fetch data Pelanggan & Institusi (untuk pilihan).
    *   [ ] Form Bagian 1: Info Pesanan Utama.
        *   [ ] Pilih Pelanggan Pribadi ATAU Institusi.
        *   [ ] Input Nomor Pesanan (biarkan auto-generated dari ID dulu, atau simple input).
        *   [ ] Input Tanggal Target Selesai (Date picker).
        *   [ ] Input Catatan Umum Pesanan.
    *   [ ] Form Bagian 2: Item Pesanan (Dinamis).
        *   [ ] Jika Pelanggan Pribadi dipilih:
            *   Tombol "Tambah Item".
            *   Form Item: Pilih Tipe Pakaian -> Pilih Set Ukuran (filter by customer & garment type, aktif saja) -> Input Qty, Bahan, Warna, Catatan Item.
        *   [ ] Jika Institusi dipilih:
            *   Tampilkan daftar Anggota Institusi (fetch based on selected institution).
            *   Checkbox untuk memilih Anggota yang dipesan.
            *   Untuk setiap Anggota terpilih: Tombol "Tambah Item" -> Form Item (sama seperti di atas, tapi filter Set Ukuran by anggota tsb).
        *   [ ] Mekanisme untuk menambah/menghapus item secara dinamis di form.
    *   [ ] Implementasikan form action untuk menyimpan data `orders` dan semua `orderItems` terkait dalam satu transaksi. Generate `orderNumber` jika tidak diisi. Set status awal 'Baru Masuk'.
*   [ ] **H-03:** Buat halaman Detail Pesanan (`src/routes/orders/[id]/+page.svelte`).
    *   [ ] `load` function untuk fetch data pesanan lengkap (order, items, customer, institution, measurement details via relations).
    *   [ ] Tampilkan informasi detail pesanan.
    *   [ ] Tampilkan daftar Item Pesanan dalam tabel (Nama Orang, Pakaian, Ukuran Ringkas, Bahan, Warna, Catatan, Status Cetak?).
    *   [ ] Tampilkan Status Pesanan Saat Ini.
    *   [ ] Tampilkan Status Pembayaran Saat Ini.

## I. Pelacakan Status & Pembayaran (Dasar)

*   [ ] **I-01:** Di halaman Detail Pesanan (`src/routes/orders/[id]/+page.svelte`):
    *   [ ] Tambahkan Dropdown atau Tombol untuk mengubah `currentStatus` Pesanan.
        *   Opsi: `Baru Masuk`, `Potong`, `Jahit`, `Siap Kirim/Ambil`, `Telah Diterima`, `Selesai`, `Batal`.
    *   [ ] Implementasikan form action untuk update `orders.currentStatus` DAN membuat record baru di `orderStatusHistory`.
*   [ ] **I-02:** Di halaman Detail Pesanan:
    *   [ ] Tambahkan Checkbox atau Toggle untuk mengubah status `isPaid` Pesanan.
    *   [ ] Implementasikan form action untuk update `orders.isPaid`.
*   [ ] **I-03:** Tampilkan histori status di halaman Detail Pesanan (fetch dari `orderStatusHistory`).

---

**Akhir Fase 1:** Aplikasi memiliki fungsi dasar untuk mengelola data inti dan membuat pesanan serta melihat statusnya. Belum ada fitur cetak tiket, impor CSV, atau kustomisasi tiket.