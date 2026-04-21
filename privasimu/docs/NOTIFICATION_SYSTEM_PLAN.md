# Notification System — Implementation Plan

**Status:** Sprint 1 + 2 + 3 complete · Sprint 4 pending

## Kill Switch Hierarchy (2-tier)

| Level | Where | Controlled by | Scope |
|---|---|---|---|
| **Global** | `AppSetting: features.notifications_enabled` | root (via `/platform-config`) | Entire platform · off = full silence |
| **Scheduler** | `AppSetting: features.notifications_scheduler_enabled` | root | Daily cron only · in-flow hooks still fire |
| **Per-tenant** | `organizations.settings.notifications_enabled` | root/superadmin (via `PUT /organizations/{id}/notifications-toggle`) | Single tenant silence |

`NotificationService::isEnabled($orgId)` checks both levels. Global off = always off. Global on + tenant off = silent for that tenant only; platform-level notifs (org_id=null) still flow.

---

## Konsep Inti

Setiap record yang lewat `security_alerts` sekarang jadi **notifikasi** dengan dua dimensi:

- **Kind** (jenis — tujuan/intensi): `alert` · `warning` · `info`
- **Severity** (level): `critical` · `high` · `medium` · `low`

Role targeting:
- `recipient_id` (user-level) → 1 user spesifik
- `recipient_role` (role-level fan-out) → broadcast ke `root` / `superadmin` / `admin` / `dpo` / `maker` / `viewer`
- `org_id NULL` → platform-level (hanya visible ke root/superadmin)

---

## Kind × Severity Matrix per Event

| Module | Event | kind | severity | recipient |
|---|---|---|---|---|
| **ROPA** | assigned ke user | info | low | user |
| ROPA | status → waiting (need approval) | alert | high | role:dpo |
| ROPA | rejected with notes | warning | medium | creator + assignees |
| ROPA | review due 90d | warning | medium | assignees |
| **DPIA** | auto-created dari ROPA high-risk | warning | high | role:dpo |
| DPIA | risk ≥ high | warning | high | role:dpo |
| **DSR** | deadline H-24 | warning | high | role:dpo |
| DSR | overdue | alert | critical | role:dpo |
| **Breach** | new detected | alert | critical | role:dpo |
| Breach | 72h deadline close | alert | critical | role:dpo |
| **Consent** | withdrawal spike | warning | medium | role:dpo |
| **Vendor Risk** | assessment overdue | warning | medium | role:dpo |
| **Data Discovery** | PII leak detected | alert | critical | role:dpo |
| **Approval** | step assigned to me | alert | high | user |
| Approval | approved/rejected | info | low | creator |
| **AI** | mutation pending approval | alert | high | role:admin |
| **Mentions** | @-mention in comment | info | low | user |
| **License** (platform) | H-30 | info | low | role:superadmin |
| License | H-14 | warning | medium | role:superadmin |
| License | H-7 | warning | high | role:superadmin |
| License | H-3 | alert | critical | role:superadmin |
| License | H-1 | alert | critical | role:superadmin |
| License | expired | alert | critical | role:superadmin |
| **System** (root) | new release deployed | info | low | role:root |
| System | DB backup failed | alert | critical | role:root |
| System | AI provider outage | warning | high | role:root |
| **Tenant** (superadmin) | new tenant signup | info | low | role:superadmin |
| Tenant | package upgrade request | warning | medium | role:superadmin |

---

## Default Subscriptions per Role

Seeder `NotificationPreferenceSeeder` mengisi default saat user baru dibuat:

| Role | Auto-subscribe |
|---|---|
| **root** | kind:alert + severity:critical · module:system/license |
| **superadmin** | kind:alert+warning · module:tenant/billing/license/feature-requests |
| **admin** | semua modul tenant, kind:alert+warning |
| **dpo** | module:ropa/dpia/dsr/breach/consent/approval, kind:alert+warning |
| **maker** | hanya yang di-assign ke me + mentions |
| **viewer** | hanya mentions |

User bisa override via `/settings/notifications`.

---

## Database Schema

### `security_alerts` (renamed function = notifications)
Kolom existing dipertahankan + kolom baru dari migration `2026_04_21_000003`:
```
kind          VARCHAR(16) default 'alert'  -- alert|warning|info
recipient_id  UUID NULL                     -- user target
recipient_role VARCHAR(32) NULL             -- role fan-out
read_at       TIMESTAMP NULL                -- per-user read state
priority      UNSIGNED SMALLINT default 50  -- sort key (higher=first)
action_url    VARCHAR(512) NULL             -- deep-link or wa.me URL
type          VARCHAR(64) NULL              -- granular event code
```

Indexes: `(recipient_id)`, `(recipient_role)`.

### `notification_preferences`
```
id, user_id, kind, module, channel (in_app|email|wa|push),
enabled bool, digest (instant|hourly|daily|off), timestamps
UNIQUE(user_id, kind, module, channel)
```

### `notification_schedules`
```
id, org_id NULL, record_type, record_id, rule_key,
next_fire_at, last_fired_at, enabled, metadata, timestamps
INDEX(enabled, next_fire_at), INDEX(record_type, record_id)
```

---

## Channels

| Channel | Status | Notes |
|---|---|---|
| **in_app** | ✅ Sprint 1 | Via `AlertBell` + `/notifications` page |
| **wa** | ✅ Sprint 1 | Deep-link `https://wa.me/{phone}?text={msg}` — tidak kirim otomatis, user klik untuk follow-up |
| **email** | Sprint 3 | Laravel Mailable + queue |
| **push** | Sprint 4 | Web Push via Soketi/Pusher + ServiceWorker |

---

## Backend Architecture

### `NotificationService::dispatch()`
Single entry point. Usage:
```php
NotificationService::dispatch(
    kind: 'alert',
    severity: 'high',
    module: 'ropa',
    type: 'ropa.assigned',
    recipient: 'user:' . $user->id,      // or 'role:dpo' or 'org:' . $orgId
    orgId: $record->org_id,
    title: '...',
    body: '...',
    actionUrl: '/ropa/' . $record->id,
    metadata: ['record_id' => $record->id]
);
```
- Resolves recipient spec → user list
- Checks `NotificationPreference::isEnabled()` per user per kind × module × channel
- Severity → priority auto-map (critical=100, high=75, medium=50, low=25)
- WA URL builder handles ID phone format (`08xx` → `628xx`)

### Scheduler (`routes/console.php`)
```
notifications:scan-license-expiry   dailyAt('06:00')
```
Scheduler reads `licenses.expires_at` (trusted signed payload) dan fire escalating notifications to role:superadmin.

Sprint 3 tambah:
```
notifications:scan-ropa-review       dailyAt('07:00')   # 90d review
notifications:digest-email           dailyAt('08:00')   # daily digest
```

---

## API Endpoints

Semua di bawah `/api/security/*` dengan alias `/api/security/notifications/*`:

```
GET    /alerts                      list (filter by kind/severity/module/status/unread)
GET    /alerts/count                badge count untuk bell icon
GET    /alerts/export               CSV export (untuk superadmin license-expiring)
POST   /alerts/scan                 trigger AlertEngine manual
POST   /alerts/mark-all-read        bulk mark read
POST   /alerts/{id}/read            mark single read
POST   /alerts/{id}/acknowledge     ACK
POST   /alerts/{id}/resolve         resolved
POST   /alerts/{id}/dismiss         dismiss
```

Visibility scoping (di `AlertController::scopedQuery`):
- **root/superadmin**: lihat `org_id=NULL` + `recipient_role=my_role` + `recipient_id=me`
- **tenant user**: lihat `org_id=my_org` AND (`recipient_id=me` OR `recipient_role=my_role` OR both null)

---

## Frontend Components

### `AlertBell.tsx` (extended)
- Badge count + pulse animation untuk critical
- Kind tabs: All / Alert / Warning / Info (per-kind count)
- Per-row: kind badge + severity badge + module pill + unread dot
- Action buttons per row: 💬 WA (jika action_url wa.me) · Open Detail · ACK · Dismiss
- Footer: "Tandai semua dibaca" + "Lihat semua →" ke `/notifications`

### `/notifications` full page
- 2-kolom layout (sidebar 260px + content 1fr)
- Sidebar: filter by Kind / Severity / Module + "Hanya belum dibaca" toggle
- Content: rich row dengan kind/severity/module chips, body, license contact block (untuk module=license), action buttons
- Toolbar: Refresh · Mark all read · Export CSV (superadmin only)

### `/settings/notifications` (Sprint 2)
Table toggle per (kind × module × channel):

| Kategori | In-App | Email | WA | Push | Digest |
|---|---|---|---|---|---|
| ROPA Assignment | ✓ | ✓ | — | — | Instant |
| License Expiring | ✓ | ✓ | — | — | Daily |
| ... | | | | | |

---

## WhatsApp Follow-up Flow (Superadmin)

1. Scheduler daily 06:00 scan license → fire notifikasi dengan metadata:
   ```
   {
     org_name, admin_name, admin_email, admin_phone,
     expires_at, days_left, wa_url
   }
   ```
2. `wa_url` = `https://wa.me/628xx?text=<pre-filled-message>`
3. Superadmin buka `/notifications`, filter module=license
4. Klik "💬 Follow-up via WA" → browser buka WA dengan pesan siap kirim
5. ATAU klik "📥 Export CSV" → CSV berisi semua license expiring untuk dikirim ke tim finance/sales

---

## Sprint Roadmap

### ✅ Sprint 1 — Foundation (DONE, local)
- [x] Migration: `kind`, `recipient_id`, `recipient_role`, `read_at`, `priority`, `action_url`, `type` + `notification_preferences` + `notification_schedules`
- [x] `NotificationService` wrapper dengan fan-out + WA URL builder
- [x] `ScanLicenseExpiry` command + daily schedule
- [x] 5 event hooks: ROPA assign, DPIA auto-create, DSR H-24, Breach new, Approval pending
- [x] `AlertBell` extended (kind tabs + WA button)
- [x] `/notifications` full page dengan CSV export

### ✅ Sprint 2 — Preferences + More Events (DONE, local)
- [x] `/settings/notifications` preference UI (kind × module × channel grid)
- [x] `NotificationPreferenceDefaults` service seeded on user signup
- [x] Root kill-switches (`features.notifications_enabled`, `features.notifications_scheduler_enabled`)
- [x] Superadmin per-tenant kill switch (`PUT /organizations/{id}/notifications-toggle`)
- [x] Master daily scan (`notifications:scan-all`) respects both switches
- [x] Events wired:
  - ROPA review 90d (AlertEngine scheduler)
  - DPIA review 30d/180d by risk level (AlertEngine scheduler)
  - DSR overdue (upgraded to NotificationService)
  - DSR deadline H-24 (AlertEngine scheduler)
  - Breach new (in-flow, store hook)
  - Breach 72h deadline H-24 (AlertEngine scheduler)
  - Approval pending (in-flow, update hook)
  - AI mutation pending (in-flow, AiAgentToolExecutor)
  - Data Discovery PII leak (in-flow, DataDiscoveryController)
  - DPIA auto-create from high-risk ROPA (in-flow, store hook)
  - ROPA assigned/assignee-added (in-flow, store + update hook)
- [ ] (Deferred to Sprint 3) Consent withdrawal spike, @-mentions, GAP cooldown, Vendor Risk overdue — need metric thresholds / cross-module hooks

### ✅ Sprint 3 — Email + Digest (DONE)
- [x] `NotificationMail` Mailable with kind-colored blade template (alert/warning/info)
- [x] `NotificationDigestMail` grouped summary email
- [x] `SendNotificationDigest` command (daily + weekly variants)
- [x] Digest scheduler: `notifications:digest daily` at 08:00 + `notifications:digest weekly` Monday 08:00
- [x] NotificationService email side-channel: per-user preference gated, honors `digest` setting (instant fires immediately, daily/weekly batched)
- [x] `MAIL_MAILER=log` default for dev safety; tenants configure provider via `.env`
- [x] Email toggle live in `/settings/notifications`
- [ ] (Deferred to Sprint 4) Signed unsubscribe link, provider config UI

### 🔜 Sprint 4 — Realtime + Platform Ops
- [ ] Laravel Echo + Soketi/Pusher broadcast channel `private-users.{id}`
- [ ] Browser push notifications (ServiceWorker + Web Push API)
- [ ] Root notifications: system.release, system.backup_failed, system.ai_outage
- [ ] Superadmin notifications: tenant.signup, tenant.upgrade_request, billing.*
- [ ] Partner API webhook receiver → notification trigger

---

## Design Decisions (locked-in)

| Decision | Value | Reason |
|---|---|---|
| Kind taxonomy | `alert` / `warning` / `info` | User-confirmed, keeps things simple |
| Storage table | Keep `security_alerts` | Backward-compat with existing AlertEngine scans |
| UI terminology | "Notifikasi" (not Security Alerts) | Broader scope now |
| `AlertBell.tsx` filename | Keep | Reduce diff noise |
| `/security` dashboard | Keep | For deep security-scan detail view |
| Backward-compat | All existing rows `kind='alert'` (backfilled) | No data loss |
| WA number source | `users.phone` (role=admin) | Already collected |
| Phone normalization | `0xx` → `62xx` (Indonesian) | Most tenants are ID |
| Export format | CSV first | Finance tool friendly |
| WA integration | Click-to-open only | No auto-send (compliance, consent) |
| Realtime | Polling di Sprint 1, Push di Sprint 4 | Iteratif |
