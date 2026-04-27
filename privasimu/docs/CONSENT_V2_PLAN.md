# Consent v2 — Cookie Banner vs User Consent (split + CRM extractor)

> Tanggal: 2026-04-27
> Pemicu: arahan klien — "embed-nya 2, beda. Cookie di homepage (anonymous: id/ip/country/browser). Consent di register page (identifiable: email/name/phone). Logs juga harus 2. Plus extractor data ke CRM dari consent (filter by purpose)."

---

## 1. Audit current state

| Komponen | Yang sudah ada | Gap vs target |
|---|---|---|
| `consent_collection_points` table | ✅ punya kolom `kind` (`cookie_banner` vs `app_consent`), migration `2026_04_27_000004` | OK |
| Model `ConsentCollectionPoint` | ✅ punya constants `KIND_COOKIE`, `KIND_APP`, `KINDS` | OK |
| `consent_items` | ✅ shared schema | Boleh tetap shared (item = "purpose") |
| `consent_logs` table | ⚠️ unified shape: `user_identifier`, `consented_items`, `ip_address`, `user_agent` | Tidak bedakan anonymous vs identifiable. Tidak ada country/browser_name/browser_version. Tidak ada email/name/phone explicit. |
| Embed scripts | ✅ ada 2 file: `consent.js`, `consent-widget.js` | Tapi keduanya hampir sama kerjanya, belum benar-benar split. Cookie banner butuh consent banner UX (geo-aware, persistent), Register consent butuh inline form UX (email-required) |
| Admin UI `/consent` | ✅ 1 page tab-based | Belum split per-kind dengan jelas. Butuh 2 sub-flow. |
| Preview pages | ✅ `/embed/consent-editor` (cookie) | ❌ Belum ada preview untuk register-consent (konteks user identifiable) |
| Preference center `/preference-center` | ✅ ada | Hanya untuk cookie revocation; perlu extension untuk app-consent |
| CRM Extractor | ❌ tidak ada | Butuh end-to-end |

**Yang sebenarnya sudah benar di BE:** kolom `kind` sudah memisahkan collection points. Yang belum: log differentiation, FE admin yang sadar kind, embed yang truly different, preview register, dan CRM extractor.

---

## 2. Domain decisions

### 2.1 Storage strategy untuk logs
Dua pilihan:

**A) Satu tabel `consent_logs` dengan kolom kind + nullable fields**
- Pros: simple, satu query untuk dashboard, foreign key ke collection_point sudah carry kind info
- Cons: schema mixed-purpose, mudah salah query

**B) Split ke `cookie_logs` (anonymous) + `consent_logs` (identifiable)**
- Pros: schema clean, intent jelas, query CRM-extractor straight ke `consent_logs` saja
- Cons: dua kontroller, dua endpoint, migration data lama

**Rekomendasi: B (split tables)**. Klien spesifik minta "cookies log bukan hanya consent log". Schema dual-table juga lebih baik untuk privacy: `cookie_logs` aggressive retention (90 hari), `consent_logs` lebih lama dengan obligation per UU PDP. Migration: row di `consent_logs` lama dengan collection.kind='cookie_banner' di-pindah ke `cookie_logs` (data move + soft-delete original).

### 2.2 Schema baru

```sql
-- BARU: cookie_logs (anonymous visitor)
CREATE TABLE cookie_logs (
  id UUID PRIMARY KEY,
  org_id UUID NOT NULL,
  collection_id UUID NOT NULL REFERENCES consent_collection_points(id),
  visitor_id VARCHAR(80) NOT NULL,            -- localStorage UUID
  session_id VARCHAR(80),                     -- per-page-load nonce
  ip_address VARCHAR(45),
  ip_country VARCHAR(2),                      -- ISO-3166-1 alpha-2 (auto-resolve)
  ip_city VARCHAR(120),                       -- optional
  user_agent VARCHAR(500),
  browser_name VARCHAR(40),                   -- parsed from UA
  browser_version VARCHAR(20),
  os_name VARCHAR(40),
  device_type VARCHAR(20),                    -- desktop/mobile/tablet
  referrer VARCHAR(500),
  page_url VARCHAR(500),                      -- where the banner showed
  choices JSONB NOT NULL,                     -- {necessary:true, analytics:true, marketing:false, preferences:true}
  policy_version VARCHAR(20),
  captured_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,                     -- auto-cleanup after retention period
  deleted_at TIMESTAMPTZ
);
CREATE INDEX idx_cookie_logs_org_visitor ON cookie_logs(org_id, visitor_id);
CREATE INDEX idx_cookie_logs_collection_captured ON cookie_logs(collection_id, captured_at DESC);

-- DIUBAH: consent_logs sekarang khusus identifiable (app_consent kind)
ALTER TABLE consent_logs
  ADD COLUMN email VARCHAR(200),              -- canonical identifier
  ADD COLUMN name VARCHAR(200),
  ADD COLUMN phone VARCHAR(50),
  ADD COLUMN user_id UUID,                    -- FK ke app_users kalau ada
  ADD COLUMN external_user_ref VARCHAR(120),  -- ID di sistem klien (CRM/SSO)
  ADD COLUMN purpose_keys JSONB,              -- denormalized item keys for fast filter ('marketing','newsletter')
  ADD COLUMN source_form VARCHAR(40),         -- 'register', 'checkout', 'newsletter', etc
  ADD COLUMN ip_country VARCHAR(2),
  ADD COLUMN browser_name VARCHAR(40);
CREATE INDEX idx_consent_logs_org_email ON consent_logs(org_id, email);
CREATE INDEX idx_consent_logs_purpose ON consent_logs USING GIN (purpose_keys);
```

### 2.3 Embed scripts — beda nyata

| Embed | Konteks | UX | Required fields | Payload kirim |
|---|---|---|---|---|
| `cookie-banner.js` | homepage / public site | Floating banner bottom-right, geo-aware, persistent localStorage | hanya checkbox per kategori | visitor_id (UUID), choices, page_url, referrer (browser-derived) |
| `consent-form.js` | register / checkout / newsletter form | Inline `<div data-privasimu-consent>` di-replace dengan checkbox + "Saya setuju" | email/name/phone wajib (atau read dari form) | email, name, phone, choices, source_form, ext_ref |

`cookie-banner.js` = rebuild dari `consent-widget.js` yang sudah ada, fokus visitor.
`consent-form.js` = baru, attach ke form HTML klien.

### 2.4 CRM Extractor

**Goal:** "ambil data marketing dari CRM" → maksudnya: extract subset of consent_logs di mana user setuju ke purpose tertentu, output: list nama/email/phone yang siap di-push ke CRM (HubSpot, Salesforce, Mailchimp).

**Scope:**
- Filter: collection_id, purpose_keys (multi-select), date range, source_form, country
- Output kolom: name, email, phone + selected purposes + captured_at
- Action:
  - **Export CSV** (manual download)
  - **Push langsung** ke CRM via existing connector (consent module sudah punya CRM sync via webhook — extend untuk batch extract)
  - **Schedule recurring** (daily/weekly extract → push)
- Audit trail: setiap extract tercatat siapa, kapan, filter apa, berapa records, sent ke mana.

---

## 3. Phase plan

### Phase A — Data layer (BE)
- [ ] Migration: create `cookie_logs` table dengan schema di §2.2
- [ ] Migration: extend `consent_logs` dengan kolom email/name/phone/etc
- [ ] Model `CookieLog` (HasUuids, soft-delete, casts)
- [ ] Update `ConsentLog` model fillable + casts
- [ ] Data migration: pindahkan rows existing `consent_logs` yang collection.kind='cookie_banner' ke `cookie_logs` (preserve created_at, soft-delete original)
- [ ] Service: `IpGeoResolver` (gunakan MaxMind/IPinfo lite atau cache hardcoded country list) untuk fill `ip_country`
- [ ] Service: `UserAgentParser` (pakai library `jenssegers/agent` atau `whichbrowser/parser`) untuk fill browser/os/device
- [ ] Retention worker: job harian yang `delete` cookie_logs > expires_at

### Phase B — API endpoints (BE)
- [ ] `POST /v1/cookies/capture` — public endpoint, accept visitor_id + choices, parse UA + IP, write `cookie_logs`. Rate-limit: per visitor_id 100/hr.
- [ ] `GET /v1/cookies/state?visitor_id=...&collection_id=...` — return current preferences
- [ ] `POST /v1/cookies/withdraw` — visitor revoke
- [ ] `POST /v1/consent/capture` — already exists; update untuk tulis `consent_logs` shape baru (email required), validate kind=app_consent
- [ ] Admin: `GET /api/admin/cookie-logs` (paginated, filterable per collection)
- [ ] Admin: `GET /api/admin/consent-logs` (existing — extend filter by purpose_keys)
- [ ] Admin: `POST /api/admin/consent-logs/extract` — body: `{collection_id, purpose_keys[], date_from, date_to, format: 'csv'|'crm', target?: 'hubspot'|'salesforce'|...}` → return file or push job
- [ ] Audit: `extract_runs` table (siapa, kapan, filter, count, target, status)

### Phase C — Embed scripts (FE public)
- [ ] Rename existing `consent-widget.js` → `cookie-banner.js`, refactor untuk fokus visitor only (drop email field UI)
- [ ] Update `consent.js` → `consent-form.js`, fokus inline form, email-required, attach to existing register/checkout form
- [ ] Both: posting ke endpoint baru di Phase B
- [ ] Backwards-compat: keep old paths `/consent.js` + `/consent-widget.js` redirect-rewrite untuk klien lama
- [ ] Embed playground page improvement: side-by-side preview cookie vs consent

### Phase D — Admin UI
- [ ] `/consent` page: split jadi 2 tab atas: **🍪 Cookie Banners** vs **📝 User Consents**
- [ ] Per-tab list filter by kind, CRUD collection points
- [ ] Tab Logs juga split: **Cookie Logs** (kolom: visitor_id, ip, country, browser, choices, captured_at) vs **Consent Logs** (kolom: email, name, phone, source_form, purposes, captured_at)
- [ ] Tab **Preview** — 2 preview:
  - Cookie banner preview = current `/embed/consent-editor` flow (homepage simulator)
  - **NEW** Consent form preview = simulasi register page dengan inline consent block
- [ ] Tab **Extractor** baru:
  - Filter form: collection, purposes (multi-pill), date range, source_form, country
  - Live count "matching records: 1,234"
  - Action buttons: Download CSV / Push to HubSpot / Push to Salesforce / Schedule
  - History list di bawahnya (audit trail dari extract_runs)

### Phase E — Preview pages
- [ ] `/embed/consent-editor` — already cookie preview, polish (label "Cookie Banner Preview")
- [ ] `/embed/consent-form-editor` — NEW preview, simulates register page dengan form (Name/Email/Phone) + inline consent block. Render konten dari collection items
- [ ] `/preference-center` — extend untuk handle 2 jenis: query param `kind=cookie|app`

### Phase F — CRM extractor implementation
- [ ] Backend job: `ExtractConsentLogsJob` async, support filter dan output target
- [ ] CSV export: pakai `Maatwebsite\Excel` atau native streaming
- [ ] CRM connectors:
  - HubSpot: pakai existing connector di consent module (kalau ada), atau wire baru via `https://api.hubapi.com/crm/v3/objects/contacts/batch/upsert`
  - Salesforce: `Bulk API 2.0`
  - Mailchimp: `lists/{id}/members/batch`
  - Custom webhook: POST JSON ke URL klien
- [ ] Frontend extractor wizard: 4 step (Source → Filter → Output → Confirm)
- [ ] Audit log per run + retry on partial failure

### Phase G — Migration & launch
- [ ] Run data migration script in staging, verify counts
- [ ] Update existing klien yang pakai `consent.js` lama: cek inventory, kirim email upgrade path
- [ ] Backwards-compat 90 hari (script lama tetap work, log warning di console)
- [ ] Marketing materials: update embed docs, demo videos

---

## 4. Improvement vs current

Yang sudah ada tapi bisa diimprove:

1. **`ConsentLog.user_identifier`** — currently single string field. Confusing: cookie pakai UUID, app pakai email. Solusi: split ke `visitor_id` (cookie_logs) vs `email` (consent_logs) untuk clarity.
2. **Geo resolution** — IP saja, tidak tahu country. Tambah `IpGeoResolver` cache.
3. **Browser parsing** — UA string raw, tidak query-able. Tambah parsed `browser_name`/`os_name`/`device_type`.
4. **Embed UX** — kedua script saat ini hampir identik (modal-style). Differentiate jelas: cookie = banner persistent, consent = inline form attached.
5. **Preview** — hanya cookie. Tambah consent-form preview untuk demo ke calon klien register flow.
6. **Extractor** — sebelumnya hanya logs view + manual export per row. Build wizard yang spesifik untuk CRM push.
7. **Retention** — cookie_logs harus auto-cleanup; consent_logs disimpan sesuai obligation (UU PDP retention rules per purpose).
8. **Dashboard widgets** — tambah "Cookie consent rate" + "Marketing opt-in rate" (split).

---

## 5. Open questions (perlu konfirmasi user sebelum implement)

1. **Geo lookup**: pakai library on-prem (MaxMind GeoLite2 — gratis, 50MB DB file) atau API external (ip-api.com, ipinfo.io)? On-prem aman untuk privacy.
2. **CRM target priority**: mulai dari yang mana? (HubSpot paling umum di Indonesia) atau bikin generic webhook + custom mapping pertama?
3. **Retention default**: cookie_logs 90 hari? consent_logs 5 tahun (sesuai UU PDP audit obligation)?
4. **Migration backwards-compat**: berapa lama `consent.js` lama tetap di-serve sebelum hard-deprecate?
5. **Visitor_id stability**: kalau user clear localStorage, jadi visitor_id baru. Boleh? Atau pakai cookie + localStorage gabung?
6. **Auth untuk extractor**: hanya admin atau ada role baru "marketing-ops"? Karena ekspor email bulk sensitif.
7. **Rate limit CRM push**: HubSpot API ada quota — kita cap berapa per jam?

---

## 6. Estimasi effort

| Phase | Estimasi | Dependencies |
|---|---|---|
| A — Data layer | 1.5 hari | — |
| B — API endpoints | 2 hari | A |
| C — Embed scripts | 1.5 hari | B |
| D — Admin UI tab split | 2 hari | B |
| E — Preview pages | 1 hari | D |
| F — CRM Extractor | 2.5 hari | B + D |
| G — Migration & launch | 1 hari | All |

**Total: ~11.5 hari engineering** (1 dev fullstack) atau ~6 hari (BE+FE paralel).

---

## 7. Saran build order

Vertical-slice approach — pilih Phase A + B (kapture cookie + capture consent identifiable) + C minimal (1 embed script kerja end-to-end) + D admin tab split + E preview cookie. Lalu Phase F (CRM extractor) sebagai milestone besar berikutnya. Phase G migration di akhir.

Build slice 1: `cookie_logs` capture end-to-end → demo ke klien sebelum lanjut ke consent_logs identifiable.

---

## 8. Acceptance criteria

Phase A+B selesai kalau:
- ✅ POST `/v1/cookies/capture` menerima `{visitor_id, choices, collection_id}` → tulis row ke `cookie_logs` dengan country/browser auto-fill.
- ✅ POST `/v1/consent/capture` menerima `{email, name, phone, choices, collection_id, source_form}` → tulis row ke `consent_logs` (extended).
- ✅ Admin GET `/api/admin/cookie-logs` paginated + filterable.

Phase D+E selesai kalau:
- ✅ Admin `/consent` punya 2 tab atas yang clear (Cookie Banners / User Consents).
- ✅ Tab Preview punya dua tombol toggle: "Preview Cookie Banner" vs "Preview Consent Form".
- ✅ Extract preview wizard tampil dengan filter dan live count.

Phase F selesai kalau:
- ✅ Extract dengan filter `purpose=marketing` → CSV download dengan kolom name/email/phone hanya untuk yang setuju marketing.
- ✅ Push ke HubSpot test sandbox berhasil dengan 1 record sample.
- ✅ Audit log row per extract.
