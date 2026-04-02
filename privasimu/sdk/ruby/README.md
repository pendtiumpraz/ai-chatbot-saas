# 📦 Privasimu License SDK — Ruby (Rails / Sinatra / Rack)

## Cara Publish ke RubyGems

### 1. Setup Akun RubyGems
1. Register di [rubygems.org](https://rubygems.org/sign_up)
2. Setup credentials:
```bash
gem signin
# atau simpan API key manual:
mkdir -p ~/.gem
curl -u yourusername https://rubygems.org/api/v1/api_key.yaml > ~/.gem/credentials
chmod 0600 ~/.gem/credentials
```

### 2. Build Gem
```bash
cd sdk/ruby
gem build privasimu-license.gemspec
# Output: privasimu-license-1.0.0.gem
```

### 3. Publish
```bash
gem push privasimu-license-1.0.0.gem
```

### 4. Update Versi
```ruby
# privasimu-license.gemspec → ubah version
s.version = '1.0.1'
```
```bash
gem build privasimu-license.gemspec
gem push privasimu-license-1.0.1.gem
```

---

## Cara Pasang di Aplikasi

### Ruby on Rails

#### Step 1: Install
```ruby
# Gemfile
gem 'privasimu-license'
```
```bash
bundle install
```

#### Step 2: `.env` (pakai dotenv-rails)
```env
PRIVASIMU_LICENSE_KEY=PRIV-XXXX-XXXX-XXXX-XXXX
PRIVASIMU_LM_URL=https://license-priva.sainskerta.net
```

#### Step 3: Otomatis! (Rails Railtie)
Jika `PRIVASIMU_LICENSE_KEY` ada di env, **middleware otomatis terpasang** via Railtie. Tidak perlu config tambahan.

#### Manual (jika ingin custom):
```ruby
# config/application.rb
config.middleware.use Privasimu::License::RackMiddleware, {
  license_key: ENV['PRIVASIMU_LICENSE_KEY'],
  exclude_paths: ['/health', '/admin'],
}
```

#### Step 4: Gunakan di Controller
```ruby
class DashboardController < ApplicationController
  def index
    license = request.env['privasimu.license']   # Hash
    package = request.env['privasimu.package']   # 'basic', 'ai', 'ai_agent'
    render json: { package: package, licensed: true }
  end
end
```

#### Rake Tasks
```bash
# Cek status
bundle exec rake privasimu:status

# Force verify
bundle exec rake privasimu:verify
```

---

### Sinatra

```ruby
require 'sinatra'
require 'privasimu_license'

use Privasimu::License::RackMiddleware

get '/' do
  package = env['privasimu.package']
  "Licensed! Package: #{package}"
end
```

---

### Feature Gating
```ruby
checker = Privasimu::License::Checker.new
checker.valid?                          # true/false
checker.package_type                    # 'basic', 'ai', 'ai_agent'
checker.has_feature?('ai_assistant')    # true/false
```
