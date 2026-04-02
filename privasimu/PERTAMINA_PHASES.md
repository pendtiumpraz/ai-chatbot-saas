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
| Phase 1 | Hierarchical Holding Structure | ⬜ Belum Mulai | 0% |
| Phase 2 | Vendor Risk & Cross-Border | ⬜ Belum Mulai | 0% |
| Phase 3 | Multi-Regulation & Compliance | ⬜ Belum Mulai | 0% |
| Phase 4 | Advanced Security & Automation | ⬜ Belum Mulai | 0% |
| Phase 5 | Polish, Connectors & Demo Prep | ⬜ Belum Mulai | 0% |

**Overall Progress: 0%**

---

## 🔴 Phase 1: Hierarchical Holding Structure (CRITICAL)
> **Prioritas:** BLOCKING — Tanpa ini, demo Pertamina tidak mungkin.  
> **Estimasi:** 5-6 hari  
> **Sprint:** 1

### Backend
- [ ] Tambah kolom `parent_id` (nullable, self-referencing FK) ke tabel `organizations`
- [ ] Tambah kolom `org_level` (enum: `holding`, `sub_holding`, `subsidiary`) ke tabel `organizations`
- [ ] Buat migration `add_holding_hierarchy_to_organizations`
- [ ] Update `Organization` model — relasi `parent()`, `children()`, `descendants()`
- [ ] Buat `HoldingDashboardController` — aggregated stats dari semua anak perusahaan
- [ ] API endpoint: `GET /api/holding/dashboard` — rollup compliance score, risk summary, modul statistics
- [ ] API endpoint: `GET /api/holding/org-tree` — return tree structure organisasi
- [ ] API endpoint: `GET /api/holding/compliance-matrix` — score per anak perusahaan per modul
- [ ] Update `DashboardController` — tambah parent org context jika user dari holding
- [ ] Update `OrganizationController` — CRUD support parent_id dan org_level
- [ ] Seed contoh data: 1 Holding → 2 SubHolding → 5 Anak Perusahaan

### Frontend
- [ ] Buat halaman `/holding-dashboard` — overview seluruh group
- [ ] Komponen `OrgTreeView` — visualisasi hierarki (tree/org-chart)
- [ ] Komponen `ComplianceHeatmap` — heatmap skor compliance per anak perusahaan per modul
- [ ] Komponen `HoldingRiskSummary` — aggregated risk chart (pie/bar)
- [ ] Filter by org_level di dashboard superadmin
- [ ] Breadcrumb navigation: Holding → SubHolding → Anak Perusahaan
- [ ] Update sidebar menu — tambah "Holding Dashboard" khusus role holding-admin/superadmin

### Testing & Validation
- [ ] Test hierarki 3 level (holding → sub → anak)
- [ ] Test isolasi data — anak perusahaan tidak bisa lihat data anak lain
- [ ] Test rollup aggregation — skor holding = rata-rata skor anak

---

## 🟡 Phase 2: Vendor Risk Management & Cross-Border Data Transfer
> **Prioritas:** HIGH — Fitur penting untuk enterprise  
> **Estimasi:** 7-8 hari  
> **Sprint:** 2

### Vendor Risk Management

#### Backend
- [ ] Buat model `Vendor` (nama, tipe, negara, risk_score, dpa_status, last_assessed)
- [ ] Buat model `VendorAssessment` (vendor_id, org_id, answers JSON, score, recommendations)
- [ ] Migration: `create_vendors_table`, `create_vendor_assessments_table`
- [ ] Buat `VendorRiskController` — CRUD vendor + assessment
- [ ] Buat bank soal Vendor Risk Assessment (15-20 pertanyaan: DPA, keamanan, breach history, dll)
- [ ] Auto-scoring dari jawaban assessment
- [ ] API: `GET /api/vendors` — list vendor + risk score
- [ ] API: `POST /api/vendors/{id}/assess` — submit assessment
- [ ] API: `GET /api/vendors/{id}/dpa-status` — status DPA per vendor
- [ ] Integrasi dengan AI — analisis risiko vendor otomatis
- [ ] Export vendor register ke PDF/Excel

#### Frontend
- [ ] Buat halaman `/vendor-risk` — dashboard vendor management
- [ ] Form tambah/edit vendor
- [ ] Wizard vendor risk assessment
- [ ] Vendor risk score card (visual meter/gauge)
- [ ] DPA status tracking per vendor (draft → signed → expired)
- [ ] Alert untuk vendor dengan DPA expired atau risk tinggi

### Cross-Border Data Transfer

#### Backend
- [ ] Buat model `CrossBorderTransfer` (org_id, destination_country, legal_basis, safeguards, status)
- [ ] Migration: `create_cross_border_transfers_table`
- [ ] Buat `CrossBorderController` — CRUD + Transfer Impact Assessment
- [ ] Database negara + status adequacy decision (EU adequacy, bilateral agreement, dll)
- [ ] API: `GET /api/cross-border` — list semua transfer
- [ ] API: `POST /api/cross-border/{id}/assess` — submit Transfer Impact Assessment (TIA)
- [ ] Linkage ke RoPA Section 4 (Transfer)

#### Frontend
- [ ] Buat halaman `/cross-border` — overview transfer lintas negara
- [ ] World map view — visual negara tujuan transfer
- [ ] Form Transfer Impact Assessment (TIA)
- [ ] Status tracking per transfer (pending → approved → active)
- [ ] Alert untuk transfer yang belum punya legal basis

### Testing
- [ ] Test CRUD vendor + assessment scoring
- [ ] Test cross-border TIA workflow
- [ ] Test linkage vendor ↔ RoPA
- [ ] Test export vendor register

---

## 🟡 Phase 3: Multi-Regulation & Enhanced Compliance
> **Prioritas:** HIGH — Membuat platform relevan untuk multinasional  
> **Estimasi:** 7-8 hari  
> **Sprint:** 3

### Multi-Regulation Framework

#### Backend
- [ ] Buat model `RegulationFramework` (code, name, country, articles JSON, active)
- [ ] Seed 3 framework: UU PDP Indonesia, GDPR (EU), PDPA (Thailand/Singapore)
- [ ] Tambah kolom `regulation_id` ke `gap_assessments`
- [ ] Buat bank soal Gap Assessment versi GDPR (adaptasi dari UU PDP)
- [ ] Buat bank soal Gap Assessment versi PDPA
- [ ] Update `GapAssessmentController` — support multi-regulation scoring
- [ ] API: `GET /api/regulations` — list available frameworks
- [ ] API: `POST /api/gap-assessment?regulation=gdpr` — create assessment untuk regulation tertentu
- [ ] Comparative compliance view — skor UU PDP vs GDPR vs PDPA side-by-side

#### Frontend
- [ ] Regulation picker/switcher di halaman Gap Assessment
- [ ] Comparative compliance chart (radar chart / spider diagram)
- [ ] Per-regulation compliance badges di dashboard
- [ ] Template selector saat membuat RoPA/DPIA berdasarkan regulation

### Multi-Level Approval Workflow

#### Backend
- [ ] Buat model `ApprovalWorkflow` (module, record_id, steps JSON, current_step, status)
- [ ] Migration: `create_approval_workflows_table`
- [ ] API: `POST /api/approvals/{id}/approve` — approve current step
- [ ] API: `POST /api/approvals/{id}/reject` — reject with comment
- [ ] Configurable approval chain per module per organisasi
- [ ] Notification hook (untuk integrasi notif masa depan)

#### Frontend
- [ ] Approval queue page — list pending approvals
- [ ] Approval detail — view record + approve/reject buttons
- [ ] Approval history trail di setiap record RoPA/DPIA
- [ ] Config page untuk setup approval chain per module

### Testing
- [ ] Test switch regulation di gap assessment
- [ ] Test comparative scoring
- [ ] Test approval workflow: submit → approve → final
- [ ] Test approval rejection + re-submit flow

---

## 🟠 Phase 4: Advanced Security, DSPM & Automation
> **Prioritas:** MEDIUM-HIGH — Nice-to-have tapi impressive untuk demo  
> **Estimasi:** 7-8 hari  
> **Sprint:** 4

### DSPM (Data Security Posture Management)

#### Backend
- [ ] Buat `PostureScoreService` — aggregate posture score dari: scan results, gap assessment, vendor risk, breach history
- [ ] API: `GET /api/security/posture` — overall posture score + breakdown
- [ ] API: `GET /api/security/posture/trend` — historical posture trend (30/60/90 hari)
- [ ] Posture factors: encryption coverage, RBAC compliance, DPA coverage, scan freshness

#### Frontend
- [ ] Security Posture Dashboard — gauge/meter + trend line
- [ ] Posture breakdown per faktor (horizontal bar chart)
- [ ] Recommendations list berdasarkan posture gaps
- [ ] Posture badges per sistem informasi

### Anomaly Detection & Alerting

#### Backend
- [ ] Buat model `SecurityAlert` (type, severity, description, acknowledged, resolved)
- [ ] Migration: `create_security_alerts_table`
- [ ] Alerting rules: scan overdue, vendor DPA expired, DSR SLA breach, unusual access patterns
- [ ] API: `GET /api/alerts` — list active alerts
- [ ] API: `POST /api/alerts/{id}/acknowledge` — acknowledge alert
- [ ] Cron job: `CheckSecurityAlerts` — daily check

#### Frontend
- [ ] Alert bell icon di header navbar (badge count)
- [ ] Alert center page — list semua alert
- [ ] Alert action buttons: acknowledge, resolve, snooze
- [ ] Alert history log

### Automation Enhancement

#### Backend
- [ ] Auto-create DSR response draft via AI ketika request masuk
- [ ] Auto-trigger DPIA saat RoPA risk level = high
- [ ] Auto-send reminder untuk expiring consents
- [ ] Scheduled scan reminder untuk systems overdue

#### Frontend
- [ ] Automation settings page — toggle per automation rule
- [ ] Automation activity log

### Testing
- [ ] Test posture score calculation
- [ ] Test alerting rules triggering
- [ ] Test automation triggers
- [ ] Test alert lifecycle: create → acknowledge → resolve

---

## 🟢 Phase 5: Connectors, Polish & Demo Preparation
> **Prioritas:** MEDIUM — Finalisasi dan persiapan demo  
> **Estimasi:** 5-6 hari  
> **Sprint:** 5

### Additional Database Connectors

#### Backend
- [ ] `DatabaseScanner` — tambah support Microsoft SQL Server (via sqlsrv driver)
- [ ] `DatabaseScanner` — tambah support Oracle Database (via oci8 driver)
- [ ] `DatabaseScanner` — tambah support MongoDB (via mongodb driver)
- [ ] Update `PiiDetector` — handle non-relational schema (document-based)

#### Frontend
- [ ] Update form "Tambah Sistem" — pilihan source type baru
- [ ] Connection config form per tipe database baru

### Data Flow Diagram Visual

#### Backend
- [ ] API: `GET /api/data-flow/diagram` — return nodes (systems) + edges (data transfers between them)
- [ ] Auto-generate edges dari RoPA linkage + cross-border transfers

#### Frontend
- [ ] Buat halaman `/data-flow` — interactive data flow diagram
- [ ] Drag & drop nodes (systems)
- [ ] Animated edges showing data flow direction
- [ ] Click node untuk lihat detail PII + linked RoPA

### Embeddable Consent Widget

#### Frontend
- [ ] Buat `consent-widget.js` — standalone script yang bisa di-embed di website customer
- [ ] Widget: cookie banner style + granular consent checkboxes
- [ ] Widget berkomunikasi ke Privasimu API untuk record consent
- [ ] Customizable branding (logo, warna, text)

### Demo Preparation

- [ ] Seed data Pertamina: 1 Holding + 3 SubHolding + 8 Anak Perusahaan
- [ ] Seed contoh RoPA, DPIA, DSR, Breach, Consent per anak perusahaan
- [ ] Seed contoh vendor register (10+ vendor dengan DPA status beragam)
- [ ] Buat demo script/rundown
- [ ] Internal testing — full E2E walk-through
- [ ] Performance test — simulate 40+ tenant concurrent access
- [ ] Demo rehearsal — practice pitching

### Final Polish
- [ ] Review semua SweetAlert2 di seluruh app
- [ ] Responsive check — tablet view untuk presentasi
- [ ] Loading states & skeleton screens untuk semua halaman baru
- [ ] Error handling & user-friendly error messages
- [ ] Consistent styling across semua halaman baru

---

## 📅 Timeline Ringkas

```
Minggu 1  ████████████ Phase 1 — Hierarchical Holding (CRITICAL)
Minggu 2  ████████████ Phase 2 — Vendor Risk & Cross-Border
Minggu 3  ████████████ Phase 3 — Multi-Regulation & Approval
Minggu 4  ████████░░░░ Phase 4 — DSPM & Automation
Minggu 4+ ░░░░████████ Phase 5 — Connectors & Demo Prep
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
- **Mulai:** _Belum dijadwalkan_
- **Selesai:** —
- **Notes:** —

### Sprint 2 — Phase 2
- **Mulai:** —
- **Selesai:** —
- **Notes:** —

### Sprint 3 — Phase 3
- **Mulai:** —
- **Selesai:** —
- **Notes:** —

### Sprint 4 — Phase 4
- **Mulai:** —
- **Selesai:** —
- **Notes:** —

### Sprint 5 — Phase 5
- **Mulai:** —
- **Selesai:** —
- **Notes:** —

---

> **Catatan:** Dokumen ini adalah living document. Update checklist setiap kali task selesai. Setiap phase bisa di-demo secara incremental ke Pertamina untuk feedback awal.
