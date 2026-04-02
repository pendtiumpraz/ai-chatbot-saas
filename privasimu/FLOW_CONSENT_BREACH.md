# 🔄 Alur Detail: Consent Management & Data Breach Management

> Dokumen ini menjelaskan flow end-to-end kedua modul utama yang akan dibangun dari scratch.
> Tanggal: 25 Maret 2026

---

# BAGIAN A: CONSENT MANAGEMENT

---

## A1. Overview

Consent Management adalah modul untuk mengelola **persetujuan subjek data** sebelum data pribadi mereka diproses. Sesuai UU PDP Pasal 20-22, organisasi **wajib** memiliki dasar hukum untuk memproses data pribadi, dan consent adalah salah satu dasar hukum utama.

### Aktor / Role

| Role | Deskripsi |
|------|-----------|
| **Admin Organisasi** | Setup template consent, kelola library, konfigurasi |
| **DPO (Data Protection Officer)** | Review & approve template consent sebelum dipublish |
| **CS Officer** | Input consent dari nasabah yang datang langsung ke kantor |
| **Developer/IT** | Integrasi consent API ke aplikasi milik organisasi |
| **Subjek Data (End User)** | Memberikan/menolak/mencabut consent |
| **Pihak Ketiga (Wali)** | Orang tua / wali yang memberikan consent atas nama anak/disabilitas |

---

## A2. Alur 1: Setup Consent Template (Admin)

```
Admin Organisasi
      │
      ▼
┌──────────────────┐
│ 1. Masuk ke menu │
│    Consent Mgmt  │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────────┐
│ 2. Pilih:                        │
│    a. Buat dari Scratch          │
│    b. Pilih dari Library         │─────────────────┐
│       (template UU PDP-ready)    │                 │
└────────┬─────────────────────────┘                 │
         │ (a)                                       │ (b)
         ▼                                           ▼
┌──────────────────────────┐           ┌────────────────────────┐
│ 3a. Isi Form Template:   │           │ 3b. Library Consent:   │
│                          │           │                        │
│ • Nama consent           │           │ • Consent Pemasaran    │
│ • Tujuan pemrosesan      │           │ • Consent Data Sharing │
│ • Jenis data yg diproses │           │ • Consent Analitik     │
│ • Dasar hukum            │           │ • Consent Biometrik    │
│ • Masa berlaku           │           │ • Consent Transfer     │
│ • Bahasa (ID/EN)         │           │   Data Lintas Negara   │
│ • Versi                  │           │ • Consent Pihak Ketiga │
│ • Custom fields          │           │ • Consent Anak (<17th) │
│                          │           │                        │
│ Regulasi:                │           │ Semua sudah dikaji:    │
│ • UU PDP                 │           │ ✅ UU PDP              │
│ • POJK 22/2023           │           │ ✅ POJK 22/2023        │
│ • Lainnya                │           │ ✅ PP terkait          │
└────────┬─────────────────┘           └───────────┬────────────┘
         │                                         │
         └──────────────┬──────────────────────────┘
                        ▼
              ┌─────────────────┐
              │ 4. Preview      │
              │    Tampilan     │
              │    consent form │
              └────────┬────────┘
                       ▼
              ┌─────────────────────┐
              │ 5. Submit ke DPO    │
              │    untuk review     │
              │    Status: DRAFT    │
              └────────┬────────────┘
                       ▼
              ┌─────────────────────┐
              │ 6. DPO Review:      │
              │    ✅ Approve → ACTIVE│
              │    ❌ Reject → revisi │
              │    💬 Comment        │
              └────────┬────────────┘
                       ▼
              ┌─────────────────────────┐
              │ 7. Template ACTIVE      │
              │    → Siap digunakan     │
              │    → Bisa di-embed      │
              │    → Bisa via API       │
              │    → Bisa via CS        │
              └─────────────────────────┘
```

---

## A3. Alur 2: Consent via Aplikasi Digital (End User)

Ini adalah flow ketika nasabah/user menggunakan aplikasi (mobile/web) milik organisasi.

```
Subjek Data (User)
      │
      ▼
┌──────────────────────────────────────┐
│ 1. User membuka aplikasi organisasi  │
│    (contoh: Mobile Banking)          │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ 2. Aplikasi memanggil API:           │
│    GET /api/v1/consent/check         │
│    {userId, consentType}             │
│                                      │
│    Response:                         │
│    • "hasConsent": false             │
│    • "template": {form data}         │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ 3. Tampilkan consent form ke user:   │
│                                      │
│ ┌──────────────────────────────────┐ │
│ │  📋 Persetujuan Pemrosesan Data  │ │
│ │                                  │ │
│ │  Tujuan: Analisis risiko kredit  │ │
│ │  Data: Nama, KTP, Slip Gaji     │ │
│ │  Masa berlaku: 2 tahun           │ │
│ │  Dasar hukum: Pasal 20 UU PDP   │ │
│ │                                  │ │
│ │  [Baca Selengkapnya]             │ │
│ │                                  │ │
│ │  ☑ Saya menyetujui pemrosesan   │ │
│ │    data pribadi saya sesuai      │ │
│ │    ketentuan di atas             │ │
│ │                                  │ │
│ │  [Tolak]          [Setujui]      │ │
│ └──────────────────────────────────┘ │
└────────┬─────────────────────────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
 [Tolak]   [Setujui]
    │         │
    ▼         ▼
┌────────┐ ┌──────────────────────────────┐
│ Catat  │ │ 4. Catat consent:            │
│ penola-│ │    POST /api/v1/consent       │
│ kan    │ │    {                          │
│        │ │      userId,                  │
│ Simpan │ │      templateId,              │
│ alasan │ │      consentGiven: true,      │
│        │ │      method: "digital",       │
│ Inform │ │      ipAddress,               │
│ konsek │ │      userAgent,               │
│ uensi  │ │      timestamp                │
└────────┘ │    }                          │
           └─────────────┬────────────────┘
                         ▼
           ┌──────────────────────────────┐
           │ 5. Kirim konfirmasi ke user: │
           │    📧 Email konfirmasi       │
           │    📱 Push notification      │
           │    📄 PDF bukti consent      │
           └──────────────────────────────┘
```

---

## A4. Alur 3: Consent via CS Officer (Customer Service)

Flow ini untuk nasabah yang datang langsung ke cabang bank/kantor.

```
┌───────────────────────────────────────────────────────────────┐
│                    FLOW CONSENT VIA CS                         │
└───────────────────────────────────────────────────────────────┘

Nasabah datang ke cabang
      │
      ▼
┌──────────────────────────────────────┐
│ 1. CS Officer login ke PRIVASIMU     │
│    Menu: Consent > Input via CS      │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ 2. CS cari nasabah:                  │
│    • Masukkan NIK / No. Rek / Nama   │
│    • Sistem tampilkan data nasabah   │
│    • Jika belum terdaftar → register │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ 3. CS pilih consent template:        │
│    • List template ACTIVE            │
│    • Centang yang relevan            │
│    • Bisa multi-consent sekaligus    │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ 4. Form pre-filled otomatis:         │
│                                      │
│    Nama    : [Ahmad Sudrajat     ]   │
│    NIK     : [3201xxxxxxxxxx     ]   │
│    No. Rek : [1234567890         ]   │
│    Consent : [✓] Data Pemasaran      │
│              [✓] Data Sharing        │
│              [ ] Data Analitik       │
│                                      │
│    CS Officer: [Siti Nurhaliza   ]   │
│    Cabang   : [KCP Sudirman      ]   │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ 5. CS serahkan device ke nasabah:    │
│                                      │
│ ┌──────────────────────────────────┐ │
│ │  📱 TABLET / LAYAR KE NASABAH   │ │
│ │                                  │ │
│ │  Yth. Bapak/Ibu Ahmad Sudrajat  │ │
│ │                                  │ │
│ │  Anda menyetujui pemrosesan     │ │
│ │  data pribadi untuk:             │ │
│ │  ✅ Keperluan pemasaran         │ │
│ │  ✅ Berbagi data dengan mitra   │ │
│ │                                  │ │
│ │  [Baca Detail Lengkap]          │ │
│ │                                  │ │
│ │  Tanda Tangan Digital:          │ │
│ │  ┌─────────────────────────┐    │ │
│ │  │                         │    │ │
│ │  │    ✍️ (area ttd)         │    │ │
│ │  │                         │    │ │
│ │  └─────────────────────────┘    │ │
│ │                                  │ │
│ │  [Tolak]          [Setujui]      │ │
│ └──────────────────────────────────┘ │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ 6. Nasabah tanda tangan & setujui   │
│                                      │
│ Sistem otomatis catat:               │
│ • consent_method: "cs_officer"       │
│ • cs_officer_id: [id CS ybs]         │
│ • digital_signature: [data ttd]      │
│ • branch: "KCP Sudirman"            │
│ • timestamp                          │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ 7. Konfirmasi:                       │
│    📧 Email ke nasabah               │
│    📱 SMS konfirmasi                 │
│    🖨️ Cetak bukti (opsional)         │
│    📊 Update di dashboard aggregasi  │
└──────────────────────────────────────┘
```

---

## A5. Alur 4: Consent Pihak Ketiga (Anak / Disabilitas)

Sesuai UU PDP Pasal 25-26, data anak di bawah 17 tahun dan penyandang disabilitas tertentu memerlukan consent dari wali.

```
┌───────────────────────────────────────────────────────────────┐
│              FLOW CONSENT PIHAK KETIGA                         │
└───────────────────────────────────────────────────────────────┘

      ┌──────────────────────────────┐
      │ 1. Identifikasi subjek data  │
      │    sebagai anak/disabilitas  │
      │                              │
      │    Trigger:                  │
      │    • Usia < 17 tahun         │
      │    • Flag: penyandang        │
      │      disabilitas tertentu    │
      └─────────────┬────────────────┘
                    │
                    ▼
      ┌──────────────────────────────┐
      │ 2. Sistem minta data wali:   │
      │                              │
      │    Hubungan: [Orang Tua ▼]   │
      │    Nama Wali: [_________ ]   │
      │    NIK Wali : [_________ ]   │
      │    No HP    : [_________ ]   │
      │    Email    : [_________ ]   │
      │                              │
      │    Bukti hubungan wali:      │
      │    📎 Upload KK / Surat Wali │
      └─────────────┬────────────────┘
                    │
                    ▼
      ┌──────────────────────────────┐
      │ 3. Verifikasi wali:          │
      │    • Validasi NIK wali       │
      │    • Cek dokumen pendukung   │
      │    • Status: VERIFIED ✅     │
      └─────────────┬────────────────┘
                    │
                    ▼
      ┌──────────────────────────────┐
      │ 4. Consent form ditujukan    │
      │    ke WALI (bukan anak):     │
      │                              │
      │    "Sebagai wali dari        │
      │     [Nama Anak], saya        │
      │     menyetujui..."           │
      │                              │
      │    ☑ Setuju                  │
      │    ✍️ Tanda tangan wali      │
      └─────────────┬────────────────┘
                    │
                    ▼
      ┌──────────────────────────────┐
      │ 5. Record consent:           │
      │    • subject_id: [id anak]   │
      │    • third_party_type:       │
      │      "parent" / "guardian"   │
      │    • third_party_id:         │
      │      [id wali]               │
      │    • Bukti hubungan wali     │
      │      tersimpan               │
      └──────────────────────────────┘
```

---

## A6. Alur 5: Agregasi & Dashboard Consent

```
┌───────────────────────────────────────────────────────────────┐
│                DASHBOARD AGREGASI CONSENT                      │
└───────────────────────────────────────────────────────────────┘

DPO / Admin buka dashboard
      │
      ▼
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  📊 CONSENT DASHBOARD                                        │
│                                                              │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────────────┐   │
│  │  1,247  │ │   892   │ │   355   │ │      23         │   │
│  │  Total  │ │ Active  │ │ Expired │ │   Revoked       │   │
│  │ Records │ │ Consent │ │ Consent │ │   (Dicabut)     │   │
│  └─────────┘ └─────────┘ └─────────┘ └─────────────────┘   │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐   │
│  │ 🔍 Cari Subjek Data: [________________] [Cari]       │   │
│  └───────────────────────────────────────────────────────┘   │
│                                                              │
│  Hasil pencarian: "Ahmad Sudrajat"                           │
│  ┌───────────────────────────────────────────────────────┐   │
│  │ 👤 Ahmad Sudrajat (NIK: 3201xxxxxxxx)                 │   │
│  │                                                       │   │
│  │ Consent yang dimiliki:                                │   │
│  │ ┌─────────────────────────────────────────────────┐   │   │
│  │ │ App              │ Consent        │ Status │ Tgl│   │   │
│  │ ├──────────────────┼────────────────┼────────┼────┤   │   │
│  │ │ Mobile Banking   │ Pemasaran      │ ✅ Act │ ..│   │   │
│  │ │ Mobile Banking   │ Data Sharing   │ ✅ Act │ ..│   │   │
│  │ │ Internet Banking │ Analitik       │ ❌ Rev │ ..│   │   │
│  │ │ Asuransi App     │ Profiling      │ ⚠️ Exp │ ..│   │   │
│  │ │ HR Portal        │ Data Karyawan  │ ✅ Act │ ..│   │   │
│  │ └─────────────────────────────────────────────────┘   │   │
│  │                                                       │   │
│  │ [Export PDF] [Kirim ke Subjek Data] [Revoke All]      │   │
│  └───────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐   │
│  │ 📈 Grafik: Consent per bulan                          │   │
│  │ ▆ ▇ █ ▅ ▇ █ ▇ ▆ ▅ ▇ █ ▇                            │   │
│  │ J F M A M J J A S O N D                              │   │
│  └───────────────────────────────────────────────────────┘   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## A7. Alur 6: Pencabutan Consent (Revoke)

```
Subjek Data ingin cabut consent
      │
      ▼
┌──────────────────────────────────────┐
│ 1. Via:                              │
│    a. Self-service portal/app        │
│    b. Request ke CS                  │
│    c. Email ke DPO                   │
│    d. Via DSAR                       │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ 2. Verifikasi identitas subjek data  │
│    • OTP ke nomor terdaftar          │
│    • Verifikasi email                │
│    • Atau: tatap muka di cabang      │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ 3. Pilih consent yang ingin dicabut  │
│    ☑ Consent Pemasaran               │
│    ☐ Consent Data Sharing            │
│    ☐ Consent Analitik                │
│                                      │
│    Alasan (opsional): [__________]   │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ 4. Sistem proses pencabutan:         │
│    • Update status → REVOKED         │
│    • Catat timestamp pencabutan      │
│    • Trigger: stop data processing   │
│      untuk tujuan tersebut           │
│                                      │
│ 5. Notifikasi ke:                    │
│    • Subjek data (konfirmasi)        │
│    • DPO (informasi)                 │
│    • Sistem terkait (stop processing)│
│                                      │
│ 6. Konsekuensi (jika ada):           │
│    • Inform layanan yang terdampak   │
│    • Misal: "Anda tidak akan         │
│      menerima penawaran produk lagi" │
└──────────────────────────────────────┘
```

---
---

# BAGIAN B: DATA BREACH MANAGEMENT

---

## B1. Overview

Data Breach Management adalah modul untuk mengelola **insiden kebocoran/kegagalan pelindungan data pribadi** sesuai Pasal 46 UU PDP. Organisasi wajib memberitahu subjek data dan lembaga dalam **3x24 jam**.

### Aktor / Role

| Role | Deskripsi |
|------|-----------|
| **CISO / IT Security** | Mendeteksi dan melaporkan insiden awal |
| **DPO** | Menilai severity, koordinasi respon, pelaporan ke lembaga |
| **Incident Commander** | Memimpin penanganan teknis breach |
| **Legal / Compliance** | Menyusun surat notifikasi, aspek hukum |
| **Management** | Approval untuk notifikasi ke publik |
| **System (Otomatis)** | Alarm, countdown, auto-generate template |

---

## B2. Alur Utama: Lifecycle Data Breach

```
┌───────────────────────────────────────────────────────────────────────┐
│                  LIFECYCLE DATA BREACH MANAGEMENT                     │
│                                                                       │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐        │
│  │  FASE  │  │  FASE  │  │  FASE  │  │  FASE  │  │  FASE  │        │
│  │   1    │──│   2    │──│   3    │──│   4    │──│   5    │        │
│  │DETEKSI │  │ASSESS- │  │CONTAIN │  │NOTIFI- │  │CLOSURE │        │
│  │        │  │MENT    │  │& FIX   │  │KASI    │  │        │        │
│  └────────┘  └────────┘  └────────┘  └────────┘  └────────┘        │
│                                                                       │
│  ◄──────────── 3 x 24 JAM (72 JAM) ─────────────►                   │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

---

## B3. FASE 1 — Deteksi Insiden

Breach bisa terdeteksi dari berbagai sumber:

```
┌───────────────────────────────────────────────────────────────┐
│                    SUMBER DETEKSI BREACH                       │
└───────────────────────────────────────────────────────────────┘

     ┌──────────────┐
     │ SIEM/SOAR    │──── Alert otomatis dari sistem keamanan
     │ (Webhook)    │     Contoh: anomali akses database,
     └──────┬───────┘     malware detected, unusual data export
            │
     ┌──────▼───────┐
     │ PRIVASIMU    │     Semua masuk ke satu pintu:
     │ Breach       │◄─── POST /api/v1/breach/report
     │ Inbox        │
     └──────▲───────┘
            │
     ┌──────┴───────┐
     │ Manual       │──── CISO / IT Security melaporkan
     │ Report       │     langsung via form di PRIVASIMU
     └──────┬───────┘
            │
     ┌──────┴───────┐
     │ Whistleblower│──── Karyawan melaporkan secara anonim
     │ Channel      │     via form khusus (tanpa login)
     └──────────────┘


┌───────────────────────────────────────────────────────────────┐
│                                                               │
│  FORM LAPORAN INSIDEN AWAL                                    │
│                                                               │
│  Judul Insiden    : [_________________________________]       │
│  Tanggal Deteksi  : [25/03/2026] Jam: [09:30]               │
│  Sumber Deteksi   : [SIEM ▼]                                │
│  Deskripsi Awal   : [_________________________________]       │
│                     [_________________________________]       │
│  Jenis Data       : ☑ Nama  ☑ KTP  ☐ Finansial  ☑ Email     │
│  Perkiraan Jumlah : [~5000] subjek data                      │
│  Sistem Terdampak : [Core Banking System ▼]                  │
│  Pelapor          : [Auto-filled / Anonim]                    │
│                                                               │
│  [Laporkan Insiden]                                           │
│                                                               │
└───────────────────────────────────────────────────────────────┘

         │
         ▼

┌──────────────────────────────────────────────────────────┐
│ ⏰ ALARM DIMULAI!                                         │
│                                                          │
│ Countdown: 71:59:59 tersisa dari 72 jam                  │
│                                                          │
│ Notif otomatis terkirim ke:                              │
│ • DPO         → Email + SMS                             │
│ • CISO        → Email + SMS                             │
│ • Legal       → Email                                   │
│ • Management  → Email (jika severity High/Critical)     │
│                                                          │
│ Level eskalasi alarm:                                    │
│ • 48 jam tersisa → reminder ke DPO                      │
│ • 24 jam tersisa → eskalasi ke CISO + Legal             │
│ • 12 jam tersisa → eskalasi ke Management               │
│ •  6 jam tersisa → URGENT ke semua stakeholder          │
│ •  1 jam tersisa → CRITICAL ALERT                       │
│ •  0 jam         → DEADLINE TERLEWAT ⚠️                 │
└──────────────────────────────────────────────────────────┘
```

---

## B4. FASE 2 — Assessment (Penilaian)

```
DPO / Incident Commander
      │
      ▼
┌──────────────────────────────────────────────────────────┐
│ FORM ASSESSMENT BREACH                                    │
│                                                          │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ SEVERITY SCORING (berbasis OWASP)                    │ │
│ │                                                      │ │
│ │ 1. Jenis data yang bocor:                            │ │
│ │    ○ Data umum (nama, email)          → Score: 2     │ │
│ │    ○ Data sensitif (KTP, finansial)   → Score: 5     │ │
│ │    ● Data sangat sensitif (kesehatan, → Score: 8     │ │
│ │      biometrik, ras, agama)                          │ │
│ │                                                      │ │
│ │ 2. Jumlah subjek terdampak:                          │ │
│ │    ○ < 100                            → Score: 1     │ │
│ │    ○ 100 - 1,000                      → Score: 3     │ │
│ │    ● 1,000 - 10,000                   → Score: 6     │ │
│ │    ○ > 10,000                         → Score: 9     │ │
│ │                                                      │ │
│ │ 3. Kemungkinan disalahgunakan:                       │ │
│ │    ○ Rendah (data terenkripsi)        → Score: 1     │ │
│ │    ● Sedang (sebagian terenkripsi)    → Score: 5     │ │
│ │    ○ Tinggi (plaintext)               → Score: 9     │ │
│ │                                                      │ │
│ │ 4. Penyebab breach:                                  │ │
│ │    ○ Kesalahan teknis (bug)           → Score: 3     │ │
│ │    ○ Human error                      → Score: 5     │ │
│ │    ● Serangan siber (hacking)         → Score: 8     │ │
│ │    ○ Insider threat                   → Score: 9     │ │
│ │                                                      │ │
│ │ ───────────────────────────────────────               │ │
│ │ TOTAL SCORE: 27/36                                   │ │
│ │ SEVERITY: 🔴 CRITICAL                                │ │
│ │                                                      │ │
│ │ ┌────────────────────────────────────────────────┐   │ │
│ │ │ Score 1-9   → LOW      🟢                      │   │ │
│ │ │ Score 10-18 → MEDIUM   🟡                      │   │ │
│ │ │ Score 19-27 → HIGH     🟠                      │   │ │
│ │ │ Score 28-36 → CRITICAL 🔴                      │   │ │
│ │ └────────────────────────────────────────────────┘   │ │
│ └──────────────────────────────────────────────────────┘ │
│                                                          │
│ Assign Incident Commander: [Pilih ▼]                     │
│ Assign Tim Responder: [Multi-select ▼]                   │
│                                                          │
│ [Simpan Assessment]                                      │
└──────────────────────────────────────────────────────────┘
```

---

## B5. FASE 3 — Containment & Remediation (Penanganan)

```
Incident Commander
      │
      ▼
┌──────────────────────────────────────────────────────────┐
│ CHECKLIST PENANGANAN                                      │
│                                                          │
│ ⏰ Countdown: 48:23:15 tersisa                           │
│                                                          │
│ CONTAINMENT (Pembatasan):                                │
│ ☑ Isolasi sistem yang terdampak                         │
│ ☑ Blokir akses yang tidak sah                          │
│ ☑ Preserve evidence (backup log)                        │
│ ☐ Ubah credentials yang compromised                    │
│ ☐ Aktifkan firewall rules tambahan                     │
│                                                          │
│ ERADICATION (Pembasmian):                                │
│ ☐ Identifikasi root cause                              │
│ ☐ Hapus malware / tutup vulnerability                  │
│ ☐ Patch sistem yang terdampak                          │
│                                                          │
│ RECOVERY (Pemulihan):                                    │
│ ☐ Restore data dari backup                             │
│ ☐ Verifikasi integritas data                           │
│ ☐ Monitor aktivitas abnormal                           │
│ ☐ Testing keamanan pasca-perbaikan                     │
│                                                          │
│ Catatan penanganan:                                      │
│ [___________________________________________________]    │
│ [___________________________________________________]    │
│                                                          │
│ Upload bukti: [📎 Drag & drop file di sini]             │
│                                                          │
│ [Update Progress]                                        │
└──────────────────────────────────────────────────────────┘

         │ (setiap update)
         ▼

┌──────────────────────────────────────────────────────────┐
│ TIMELINE INSIDEN (auto-generated)                         │
│                                                          │
│ 25/03 09:30 ── 🔴 Insiden terdeteksi oleh SIEM          │
│ 25/03 09:35 ── 📧 Notif terkirim ke DPO, CISO           │
│ 25/03 10:00 ── 📋 Assessment dilakukan (CRITICAL)        │
│ 25/03 10:15 ── 🔧 Tim responder ditugaskan              │
│ 25/03 10:30 ── 🛡️ Sistem diisolasi                      │
│ 25/03 11:00 ── 🔍 Root cause teridentifikasi             │
│ 25/03 14:00 ── 🔧 Patch diterapkan                      │
│ 25/03 16:00 ── ✅ Sistem dipulihkan                      │
│ 26/03 09:00 ── 📨 Notifikasi ke subjek data dikirim     │
│ 26/03 09:30 ── 📨 Notifikasi ke KOMDIGI dikirim         │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## B6. FASE 4 — Notifikasi (Pemberitahuan)

Sesuai Pasal 46 UU PDP, pemberitahuan wajib memuat:
- Data pribadi yang terungkap
- Kapan dan bagaimana data terungkap
- Upaya penanganan dan pemulihan

```
┌───────────────────────────────────────────────────────────────┐
│              FASE NOTIFIKASI (AUTO-GENERATE)                   │
└───────────────────────────────────────────────────────────────┘

DPO / Legal
      │
      ▼
┌──────────────────────────────────────────────────────────┐
│ PILIH JENIS NOTIFIKASI                                    │
│                                                          │
│ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐│
│ │  📨 Ke Subjek  │ │  📨 Ke Lembaga │ │  📢 Ke Publik  ││
│ │     Data       │ │   (KOMDIGI)    │ │  (jika perlu)  ││
│ │  [WAJIB]       │ │  [WAJIB]       │ │  [Kondisional] ││
│ └───────┬────────┘ └───────┬────────┘ └───────┬────────┘│
└─────────┼──────────────────┼──────────────────┼─────────┘
          │                  │                  │
          ▼                  ▼                  ▼

┌─────────────────────────────────────────────────────────────┐
│ TEMPLATE SURAT KE SUBJEK DATA (Auto-generated)               │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                                                         │ │
│ │  PEMBERITAHUAN KEGAGALAN                                │ │
│ │  PELINDUNGAN DATA PRIBADI                               │ │
│ │                                                         │ │
│ │  Nomor: [auto] / PDP / III / 2026                       │ │
│ │  Tanggal: 26 Maret 2026                                 │ │
│ │                                                         │ │
│ │  Yth. Bapak/Ibu [Nama Subjek Data],                     │ │
│ │                                                         │ │
│ │  Dengan hormat,                                         │ │
│ │                                                         │ │
│ │  Kami memberitahukan bahwa telah terjadi kegagalan       │ │
│ │  pelindungan data pribadi dengan rincian sebagai         │ │
│ │  berikut:                                               │ │
│ │                                                         │ │
│ │  1. Data Pribadi yang Terungkap:                        │ │
│ │     [Auto-fill: Nama, NIK, Email]                       │ │
│ │                                                         │ │
│ │  2. Waktu dan Cara Data Terungkap:                      │ │
│ │     [Auto-fill dari assessment]                         │ │
│ │     Terdeteksi pada [tanggal] pukul [jam]               │ │
│ │     melalui [sumber deteksi]                            │ │
│ │                                                         │ │
│ │  3. Upaya Penanganan dan Pemulihan:                     │ │
│ │     [Auto-fill dari checklist penanganan]               │ │
│ │     a. [Containment actions]                            │ │
│ │     b. [Remediation actions]                            │ │
│ │     c. [Prevention plan]                                │ │
│ │                                                         │ │
│ │  4. Langkah yang Dapat Dilakukan Subjek Data:           │ │
│ │     a. Mengganti password akun terkait                  │ │
│ │     b. Memantau aktivitas mencurigakan                  │ │
│ │     c. Menghubungi [kontak] untuk informasi lebih       │ │
│ │                                                         │ │
│ │  Hormat kami,                                           │ │
│ │  [Nama DPO]                                             │ │
│ │  Data Protection Officer                                │ │
│ │  [Nama Organisasi]                                      │ │
│ │                                                         │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ [Edit Surat] [Preview PDF] [Approve & Kirim]               │
└─────────────────────────────────────────────────────────────┘

         │
         ▼
┌──────────────────────────────────────────────────────────┐
│ METODE PENGIRIMAN:                                        │
│                                                          │
│ Ke Subjek Data:                                          │
│ ☑ Email (batch ke semua subjek terdampak)               │
│ ☑ SMS                                                   │
│ ☐ Surat fisik                                          │
│ ☐ In-app notification                                  │
│                                                          │
│ Ke Lembaga (KOMDIGI):                                    │
│ ☑ Email resmi ke [alamat KOMDIGI]                       │
│ ☑ Upload ke portal KOMDIGI (jika tersedia)              │
│ ☐ Surat fisik dengan tanda tangan basah                │
│                                                          │
│ Ke Publik (jika Pasal 46 ayat 3):                        │
│ ☐ Press release                                        │
│ ☐ Pengumuman di website                                │
│                                                          │
│ [Kirim Semua Notifikasi]                                 │
│                                                          │
│ Status pengiriman real-time:                             │
│ ✅ Email ke 4,892 subjek → 4,750 delivered, 142 bounced │
│ ✅ SMS ke 4,892 subjek → 4,820 delivered                │
│ ✅ Email ke KOMDIGI → delivered                          │
└──────────────────────────────────────────────────────────┘
```

---

## B7. FASE 5 — Closure (Penutupan)

```
DPO / Management
      │
      ▼
┌──────────────────────────────────────────────────────────┐
│ FORM PENUTUPAN INSIDEN                                    │
│                                                          │
│ Status: Semua notifikasi terkirim ✅                     │
│ Deadline: 42:15:00 tersisa (masih dalam 72 jam) ✅       │
│                                                          │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ LESSONS LEARNED                                      │ │
│ │                                                      │ │
│ │ Root Cause:                                          │ │
│ │ [SQL Injection pada endpoint /api/customer yang     ]│ │
│ │ [belum di-parameterize                              ]│ │
│ │                                                      │ │
│ │ Apa yang bisa dicegah:                               │ │
│ │ [Input validation, WAF rules, code review           ]│ │
│ │                                                      │ │
│ │ Prevention Plan:                                     │ │
│ │ ☑ Implementasi parameterized queries                │ │
│ │ ☑ Aktifkan WAF                                      │ │
│ │ ☑ Mandatory code review untuk API changes           │ │
│ │ ☐ Penetration testing quarterly                     │ │
│ │ ☐ Security awareness training untuk developer       │ │
│ │                                                      │ │
│ │ PIC untuk follow-up: [CTO ▼]                        │ │
│ │ Deadline prevention: [30/04/2026]                    │ │
│ └──────────────────────────────────────────────────────┘ │
│                                                          │
│ [Tutup Insiden]                                          │
└────────┬─────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────┐
│ ✅ INSIDEN DITUTUP                                        │
│                                                          │
│ Kode: BR-2026-001                                        │
│ Durasi: 29 jam 30 menit                                  │
│ Severity: CRITICAL                                       │
│ Subjek terdampak: 4,892                                  │
│ Notifikasi: Tepat waktu (dalam 72 jam) ✅                │
│                                                          │
│ 📄 Report lengkap tersedia untuk audit                   │
│ 📊 Data masuk ke dashboard statistik breach              │
│ 🔔 Reminder prevention plan aktif                        │
└──────────────────────────────────────────────────────────┘
```

---

## B8. Dashboard Data Breach

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  🚨 DATA BREACH DASHBOARD                                    │
│                                                              │
│  ⏰ INSIDEN AKTIF:                                           │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ BR-2026-003 │ Unauthorized Access │ 🔴 CRITICAL │ 23:45│ │
│  │ BR-2026-002 │ Data Leak via Email │ 🟡 MEDIUM   │ DONE │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│  │    3    │ │    1    │ │    2    │ │    0    │          │
│  │  Total  │ │ Active  │ │ Closed  │ │ Overdue │          │
│  │ 2026    │ │         │ │         │ │  ⚠️     │          │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘          │
│                                                              │
│  📊 SEVERITY DISTRIBUTION:         ⏱️ AVG RESPONSE TIME:    │
│  ┌────────────────────────┐        ┌────────────────────┐   │
│  │ 🔴 Critical: 1 (33%)  │        │                    │   │
│  │ 🟠 High    : 0 (0%)   │        │  18.5 jam          │   │
│  │ 🟡 Medium  : 1 (33%)  │        │  (target < 72 jam) │   │
│  │ 🟢 Low     : 1 (33%)  │        │  ✅ Dalam batas    │   │
│  └────────────────────────┘        └────────────────────┘   │
│                                                              │
│  📈 TREN BREACH (12 bulan terakhir):                         │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ 2 │     █                                               │ │
│  │ 1 │ █   █       █           █               █           │ │
│  │ 0 │ ▁ ▁ ▁ ▁ ▁ ▁ ▁ ▁ ▁ ▁ ▁ ▁                           │ │
│  │   │ A M J J A S O N D J F M                             │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## B9. Integrasi SIEM/SOAR (Webhook)

```
┌───────────────────────────────────────────────────────────────┐
│                 ALUR INTEGRASI SIEM / SOAR                    │
└───────────────────────────────────────────────────────────────┘

SIEM (Splunk / QRadar / Wazuh / dll)
      │
      │ Alert: "Anomalous data export detected"
      │
      ▼
POST /api/v1/breach/webhook/siem
{
  "source": "wazuh",
  "alert_id": "WAZ-2026-4521",
  "severity": "high",
  "title": "Anomalous bulk data export from DB",
  "description": "User admin@company.com exported 50,000 rows...",
  "timestamp": "2026-03-25T09:30:00Z",
  "affected_system": "customer_db",
  "raw_log": "..."
}
      │
      ▼
┌──────────────────────────────────────┐
│ PRIVASIMU auto-creates:              │
│ • Breach incident record             │
│ • Pre-filled severity (from alert)   │
│ • Start 72-hour countdown            │
│ • Notify DPO + CISO                  │
│ • Log in breach timeline             │
└──────────────────────────────────────┘
      │
      ▼ (setelah penanganan)
      
POST /api/v1/breach/webhook/update
{
  "alert_id": "WAZ-2026-4521",
  "status": "resolved",
  "resolution": "False positive - authorized export by IT dept"
}
      │
      ▼
┌──────────────────────────────────────┐
│ PRIVASIMU update:                    │
│ • Update status incident             │
│ • Log resolution in timeline         │
│ • If false positive → close incident │
│ • If real → continue lifecycle       │
└──────────────────────────────────────┘
```

---

## B10. 🔥 Incident Simulation (Fire Drill)

Fitur simulasi untuk menguji kesiapan tim dalam menangani data breach. **Satu tombol = satu skenario incident simulasi** yang harus ditangani seperti insiden nyata, tapi semua ditandai `[SIMULASI]` dan tidak ada notifikasi ke luar.

### B10.1 Konsep

```
┌───────────────────────────────────────────────────────────────┐
│                 🔥 INCIDENT SIMULATION (FIRE DRILL)            │
│                                                               │
│  Tujuan:                                                      │
│  • Melatih kesiapan tim dalam menangani data breach           │
│  • Mengukur response time tim                                 │
│  • Memastikan semua pihak tahu perannya                       │
│  • Mengidentifikasi kelemahan dalam SOP                       │
│  • Memenuhi syarat audit (bukti latihan respons insiden)      │
│                                                               │
│  Perbedaan dengan insiden nyata:                               │
│  • Semua record ditandai is_simulation: true                  │
│  • TIDAK ada notifikasi ke subjek data asli                   │
│  • TIDAK ada laporan ke KOMDIGI                               │
│  • TIDAK menghitung ke statistik breach sesungguhnya          │
│  • BISA di-reset / dihapus setelah selesai                    │
│  • Timer bisa di-accelerate (misal 72 jam → 2 jam)           │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

### B10.2 Alur Simulasi

```
DPO / Admin
      │
      ▼
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  🔥 INCIDENT SIMULATION CENTER                               │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Pilih Skenario Simulasi:                              │  │
│  │                                                        │  │
│  │  ┌─────────────────────────────────────────────────┐   │  │
│  │  │ 📋 SKENARIO PRE-BUILT                           │   │  │
│  │  │                                                 │   │  │
│  │  │ ○ 🟢 [EASY] Laptop karyawan hilang              │   │  │
│  │  │   Data: Nama, email 50 karyawan                 │   │  │
│  │  │   Severity expected: LOW                        │   │  │
│  │  │                                                 │   │  │
│  │  │ ○ 🟡 [MEDIUM] Email blast salah kirim           │   │  │
│  │  │   Data: Nama, no rek 500 nasabah                │   │  │
│  │  │   Severity expected: MEDIUM                     │   │  │
│  │  │                                                 │   │  │
│  │  │ ● 🟠 [HARD] SQL Injection di API                │   │  │
│  │  │   Data: Nama, KTP, finansial 5,000 nasabah      │   │  │
│  │  │   Severity expected: HIGH                       │   │  │
│  │  │                                                 │   │  │
│  │  │ ○ 🔴 [CRITICAL] Ransomware attack               │   │  │
│  │  │   Data: Seluruh database customer               │   │  │
│  │  │   Severity expected: CRITICAL                   │   │  │
│  │  │                                                 │   │  │
│  │  │ ○ 🎲 [RANDOM] Skenario acak oleh AI             │   │  │
│  │  │   AI generate skenario unik setiap kali         │   │  │
│  │  │                                                 │   │  │
│  │  │ ○ ✏️ [CUSTOM] Buat skenario sendiri              │   │  │
│  │  └─────────────────────────────────────────────────┘   │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  ⚙️ KONFIGURASI SIMULASI:                              │  │
│  │                                                        │  │
│  │  Timer Mode:                                           │  │
│  │  ○ Realtime (72 jam nyata)                             │  │
│  │  ● Accelerated (72 jam → 2 jam)                        │  │
│  │  ○ Accelerated (72 jam → 30 menit)                     │  │
│  │  ○ No timer (tanpa batas waktu)                        │  │
│  │                                                        │  │
│  │  Peserta yang dilibatkan:                               │  │
│  │  ☑ DPO (wajib)                                        │  │
│  │  ☑ CISO                                               │  │
│  │  ☑ IT Security Team                                   │  │
│  │  ☑ Legal / Compliance                                 │  │
│  │  ☐ Management / C-Level                               │  │
│  │  ☐ CS / Customer-facing team                          │  │
│  │                                                        │  │
│  │  Notifikasi simulasi ke peserta via:                    │  │
│  │  ☑ Email (dengan tag [SIMULASI])                      │  │
│  │  ☑ In-app notification                                │  │
│  │  ☐ SMS                                                │  │
│  │  ☐ WhatsApp                                           │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                                                        │  │
│  │          🔥 MULAI SIMULASI                             │  │
│  │                                                        │  │
│  │  ⚠️ Semua peserta akan menerima notifikasi             │  │
│  │     dan harus merespons sesuai SOP                     │  │
│  │                                                        │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### B10.3 Setelah Tombol Ditekan

```
🔥 TOMBOL DITEKAN!
      │
      ▼
┌──────────────────────────────────────────────────────────────┐
│ SISTEM SECARA OTOMATIS:                                      │
│                                                              │
│ 1. ✅ Buat breach incident record                            │
│    • Kode: SIM-2026-001 (prefix SIM)                         │
│    • Status: DETECTED                                        │
│    • is_simulation: TRUE                                     │
│    • Skenario data auto-filled dari template                 │
│                                                              │
│ 2. ✅ Mulai countdown timer                                  │
│    • Jika accelerated 2 jam:                                 │
│      72 jam simulasi = 2 jam real                            │
│      1 jam simulasi ≈ 1.67 menit real                       │
│                                                              │
│ 3. ✅ Kirim notifikasi [SIMULASI] ke semua peserta           │
│    ┌────────────────────────────────────────────────────┐    │
│    │ 📧 Subject: [SIMULASI] Data Breach Terdeteksi!     │    │
│    │                                                    │    │
│    │ ⚠️ INI ADALAH SIMULASI - BUKAN INSIDEN NYATA       │    │
│    │                                                    │    │
│    │ Skenario: SQL Injection pada API Customer          │    │
│    │ Data terdampak: Nama, KTP, data finansial          │    │
│    │ Jumlah subjek: ~5,000                              │    │
│    │                                                    │    │
│    │ Anda diminta untuk merespons sesuai SOP.           │    │
│    │ Timer simulasi sudah berjalan.                     │    │
│    │                                                    │    │
│    │ [Buka PRIVASIMU →]                                 │    │
│    └────────────────────────────────────────────────────┘    │
│                                                              │
│ 4. ✅ Catat waktu mulai & siapa yang sudah baca notif       │
│                                                              │
└──────────────────────────────────────────────────────────────┘
      │
      ▼
┌──────────────────────────────────────────────────────────────┐
│ PESERTA HARUS MERESPONS SEPERTI INSIDEN NYATA:               │
│                                                              │
│ • DPO       → Buka PRIVASIMU, lakukan assessment            │
│ • CISO      → Review severity, assign commander             │
│ • IT Team   → Isi checklist containment                     │
│ • Legal     → Review & approve template notifikasi          │
│                                                              │
│ Bedanya dengan real:                                         │
│ • Tombol "Kirim Notifikasi" → hanya preview, tidak kirim    │
│ • Data subjek → data dummy/test                             │
│ • Banner [SIMULASI] muncul di setiap halaman                │
│                                                              │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │  🔥 [SIMULASI] Data Breach — SIM-2026-001               │ │
│ │  ⏰ Timer: 01:23:45 / 02:00:00 (accelerated)            │ │
│ │  ████████████████░░░░░░░░░░░░░░  69%                    │ │
│ │                                                          │ │
│ │  Status saat ini: CONTAINMENT                            │ │
│ │                                                          │ │
│ │  Responder Activity:                                     │ │
│ │  ✅ DPO membuka insiden        — 2 menit setelah notif  │ │
│ │  ✅ CISO melakukan assessment  — 5 menit setelah notif  │ │
│ │  ✅ IT mulai containment       — 8 menit setelah notif  │ │
│ │  ⏳ Legal belum merespons      — 15 menit sejak notif   │ │
│ │                                                          │ │
│ │  [Lihat Detail] [Akhiri Simulasi Lebih Awal]             │ │
│ └──────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

### B10.4 Scoring & Report Pasca-Simulasi

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  📊 FIRE DRILL REPORT — SIM-2026-001                         │
│  Tanggal: 25 Maret 2026                                     │
│  Skenario: SQL Injection pada API Customer (HARD)            │
│  Timer: Accelerated (2 jam)                                  │
│                                                              │
│  ══════════════════════════════════════════════════           │
│                                                              │
│  OVERALL SCORE:  78/100  🟡 BAIK                             │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Score 90-100 → 🟢 EXCELLENT  (Tim sangat siap)         │  │
│  │ Score 70-89  → 🟡 BAIK       (Perlu sedikit perbaikan) │  │
│  │ Score 50-69  → 🟠 CUKUP      (Perlu latihan lagi)      │  │
│  │ Score 0-49   → 🔴 KURANG     (SOP perlu direvisi)       │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ══════════════════════════════════════════════════           │
│                                                              │
│  📋 BREAKDOWN SCORING:                                       │
│                                                              │
│  ┌──────────────────────────────┬────────┬────────┐          │
│  │ Kriteria                     │ Score  │ Maks   │          │
│  ├──────────────────────────────┼────────┼────────┤          │
│  │ Response Time (first action) │ 18/20  │   20   │          │
│  │ Assessment Accuracy          │ 15/20  │   20   │          │
│  │ Containment Completeness     │ 15/20  │   20   │          │
│  │ Notification Timeliness      │ 20/20  │   20   │          │
│  │ Team Coordination            │ 10/20  │   20   │          │
│  ├──────────────────────────────┼────────┼────────┤          │
│  │ TOTAL                        │ 78/100 │  100   │          │
│  └──────────────────────────────┴────────┴────────┘          │
│                                                              │
│  ══════════════════════════════════════════════════           │
│                                                              │
│  ⏱️ RESPONSE TIME PER RESPONDER:                             │
│                                                              │
│  ┌─────────────┬──────────┬──────────┬──────────────────┐   │
│  │ Responder   │ Notified │ Responded│ Waktu Respons    │   │
│  ├─────────────┼──────────┼──────────┼──────────────────┤   │
│  │ DPO (Budi)  │ 09:30:00 │ 09:32:15 │ 2m 15s ✅ Cepat  │   │
│  │ CISO (Andi) │ 09:30:00 │ 09:35:30 │ 5m 30s ✅ Cepat  │   │
│  │ IT (Dev)    │ 09:30:00 │ 09:38:00 │ 8m 00s ✅ Baik   │   │
│  │ Legal (Sari)│ 09:30:00 │ 09:52:00 │ 22m 0s ⚠️ Lambat │   │
│  └─────────────┴──────────┴──────────┴──────────────────┘   │
│                                                              │
│  ══════════════════════════════════════════════════           │
│                                                              │
│  📝 TEMUAN & REKOMENDASI (auto-generated + editable):        │
│                                                              │
│  ⚠️ Temuan:                                                  │
│  1. Legal team response time > 20 menit (target < 10 menit) │
│  2. Severity assessment sedikit under-estimated              │
│     (team scored MEDIUM, correct answer: HIGH)               │
│  3. 2 dari 5 item checklist containment terlewat            │
│                                                              │
│  ✅ Yang sudah baik:                                         │
│  1. DPO & CISO merespons dalam < 5 menit                    │
│  2. Semua notifikasi template tergenerate dalam waktu       │
│  3. Timeline insiden tercatat dengan lengkap                │
│                                                              │
│  💡 Rekomendasi:                                             │
│  1. Legal team perlu diingatkan SOP & install app notifikasi │
│  2. Adakan training severity scoring untuk tim               │
│  3. Buat checklist containment lebih detail per skenario     │
│                                                              │
│  ══════════════════════════════════════════════════           │
│                                                              │
│  [Export PDF] [Kirim ke Management] [Jadwalkan Drill Ulang]  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### B10.5 Skenario AI-Generated (Random)

```
┌──────────────────────────────────────────────────────────────┐
│ 🎲 AI SCENARIO GENERATOR                                     │
│                                                              │
│ Ketika user pilih [RANDOM], PRIVA AI akan:                   │
│                                                              │
│ 1. Generate skenario unik berdasarkan:                       │
│    • Industri organisasi (banking, healthcare, dll)          │
│    • Tren data breach terkini di Indonesia                   │
│    • Jenis data yang diproses organisasi                     │
│    • Breach yang pernah terjadi (BSSN report, berita)        │
│                                                              │
│ 2. Contoh output AI:                                         │
│    ┌────────────────────────────────────────────────────────┐│
│    │ 🎲 Skenario: "Insider Threat — Ex-Employee"            ││
│    │                                                        ││
│    │ Mantan karyawan divisi IT yang baru resign 2 minggu    ││
│    │ lalu menggunakan VPN credentials yang belum direvoke    ││
│    │ untuk mengakses database nasabah. Terdeteksi oleh       ││
│    │ SIEM karena login dari IP luar negeri pada jam 02:00.   ││
│    │                                                        ││
│    │ Data: Nama, KTP, nomor rekening, saldo                 ││
│    │ Jumlah: ~12,000 records diakses                         ││
│    │ Severity hint: HIGH-CRITICAL                            ││
│    │                                                        ││
│    │ Twist: Setelah 1 jam, ditemukan bahwa ex-employee       ││
│    │ juga meng-copy data ke USB sebelum resign.              ││
│    └────────────────────────────────────────────────────────┘│
│                                                              │
│ 3. AI juga generate "twist" di tengah simulasi:              │
│    • Informasi baru muncul (data lebih banyak dari dugaan)  │
│    • Media mulai bertanya (simulasi tekanan publik)          │
│    • Subjek data mengeluh di sosmed (simulasi reputasi)     │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### B10.6 Riwayat & Tren Simulasi

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  📊 FIRE DRILL HISTORY                                       │
│                                                              │
│  ┌──────────┬──────────────────────┬───────┬──────────────┐ │
│  │ Tanggal  │ Skenario             │ Score │ Trend        │ │
│  ├──────────┼──────────────────────┼───────┼──────────────┤ │
│  │ 25/03/26 │ SQL Injection (HARD) │ 78/100│ ▲ +12 better │ │
│  │ 15/02/26 │ Email Leak (MEDIUM)  │ 66/100│ ▲ +8 better  │ │
│  │ 10/01/26 │ Laptop Hilang (EASY) │ 58/100│ baseline     │ │
│  └──────────┴──────────────────────┴───────┴──────────────┘ │
│                                                              │
│  📈 Score Trend:                                             │
│  100 ┤                                                       │
│   80 ┤                              ●  78                    │
│   60 ┤              ●  66                                    │
│   40 ┤  ●  58                                                │
│   20 ┤                                                       │
│    0 ┤──────────────────────────                             │
│       Jan      Feb      Mar                                  │
│                                                              │
│  ✅ Tim semakin siap! Improvement +20 poin dalam 3 bulan.    │
│                                                              │
│  Rekomendasi: Jadwalkan simulasi berikutnya dengan           │
│  skenario CRITICAL untuk tantangan lebih tinggi.              │
│                                                              │
│  [Jadwalkan Simulasi Baru] [Export Semua Report]             │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### B10.7 Database Tables (Simulasi)

```sql
-- Konfigurasi & riwayat simulasi
CREATE TABLE breach_simulations (
    id UUID PRIMARY KEY,
    org_id UUID REFERENCES organizations(id),
    incident_id UUID REFERENCES breach_incidents(id), -- linked incident (is_simulation=true)
    scenario_type VARCHAR(50),     -- 'easy', 'medium', 'hard', 'critical', 'random', 'custom'
    scenario_title VARCHAR(255),
    scenario_description TEXT,
    scenario_data JSONB,           -- detail skenario
    timer_mode VARCHAR(50),        -- 'realtime', 'accelerated_2h', 'accelerated_30m', 'no_timer'
    timer_ratio DECIMAL,           -- e.g., 36.0 (72/2) for 2-hour mode
    participants UUID[],           -- array of user IDs
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    overall_score INT,
    score_breakdown JSONB,         -- {response_time: 18, assessment: 15, ...}
    findings JSONB,                -- temuan otomatis
    recommendations TEXT,
    status VARCHAR(50),            -- 'scheduled', 'running', 'completed', 'cancelled'
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Response time per peserta
CREATE TABLE simulation_responses (
    id UUID PRIMARY KEY,
    simulation_id UUID REFERENCES breach_simulations(id),
    user_id UUID REFERENCES users(id),
    role VARCHAR(50),              -- 'dpo', 'ciso', 'it_security', 'legal'
    notified_at TIMESTAMPTZ,
    first_opened_at TIMESTAMPTZ,   -- kapan pertama buka PRIVASIMU
    first_action_at TIMESTAMPTZ,   -- kapan pertama melakukan aksi
    actions_log JSONB,             -- log semua aksi selama simulasi
    response_time_seconds INT,
    individual_score INT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Untuk kolom baru di breach_incidents
-- ALTER TABLE breach_incidents ADD COLUMN is_simulation BOOLEAN DEFAULT FALSE;
```

---

## Ringkasan Flow

### Consent Management — 6 Alur:

| # | Alur | Trigger | Aktor Utama |
|---|------|---------|-------------|
| A2 | Setup Template | Admin buat template baru | Admin → DPO |
| A3 | Consent Digital | User buka app | End User |
| A4 | Consent via CS | Nasabah datang ke kantor | CS Officer → Nasabah |
| A5 | Consent Pihak Ketiga | Subjek data anak/disabilitas | Wali/Ortu |
| A6 | Agregasi Dashboard | DPO ingin lihat overview | DPO |
| A7 | Pencabutan (Revoke) | Subjek data minta cabut | End User / CS |

### Data Breach Management — 5 Fase + 2 Fitur Tambahan:

| # | Fase | Durasi Target | Aktor Utama |
|---|------|:-------------:|-------------|
| B3 | Deteksi | Immediate | SIEM / IT Security / Whistleblower |
| B4 | Assessment | < 4 jam | DPO + CISO |
| B5 | Containment & Fix | < 24 jam | Incident Commander + Tim |
| B6 | Notifikasi | < 72 jam (wajib) | DPO + Legal |
| B7 | Closure | Setelah semua selesai | DPO + Management |
| B9 | SIEM/SOAR Integration | Otomatis | System (webhook) |
| **B10** | **🔥 Incident Simulation** | **Configurable** | **DPO / Admin → Seluruh Tim** |

---

> **Dokumen ini menjadi acuan pengembangan UI dan API untuk kedua modul.**
> Last Updated: 25 Maret 2026
