<?php
/**
 * ============================================================
 * PRIVASIMU LICENSE SDK — PHP / Laravel
 * ============================================================
 * 
 * Zero-config license verification for any PHP application.
 * Works standalone or as Laravel middleware.
 * 
 * INSTALL:
 *   composer require privasimu/license-sdk
 * 
 * .ENV:
 *   PRIVASIMU_LICENSE_KEY=PRIV-XXXX-XXXX-XXXX-XXXX
 *   PRIVASIMU_LM_URL=https://license-priva.sainskerta.net
 * 
 * LARAVEL SETUP (Kernel.php):
 *   protected $middlewareGroups = [
 *       'web' => [
 *           \Privasimu\License\Middleware\VerifyLicense::class,
 *           // ... other middleware
 *       ],
 *   ];
 * 
 * PLAIN PHP:
 *   require_once 'vendor/autoload.php';
 *   $checker = new \Privasimu\License\LicenseChecker();
 *   if (!$checker->isValid()) { die('License invalid'); }
 * ============================================================
 */

namespace Privasimu\License;

class LicenseChecker
{
    private string $licenseKey;
    private string $lmUrl;
    private string $cachePath;
    private int $cacheTtl; // seconds

    /**
     * HARDCODED RSA Public Key from Privasimu License Manager.
     * This key is PUBLIC and safe to embed. It is used to verify
     * JWT signatures — preventing fake LM server attacks.
     * DO NOT CHANGE THIS unless Privasimu issues a new keypair.
     */
    private const PUBLIC_KEY_B64 = 'LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUlJQklqQU5CZ2txaGtpRzl3MEJBUUVGQUFPQ0FROEFNSUlCQ2dLQ0FRRUEwbXVncUdiVkNCQTBYZy9HclgwRgpCbHl4Y0FoVWV1YjA1KzBYdEFrdGhKQU50ajhhbks1aDlpMnVvcHg4QytFbmZua2pwTG05b1ZsZFh4V2J6aTFVCjVLWHVqU0ZsR0VFaENNNkRXVDJkRmVFZ1J1OHZteFNHSnpZZmw2MXNjcGJVbTFWNmdrOEhqMGI1M0RwQ0FkOUcKWTZKbldDWlFGRm1rY2pMZS9wRHFhTDFMVFhidlA5cVFHR09vNlhvcTltd0ttQ25ydWFlWVBibWpaSlNjTWNxQwp4ejVmMFM0RUNDejNzRTF2b3lMTFVsNmlUS0VBb09LelRzS2x6YzZON1pUdmdCZ0w4dHVOb1psMUFtRFY5cEJDClJxMW1CSDFBdFhFOElJR2hPbnRLOVF6U216M0FrRTJGOVRESmdJL1ZXTkx4U1RyVWVacnBvVDdPU3djMWVaV2sKZndJREFRQUIKLS0tLS1FTkQgUFVCTElDIEtFWS0tLS0tCg==';

    /**
     * @param array $config Optional config overrides
     *   - license_key: string (default: env PRIVASIMU_LICENSE_KEY)
     *   - lm_url: string (default: env PRIVASIMU_LM_URL)
     *   - cache_path: string (default: sys_get_temp_dir())
     *   - cache_ttl: int seconds (default: 86400 = 24 hours)
     */
    public function __construct(array $config = [])
    {
        $this->licenseKey = $config['license_key'] ?? $this->getEnv('PRIVASIMU_LICENSE_KEY', '');
        $this->lmUrl = rtrim($config['lm_url'] ?? $this->getEnv('PRIVASIMU_LM_URL', 'https://license-priva.sainskerta.net'), '/');
        $this->cachePath = $config['cache_path'] ?? sys_get_temp_dir() . '/privasimu_license_cache.json';
        $this->cacheTtl = $config['cache_ttl'] ?? 86400;
    }

    // ==========================================
    // MAIN API
    // ==========================================

    /**
     * Check if the current license is valid.
     * Uses cached result if available and fresh.
     */
    public function isValid(): bool
    {
        $cached = $this->getCachedResult();
        if ($cached !== null) {
            return $cached['valid'] === true;
        }

        return $this->verify()['valid'] ?? false;
    }

    /**
     * Get the current license info (package_type, features, expires_at, etc).
     */
    public function getLicense(): ?array
    {
        $cached = $this->getCachedResult();
        if ($cached !== null) {
            return $cached['license'] ?? null;
        }

        $result = $this->verify();
        return $result['license'] ?? null;
    }

    /**
     * Get the package type (basic, ai, ai_agent).
     */
    public function getPackageType(): string
    {
        $license = $this->getLicense();
        return $license['package_type'] ?? 'none';
    }

    /**
     * Check if a specific feature is enabled.
     */
    public function hasFeature(string $feature): bool
    {
        $license = $this->getLicense();
        if (!$license || !isset($license['features'])) return false;
        return $license['features'][$feature] ?? false;
    }

    /**
     * Force re-verify with License Manager (bypass cache).
     */
    public function verify(): array
    {
        if (empty($this->licenseKey)) {
            $result = ['valid' => false, 'message' => 'No license key configured'];
            $this->cacheResult($result);
            return $result;
        }

        try {
            $domain = $this->getCurrentDomain();
            $ip = $this->getServerIp();

            $response = $this->httpPost("{$this->lmUrl}/api/licenses/verify", [
                'license_key' => $this->licenseKey,
                'domain' => $domain,
                'ip' => $ip,
            ]);

            if ($response['http_code'] === 200 && ($response['body']['valid'] ?? false)) {
                $licenseData = $response['body']['license'] ?? [];
                $signedPayload = $licenseData['signed_payload'] ?? null;

                // CRITICAL: Verify JWT signature with hardcoded public key
                $verified = $this->verifySignedPayload($signedPayload);
                if ($verified === null) {
                    $result = [
                        'valid' => false,
                        'message' => 'License signature verification failed — possible fake server.',
                        'status' => 'signature_invalid',
                    ];
                } else {
                    // Use ONLY data from verified JWT, not from HTTP response
                    $result = [
                        'valid' => true,
                        'license' => [
                            'package_type' => $verified['package_type'] ?? 'basic',
                            'license_type' => $verified['license_type'] ?? 'saas',
                            'expires_at' => $verified['expires_at'] ?? null,
                            'features' => $verified['features'] ?? [],
                            'org_name' => $verified['org_name'] ?? null,
                            'license_key' => $verified['license_key'] ?? null,
                            'max_activations' => $verified['max_activations'] ?? 1,
                            'signature_valid' => true,
                        ],
                        'verified_at' => date('c'),
                    ];
                }
            } else {
                $result = [
                    'valid' => false,
                    'message' => $response['body']['message'] ?? 'License verification failed',
                    'status' => $response['body']['status'] ?? 'invalid',
                ];
            }
        } catch (\Exception $e) {
            // If LM unreachable, check if we have a previous valid cache (grace period)
            $oldCache = $this->getCachedResult(true); // ignore TTL
            if ($oldCache && $oldCache['valid']) {
                // Grace period: use old cache but mark as stale
                $result = $oldCache;
                $result['stale'] = true;
                $result['lm_error'] = $e->getMessage();
            } else {
                $result = [
                    'valid' => false,
                    'message' => 'Cannot reach License Manager: ' . $e->getMessage(),
                ];
            }
        }

        $this->cacheResult($result);
        return $result;
    }

    // ==========================================
    // CACHE
    // ==========================================

    private function getCachedResult(bool $ignoreExpiry = false): ?array
    {
        if (!file_exists($this->cachePath)) return null;

        $raw = @file_get_contents($this->cachePath);
        if (!$raw) return null;

        $data = json_decode($raw, true);
        if (!$data || !isset($data['cached_at'])) return null;

        if (!$ignoreExpiry) {
            $age = time() - $data['cached_at'];
            if ($age > $this->cacheTtl) return null;
        }

        return $data['result'] ?? null;
    }

    private function cacheResult(array $result): void
    {
        $payload = json_encode([
            'cached_at' => time(),
            'result' => $result,
        ], JSON_PRETTY_PRINT);

        @file_put_contents($this->cachePath, $payload, LOCK_EX);
    }

    /**
     * Clear cached verification result.
     */
    public function clearCache(): void
    {
        if (file_exists($this->cachePath)) {
            @unlink($this->cachePath);
        }
    }

    // ==========================================
    // HTTP
    // ==========================================

    private function httpPost(string $url, array $data): array
    {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode($data),
            CURLOPT_HTTPHEADER => ['Content-Type: application/json', 'Accept: application/json'],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 15,
            CURLOPT_SSL_VERIFYPEER => false, // For self-signed certs
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);

        if ($response === false) {
            throw new \RuntimeException("HTTP request failed: {$error}");
        }

        return [
            'http_code' => $httpCode,
            'body' => json_decode($response, true) ?? [],
        ];
    }

    // ==========================================
    // JWT SIGNATURE VERIFICATION (RS256)
    // ==========================================

    /**
     * Verify RS256 JWT signed_payload using HARDCODED public key.
     * Returns decoded payload if valid, null if tampered/invalid.
     * This prevents fake LM server attacks.
     */
    private function verifySignedPayload(?string $jwt): ?array
    {
        if (!$jwt) return null;

        $parts = explode('.', $jwt);
        if (count($parts) !== 3) return null;

        try {
            $payloadStr = base64_decode(strtr($parts[1], '-_', '+/'));
            $signature = base64_decode(strtr($parts[2], '-_', '+/'));

            // Decode hardcoded public key
            $pem = base64_decode(self::PUBLIC_KEY_B64);

            // RS256: verify signature over "header.payload"
            $dataToSign = $parts[0] . '.' . $parts[1];
            $valid = openssl_verify($dataToSign, $signature, $pem, OPENSSL_ALGO_SHA256);

            if ($valid === 1) {
                $payloadData = json_decode($payloadStr, true);
                // LM nests actual data under 'payload' key
                if ($payloadData && isset($payloadData['payload'])) {
                    return $payloadData['payload'];
                }
                return $payloadData;
            }

            return null;
        } catch (\Exception $e) {
            return null;
        }
    }

    // ==========================================
    // HELPERS
    // ==========================================

    private function getCurrentDomain(): string
    {
        return $_SERVER['HTTP_HOST'] ?? $_SERVER['SERVER_NAME'] ?? php_uname('n');
    }

    private function getServerIp(): string
    {
        return $_SERVER['SERVER_ADDR'] ?? gethostbyname(gethostname());
    }

    private function getEnv(string $key, string $default = ''): string
    {
        // Support Laravel's env(), plain getenv(), and $_ENV
        if (function_exists('env')) return env($key, $default);
        return getenv($key) ?: ($_ENV[$key] ?? $default);
    }
}
