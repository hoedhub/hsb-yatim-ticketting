# Product Requirements Document: hsb-yatim-ticketting

**Versi:** 1.0
**Tanggal:** 2024-05-24
**Penulis:** [Nama Anda/Tim Anda]

## 1. Pendahuluan

### 1.1. Tujuan
Dokumen ini mendefinisikan persyaratan fungsional dan non-fungsional untuk aplikasi web internal "hsb-yatim-ticketting". Aplikasi ini bertujuan untuk membantu rumah jahit (selanjutnya disebut "Rumah Jahit") dalam mengelola data pelanggan (pribadi dan institusi), ukuran pakaian custom, pesanan jahit, dan menghasilkan tiket kerja (work tickets) yang dapat dicetak untuk proses produksi (potong dan jahit), serta melacak progres setiap pesanan secara efisien.

### 1.2. Ruang Lingkup
Aplikasi ini akan mencakup fitur-fitur berikut:
*   Manajemen data pelanggan (pribadi dan institusi).
*   Manajemen keanggotaan pelanggan pribadi dalam institusi.
*   Manajemen ukuran custom per pelanggan untuk berbagai jenis pakaian.
*   Pembuatan dan pengelolaan pesanan jahit.
*   Pelacakan status progres pesanan (dari baru masuk hingga selesai/batal).
*   Pelacakan status pembayaran (lunas/belum).
*   Pembuatan dan pencetakan tiket kerja dengan layout yang dapat dikustomisasi.
*   Penandaan item pesanan yang tiketnya sudah dicetak.

**Di Luar Ruang Lingkup (Out of Scope) untuk MVP:**
*   Manajemen pengguna dengan role-based access control (Login/RBAC). MVP akan berjalan tanpa autentikasi.
*   Fitur akuntansi/invoice detail.
*   Manajemen inventaris bahan.
*   Integrasi dengan mesin potong/jahit otomatis.
*   Fitur pelaporan dan analitik lanjutan.
*   Portal pelanggan eksternal.

### 1.3. Target Pengguna
Pengguna utama aplikasi ini pada fase awal (MVP) adalah:
*   **Admin / Staf Operasional:** Bertanggung jawab untuk memasukkan data pelanggan, ukuran, pesanan, mencetak tiket, dan memperbarui status pesanan.

(Potensi pengguna di masa depan: Tukang Potong, Tukang Jahit, jika fitur RBAC ditambahkan).

### 1.4. Definisi & Akronim
*   **Rumah Jahit:** Pengguna aplikasi ini.
*   **Pelanggan Pribadi:** Individu yang memesan jasa jahit.
*   **Institusi:** Organisasi/perusahaan/sekolah yang memesan jasa jahit untuk anggotanya.
*   **Anggota Institusi:** Pelanggan pribadi yang terdaftar sebagai bagian dari institusi.
*   **Tipe Pakaian:** Kategori pakaian (misal: Kemeja Pria, Blus Wanita).
*   **Detail Ukuran:** Titik pengukuran spesifik (misal: Lingkar Dada, Panjang Lengan).
*   **Set Ukuran (Measurement Set):** Kumpulan detail ukuran spesifik milik seorang pelanggan untuk satu tipe pakaian pada waktu tertentu.
*   **Pesanan (Order):** Permintaan jasa jahit dari pelanggan, bisa berisi satu atau lebih item.
*   **Item Pesanan (Order Item):** Satu unit pakaian spesifik dalam sebuah pesanan untuk satu orang, merujuk pada set ukuran tertentu.
*   **Tiket Kerja (Work Ticket):** Dokumen cetak berisi informasi detail item pesanan (ukuran, catatan) untuk tim produksi.
*   **MVP:** Minimum Viable Product.
*   **CSV:** Comma-Separated Values.
*   **CRUD:** Create, Read, Update, Delete.

## 2. Persyaratan Fungsional

### 2.1. Manajemen Pelanggan & Institusi
*   **F-CUST-01:** Sistem harus memungkinkan Admin untuk melakukan CRUD data Pelanggan Pribadi (Nama, Kontak [Telepon/WA], Alamat).
*   **F-CUST-02:** Sistem harus memungkinkan Admin untuk melakukan CRUD data Institusi (Nama Institusi, Nama PIC, Kontak PIC, Alamat).
*   **F-CUST-03:** Sistem harus memungkinkan Admin untuk mengaitkan satu Pelanggan Pribadi dengan satu atau lebih Institusi (relasi Many-to-Many).
*   **F-CUST-04:** Sistem harus menampilkan daftar Pelanggan Pribadi dan Institusi.
*   **F-CUST-05:** Sistem harus menyediakan fungsi pencarian dan filter untuk Pelanggan dan Institusi (berdasarkan Nama).

### 2.2. Manajemen Anggota Institusi
*   **F-INST-01:** Sistem harus menampilkan daftar Anggota (Pelanggan Pribadi) yang terhubung ke suatu Institusi.
*   **F-INST-02:** Sistem harus memungkinkan Admin untuk menambahkan Anggota baru ke Institusi secara manual (memilih dari Pelanggan Pribadi yang ada atau membuat Pelanggan Pribadi baru).
*   **F-INST-03:** Sistem harus menyediakan fungsi untuk mengimpor daftar Anggota ke suatu Institusi dari file CSV.
    *   Format CSV minimal: `Nama, Kontak` (kolom lain opsional: Alamat, dll.).
    *   Sistem harus memberikan feedback atas keberhasilan/kegagalan impor (misal: jumlah data berhasil, data gagal beserta alasannya).
    *   Sistem harus bisa menangani duplikasi data (misal: berdasarkan kontak, tawarkan update atau skip).
*   **F-INST-04:** Sistem harus memungkinkan Admin untuk menghapus kaitan Anggota dari Institusi.

### 2.3. Manajemen Ukuran Custom
*   **F-MEAS-01:** Sistem harus memungkinkan Admin untuk melakukan CRUD data Master Tipe Pakaian (misal: Kemeja Pria Lengan Panjang, Celana Panjang Wanita, Rok).
*   **F-MEAS-02:** Sistem harus memungkinkan Admin untuk melakukan CRUD data Master Detail Ukuran (misal: Lingkar Dada, Panjang Lengan, Lebar Bahu, Lingkar Pinggang) beserta unit default (misal: cm).
*   **F-MEAS-03:** Sistem harus memungkinkan Admin untuk membuat Set Ukuran baru untuk Pelanggan Pribadi tertentu.
    *   Set Ukuran harus terhubung ke satu Pelanggan Pribadi dan satu Tipe Pakaian.
    *   Set Ukuran dapat diberi Label opsional (misal: "Ukuran Seragam 2024").
*   **F-MEAS-04:** Dalam satu Set Ukuran, Admin harus dapat memasukkan nilai untuk Detail Ukuran yang relevan (dipilih dari Master Detail Ukuran).
*   **F-MEAS-05:** Setiap nilai Detail Ukuran dalam Set Ukuran dapat diberi Label/Catatan custom (misal: "Lingkar Pinggang - minta dilonggarkan 1cm").
*   **F-MEAS-06:** Sistem harus memungkinkan Admin untuk melihat daftar Set Ukuran milik seorang Pelanggan.
*   **F-MEAS-07:** Sistem harus memungkinkan Admin untuk menandai Set Ukuran sebagai "Arsip/Tidak Aktif". Secara default, hanya Set Ukuran aktif yang ditampilkan saat membuat pesanan.
*   **F-MEAS-08:** Sistem harus memungkinkan Admin untuk menyalin (duplicate) Set Ukuran yang ada untuk dimodifikasi menjadi Set Ukuran baru.

### 2.4. Manajemen Pesanan
*   **F-ORD-01:** Sistem harus memungkinkan Admin untuk membuat Pesanan baru.
*   **F-ORD-02:** Saat membuat Pesanan, Admin harus bisa memilih jenis Pelanggan: Pribadi atau Institusi.
*   **F-ORD-03:** Jika Pelanggan Pribadi:
    *   Admin memilih Pelanggan Pribadi dari daftar.
    *   Admin menambahkan satu atau lebih Item Pesanan.
*   **F-ORD-04:** Jika Pelanggan Institusi:
    *   Admin memilih Institusi dari daftar.
    *   Sistem menampilkan daftar Anggota Institusi tersebut.
    *   Admin dapat memilih Anggota mana saja yang akan dimasukkan dalam pesanan. (Opsi untuk menambah/import anggota baru jika diperlukan di alur ini).
    *   Untuk setiap Anggota yang dipilih, Admin menambahkan satu atau lebih Item Pesanan.
*   **F-ORD-05:** Saat menambahkan Item Pesanan:
    *   Admin memilih Pelanggan Pribadi (untuk siapa item ini).
    *   Admin memilih Tipe Pakaian.
    *   Admin memilih Set Ukuran yang relevan milik Pelanggan tersebut (default hanya tampilkan yang aktif).
    *   Admin memasukkan Kuantitas (default 1).
    *   Admin dapat memasukkan informasi tambahan: Jenis Bahan, Warna, Catatan Jahitan Spesifik untuk item tersebut.
*   **F-ORD-06:** Setiap Pesanan harus memiliki Nomor Pesanan unik.
    *   Sistem dapat meng-generate nomor otomatis (berbasis ID/tanggal).
    *   Sistem harus memungkinkan Admin memasukkan Nomor Pesanan custom (harus divalidasi keunikannya).
*   **F-ORD-07:** Sistem harus mencatat Tanggal Pesanan (otomatis) dan memungkinkan Admin memasukkan Tanggal Target Selesai (Due Date).
*   **F-ORD-08:** Sistem harus memungkinkan Admin untuk menambahkan Catatan Umum untuk Pesanan.
*   **F-ORD-09:** Sistem harus menampilkan daftar semua Pesanan dengan informasi ringkas (Nomor Pesanan, Pelanggan/Institusi, Tanggal Pesan, Status Terkini, Status Lunas).
*   **F-ORD-10:** Sistem harus menyediakan fungsi pencarian dan filter Pesanan (berdasarkan Nomor Pesanan, Nama Pelanggan/Institusi, Status).

### 2.5. Pelacakan Status Pesanan & Pembayaran
*   **F-STAT-01:** Setiap Pesanan harus memiliki Status Progres. Status yang tersedia: `Baru Masuk`, `Potong`, `Jahit`, `Siap Kirim/Ambil`, `Telah Diterima`, `Selesai`, `Batal`.
*   **F-STAT-02:** Sistem harus memungkinkan Admin untuk mengubah Status Pesanan.
*   **F-STAT-03:** Sistem harus secara otomatis mencatat riwayat perubahan status (status lama, status baru, tanggal/waktu perubahan) pada tabel `OrderStatusHistory`.
*   **F-STAT-04:** Sistem harus menampilkan Status Terkini Pesanan di daftar dan detail pesanan.
*   **F-STAT-05:** Setiap Pesanan harus memiliki status Pembayaran (`Lunas` / `Belum Lunas`).
*   **F-STAT-06:** Sistem harus memungkinkan Admin untuk mengubah status Pembayaran menjadi `Lunas` atau `Belum Lunas`.

### 2.6. Manajemen Tiket Kerja
*   **F-TCKT-01:** Sistem harus memungkinkan Admin untuk memilih satu atau lebih Item Pesanan dari satu atau beberapa Pesanan yang akan dicetak tiket kerjanya.
*   **F-TCKT-02:** Sistem harus menyediakan antarmuka untuk mengelola Layout Tiket Kerja (`TicketLayouts`).
    *   Admin dapat membuat Layout baru dan memberinya nama unik.
    *   Admin dapat mengedit Layout yang ada.
    *   Admin dapat menghapus Layout.
    *   Admin dapat menetapkan satu Layout sebagai Default.
*   **F-TCKT-03:** Antarmuka Kustomisasi Layout Tiket:
    *   Harus menampilkan representasi visual grid (mirip tabel/spreadsheet sederhana).
    *   Admin harus dapat menambah/mengurangi jumlah kolom dan baris pada grid.
    *   (Opsional, Nice-to-have) Admin dapat mengatur lebar kolom/tinggi baris.
    *   Untuk setiap cell dalam grid, Admin harus dapat memilih:
        *   Menampilkan data spesifik dari Item Pesanan/Pelanggan/Pesanan (misal: Nama Pelanggan, Nama Anggota, Tipe Pakaian, Detail Ukuran [misal: 'Lingkar Dada'], Nilai Ukuran [misal: '98'], Label Ukuran [misal: 'agak longgar'], Bahan, Warna, Catatan Item, Nomor Pesanan, dll.). Daftar field yang tersedia harus jelas.
        *   Menampilkan teks custom (misal: "Potong:", "Jahit:", "QC:").
    *   Konfigurasi layout (struktur grid dan mapping cell) harus disimpan dalam format JSON di tabel `TicketLayouts`.
*   **F-TCKT-04:** Saat mencetak:
    *   Admin memilih Item Pesanan yang akan dicetak.
    *   Admin memilih Layout Tiket yang akan digunakan (default ke layout default).
    *   Sistem harus menghasilkan pratinjau (atau langsung halaman cetak) berdasarkan data Item Pesanan yang dipilih dan konfigurasi Layout yang dipilih.
    *   Layout harus dioptimalkan untuk kertas A4, dengan target 4-5 baris data orang per halaman (tergantung kompleksitas layout). Menggunakan CSS print-friendly.
*   **F-TCKT-05:** Setelah Admin mengkonfirmasi aksi cetak (setelah dialog cetak browser muncul/selesai), sistem harus secara otomatis menandai setiap `OrderItem` yang dicetak dengan timestamp di kolom `ticketPrintedAt`.
*   **F-TCKT-06:** Sistem harus memberikan indikasi visual pada daftar Item Pesanan/Pesanan mengenai item mana yang tiketnya sudah pernah dicetak.

## 3. Persyaratan Non-Fungsional

### 3.1. Usability
*   **NF-USE-01:** Antarmuka pengguna harus intuitif dan mudah digunakan oleh Admin/Staf Operasional tanpa memerlukan pelatihan ekstensif.
*   **NF-USE-02:** Alur kerja utama (membuat pesanan, mencetak tiket, update status) harus efisien dan meminimalkan jumlah klik.
*   **NF-USE-03:** Sistem harus memberikan feedback yang jelas kepada pengguna atas aksi yang dilakukan (misal: notifikasi sukses/gagal simpan, data berhasil diimpor).
*   **NF-USE-04:** Penggunaan komponen UI dari DaisyUI harus konsisten di seluruh aplikasi.
*   **NF-USE-05:** Penggunaan ikon dari Lucide harus jelas dan membantu navigasi/pemahaman.

### 3.2. Performance
*   **NF-PERF-01:** Aplikasi harus responsif, waktu muat halaman tidak boleh terlalu lama (< 3 detik untuk halaman umum).
*   **NF-PERF-02:** Query database untuk menampilkan daftar (Pelanggan, Pesanan) harus efisien, terutama jika data sudah banyak. Pemanfaatan index database harus optimal.
*   **NF-PERF-03:** Proses impor CSV harus dapat menangani jumlah data yang wajar (misal: ratusan baris) tanpa menyebabkan timeout atau membuat aplikasi tidak responsif. Dilakukan secara asynchronous jika memungkinkan.
*   **NF-PERF-04:** Generasi halaman cetak tidak boleh memakan waktu terlalu lama.

### 3.3. Reliability
*   **NF-REL-01:** Data yang disimpan harus akurat dan konsisten. Validasi input harus diterapkan di frontend dan backend.
*   **NF-REL-02:** Sistem harus dapat diandalkan dan tersedia selama jam kerja Rumah Jahit. (Tergantung infrastruktur hosting).
*   **NF-REL-03:** Harus ada mekanisme backup data (memanfaatkan fitur backup Turso atau ekspor manual berkala).
*   **NF-REL-04:** Error handling harus baik, menampilkan pesan error yang informatif (tapi tidak membocorkan detail teknis sensitif) kepada pengguna.

### 3.4. Maintainability
*   **NF-MNT-01:** Kode sumber harus ditulis dengan baik, bersih, terstruktur (mengikuti best practice SvelteKit), dan diberi komentar jika diperlukan.
*   **NF-MNT-02:** Struktur database (skema Drizzle) harus jelas dan terdokumentasi. Migrasi database harus dikelola dengan baik menggunakan Drizzle Kit.
*   **NF-MNT-03:** Komponen Svelte harus modular dan reusable.

### 3.5. Security (MVP Context)
*   **NF-SEC-01:** Mengingat tidak ada autentikasi di MVP, akses ke aplikasi harus dibatasi pada level jaringan internal Rumah Jahit jika memungkinkan.
*   **NF-SEC-02:** Validasi input di backend harus diterapkan untuk mencegah injection (meskipun risiko lebih rendah di aplikasi internal tanpa auth).
*   **NF-SEC-03:** Koneksi ke database Turso harus menggunakan kredensial yang aman dan tidak di-hardcode di frontend.

## 4. Desain & UI/UX
*   **UI-01:** Menggunakan SvelteKit sebagai framework frontend & backend.
*   **UI-02:** Menggunakan DaisyUI (di atas TailwindCSS) untuk komponen UI, tema, dan layout dasar. Pemilihan tema DaisyUI harus menghasilkan tampilan yang **modern dan menarik**.
*   **UI-03:** Menggunakan Lucide Icons untuk ikonografi yang konsisten dan mendukung estetika modern.
*   **UI-04:** Desain antarmuka harus bersih, tidak berantakan, **modern**, dan **menarik secara visual (appealing)**, dengan fokus pada kemudahan input data dan visualisasi informasi penting (status pesanan, detail ukuran).
*   **UI-05:** Aplikasi harus **sepenuhnya responsif** dan memberikan pengalaman pengguna yang optimal di berbagai ukuran layar, termasuk **desktop, tablet, dan (jika memungkinkan dalam lingkup MVP) mobile**. Tata letak dan fungsionalitas harus beradaptasi dengan baik.
*   **UI-06:** Antarmuka kustomisasi tiket harus visual dan sebisa mungkin WYSIWYG (What You See Is What You Get), selaras dengan keseluruhan desain modern aplikasi.
*   **UI-07:** Penggunaan gaya visual (warna, tipografi, spacing) harus konsisten di seluruh aplikasi untuk memperkuat identitas visual dan kesan profesional.

## 5. Spesifikasi Teknis
*   **TECH-01:** **Framework:** SvelteKit
*   **TECH-02:** **UI Library:** DaisyUI (Plugin TailwindCSS)
*   **TECH-03:** **Styling:** TailwindCSS
*   **TECH-04:** **Icons:** Lucide Icons (lucide-svelte)
*   **TECH-05:** **Database:** Turso (libSQL)
*   **TECH-06:** **ORM:** Drizzle ORM (@drizzle-orm/libsql, drizzle-kit)
*   **TECH-07:** **Bahasa:** TypeScript
*   **TECH-08:** **Hosting:** Vercel
*   **TECH-09:** **Struktur Database:** Mengikuti skema yang didefinisikan dalam file `src/lib/db/schema.ts` (atau path yang disepakati).

## 6. Rencana Rilis (Bertahap)
*   **Fase 1 (MVP Core):** Fokus pada Fungsionalitas 2.1, 2.3 (tanpa arsip/copy), 2.4 (tanpa CSV, tanpa order number custom), 2.5 (dasar), Setup Teknis Dasar.
*   **Fase 2 (Ticketing Dasar & Institusi):** Fokus pada 2.6 (layout default, print, tracking), 2.2 (termasuk CSV import), penyempurnaan 2.3 (arsip/copy), 2.4 (order number custom), Filter/Search Dasar.
*   **Fase 3 (Kustomisasi & Penyempurnaan):** Fokus pada 2.6 (Kustomisasi Layout Tiket), Penyempurnaan UI/UX berdasarkan feedback, Error Handling Lanjutan.
*   **Fase 4 (Deployment & Iterasi):** Deployment ke lingkungan produksi, Testing menyeluruh, Pengumpulan feedback, Iterasi perbaikan bug dan fitur minor.

## 7. Pertimbangan Masa Depan (Post-MVP)
*   Implementasi Autentikasi Pengguna dan Role-Based Access Control (Admin, Cutter, Sewer).
*   Dashboard dengan ringkasan statistik (jumlah pesanan aktif, pesanan telat, dll.).
*   Fitur pelaporan dasar (misal: laporan pesanan per periode).
*   Manajemen biaya/harga per item/pesanan.
*   Modul inventaris bahan dasar.
*   Notifikasi (misal: jika pesanan mendekati due date).

## 8. Isu Terbuka
*   Perlu finalisasi format kolom yang *harus* ada dan opsional dalam file CSV untuk impor anggota institusi.
*   Detail mekanisme resize kolom/baris pada kustomisasi tiket (jika diimplementasikan) perlu eksplorasi teknis lebih lanjut.

---
**Persetujuan:**

*   **Pemilik Produk / Rumah Jahit:** _________________________ Tanggal: __________
*   **Tim Pengembang:** _________________________ Tanggal: __________