/**
 * ============================================================
 * PRIVASIMU LICENSE SDK — NestJS Guard & Module
 * ============================================================
 * 
 * Drop-in NestJS module for license verification.
 * 
 * USAGE:
 * 
 * 1. Import module in app.module.ts:
 * 
 *   import { PrivasimuLicenseModule } from '@privasimu/license-sdk/nestjs';
 * 
 *   @Module({
 *     imports: [
 *       PrivasimuLicenseModule.register({
 *         licenseKey: process.env.PRIVASIMU_LICENSE_KEY,
 *         lmUrl: process.env.PRIVASIMU_LM_URL,
 *       }),
 *     ],
 *   })
 *   export class AppModule {}
 * 
 * 2. Use guard globally or per-controller:
 * 
 *   // Global (main.ts):
 *   app.useGlobalGuards(app.get(PrivasimuLicenseGuard));
 * 
 *   // Per-controller:
 *   @UseGuards(PrivasimuLicenseGuard)
 *   @Controller('api')
 *   export class ApiController { ... }
 * 
 * 3. Inject license info in controllers:
 * 
 *   @Controller()
 *   export class AppController {
 *     constructor(private license: PrivasimuLicenseService) {}
 * 
 *     @Get('status')
 *     async getStatus() {
 *       return {
 *         licensed: await this.license.isValid(),
 *         package: await this.license.getPackageType(),
 *         hasAI: await this.license.hasFeature('ai_assistant'),
 *       };
 *     }
 *   }
 * ============================================================
 */

// We use dynamic require to avoid hard dependency on @nestjs/common
// Users who don't use NestJS won't need these installed.

let Injectable, CanActivate, Module, DynamicModule, Inject;

try {
  const nestCommon = require('@nestjs/common');
  Injectable = nestCommon.Injectable;
  CanActivate = nestCommon.CanActivate;
  Module = nestCommon.Module;
  DynamicModule = nestCommon.DynamicModule;
  Inject = nestCommon.Inject;
} catch {
  // NestJS not installed — provide stubs
  Injectable = () => (target) => target;
  CanActivate = class {};
  Module = () => (target) => target;
  Inject = () => () => {};
}

const { PrivasimuLicense } = require('./index');

const PRIVASIMU_LICENSE_OPTIONS = 'PRIVASIMU_LICENSE_OPTIONS';

/**
 * NestJS Injectable Service — wraps PrivasimuLicense for DI.
 */
class PrivasimuLicenseService extends PrivasimuLicense {
  constructor(options = {}) {
    super(options);
  }
}

// Apply @Injectable() decorator
if (Injectable) {
  Injectable()(PrivasimuLicenseService);
}

/**
 * NestJS Guard — blocks requests if license is invalid.
 */
class PrivasimuLicenseGuard {
  constructor(licenseService) {
    this.licenseService = licenseService;
    this.excludePaths = licenseService.excludePaths || ['/api/health', '/health'];
  }

  async canActivate(context) {
    const request = context.switchToHttp().getRequest();
    const urlPath = request.url || request.path || '';

    // Skip excluded paths
    if (this.excludePaths.some(p => urlPath.startsWith(p))) return true;

    const valid = await this.licenseService.isValid();

    if (!valid) {
      const response = context.switchToHttp().getResponse();
      response.status(403).json({
        error: 'LICENSE_INVALID',
        message: 'Aplikasi ini memerlukan license aktif dari Privasimu.',
        action: 'Hubungi administrator atau kunjungi https://license-priva.sainskerta.net',
      });
      return false;
    }

    // Attach license info to request
    request.privasimuLicense = await this.licenseService.getLicense();
    request.privasimuPackage = await this.licenseService.getPackageType();

    return true;
  }
}

if (Injectable) {
  Injectable()(PrivasimuLicenseGuard);
}

/**
 * NestJS Dynamic Module.
 */
class PrivasimuLicenseModule {
  static register(options = {}) {
    return {
      module: PrivasimuLicenseModule,
      providers: [
        {
          provide: PRIVASIMU_LICENSE_OPTIONS,
          useValue: options,
        },
        {
          provide: PrivasimuLicenseService,
          useFactory: (opts) => new PrivasimuLicenseService(opts),
          inject: [PRIVASIMU_LICENSE_OPTIONS],
        },
        PrivasimuLicenseGuard,
      ],
      exports: [PrivasimuLicenseService, PrivasimuLicenseGuard],
      global: true,
    };
  }
}

if (Module) {
  Module({})(PrivasimuLicenseModule);
}

module.exports = {
  PrivasimuLicenseService,
  PrivasimuLicenseGuard,
  PrivasimuLicenseModule,
  PRIVASIMU_LICENSE_OPTIONS,
};
