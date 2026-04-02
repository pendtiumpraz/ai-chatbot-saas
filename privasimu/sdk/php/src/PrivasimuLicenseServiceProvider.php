<?php
/**
 * Laravel Service Provider — Auto-registers middleware & provides config.
 * 
 * Auto-discovered by Laravel (composer.json extra.laravel.providers).
 */

namespace Privasimu\License;

use Illuminate\Support\ServiceProvider;

class PrivasimuLicenseServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Bind LicenseChecker as singleton
        $this->app->singleton(LicenseChecker::class, function ($app) {
            return new LicenseChecker([
                'license_key' => config('privasimu.license_key', env('PRIVASIMU_LICENSE_KEY')),
                'lm_url' => config('privasimu.lm_url', env('PRIVASIMU_LM_URL', 'https://license-priva.sainskerta.net')),
                'cache_path' => storage_path('framework/cache/privasimu_license.json'),
                'cache_ttl' => config('privasimu.cache_ttl', 86400),
            ]);
        });

        // Merge config
        $this->mergeConfigFrom(__DIR__ . '/../config/privasimu.php', 'privasimu');
    }

    public function boot()
    {
        // Publish config
        $this->publishes([
            __DIR__ . '/../config/privasimu.php' => config_path('privasimu.php'),
        ], 'privasimu-config');

        // Register route middleware alias
        $router = $this->app['router'];
        $router->aliasMiddleware('privasimu.license', \Privasimu\License\Middleware\VerifyLicense::class);

        // Artisan commands
        if ($this->app->runningInConsole()) {
            $this->commands([
                \Privasimu\License\Commands\LicenseStatusCommand::class,
                \Privasimu\License\Commands\LicenseVerifyCommand::class,
            ]);
        }
    }
}
