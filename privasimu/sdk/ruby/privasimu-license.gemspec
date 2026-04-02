Gem::Specification.new do |s|
  s.name        = 'privasimu-license'
  s.version     = '1.0.0'
  s.summary     = 'Privasimu License SDK for Ruby'
  s.description = 'Enterprise license verification for Ruby apps. Works with Rails, Sinatra, and any Rack-based framework.'
  s.authors     = ['Privasimu']
  s.email       = 'dev@privasimu.id'
  s.homepage    = 'https://github.com/privasimu/license-sdk-ruby'
  s.license     = 'Nonstandard'
  s.files       = ['lib/privasimu_license.rb']
  s.require_paths = ['lib']
  s.required_ruby_version = '>= 3.0'
  s.metadata = {
    'homepage_uri' => 'https://privasimu.id',
    'source_code_uri' => 'https://github.com/privasimu/license-sdk-ruby',
  }
end
