# 🔐 Privasimu License SDK — Universal

**Plug-and-play license verification** — pasang ke framework apapun dalam 2 menit.

## Supported Frameworks (8 bahasa, 15+ framework)

| SDK | Frameworks | Install |
|-----|-----------|---------|
| **PHP** | Laravel, Plain PHP | `composer require privasimu/license-sdk` |
| **Node.js** | Express, Next.js, **NestJS**, Fastify, Koa | `npm i @privasimu/license-sdk` |
| **Python** | Django, Flask, FastAPI | `pip install privasimu-license` |
| **Go** | net/http, Gin, Echo, Fiber, Chi | `go get github.com/privasimu/license-sdk-go` |
| **Ruby** | Rails, Sinatra, Rack | `gem install privasimu-license` |
| **Java** | Spring Boot, Jakarta EE | `implementation 'id.privasimu:license-sdk:1.0.0'` |
| **C# / .NET** | ASP.NET Core, Blazor, Minimal API | `dotnet add package Privasimu.License` |

## Quick Start (ALL FRAMEWORKS)

### Step 1: `.env`
```env
PRIVASIMU_LICENSE_KEY=PRIV-XXXX-XXXX-XXXX-XXXX
PRIVASIMU_LM_URL=https://license-priva.sainskerta.net
```

### Step 2: 1-Line Integration
```php
// Laravel — Kernel.php
\Privasimu\License\Middleware\VerifyLicense::class,
```
```js
// Express
app.use(require('@privasimu/license-sdk').middleware());
```
```ts
// NestJS — app.module.ts
imports: [PrivasimuLicenseModule.register()]
```
```js
// Next.js
export default withLicense(handler);
```
```python
# Django — settings.py
MIDDLEWARE = ['privasimu_license.DjangoLicenseMiddleware', ...]
# Flask
FlaskLicenseMiddleware(app)
# FastAPI
app.add_middleware(FastAPILicenseMiddleware)
```
```go
// Go net/http
mux.Handle("/", privasimu.Middleware(handler))
```
```ruby
# Rails — config/application.rb
config.middleware.use Privasimu::License::RackMiddleware
```
```java
// Spring Boot
registry.addInterceptor(new PrivasimuLicenseInterceptor());
```
```csharp
// ASP.NET Core — Program.cs
builder.Services.AddPrivasimuLicense();
app.UsePrivasimuLicense();
```

## Architecture
```
Your App ──► SDK (1 line) ──► License Manager ──► Signed JWT
                │                                      │
                └──── Local Cache (24h) ◄──────────────┘
```

## Directory Structure
```
sdk/
├── README.md
├── php/          ← Laravel, Plain PHP
├── node/         ← Express, Next.js, NestJS
├── python/       ← Django, Flask, FastAPI
├── go/           ← net/http, Gin, Echo, Fiber
├── ruby/         ← Rails, Sinatra, Rack
├── java/         ← Spring Boot, Jakarta EE
└── dotnet/       ← ASP.NET Core, Blazor
```

## License
Proprietary — Privasimu™ by Sainskerta
