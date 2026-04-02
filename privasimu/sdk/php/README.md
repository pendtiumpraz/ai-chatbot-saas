# 📦 Privasimu License SDK — PHP / Laravel

## Cara Publish ke Packagist (Composer)

### 1. Buat Repository GitHub
```bash
# Buat repo baru di GitHub: privasimu/license-sdk-php
cd sdk/php
git init
git remote add origin https://github.com/privasimu/license-sdk-php.git
git add -A
git commit -m "v1.0.0 — Privasimu License SDK for PHP/Laravel"
git tag v1.0.0
git push origin main --tags
```

### 2. Daftarkan di Packagist
1. Buka [packagist.org](https://packagist.org)
2. Login / Register
3. Klik **Submit** → paste URL repo: `https://github.com/privasimu/license-sdk-php`
4. Packagist akan membaca `composer.json` otomatis
5. Setup **GitHub Webhook** agar auto-update saat push (Packagist kasih URL webhook)

### 3. Setup Auto-Update (opsional)
- Di GitHub repo → Settings → Webhooks → Add webhook
- Paste URL dari Packagist
- Content type: `application/json`
- Setiap push tag baru, Packagist otomatis update

---

## Cara Pasang di Aplikasi

### Laravel (Recommended)

#### Step 1: Install
```bash
composer require privasimu/license-sdk
```

#### Step 2: Tambah `.env`
```env
PRIVASIMU_LICENSE_KEY=PRIV-XXXX-XXXX-XXXX-XXXX
PRIVASIMU_LM_URL=https://license-priva.sainskerta.net
```

#### Step 3: Register Middleware

**Opsi A — Global (semua route terlindungi):**
```php
// app/Http/Kernel.php
protected $middleware = [
    \Privasimu\License\Middleware\VerifyLicense::class, // ← tambah ini
    // ... middleware lainnya
];
```

**Opsi B — Per group route:**
```php
// app/Http/Kernel.php
protected $middlewareGroups = [
    'web' => [
        \Privasimu\License\Middleware\VerifyLicense::class,
        // ...
    ],
    'api' => [
        \Privasimu\License\Middleware\VerifyLicense::class,
        // ...
    ],
];
```

**Opsi C — Per route spesifik:**
```php
// routes/web.php
Route::middleware('privasimu.license')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
});
```

#### Step 4: Publish Config (opsional)
```bash
php artisan vendor:publish --tag=privasimu-config
```
Ini akan membuat `config/privasimu.php` yang bisa kamu customize.

#### Step 5: Test
```bash
# Cek status license
php artisan privasimu:status

# Force verify ke License Manager
php artisan privasimu:verify --force
```

#### Step 6: Gunakan di Controller (opsional)
```php
use Privasimu\License\LicenseChecker;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $license = app(LicenseChecker::class);
        
        return view('dashboard', [
            'package' => $license->getPackageType(),     // 'basic', 'ai', 'ai_agent'
            'hasAI' => $license->hasFeature('ai_assistant'),
        ]);
    }
}
```

### Plain PHP (tanpa Laravel)

```php
require_once 'vendor/autoload.php';

$checker = new \Privasimu\License\LicenseChecker([
    'license_key' => 'PRIV-XXXX-XXXX-XXXX-XXXX',
    'lm_url' => 'https://license-priva.sainskerta.net',
]);

if (!$checker->isValid()) {
    http_response_code(403);
    die('License tidak valid. Hubungi administrator.');
}

echo "App berjalan dengan paket: " . $checker->getPackageType();
```

---

## Catatan
- Laravel **auto-discover** — ServiceProvider otomatis terdeteksi, tidak perlu manual register
- Middleware alias `privasimu.license` otomatis terdaftar
- Cache disimpan di `storage/framework/cache/privasimu_license.json`
- Re-verify otomatis setiap 24 jam
