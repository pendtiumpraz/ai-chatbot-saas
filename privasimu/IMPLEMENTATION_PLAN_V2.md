# PRIVASIMU Implementation Plan V2
## Feature Gap Analysis: Local vs Live (pdp.privasimu.com)

**Date:** 2026-03-25
**Status:** Planning Phase
**Reference:** Live platform at `pdp.privasimu.com` (v2.2025.3)

---

## Executive Summary

Our local PRIVASIMU platform currently implements basic CRUD operations for all modules. However, the live platform has significantly more advanced features including multi-step wizard forms, audit trails, cross-module linking, visual data mapping, and public-facing portals. This document outlines every gap and prioritizes implementation.

---

## 🔴 CRITICAL GAPS (Must Implement)

### 1. GAP Assessment — Question Structure ✅ DONE
- [x] ~~Question codes don't match live site (GOV-001 vs TK-FR-01)~~
- [x] ~~Missing subcategory field (Kerangka/Framework PDP, etc.)~~
- [x] ~~Missing "Penjelasan Soal" explanation box~~
- [x] ~~Answer options should be 3-tier: Sudah Memenuhi / Memenuhi Sebagian / Belum Memenuhi~~
- [x] ~~Categories should be: Tata Kelola + Siklus Proses PDP (not 8 flat categories)~~
- [x] ~~33 questions matching live site indicator codes~~

### 2. ROPA — Multi-Step Wizard Form
**Live Site:** 7-section wizard with progress tracking and audit trail
**Our Version:** Simple flat CRUD form

**Required Changes:**
- [ ] **Frontend:** Convert ROPA from flat form to 7-section wizard stepper:
  1. Detail Pemrosesan (name, entity, division, description, risk_level)
  2. Data Protection Team/Officer (DPO info, kategori pemrosesan: Pengendali/Pemroses)
  3. Informasi Pemrosesan (tujuan, jenis pemrosesan checkboxes, sistem informasi terkait, dasar hukum)
  4. Pengumpulan Data (sumber data, kategori subjek data, jenis data pribadi collected)
  5. Penggunaan dan Penyimpanan Data (cara pemrosesan, lokasi penyimpanan)
  6. Pengiriman Data (transfer domestik/internasional, negara tujuan, safeguards)
  7. Retensi dan Keamanan Data (masa retensi, prosedur pemusnahan, langkah keamanan)
- [ ] **Backend:** Update ROPA model to store section-based JSON data
- [ ] **Progress Tracking:** Calculate completion % based on sections filled
- [ ] **Resume Capability:** Save per-section, allow resume from last section
- [ ] **Auto ROPA Number:** Format `ROPA-{KategoriPemrosesan}-{sequence}` (e.g., ROPA-Pengendali Data Pribadi-001)

### 3. ROPA — Audit Trail / History Log
**Live Site:** Full audit trail showing who changed what, when, with expandable details
**Our Version:** None

**Required Changes:**
- [ ] **Backend:** Create `audit_logs` table:
  ```
  id, module (ropa/dpia/breach/etc), record_id, action (created/updated/answer_added/answer_changed),
  user_id, user_name, user_role, section, question, field, old_value, new_value, created_at
  ```
- [ ] **Backend:** Add audit logging middleware/trait to ModuleCrudController
- [ ] **Frontend:** "Lihat Riwayat" slide-over panel with timeline view
- [ ] **Frontend:** Each log entry expandable to show exact field changes

### 4. DPIA — Multi-Step Wizard
**Live Site:** 3-section wizard (Informasi DPIA → Koneksi ROPA → Potensi Risiko)
**Our Version:** Has Risk Matrix + Risk Register but not wizard-style

**Required Changes:**
- [ ] **Frontend:** Restructure DPIA into 3-step wizard:
  1. Informasi DPIA (title, description, PIC, DPO in-charge, date)
  2. Koneksi ROPA (search and link multiple ROPA records)
  3. Potensi Risiko (risk register with 5x5 matrix — ALREADY DONE)
- [ ] **Backend:** Add DPIA-ROPA many-to-many relationship
- [ ] **Progress Tracking:** Like ROPA, show % complete

### 5. Data Discovery & Mapping — Visual Dashboard
**Live Site:** Summary cards + TreeMap chart + data source table with ROPA connectivity
**Our Version:** Basic Data Discovery CRUD list

**Required Changes:**
- [ ] **Frontend:** Summary cards: Total Database, General PDP count, Specific PDP count, PII count
- [ ] **Frontend:** TreeMap or Pie chart visualization of data distribution
- [ ] **Frontend:** Data table with columns: Source, Database, Table, Column, Classification
- [ ] **Frontend:** Column-level actions: Add alias, Ignore, Link to ROPA
- [ ] **Frontend:** Alert badges for sensitive data without ROPA linkage
- [ ] **Backend:** API endpoint for aggregated data mapping statistics

---

## 🟡 HIGH PRIORITY GAPS

### 6. DSR — Settings Page & Public Portal
**Live Site:** DSR settings with company info, SMTP mailer config, OTP verification, and embeddable portal link
**Our Version:** Basic DSR CRUD

**Required Changes:**
- [ ] **Frontend:** DSR Settings page with tabs:
  - Informasi Perusahaan (name, privacy policy URL, branding)
  - Sistem Mailer (SMTP host, port, encryption, auth)
  - OTP Verification (method: Email/SMS)
  - Embed Portal (unique URL for public DSR submission)
- [ ] **Backend:** DSR settings model and API
- [ ] **Frontend:** Public DSR submission page (unauthenticated)
- [ ] **Backend:** OTP verification flow for DSR identity verification

### 7. Consent Management — Collection Points & Items
**Live Site:** Collection Points with Consent Items, ROPA linkage, Credentials, and Consent Explorer
**Our Version:** Basic consent records with embed code

**Required Changes:**
- [ ] **Frontend:** Collection Point detail page:
  - Metadata (domain, redirect URL, unique code)
  - Integration tools (Credentials button, Consent Item IDs)
  - Consent Items list (hierarchical: collection → items)
- [ ] **Frontend:** Each Consent Item shows ROPA linkage count
- [ ] **Frontend:** Consent Explorer — search interface across users, collection points, items
- [ ] **Backend:** Consent items CRUD API
- [ ] **Backend:** Consent-ROPA linkage API

### 8. Cross-Module Linking Engine
**Live Site:** ROPA ↔ DPIA, ROPA ↔ Data Mapping, ROPA ↔ Consent, all interconnected
**Our Version:** Auto-creates DPIA from high-risk ROPA, but no bidirectional UI linking

**Required Changes:**
- [ ] **Frontend:** ROPA detail page shows linked DPIA, Data Mapping, Consent items
- [ ] **Frontend:** DPIA can search and connect multiple ROPAs
- [ ] **Frontend:** Data Mapping can link columns/tables to ROPA records
- [ ] **Frontend:** Consent Items show ROPA connections
- [ ] **Backend:** Generic `module_links` table for cross-module relationships

---

## 🟢 MEDIUM PRIORITY GAPS

### 9. Simulation — Tutorial Mode ✅ DONE
- [x] ~~"Cara Pakai PRIVASIMU" walkthrough simulation~~
- [x] ~~Covers all 5 modules: GAP Assessment, ROPA, DPIA, DSR, Breach~~

### 10. Simulation — Content Expansion ✅ DONE
- [x] ~~8 Quiz scenarios (was 4, restored cloud_misconfig, vendor_breach, social_engineering, api_exposure)~~
- [x] ~~4 Tabletop exercises (added DPO Appointment, Consent Audit)~~
- [x] ~~5 Walkthrough SOPs (added DPIA Procedure, Vendor Onboarding, PRIVASIMU Tutorial)~~

### 11. Navigation Menu Structure
**Live Site:** Top navbar with dropdowns: Dashboard, Gap Assessment, PDP Modules ▼, Data Management ▼, DSR ▼, Consent Management ▼
**Our Version:** Sidebar navigation (different approach, acceptable)

**Required Changes:**
- [ ] Consider adding dropdown categorization to sidebar:
  - PDP Modules: ROPA, DPIA, Breach
  - Data Management: Data Discovery, Data Mapping
  - DSR: DSR List, DSR Settings
  - Consent: Collection Points, Consent Items, Consent Explorer

### 12. Organization Branding
**Live Site:** Organization name displayed in header badge (e.g., "PT Tester Indonesia")
**Our Version:** User name only

**Required Changes:**
- [ ] Display organization name in header/sidebar
- [ ] Organization settings page (name, logo, domain)

---

## 🔵 NICE TO HAVE

### 13. PDF Report Generation
- [ ] GAP Assessment compliance report PDF
- [ ] DPIA report PDF
- [ ] Breach notification letter PDF (KOMDIGI format)
- [ ] ROPA register export PDF

### 14. Dashboard KPI Enhancements
- [ ] Compliance trend over time (chart)
- [ ] Module-specific KPI cards
- [ ] Upcoming deadline alerts (DSR, Breach)
- [ ] Team activity feed

### 15. Multi-User / Team Features
- [ ] Role-based access (Admin, DPO, Manager, Viewer)
- [ ] Activity feed per user
- [ ] Assignment & delegation
- [ ] Comments/notes on records

### 16. Notifications System
- [ ] In-app notification center
- [ ] Email notifications for DSR deadlines
- [ ] Breach countdown alerts
- [ ] DPIA review reminders

---

## Implementation Roadmap

### Phase 1: Foundation (Week 1-2)
| Task | Module | Priority | Effort |
|------|--------|----------|--------|
| ROPA wizard form (7 sections) | ROPA | 🔴 Critical | L |
| Audit trail infrastructure | Backend | 🔴 Critical | M |
| ROPA history panel | ROPA | 🔴 Critical | M |
| DPIA wizard restructure | DPIA | 🔴 Critical | M |

### Phase 2: Data Layer (Week 3-4)
| Task | Module | Priority | Effort |
|------|--------|----------|--------|
| Data Mapping visual dashboard | Data Discovery | 🔴 Critical | L |
| Cross-module linking | Backend | 🟡 High | L |
| DSR settings page | DSR | 🟡 High | M |
| DSR public portal | DSR | 🟡 High | L |

### Phase 3: Consent & Polish (Week 5-6)
| Task | Module | Priority | Effort |
|------|--------|----------|--------|
| Consent collection points | Consent | 🟡 High | M |
| Consent explorer | Consent | 🟡 High | M |
| Navigation restructure | UI | 🟢 Medium | S |
| Organization branding | Auth | 🟢 Medium | S |

### Phase 4: Advanced Features (Week 7-8)
| Task | Module | Priority | Effort |
|------|--------|----------|--------|
| PDF report generation | Reports | 🔵 Nice | L |
| Dashboard enhancements | Dashboard | 🔵 Nice | M |
| Multi-user/team features | Auth | 🔵 Nice | L |
| Notification system | Infra | 🔵 Nice | L |

---

## Technical Architecture Notes

### Audit Trail Design
```
Model: AuditLog
  - id (uuid)
  - module (string: ropa|dpia|breach|dsr|consent|gap)
  - record_id (uuid)
  - action (string: created|updated|deleted|restored|answer_added|answer_changed)
  - user_id (uuid)
  - user_name (string)
  - user_role (string)
  - changes (json: [{section, question, field, old_value, new_value}])
  - ip_address (string)
  - created_at (datetime)

Trait: HasAuditTrail
  - Automatically logs create/update/delete events
  - Attached to ROPA, DPIA, Breach, DSR, Consent models
```

### ROPA Wizard Data Schema
```json
{
  "section_1_detail": {
    "name": "Rekrutmen Kandidat Karyawan",
    "entity": "", "division": "DPO Agent",
    "work_unit": "", "risk_level": "low",
    "description": "Pengumpulan dan evaluasi data pribadi..."
  },
  "section_2_dpo": {
    "kategori_pemrosesan": "Pengendali Data Pribadi",
    "dpo_name": "", "dpo_email": "dpo@example.com",
    "dpo_phone": ""
  },
  "section_3_info": {
    "tujuan_pemrosesan": [],
    "jenis_pemrosesan": ["Penyimpanan data", "Perbaikan dan pembaruan data"],
    "sistem_terkait": [{"name": "Indonesia", "desc": "HRIS Terproteksi"}],
    "dasar_pemrosesan": "Persetujuan yang Sah Secara Eksplisit"
  },
  "section_4_collection": {
    "sumber_data": "", "kategori_subjek": [],
    "jenis_data_pribadi": []
  },
  "section_5_usage": {
    "cara_pemrosesan": "", "lokasi_penyimpanan": ""
  },
  "section_6_transfer": {
    "transfer_domestik": [], "transfer_internasional": [],
    "negara_tujuan": [], "safeguards": ""
  },
  "section_7_retention": {
    "masa_retensi": "", "prosedur_pemusnahan": "",
    "langkah_keamanan": []
  }
}
```

### Cross-Module Links Table
```
Model: ModuleLink
  - id (uuid)
  - source_module (string)
  - source_id (uuid)
  - target_module (string)
  - target_id (uuid)
  - link_type (string: auto|manual)
  - created_at (datetime)
  - created_by (uuid)
```

---

## Files to Modify

### Backend
| File | Changes |
|------|---------|
| `app/Models/GapAssessment.php` | ✅ Updated question bank (33 questions, TK/SP codes) |
| `app/Models/Ropa.php` | Add wizard section schema, progress calculation |
| `app/Models/AuditLog.php` | NEW — audit trail model |
| `app/Models/ModuleLink.php` | NEW — cross-module linking |
| `app/Traits/HasAuditTrail.php` | NEW — auto-logging trait |
| `app/Http/Controllers/Api/ModuleCrudController.php` | Add audit logging to store/update/delete |
| `app/Http/Controllers/Api/AuditLogController.php` | NEW — fetch audit logs |
| `app/Http/Controllers/Api/DsrSettingsController.php` | NEW — DSR settings CRUD |
| `database/migrations/` | Create audit_logs, module_links, dsr_settings tables |

### Frontend
| File | Changes |
|------|---------|
| `app/(dashboard)/gap-assessment/page.tsx` | ✅ Updated UI (3-tier answers, explanation box, subcategory) |
| `app/(dashboard)/simulation/scenarios.ts` | ✅ Added tutorial + expanded scenarios (17 total) |
| `app/(dashboard)/ropa/page.tsx` | Convert to 7-section wizard with progress |
| `app/(dashboard)/dpia/page.tsx` | Restructure to 3-step wizard |
| `app/(dashboard)/data-discovery/page.tsx` | Add visual dashboard, TreeMap, ROPA linking |
| `app/(dashboard)/dsr/page.tsx` | Add DSR Settings tab |
| `app/(dashboard)/dsr/settings/page.tsx` | NEW — DSR settings |
| `app/(dashboard)/dsr/portal/page.tsx` | NEW — public DSR submission |
| `app/(dashboard)/consent/page.tsx` | Add collection points, consent items, explorer |

---

## Current Status Summary

| Module | Status | Completeness vs Live |
|--------|--------|---------------------|
| GAP Assessment | ✅ Updated | **95%** (missing file upload) |
| Simulation | ✅ Complete | **100%** (exceeds live — 17 scenarios) |
| ROPA | ⚠️ Basic CRUD | **30%** (missing wizard, audit, progress) |
| DPIA | ⚠️ Has Risk Matrix | **60%** (missing wizard, ROPA connection) |
| Breach | ✅ Advanced | **85%** (has countdown, checklist, templates) |
| DSR | ⚠️ Basic CRUD | **40%** (missing settings, portal, OTP) |
| Data Discovery | ⚠️ Basic CRUD | **25%** (missing visual mapping, ROPA link) |
| Consent | ⚠️ Basic | **35%** (missing collection points, explorer) |
| Dashboard | ✅ KPI cards | **70%** (missing trends, activity feed) |
| Auth/Org | ⚠️ Basic | **40%** (missing org branding, team roles) |
