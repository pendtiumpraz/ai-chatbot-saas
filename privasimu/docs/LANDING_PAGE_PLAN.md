# Privasimu Nexus — Landing Page Plan

> Marketing site publik + back-office management gated by **root + superadmin**.
> Target: kualitas visual setara securiti.ai, tapi positioning-nya tonjolkan
> nilai-plus Nexus (UU PDP-native, on-prem AI, white-label, migration tool).

---

## 0. Apa yang Sudah Diriset dari securiti.ai

Pola yang ditiru (best practices yang terbukti):
- **Hero** — full-width gradient bg, headline serif besar, dual CTA (See Demo + Contact)
- **Persona-based product showcase** — 4 kolom per role (Security Team / Privacy Team / Build Team / Govern Team), tiap kolom 8-10 product cards. Bukan feature dump 1 halaman.
- **Sosial proof** — IDC quote besar + carousel award badges (Gartner, Forrester, dst)
- **Mega-menu navigation** — Products / Solutions / Resources / Company, masing-masing punya sub-grid (by Industry, by Tech, by Regulation, by Role)
- **Use-case grid** — 3-col cards, icon + 1 sentence desc, hover lift
- **Integration logos** — grid 1000s of integrations (kita versi mini: 10-20 connector logos)
- **Sticky "See Demo" CTA** di nav, persisten saat scroll
- **Footer dark** — 5-col grid + award badges repeat di bawah
- Visual: **minimalist, lots of whitespace, monochrome SVG icons, serif headlines + sans body, accent teal/blue on white**

Pola yang TIDAK ditiru (kita beda):
- Tidak punya halaman Team publik (Securiti gak punya juga, tapi user MAU team page jadi kita bikin)
- Tidak terlalu corporate-cold; kita pakai sedikit warna khas Indonesia (subtle, tetap profesional)
- Tonjolkan **comparison table OT/Securiti vs Nexus** sebagai hero secondary block

---

## 1. Tech Stack & Lokasi File

### Frontend (Next.js 16, App Router)
**Public routes — di luar `(dashboard)` group:**
```
frontend/src/app/(marketing)/
  layout.tsx              # marketing layout (no sidebar, public nav + footer)
  page.tsx                # / — landing
  about/page.tsx          # /about — company + team
  products/page.tsx       # /products — overview
  products/[slug]/page.tsx # /products/dpia, /products/dsr, dst
  solutions/page.tsx      # /solutions
  pricing/page.tsx        # /pricing
  contact/page.tsx        # /contact
  compare/page.tsx        # /compare — public version of COMPETITIVE_LANDSCAPE
```

**Admin routes — di dalam `(dashboard)` gated:**
```
frontend/src/app/(dashboard)/landing-admin/
  page.tsx                # overview dashboard landing settings
  hero/page.tsx           # edit hero text + upload hero image
  features/page.tsx       # CRUD feature cards (with screenshot upload)
  team/page.tsx           # CRUD team members (paginated, photo upload)
  testimonials/page.tsx   # CRUD testimonials
  logos/page.tsx          # CRUD partner/customer logos
  pricing/page.tsx        # CRUD pricing tiers
  seo/page.tsx            # meta tags, og:image
```

### Backend (Laravel 12)
**Models & migrations — semua singleton-style atau ordered list:**
```
backend/app/Models/Landing/
  LandingSetting.php       # singleton (1 row) — hero, branding, CTAs, SEO
  LandingFeature.php       # ordered list — feature cards
  LandingTeamMember.php    # ordered list — team page (paginated)
  LandingTestimonial.php   # ordered list
  LandingLogo.php          # ordered list — partner/customer logos
  LandingLead.php          # contact + demo submissions (replaces pricing — gov apps, no public price)
  LandingProduct.php       # ordered list — produk (untuk /products listing)
  LandingStat.php          # ordered list — stat blocks (10M+ users, dst)
```

**Controllers:**
```
backend/app/Http/Controllers/Api/
  PublicLandingController.php       # PUBLIC read endpoints (no auth)
  Admin/LandingSettingController.php # gated root/superadmin
  Admin/LandingFeatureController.php
  Admin/LandingTeamController.php
  Admin/LandingTestimonialController.php
  Admin/LandingLogoController.php
  Admin/LandingPricingController.php
  Admin/LandingProductController.php
  Admin/LandingStatController.php
```

**Routes:**
```
// Public — tidak butuh auth
Route::prefix('public/landing')->group(function () {
    Route::get('/settings', [PublicLandingController::class, 'settings']);
    Route::get('/features', [PublicLandingController::class, 'features']);
    Route::get('/team', [PublicLandingController::class, 'team']);  // paginated
    Route::get('/testimonials', [PublicLandingController::class, 'testimonials']);
    Route::get('/logos', [PublicLandingController::class, 'logos']);
    Route::get('/pricing', [PublicLandingController::class, 'pricing']);
    Route::get('/products', [PublicLandingController::class, 'products']);
    Route::get('/products/{slug}', [PublicLandingController::class, 'productDetail']);
    Route::get('/stats', [PublicLandingController::class, 'stats']);
});

// Admin — gated dengan middleware role:root,superadmin
Route::middleware(['auth:sanctum', RootOrSuperadmin::class])
    ->prefix('admin/landing')->group(function () {
        Route::apiResource('settings', LandingSettingController::class)->only(['show','update']);
        Route::post('settings/upload', [LandingSettingController::class, 'uploadAsset']);
        Route::apiResource('features', LandingFeatureController::class);
        Route::post('features/{id}/screenshot', [LandingFeatureController::class, 'uploadScreenshot']);
        Route::apiResource('team', LandingTeamController::class);
        Route::post('team/{id}/photo', [LandingTeamController::class, 'uploadPhoto']);
        Route::apiResource('testimonials', LandingTestimonialController::class);
        Route::apiResource('logos', LandingLogoController::class);
        Route::apiResource('pricing', LandingPricingController::class);
        Route::apiResource('products', LandingProductController::class);
        Route::apiResource('stats', LandingStatController::class);
        Route::post('reorder/{resource}', [ReorderController::class, 'reorder']); // drag-drop ordering
    });
```

**Middleware baru:**
```
backend/app/Http/Middleware/RootOrSuperadmin.php
  — abort 403 kecuali $user->role in ['root', 'superadmin']
  — register di bootstrap/app.php sebagai alias `role:root_or_super`
```

**Storage:**
- Pakai `TenantStorageService` versi system (no tenant scoping) — simpan di
  `storage/app/public/landing/{hero,features,team,testimonials,logos}/`
- Atau buat helper `LandingAssetService` baru yang khusus public storage

---

## 2. Database Schema (Detail)

### `landing_settings` (1 row, singleton)
```
id (uuid, pk)
hero_eyebrow VARCHAR(120)             -- "UU PDP-Native Privacy Platform"
hero_headline TEXT                    -- "Compliance UU PDP, tanpa rumit"
hero_subheadline TEXT                 -- 2-3 sentences value prop
hero_image_path VARCHAR(500)          -- uploaded
hero_video_url VARCHAR(500)           -- optional YouTube/Vimeo
hero_cta_primary_label VARCHAR(60)    -- "Lihat Demo"
hero_cta_primary_url VARCHAR(500)
hero_cta_secondary_label VARCHAR(60)  -- "Hubungi Tim"
hero_cta_secondary_url VARCHAR(500)
brand_logo_path VARCHAR(500)          -- nexus.png — already exists
brand_favicon_path VARCHAR(500)
brand_primary_color VARCHAR(20)
brand_accent_color VARCHAR(20)
seo_title VARCHAR(255)
seo_description TEXT
seo_og_image_path VARCHAR(500)
contact_email, contact_phone, contact_address TEXT
social_linkedin, social_twitter, social_youtube, social_instagram VARCHAR(500)
footer_about TEXT
footer_copyright VARCHAR(255)
created_at, updated_at
```

### `landing_features`
```
id (uuid, pk)
section ENUM(hero, products, capabilities, why_us, integration)  -- mana di landing
icon_name VARCHAR(60)         -- lucide icon name (Shield, Brain, dst) ATAU
icon_image_path VARCHAR(500)  -- custom uploaded SVG
title VARCHAR(180)
subtitle VARCHAR(255)
description TEXT
screenshot_path VARCHAR(500)  -- product screenshot uploaded
category VARCHAR(60)          -- "AI Governance" / "Privacy" / "Security"
cta_label VARCHAR(60)
cta_url VARCHAR(500)
order_index INTEGER
is_published BOOLEAN
created_at, updated_at
```

### `landing_team_members`
```
id (uuid, pk)
name VARCHAR(120)
role VARCHAR(120)             -- "Co-Founder & CEO"
bio TEXT
photo_path VARCHAR(500)       -- uploaded
linkedin_url VARCHAR(500)
twitter_url VARCHAR(500)
email VARCHAR(180)
order_index INTEGER
is_published BOOLEAN
created_at, updated_at
```
**Pagination:** 12 members per page (sesuai securiti standar).

### `landing_testimonials`
```
id (uuid, pk)
quote TEXT
author_name VARCHAR(120)
author_role VARCHAR(120)
author_company VARCHAR(120)
author_photo_path VARCHAR(500)
company_logo_path VARCHAR(500)
rating INTEGER  -- 1..5 untuk filter
order_index INTEGER
is_featured BOOLEAN  -- featured = tampil di hero, lainnya di carousel
is_published BOOLEAN
```

### `landing_logos` (partner/customer logos)
```
id (uuid, pk)
name VARCHAR(120)
logo_path VARCHAR(500)
category ENUM(customer, partner, integration)
link_url VARCHAR(500)
order_index INTEGER
is_published BOOLEAN
```

### `landing_pricing_tiers`
```
id (uuid, pk)
name VARCHAR(60)              -- "Starter / Growth / Enterprise"
price_idr BIGINT              -- in IDR (transparan, beda dari kompetitor!)
price_period VARCHAR(20)      -- "/bulan" or "/tahun"
description TEXT
features JSONB                -- array of strings
cta_label VARCHAR(60)
cta_url VARCHAR(500)
is_featured BOOLEAN           -- "Most Popular" badge
order_index INTEGER
is_published BOOLEAN
```

### `landing_products`
```
id (uuid, pk)
slug VARCHAR(120) UNIQUE      -- "dpia", "dsr", "consent"
name VARCHAR(120)
tagline VARCHAR(255)
description TEXT
hero_image_path VARCHAR(500)
icon_name VARCHAR(60)
features JSONB                -- array of {title, description, screenshot_path}
faqs JSONB                    -- array of {q, a}
category ENUM(privacy, security, ai_governance, vendor_risk)
order_index INTEGER
is_published BOOLEAN
```

### `landing_stats`
```
id (uuid, pk)
label VARCHAR(120)            -- "Active DPOs"
value VARCHAR(40)             -- "1,200+" or "10M+"
icon_name VARCHAR(60)
order_index INTEGER
is_published BOOLEAN
```

---

## 3. Wireframe (Section by Section)

### 3.1 Landing `/` (homepage)

```
╔════════════════════════════════════════════════════════════╗
║  [Logo Nexus] Products ▼ Solutions ▼ Resources ▼ Company ▼ ║
║                                       [Login] [▶ Lihat Demo]║  ← sticky nav
╠════════════════════════════════════════════════════════════╣
║  HERO (full-width, gradient bg + hero_image_path)          ║
║  ┌───────────────────────┬──────────────────┐              ║
║  │ "UU PDP-Native ⚡"     │                  │              ║
║  │ Big serif headline    │   [Hero Image]   │              ║
║  │ Subheadline text      │                  │              ║
║  │ [Lihat Demo] [Contact]│                  │              ║
║  └───────────────────────┴──────────────────┘              ║
╠════════════════════════════════════════════════════════════╣
║  STATS BAR — "10M+ users · 1,200 DPOs · 99.9% uptime"      ║
╠════════════════════════════════════════════════════════════╣
║  SOSIAL PROOF — Customer logo cloud (8-12 logos grayscale) ║
╠════════════════════════════════════════════════════════════╣
║  PERSONA-BASED PRODUCT SHOWCASE (4 kolom)                  ║
║  ┌───────┬───────┬───────┬───────┐                         ║
║  │ DPO   │ Tech  │ Legal │ CISO  │                         ║
║  │ ROPA  │ DSPM  │ Cont. │ Vendor│                         ║
║  │ DSR   │ AI Pat│ TIA   │ Breach│                         ║
║  │ Cons. │ ...   │ ...   │ ...   │                         ║
║  └───────┴───────┴───────┴───────┘                         ║
╠════════════════════════════════════════════════════════════╣
║  HEADLINE FEATURE — large screenshot + 3 bullets           ║
║  ┌──────────────────────────────────┬───────────────────┐  ║
║  │ "AI Patrol Scheduler"            │  [screenshot]     │  ║
║  │ • Auto-scan terjadwal            │                   │  ║
║  │ • Changelog per scan             │                   │  ║
║  │ • Slack/email alert              │                   │  ║
║  │ [Pelajari →]                     │                   │  ║
║  └──────────────────────────────────┴───────────────────┘  ║
║  (3-4 headline features, alternating left/right)           ║
╠════════════════════════════════════════════════════════════╣
║  COMPARISON TEASER                                         ║
║  "Migrasi dari OneTrust/Securiti? Lihat side-by-side →"    ║
║  Compact 3-col mini compare → CTA full /compare page       ║
╠════════════════════════════════════════════════════════════╣
║  TESTIMONIAL CAROUSEL (3-card, auto-rotate)                ║
║  "Quote..." — Name, Role, Company [photo + logo]           ║
╠════════════════════════════════════════════════════════════╣
║  INTEGRATION LOGO GRID (8-12 logos: Slack, AWS, Salesforce)║
║  "Integrasi dengan tools yang sudah Anda pakai"            ║
╠════════════════════════════════════════════════════════════╣
║  PRICING TEASER (3 cards) → CTA full /pricing              ║
║  Starter | Growth ⭐ | Enterprise                          ║
╠════════════════════════════════════════════════════════════╣
║  CTA BANNER — gradient block                               ║
║  "Mulai gratis 14 hari. Tanpa kartu kredit."               ║
║  [Daftar Sekarang] [Hubungi Sales]                         ║
╠════════════════════════════════════════════════════════════╣
║  FOOTER (dark, 5-col)                                      ║
║  Logo + tagline | Product | Company | Resources | Sosial   ║
║  Copyright + UU PDP compliance badges                      ║
╚════════════════════════════════════════════════════════════╝
```

### 3.2 `/about` (Company + Team)

```
╔════════════════════════════════════════════════════════════╗
║  Nav (same)                                                ║
╠════════════════════════════════════════════════════════════╣
║  HERO MINI — "Tentang Privasimu Nexus"                     ║
║  Mission statement (3-4 lines)                             ║
╠════════════════════════════════════════════════════════════╣
║  STORY / TIMELINE — visual timeline 2024 → sekarang        ║
╠════════════════════════════════════════════════════════════╣
║  STATS — 4 stats card (Founded year, Users, Countries...)  ║
╠════════════════════════════════════════════════════════════╣
║  TEAM — "Tim di Balik Nexus"                               ║
║  Grid 4-col responsive, 12 members per page                ║
║  ┌─────┬─────┬─────┬─────┐                                 ║
║  │ Pic │ Pic │ Pic │ Pic │                                 ║
║  │Name │Name │Name │Name │                                 ║
║  │Role │Role │Role │Role │                                 ║
║  └─────┴─────┴─────┴─────┘                                 ║
║  [‹ Prev] Page 1 of 3 [Next ›]                             ║
╠════════════════════════════════════════════════════════════╣
║  VALUES (3-col card)                                       ║
║  Privacy First | Open Source | Built for Indonesia         ║
╠════════════════════════════════════════════════════════════╣
║  Footer                                                    ║
╚════════════════════════════════════════════════════════════╝
```

### 3.3 Admin `/landing-admin` (root/superadmin only)

```
╔════════════════════════════════════════════════════════════╗
║  Sidebar (dashboard layout)                                ║
╠════════════════════════════════════════════════════════════╣
║  TAB NAV: Hero | Features | Team | Testimonials | Logos    ║
║           | Pricing | Products | Stats | SEO              ║
╠════════════════════════════════════════════════════════════╣
║  Active tab content — typical:                             ║
║  ┌────────────────────────────────────────────────────┐    ║
║  │ Header dengan: [+ Tambah]  [Reorder]  [Preview ↗]  │    ║
║  │ List dengan drag-handle untuk ordering             │    ║
║  │ Tiap row: thumbnail + title + actions (edit/del)   │    ║
║  └────────────────────────────────────────────────────┘    ║
║  Form modal: text fields + image dropzone (Hero, Photo)    ║
║  + Markdown editor untuk description                       ║
║  + Toggle is_published                                     ║
╚════════════════════════════════════════════════════════════╝
```

---

## 4. Implementation Phases

### Phase 1 — Foundation (Backend + Auth)
- [ ] Migration semua tabel landing_*
- [ ] Models + factories
- [ ] `RootOrSuperadmin` middleware + register
- [ ] `PublicLandingController` (read endpoints, cached 5 min)
- [ ] 8 admin controllers (CRUD per entity)
- [ ] Reorder endpoint
- [ ] Asset upload endpoints (per resource)
- [ ] `LandingAssetService` untuk handle upload (resize image, validate mime)
- [ ] Routes di api.php
- [ ] Seeder default content (hero text, 8 feature cards, 6 team placeholder, 4 testimonials, 8 logos, 3 pricing tiers)

### Phase 2 — Public Landing (Frontend Marketing)
- [ ] `(marketing)` route group + layout (public nav + footer)
- [ ] Marketing nav component dengan mega-menu
- [ ] Marketing footer
- [ ] Landing `/` page dengan semua section dari wireframe
- [ ] `/about` page dengan team grid + pagination
- [ ] `/products` listing
- [ ] `/products/[slug]` detail page (template)
- [ ] `/solutions` page
- [ ] `/pricing` page
- [ ] `/contact` form (POST ke /api/public/contact)
- [ ] `/compare` page (render COMPETITIVE_LANDSCAPE.md sebagai HTML)
- [ ] SEO metadata per page (Next 16 metadata API)
- [ ] OG image gen (default + custom upload)

### Phase 3 — Admin Management UI
- [ ] `(dashboard)/landing-admin/` route group, gated client-side
- [ ] Hero settings form dengan image upload + live preview
- [ ] Features CRUD dengan dropzone screenshot + drag-reorder
- [ ] Team CRUD paginated (12/page) + photo upload + bio markdown
- [ ] Testimonials CRUD
- [ ] Logos CRUD (kategori filter)
- [ ] Pricing CRUD
- [ ] Products CRUD (kompleks: hero img + features json + FAQ)
- [ ] Stats CRUD
- [ ] SEO settings form
- [ ] Live preview iframe (load /landing dengan ?preview=1)

### Phase 4 — Polish & Launch
- [ ] Animasi scroll (Framer Motion atau CSS-only)
- [ ] Hover states + transitions
- [ ] Mobile responsive QA
- [ ] Lighthouse audit (target ≥90 perf, ≥95 a11y)
- [ ] OG image generation otomatis
- [ ] Sitemap.xml + robots.txt
- [ ] Analytics (Plausible / Umami self-hosted)
- [ ] Cookie banner di landing publik (eat-our-own-dogfood — pakai widget Nexus sendiri!)

---

## 5. Step-by-Step (untuk DPM-able execution)

| Step | Owner | Estimasi | Output |
|---|---|---|---|
| 1 | BE | 0.5 hari | 8 migration + models + middleware |
| 2 | BE | 0.5 hari | PublicLandingController + cache |
| 3 | BE | 1 hari | 8 admin controllers + reorder + upload |
| 4 | BE | 0.5 hari | Seeder default content |
| 5 | FE | 1 hari | Marketing layout + nav + footer + tokens |
| 6 | FE | 1 hari | Landing `/` page semua section |
| 7 | FE | 0.5 hari | About + Team paginated |
| 8 | FE | 0.5 hari | Products listing + detail template |
| 9 | FE | 0.5 hari | Pricing + Contact + Compare |
| 10 | FE | 1 hari | Admin: Hero + Features + Team CRUD |
| 11 | FE | 0.5 hari | Admin: Testimonials + Logos + Pricing CRUD |
| 12 | FE | 0.5 hari | Admin: Products + Stats + SEO |
| 13 | Both | 0.5 hari | QA + responsive + Lighthouse |

**Total: ~8.5 hari engineering** (1 developer fullstack) atau **~5 hari** kalau BE+FE paralel.

---

## 6. Permissions Matrix

| Role | Public landing read | Admin CRUD landing |
|---|---|---|
| **root** | ✓ | ✓ |
| **superadmin** | ✓ | ✓ |
| admin (tenant) | ✓ | ✗ 403 |
| dpo / maker | ✓ | ✗ 403 |
| anonymous | ✓ | ✗ 401 |

Middleware `RootOrSuperadmin`:
```php
public function handle(Request $request, Closure $next)
{
    $user = $request->user();
    if (!$user || !in_array($user->role, ['root', 'superadmin'], true)) {
        return response()->json(['error' => 'Forbidden — root/superadmin only'], 403);
    }
    return $next($request);
}
```

---

## 7. Asset / Storage

- **Public assets** (hero, features, team, testimonials, logos):
  → `storage/app/public/landing/{type}/{filename}.webp`
  → Symlinked via `php artisan storage:link` (sudah ada)
  → Served via `/storage/landing/...` (Laravel default)
- **Image processing on upload:**
  - Hero image: max 2400×1200, convert ke webp, quality 85
  - Team photo: max 600×600, square crop, webp 80
  - Logo: max 400×200, preserve transparency (png), no convert
  - Screenshot: max 1920×1080, webp 85
- Pakai `intervention/image` (sudah common di Laravel) atau spatie/image
- Reject: file >5MB, non-image mime

---

## 8. Seeder — Default Content

Path: `backend/database/seeders/LandingSeeder.php`

**Hero default:**
- eyebrow: "🇮🇩 Built for UU PDP"
- headline: "Compliance UU PDP yang akhirnya tidak rumit"
- sub: "Privacy management platform native untuk Indonesia. Multi-tenant, on-prem AI ready, white-label safe. Trusted by 1,200+ DPO."
- CTA1: "Lihat Demo" → /contact
- CTA2: "Pricing Transparan" → /pricing

**8 Feature cards default:**
1. ROPA Management (icon: Database)
2. DPIA Wizard (icon: Shield)
3. DSR Automation + Embed Widget (icon: UserCheck)
4. Consent Management 2-Layer (icon: CookieBite)
5. Cross-Border TIA Pasal 56 (icon: Globe)
6. Vendor Risk + DPA Tracking (icon: Building2)
7. Breach Response 72-jam (icon: AlertTriangle)
8. AI Patrol Data Discovery (icon: Bot)

**6 Team placeholder:** (CEO, CTO, COO, Head of Compliance, Lead Engineer, DPO Advisor)
- nama placeholder, photo_path null, bio Lorem
- root/superadmin bisa edit nanti via admin UI

**4 Testimonials placeholder:** dengan quote generic + ratings 5

**8 Logo placeholder** (kategori customer + partner mix)

**3 Pricing tiers default:**
- Starter: IDR 0/bulan (free trial 14 hari)
- Growth: IDR 4.999.000/bulan ⭐ Most Popular
- Enterprise: "Hubungi Tim" (custom quote)

**12 Stats:** Active Users, DPOs, Countries, Uptime SLA, Modules, Integrations, etc.

Seeder idempotent (cek `firstOrCreate` per row).

---

## 9. Risks & Open Questions

- **Single landing for whole platform vs per-tenant?** — Plan ini asumsi single (Privasimu's own marketing). Kalau klien enterprise mau white-label landing per-org, schema perlu org_id + scope. Diskusi dengan user dulu sebelum Phase 1.
- **Public form spam mitigation:** Contact form butuh captcha (sudah punya CaptchaVerifier service di backend, reuse).
- **CDN untuk asset publik:** Production butuh CDN di depan storage path. Out-of-scope Phase 1, tapi siapkan path yang bisa diganti via env (`LANDING_CDN_URL`).
- **Multi-language landing (id/en):** Out-of-scope Phase 1. Schema bisa pakai JSON columns nanti (`headline_i18n: {id: ..., en: ...}`). Plan v2.
- **A/B testing hero:** Nice-to-have, skip dulu.

---

## 10. Acceptance Criteria

Phase 1 dianggap selesai kalau:
1. ✅ Seeder run sekali, 8 fitur + 6 team + 4 testi + 8 logo + 3 pricing terisi
2. ✅ GET /api/public/landing/settings return hero + branding (cached 5 min)
3. ✅ Tenant admin (role=admin) get 403 saat akses /api/admin/landing/*
4. ✅ Root + superadmin bisa CRUD semua resource
5. ✅ Upload hero image valid → file saved + path persisted
6. ✅ Reorder endpoint update order_index batch (drag-drop pattern)

Phase 2 selesai kalau:
1. ✅ `/` render hero dari API + image lazy-load
2. ✅ `/about` team grid paginated 12/page, total >= 6 placeholder
3. ✅ `/products/[slug]` route dynamic resolve dari DB
4. ✅ Lighthouse mobile perf ≥80, a11y ≥90
5. ✅ Mega-menu kerja di mobile (hamburger)

Phase 3 selesai kalau:
1. ✅ Root login → sidebar muncul "Landing Admin"
2. ✅ Edit hero text → save → publik landing reflect dalam <5 detik (cache bust)
3. ✅ Upload team photo → preview + persist + tampil di /about
4. ✅ Drag reorder feature → publik landing tampil sesuai urutan
5. ✅ Toggle is_published OFF → row hilang dari publik tapi tetap di admin

---

## 11. Build Order Saran

Saran build sequence untuk minimize risiko:

1. **Migration + 1 model + 1 controller (Hero settings only)** — jadi end-to-end test path bisa: migrate → seed → API public → fetch dari frontend
2. **Marketing layout shell** — nav, footer, hero placeholder (pakai dummy data dulu)
3. **Wire Hero ke API** — pertama dummy data jadi data live
4. **Replicate pattern** untuk Features → Team → Testimonials → Logos (tinggal copy-paste structure)
5. **Admin UI** — terakhir, setelah public sudah jalan

Pendekatan vertical-slice ini lebih aman dari big-bang implementation.

---

## 12. Phase 2 Execution Plan (refined post-securiti.ai research, 2026-04-27)

### 12.1 Securiti.ai-derived design refinements

Yang kita TIRU (terbukti baik di securiti.ai):
- **Hero pattern:** big serif-ish headline + 2-line subhead + 2 CTA buttons (primary "Lihat Demo", secondary "Hubungi Tim") + SVG hero illustration kanan.
- **Mega-menu 4-kolom** di nav: Products, Solutions, Resources, Company. Tiap kolom punya sub-grid:
  - **Products** — 4 grup outcome (sesuaikan ke konteks UU PDP):
    - "Govern Data" — ROPA, DPIA, Data Discovery, Data Mapping
    - "Automate Privacy Ops" — DSR Automation, Consent Management, Breach Response
    - "Secure Data+AI" — AI Patrol, AI Governance, Vendor Risk
    - "Build Compliance" — Policy Review, Contract Review, GAP Assessment, Maturity
  - **Solutions** — 4 sub-tabs: Industries (Bank, Healthcare, Fintech, Telco, Govt) · Regulations (UU PDP, GDPR, ISO 27701, HIPAA) · Roles (DPO, Legal, CISO, Maker) · Technologies (AWS, Azure, GCP, Salesforce, Slack)
  - **Resources** — Blog, Case Studies, Compliance Library, Webinar, Education, Privacy Center
  - **Company** — About, Team, Careers, Press, Partner Program, Contact
- **Persona-based grid** 4 kolom homepage: DPO Team / Tech Team / Legal Team / CISO Team — tiap kolom 6-8 product cards dengan icon + 1-line desc.
- **IDC-style quote block** — kita pakai quote pakar/regulator atau testimonial flagship customer (1 large quote, dark-bg).
- **Award/certification logo cloud** grayscale — kita tampilkan: ISO 27001, SOC 2, UU PDP-ready, Kominfo PSE, dst.
- **Integration logo grid** 1000s feel — kita realistic 16-24 connector logos.
- **Sticky "See Demo" CTA** persisten di nav saat scroll.
- **Footer 5-kolom dark** + award badges repeat + newsletter signup.

Yang TIDAK tiru (kita beda):
- Tidak meniru "Data Command Graph" buzzword — kita pakai bahasa ID konkret ("Pusat Kontrol Privasi Anda").
- Lokal-first: copy bahasa Indonesia primary, EN toggle nanti (Phase v2).
- Team page publik (Securiti tidak punya, user kita mau).
- Comparison block teaser → /compare page → versi publik dari `COMPETITIVE_LANDSCAPE.md` (positioning vs OneTrust/Securiti/OneTrust).

### 12.2 Phase 2 Slice Breakdown (executable)

| Slice | Scope | Files Affected | Output | Estimasi |
|---|---|---|---|---|
| **2A** Foundation | Marketing route group, layout shell, design tokens, public API client wrapper | `(marketing)/layout.tsx`, `lib/landing-api.ts`, `components/marketing/{Nav,Footer,MegaMenu,StickyCta}.tsx`, `globals.css` token additions | Layout + nav mega-menu + footer + Nexus logo wired | 0.5–1 hari |
| **2B** Landing `/` | Semua section homepage dari API | `(marketing)/page.tsx`, `components/marketing/sections/{Hero,Stats,LogoCloud,PersonaGrid,FeatureSpotlight,QuoteBlock,IntegrationGrid,PricingTeaser,CtaBanner}.tsx` | Homepage live-render dari `/api/public/landing/bundle` | 1–1.5 hari |
| **2C** Inner pages (about/products/solutions) | About + team paginated, products listing, products detail dynamic, solutions tabs | `(marketing)/about/page.tsx`, `(marketing)/products/page.tsx`, `(marketing)/products/[slug]/page.tsx`, `(marketing)/solutions/page.tsx`, `components/marketing/{TeamGrid,Pagination,ProductCard,SolutionTabs}.tsx` | 4 halaman live | 1 hari |
| **2D** CTA pages + SEO | Pricing, contact form (POST `/api/public/landing/lead`), compare page, per-page metadata, OG images, sitemap.xml, robots.txt | `(marketing)/{pricing,contact,compare}/page.tsx`, `app/sitemap.ts`, `app/robots.ts`, metadata helpers | 4 halaman + SEO baseline | 0.5 hari |

**Total Phase 2:** ~3–4 hari engineering FE.

### 12.3 Step-by-step (checklist)

**Slice 2A — Foundation**
- [ ] Create `frontend/src/app/(marketing)/layout.tsx` (no-sidebar shell, Nexus logo, sticky nav, footer slot)
- [ ] `MarketingNav.tsx` dengan mega-menu hover desktop + drawer mobile
- [ ] `MarketingFooter.tsx` 5-kolom + dark theme + award logos repeat
- [ ] `MegaMenuPanel.tsx` reusable per-tab content
- [ ] `StickyDemoCta.tsx` (right-pinned floating button on scroll)
- [ ] `frontend/src/lib/landing-api.ts` — typed client untuk `/api/public/landing/*` (bundle, products, team paginated, lead POST)
- [ ] Design tokens marketing di `globals.css`: `--mkt-bg`, `--mkt-headline`, `--mkt-subtle`, `--mkt-accent`, `--mkt-cta`, font stack serif untuk headlines
- [ ] `next.config.ts` — pastikan `images.remotePatterns` allow backend storage URL untuk `/storage/landing/...`

**Slice 2B — Landing `/`**
- [ ] `Hero.tsx` — headline/subhead/CTAs dari `settings`, hero image lazy-load
- [ ] `StatsBar.tsx` — render `landing_stats` (4-6 cards)
- [ ] `LogoCloud.tsx` — grayscale grid, hover color, ambil `landing_logos` category=customer
- [ ] `PersonaGrid.tsx` — 4 kolom (DPO/Tech/Legal/CISO), bind ke `landing_features` filter section + category
- [ ] `FeatureSpotlight.tsx` — alternating left/right blocks dari `landing_features` flagship
- [ ] `QuoteBlock.tsx` — featured testimonial dark-bg
- [ ] `IntegrationGrid.tsx` — `landing_logos` category=integration
- [ ] `PricingTeaser.tsx` — 3-card teaser → CTA `/pricing`
- [ ] `CtaBanner.tsx` — gradient block sebelum footer
- [ ] Wire ke `/api/public/landing/bundle` (1 fetch ambil semua) dengan `revalidate: 60` (Next 16 ISR)
- [ ] Loading skeleton + empty-state guards

**Slice 2C — Inner pages**
- [ ] `/about` — mission hero + timeline + values + team grid 12/page + page query param
- [ ] `TeamGrid.tsx` + `Pagination.tsx` — fetch `/api/public/landing/team?page=N&per_page=12`
- [ ] `/products` — listing 4 grup outcome (mirror mega-menu)
- [ ] `/products/[slug]` — dynamic dari `landing_products`, render hero + features json + faqs json (404 kalau slug not found)
- [ ] `/solutions` — tabs Industries/Regulations/Roles/Technologies, content statik dulu (data dari plan v2)

**Slice 2D — CTA + SEO**
- [ ] `/pricing` — 3-tier dari `landing_pricing_tiers` (sudah dihilangkan dari plan asli? cek model — kalau sudah replace ke `landing_leads`, build "Hubungi Sales" page sebagai gantinya)
- [ ] `/contact` — form: nama/email/perusahaan/role/message → POST `/api/public/landing/lead` (rate-limited via `RateLimiter` di backend)
- [ ] `/compare` — render markdown `COMPETITIVE_LANDSCAPE.md` server-side jadi HTML
- [ ] Per-page `generateMetadata` dari `landing_settings` SEO + override per page
- [ ] `app/sitemap.ts` — list `/`, `/about`, `/products`, `/products/[slug]` (slugs from API), `/solutions`, `/pricing`, `/contact`, `/compare`
- [ ] `app/robots.ts`
- [ ] OG image: pakai `seo_og_image_path` dari setting; OG dynamic gen pakai `next/og` (Phase 4 polish)

### 12.4 Backend confirmations needed before FE wiring

(Verify these in Phase 1 BE artifacts; kalau missing, patch dulu sebelum Slice 2B)

- [x] `GET /api/public/landing/bundle` — single endpoint return settings + features + stats + logos + testimonials (1 trip)
- [x] `GET /api/public/landing/team?page&per_page` — paginated
- [x] `GET /api/public/landing/products` + `/products/{slug}`
- [x] `POST /api/public/landing/lead` — rate-limited (10/hr per IP), captcha verify
- [ ] Confirm caching headers `Cache-Control: public, s-maxage=300, stale-while-revalidate=600` pada response public
- [ ] Confirm CORS allow `app-privasimu.esteh.id` origin (atau public landing same-origin?)

### 12.5 Progress Tracker

| Slice | Status | Deliverable | Tested |
|---|---|---|---|
| Phase 1 — Backend foundation | ✅ DONE | 8 models, migrations, seeder, RootOrSuperadmin middleware, PublicLandingController, LandingAdminController | seeder run idempotent OK |
| Phase 2A — Marketing shell | ✅ DONE | layout, nav (mega-menu hover + mobile drawer), footer, sticky CTA, design tokens, api client, LangSwitcher | tsc clean, SSR 200 |
| Phase 2B — Landing `/` | ✅ DONE | 9 sections + animated HeroFlowSvg + Manifesto emotional block + bilingual i18n | SSR 200, copy verified |
| Phase 2C — Inner pages | ✅ DONE | /about (mission+story+values+team paginated), /products (4 outcome groups), /products/[slug] (static fallback + DB), /solutions (4 tabs) | SSR 200 each |
| Phase 2D — CTA + SEO | ✅ DONE | /contact (lead form → POST /api/public/landing/lead), /compare (3 competitor tabs + table), sitemap.ts, robots.ts. Pricing dihapus per arahan klien. | SSR 200, sitemap.xml + robots.txt valid |
| Phase 3 — Admin UI | ✅ DONE | landing-admin route group + 8 tabs (Hero/Settings, Features, Team, Testimonials, Logos, Products, Stats, Leads Inbox) + drag-reorder + image upload, gated client-side to `role in {root, superadmin}`. Generic `ResourceCrud` component handles CRUD/upload/reorder; bespoke pages for Hero (singleton form) and Team (grid + pagination). | tsc clean, prod build OK |
| Phase 4 — Polish | ✅ DONE | Scroll reveal (IntersectionObserver + prefers-reduced-motion), Cookie banner (Privasimu Consent Conductor branded) at bottom-left, edge-runtime dynamic OG image at `/opengraph-image` (1200×630). Sitemap+robots already shipped in 2D. | prod build OK |
| Cross — Partner logos seed | 🟡 in progress | 48 logos extracted dari pptx ke `backend/storage/app/public/landing/logos/partner-NN.png`. Belum update `LandingSeeder` untuk insert real names per slot. Names per logo perlu identifikasi manual atau OCR. | logos in storage, seeder pending |

### 12.7 Slice 2 result summary (2026-04-27)

**Pages live (frontend dev @ port 3002):**
- `/` — homepage (Hero animated SVG + 9 sections + emotional manifesto)
- `/about` — story + values + team grid paginated (12/page)
- `/products` — 4 outcome groups (Govern / Automate / Secure / Comply) with 14 module cards
- `/products/[slug]` — dynamic detail page with static fallback for 14 known slugs, DB override
- `/solutions` — 4 tabs (Industry / Regulation / Role / Tech Stack)
- `/contact` — lead form, server-fetched settings for office info
- `/compare` — 3 competitor tabs (OneTrust / Securiti / BigID), 8-row honest comparison
- `/sitemap.xml` + `/robots.txt`

**Cool naming live di copy:** ROPA Atlas · Risk Radar · 72-Hour Pulse · Consent Conductor · Sentinel AI · 72h Watchtower · Vendor Compass · AI Conscience · Compliance Pulse · Border Sentinel · "Privacy Mesh".

**Bilingual id/en:** semua copy via i18n (`marketing.*` namespace di id.json + en.json), LangSwitcher di nav (desktop + mobile). Backend already locale-aware via `LandingLocaleResolver` (Accept-Language).

**Animated SVG:** HeroFlowSvg (data sources → Privacy Mesh core → 4 outcomes, stroke-dashoffset loop + animateMotion pulses). Spotlight art per-row (radar sweep / risk matrix grid / 72-hour countdown arc). Product detail FlowDiagram. Honors `prefers-reduced-motion`.

**Klien instruction (2026-04-27):** harga publik dihapus dari nav + footer + plan. Semua pricing CTA redirect ke `/contact?source=enterprise`.

**Belum:**
- Phase 3 admin UI (root/superadmin manage)
- Phase 4 polish + Lighthouse
- Partner logo names (perlu manual identification of 48 logos)
- Team data (perlu seeder dengan foto + nama real — belum ada di pptx slide text)

### 12.5b Addendum 2026-04-27 — naming, animated SVG, bilingual

**Cool naming convention** (mirror securiti's "Data Command Center" feel, but Indonesia-flavored):

| Kategori | Internal name | Marketing name (id) | Marketing name (en) |
|---|---|---|---|
| Platform tagline | Privasimu Nexus | "Pusat Komando Privasi Anda" | "Your Privacy Command Center" |
| ROPA | Record of Processing Activity | "ROPA Atlas" | "ROPA Atlas" |
| DPIA | Risk assessment | "Risk Radar" | "Risk Radar" |
| DSR | Data Subject Request | "72-Hour Pulse" | "72-Hour Pulse" |
| Consent | Consent Management | "Consent Conductor" | "Consent Conductor" |
| Data Discovery | Discovery + AI Patrol | "Sentinel AI" | "Sentinel AI" |
| Breach | Breach Response | "72h Watchtower" | "72h Watchtower" |
| Vendor Risk | TPRM + TIA | "Vendor Compass" | "Vendor Compass" |
| AI Governance | LIA + Maturity | "AI Conscience" | "AI Conscience" |
| GAP | GAP Assessment | "Compliance Pulse" | "Compliance Pulse" |
| Cross-border | Pasal 56 TIA | "Border Sentinel" | "Border Sentinel" |
| Ecosystem | Whole platform feel | "Privacy Mesh" | "Privacy Mesh" |

Tagline-tagline ini muncul di hero, persona-grid card titles, mega-menu hover description.

**Animated SVG flow illustration** (dipakai di Hero + di setiap product detail):
- `HeroFlowSvg.tsx` — animated SVG: data sources → Privasimu Nexus core → 4 outcome lines (Govern / Automate / Secure / Comply). Stroke-dasharray + stroke-dashoffset animation 4-6s loop, accent gradient. Lokasi: `components/marketing/HeroFlowSvg.tsx`. Akan jadi centerpiece kanan hero.
- `FlowDiagram.tsx` — generic reusable flow component (nodes + animated edges) untuk product detail pages: input → processing → output dengan node icons.
- Pakai `motion-safe` Tailwind variant + `prefers-reduced-motion` guard.

**Bilingual (id/en)**:
- Existing `I18nProvider` (frontend/src/lib/i18n/I18nContext.tsx) sudah loaded di root layout — reuse.
- Tambah locale namespace `marketing` di `id.json` + `en.json`. Semua copy hardcoded di komponen marketing pindah ke `t('marketing.hero.headline')` dst.
- Backend sudah locale-aware via `LandingLocaleResolver::fromRequest($request)` — FE harus kirim `Accept-Language: id-ID` atau `en-US` saat fetch landing API. Update `landing-api.ts` untuk inject header dari `localStorage['app_locale']`.
- Tambah `LangSwitcher.tsx` di `MarketingNav` (toggle id ⇄ en).
- Default locale: `id`. Browser `navigator.language` detect on first visit.

**Slice ulang dengan addition:**

| Slice | Scope (updated) |
|---|---|
| 2A ✅ | Shell + nav + footer + tokens + api client + sticky CTA |
| **2B** | Hero + 9 sections + animated `HeroFlowSvg` + cool product naming via i18n keys + bilingual `t()` for all marketing copy + LangSwitcher in nav |
| 2C | About/team + Products listing/detail + Solutions tabs + reusable `FlowDiagram` for product pages |
| 2D | Pricing + Contact + Compare + SEO + sitemap + OG dynamic |

### 12.6 Asset pipeline (partner logos + team photos dari pptx)

Source: `Company Profile Update 2026 .pptx` (109 media files, 32 slides).

Plan:
1. Unzip pptx → `/tmp/compro_extract/ppt/{media,slides}` (DONE)
2. Parse `slide*.xml` cari blok dengan teks "Partner" / "Mitra" / "Team" / "Tim" — extract nama + role + image relationship id
3. Map image rId → `media/imageN.png` via `slideN.xml.rels`
4. Copy logo PNG → `backend/storage/app/public/landing/logos/{slug}.png` dan team photo → `landing/team/{slug}.webp` (resize)
5. Generate `LandingSeeder` data array (idempotent `firstOrCreate` by name) untuk logos + team
6. Hapus seed placeholder lama yang tabrakan

