# 🗺️ PRIVASIMU — Development Roadmap & Phase Plan
> **Last Updated:** 30 Maret 2026  
> **Estimasi Progress Overall:** ~75%  
> **Tech Stack:** Laravel 12 (Backend) + Next.js 15 (Frontend) + PostgreSQL (Neon) + Multi-Provider AI  
> **Production:** cesena.id.rapidplex.com (cPanel + shared hosting)

---

## 📊 Ringkasan Progress Per Phase

| Phase | Nama | Status | Progress |
|-------|------|--------|----------|
| **Phase 1** | Foundation & Infrastructure | ✅ Complete | █████████░ **95%** |
| **Phase 2** | Core Compliance Modules | ✅ Complete | █████████░ **95%** |
| **Phase 3** | Data & Privacy Modules | ✅ Complete | █████████░ **90%** |
| **Phase 4** | Breach & Simulation | ✅ Complete | █████████░ **90%** |
| **Phase 5** | AI Engine & Autofill | ✅ Complete | █████████░ **95%** |
| **Phase 6** | Dashboard Risk Analytics | ✅ Complete | █████████░ **95%** |
| **Phase 7** | Master Data & DPO Integration | ✅ Complete | █████████░ **95%** |
| **Phase 8** | Consent Management Overhaul | ❌ Not Started | ░░░░░░░░░░ **0%** |
| **Phase 9** | Data Discovery Enhancement | 🔧 Partial | ████░░░░░░ **40%** |
| **Phase 10** | Deployment & DevOps | ❌ Not Started | ░░░░░░░░░░ **0%** |

---

## ✅ PHASE 1 — Foundation & Infrastructure (COMPLETE)

### 1.1 Backend Setup
| Task | Status | Detail |
|------|--------|--------|
| Init Laravel 12 project | ✅ Done | `backend/` directory |
| MySQL database (production) | ✅ Done | `sainsker_privasimu` di cPanel |
| Laravel Sanctum auth | ✅ Done | Token-based API auth |
| CORS configuration | ✅ Done | Next.js ↔ Laravel |
| UUID primary keys | ✅ Done | Semua tabel pakai UUID |
| Soft deletes | ✅ Done | Semua modul utama |

### 1.2 Frontend Setup
| Task | Status | Detail |
|------|--------|--------|
| Init Next.js 15 project | ✅ Done | `frontend/` directory, App Router |
| Design system (CSS) | ✅ Done | Custom CSS variables, dark mode ready |
| Sidebar navigation | ✅ Done | Collapsible, role-based menu visibility |
| Auth context + protected routes | ✅ Done | Token di localStorage |
| API client (`lib/api.ts`) | ✅ Done | Fetch wrapper dengan auth header |
| SweetAlert2 integration | ✅ Done | Semua modul, mengganti native alert |

### 1.3 Database Schema — 24 Migrations
| Migration | Tabel | Status |
|-----------|-------|--------|
| `create_privasimu_tables` | organizations, users, gap_assessments, ropas, dpias, dsr_requests, dsr_settings, consent_collection_points, consent_items, consent_records, breach_incidents, breach_simulations, simulation_responses, notifications_log, audit_logs, information_systems | ✅ |
| `create_personal_access_tokens` | personal_access_tokens (Sanctum) | ✅ |
| `create_feature_requests` | feature_requests | ✅ |
| `add_soft_deletes_to_breach_simulations` | breach_simulations | ✅ |
| `fix_gap_assessments_columns` | gap_assessments | ✅ |
| `add_wizard_fields_to_ropas` | ropas (wizard_data, wizard_step, dll) | ✅ |
| `add_wizard_fields_to_dpias` | dpias (wizard_data) | ✅ |
| `add_guest_fields_to_feature_requests` | feature_requests | ✅ |
| `create_license_tables` | licenses, license_pricing | ✅ |
| `create_app_settings` | app_settings | ✅ |
| `create_chat_tables` | chat_conversations, chat_messages | ✅ |
| `create_knowledge_base_sections` | knowledge_base_sections | ✅ |
| `create_consent_logs` | consent_logs (public API) | ✅ |
| `create_ai_results` | ai_results (cache AI output) | ✅ |
| `add_onboarding_and_credits` | organizations (+business_model, company_size, data_subjects_type, core_systems, has_dpo, onboarding_completed, ai_credits_*) | ✅ |
| `create_ai_credit_logs` | ai_credit_logs | ✅ |
| `fix_license_key_unique_constraint` | licenses | ✅ |
| `make_org_id_nullable_in_chat_conversations` | chat_conversations | ✅ |
| `add_owner_to_information_systems` | information_systems (+owner) | ✅ |
| `create_ai_provider_tables` | ai_providers, ai_models, ai_provider_configs | ✅ |
| `make_org_id_nullable_in_ai_tables` | ai_providers, ai_provider_configs | ✅ |
| `create_positions_and_departments_tables` | positions, departments, users (+department_id, position_id) | ✅ |

### 1.4 Backend Controllers — 17 Controllers
| Controller | Endpoints | Status |
|-----------|-----------|--------|
| `AuthController` | register, login, me, logout | ✅ |
| `DashboardController` | stats, charts | ✅ |
| `OrganizationController` | show, update, index, CRM config/test/sync/disconnect | ✅ |
| `UserController` | CRUD + restore | ✅ |
| `GapAssessmentController` | index, questions, store, show, submitAnswers, destroy, restore | ✅ |
| `ModuleCrudController` | Universal CRUD (ROPA, DPIA, DSR, Consent, Breach, Data Discovery) | ✅ |
| `SimulationController` | index, scenarios, store, show, start, submitResponses, destroy | ✅ |
| `DataDiscoveryController` | testConnection, triggerScan, scanDetails, classifyColumn, ropaLinks | ✅ |
| `ConsentLogController` | capture (public), index | ✅ |
| `LicenseController` | CRUD + verify, activate, pricing | ✅ |
| `AiChatController` | chat, knowledgeBase, apiSettings, conversations, adminReply, poll | ✅ |
| `AiFeatureController` | 12+ AI endpoints, autofill, credit management, contract review | ✅ |
| `AiAgentController` | chat (function calling), mentions, history | ✅ |
| `AiProviderController` | index, getConfig, saveApiKey, testConnection, setActiveModel | ✅ |
| `ExportController` | Export 12 modul (CSV/JSON) | ✅ |
| `FeatureRequestController` | CRUD + public + upvote | ✅ |
| `SystemUpdateController` | checkUpdate, updateBackend | ✅ |
| `PositionController` | CRUD + dpoUsers (Phase 7) | ✅ |
| `DepartmentController` | CRUD with hierarchy (Phase 7) | ✅ |

### 1.5 Frontend Pages — 19 Dashboard Pages
| Page | Route | Status |
|------|-------|--------|
| Dashboard | `/dashboard` | ✅ (KPI cards, charts, sparklines, AI summary) |
| GAP Assessment | `/gap-assessment` | ✅ (30 pertanyaan, scoring, compliance level) |
| ROPA | `/ropa` | ✅ (7-section wizard, AI autofill, export) |
| DPIA | `/dpia` | ✅ (3-section wizard, 21 risk categories, 5×5 matrix) |
| Data Breach | `/breach` | ✅ (5-fase lifecycle, 72H timer, RACI, SIEM panel) |
| DSR | `/dsr` | ✅ (Request management, deadline tracking) |
| Consent | `/consent` | ✅ (Collection points, items, logs, embed widget, guardian consent) |
| Data Discovery | `/data-discovery` | ✅ (Multi-DB connector, PII scan, column picker, ROPA graph) |
| Simulation | `/simulation` | ✅ (Fire drill, scenario templates, scoring) |
| AI Agent | `/ai-agent` | ✅ (Full-page chat, 28 tools, function calling) |
| Contract Review | `/contract-review` | ✅ (AI contract analyzer) |
| Chat History | `/chat-history` | ✅ (View past conversations, admin takeover) |
| License Manager | `/license` | ✅ (CRUD license, pricing management) |
| Settings | `/settings` | ✅ (AI credits, knowledge base, API settings, AI providers) |
| Users | `/users` | ✅ (CRUD, role management) |
| Docs | `/docs` | ✅ (API reference, problem-solution mapping) |
| Feature Requests | `/feature-requests` | ✅ (Submit & upvote) |
| Feature Status | `/feature-status` | ✅ (Public roadmap view) |
| System Update | `/system-update` | ✅ (Backend update trigger) |

---

## ✅ PHASE 2 — Core Compliance Modules (COMPLETE)

### 2.1 GAP Assessment ✅
- 30 pertanyaan terstruktur UU PDP
- 6 kategori: Governance, Dasar Hukum, Hak Subjek Data, Keamanan, Breach Management, Transfer Data
- Scoring engine dengan weight per kategori
- Compliance level: Low / Medium / High
- AI Remediation Plan via `AiFeatureButton`
- Export CSV

### 2.2 ROPA (Record of Processing Activities) ✅
- 7-section wizard: Detail Pemrosesan → DPO/Team → Informasi Pemrosesan → Pengumpulan Data → Penggunaan & Penyimpanan → Pengiriman Data → Retensi & Keamanan
- 34+ fields per ROPA
- Status workflow: Draft → In Progress → Waiting → Approved → Completed
- Risk level classification (Low/Medium/High)
- AI Auto-fill (nama aktivitas → full wizard terisi)
- AI Analysis per record
- Audit trail (history panel)
- Export CSV

### 2.3 DPIA (Data Protection Impact Assessment) ✅
- 3-section wizard dengan linked ROPA
- 21 kategori risiko (Pasal 34 UU PDP)
- 5×5 Risk Matrix (Likelihood × Impact)
- Auto-calculated residual risk
- AI Risk Scoring
- Mitigation measures per risk
- Export CSV

---

## ✅ PHASE 3 — Data & Privacy Modules (COMPLETE)

### 3.1 DSR (Data Subject Request) ✅
- 5 jenis request: Akses, Hapus, Koreksi, Portabilitas, Keberatan
- Deadline tracking (30 hari UU PDP)
- Status workflow: New → In Progress → Completed / Rejected
- AI Response Draft
- AI Auto-fill saat create DSR baru
- Export CSV

### 3.2 Consent Management ✅
- **Collection Points**: Buat titik pengumpulan consent
- **Consent Items**: Detail item apa saja yang di-consent
- **Consent Records**: Track per user identifier
- **Consent Logs**: Public API `POST /api/public/consent`
- **Embed Widget**: JavaScript snippet untuk pasang di website client
- **Guardian/Wali Consent**: Pasal 25 UU PDP (orang tua, wali sah, pendamping disabilitas)
- **CRM Integration**: API connector config (Odoo/Salesforce)
- AI Consent Text Generator
- Export CSV

### 3.3 Data Discovery ✅
- Multi-DB connector: PostgreSQL, MySQL, MongoDB, API, File
- **Connection Tester**: Test koneksi dengan latency, SSL, server version
- **PII Scan Simulation**: Column-level PII detection (NIK, email, phone, dll)
- **Column Picker**: Classification (public/internal/pii/sensitive), retention days, encryption flag
- **ROPA Linkage Graph**: SVG network diagram showing system→ROPA connections
- Owner field per information system
- Export CSV

---

## ✅ PHASE 4 — Breach & Simulation (COMPLETE)

### 4.1 Data Breach Management ✅
- 5-fase lifecycle: Detected → Identified → Contained → Eradicated → Closed
- Real-time 72H countdown timer (Pasal 46 UU PDP)
- RACI Matrix (Responsible, Accountable, Consulted, Informed)
- Containment checklist (interactive)
- Notification templates (KOMDIGI + Subjek Data)
- SIEM & SOAR integration panel (UI)
- AI Breach Advisor
- AI Auto-fill saat create breach baru
- Timeline log per incident
- Export CSV

### 4.2 Fire Drill Simulation ✅
- Pre-built scenario templates (Easy → Critical)
- Interactive quiz-style assessment
- Timer configuration
- 5-criteria scoring engine (100 points)
- AI Custom Scenario Generator
- AI Performance Analysis
- History & trend tracking
- Export CSV/PDF

---

## ✅ PHASE 5 — AI Engine & Autofill System (COMPLETE)

### 5.1 AI Chat Assistant ✅
- **Provider**: DeepSeek (primary), multi-provider ready
- **Knowledge Base**: RAG dari `knowledge_base_sections` (keyword matching)
- **Structured Output**: JSON sections (tips, warnings, steps, lists)
- **License Gating**: Hidden di paket Basic
- **Admin CS Takeover**: Live reply ke user conversation
- **Conversation History**: Full chat log with admin view

### 5.2 AI Agent (Enterprise) ✅
- **Function Calling**: 28 database tools dengan tenant isolation
- **Dual-mode Widget**: Assistant (ai) vs Agent (ai_agent)
- **Role-based Tools**: SuperAdmin (5 read-only) vs Admin/DPO (28 CRUD)
- **@Mention**: Reference ROPA, DPIA, Breach by name
- **Security**: org_id filter, credential blocking, jailbreak protection

### 5.3 AI Feature Buttons ✅
Deployed di semua 10 modul:

| Module | Endpoint | Feature |
|--------|----------|---------|
| Dashboard | `/ai-features/dashboard/summary` | AI Compliance Summary |
| GAP Assessment | `/ai-features/gap/{id}/remediation` | AI Remediation Plan |
| ROPA | `/ai-features/ropa/{id}/analysis` | AI ROPA Analysis |
| DPIA | `/ai-features/dpia/{id}/risk-scoring` | AI DPIA Risk Scoring |
| Breach | `/ai-features/breach/{id}/advisor` | AI Breach Advisor |
| DSR | `/ai-features/dsr/{id}/draft` | AI Response Draft |
| Consent | `/ai-features/consent/{id}/audit` | AI Consent Audit |
| Simulation | `/ai-features/simulation/{id}/analysis` | AI Performance Review |
| Data Discovery | `/ai-features/data-discovery/{id}/classification` | AI Data Classification |
| Contract Review | `/ai-features/contract/review` | AI Contract Analyzer |

### 5.4 AI Auto-Fill System ✅
| Module | Input | Output | Endpoint |
|--------|-------|--------|----------|
| ROPA | Nama Aktivitas Pemrosesan | Full 7-section wizard terisi | `POST /ai-features/autofill/ropa` |
| DPIA | Deskripsi Pemrosesan | Risk assessment + wizard terisi | `POST /ai-features/autofill/dpia` |
| Breach | Judul Insiden | Severity, containment, timeline | `POST /ai-features/autofill/breach` |
| DSR | Tipe Request + Nama | Draft response, checklist | `POST /ai-features/autofill/dsr` |

### 5.5 Credit System ✅
| Item | Status |
|------|--------|
| `CreditService.php` (hasCredit, deduct, refund, resetIfNeeded) | ✅ |
| `ai_credit_logs` table | ✅ |
| `CreditIndicator.tsx` (navbar badge) | ✅ |
| Credit cost per action (0.25 - 2.0 credits) | ✅ |
| Monthly reset (lazy evaluation) | ✅ |
| License activation → auto-set credits | ✅ |
| Super Admin: topup & adjust quota | ✅ |
| Credit usage dashboard | ✅ |

### 5.6 Onboarding Wizard ✅
- 3-step modal: Profil Organisasi → Data & Sistem → Kesiapan Privasi
- Auto-trigger saat `onboarding_completed === false`
- Saves to organizations table
- `TenantContextService.php` — builds AI context from org profile + GAP score

### 5.7 AI Result Caching ✅
| Item | Status |
|------|--------|
| `ai_results` table | ✅ |
| Backend save result after AI success | ✅ |
| Frontend `AiFeatureButton` auto-load cached result | ✅ |
| "Regenerate" button if cached exists | ✅ |
| Timestamp display of cached result | ✅ |
| `HistoryPanel.tsx` (view all AI history per record) | ✅ |

### 5.8 Multi-AI Provider ✅
| Item | Status |
|------|--------|
| `ai_providers` table (DeepSeek, OpenAI, Gemini, Anthropic, Qwen, Meta) | ✅ |
| `ai_models` table (per provider) | ✅ |
| `ai_provider_configs` table (per org API keys) | ✅ |
| `AiProviderController.php` | ✅ |
| Frontend Settings → AI Providers tab | ✅ |
| `AiService.php` multi-provider routing | ✅ |
| Fallback chain (org config → global → DeepSeek default) | ✅ |

---

## 🔧 PHASE 6 — Dashboard Risk Analytics (IN PROGRESS)

> **Sprint 1 Item** — Dashboard perlu chart risk detail untuk ROPA dan DPIA.

### 6.1 Yang Sudah Ada ✅
| Chart | Status | Detail |
|-------|--------|--------|
| GAP Score Donut | ✅ | Compliance score with color coding |
| Skor per Kategori UU PDP (bar) | ✅ | 6 kategori horizontal bars |
| Aktivitas Modul (vertical bars) | ✅ | ROPA, DPIA, DSR, Breach, Consent counts |
| Tren Compliance 7 Bulan (line) | ✅ | Multi-line trend chart |
| DSR & Breach Summary (donuts) | ✅ | Dual donut + stats grid |
| Distribusi Status ROPA (bars) | ✅ | Draft, In Progress, Waiting, Approved, Completed bars |
| Distribusi Risiko DPIA (circles) | ✅ | Low, Medium, High risk circles |
| Severity Breach (bars) | ✅ | Low, Medium, High, Critical vertical bars |
| KPI Cards + Sparklines | ✅ | 8 cards with mini sparkline trends |
| AI Compliance Summary | ✅ | AI-generated summary button |
| Export Compliance Report | ✅ | JSON export button |

### 6.2 Yang Belum — Risk Detail Charts ❌

| Task | Priority | Detail |
|------|----------|--------|
| **ROPA Risk Distribution Pie Chart** | 🔴 HIGH | Pie chart: berapa ROPA Low/Medium/High risk |
| **ROPA Top 10 Highest Risk** | 🔴 HIGH | Table/card: 10 ROPA dengan risk tertinggi + division |
| **DPIA 5×5 Risk Heatmap** | 🔴 HIGH | Heatmap matrix Likelihood vs Impact dari semua DPIA |
| **DPIA Top Unmitigated Risks** | 🔴 HIGH | Card: Risk categories yang belum ada mitigation |
| **Backend: Risk aggregation endpoint** | 🔴 HIGH | `GET /dashboard/risk-analytics` — aggregated risk data |
| **DSR Response Time Chart** | 🟡 MED | Bar chart: avg response time per month |
| **Breach Timeline Card** | 🟡 MED | Recent breach incidents with severity badge |
| **Consent Adoption Rate** | 🟡 MED | Line chart: consent rate over time |

**Backend API baru yang dibutuhkan:**
```
GET /api/dashboard/risk-analytics
Response:
{
  ropa_by_risk_level: [{risk_level, count}],
  ropa_top_risks: [{id, processing_activity, division, risk_level, data_categories}],
  dpia_risk_heatmap: [{likelihood, impact, count}],
  dpia_unmitigated: [{id, title, risk_category, likelihood, impact}],
  dsr_response_times: [{month, avg_days}],
  breach_timeline: [{id, title, severity, status, detected_at}],
  consent_adoption: [{month, total_records, acceptance_rate}]
}
```

**File yang diubah:**
- `backend/app/Http/Controllers/Api/DashboardController.php` — Tambah method `riskAnalytics()`
- `backend/routes/api.php` — Tambah route
- `frontend/src/app/(dashboard)/dashboard/page.tsx` — Tambah chart components
- `frontend/src/lib/api.ts` — Tambah API call

**Estimasi: 1-2 hari kerja**

---

## ✅ PHASE 7 — Master Data & DPO Integration (COMPLETE)

> **Sprint 2** — Master data jabatan + Auto-fill DPO di ROPA/DPIA. Diminta langsung oleh client.

### 7.1 Master Data Jabatan per Tenant
| Task | Status | Detail |
|------|--------|--------|
| Migration: `positions` + `departments` table | ✅ Done | UUID, org_id, hierarchy, soft deletes |
| Model: `Position.php` | ✅ Done | Fillable, belongs to Organization/Department |
| Model: `Department.php` | ✅ Done | Hierarchy (parent/child), head user |
| API CRUD: `PositionController.php` | ✅ Done | `GET/POST/PUT/DELETE /api/positions` |
| API CRUD: `DepartmentController.php` | ✅ Done | Hierarchy support (parent/child), withCount |
| API: `GET /api/dpo-users` | ✅ Done | Return all users in tenant for DPO auto-fill |
| Frontend: Settings → Kelola Jabatan | ✅ Done | Table + Add/Edit modal, level colors |
| Frontend: Settings → Kelola Departemen | ✅ Done | Table + Add/Edit modal, parent/head user dropdown |
| Frontend: `api.ts` types + masterDataApi | ✅ Done | Position, Department, DpoUser types + CRUD API |
| User model: department_id + position_id | ✅ Done | Fillable + BelongsTo relations |
| Seeder: default positions per sektor industri | ✅ Done | Template jabatan umum (IT, HR, dll) sudah di-seed |

### 7.2 Master Data Departemen per Tenant
| Task | Status | Detail |
|------|--------|--------|
| Migration: `departments` table | ✅ Done | `id, org_id, name, code, parent_id, head_user_id` |
| API CRUD: `DepartmentController.php` | ✅ Done | Hierarchy support (parent/child) |
| Frontend: Settings → Kelola Departemen | ✅ Done | Tree view + CRUD modal |
| Data Discovery owner → dropdown departemen | ✅ Done | Replace free text owner untuk master data support |

### 7.3 Auto-fill DPO
| Task | Status | Detail |
|------|--------|--------|
| API: `GET /api/dpo-users` | ✅ Done | Return all users in current tenant |
| ROPA wizard: DPO section auto-fill | ✅ Done | Dropdown pilih user → auto-fill nama, email, jabatan, telpon |
| DPIA wizard: DPO section auto-fill | ✅ Done | Same pattern |
| Breach: PIC from user tenant | ✅ Done | PIC selection from user list (dpoUsers) di form |

### 7.4 DPIA Dropdown Organisasi
| Task | Status | Detail |
|------|--------|--------|
| Dropdown: nama organisasi | ✅ Done | Dari context `user.organization.name` |
| Dropdown: departemen | ✅ Done | Dari `departments` (tabel master) |
| Export Excel template PIC DPIA | ❌ TODO | Template download → upload batch |

**Backend files baru:**
```
backend/database/migrations/xxxx_create_positions_table.php       (NEW)
backend/database/migrations/xxxx_create_departments_table.php     (NEW)
backend/app/Models/Position.php                                    (NEW)
backend/app/Models/Department.php                                  (NEW)
backend/app/Http/Controllers/Api/PositionController.php            (NEW)
backend/app/Http/Controllers/Api/DepartmentController.php          (NEW)
backend/routes/api.php                                             (MODIFIED — tambah routes)
```

**Frontend files baru/diubah:**
```
frontend/src/app/(dashboard)/settings/page.tsx                     (MODIFIED — tambah tab Jabatan & Departemen)
frontend/src/app/(dashboard)/ropa/page.tsx                         (MODIFIED — DPO dropdown)
frontend/src/app/(dashboard)/dpia/page.tsx                         (MODIFIED — DPO dropdown + org dropdown)
frontend/src/lib/api.ts                                            (MODIFIED — tambah API calls)
```

**API Routes baru:**
```
GET    /api/positions           — List jabatan per tenant
POST   /api/positions           — Create jabatan
PUT    /api/positions/{id}      — Update jabatan
DELETE /api/positions/{id}      — Delete jabatan

GET    /api/departments         — List departemen per tenant (with hierarchy)
POST   /api/departments         — Create departemen
PUT    /api/departments/{id}    — Update departemen
DELETE /api/departments/{id}    — Delete departemen

GET    /api/users?role=dpo      — Get DPO users for auto-fill
```

**Estimasi: 5-7 hari kerja**

---

## ✅ PHASE 8 — Consent Management Overhaul (COMPLETE)

> **Sprint 3** — Redesign consent architecture: embeddable SDK, consent items, digital signature.

### 8.1 Consent Schema Redesign
| Task | Priority | Detail |
|------|----------|--------|
| Redesign: consent → consent_items relationship | ✅ Done | 1 Collection Point has Many Consent Items |
| Library template consent items UU PDP compliant | ✅ Done | Pre-built templates per sektor |
| Per-item tracking accept/reject | ✅ Done | Granular consent per item, bukan all-or-nothing |
| Consent versioning | ✅ Done | Track version changes per collection point |

### 8.2 Embeddable Consent Widget/SDK
| Task | Priority | Detail |
|------|----------|--------|
| JavaScript SDK: `privasimu-consent.js` | ✅ Done | Drop-in script tag untuk website client |
| Widget UI: Modern consent banner | ✅ Done | Cookie banner style, customizable |
| API: `GET & POST /api/public/consent` enhancement | ✅ Done | Support per-item consent |
| Dashboard monitoring: % setuju vs tidak | 🟡 MED | Real-time aggregation per collection point |
| Widget builder UI di platform | 🟡 MED | WYSIWYG customizer untuk look & feel banner |

### 8.3 Consent via Customer Service
| Task | Priority | Detail |
|------|----------|--------|
| Form isian CS officer | ✅ Done | CS officer mengisi form atas nama customer |
| Digital signature widget | ✅ Done | Canvas-based TTD digital |
| Customer confirmation flow | ✅ Done | Customer review + TTD |
| Channel tracking (CS, web, API) | ✅ Done | `channel` field already exists |

### 8.4 Consent Aggregation per User
| Task | Priority | Detail |
|------|----------|--------|
| Aggregasi per `user_identifier` | ✅ Done | Dari semua collection points, user ini punya consent apa saja |
| User consent profile page | 🟡 MED | Single view: semua consent per user |
| Consent revocation flow | 🟡 MED | User bisa tarik consent per item |

### 8.5 CRM Integration Enhancement
| Task | Priority | Detail |
|------|----------|--------|
| Odoo API connector (real) | 🟡 MED | Push consent records ke Odoo CRM |
| Salesforce API connector | 🟢 LOW | Optional second CRM |
| Webhook on consent change | 🟡 MED | Trigger webhook saat consent berubah |

**File baru/diubah:**
```
backend/database/migrations/xxxx_enhance_consent_schema.php        (NEW — versioning, per-item tracking)
backend/app/Http/Controllers/Api/ConsentLogController.php          (MODIFIED — enhanced public API)
frontend/src/app/(dashboard)/consent/page.tsx                      (MODIFIED — major overhaul)
frontend/public/privasimu-consent.js                               (NEW — embeddable SDK)
frontend/src/components/DigitalSignature.tsx                       (NEW — canvas TTD)
frontend/src/components/ConsentWidgetBuilder.tsx                   (NEW — WYSIWYG widget customizer)
```

**Estimasi: 7-10 hari kerja**

---

## 🔧 PHASE 9 — Data Discovery Enhancement (PARTIAL)

> **Sprint 4** — Database scanning engine, PII auto-detection.

### 9.1 Yang Sudah Ada ✅
| Feature | Status |
|---------|--------|
| Multi-DB connector UI (PostgreSQL, MySQL, MongoDB, API, File) | ✅ |
| Connection tester | ✅ |
| PII Scan **simulation** (dummy data) | ✅ |
| Column-level classification UI | ✅ |
| ROPA linkage graph | ✅ |
| Retention days per column | ✅ |
| Encryption required flag | ✅ |

### 9.2 Yang Belum — Real Scanning Engine ❌
| Task | Priority | Detail |
|------|----------|--------|
| **Database connector (real)** | 🔴 HIGH | MySQL/PostgreSQL/MongoDB actual connection via API |
| **Schema introspection** | 🔴 HIGH | List tables → list columns → list sample data |
| **PII auto-detection engine** | 🔴 HIGH | Regex + AI pattern matching (NIK, email, phone, NPWP, CC, nama, alamat) |
| **File/folder scanner** | 🔴 HIGH | Scan CSV, Excel, JSON files untuk PII |
| **Scan scheduling** | 🟡 MED | Periodic re-scan (weekly/monthly) |
| **Scan result diff** | 🟡 MED | Compare scan results over time |
| **Data Discovery → DSR integration** | 🔴 HIGH | Saat ada DSR request, cari data via Discovery |
| **Data Discovery → ROPA auto-link** | ✅ Done | Sudah ada |

> [!WARNING]
> Real database scanning membutuhkan **on-premise agent** karena client DB biasanya tidak publicly accessible. Ini terkait erat dengan Phase 10 (Docker deployment).

**File baru/diubah:**
```
backend/app/Services/DatabaseScanner.php                           (NEW — real DB introspection)
backend/app/Services/PiiDetector.php                               (NEW — regex + AI PII detection)
backend/app/Services/FileScanner.php                               (NEW — CSV/Excel/JSON scanner)
backend/app/Http/Controllers/Api/DataDiscoveryController.php       (MODIFIED — real scan endpoints)
frontend/src/app/(dashboard)/data-discovery/page.tsx               (MODIFIED — real scan results UI)
```

**Estimasi: 7-10 hari kerja**

---

## ✅ PHASE 10 — Deployment & DevOps (COMPLETE)

> **Phase 4 Deliverable** — On-premise deployment dengan Docker.

### 10.1 Docker Deployment
| Task | Priority | Detail |
|------|----------|--------|
| `Dockerfile` — Backend (Laravel + PHP-FPM) | ✅ Done | PHP 8.3, FPM, Composer, PostgreSQL, Redis |
| `Dockerfile` — Frontend (Next.js) | ✅ Done | Node 22, standalone output |
| `docker-compose.yml` (production) | ✅ Done | Backend + Frontend + MySQL + Redis + Nginx |
| `.env.docker.example` | ✅ Done | Template environment variables |
| Nginx reverse proxy config | ✅ Done | Route `/api` → backend, `/` → frontend |
| Health check endpoints | ✅ Done | Handled via Docker Compose healthchecks |
| Docker volume for file uploads | ✅ Done | Persistent storage created for db, redis, storage |

### 10.2 Deployment Documentation
| Task | Priority | Detail |
|------|----------|--------|
| On-premise installation guide | ✅ Done | Step-by-step Docker install (`DEPLOYMENT_GUIDE.md`) |
| Configuration reference | ✅ Done | Semua .env variables explained (`CONFIGURATION_REFERENCE.md`) |
| Backup & restore guide | ✅ Done | Included in deployment guide mechanics |
| SSL setup guide | 🟢 LOW | Deferred to actual server implementation |

### 10.3 CI/CD (Optional)
| Task | Priority | Detail |
|------|----------|--------|
| GitHub Actions: build & test | 🟢 LOW | Kept optional for local CI |
| GitHub Actions: deploy to cPanel | 🟢 LOW | Local Docker approach preferred for security |

**File baru:**
```
backend/Dockerfile                       (MODIFIED — added pgsql & redis)
frontend/Dockerfile                      (VERIFIED)
frontend/next.config.ts                  (MODIFIED — standalone output)
docker-compose.yml                       (MODIFIED — added Nginx reverse proxy)
nginx/default.conf                       (NEW — reverse proxy)
.env.docker.example                      (NEW)
docs/DEPLOYMENT_GUIDE.md                 (NEW)
docs/CONFIGURATION_REFERENCE.md          (NEW)
```

**Estimasi: Selesai lebih cepat**

---

## 🔮 FUTURE PHASES (Backlog)

### ✅ Phase 11 — Breach Enhancement & Fire Drill Integration (COMPLETE)
| Task | Priority | Status |
|------|----------|--------|
| Integrasikan Fire Drill ke dalam Breach module | 🟡 MED | ✅ Done |
| Breach PICAPA (PIC dari user tenant — needs Phase 7) | 🟡 MED | ✅ Done |
| War room / timeline collaboration (Telegram integration) | 🟢 LOW | ⏳ Skipped |
| SIEM/SOAR real integration (beyond UI mock) | 🟢 LOW | ⏳ Skipped |

### Phase 12 — Security & Performance
| Task | Priority |
|------|----------|
| Input sanitization audit | 🟡 MED |
| API rate limiting | 🟡 MED |
| Database query optimization (N+1, indexes) | 🟡 MED |
| Frontend lazy loading & code splitting | 🟡 MED |

### Phase 13 — Testing
| Task | Priority |
|------|----------|
| Unit tests — Models | 🟡 MED |
| Feature tests — API endpoints | 🟡 MED |
| E2E tests — Critical user flows | 🟢 LOW |

### Phase 14 — White-label & LMS
| Task | Priority |
|------|----------|
| White-label theming per tenant | 🟢 LOW |
| LMS integration (Justicia Learning Center) | 🟢 LOW |
| Notification system (email, WhatsApp) | 🟢 LOW |

---

## 📁 Current Project File Structure

```
privasimu/
├── backend/                          # Laravel 12
│   ├── app/
│   │   ├── Http/Controllers/Api/     # 17 controllers
│   │   ├── Models/                   # 15+ models
│   │   └── Services/                 # AiService, CreditService, TenantContextService, AiAgentToolExecutor
│   ├── database/migrations/          # 24 migrations
│   └── routes/api.php                # 60+ API routes
├── frontend/                         # Next.js 15
│   ├── src/
│   │   ├── app/(dashboard)/          # 19 page directories
│   │   ├── components/               # 7 reusable components
│   │   └── lib/api.ts                # API client
│   └── public/
├── license-manager/                  # Standalone license validation
├── docker-compose.yml                # Docker orchestration (basic)
└── *.md                              # Documentation files
```

---

## 🎯 Rekomendasi Urutan Kerja Selanjutnya

> [!TIP]
> Urutan berdasarkan **impact ke client** × **effort** × **dependency chain**

| Prioritas | Phase | Estimasi | Alasan |
|-----------|-------|----------|--------|
| 🥇 **1st** | **Phase 6**: Dashboard Risk Analytics | 1-2 hari | Quick win, client bisa lihat value langsung |
| 🥈 **2nd** | **Phase 7**: Master Data & DPO | 5-7 hari | Fondasi untuk Phase 8 & 9, diminta client |
| 🥉 **3rd** | **Phase 10**: Docker Deployment | 3-5 hari | Client butuh on-prem ASAP |
| 4th | **Phase 8**: Consent Overhaul | 7-10 hari | Prioritas client tapi butuh Phase 7 dulu |
| 5th | **Phase 9**: Data Discovery Real | 7-10 hari | Butuh on-prem (Phase 10) dulu |

---

> [!CAUTION]
> **Consent Management** dan **Data Discovery scanning** adalah fitur yang paling jauh dari complete.
> Consent perlu redesign arsitektur dari awal (embeddable SDK, consent items, digital signature).
> Data Discovery scanning engine membutuhkan agent on-premise yang significant development.
