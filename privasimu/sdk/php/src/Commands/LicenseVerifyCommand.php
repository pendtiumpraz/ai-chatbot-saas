<?php

namespace Privasimu\License\Commands;

use Illuminate\Console\Command;
use Privasimu\License\LicenseChecker;

class LicenseVerifyCommand extends Command
{
    protected $signature = 'privasimu:verify {--force : Force re-verification (bypass cache)}';
    protected $description = 'Verify Privasimu license with License Manager';

    public function handle()
    {
        $checker = app(LicenseChecker::class);

        if ($this->option('force')) {
            $checker->clearCache();
            $this->info('Cache cleared.');
        }

        $this->info('Contacting License Manager...');
        $result = $checker->verify();

        $this->newLine();

        if ($result['valid']) {
            $license = $result['license'] ?? [];
            $this->info('✅ License VALID!');
            $this->table(
                ['Property', 'Value'],
                [
                    ['Package', strtoupper($license['package_type'] ?? 'unknown')],
                    ['Type', $license['license_type'] ?? '-'],
                    ['Expires', $license['expires_at'] ?? 'Perpetual'],
                    ['Org', $license['org_name'] ?? '-'],
                    ['Signature', ($license['signature_valid'] ?? false) ? '✅ Valid' : '❌ Invalid'],
                    ['Verified At', $result['verified_at'] ?? '-'],
                ]
            );
        } else {
            $this->error('❌ License INVALID');
            $this->warn('Message: ' . ($result['message'] ?? 'Unknown error'));
            $this->line('');
            $this->line('Get a license at: https://license-priva.sainskerta.net');
        }

        return $result['valid'] ? 0 : 1;
    }
}
