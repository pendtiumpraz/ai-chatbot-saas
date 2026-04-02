<?php

namespace Privasimu\License\Commands;

use Illuminate\Console\Command;
use Privasimu\License\LicenseChecker;

class LicenseStatusCommand extends Command
{
    protected $signature = 'privasimu:status';
    protected $description = 'Show current Privasimu license status';

    public function handle()
    {
        $checker = app(LicenseChecker::class);
        $license = $checker->getLicense();

        $this->newLine();
        $this->line('╔══════════════════════════════════════════════╗');
        $this->line('║     🔐 PRIVASIMU LICENSE STATUS              ║');
        $this->line('╚══════════════════════════════════════════════╝');
        $this->newLine();

        if ($checker->isValid()) {
            $this->info('  ✅ License: ACTIVE');
            $this->line("  📦 Package: " . strtoupper($license['package_type'] ?? 'unknown'));
            $this->line("  📅 Expires: " . ($license['expires_at'] ?? 'Never (Perpetual)'));
            $this->line("  🏢 Org: " . ($license['org_name'] ?? '-'));
            $this->line("  🔑 Key: " . ($license['key'] ?? '-'));
        } else {
            $this->error('  ❌ License: INVALID / NOT FOUND');
            $this->warn('  Run `php artisan privasimu:verify` to re-check.');
        }

        $this->newLine();
        return 0;
    }
}
