# 📦 Privasimu License SDK — Node.js (Express / Next.js / NestJS)

## Cara Publish ke NPM

### 1. Setup NPM Account
```bash
npm login
# atau buat akun di https://www.npmjs.com/signup
```

### 2. Buat Scope Organization (untuk @privasimu/)
1. Buka [npmjs.com](https://www.npmjs.com) → login
2. Klik avatar → **Add Organization** → nama: `privasimu`
3. Ini membuat scope `@privasimu/` yang hanya kamu bisa publish

### 3. Publish
```bash
cd sdk/node

# Test dulu (dry run)
npm publish --dry-run

# Publish pertama kali (scope @privasimu = harus public)
npm publish --access public

# Update versi & re-publish
npm version patch   # 1.0.0 → 1.0.1
npm publish --access public
```

### 4. Verify
```bash
npm info @privasimu/license-sdk
# Harusnya muncul package info kamu
```

---

## Cara Pasang di Aplikasi

### Express.js

#### Step 1: Install
```bash
npm install @privasimu/license-sdk
```

#### Step 2: `.env`
```env
PRIVASIMU_LICENSE_KEY=PRIV-XXXX-XXXX-XXXX-XXXX
PRIVASIMU_LM_URL=https://license-priva.sainskerta.net
```

#### Step 3: Pasang Middleware (1 baris)
```js
const express = require('express');
const { middleware } = require('@privasimu/license-sdk');

const app = express();

app.use(middleware()); // ← Cuma ini!

app.get('/', (req, res) => {
    res.json({
        message: 'App licensed!',
        package: req.privasimuPackage,     // 'basic', 'ai', 'ai_agent'
        license: req.privasimuLicense,
    });
});

app.listen(3000);
```

#### Custom Lock Handler (opsional)
```js
const { PrivasimuLicense } = require('@privasimu/license-sdk');
const license = new PrivasimuLicense();

app.use(license.expressMiddleware({
    onLocked: (req, res, info) => {
        res.status(403).render('license-required');
    },
}));
```

---

### Next.js (Pages Router)

#### API Route Protection
```js
// pages/api/hello.js
import { withLicense } from '@privasimu/license-sdk';

export default withLicense(async (req, res) => {
    res.json({
        message: 'Licensed!',
        package: req.privasimuPackage,
    });
});
```

### Next.js (App Router)

```js
// app/api/hello/route.js
import { PrivasimuLicense } from '@privasimu/license-sdk';

const license = new PrivasimuLicense();

export async function GET(request) {
    if (!(await license.isValid())) {
        return Response.json({ error: 'LICENSE_INVALID' }, { status: 403 });
    }
    return Response.json({
        package: await license.getPackageType(),
        hasAI: await license.hasFeature('ai_assistant'),
    });
}
```

---

### NestJS

#### Step 1: Install
```bash
npm install @privasimu/license-sdk
```

#### Step 2: Register Module
```ts
// app.module.ts
import { Module } from '@nestjs/common';
import { PrivasimuLicenseModule } from '@privasimu/license-sdk/nestjs';

@Module({
    imports: [
        PrivasimuLicenseModule.register({
            licenseKey: process.env.PRIVASIMU_LICENSE_KEY,
            lmUrl: process.env.PRIVASIMU_LM_URL,
        }),
    ],
})
export class AppModule {}
```

#### Step 3: Apply Guard (pilih salah satu)

**Global (semua endpoint):**
```ts
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrivasimuLicenseGuard } from '@privasimu/license-sdk/nestjs';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalGuards(app.get(PrivasimuLicenseGuard)); // ← ini
    await app.listen(3000);
}
bootstrap();
```

**Per-Controller:**
```ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { PrivasimuLicenseGuard } from '@privasimu/license-sdk/nestjs';

@Controller('api')
@UseGuards(PrivasimuLicenseGuard) // ← ini
export class ApiController {
    @Get('hello')
    hello() { return { message: 'Licensed!' }; }
}
```

#### Step 4: Inject Service (untuk feature gating)
```ts
import { Injectable } from '@nestjs/common';
import { PrivasimuLicenseService } from '@privasimu/license-sdk/nestjs';

@Injectable()
export class AiService {
    constructor(private license: PrivasimuLicenseService) {}

    async generate() {
        if (!await this.license.hasFeature('ai_assistant')) {
            throw new Error('Fitur AI memerlukan paket Pro ke atas');
        }
        // ... AI logic
    }
}
```

---

### Feature Gating (semua framework)
```js
const { PrivasimuLicense } = require('@privasimu/license-sdk');
const license = new PrivasimuLicense();

// Cek paket
const pkg = await license.getPackageType(); // 'basic', 'ai', 'ai_agent'

// Cek fitur spesifik
if (await license.hasFeature('ai_assistant')) {
    // show AI features
}
if (await license.hasFeature('ai_agent')) {
    // show AI Agent features
}
```
