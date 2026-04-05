<?php
/**
 * Laravel Middleware — Blocks all requests if license is invalid.
 * 
 * Register in app/Http/Kernel.php:
 * 
 *   protected $middleware = [
 *       \Privasimu\License\Middleware\VerifyLicense::class,
 *       // ... 
 *   ];
 * 
 * Or per-route:
 *   Route::middleware('privasimu.license')->group(function () { ... });
 */

namespace Privasimu\License\Middleware;

use Closure;
use Privasimu\License\LicenseChecker;

class VerifyLicense
{
    private LicenseChecker $checker;

    /**
     * @param array $excludePaths Paths to exclude from license check (e.g., health check endpoints)
     */
    private array $excludePaths = [
        'api/health',
        'api/ping',
        'api/license/status',
    ];

    public function __construct()
    {
        $this->checker = new LicenseChecker();
    }

    public function handle($request, Closure $next)
    {
        // Skip excluded paths
        $path = $request->path();
        foreach ($this->excludePaths as $excluded) {
            if (str_starts_with($path, $excluded)) {
                return $next($request);
            }
        }

        if (!$this->checker->isValid()) {
            $license = $this->checker->getLicense();

            // JSON API response
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json([
                    'error' => 'LICENSE_INVALID',
                    'message' => 'Aplikasi ini memerlukan license aktif dari Privasimu.',
                    'license_status' => $license['status'] ?? 'none',
                    'action' => 'Hubungi administrator atau kunjungi https://license-priva.sainskerta.net',
                ], 403);
            }

            // Web response — show a lock page
            return response($this->getLockPageHtml(), 403);
        }

        // Inject license info into request for downstream use
        $request->attributes->set('privasimu_license', $this->checker->getLicense());
        $request->attributes->set('privasimu_package', $this->checker->getPackageType());

        return $next($request);
    }

    /**
     * Get the HTML for the license lock page.
     */
    private function getLockPageHtml(): string
    {
        return <<<'HTML'
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>License Required — Privasimu</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, 'Segoe UI', Roboto, sans-serif;
            background: #0f0a1e;
            color: #e2e8f0;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            text-align: center;
        }
        .container { max-width: 480px; padding: 40px; }
        .lock { font-size: 64px; margin-bottom: 24px; }
        h1 { font-size: 28px; font-weight: 800; margin-bottom: 12px; }
        p { font-size: 15px; color: #94a3b8; line-height: 1.6; margin-bottom: 24px; }
        a {
            display: inline-block;
            padding: 12px 28px;
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            color: #fff;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 14px;
        }
        a:hover { opacity: 0.9; }
        .badge {
            display: inline-block;
            padding: 4px 12px;
            background: rgba(239, 68, 68, 0.15);
            color: #f87171;
            border-radius: 999px;
            font-size: 11px;
            font-weight: 700;
            margin-bottom: 16px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="lock">🔒</div>
        <span class="badge">LICENSE REQUIRED</span>
        <h1>Aplikasi Terkunci</h1>
        <p>Aplikasi ini memerlukan license aktif dari Privasimu™ untuk dapat digunakan. Silakan hubungi administrator atau dapatkan license key Anda.</p>
        <a href="https://license-priva.sainskerta.net" target="_blank">Dapatkan License →</a>
    </div>
</body>
</html>
HTML;
    }
}
