# ============================================================
# PRIVASIMU LICENSE SDK — Ruby
# ============================================================
#
# Works with Rails, Sinatra, Rack, and any Ruby framework.
#
# INSTALL:
#   gem install privasimu-license
#   # or in Gemfile: gem 'privasimu-license'
#
# RAILS (config/application.rb):
#   config.middleware.use Privasimu::License::RackMiddleware
#
# SINATRA:
#   use Privasimu::License::RackMiddleware
#
# ENV:
#   PRIVASIMU_LICENSE_KEY=PRIV-XXXX-XXXX-XXXX-XXXX
#   PRIVASIMU_LM_URL=https://license-priva.sainskerta.net
# ============================================================

require 'net/http'
require 'json'
require 'uri'
require 'openssl'
require 'tmpdir'
require 'socket'
require 'fileutils'

module Privasimu
  module License

    class Checker
      attr_reader :config

      def initialize(config = {})
        @config = {
          license_key: config[:license_key] || ENV['PRIVASIMU_LICENSE_KEY'] || '',
          lm_url: (config[:lm_url] || ENV['PRIVASIMU_LM_URL'] || 'https://license-priva.sainskerta.net').chomp('/'),
          cache_path: config[:cache_path] || File.join(Dir.tmpdir, 'privasimu_license_cache.json'),
          cache_ttl: config[:cache_ttl] || 86400,
          exclude_paths: config[:exclude_paths] || ['/health', '/api/health', '/ping'],
        }
        @cache = nil
        @cache_loaded_at = 0
      end

      # Check if license is valid (uses cache).
      def valid?
        cached = get_cached_result
        return cached['valid'] unless cached.nil?
        verify['valid'] || false
      end

      # Get license info hash.
      def license
        cached = get_cached_result
        return cached['license'] unless cached.nil?
        verify['license']
      end

      # Get package type.
      def package_type
        lic = self.license
        lic&.dig('package_type') || 'none'
      end

      # Check if feature enabled.
      def has_feature?(feature)
        lic = self.license
        return false unless lic && lic['features']
        lic['features'][feature] == true
      end

      # Force verify with License Manager.
      def verify
        if @config[:license_key].empty?
          result = { 'valid' => false, 'message' => 'No license key configured' }
          cache_result(result)
          return result
        end

        begin
          uri = URI("#{@config[:lm_url]}/api/licenses/verify")
          http = Net::HTTP.new(uri.host, uri.port)
          http.use_ssl = uri.scheme == 'https'
          http.verify_mode = OpenSSL::SSL::VERIFY_NONE
          http.open_timeout = 10
          http.read_timeout = 15

          req = Net::HTTP::Post.new(uri.path)
          req['Content-Type'] = 'application/json'
          req['Accept'] = 'application/json'
          req.body = JSON.generate({
            license_key: @config[:license_key],
            domain: Socket.gethostname,
            ip: '0.0.0.0',
          })

          resp = http.request(req)
          data = JSON.parse(resp.body) rescue {}

          if resp.code.to_i == 200 && data['valid']
            result = {
              'valid' => true,
              'license' => data['license'] || {},
              'verified_at' => Time.now.iso8601,
            }
          else
            result = {
              'valid' => false,
              'message' => data['message'] || 'License verification failed',
              'status' => data['status'] || 'invalid',
            }
          end

        rescue StandardError => e
          # Grace period
          old = get_cached_result(ignore_expiry: true)
          if old && old['valid']
            return old.merge('stale' => true, 'lm_error' => e.message)
          end
          result = { 'valid' => false, 'message' => "Cannot reach License Manager: #{e.message}" }
        end

        cache_result(result)
        result
      end

      def clear_cache
        @cache = nil
        @cache_loaded_at = 0
        File.delete(@config[:cache_path]) rescue nil
      end

      private

      def get_cached_result(ignore_expiry: false)
        # Memory cache
        if @cache && !ignore_expiry
          age = Time.now.to_i - @cache_loaded_at
          return @cache if age < @config[:cache_ttl]
        end

        # File cache
        return nil unless File.exist?(@config[:cache_path])
        raw = File.read(@config[:cache_path]) rescue nil
        return nil unless raw
        data = JSON.parse(raw) rescue nil
        return nil unless data && data['cached_at']

        unless ignore_expiry
          age = Time.now.to_i - data['cached_at']
          return nil if age > @config[:cache_ttl]
        end

        @cache = data['result']
        @cache_loaded_at = Time.now.to_i
        @cache
      end

      def cache_result(result)
        @cache = result
        @cache_loaded_at = Time.now.to_i
        payload = JSON.pretty_generate({ cached_at: Time.now.to_i, result: result })
        File.write(@config[:cache_path], payload) rescue nil
      end
    end

    # ==========================================
    # RACK MIDDLEWARE (Rails, Sinatra, etc.)
    # ==========================================

    class RackMiddleware
      LOCK_HTML = <<~HTML
        <!DOCTYPE html><html><head><meta charset="UTF-8">
        <title>License Required</title>
        <style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,sans-serif;background:#0f0a1e;color:#e2e8f0;display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center}.c{max-width:480px;padding:40px}.l{font-size:64px;margin-bottom:24px}h1{font-size:28px;font-weight:800;margin-bottom:12px}p{font-size:15px;color:#94a3b8;line-height:1.6;margin-bottom:24px}a{display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;text-decoration:none;border-radius:8px;font-weight:600}</style>
        </head><body><div class="c"><div class="l">🔒</div><h1>Aplikasi Terkunci</h1><p>License aktif dari Privasimu™ diperlukan.</p><a href="https://license-priva.sainskerta.net">Dapatkan License →</a></div></body></html>
      HTML

      def initialize(app, config = {})
        @app = app
        @checker = Checker.new(config)
      end

      def call(env)
        path = env['PATH_INFO'] || '/'
        return @app.call(env) if @checker.config[:exclude_paths].any? { |p| path.start_with?(p) }

        unless @checker.valid?
          content_type = env['CONTENT_TYPE'] || ''
          accept = env['HTTP_ACCEPT'] || ''

          if content_type.include?('json') || accept.include?('json') || path.start_with?('/api')
            body = JSON.generate({
              error: 'LICENSE_INVALID',
              message: 'Aplikasi ini memerlukan license aktif dari Privasimu.',
            })
            return [403, { 'Content-Type' => 'application/json' }, [body]]
          end

          return [403, { 'Content-Type' => 'text/html' }, [LOCK_HTML]]
        end

        # Inject license info into env
        env['privasimu.license'] = @checker.license
        env['privasimu.package'] = @checker.package_type

        @app.call(env)
      end
    end

    # ==========================================
    # RAILS RAILTIE (auto-config)
    # ==========================================

    if defined?(Rails::Railtie)
      class Railtie < Rails::Railtie
        initializer 'privasimu_license.configure' do |app|
          # Auto-insert middleware if PRIVASIMU_LICENSE_KEY is set
          if ENV['PRIVASIMU_LICENSE_KEY'] && !ENV['PRIVASIMU_LICENSE_KEY'].empty?
            app.middleware.use RackMiddleware
          end
        end

        rake_tasks do
          namespace :privasimu do
            desc 'Check Privasimu license status'
            task status: :environment do
              checker = Checker.new
              if checker.valid?
                lic = checker.license || {}
                puts "\n✅ License: ACTIVE"
                puts "📦 Package: #{(lic['package_type'] || 'unknown').upcase}"
                puts "📅 Expires: #{lic['expires_at'] || 'Perpetual'}"
              else
                puts "\n❌ License: INVALID"
                puts "Run: rake privasimu:verify"
              end
            end

            desc 'Force verify Privasimu license'
            task verify: :environment do
              checker = Checker.new
              checker.clear_cache
              result = checker.verify
              if result['valid']
                puts "✅ License VALID! Package: #{result.dig('license', 'package_type')&.upcase}"
              else
                puts "❌ License INVALID: #{result['message']}"
              end
            end
          end
        end
      end
    end

  end
end
