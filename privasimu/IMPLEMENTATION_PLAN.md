# 📋 PRIVASIMU — Implementation Plan

> **Platform Assessment UU PDP (Pelindungan Data Pribadi)**
> Dokumen Perencanaan Teknis Pengembangan
> Tanggal: 25 Maret 2026

---

## 1. Executive Summary

PRIVASIMU adalah platform compliance untuk UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (PDP), setara dengan GDPR di Eropa. Platform ini akan dikembangkan agar bisa di-deploy secara **on-premise** oleh klien dan dilengkapi dengan **AI (PRIVA)** untuk otomatisasi review dokumen privasi.

### Budget & Timeline
| Item | Detail |
|------|--------|
| **Total Budget** | Rp 50.000.000 / 3 bulan |
| **Pembayaran** | 30% awal — 40% pertengahan — 30% selesai |
| **Retainer Bulanan** | Rp 3.000.000/bulan |
| **Timeline** | April 2026 — Juni 2026 (3 bulan) |

---

## 2. Analisis Existing Platform

### 2.1 Platform Saat Ini

**URL:** `https://pdp.privasimu.com`
**Versi:** v2.2025.3
**Tagline:** *"Indonesia's First Privacy Management Tool"*

### 2.2 Tech Stack Existing

| Layer | Teknologi |
|-------|----------|
| **Frontend** | Next.js (App Router) + React |
| **Backend API** | PHP 8.2.30 (terpisah di `api-pdp.privasimu.com`) |
| **Analytics** | PostHog, Microsoft Clarity, Cloudflare RUM |
| **Hosting** | Cloudflare (CDN/DNS) |

### 2.3 Status Modul Existing

| URL Path | Status | Keterangan |
|----------|--------|------------|
| `/dashboard` | ✅ **200 OK** | Minimalis — hanya kartu "Total Users: 14" |
| `/data-discovery` | 🔒 **403 Forbidden** | **Sudah ada**, tapi dibatasi role |
| `/ropa` | 🔒 **403 Forbidden** | **Sudah ada**, tapi dibatasi role |
| `/dpia` | 🔒 **403 Forbidden** | **Sudah ada**, tapi dibatasi role |
| `/consent` | ❌ **404 Not Found** | **Belum diimplementasikan** |
| `/dsar` | ❌ **404 Not Found** | **Belum diimplementasikan** |
| `/data-breach` | ❌ **404 Not Found** | **Belum diimplementasikan** |
| `/settings` | ❌ **404 Not Found** | **Belum diimplementasikan** |
| `/users` | ❌ **404 Not Found** | **Belum diimplementasikan** |

### 2.4 UI/UX Saat Ini

- **Layout:** Topbar (logo + org badge + notification + profile) + horizontal nav minimal
- **Warna:** Light theme — putih + biru muda (gradient border)
- **Navigasi:** Hanya ikon "Dashboard" yang visible di sidebar
- **Profile:** Informasi Umum, Detail Organisasi, Keamanan
- **RBAC:** Sudah ada role system (role saat ini: "Maker")
- **Multi-tenant:** Sudah ada workspace/organisasi ("PT Tester Indonesia")

### 2.5 Kesimpulan Analisis

**Yang sudah ada (perlu di-enhance):**
- ✅ Authentication & login
- ✅ RBAC / role management (Maker, Checker, dll)
- ✅ Multi-tenant / workspace per organisasi
- ✅ Data Discovery (basic, perlu akses admin untuk lihat)
- ✅ RoPA (basic, perlu akses admin untuk lihat)
- ✅ DPIA (basic, perlu akses admin untuk lihat)
- ✅ Profile & organisasi management
- ✅ Notification system (bell icon)

**Yang perlu dibangun baru:**
- 🆕 Consent Management (modul baru)
- 🆕 Data Breach Management (modul baru dari scratch)
- 🆕 DSAR (modul baru)
- 🆕 PRIVA AI Engine (modul baru)
- 🆕 Contract Review (modul baru)
- 🆕 Settings / Admin panel
- 🆕 User Management page

**Yang perlu di-improve:**
- 🔄 Sidebar navigation (pindah dari horizontal ke vertical sidebar)
- 🔄 Dashboard (tambah widget, charts, statistics)
- 🔄 Icon yang konsisten
- 🔄 Data Discovery (unstructured scan, DB connector)
- 🔄 RoPA (koneksi ke Data Discovery & DSAR)
- 🔄 DPIA (AI-assisted review)

---

## 3. Arsitektur Sistem

### 3.1 Tech Stack

> **Catatan:** Existing platform sudah menggunakan Next.js (frontend) + PHP (backend API).
> Pengembangan baru akan **tetap mengikuti arsitektur ini** — extend, bukan rewrite.

```
┌─────────────────────────────────────────────────────────┐
│                    PRIVASIMU PLATFORM                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Frontend:  Next.js (App Router) + React + TypeScript   │
│  Styling:   Tailwind CSS + Shadcn/UI                    │
│  Backend:   PHP 8.2 API (api-pdp.privasimu.com)         │
│  Database:  PostgreSQL / MySQL                           │
│  Auth:      Existing auth system (RBAC ready)           │
│  AI Engine: Qwen (on-prem) / DeepSeek / Bedrock (cloud) │
│  Queue:     Redis / Laravel Queue (scanning jobs)       │
│  Storage:   Local filesystem (on-prem) / S3 compatible  │
│  Analytics: PostHog + Clarity + Cloudflare RUM           │
│  Deploy:    Docker + Docker Compose (on-premise ready)   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 3.2 Arsitektur On-Premise

```
┌──────────────────────────────────────────────────────────────┐
│                   CLIENT INFRASTRUCTURE                       │
│                                                              │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐ │
│  │  Nginx   │──▶│ Next.js  │──▶│PostgreSQL│   │  Redis   │ │
│  │ Reverse  │   │   App    │   │    DB    │   │  Cache   │ │
│  │  Proxy   │   │ (Docker) │   │ (Docker) │   │ (Docker) │ │
│  └──────────┘   └────┬─────┘   └──────────┘   └──────────┘ │
│                      │                                       │
│                 ┌────▼─────┐   ┌──────────┐                 │
│                 │  PRIVA   │   │  BullMQ  │                 │
│                 │ AI Engine│   │  Worker  │                 │
│                 │  (Qwen)  │   │ (Scanner)│                 │
│                 │ (Docker) │   │ (Docker) │                 │
│                 └──────────┘   └──────────┘                 │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              SIEM / SOAR Integration                  │   │
│  │         (via webhook / API connector)                 │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

### 3.3 Database Schema Overview

```
Organizations ─┬─▶ Users (with RBAC roles)
               ├─▶ ConsentLibrary ──▶ ConsentRecords ──▶ SubjectData
               ├─▶ DataBreachIncidents ──▶ BreachNotifications
               ├─▶ DataDiscoverySources ──▶ DataMappings ──▶ RoPA / DSAR
               ├─▶ DPIA_Records
               ├─▶ ContractReviews
               └─▶ AuditLogs
```

---

## 4. Modul-Modul Pengembangan

---

### 4.1 MODUL 1: Consent Management

**Status:** Build baru (belum ada di existing — 404)
**Prioritas:** 🔴 Tinggi
**Estimasi:** 3-4 minggu

#### 4.1.1 Fitur yang Dikembangkan

| # | Fitur | Detail | Kompleksitas |
|---|-------|--------|:------------:|
| 1.1 | **Consent Library** | Library template consent yang sudah dikaji kesesuaiannya dengan UU PDP, POJK 22/2023, dll. Organisasi bisa pilih template atau buat custom. | ⭐⭐⭐ |
| 1.2 | **Integrasi Aplikasi Existing** | API endpoint untuk integrasi consent management dengan aplikasi klien yang sudah berjalan. SDK/Widget embeddable. | ⭐⭐⭐⭐ |
| 1.3 | **Demo Riil Data** | Halaman demo dengan data riil untuk menunjukkan cara kerja consent management ke prospek klien. | ⭐⭐ |
| 1.4 | **Input Consent via CS** | Flow khusus untuk Customer Service officer: CS mengisi form → customer review → tanda tangan digital → consent tercatat. | ⭐⭐⭐ |
| 1.5 | **Agregasi Consent per User** | Dashboard yang menampilkan semua consent yang dimiliki satu subjek data, di semua aplikasi. Bukan per-consent tapi per-user view. | ⭐⭐⭐ |
| 1.6 | **Consent Pihak Ketiga** | Riset & implementasi consent untuk: orang tua (anak di bawah umur), wali (penyandang disabilitas). Sesuai Pasal 25-26 UU PDP. | ⭐⭐⭐⭐ |

#### 4.1.2 Flow Consent via Customer Service

```
┌─────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│ Customer│     │    CS    │     │ Customer │     │  System  │
│ datang  │────▶│ mengisi  │────▶│ review & │────▶│ catat &  │
│ ke bank │     │  form    │     │ ttd      │     │ simpan   │
│         │     │ consent  │     │ digital  │     │ consent  │
└─────────┘     └──────────┘     └──────────┘     └──────────┘
                     │                                  │
                     ▼                                  ▼
              Form pre-filled              Notifikasi ke subjek
              dengan data nasabah          data via email/SMS
```

#### 4.1.3 API Endpoints

```
POST   /api/v1/consent/templates          → Buat template consent
GET    /api/v1/consent/templates           → List semua template
POST   /api/v1/consent/records             → Catat consent baru
GET    /api/v1/consent/subjects/:id        → Lihat semua consent per subjek
POST   /api/v1/consent/cs-flow/initiate    → CS mulai proses consent
POST   /api/v1/consent/cs-flow/sign        → Customer tanda tangan
GET    /api/v1/consent/aggregate/:userId   → Agregasi consent per user
POST   /api/v1/consent/third-party         → Consent oleh pihak ketiga
GET    /api/v1/consent/library             → Library consent (UU PDP compliant)
```

#### 4.1.4 Database Tables

```sql
-- Template consent yang sudah dikaji
CREATE TABLE consent_templates (
    id UUID PRIMARY KEY,
    org_id UUID REFERENCES organizations(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    purpose TEXT NOT NULL,
    legal_basis TEXT NOT NULL,           -- UU PDP, POJK 22/2023, etc.
    version INT DEFAULT 1,
    content JSONB NOT NULL,             -- struktur form consent
    is_library BOOLEAN DEFAULT FALSE,   -- true = dari library privasimu
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Record consent individual
CREATE TABLE consent_records (
    id UUID PRIMARY KEY,
    template_id UUID REFERENCES consent_templates(id),
    subject_id UUID REFERENCES data_subjects(id),
    org_id UUID REFERENCES organizations(id),
    application_name VARCHAR(255),       -- dari aplikasi mana
    consent_given BOOLEAN NOT NULL,
    consent_method VARCHAR(50),          -- 'digital', 'cs_officer', 'third_party'
    cs_officer_id UUID,                  -- jika via CS
    third_party_type VARCHAR(50),        -- 'parent', 'guardian'
    third_party_id UUID,
    digital_signature TEXT,
    ip_address INET,
    consent_date TIMESTAMPTZ NOT NULL,
    expiry_date TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subjek data (user/nasabah)
CREATE TABLE data_subjects (
    id UUID PRIMARY KEY,
    org_id UUID REFERENCES organizations(id),
    external_id VARCHAR(255),            -- ID di sistem klien
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    id_type VARCHAR(50),                 -- KTP, Passport, etc.
    id_number VARCHAR(100),
    is_minor BOOLEAN DEFAULT FALSE,
    is_disabled BOOLEAN DEFAULT FALSE,
    guardian_id UUID,                     -- referensi ke wali/ortu
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 4.2 MODUL 2: Data Breach Management

**Status:** Build from scratch (0 → 1)
**Prioritas:** 🔴 Tinggi
**Estimasi:** 4-5 minggu
**Referensi Regulasi:**
- UU No. 27 Tahun 2022 (Pasal 46)
- NIST Cybersecurity Framework 2.0
- ISO 27701:2025
- EU Data Breach Notification
- Singapore Data Breach Notification Framework
- OWASP Assessment Data Breach

#### 4.2.1 Fitur yang Dikembangkan

| # | Fitur | Detail | Kompleksitas |
|---|-------|--------|:------------:|
| 2.1 | **Incident Registration** | Form registrasi insiden data breach dengan field sesuai Pasal 46 UU PDP: data apa yang terungkap, kapan, bagaimana. | ⭐⭐⭐ |
| 2.2 | **Severity Assessment** | Penilaian tingkat keparahan breach berdasarkan OWASP framework. Auto-classification: low/medium/high/critical. | ⭐⭐⭐⭐ |
| 2.3 | **Alarm 3x24 Jam** | Countdown timer otomatis sejak breach terdeteksi. Notifikasi bertingkat via email/SMS/webhook ke PIC. Eskalasi otomatis. | ⭐⭐⭐ |
| 2.4 | **Template Pemberitahuan** | Auto-generate surat pemberitahuan ke: (a) Subjek Data, (b) Lembaga (KOMDIGI), sesuai format Pasal 46 ayat 2. | ⭐⭐⭐ |
| 2.5 | **Template Penanganan** | Template upaya penanganan & pemulihan. Checklist langkah-langkah mitigasi. | ⭐⭐⭐ |
| 2.6 | **SIEM/SOAR Integration** | Webhook receiver untuk menerima alert dari SIEM/SOAR. API connector untuk feed balik status penanganan. | ⭐⭐⭐⭐⭐ |
| 2.7 | **Whistleblowing Integration** | Channel pelaporan internal untuk karyawan melaporkan potensi breach. Anonymous reporting. | ⭐⭐⭐ |
| 2.8 | **Incident Lifecycle** | Full lifecycle: Deteksi → Identifikasi → Containment → Perbaikan → Perlindungan → Respon → Pelaporan → Closure. | ⭐⭐⭐⭐ |
| 2.9 | **Dashboard & Reporting** | Real-time dashboard status semua insiden. Laporan periodik. Statistik & tren. | ⭐⭐⭐ |

#### 4.2.2 Flow Data Breach Management

```
     DETEKSI                    IDENTIFIKASI              PENANGANAN
┌──────────────┐          ┌──────────────┐          ┌──────────────┐
│ • SIEM Alert │          │ • Klasifikasi│          │ • Containment│
│ • SOAR Alert │─────────▶│ • Severity   │─────────▶│ • Eradication│
│ • Manual     │          │ • Impact     │          │ • Recovery   │
│ • Whistle-   │          │ • Data Type  │          │              │
│   blowing    │          │              │          │              │
└──────────────┘          └──────────────┘          └──────────────┘
                                │                         │
                    ┌───────────▼────────┐               │
                    │  ⏰ ALARM 3x24 JAM │               │
                    │  Auto-start timer  │               │
                    └───────────┬────────┘               │
                                │                         │
                    ┌───────────▼─────────────────────────▼──┐
                    │            PELAPORAN                     │
                    │  ┌─────────────┐  ┌─────────────────┐  │
                    │  │ Ke Subjek   │  │ Ke Lembaga      │  │
                    │  │ Data Pribadi│  │ (KOMDIGI)       │  │
                    │  │ (auto-gen)  │  │ (auto-gen)      │  │
                    │  └─────────────┘  └─────────────────┘  │
                    └─────────────────────────────────────────┘
                                │
                    ┌───────────▼────────┐
                    │     CLOSURE        │
                    │ • Lessons learned  │
                    │ • Prevention plan  │
                    │ • Audit trail      │
                    └────────────────────┘
```

#### 4.2.3 Database Tables

```sql
-- Insiden data breach
CREATE TABLE breach_incidents (
    id UUID PRIMARY KEY,
    org_id UUID REFERENCES organizations(id),
    incident_code VARCHAR(50) UNIQUE,     -- auto-generated: BR-2026-001
    title VARCHAR(255) NOT NULL,
    description TEXT,
    detected_at TIMESTAMPTZ NOT NULL,
    detection_source VARCHAR(50),          -- 'siem', 'soar', 'manual', 'whistleblower'
    severity VARCHAR(20),                  -- 'low', 'medium', 'high', 'critical'
    status VARCHAR(50) DEFAULT 'detected', -- detected → identified → contained → resolved → reported → closed
    data_types_affected JSONB,             -- ['nama', 'email', 'KTP', etc.]
    number_of_subjects INT,
    how_it_happened TEXT,
    containment_actions TEXT,
    remediation_actions TEXT,
    prevention_plan TEXT,
    deadline_notification TIMESTAMPTZ,     -- detected_at + 3x24 jam
    notified_subjects_at TIMESTAMPTZ,
    notified_authority_at TIMESTAMPTZ,
    notified_public_at TIMESTAMPTZ,
    closed_at TIMESTAMPTZ,
    reported_by UUID REFERENCES users(id),
    assigned_to UUID REFERENCES users(id),
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Timeline & log aktivitas per insiden
CREATE TABLE breach_timeline (
    id UUID PRIMARY KEY,
    incident_id UUID REFERENCES breach_incidents(id),
    action VARCHAR(255) NOT NULL,
    description TEXT,
    performed_by UUID REFERENCES users(id),
    performed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifikasi yang dikirim
CREATE TABLE breach_notifications (
    id UUID PRIMARY KEY,
    incident_id UUID REFERENCES breach_incidents(id),
    notification_type VARCHAR(50),  -- 'subject', 'authority', 'public'
    recipient_type VARCHAR(50),
    recipient_name VARCHAR(255),
    recipient_contact VARCHAR(255),
    template_used TEXT,
    content TEXT,
    sent_at TIMESTAMPTZ,
    delivery_status VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Konfigurasi alarm & eskalasi
CREATE TABLE breach_alarm_config (
    id UUID PRIMARY KEY,
    org_id UUID REFERENCES organizations(id),
    hours_before_deadline INT NOT NULL,  -- e.g., 48, 24, 12, 6, 1
    notification_channel VARCHAR(50),     -- 'email', 'sms', 'webhook'
    recipient_role VARCHAR(50),           -- 'dpo', 'ciso', 'ceo'
    is_active BOOLEAN DEFAULT TRUE
);
```

---

### 4.3 MODUL 3: Data Discovery

**Status:** Enhancement dari existing (sudah ada — 403, perlu akses admin untuk explore fitur existing)
**Prioritas:** 🟡 Sedang-Tinggi
**Estimasi:** 4-5 minggu

#### 4.3.1 Fitur yang Dikembangkan

| # | Fitur | Detail | Kompleksitas |
|---|-------|--------|:------------:|
| 3.1 | **Unstructured Data Scanning** | Scan file di folder/path yang dipilih user (bukan hanya link). Support: PDF, DOCX, XLSX, CSV, TXT, JSON, XML, images (OCR). | ⭐⭐⭐⭐⭐ |
| 3.2 | **Stress Test Data Besar** | Capability scan dataset besar (ribuan file). Queue-based processing. Progress tracking. | ⭐⭐⭐⭐ |
| 3.3 | **Database Connector** | Connector ke berbagai database: PostgreSQL, MySQL, SQL Server, Oracle, MongoDB. Config via UI. | ⭐⭐⭐⭐⭐ |
| 3.4 | **Column & Row Selection** | Setelah connect ke database, user bisa pilih tabel, kolom, dan row range yang ingin di-scan. | ⭐⭐⭐ |
| 3.5 | **Koneksi ke DSAR** | Data mapping dari discovery bisa langsung digunakan saat ada Subject Access Request— cari data subjek di semua sumber. | ⭐⭐⭐⭐ |
| 3.6 | **Koneksi ke RoPA** | Satu tabel/data bisa di-link ke beberapa RoPA. Dashboard menunjukkan frekuensi & pentingnya data. | ⭐⭐⭐⭐ |
| 3.7 | **Retensi Data Alert** | Alert ketika data memasuki masa retensi. Auto-flag data pribadi yang seharusnya terenkripsi tapi tidak. | ⭐⭐⭐ |
| 3.8 | **Data Classification** | Auto-classify data yang ditemukan: nama, email, KTP, alamat, data sensitif, data anak, dll. | ⭐⭐⭐⭐ |

#### 4.3.2 Arsitektur Data Discovery

```
┌──────────────────────────────────────────────────────────────┐
│                    DATA DISCOVERY ENGINE                       │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   SOURCE     │  │   SOURCE    │  │      SOURCE         │ │
│  │  File System │  │  Database   │  │   Unstructured      │ │
│  │  (folder/    │  │  Connector  │  │   (PDF, DOCX,       │ │
│  │   path scan) │  │  (PG, MySQL │  │    XLSX, Images)    │ │
│  │              │  │   MSSQL,    │  │                     │ │
│  │              │  │   Oracle,   │  │                     │ │
│  │              │  │   MongoDB)  │  │                     │ │
│  └──────┬───────┘  └──────┬──────┘  └──────────┬──────────┘ │
│         │                 │                     │            │
│         └────────────┬────┴─────────────────────┘            │
│                      ▼                                       │
│         ┌────────────────────────┐                           │
│         │    BullMQ Job Queue    │                           │
│         │   (scan jobs / batch)  │                           │
│         └───────────┬────────────┘                           │
│                     ▼                                        │
│         ┌────────────────────────┐                           │
│         │   AI Classification    │                           │
│         │   (PII Detection &     │                           │
│         │    Categorization)     │                           │
│         └───────────┬────────────┘                           │
│                     ▼                                        │
│         ┌────────────────────────┐                           │
│         │    Data Mapping        │◀──── Link ke RoPA         │
│         │    Repository          │◀──── Link ke DSAR         │
│         │                        │◀──── Retensi tracking     │
│         └────────────────────────┘                           │
└──────────────────────────────────────────────────────────────┘
```

#### 4.3.3 Database Tables

```sql
-- Sumber data yang di-scan
CREATE TABLE discovery_sources (
    id UUID PRIMARY KEY,
    org_id UUID REFERENCES organizations(id),
    source_type VARCHAR(50) NOT NULL,    -- 'filesystem', 'database', 'api'
    name VARCHAR(255) NOT NULL,
    connection_config JSONB,              -- encrypted connection details
    scan_scope JSONB,                     -- folders, tables, columns selected
    last_scanned_at TIMESTAMPTZ,
    scan_frequency VARCHAR(50),           -- 'manual', 'daily', 'weekly'
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hasil data mapping
CREATE TABLE data_mappings (
    id UUID PRIMARY KEY,
    source_id UUID REFERENCES discovery_sources(id),
    org_id UUID REFERENCES organizations(id),
    data_location TEXT NOT NULL,           -- path/table/column
    data_type VARCHAR(100),               -- 'nama', 'email', 'ktp', 'alamat'
    classification VARCHAR(50),           -- 'personal', 'sensitive', 'child'
    is_encrypted BOOLEAN DEFAULT FALSE,
    should_be_encrypted BOOLEAN DEFAULT FALSE,
    retention_period_days INT,
    retention_expires_at TIMESTAMPTZ,
    sample_data TEXT,                     -- masked sample
    row_count INT,
    linked_ropa_ids UUID[],              -- array of RoPA IDs
    linked_dsar_ids UUID[],
    metadata JSONB,
    discovered_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scan jobs
CREATE TABLE discovery_scan_jobs (
    id UUID PRIMARY KEY,
    source_id UUID REFERENCES discovery_sources(id),
    status VARCHAR(50) DEFAULT 'queued',  -- queued → running → completed → failed
    total_items INT,
    processed_items INT DEFAULT 0,
    findings_count INT DEFAULT 0,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    error_log TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 4.4 MODUL 4: PRIVA (AI Engine)

**Status:** Build baru + On-Premise deployment
**Prioritas:** 🔴 Tinggi
**Estimasi:** 4-5 minggu

#### 4.4.1 Fitur yang Dikembangkan

| # | Fitur | Detail | Kompleksitas |
|---|-------|--------|:------------:|
| 4.1 | **On-Premise PRIVA** | Deploy PRIVA AI engine di infrastruktur klien. Docker-based. Tidak perlu internet. | ⭐⭐⭐⭐⭐ |
| 4.2 | **Review RoPA** | AI review dokumen Record of Processing Activities. Cek kelengkapan, konsistensi, dan kepatuhan. | ⭐⭐⭐⭐ |
| 4.3 | **Review DPIA** | AI review Data Protection Impact Assessment. Identifikasi risiko, rekomendasi mitigasi. | ⭐⭐⭐⭐ |
| 4.4 | **Review Kontrak Privasi** | AI review perjanjian pemrosesan data, DPA, NDA terkait data pribadi. Flag klausul bermasalah. | ⭐⭐⭐⭐⭐ |
| 4.5 | **Multi-Model Support** | Support Qwen (on-prem primary), DeepSeek (cloud fallback), AWS Bedrock (enterprise option). | ⭐⭐⭐⭐ |
| 4.6 | **RAG Knowledge Base** | Knowledge base berisi UU PDP, POJK, peraturan terkait. RAG untuk jawaban yang akurat. | ⭐⭐⭐⭐⭐ |

#### 4.4.2 Arsitektur PRIVA AI

```
┌──────────────────────────────────────────────────────────────┐
│                       PRIVA AI ENGINE                         │
│                                                              │
│  ┌─────────────┐   ┌──────────────────────────────────────┐ │
│  │   User      │   │          AI Orchestrator              │ │
│  │   Input     │──▶│                                      │ │
│  │  (dokumen,  │   │  ┌────────────┐  ┌────────────────┐  │ │
│  │   query)    │   │  │ Document   │  │  RAG Pipeline  │  │ │
│  │             │   │  │ Parser     │  │                │  │ │
│  └─────────────┘   │  │ (PDF,DOCX) │  │  ┌──────────┐ │  │ │
│                     │  └─────┬──────┘  │  │ Vector   │ │  │ │
│                     │        │         │  │ Store    │ │  │ │
│                     │        ▼         │  │(pgvector)│ │  │ │
│                     │  ┌────────────┐  │  └──────────┘ │  │ │
│                     │  │ Chunking & │  │               │  │ │
│                     │  │ Embedding  │──▶  ┌──────────┐ │  │ │
│                     │  └────────────┘  │  │ Knowledge│ │  │ │
│                     │                  │  │ Base:    │ │  │ │
│                     │                  │  │ • UU PDP │ │  │ │
│                     │                  │  │ • POJK   │ │  │ │
│                     │                  │  │ • ISO    │ │  │ │
│                     │                  │  │ • NIST   │ │  │ │
│                     │                  │  └──────────┘ │  │ │
│                     │                  └───────┬────────┘  │ │
│                     │                          │           │ │
│                     │  ┌───────────────────────▼────────┐  │ │
│                     │  │        LLM Router              │  │ │
│                     │  │  ┌───────┐ ┌────────┐ ┌─────┐  │  │ │
│                     │  │  │ Qwen  │ │DeepSeek│ │ AWS │  │  │ │
│                     │  │  │(Local)│ │(Cloud) │ │Bedr.│  │  │ │
│                     │  │  └───────┘ └────────┘ └─────┘  │  │ │
│                     │  └────────────────────────────────┘  │ │
│                     └──────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

#### 4.4.3 AI Review Capabilities

**Review RoPA:**
```json
{
  "input": "Dokumen RoPA (PDF/DOCX)",
  "output": {
    "completeness_score": 85,
    "missing_fields": ["legal_basis_detail", "retention_period"],
    "compliance_issues": [
      {
        "section": "Tujuan Pemrosesan",
        "issue": "Tujuan terlalu umum, perlu diperjelas",
        "regulation": "Pasal 16 ayat 2 UU PDP",
        "recommendation": "Uraikan tujuan spesifik per kategori data"
      }
    ],
    "risk_level": "medium",
    "ai_suggestions": ["...", "..."]
  }
}
```

**Review Kontrak Privasi:**
```json
{
  "input": "Dokumen kontrak/DPA (PDF/DOCX)",
  "output": {
    "contract_type": "Data Processing Agreement",
    "flagged_clauses": [
      {
        "clause_number": "5.3",
        "text": "Pemroses boleh menggunakan data untuk kepentingan sendiri",
        "risk": "critical",
        "issue": "Bertentangan dengan Pasal 51 UU PDP",
        "recommendation": "Hapus klausul ini atau batasi sesuai instruksi pengendali"
      }
    ],
    "missing_clauses": [
      "Kewajiban penghapusan data setelah berakhir kontrak",
      "Mekanisme audit oleh pengendali"
    ],
    "overall_risk": "high"
  }
}
```

---

## 5. UI/UX Improvement

### 5.1 Perubahan yang Dibutuhkan

| # | Item | Detail |
|---|------|--------|
| 1 | **Sidebar Dashboard** | Pindah navigasi ke sidebar (dari top-bar). Collapsible sidebar. |
| 2 | **Icon yang Sesuai** | Gunakan icon set yang konsisten (Lucide Icons). Icon per modul. |
| 3 | **Upload Struktur Organisasi** | Upload org chart → auto-mapping ke role/akses di platform. |
| 4 | **Dark/Light Theme** | Support dark mode dan light mode. |
| 5 | **Responsive Design** | Mobile-friendly untuk monitoring. |

### 5.2 Navigasi Sidebar

```
┌──────────────────────────────────────────────────────┐
│ 🛡️ PRIVASIMU                              [🔔] [👤] │
├────────────┬─────────────────────────────────────────┤
│            │                                         │
│ 📊 Dashboard│  [Dashboard Content Area]              │
│            │                                         │
│ 📋 RoPA    │                                         │
│            │                                         │
│ 🔍 Data    │                                         │
│   Discovery│                                         │
│            │                                         │
│ ✅ Consent │                                         │
│   Mgmt     │                                         │
│            │                                         │
│ 🚨 Data    │                                         │
│   Breach   │                                         │
│            │                                         │
│ 📄 DSAR    │                                         │
│            │                                         │
│ 📝 DPIA    │                                         │
│            │                                         │
│ 🤖 PRIVA   │                                         │
│   AI       │                                         │
│            │                                         │
│ 📑 Kontrak │                                         │
│            │                                         │
│ 👥 Users   │                                         │
│            │                                         │
│ ⚙️ Settings│                                         │
│            │                                         │
│ 📊 Reports │                                         │
│            │                                         │
└────────────┴─────────────────────────────────────────┘
```

---

## 6. Timeline Pengembangan (3 Bulan)

### Bulan 1: April 2026 (Milestone: 30% Payment)

| Minggu | Aktivitas | Deliverable |
|--------|-----------|-------------|
| **W1** | Project setup, Docker infrastructure, DB schema, Auth + RBAC | Boilerplate running, docker-compose ready |
| **W2** | UI overhaul: sidebar, icons, responsive. Upload org chart → role mapping | New UI shell with sidebar navigation |
| **W3** | Consent Management: library, template CRUD, integrasi API | Consent module v1 functional |
| **W4** | Consent Management: CS flow, agregasi per user, consent pihak ketiga | Consent module complete |

### Bulan 2: Mei 2026 (Milestone: 40% Payment)

| Minggu | Aktivitas | Deliverable |
|--------|-----------|-------------|
| **W5** | Data Breach Management: arsitektur, incident registration, severity assessment | Breach module basic flow |
| **W6** | Data Breach: alarm 3x24, template notifikasi auto-gen, lifecycle management | Breach module with automation |
| **W7** | Data Breach: SIEM/SOAR integration, whistleblowing. Data Discovery: unstructured scan | Breach complete + Discovery started |
| **W8** | Data Discovery: DB connector, column/row selection, stress test data besar | Discovery scan engine working |

### Bulan 3: Juni 2026 (Milestone: 30% Payment)

| Minggu | Aktivitas | Deliverable |
|--------|-----------|-------------|
| **W9** | Data Discovery: koneksi DSAR & RoPA, retensi alert. PRIVA: setup on-prem | Discovery complete + PRIVA foundation |
| **W10** | PRIVA AI: RAG knowledge base (UU PDP, POJK), review RoPA & DPIA | PRIVA AI review features |
| **W11** | PRIVA AI: review kontrak privasi, multi-model support (Qwen/DeepSeek/Bedrock) | PRIVA AI complete |
| **W12** | Integration testing, bug fixing, documentation, deployment guide on-prem | Final release + documentation |

---

## 7. Deliverables

### 7.1 Software Deliverables
1. ✅ Source code (Git repository)
2. ✅ Docker images untuk semua services
3. ✅ `docker-compose.yml` untuk on-premise deployment
4. ✅ Database migration scripts
5. ✅ API documentation (OpenAPI/Swagger)
6. ✅ Seed data (consent library, templates, knowledge base)

### 7.2 Documentation Deliverables
1. 📄 Installation Guide (On-Premise)
2. 📄 User Manual per modul
3. 📄 API Reference
4. 📄 Admin Guide (konfigurasi, SIEM integration)
5. 📄 AI Knowledge Base maintenance guide

### 7.3 Non-Functional Requirements
| Requirement | Target |
|-------------|--------|
| **Performance** | Scan 10,000 files < 30 menit |
| **Concurrent Users** | 100+ simultaneous users |
| **Database** | Support 1M+ consent records |
| **AI Response Time** | Review dokumen < 60 detik |
| **Uptime** | 99.5% |
| **Security** | Encryption at rest & in transit |
| **Backup** | Automated daily backup |

---

## 8. Risiko & Mitigasi

| # | Risiko | Impact | Mitigasi |
|---|--------|--------|----------|
| 1 | Qwen model terlalu besar untuk on-prem klien | 🔴 High | Sediakan model quantized (4-bit/8-bit). Minimum spec: 16GB RAM, GPU optional |
| 2 | SIEM/SOAR klien berbeda-beda format | 🟡 Medium | Buat adapter pattern, support format umum (CEF, LEEF, Syslog) |
| 3 | Unstructured data scan lambat untuk volume besar | 🟡 Medium | Queue-based, parallel processing, incremental scan |
| 4 | Database connector security concern | 🔴 High | Read-only connection, credential encryption, audit log |
| 5 | UU PDP belum ada PP pelaksana lengkap | 🟡 Medium | Knowledge base modular, mudah di-update saat regulasi baru keluar |

---

## 9. Folder Structure (Project)

```
privasimu/
├── docker-compose.yml            # On-premise deployment
├── docker-compose.dev.yml        # Development
├── Dockerfile                    # App container
├── Dockerfile.ai                 # PRIVA AI container
├── .env.example
│
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/               # Login, register
│   │   ├── (dashboard)/          # Main dashboard layout
│   │   │   ├── dashboard/        # Overview
│   │   │   ├── consent/          # Consent Management
│   │   │   ├── breach/           # Data Breach Management
│   │   │   ├── discovery/        # Data Discovery
│   │   │   ├── dsar/             # Data Subject Access Request
│   │   │   ├── dpia/             # Data Protection Impact Assessment
│   │   │   ├── ropa/             # Record of Processing Activities
│   │   │   ├── priva/            # PRIVA AI
│   │   │   ├── contracts/        # Contract Review
│   │   │   ├── users/            # User Management
│   │   │   ├── settings/         # Settings
│   │   │   └── reports/          # Reports
│   │   └── api/                  # API Routes
│   │       ├── v1/
│   │       │   ├── consent/
│   │       │   ├── breach/
│   │       │   ├── discovery/
│   │       │   ├── dsar/
│   │       │   ├── priva/
│   │       │   └── webhook/      # SIEM/SOAR webhooks
│   │       └── trpc/
│   │
│   ├── components/               # React components
│   │   ├── ui/                   # Shadcn/UI base
│   │   ├── layout/               # Sidebar, header, etc.
│   │   ├── consent/
│   │   ├── breach/
│   │   ├── discovery/
│   │   ├── priva/
│   │   └── shared/
│   │
│   ├── lib/                      # Utilities
│   │   ├── db/                   # Prisma client
│   │   ├── ai/                   # AI engine (Qwen, DeepSeek, Bedrock)
│   │   ├── connectors/           # DB connectors
│   │   ├── scanner/              # File scanner engine
│   │   ├── queue/                # BullMQ jobs
│   │   ├── notifications/        # Email, SMS, webhook
│   │   └── templates/            # Document templates
│   │
│   ├── server/                   # tRPC routers
│   │   ├── routers/
│   │   └── trpc.ts
│   │
│   └── types/                    # TypeScript types
│
├── prisma/
│   ├── schema.prisma             # Database schema
│   ├── migrations/
│   └── seed.ts                   # Consent library, templates
│
├── ai/                           # PRIVA AI Engine
│   ├── models/                   # Model configs
│   ├── knowledge-base/           # UU PDP, POJK, ISO docs
│   ├── embeddings/               # Vector embeddings
│   └── prompts/                  # System prompts for review
│
├── docs/                         # Documentation
│   ├── installation.md
│   ├── api-reference.md
│   ├── user-manual.md
│   └── admin-guide.md
│
└── scripts/                      # Deployment scripts
    ├── setup-onprem.sh
    ├── backup.sh
    └── migrate.sh
```

---

## 10. Getting Started (Development)

```bash
# 1. Clone & install
git clone <repo-url> privasimu
cd privasimu
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env with database credentials, AI API keys, etc.

# 3. Start infrastructure (dev)
docker-compose -f docker-compose.dev.yml up -d

# 4. Run database migrations
npx prisma migrate dev

# 5. Seed initial data
npx prisma db seed

# 6. Start development server
npm run dev

# 7. Open browser
# http://localhost:3000
```

---

> **Dokumen ini akan di-update secara berkala sesuai progress pengembangan.**
> Last Updated: 25 Maret 2026
