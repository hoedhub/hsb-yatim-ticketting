# TODO List: hsb-yatim-ticketting - Fase 3 (Kustomisasi Tiket & Penyempurnaan)

**Tujuan Fase 3:** Mengimplementasikan fitur kustomisasi layout tiket kerja, menyempurnakan UI/UX secara keseluruhan, dan menangani kasus-kasus penggunaan yang lebih kompleks.

---

## O. Kustomisasi Layout Tiket

*   [ ] **O-01:** Buat tabel `ticketLayouts` di skema DB (`src/lib/db/schema.ts`).
    *   Kolom: `id`, `name` (UNIQUE NOT NULL), `config` (TEXT JSON NOT NULL), `isDefault` (BOOLEAN DEFAULT false), `createdAt`.
    *   Generate & terapkan migrasi.
*   [ ] **O-02:** Buat halaman Manajemen Layout Tiket (`src/routes/settings/ticket-layouts/...`).
    *   [ ] Halaman Daftar Layout: Tampilkan nama layout, indikator default, tombol Edit/Hapus/Set Default, tombol "Buat Layout Baru".
    *   [ ] Implementasikan CRUD actions untuk layout (simpan nama, config JSON, isDefault). Handle logic 'Set Default' (hanya satu yang bisa default).
*   [ ] **O-03:** Buat Halaman/Komponen Editor Layout Tiket (`src/routes/settings/ticket-layouts/[id=new_or_id]/edit/+page.svelte`).
    *   [ ] `load` function (fetch layout config jika edit).
    *   [ ] Input Nama Layout.
    *   [ ] **UI Editor Grid:**
        *   [ ] Tampilkan representasi visual grid (bisa pakai CSS Grid/Flexbox).
        *   [ ] State management (Svelte store?) untuk menyimpan struktur grid (rows, columns, cell content).
        *   [ ] Tombol "Tambah Baris", "Tambah Kolom".
        *   [ ] Tombol "Hapus Baris", "Hapus Kolom" (pada baris/kolom terpilih).
        *   [ ] **Interaksi Cell:**
            *   Saat cell diklik/dipilih:
            *   Tampilkan opsi: "Pilih Field Data" atau "Teks Custom".
            *   Jika "Pilih Field Data": Tampilkan Dropdown berisi daftar field yang relevan (e.g., `customer.name`, `orderItem.material`, `measurementDetail.LingkarDada.value`, `measurementDetail.LingkarDada.label`, `order.orderNumber`, etc.). Perlu daftar field yang terstruktur.
            *   Jika "Teks Custom": Tampilkan input teks.
            *   Simpan pilihan mapping ke state grid.
    *   [ ] Tombol "Simpan Layout". Action akan serialize state grid ke JSON dan simpan ke DB.
*   [ ] **O-04:** Update Halaman Print Preview (`/print/tickets`).
    *   [ ] `load` function: Fetch juga daftar `ticketLayouts` yang tersedia.
    *   [ ] Tambahkan Dropdown di UI untuk memilih Layout yang akan digunakan (default ke layout `isDefault=true`).
    *   [ ] Kirim ID layout terpilih ke komponen page.
*   [ ] **O-05:** Update logic rendering di komponen Print Page (`+page.svelte`).
    *   [ ] Terima data layout config (JSON) dari `load` function.
    *   [ ] Render grid secara dinamis berdasarkan `config` layout terpilih.
    *   [ ] Untuk setiap cell, tampilkan data sesuai mapping (ambil data dari `orderItem` / `customer` / `order` / `measurementDetails` yang relevan) atau tampilkan teks custom. Ini bagian paling kompleks.
*   [ ] **O-06:** (Opsional/Nice-to-have) Implementasi resize kolom/baris di Editor Layout. Membutuhkan Javascript tambahan untuk drag-and-drop resizing. Simpan info ukuran di JSON config.

## P. Penyempurnaan UI/UX

*   [ ] **P-01:** Review semua alur kerja utama (buat pelanggan, buat pesanan, edit ukuran, cetak tiket, update status). Identifikasi & perbaiki bottleneck atau langkah yang membingungkan.
*   [ ] **P-02:** Tambahkan Loading Indicators (misal: spinner DaisyUI) untuk operasi yang memakan waktu (fetch data, simpan form, impor CSV).
*   [ ] **P-03:** Perbaiki pesan error/validasi agar lebih informatif dan user-friendly. Gunakan komponen Alert DaisyUI.
*   [ ] **P-04:** Pastikan konsistensi penggunaan komponen DaisyUI, warna, tipografi, dan spacing di seluruh aplikasi.
*   [ ] **P-05:** Review responsivitas aplikasi di berbagai ukuran layar (Desktop, Tablet). Perbaiki layout yang rusak.
*   [ ] **P-06:** Tambahkan konfirmasi modal DaisyUI untuk semua aksi destruktif (Hapus Pelanggan, Hapus Institusi, Hapus Pesanan, Hapus Layout, Arsipkan Ukuran, Batalkan Pesanan).

## Q. Penanganan Kasus Edge & Lainnya

*   [ ] **Q-01:** Tentukan aturan bisnis & implementasikan logic untuk mengedit Pesanan/Item Pesanan yang sudah berjalan (misal: apa yang boleh diedit jika status sudah 'Potong' atau 'Jahit'?). Beri peringatan jika mengedit data yang mungkin sudah dipakai produksi.
*   [ ] **Q-02:** Pastikan alur status 'Batal' berfungsi dengan benar dan jelas indikasinya di daftar pesanan.
*   [ ] **Q-03:** Review performa query database, terutama pada halaman daftar yang datanya bisa banyak. Tambahkan index database jika diperlukan (lihat `index()` di Drizzle).
*   [ ] **Q-04:** Lakukan testing menyeluruh untuk fitur impor CSV dengan berbagai skenario data (valid, invalid, duplikat).
*   [ ] **Q-05:** Lakukan testing menyeluruh untuk fitur kustomisasi dan pencetakan tiket dengan layout berbeda.

---

**Akhir Fase 3:** Aplikasi kini memiliki fitur kustomisasi tiket yang fungsional, UI/UX yang lebih matang, dan penanganan error/kasus edge yang lebih baik.