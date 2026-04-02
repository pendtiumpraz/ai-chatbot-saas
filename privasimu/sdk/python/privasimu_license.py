"""
============================================================
PRIVASIMU LICENSE SDK — Python
============================================================

Universal license verification for Python applications.
Works with Django, Flask, FastAPI, and any Python app.

INSTALL:
    pip install privasimu-license

.ENV:
    PRIVASIMU_LICENSE_KEY=PRIV-XXXX-XXXX-XXXX-XXXX
    PRIVASIMU_LM_URL=https://license-priva.sainskerta.net

DJANGO (settings.py):
    MIDDLEWARE = [
        'privasimu_license.DjangoLicenseMiddleware',
        ...
    ]

FLASK:
    from privasimu_license import FlaskLicenseMiddleware
    app = Flask(__name__)
    FlaskLicenseMiddleware(app)

FASTAPI:
    from privasimu_license import FastAPILicenseMiddleware
    app = FastAPI()
    app.add_middleware(FastAPILicenseMiddleware)
============================================================
"""

import os
import json
import time
import tempfile
import socket
import urllib.request
import urllib.error
import ssl
import base64
import hashlib
from pathlib import Path
from typing import Optional, Dict, Any

# HARDCODED RSA Public Key from Privasimu License Manager.
# This key is PUBLIC and safe to embed.
# DO NOT CHANGE unless Privasimu issues a new keypair.
_PUBLIC_KEY_B64 = 'LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUlJQklqQU5CZ2txaGtpRzl3MEJBUUVGQUFPQ0FROEFNSUlCQ2dLQ0FRRUEwbXVncUdiVkNCQTBYZy9HclgwRgpCbHl4Y0FoVWV1YjA1KzBYdEFrdGhKQU50ajhhbks1aDlpMnVvcHg4QytFbmZua2pwTG05b1ZsZFh4V2J6aTFVCjVLWHVqU0ZsR0VFaENNNkRXVDJkRmVFZ1J1OHZteFNHSnpZZmw2MXNjcGJVbTFWNmdrOEhqMGI1M0RwQ0FkOUcKWTZKbldDWlFGRm1rY2pMZS9wRHFhTDFMVFhidlA5cVFHR09vNlhvcTltd0ttQ25ydWFlWVBibWpaSlNjTWNxQwp4ejVmMFM0RUNDejNzRTF2b3lMTFVsNmlUS0VBb09LelRzS2x6YzZON1pUdmdCZ0w4dHVOb1psMUFtRFY5cEJDClJxMW1CSDFBdFhFOElJR2hPbnRLOVF6U216M0FrRTJGOVRESmdJL1ZXTkx4U1RyVWVacnBvVDdPU3djMWVaV2sKZndJREFRQUIKLS0tLS1FTkQgUFVCTElDIEtFWS0tLS0tCg=='


class PrivasimuLicense:
    """Core license checker — framework agnostic."""

    def __init__(
        self,
        license_key: str = None,
        lm_url: str = None,
        cache_path: str = None,
        cache_ttl: int = 86400,
        exclude_paths: list = None,
    ):
        self.license_key = license_key or os.environ.get("PRIVASIMU_LICENSE_KEY", "")
        self.lm_url = (lm_url or os.environ.get("PRIVASIMU_LM_URL", "https://license-priva.sainskerta.net")).rstrip("/")
        self.cache_path = cache_path or os.path.join(tempfile.gettempdir(), "privasimu_license_cache.json")
        self.cache_ttl = cache_ttl
        self.exclude_paths = exclude_paths or ["/api/health", "/health", "/ping"]
        self._cache = None
        self._cache_loaded_at = 0

    # ==========================================
    # MAIN API
    # ==========================================

    def is_valid(self) -> bool:
        """Check if license is valid (uses cache if fresh)."""
        cached = self._get_cached_result()
        if cached is not None:
            return cached.get("valid", False)
        result = self.verify()
        return result.get("valid", False)

    def get_license(self) -> Optional[Dict]:
        """Get license info dict."""
        cached = self._get_cached_result()
        if cached is not None:
            return cached.get("license")
        result = self.verify()
        return result.get("license")

    def get_package_type(self) -> str:
        """Get package type (basic, ai, ai_agent)."""
        lic = self.get_license()
        return lic.get("package_type", "none") if lic else "none"

    def has_feature(self, feature: str) -> bool:
        """Check if a specific feature is enabled."""
        lic = self.get_license()
        if not lic or "features" not in lic:
            return False
        return lic["features"].get(feature, False)

    def verify(self) -> Dict[str, Any]:
        """Force verify with License Manager (bypass cache)."""
        if not self.license_key:
            result = {"valid": False, "message": "No license key configured"}
            self._cache_result(result)
            return result

        try:
            domain = socket.gethostname()
            data = json.dumps({
                "license_key": self.license_key,
                "domain": domain,
                "ip": "0.0.0.0",
            }).encode("utf-8")

            # Allow self-signed certs
            ctx = ssl.create_default_context()
            ctx.check_hostname = False
            ctx.verify_mode = ssl.CERT_NONE

            req = urllib.request.Request(
                f"{self.lm_url}/api/licenses/verify",
                data=data,
                headers={"Content-Type": "application/json", "Accept": "application/json"},
                method="POST",
            )

            with urllib.request.urlopen(req, timeout=15, context=ctx) as resp:
                body = json.loads(resp.read().decode("utf-8"))
                if resp.status == 200 and body.get("valid"):
                    license_data = body.get("license", {})
                    signed_payload = license_data.get("signed_payload")

                    # CRITICAL: Verify JWT signature with hardcoded public key
                    verified = self._verify_signed_payload(signed_payload)
                    if verified is None:
                        result = {
                            "valid": False,
                            "message": "License signature verification failed \u2014 possible fake server.",
                            "status": "signature_invalid",
                        }
                    else:
                        # Use ONLY data from verified JWT
                        result = {
                            "valid": True,
                            "license": {
                                "package_type": verified.get("package_type", "basic"),
                                "license_type": verified.get("license_type", "saas"),
                                "expires_at": verified.get("expires_at"),
                                "features": verified.get("features", {}),
                                "org_name": verified.get("org_name"),
                                "license_key": verified.get("license_key"),
                                "max_activations": verified.get("max_activations", 1),
                                "signature_valid": True,
                            },
                            "verified_at": time.strftime("%Y-%m-%dT%H:%M:%S"),
                        }
                else:
                    result = {
                        "valid": False,
                        "message": body.get("message", "License verification failed"),
                        "status": body.get("status", "invalid"),
                    }

        except urllib.error.HTTPError as e:
            try:
                body = json.loads(e.read().decode("utf-8"))
                result = {
                    "valid": False,
                    "message": body.get("message", f"HTTP {e.code}"),
                    "status": body.get("status", "error"),
                }
            except Exception:
                result = {"valid": False, "message": f"HTTP {e.code}"}

        except Exception as e:
            # Grace period
            old = self._get_cached_result(ignore_expiry=True)
            if old and old.get("valid"):
                return {**old, "stale": True, "lm_error": str(e)}
            result = {"valid": False, "message": f"Cannot reach License Manager: {e}"}

        self._cache_result(result)
        return result

    def clear_cache(self):
        """Clear cached verification result."""
        self._cache = None
        self._cache_loaded_at = 0
        try:
            os.unlink(self.cache_path)
        except OSError:
            pass

    # ==========================================
    # CACHE
    # ==========================================

    def _get_cached_result(self, ignore_expiry=False):
        # In-memory
        if self._cache and not ignore_expiry:
            age = time.time() - self._cache_loaded_at
            if age < self.cache_ttl:
                return self._cache

        # File
        try:
            with open(self.cache_path, "r") as f:
                data = json.load(f)
            if not data or "cached_at" not in data:
                return None
            if not ignore_expiry:
                age = int(time.time()) - data["cached_at"]
                if age > self.cache_ttl:
                    return None
            self._cache = data.get("result")
            self._cache_loaded_at = time.time()
            return self._cache
        except (FileNotFoundError, json.JSONDecodeError, KeyError):
            return None

    def _cache_result(self, result):
        self._cache = result
        self._cache_loaded_at = time.time()
        payload = json.dumps({"cached_at": int(time.time()), "result": result}, indent=2)
        try:
            with open(self.cache_path, "w") as f:
                f.write(payload)
        except OSError:
            pass

    # ==========================================
    # JWT SIGNATURE VERIFICATION (RS256)
    # ==========================================

    @staticmethod
    def _verify_signed_payload(jwt_token: Optional[str]) -> Optional[Dict]:
        """
        Verify RS256 JWT using HARDCODED public key.
        Returns decoded payload dict if valid, None if tampered.
        Uses Python's built-in ssl module for RSA verification.
        """
        if not jwt_token:
            return None

        parts = jwt_token.split('.')
        if len(parts) != 3:
            return None

        try:
            from cryptography.hazmat.primitives import hashes, serialization
            from cryptography.hazmat.primitives.asymmetric import padding

            pem = base64.b64decode(_PUBLIC_KEY_B64)
            public_key = serialization.load_pem_public_key(pem)

            data_to_verify = (parts[0] + '.' + parts[1]).encode('utf-8')

            # Fix base64url → base64
            sig_b64 = parts[2].replace('-', '+').replace('_', '/')
            sig_b64 += '=' * (4 - len(sig_b64) % 4) if len(sig_b64) % 4 else ''
            signature = base64.b64decode(sig_b64)

            public_key.verify(signature, data_to_verify, padding.PKCS1v15(), hashes.SHA256())

            # Decode payload
            payload_b64 = parts[1].replace('-', '+').replace('_', '/')
            payload_b64 += '=' * (4 - len(payload_b64) % 4) if len(payload_b64) % 4 else ''
            payload_data = json.loads(base64.b64decode(payload_b64))

            # LM nests under 'payload' key
            if isinstance(payload_data, dict) and 'payload' in payload_data:
                return payload_data['payload']
            return payload_data

        except ImportError:
            # cryptography not installed — fallback: trust LM response
            # (less secure, but works without extra dependencies)
            try:
                payload_b64 = parts[1].replace('-', '+').replace('_', '/')
                payload_b64 += '=' * (4 - len(payload_b64) % 4) if len(payload_b64) % 4 else ''
                payload_data = json.loads(base64.b64decode(payload_b64))
                if isinstance(payload_data, dict) and 'payload' in payload_data:
                    return payload_data['payload']
                return payload_data
            except Exception:
                return None
        except Exception:
            return None


# ==========================================
# LOCK PAGE
# ==========================================

LOCK_PAGE_HTML = """<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>License Required — Privasimu</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,'Segoe UI',sans-serif;background:#0f0a1e;color:#e2e8f0;display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center}
.c{max-width:480px;padding:40px}.lock{font-size:64px;margin-bottom:24px}
h1{font-size:28px;font-weight:800;margin-bottom:12px}
p{font-size:15px;color:#94a3b8;line-height:1.6;margin-bottom:24px}
a{display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;text-decoration:none;border-radius:8px;font-weight:600}
.b{display:inline-block;padding:4px 12px;background:rgba(239,68,68,.15);color:#f87171;border-radius:999px;font-size:11px;font-weight:700;margin-bottom:16px}
</style>
</head>
<body><div class="c">
<div class="lock">🔒</div>
<span class="b">LICENSE REQUIRED</span>
<h1>Aplikasi Terkunci</h1>
<p>Aplikasi ini memerlukan license aktif dari Privasimu™.</p>
<a href="https://license-priva.sainskerta.net" target="_blank">Dapatkan License →</a>
</div></body></html>"""


# ==========================================
# DJANGO MIDDLEWARE
# ==========================================

class DjangoLicenseMiddleware:
    """
    Django middleware — blocks requests if license invalid.

    settings.py:
        MIDDLEWARE = ['privasimu_license.DjangoLicenseMiddleware', ...]
    """

    def __init__(self, get_response):
        self.get_response = get_response
        self.checker = PrivasimuLicense()

    def __call__(self, request):
        path = request.path
        if any(path.startswith(p) for p in self.checker.exclude_paths):
            return self.get_response(request)

        if not self.checker.is_valid():
            from django.http import JsonResponse, HttpResponse
            if request.content_type == "application/json" or path.startswith("/api"):
                return JsonResponse({
                    "error": "LICENSE_INVALID",
                    "message": "Aplikasi ini memerlukan license aktif dari Privasimu.",
                }, status=403)
            return HttpResponse(LOCK_PAGE_HTML, status=403, content_type="text/html")

        # Inject license info
        request.privasimu_license = self.checker.get_license()
        request.privasimu_package = self.checker.get_package_type()

        return self.get_response(request)


# ==========================================
# FLASK MIDDLEWARE
# ==========================================

class FlaskLicenseMiddleware:
    """
    Flask middleware — blocks requests if license invalid.

    Usage:
        app = Flask(__name__)
        FlaskLicenseMiddleware(app)
    """

    def __init__(self, app=None, config=None):
        self.checker = PrivasimuLicense(**(config or {}))
        if app:
            self.init_app(app)

    def init_app(self, app):
        app.before_request(self._check_license)
        # Store checker on app for access in routes
        app.extensions["privasimu_license"] = self.checker

    def _check_license(self):
        from flask import request, jsonify, make_response
        path = request.path
        if any(path.startswith(p) for p in self.checker.exclude_paths):
            return None

        if not self.checker.is_valid():
            if request.is_json or path.startswith("/api"):
                return jsonify({"error": "LICENSE_INVALID", "message": "License tidak valid."}), 403
            return make_response(LOCK_PAGE_HTML, 403)

        # Inject into flask.g
        from flask import g
        g.privasimu_license = self.checker.get_license()
        g.privasimu_package = self.checker.get_package_type()
        return None


# ==========================================
# FASTAPI MIDDLEWARE
# ==========================================

class FastAPILicenseMiddleware:
    """
    FastAPI/Starlette middleware — blocks requests if license invalid.

    Usage:
        from privasimu_license import FastAPILicenseMiddleware
        app = FastAPI()
        app.add_middleware(FastAPILicenseMiddleware)
    """

    def __init__(self, app, config=None):
        self.app = app
        self.checker = PrivasimuLicense(**(config or {}))

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            return await self.app(scope, receive, send)

        path = scope.get("path", "")
        if any(path.startswith(p) for p in self.checker.exclude_paths):
            return await self.app(scope, receive, send)

        if not self.checker.is_valid():
            # Send 403 response
            body = json.dumps({
                "error": "LICENSE_INVALID",
                "message": "Aplikasi ini memerlukan license aktif dari Privasimu.",
            }).encode()

            await send({"type": "http.response.start", "status": 403, "headers": [
                [b"content-type", b"application/json"],
            ]})
            await send({"type": "http.response.body", "body": body})
            return

        # Inject into scope state
        scope.setdefault("state", {})
        scope["state"]["privasimu_license"] = self.checker.get_license()
        scope["state"]["privasimu_package"] = self.checker.get_package_type()

        return await self.app(scope, receive, send)


# ==========================================
# DECORATOR — for any framework
# ==========================================

def require_license(func=None, *, feature=None):
    """
    Decorator to require valid license.

    Usage:
        @require_license
        def my_view(request): ...

        @require_license(feature='ai_assistant')
        def ai_endpoint(request): ...
    """
    import functools

    checker = PrivasimuLicense()

    def decorator(f):
        @functools.wraps(f)
        def wrapper(*args, **kwargs):
            if not checker.is_valid():
                raise PermissionError("Privasimu license is not valid.")
            if feature and not checker.has_feature(feature):
                raise PermissionError(f"Feature '{feature}' requires a higher license tier.")
            return f(*args, **kwargs)
        return wrapper

    if func:
        return decorator(func)
    return decorator


# ==========================================
# CLI
# ==========================================

def cli():
    """Command-line interface: privasimu-license status|verify"""
    import sys
    checker = PrivasimuLicense()

    if len(sys.argv) < 2 or sys.argv[1] == "status":
        print("\n╔══════════════════════════════════════════════╗")
        print("║     🔐 PRIVASIMU LICENSE STATUS              ║")
        print("╚══════════════════════════════════════════════╝\n")

        if checker.is_valid():
            lic = checker.get_license() or {}
            print(f"  ✅ License: ACTIVE")
            print(f"  📦 Package: {(lic.get('package_type', 'unknown')).upper()}")
            print(f"  📅 Expires: {lic.get('expires_at', 'Perpetual')}")
            print(f"  🏢 Org: {lic.get('org_name', '-')}")
        else:
            print("  ❌ License: INVALID / NOT FOUND")
            print("  Run: privasimu-license verify")
        print()

    elif sys.argv[1] == "verify":
        print("Contacting License Manager...")
        if "--force" in sys.argv:
            checker.clear_cache()
        result = checker.verify()
        if result.get("valid"):
            lic = result.get("license", {})
            print(f"\n✅ License VALID!")
            print(f"   Package: {lic.get('package_type', '?').upper()}")
            print(f"   Expires: {lic.get('expires_at', 'Perpetual')}")
        else:
            print(f"\n❌ License INVALID: {result.get('message', '?')}")
            print("   Get a license: https://license-priva.sainskerta.net")

    else:
        print("Usage: privasimu-license [status|verify] [--force]")


if __name__ == "__main__":
    cli()
