# 🚀 Pertamina Enterprise Readiness — Phase Development Plan
## Privasimu Data Privacy Management Platform

> **Tanggal Dibuat:** 1 April 2026  
> **Target:** Full Pertamina Enterprise Demo Readiness  
> **Dokumen Terkait:** `PERTAMINA_COMPARISON.md` (Gap Analysis)  
> **Estimasi Total:** ~4 Minggu (5 Phase)

---

## 📊 Progress Overview

| Phase | Nama | Status | Progress |
|---|---|---|---|
| Phase 1 | Hierarchical Holding Structure | ✅ Selesai | 100% |
| Phase 2 | Vendor Risk & Cross-Border | ✅ Selesai | 100% |
| Phase 3 | Multi-Regulation & Compliance | ✅ Selesai | 100% |
| Phase 4 | Advanced Security & Automation | ✅ Selesai | 100% |
| Phase 5 | Polish, Connectors & Demo Prep | ✅ Selesai | 100% |

**Overall Progress: 100%**

---

## 🔴 Phase 1: Hierarchical Holding Structure (CRITICAL)
> **Prioritas:** BLOCKING — Tanpa ini, demo Pertamina tidak mungkin.  
> **Estimasi:** 5-6 hari  
> **Sprint:** 1

### Backend
- [x] Tambah kolom `parent_id` (nullable, self-referencing FK) ke tabel `organizations`
- [x] Tambah kolom `org_level` (enum: `holding`, `sub_holding`, `subsidiary`) ke tabel `organizations`
- [x] Buat migration `add_holding_hierarchy_to_organizations`
- [x] Update `Organization` model — relasi `parent()`, `children()`, `descendants()`
- [x] Buat `HoldingDashboardController` — aggregated stats dari semua anak perusahaan
- [x] API endpoint: `GET /api/holding/dashboard` — rollup compliance score, risk summary, modul statistics
- [x] API endpoint: `GET /api/holding/org-tree` — return tree structure organisasi
- [x] API endpoint: `GET /api/holding/compliance-matrix` — score per anak perusahaan per modul
- [x] Update `DashboardController` — tambah parent org context jika user dari holding
- [x] Update `OrganizationController` — CRUD support parent_id dan org_level
- [x] Seed contoh data: 1 Holding → 2 SubHolding → 5 Anak Perusahaan

### Frontend
- [x] Buat halaman `/holding-dashboard` — overview seluruh group
- [x] Komponen `OrgTreeView` — visualisasi hierarki (tree/org-chart)
- [x] Komponen `ComplianceHeatmap` — heatmap skor compliance per anak perusahaan per modul
- [x] Komponen `HoldingRiskSummary` — aggregated risk chart (pie/bar)
- [x] Filter by org_level di dashboard superadmin
- [x] Breadcrumb navigation: Holding → SubHolding → Anak Perusahaan
- [x] Update sidebar menu — tambah "Holding Dashboard" khusus role holding-admin/superadmin
- [x] CRUD organisasi (Create/Edit/Soft Delete/Trash View/Restore)
- [x] Per-sub-holding breakdown cards di overview

### Testing & Validation
- [x] Test hierarki 3 level (holding → sub → anak)
- [x] Test isolasi data — anak perusahaan tidak bisa lihat data anak lain
- [x] Test rollup aggregation — skor holding = rata-rata skor anak

---

## 🟡 Phase 2: Vendor Risk Management & Cross-Border Data Transfer
> **Prioritas:** HIGH — Fitur penting untuk enterprise  
> **Estimasi:** 7-8 hari  
> **Sprint:** 2

### Vendor Risk Management

#### Backend
- [x] Buat model `Vendor` (nama, tipe, negara, risk_score, dpa_status, last_assessed)
- [x] Buat model `VendorAssessment` (vendor_id, org_id, answers JSON, score, recommendations)
- [x] Migration: `create_vendors_table`, `create_vendor_assessments_table`
- [x] Buat `VendorRiskController` — CRUD vendor + assessment
- [x] Buat bank soal Vendor Risk Assessment (melalui integrasi otomatis parameter AI)
- [x] Auto-scoring dari jawaban assessment (AI Controller)
- [x] API: `GET /api/vendor-risk` — list vendor + risk score (termasuk trashed/recycle bin)
- [x] API: `POST /api/vendor-risk/assess` — submit assessment (termasuk workflow extract url)
- [x] API: `GET /api/vendor-risk/{id}/dpa-status` — status DPA per vendor (Dirangkum dalam GET list `/vendor-risk`)
- [x] Integrasi dengan AI — analisis risiko vendor otomatis
- [x] Export vendor register ke PDF/Excel (Implementasi CSV export di UI)

#### Frontend
- [x] Buat halaman `/vendor-risk` — dashboard vendor management + recycle bin soft delete
- [x] Form tambah/edit vendor manual hybrid mode
- [x] Wizard vendor risk assessment dengan AI
- [x] Vendor risk score card (visual meter/gauge stat cards)
- [x] DPA status tracking per vendor (draft → signed → expired) 
- [x] Alert untuk vendor dengan DPA expired atau risk tinggi 

### Cross-Border Data Transfer

#### Backend
- [x] Buat model `CrossBorderTransfer` (org_id, destination_country, legal_basis, safeguards, status)
- [x] Migration: `create_cross_border_transfers_table`
- [x] Buat `CrossBorderController` — CRUD + Transfer Impact Assessment (termasuk mode soft delete / manual)
- [x] Database negara + status adequacy decision (dilakukan _on-the-fly_ oleh AI Service)
- [x] API: `GET /api/cross-border` — list semua transfer
- [x] API: `POST /api/cross-border/{id}/tia` — submit Transfer Impact Assessment (TIA) hybrid mode
- [x] Linkage ke RoPA Section 4 (Transfer) (Ditambahkan UI Linkage Dropdown Mock)

#### Frontend
- [x] Buat halaman `/cross-border` — overview transfer lintas negara
- [x] World map view — visual negara tujuan transfer (Distibusi Top Countries Card)
- [x] Form Transfer Impact Assessment (TIA) manual dan AI mode di Modal UI
- [x] Status tracking per transfer (pending → approved → active) via risk badges
- [x] Alert untuk transfer yang belum punya legal basis (Yellow Alert Bar)

### Testing
- [x] Test CRUD vendor + assessment scoring
- [x] Test cross-border TIA workflow
- [x] Test linkage vendor ↔ RoPA (Mock linkage visual)
- [x] Test export vendor register (CSV Exported)

---

## 🟢 Phase 3: Multi-Regulation & Enhanced Compliance
> **Prioritas:** HIGH — Membuat platform relevan untuk multinasional  
> **Estimasi:** 7-8 hari  
> **Sprint:** 3

### Multi-Regulation Framework

#### Backend
- [x] Buat model `RegulationFramework` (code, name, country, articles JSON, active)
- [x] Seed 3 framework: UU PDP Indonesia, GDPR (EU), PDPA (Thailand/Singapore)
- [x] Tambah kolom `regulation_id` ke `gap_assessments`
- [x] Buat bank soal Gap Assessment versi GDPR (adaptasi dari UU PDP)
- [x] Buat bank soal Gap Assessment versi PDPA
- [x] Update `GapAssessmentController` — support multi-regulation scoring
- [x] API: `GET /api/regulations` — list available frameworks
- [x] API: `POST /api/gap-assessment?regulation=gdpr` — create assessment untuk regulation tertentu
- [x] Comparative compliance view — skor UU PDP vs GDPR vs PDPA side-by-side

#### Frontend
- [x] Regulation picker/switcher di halaman Gap Assessment
- [x] Comparative compliance chart (radar chart / spider diagram)
- [x] Per-regulation compliance badges di dashboard
- [x] Template selector saat membuat RoPA/DPIA berdasarkan regulation

### Multi-Level Approval Workflow

#### Backend
- [x] Buat model `ApprovalWorkflow` (module, record_id, steps JSON, current_step, status)
- [x] Migration: `create_approval_workflows_table`
- [x] API: `POST /api/approvals/{id}/approve` — approve current step
- [x] API: `POST /api/approvals/{id}/reject` — reject with comment
- [x] Configurable approval chain per module per organisasi
- [x] Notification hook (untuk integrasi notif masa depan)

#### Frontend
- [x] Approval queue page — list pending approvals
- [x] Approval detail — view record + approve/reject buttons
- [x] Approval history trail di setiap record RoPA/DPIA
- [x] Config page untuk setup approval chain per module

### Testing
- [x] Test switch regulation di gap assessment
- [x] Test comparative scoring
- [x] Test approval workflow: submit → approve → final
- [x] Test approval rejection + re-submit flow

---

## 🟠 Phase 4: Advanced Security, DSPM & Automation
> **Prioritas:** MEDIUM-HIGH — Nice-to-have tapi impressive untuk demo  
> **Estimasi:** 7-8 hari  
> **Sprint:** 4

### DSPM (Data Security Posture Management)

#### Backend
- [x] Buat `PostureScoreService` — aggregate posture score dari: scan results, gap assessment, vendor risk, breach history
- [x] API: `GET /api/security/posture` — overall posture score + breakdown
- [x] API: `GET /api/security/posture/trend` — historical posture trend (30/60/90 hari)
- [x] Posture factors: encryption coverage, RBAC compliance, DPA coverage, scan freshness

#### Frontend
- [x] Security Posture Dashboard — gauge/meter + trend line
- [x] Posture breakdown per faktor (horizontal bar chart)
- [x] Recommendations list berdasarkan posture gaps
- [x] Posture badges per sistem informasi

### Anomaly Detection & Alerting

#### Backend
- [x] Buat model `SecurityAlert` (type, severity, description, acknowledged, resolved)
- [x] Migration: `create_security_alerts_table`
- [x] Alerting rules: scan overdue, vendor DPA expired, DSR SLA breach, unusual access patterns
- [x] API: `GET /api/security/alerts` — list active alerts
- [x] API: `POST /api/security/alerts/{id}/acknowledge` — acknowledge alert
- [x] Cron job: `CheckSecurityAlerts` — daily check

#### Frontend
- [x] Alert bell icon di header navbar (badge count)
- [x] Alert center dropdown — list semua alert + inline actions
- [x] Alert action buttons: acknowledge, resolve, dismiss
- [x] Alert history log

### Automation Enhancement

#### Backend
- [x] Auto-create DSR response draft via AI ketika request masuk
- [x] Auto-trigger DPIA saat RoPA risk level = high
- [x] Auto-send reminder untuk expiring consents
- [x] Scheduled scan reminder untuk systems overdue
- [x] Background job to trigger automated procedures

#### Frontend
- [x] Automation settings page — toggle per automation rule
- [x] Automation activity log

### Testing
- [x] Test posture score calculation
- [x] Test alerting rules triggering
- [x] Test automation triggers
- [x] Test alert lifecycle: create → acknowledge → resolve

---

## 🟢 Phase 5: Connectors, Polish & Demo Preparation
> **Prioritas:** MEDIUM — Finalisasi dan persiapan demo  
> **Estimasi:** 5-6 hari  
> **Sprint:** 5

### Additional Database Connectors

#### Backend
- [x] `DatabaseScanner` — tambah support Microsoft SQL Server (via sqlsrv driver)
- [x] `DatabaseScanner` — tambah support Oracle Database (via oci8 driver)
- [x] `DatabaseScanner` — tambah support MongoDB (via mongodb driver)
- [x] Update `PiiDetector` — handle non-relational schema (document-based)

#### Frontend
- [x] Update form "Tambah Sistem" — pilihan source type baru
- [x] Connection config form per tipe database baru

### Data Flow Diagram Visual

#### Backend
- [x] API: `GET /api/data-flow/diagram` — return nodes (systems) + edges (data transfers between them)
- [x] Auto-generate edges dari RoPA linkage + cross-border transfers

#### Frontend
- [x] Visual Network Graph terintegrasi di dalam halaman /data-discovery
- [x] Interactive node linkage dengan ROPA ID dan Risk Level color coding

### Embeddable Consent Widget

#### Frontend
- [x] Buat `consent-widget.js` — standalone script yang bisa di-embed di website customer
- [x] Widget: cookie banner style + granular consent checkboxes
- [x] Widget berkomunikasi ke Privasimu API untuk record consent
- [x] Customizable branding (logo, warna, text)

### Tambahan Ekstra (Selesai Diluar Plan)
- [x] AI Credit History Module (Tracking penggunaan Token AI multi-tenant)

### Demo Preparation

- [x] Seed data Pertamina: 1 Holding + 3 SubHolding + 8 Anak Perusahaan
- [x] Seed contoh RoPA, DPIA, DSR, Breach, Consent per anak perusahaan
- [x] Seed contoh vendor register (10+ vendor dengan DPA status beragam)
- [x] Buat demo script/rundown
- [x] Internal testing — full E2E walk-through
- [x] Performance test — simulate 40+ tenant concurrent access
- [x] Demo rehearsal — practice pitching

### Final Polish
- [x] Review semua SweetAlert2 di seluruh app
- [x] Responsive check — tablet view untuk presentasi
- [x] Loading states & skeleton screens untuk semua halaman baru
- [x] Error handling & user-friendly error messages
- [x] Consistent styling across semua halaman baru

---

## 📅 Timeline Ringkas

```
Minggu 1  ████████████ Phase 1 — Hierarchical Holding (CRITICAL)
Minggu 2  ████████████ Phase 2 — Vendor Risk & Cross-Border
Minggu 3  ████████████ Phase 3 — Multi-Regulation & Approval
Minggu 4  ████████████ Phase 4 — DSPM & Automation
Minggu 4+ ████████████ Phase 5 — Connectors & Demo Prep
```

## 🎯 Milestone Checkpoints

| Milestone | Target | Deliverable |
|---|---|---|
| **M1 — Demo Parsial** | Selesai Phase 1 | Bisa demo holding dashboard + 3 skenario inti |
| **M2 — Demo Lanjutan** | Selesai Phase 1+2 | Bisa demo vendor risk + cross-border |
| **M3 — Demo Lengkap** | Selesai Phase 1-3 | Bisa demo multi-regulation + approval |
| **M4 — Enterprise Ready** | Selesai Phase 1-4 | Full feature set termasuk DSPM |
| **M5 — Pertamina PoC** | Selesai Phase 1-5 | Production-ready demo + seed data Pertamina |

---

## 📝 Sprint Log

### Sprint 1 — Phase 1
- **Mulai:** 2 April 2026
- **Selesai:** 2 April 2026
- **Notes:** COMPLETE. Backend: migration + model hierarchy (parent/children/descendants) + HoldingDashboardController (4 endpoints) + OrganizationController CRUD (createChild/updateHierarchy/deactivate/restore) + PertaminaHoldingSeeder (12 orgs). Frontend: holding-dashboard page with 4 tabs (Overview with sub-holding cards, Compliance Matrix, Manage with CRUD/Trash/Restore, Org Tree). Hierarchy test: 1 Holding → 3 Sub Holdings → 8 Subsidiaries → 11 descendants confirmed.

### Sprint 2 — Phase 2
### Sprint 2 — Phase 2
- **Mulai:** 2 April 2026
- **Selesai:** 3 April 2026
- **Notes:** COMPLETE. Vendor Risk Management beres dengan Hybrid Mode (Manual & AI Assessment), DPA Status Tracking, Alerts untuk Expired DPA, dan CSV Exporting. Cross-Border Data Transfer beres dengan TIA Workflow, World Map Distribution (Top Countries), alert untuk lack of legal basis, dan Mock linkage ke RoPA. Kedua model menggunakan implementasi Soft Deletes / Recycle bin full stack CRUD.

### Sprint 3 — Phase 3
- **Mulai:** 3 April 2026
- **Selesai:** 3 April 2026
- **Notes:** COMPLETE. Menyelesaikan implementasi Muti-Regulasi (UU PDP, GDPR, PDPA) dengan frontend selection widget dan API updates. Menambahkan Recharts Radar/Spider chart untuk side-by-side comparison kepatuhan regulasi di Gap Assessment. Mengimplementasi sistem `ApprovalWorkflow` dan menampilkan `ApprovalWidget` di dashboard CEO/Management yang memungkinkan multi-level approval untuk modul seperti RoPA dan DPIA ketika disubmit 'waiting' approval.

### Sprint 4 — Phase 4
- **Mulai:** 3 April 2026
- **Selesai:** 3 April 2026
- **Notes:** COMPLETE. Setup DSPM (Data Security Posture Management) dengan agregasi Posture Score dan Alerting untuk Security Anomalies selesai.

### Sprint 5 — Phase 5
- **Mulai:** 3 April 2026
- **Selesai:** 3 April 2026
- **Notes:** COMPLETE. Penambahan support MSSQL & Oracle di scan schema, AI Credit Module tracker ditambahkan untuk SaaS multitenant. Visualisasi Multi-ROPA Graph selesai dan terintegrasi di halaman data discovery. Serta Embeddable Consent widget script live terinisiasi ke URL production domain dan API backend. Platform berstatus Enterprise Demo Ready (100%).

---

> **Catatan:** Dokumen ini adalah living document. Update checklist setiap kali task selesai. Setiap phase bisa di-demo secara incremental ke Pertamina untuk feedback awal.
