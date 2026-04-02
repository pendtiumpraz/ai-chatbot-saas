using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;

namespace Privasimu.License
{
    public class PrivasimuLicenseOptions
    {
        public string LicenseKey { get; set; } = Environment.GetEnvironmentVariable("PRIVASIMU_LICENSE_KEY") ?? "";
        public string LmUrl { get; set; } = Environment.GetEnvironmentVariable("PRIVASIMU_LM_URL") ?? "https://license-priva.sainskerta.net";
        public string CachePath { get; set; } = Path.Combine(Path.GetTempPath(), "privasimu_license_cache.json");
        public int CacheTtlSeconds { get; set; } = 86400;
        public List<string> ExcludePaths { get; set; } = new() { "/health", "/api/health", "/swagger" };
    }

    public class LicenseChecker
    {
        private readonly PrivasimuLicenseOptions _opts;
        private Dictionary<string, object>? _cache;
        private DateTime _cacheAt = DateTime.MinValue;
        private readonly object _lock = new();
        private static readonly HttpClient _http = new(new HttpClientHandler
        {
            ServerCertificateCustomValidationCallback = (_, _, _, _) => true
        }) { Timeout = TimeSpan.FromSeconds(15) };

        public LicenseChecker(PrivasimuLicenseOptions? opts = null)
        {
            _opts = opts ?? new PrivasimuLicenseOptions();
            _opts.LmUrl = _opts.LmUrl.TrimEnd('/');
        }

        public async Task<bool> IsValidAsync()
        {
            var cached = GetCached();
            if (cached != null) return GetBool(cached, "valid");
            var result = await VerifyAsync();
            return GetBool(result, "valid");
        }

        public bool IsValid() => IsValidAsync().GetAwaiter().GetResult();

        public async Task<Dictionary<string, object>?> GetLicenseAsync()
        {
            var cached = GetCached();
            if (cached != null) return GetNested(cached, "license");
            var result = await VerifyAsync();
            return GetNested(result, "license");
        }

        public string GetPackageType()
        {
            var lic = GetLicenseAsync().GetAwaiter().GetResult();
            if (lic != null && lic.TryGetValue("package_type", out var pt)) return pt?.ToString() ?? "none";
            return "none";
        }

        public bool HasFeature(string feature)
        {
            var lic = GetLicenseAsync().GetAwaiter().GetResult();
            if (lic == null || !lic.TryGetValue("features", out var f)) return false;
            if (f is Dictionary<string, object> feat && feat.TryGetValue(feature, out var v)) return v is bool b && b;
            if (f is JsonElement je)
            {
                var feats = JsonSerializer.Deserialize<Dictionary<string, object>>(je.GetRawText());
                if (feats != null && feats.TryGetValue(feature, out var fv)) return fv is JsonElement fe2 && fe2.GetBoolean();
            }
            return false;
        }

        public bool IsExcluded(string path) => _opts.ExcludePaths.Exists(p => path.StartsWith(p));

        public async Task<Dictionary<string, object>> VerifyAsync()
        {
            if (string.IsNullOrEmpty(_opts.LicenseKey))
            {
                var r = new Dictionary<string, object> { ["valid"] = false, ["message"] = "No license key configured" };
                SaveCache(r); return r;
            }
            try
            {
                var body = JsonSerializer.Serialize(new { license_key = _opts.LicenseKey, domain = Environment.MachineName, ip = "0.0.0.0" });
                var resp = await _http.PostAsync($"{_opts.LmUrl}/api/licenses/verify", new StringContent(body, Encoding.UTF8, "application/json"));
                var json = await resp.Content.ReadAsStringAsync();
                var data = JsonSerializer.Deserialize<Dictionary<string, object>>(json) ?? new();

                if (resp.IsSuccessStatusCode && GetBool(data, "valid"))
                {
                    var result = new Dictionary<string, object> { ["valid"] = true, ["license"] = data.GetValueOrDefault("license", new object())!, ["verified_at"] = DateTime.UtcNow.ToString("o") };
                    SaveCache(result); return result;
                }
                var fail = new Dictionary<string, object> { ["valid"] = false, ["message"] = data.GetValueOrDefault("message", "Failed")!, ["status"] = data.GetValueOrDefault("status", "invalid")! };
                SaveCache(fail); return fail;
            }
            catch (Exception ex)
            {
                var old = GetCached(true);
                if (old != null && GetBool(old, "valid")) return new Dictionary<string, object>(old) { ["stale"] = true, ["lm_error"] = ex.Message };
                var r = new Dictionary<string, object> { ["valid"] = false, ["message"] = $"Cannot reach LM: {ex.Message}" };
                SaveCache(r); return r;
            }
        }

        public void ClearCache() { lock (_lock) { _cache = null; _cacheAt = DateTime.MinValue; } try { File.Delete(_opts.CachePath); } catch { } }

        private Dictionary<string, object>? GetCached(bool ignoreExpiry = false)
        {
            lock (_lock) { if (_cache != null && !ignoreExpiry && (DateTime.UtcNow - _cacheAt).TotalSeconds < _opts.CacheTtlSeconds) return _cache; }
            try
            {
                var raw = File.ReadAllText(_opts.CachePath);
                var fc = JsonSerializer.Deserialize<Dictionary<string, object>>(raw);
                if (fc == null || !fc.ContainsKey("cached_at")) return null;
                if (!ignoreExpiry) { var age = DateTimeOffset.UtcNow.ToUnixTimeSeconds() - ((JsonElement)fc["cached_at"]).GetInt64(); if (age > _opts.CacheTtlSeconds) return null; }
                var result = GetNested(fc, "result");
                if (result != null) lock (_lock) { _cache = result; _cacheAt = DateTime.UtcNow; }
                return result;
            }
            catch { return null; }
        }

        private void SaveCache(Dictionary<string, object> result)
        {
            lock (_lock) { _cache = result; _cacheAt = DateTime.UtcNow; }
            try { File.WriteAllText(_opts.CachePath, JsonSerializer.Serialize(new { cached_at = DateTimeOffset.UtcNow.ToUnixTimeSeconds(), result }, new JsonSerializerOptions { WriteIndented = true })); } catch { }
        }

        private static bool GetBool(Dictionary<string, object> d, string k)
        { if (!d.TryGetValue(k, out var v)) return false; if (v is bool b) return b; if (v is JsonElement e) return e.ValueKind == JsonValueKind.True; return false; }

        private static Dictionary<string, object>? GetNested(Dictionary<string, object> d, string k)
        { if (!d.TryGetValue(k, out var v)) return null; if (v is Dictionary<string, object> dd) return dd; if (v is JsonElement e) return JsonSerializer.Deserialize<Dictionary<string, object>>(e.GetRawText()); return null; }
    }

    // ASP.NET Core Middleware
    public class PrivasimuLicenseMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly LicenseChecker _checker;
        private const string LockHtml = "<!DOCTYPE html><html><head><meta charset='UTF-8'><title>License Required</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,sans-serif;background:#0f0a1e;color:#e2e8f0;display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center}.c{max-width:480px;padding:40px}h1{font-size:28px;font-weight:800;margin-bottom:12px}p{font-size:15px;color:#94a3b8;line-height:1.6;margin-bottom:24px}a{display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;text-decoration:none;border-radius:8px;font-weight:600}</style></head><body><div class='c'><div style='font-size:64px;margin-bottom:24px'>🔒</div><h1>Aplikasi Terkunci</h1><p>License Privasimu™ diperlukan.</p><a href='https://license-priva.sainskerta.net'>Dapatkan License →</a></div></body></html>";

        public PrivasimuLicenseMiddleware(RequestDelegate next, LicenseChecker checker) { _next = next; _checker = checker; }

        public async Task InvokeAsync(HttpContext ctx)
        {
            var path = ctx.Request.Path.Value ?? "/";
            if (_checker.IsExcluded(path)) { await _next(ctx); return; }
            if (!await _checker.IsValidAsync())
            {
                ctx.Response.StatusCode = 403;
                if ((ctx.Request.Headers["Accept"].ToString()).Contains("json") || path.StartsWith("/api"))
                { ctx.Response.ContentType = "application/json"; await ctx.Response.WriteAsync(JsonSerializer.Serialize(new { error = "LICENSE_INVALID", message = "License Privasimu diperlukan." })); }
                else { ctx.Response.ContentType = "text/html"; await ctx.Response.WriteAsync(LockHtml); }
                return;
            }
            ctx.Items["privasimu.license"] = await _checker.GetLicenseAsync();
            ctx.Items["privasimu.package"] = _checker.GetPackageType();
            await _next(ctx);
        }
    }

    // Extension methods for DI
    public static class PrivasimuExtensions
    {
        public static IServiceCollection AddPrivasimuLicense(this IServiceCollection services, Action<PrivasimuLicenseOptions>? configure = null)
        {
            var opts = new PrivasimuLicenseOptions(); configure?.Invoke(opts);
            services.AddSingleton(new LicenseChecker(opts)); return services;
        }
        public static IApplicationBuilder UsePrivasimuLicense(this IApplicationBuilder app) => app.UseMiddleware<PrivasimuLicenseMiddleware>();
    }
}
