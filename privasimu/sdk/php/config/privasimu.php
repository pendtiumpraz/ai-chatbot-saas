<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Privasimu License Configuration
    |--------------------------------------------------------------------------
    */

    // Your license key from https://license-priva.sainskerta.net
    'license_key' => env('PRIVASIMU_LICENSE_KEY', ''),

    // License Manager URL
    'lm_url' => env('PRIVASIMU_LM_URL', 'https://license-priva.sainskerta.net'),

    // Cache TTL in seconds (default: 24 hours)
    // How often to re-verify with License Manager
    'cache_ttl' => env('PRIVASIMU_CACHE_TTL', 86400),

    // Paths to exclude from license verification
    'exclude_paths' => [
        'api/health',
        'api/ping',
    ],
];
