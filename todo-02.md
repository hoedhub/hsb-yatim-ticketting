# TODO List: hsb-yatim-ticketting - Fase 2 (Ticketing Dasar & Fitur Institusi)

**Tujuan Fase 2:** Mengimplementasikan fungsi pencetakan tiket kerja dasar, fitur impor anggota institusi via CSV, dan menyempurnakan fitur yang ada dari Fase 1.

---

## J. Penyempurnaan Manajemen Ukuran

*   [ ] **J-01:** Tambahkan field `isArchived` ke skema `measurementSets`.
    *   [ ] Buat file migrasi baru: `pnpm run db:generate ...`
    *   [ ] Terapkan migrasi: `pnpm run db:migrate ...`
*   [ ] **J-02:** Update UI halaman Detail Pelanggan/Edit Set Ukuran.
    *   [ ] Tambahkan tombol/toggle "Arsipkan" / "Aktifkan" pada setiap Set Ukuran.
    *   [ ] Implementasikan form action untuk update `isArchived`.
*   [ ] **J-03:** Update logic pemilihan Set Ukuran di form Pesanan Baru.
    *   [ ] Secara default, hanya tampilkan Set Ukuran yang `isArchived = false`.
    *   [ ] (Opsional) Tambahkan opsi "Tampilkan Arsip" untuk memilih Set Ukuran lama.
*   [ ] **J-04:** Implementasikan fitur "Duplikat Set Ukuran".
    *   [ ] Tambahkan tombol "Duplikat" pada setiap Set Ukuran.
    *   [ ] Implementasikan form action yang membuat record `measurementSets` baru dan semua `measurementDetails` terkait berdasarkan data yang diduplikasi. Buka halaman edit set baru tersebut.

## K. Penyempurnaan Manajemen Pesanan

*   [ ] **K-01:** Update form Buat/Edit Pesanan untuk `orderNumber`.
    *   [ ] Jadikan input `orderNumber` wajib (`NOT NULL UNIQUE` di skema jika belum). Update skema & migrate jika perlu.
    *   [ ] Tambahkan validasi keunikan di backend (form action) saat menyimpan. Berikan pesan error jika nomor sudah ada.
    *   [ ] Berikan opsi/tombol untuk generate nomor otomatis jika user tidak mau isi manual (misal: YYYYMMDD-ID).
*   [ ] **K-02:** Penyempurnaan UI Pemilihan Anggota Institusi di Form Pesanan.
    *   [ ] Ganti daftar anggota statis dengan komponen yang lebih interaktif (misal: searchable multi-select, atau tabel dengan checkbox).

## L. Impor Anggota Institusi (CSV)

*   [ ] **L-01:** Update halaman Detail Institusi.
    *   [ ] Tambahkan tombol "Impor Anggota dari CSV".
    *   [ ] Tambahkan elemen `<input type="file" accept=".csv">`.
*   [ ] **L-02:** Buat API endpoint atau form action untuk handle upload file CSV.
    *   [ ] Terima file CSV.
    *   [ ] Gunakan library parser CSV (e.g., `papaparse` on server-side).
    *   [ ] Validasi header CSV (minimal ada kolom 'Nama', 'Kontak').
    *   [ ] Iterasi setiap baris data CSV:
        *   [ ] Validasi data per baris (misal: nama tidak kosong).
        *   [ ] Cek apakah Pelanggan dengan kontak tsb sudah ada di DB.
        *   [ ] Jika belum ada, buat record `customers` baru.
        *   [ ] Jika sudah ada (atau baru dibuat), cek apakah sudah terhubung ke Institusi ini.
        *   [ ] Jika belum terhubung, buat record di `customerToInstitution`.
    *   [ ] Kumpulkan hasil (jumlah berhasil impor, jumlah gagal, detail error).
    *   [ ] Kembalikan hasil ke frontend.
*   [ ] **L-03:** Tampilkan feedback hasil impor di UI (misal: menggunakan SvelteKit `message` atau notifikasi toast).

## M. Ticketing Dasar (Cetak & Tracking)

*   [ ] **M-01:** Update halaman Detail Pesanan atau Daftar Pesanan.
    *   [ ] Tambahkan checkbox di setiap baris `orderItems` untuk memilih item yang akan dicetak.
    *   [ ] Tambahkan tombol "Cetak Tiket untuk Item Terpilih".
*   [ ] **M-02:** Buat halaman/route khusus untuk Print Preview (`src/routes/print/tickets/+page.svelte`).
    *   [ ] Tombol "Cetak Tiket..." akan mengarahkan ke route ini dengan membawa ID `orderItems` yang dipilih (misal: via query params `?itemIds=1,2,3`).
*   [ ] **M-03:** Implementasikan `load` function (`+page.server.ts`) untuk route print.
    *   [ ] Ambil `itemIds` dari URL.
    *   [ ] Fetch data lengkap untuk setiap `orderItem` terpilih (termasuk detail order, customer, measurement set & details). Handle jika ID tidak valid.
    *   [ ] Kirim data ke komponen page.
*   [ ] **M-04:** Implementasikan UI halaman Print Preview (`+page.svelte`).
    *   [ ] Loop data `orderItems` yang diterima.
    *   [ ] Untuk setiap item, tampilkan informasi dalam **layout tabel standar/tetap** (belum custom):
        *   Header: No Order, Nama Pelanggan/Anggota, Tipe Pakaian.
        *   Body: Daftar Detail Ukuran (Nama Point, Nilai, Label Custom), Bahan, Warna, Catatan Item.
    *   [ ] Gunakan CSS `@media print` untuk styling halaman cetak (sembunyikan elemen non-cetak, optimalkan font & layout A4, atur page break `page-break-inside: avoid;` pada container per orang). Target 4-5 orang per A4.
*   [ ] **M-05:** Tambahkan tombol "Konfirmasi Cetak & Tandai" di halaman Print Preview.
    *   [ ] Tombol ini akan:
        *   Menjalankan `window.print()`.
        *   Mengirim request (form action/API call) ke backend untuk menandai item telah dicetak.
*   [ ] **M-06:** Implementasikan logic backend untuk menandai item telah dicetak.
    *   [ ] Terima daftar `orderItem` IDs.
    *   [ ] Update kolom `ticketPrintedAt` dengan timestamp saat ini untuk ID tersebut.
*   [ ] **M-07:** Update UI daftar `orderItems` (di detail pesanan).
    *   [ ] Tampilkan indikator (ikon/teks "Sudah Cetak" + tanggal) jika `ticketPrintedAt` tidak null.

## N. Filter & Search Dasar

*   [ ] **N-01:** Implementasikan filter/search di halaman Daftar Pelanggan.
    *   [ ] Tambahkan input search (cari by nama).
    *   [ ] Update `load` function untuk menerima query search dan filter data dari DB.
*   [ ] **N-02:** Implementasikan filter/search di halaman Daftar Institusi (by nama).
*   [ ] **N-03:** Implementasikan filter/search di halaman Daftar Pesanan.
    *   [ ] Input search (by No Order, Nama Pelanggan/Institusi).
    *   [ ] Dropdown filter by Status.
    *   [ ] Dropdown filter by Status Pembayaran (Lunas/Belum).
    *   [ ] Update `load` function untuk handle filter & search.

---

**Akhir Fase 2:** Aplikasi kini bisa mencetak tiket kerja dengan layout standar, melacak item yang sudah dicetak, mendukung impor anggota institusi, dan memiliki fitur pencarian/filter dasar.