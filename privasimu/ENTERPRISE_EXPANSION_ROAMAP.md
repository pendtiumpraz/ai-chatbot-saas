# PRIVASIMU - V2 Enterprise Expansion Roadmap (The "Tender-Winner" Update)

Dokumen ini adalah cetak biru teknis (Implementation Plan) untuk menutup 5 celah fitur *Enterprise capabilities* yang diperlukan guna memenangkan tender bernilai tinggi (seperti BUMN, Multinasional, atau Kementerian) secara absolut berhadapan dengan The Gartner Magic Quadrant Leaders.

## Phase 1: Enterprise Identity & Access Bridge (Sprint 1) - ✅ ALREADY IMPLEMENTED
**Status:** **SELESAI (100%)**
**Tujuan:** Mengizinkan perusahaan login menggunakan akun korporat yang sudah ada tanpa perlu membuat password baru.

*Catatan: Platform PRIVASIMU secara arsitektural telah memiliki fitur SSO Dinamis berbasis Multi-Tenant (tabel `tenant_ssos`). Fitur ini sudah mendukung injeksi `client_id` dan `client_secret` secara terpisah untuk Azure (Entra ID), Google, dan Keycloak untuk setiap klien organisasi secara independen, sehingga poin tender krusial ini sudah terkunci dan aman!*

---

## Phase 2: Cookie Compliance Engine & Auto-Blocker (Sprint 2)
**Tujuan:** Tracker web automation (banner Cookie otomatis) yang menjadi core requirement dari divisi Digital Marketing klien.

### Langkah Implementasi:
1. **Backend - Website Scanner Crawler:**
   - Gunakan Node.js Puppeteer (sebagai *microservice* terpisah atau panggil via Laravel `symfony/process`) untuk men-scan domain klien (`https://klien.com`).
   - Crawler mendeteksi seluruh jaringan requests: Google Analytics, FB Pixel, Hotjar, dll., lalu mengelompokkannya ke dalam Kategori (Marketing, Analytics, Functional).
2. **Frontend Widget (Embed JS) Upgrade:**
   - Rombak `consent-widget.js`. Daripada hanya menampilkan pop-up syarat dan ketentuan, widget V2 harus bisa membungkus/memanipulasi objek global (`window.dataLayer`, `document.cookie`).
   - Buat logic: *Default deny*. Semua iframe/script dari domain pihak ketiga (didaftar oleh *Crawler* tadi) diblokir (menggunakan `type="text/plain"` bukannya `type="text/javascript"`) sampai user klik "Accept All" di banner cookie.
3. **Dashboard UI:**
   - Modul `Cookie Manager` berisikan hasil *crawl* yang rapi. DPO bisa me-review dan melabelkan cookies yang terdeteksi sebelum mem-publish banner cookie ke rilis *production*.

---

## Phase 3: Native DSPM Data Connectors (Sprint 3)
**Tujuan:** Mengganti *mockup* simulasi Data Discovery dengan native drivers untuk koneksi ke environment Big Data asik.

### Langkah Implementasi:
1. **Backend (Laravel) - Connector Engine:**
   - Install ekstensi PHP yang diperlukan (misal: `pdo_sqlsrv` untuk MSSQL, `oci8` untuk Oracle).
   - Arsitekturnya diubah: Alih-alih server Privasimu menarik semua data (yang mana memakan bandwidth raksasa dan berisiko), kita gunakan **Query Pushdown**. Privasimu mengirimkan *SQL Regex/Pattern script* (misal: `SELECT column_name FROM information_schema.columns WHERE name LIKE '%nik%'`) langsung ke *Database Engine* klien.
2. **Cloud Connectors (AWS Macie / GCP DLP):**
   - Buat integrasi API OAuth2 ke AWS dan GCP. Klien memberikan Privasimu IAM Role Read-Only.
   - Privasimu terhubung ke AWS Macie milik klien untuk sekadar mem-pull *Dashboard & Alerts* hasil *discovery* mereka tanpa pernah menyentuh *raw data*-nya. Sangat aman dan disukai CISO.
3. **Frontend UI:**
   - Data Discovery diperluas: Tersedia tombol "Test Native Connection" dan logs sinkronisasi real-time.

---

## Phase 4: Dynamic Data Flow Mapping (Visual DFD) (Sprint 4)
**Tujuan:** Memvisualisasikan tabel-tabel ROPA dan Data Discovery menjadi Graf interaktif.

### Langkah Implementasi:
1. **Frontend (React) - Graph Library Integration:**
   - Install library pembuat Node/Graph interaktif (seperti `React Flow` atau `Cytoscape.js`).
   - Buat algoritma konverter: Ambil data agregasi dari ROPA (Process Name, Vendor Target, Data Subjek) dan ubah menjadi `[Nodes]` dan `[Edges]`.
2. **Interactivity:**
   - Setiap Node dapat diklik untuk membuka *sidebar* berisi detail ROPA dan status Gap Assessment-nya.
   - Berikan kode warna: Jika Node merah, berarti *Vendor* tersebut berisiko tinggi / belum tanda tangan Data Processing Agreement (DPA).
3. **Export PDF/PNG:**
   - Gunakan `html2canvas` pada React Flow untuk mendownload Topologi Visual tersebut. Para eksekutif sangat suka memasukkan gambar ini ke arsip laporan mereka.

---

## Phase 5: Notification & Escalation Workflows (Sprint 5)
**Tujuan:** Meninggalkan email tradisional dan beralih ke kolaborasi modern lintas tim.

### Langkah Implementasi:
1. **Team Integrations (OAuth App):**
   - Daftarkan *"Privasimu App"* di Slack API Console & Microsoft Teams Developer.
   - Tambahkan form di halaman **Integrations** bagi klien untuk menautkan Workspace mereka.
2. **Automated Event Listeners (Laravel Events):**
   - Taruh trigger di Laravel Observer (misal: pada `DsrRequest::created`).
   - Begitu tiket DSR masuk, Laravel mengeksekusi Job Background untuk mem-*post message* ke *channel* khusus di Slack/Teams menggunakan Incoming Webhooks (`<@IT_Support> User A minta hapus data. Deadline: 3 hari`).
3. **Interactive Buttons dalam Chat:**
   - Gunakan fungsionalitas Slack/Teams Block Kit. Tombol `Approve ROPA` atau `Extend Deadline` bisa diklik langsung dari *chat* Teams, yang akan melakukan webhook *callback* ke backend Privasimu tanpa user perlu membuka dashboard aplikasi.

---

## Kesimpulan Strategi Eksekusi
Kelima fase ini tidak harus diluncurkan bersamaan melainkan merupakan **"Pintu Akselerasi Enterprise"**. Disarankan untuk merilis tahap pengembangan dalam urutan ini:
1. Mulai dari **Phase 1 (SSO)** dan **Phase 4 (Visual Map)** terlebih dahulu, karena _Return on Investment_ (ROI)-nya paling tinggi di mata para *decision makers* BUMN di ruang rapat.
2. Kemudian rilis **Phase 2 (Cookie)** untuk memuaskan Divisi Marketing klien.
3. Terakhir eksekusi **Phase 3 dan Phase 5** di belakang layar untuk melengkapi stabilitas IT/Productivity mereka.
