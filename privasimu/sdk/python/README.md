# 📦 Privasimu License SDK — Python (Django / Flask / FastAPI)

## Cara Publish ke PyPI

### 1. Siapkan Akun PyPI
1. Register di [pypi.org](https://pypi.org/account/register/)
2. Enable 2FA (wajib untuk publish)
3. Buat **API Token** di Account Settings → API Tokens → "Add API Token"

### 2. Install Build Tools
```bash
pip install build twine
```

### 3. Build Package
```bash
cd sdk/python

# Build distributable
python -m build
# Akan menghasilkan:
#   dist/privasimu_license-1.0.0.tar.gz
#   dist/privasimu_license-1.0.0-py3-none-any.whl
```

### 4. Publish
```bash
# Test dulu ke TestPyPI (opsional)
twine upload --repository testpypi dist/*

# Publish ke PyPI (production)
twine upload dist/*
# Masukkan username: __token__
# Masukkan password: pypi-XXXXXXXX (API token)
```

### 5. Verify
```bash
pip install privasimu-license
python -c "from privasimu_license import PrivasimuLicense; print('OK')"
```

### 6. Update Versi
```toml
# pyproject.toml → ubah version
version = "1.0.1"
```
```bash
python -m build
twine upload dist/*
```

---

## Cara Pasang di Aplikasi

### Django

#### Step 1: Install
```bash
pip install privasimu-license
```

#### Step 2: `.env`
```env
PRIVASIMU_LICENSE_KEY=PRIV-XXXX-XXXX-XXXX-XXXX
PRIVASIMU_LM_URL=https://license-priva.sainskerta.net
```

#### Step 3: Register Middleware
```python
# settings.py
MIDDLEWARE = [
    'privasimu_license.DjangoLicenseMiddleware',  # ← Tambah ini (taruh paling atas)
    'django.middleware.security.SecurityMiddleware',
    # ... middleware lainnya
]
```

#### Step 4: Selesai! Test
```bash
python manage.py runserver
# Buka browser → jika license invalid, akan muncul halaman lock 🔒
```

#### Step 5: Gunakan di Views (opsional)
```python
# views.py
def dashboard(request):
    license = request.privasimu_license   # dict atau None
    package = request.privasimu_package   # 'basic', 'ai', 'ai_agent'
    return render(request, 'dashboard.html', {'package': package})
```

#### Decorator untuk Fitur Tertentu
```python
from privasimu_license import require_license

@require_license
def my_protected_view(request):
    return HttpResponse("Licensed!")

@require_license(feature='ai_assistant')
def ai_endpoint(request):
    return HttpResponse("AI feature!")
```

---

### Flask

#### Step 1: Install
```bash
pip install privasimu-license
```

#### Step 2: Pasang Middleware (1 baris)
```python
from flask import Flask
from privasimu_license import FlaskLicenseMiddleware

app = Flask(__name__)
FlaskLicenseMiddleware(app)  # ← Cuma ini!

@app.route('/')
def index():
    from flask import g
    return f"Licensed! Package: {g.privasimu_package}"

app.run()
```

#### Dengan Config Custom
```python
FlaskLicenseMiddleware(app, config={
    'license_key': 'PRIV-XXXX-XXXX-XXXX-XXXX',
    'lm_url': 'https://license-priva.sainskerta.net',
    'cache_ttl': 3600,  # 1 jam
    'exclude_paths': ['/health', '/docs'],
})
```

---

### FastAPI

#### Step 1: Install
```bash
pip install privasimu-license
```

#### Step 2: Pasang Middleware
```python
from fastapi import FastAPI, Request
from privasimu_license import FastAPILicenseMiddleware

app = FastAPI()
app.add_middleware(FastAPILicenseMiddleware)  # ← Cuma ini!

@app.get("/")
async def root(request: Request):
    license_info = request.state.privasimu_license
    package = request.state.privasimu_package
    return {"package": package, "licensed": True}
```

#### Feature Gating di Endpoint
```python
from privasimu_license import PrivasimuLicense

checker = PrivasimuLicense()

@app.get("/ai/generate")
async def ai_generate():
    if not checker.has_feature('ai_assistant'):
        raise HTTPException(403, "Fitur AI memerlukan paket Pro")
    return {"result": "AI generated content"}
```

---

### CLI Tool
```bash
# Cek status license
privasimu-license status

# Force verify
privasimu-license verify --force
```

Output:
```
╔══════════════════════════════════════════════╗
║     🔐 PRIVASIMU LICENSE STATUS              ║
╚══════════════════════════════════════════════╝

  ✅ License: ACTIVE
  📦 Package: AI_AGENT
  📅 Expires: 2027-04-01T00:00:00
  🏢 Org: PT Pertamina
```
