/**
 * ============================================================
 * PRIVASIMU LICENSE SDK — Node.js
 * ============================================================
 * 
 * Universal license verification for Node.js apps.
 * Works with Express, Next.js, NestJS, Fastify, Koa, etc.
 * 
 * INSTALL:
 *   npm install @privasimu/license-sdk
 * 
 * .ENV:
 *   PRIVASIMU_LICENSE_KEY=PRIV-XXXX-XXXX-XXXX-XXXX
 *   PRIVASIMU_LM_URL=https://license-priva.sainskerta.net
 * ============================================================
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

/**
 * HARDCODED RSA Public Key from Privasimu License Manager.
 * This key is PUBLIC and safe to embed.
 * DO NOT CHANGE unless Privasimu issues a new keypair.
 */
const PUBLIC_KEY_B64 = 'LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUlJQklqQU5CZ2txaGtpRzl3MEJBUUVGQUFPQ0FROEFNSUlCQ2dLQ0FRRUEwbXVncUdiVkNCQTBYZy9HclgwRgpCbHl4Y0FoVWV1YjA1KzBYdEFrdGhKQU50ajhhbks1aDlpMnVvcHg4QytFbmZua2pwTG05b1ZsZFh4V2J6aTFVCjVLWHVqU0ZsR0VFaENNNkRXVDJkRmVFZ1J1OHZteFNHSnpZZmw2MXNjcGJVbTFWNmdrOEhqMGI1M0RwQ0FkOUcKWTZKbldDWlFGRm1rY2pMZS9wRHFhTDFMVFhidlA5cVFHR09vNlhvcTltd0ttQ25ydWFlWVBibWpaSlNjTWNxQwp4ejVmMFM0RUNDejNzRTF2b3lMTFVsNmlUS0VBb09LelRzS2x6YzZON1pUdmdCZ0w4dHVOb1psMUFtRFY5cEJDClJxMW1CSDFBdFhFOElJR2hPbnRLOVF6U216M0FrRTJGOVRESmdJL1ZXTkx4U1RyVWVacnBvVDdPU3djMWVaV2sKZndJREFRQUIKLS0tLS1FTkQgUFVCTElDIEtFWS0tLS0tCg==';

class PrivasimuLicense {
  /**
   * @param {Object} config
   * @param {string} config.licenseKey - License key (default: env PRIVASIMU_LICENSE_KEY)
   * @param {string} config.lmUrl - License Manager URL (default: env PRIVASIMU_LM_URL)
   * @param {string} config.cachePath - Path to cache file (default: tmp dir)
   * @param {number} config.cacheTtl - Cache TTL in seconds (default: 86400 = 24h)
   * @param {string[]} config.excludePaths - Paths to skip license check
   */
  constructor(config = {}) {
    this.licenseKey = config.licenseKey || process.env.PRIVASIMU_LICENSE_KEY || '';
    this.lmUrl = (config.lmUrl || process.env.PRIVASIMU_LM_URL || 'https://license-priva.sainskerta.net').replace(/\/$/, '');
    this.cachePath = config.cachePath || path.join(os.tmpdir(), 'privasimu_license_cache.json');
    this.cacheTtl = config.cacheTtl || 86400;
    this.excludePaths = config.excludePaths || ['/api/health', '/api/ping', '/health'];
    this._cache = null;
    this._cacheLoadedAt = 0;
  }

  // ==========================================
  // MAIN API
  // ==========================================

  /**
   * Check if license is valid (uses cache if fresh).
   * @returns {Promise<boolean>}
   */
  async isValid() {
    const cached = this._getCachedResult();
    if (cached !== null) return cached.valid === true;
    const result = await this.verify();
    return result.valid === true;
  }

  /**
   * Get license info object.
   * @returns {Promise<Object|null>}
   */
  async getLicense() {
    const cached = this._getCachedResult();
    if (cached !== null) return cached.license || null;
    const result = await this.verify();
    return result.license || null;
  }

  /**
   * Get package type string.
   * @returns {Promise<string>}
   */
  async getPackageType() {
    const license = await this.getLicense();
    return license?.package_type || 'none';
  }

  /**
   * Check if a specific feature is enabled.
   * @param {string} feature
   * @returns {Promise<boolean>}
   */
  async hasFeature(feature) {
    const license = await this.getLicense();
    if (!license?.features) return false;
    return license.features[feature] === true;
  }

  /**
   * Force verify with License Manager (bypass cache).
   * @returns {Promise<Object>}
   */
  async verify() {
    if (!this.licenseKey) {
      const result = { valid: false, message: 'No license key configured' };
      this._cacheResult(result);
      return result;
    }

    try {
      const domain = os.hostname();
      const response = await fetch(`${this.lmUrl}/api/licenses/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          license_key: this.licenseKey,
          domain: domain,
          ip: '0.0.0.0', // Server IP detected by LM
        }),
        signal: AbortSignal.timeout(15000),
      });

      const data = await response.json();

      if (response.ok && data.valid) {
        const licenseData = data.license || {};
        const signedPayload = licenseData.signed_payload;

        // CRITICAL: Verify JWT signature with hardcoded public key
        const verified = this._verifySignedPayload(signedPayload);
        if (!verified) {
          const result = { valid: false, message: 'License signature verification failed — possible fake server.', status: 'signature_invalid' };
          this._cacheResult(result);
          return result;
        }

        // Use ONLY data from verified JWT
        const result = {
          valid: true,
          license: {
            package_type: verified.package_type || 'basic',
            license_type: verified.license_type || 'saas',
            expires_at: verified.expires_at || null,
            features: verified.features || {},
            org_name: verified.org_name || null,
            license_key: verified.license_key || null,
            max_activations: verified.max_activations || 1,
            signature_valid: true,
          },
          verified_at: new Date().toISOString(),
        };
        this._cacheResult(result);
        return result;
      }

      const result = {
        valid: false,
        message: data.message || 'License verification failed',
        status: data.status || 'invalid',
      };
      this._cacheResult(result);
      return result;

    } catch (err) {
      // Grace period: use old cache if LM unreachable
      const oldCache = this._getCachedResult(true);
      if (oldCache?.valid) {
        return { ...oldCache, stale: true, lm_error: err.message };
      }

      const result = {
        valid: false,
        message: `Cannot reach License Manager: ${err.message}`,
      };
      this._cacheResult(result);
      return result;
    }
  }

  /**
   * Clear cached result.
   */
  clearCache() {
    this._cache = null;
    this._cacheLoadedAt = 0;
    try { fs.unlinkSync(this.cachePath); } catch {}
  }

  // ==========================================
  // MIDDLEWARE FACTORIES
  // ==========================================

  /**
   * Express/Connect middleware.
   * 
   * Usage:
   *   const { PrivasimuLicense } = require('@privasimu/license-sdk');
   *   const license = new PrivasimuLicense();
   *   app.use(license.expressMiddleware());
   * 
   * @param {Object} options
   * @param {Function} options.onLocked - Custom handler when locked (req, res, licenseInfo)
   * @returns {Function} Express middleware
   */
  expressMiddleware(options = {}) {
    return async (req, res, next) => {
      // Skip excluded paths
      const urlPath = req.path || req.url;
      if (this.excludePaths.some(p => urlPath.startsWith(p))) return next();

      if (!(await this.isValid())) {
        if (options.onLocked) return options.onLocked(req, res, await this.getLicense());

        const accept = req.headers['accept'] || '';
        if (accept.includes('application/json') || urlPath.startsWith('/api')) {
          return res.status(403).json({
            error: 'LICENSE_INVALID',
            message: 'Aplikasi ini memerlukan license aktif dari Privasimu.',
            action: 'Hubungi administrator atau kunjungi https://license-priva.sainskerta.net',
          });
        }
        return res.status(403).send(LOCK_PAGE_HTML);
      }

      // Inject license info
      req.privasimuLicense = await this.getLicense();
      req.privasimuPackage = await this.getPackageType();
      next();
    };
  }

  /**
   * Next.js middleware helper.
   * 
   * Usage in middleware.ts:
   *   import { privasimuMiddleware } from '@privasimu/license-sdk';
   *   export default privasimuMiddleware();
   * 
   * Or in API route:
   *   import { withLicense } from '@privasimu/license-sdk';
   *   export default withLicense(async (req, res) => { ... });
   * 
   * @returns {Function}
   */
  nextjsMiddleware() {
    return async (req, res) => {
      if (!(await this.isValid())) {
        return res.status(403).json({
          error: 'LICENSE_INVALID',
          message: 'License tidak valid.',
        });
      }
      return null; // Continue
    };
  }

  /**
   * Next.js API route wrapper (HOF).
   * @param {Function} handler - The actual API handler
   * @returns {Function}
   */
  withLicense(handler) {
    return async (req, res) => {
      if (!(await this.isValid())) {
        return res.status(403).json({
          error: 'LICENSE_INVALID',
          message: 'Aplikasi ini memerlukan license aktif dari Privasimu.',
        });
      }
      req.privasimuLicense = await this.getLicense();
      return handler(req, res);
    };
  }

  // ==========================================
  // CACHE (file-based)
  // ==========================================

  _getCachedResult(ignoreExpiry = false) {
    // In-memory first
    if (this._cache && !ignoreExpiry) {
      const age = (Date.now() - this._cacheLoadedAt) / 1000;
      if (age < this.cacheTtl) return this._cache;
    }

    // File cache
    try {
      const raw = fs.readFileSync(this.cachePath, 'utf-8');
      const data = JSON.parse(raw);
      if (!data?.cached_at) return null;

      if (!ignoreExpiry) {
        const age = Math.floor(Date.now() / 1000) - data.cached_at;
        if (age > this.cacheTtl) return null;
      }

      this._cache = data.result;
      this._cacheLoadedAt = Date.now();
      return data.result;
    } catch {
      return null;
    }
  }

  _cacheResult(result) {
    this._cache = result;
    this._cacheLoadedAt = Date.now();
    const payload = JSON.stringify({
      cached_at: Math.floor(Date.now() / 1000),
      result,
    }, null, 2);
    try { fs.writeFileSync(this.cachePath, payload); } catch {}
  }

  // ==========================================
  // JWT SIGNATURE VERIFICATION (RS256)
  // ==========================================

  /**
   * Verify RS256 JWT using HARDCODED public key.
   * Returns decoded payload if valid, null if tampered.
   */
  _verifySignedPayload(jwt) {
    if (!jwt) return null;
    const parts = jwt.split('.');
    if (parts.length !== 3) return null;

    try {
      const pem = Buffer.from(PUBLIC_KEY_B64, 'base64').toString('utf8');
      const dataToVerify = parts[0] + '.' + parts[1];
      const signature = Buffer.from(parts[2].replace(/-/g, '+').replace(/_/g, '/'), 'base64');

      const verifier = crypto.createVerify('RSA-SHA256');
      verifier.update(dataToVerify);
      const isValid = verifier.verify(pem, signature);

      if (isValid) {
        const payloadStr = Buffer.from(parts[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString();
        const payloadData = JSON.parse(payloadStr);
        return payloadData?.payload || payloadData;
      }
      return null;
    } catch {
      return null;
    }
  }
}

// ==========================================
// LOCK PAGE HTML
// ==========================================
const LOCK_PAGE_HTML = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>License Required — Privasimu</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,'Segoe UI',Roboto,sans-serif;background:#0f0a1e;color:#e2e8f0;display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center}
.c{max-width:480px;padding:40px}.lock{font-size:64px;margin-bottom:24px}
h1{font-size:28px;font-weight:800;margin-bottom:12px}
p{font-size:15px;color:#94a3b8;line-height:1.6;margin-bottom:24px}
a{display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px}
a:hover{opacity:.9}
.b{display:inline-block;padding:4px 12px;background:rgba(239,68,68,.15);color:#f87171;border-radius:999px;font-size:11px;font-weight:700;margin-bottom:16px}
</style>
</head>
<body><div class="c">
<div class="lock">🔒</div>
<span class="b">LICENSE REQUIRED</span>
<h1>Aplikasi Terkunci</h1>
<p>Aplikasi ini memerlukan license aktif dari Privasimu™. Hubungi administrator atau dapatkan license key.</p>
<a href="https://license-priva.sainskerta.net" target="_blank">Dapatkan License →</a>
</div></body></html>`;

// ==========================================
// CONVENIENCE EXPORTS
// ==========================================

/**
 * Quick Express middleware (zero-config).
 * Usage: app.use(require('@privasimu/license-sdk').middleware());
 */
function middleware(config = {}) {
  const checker = new PrivasimuLicense(config);
  return checker.expressMiddleware();
}

/**
 * Quick Next.js API wrapper.
 * Usage: export default withLicense(handler);
 */
function withLicense(handler, config = {}) {
  const checker = new PrivasimuLicense(config);
  return checker.withLicense(handler);
}

module.exports = { PrivasimuLicense, middleware, withLicense, LOCK_PAGE_HTML };
module.exports.default = PrivasimuLicense;
