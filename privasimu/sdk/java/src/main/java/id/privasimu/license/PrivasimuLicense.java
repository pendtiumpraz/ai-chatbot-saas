/*
 * ============================================================
 * PRIVASIMU LICENSE SDK — Java / Spring Boot
 * ============================================================
 *
 * Works with Spring Boot, Jakarta EE, and any Servlet-based framework.
 *
 * INSTALL (Maven):
 *   <dependency>
 *     <groupId>id.privasimu</groupId>
 *     <artifactId>license-sdk</artifactId>
 *     <version>1.0.0</version>
 *   </dependency>
 *
 * INSTALL (Gradle):
 *   implementation 'id.privasimu:license-sdk:1.0.0'
 *
 * SPRING BOOT:
 *   @Configuration
 *   public class WebConfig implements WebMvcConfigurer {
 *       @Override
 *       public void addInterceptors(InterceptorRegistry registry) {
 *           registry.addInterceptor(new PrivasimuLicenseInterceptor());
 *       }
 *   }
 *
 * OR application.properties:
 *   privasimu.license-key=PRIV-XXXX-XXXX-XXXX-XXXX
 *   privasimu.lm-url=https://license-priva.sainskerta.net
 * ============================================================
 */

package id.privasimu.license;

import java.io.*;
import java.net.*;
import java.net.http.*;
import java.time.*;
import java.util.*;
import javax.net.ssl.*;

import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Core license checker — thread-safe, cache-backed.
 */
public class PrivasimuLicense {

    private final String licenseKey;
    private final String lmUrl;
    private final String cachePath;
    private final long cacheTtlSeconds;
    private final List<String> excludePaths;

    private volatile Map<String, Object> cache;
    private volatile long cacheLoadedAt;
    private final Object cacheLock = new Object();
    private static final ObjectMapper mapper = new ObjectMapper();

    public PrivasimuLicense() {
        this(null, null, null, 86400, null);
    }

    public PrivasimuLicense(String licenseKey, String lmUrl, String cachePath, long cacheTtlSeconds, List<String> excludePaths) {
        this.licenseKey = licenseKey != null ? licenseKey : envOrDefault("PRIVASIMU_LICENSE_KEY", "");
        this.lmUrl = stripTrailingSlash(lmUrl != null ? lmUrl : envOrDefault("PRIVASIMU_LM_URL", "https://license-priva.sainskerta.net"));
        this.cachePath = cachePath != null ? cachePath : System.getProperty("java.io.tmpdir") + "/privasimu_license_cache.json";
        this.cacheTtlSeconds = cacheTtlSeconds > 0 ? cacheTtlSeconds : 86400;
        this.excludePaths = excludePaths != null ? excludePaths : List.of("/health", "/api/health", "/actuator");
    }

    // ==========================================
    // MAIN API
    // ==========================================

    public boolean isValid() {
        Map<String, Object> cached = getCachedResult();
        if (cached != null) return Boolean.TRUE.equals(cached.get("valid"));
        return Boolean.TRUE.equals(verify().get("valid"));
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> getLicense() {
        Map<String, Object> cached = getCachedResult();
        if (cached != null) return (Map<String, Object>) cached.get("license");
        return (Map<String, Object>) verify().get("license");
    }

    public String getPackageType() {
        Map<String, Object> lic = getLicense();
        if (lic != null && lic.containsKey("package_type")) return lic.get("package_type").toString();
        return "none";
    }

    @SuppressWarnings("unchecked")
    public boolean hasFeature(String feature) {
        Map<String, Object> lic = getLicense();
        if (lic == null || !lic.containsKey("features")) return false;
        Map<String, Object> features = (Map<String, Object>) lic.get("features");
        return Boolean.TRUE.equals(features.get(feature));
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> verify() {
        if (licenseKey.isEmpty()) {
            Map<String, Object> r = Map.of("valid", false, "message", "No license key configured");
            cacheResult(r);
            return r;
        }

        try {
            // Trust all certs for self-signed
            SSLContext ctx = SSLContext.getInstance("TLS");
            ctx.init(null, new TrustManager[]{new X509TrustAllManager()}, new java.security.SecureRandom());

            HttpClient client = HttpClient.newBuilder()
                    .sslContext(ctx)
                    .connectTimeout(Duration.ofSeconds(10))
                    .build();

            String body = mapper.writeValueAsString(Map.of(
                    "license_key", licenseKey,
                    "domain", InetAddress.getLocalHost().getHostName(),
                    "ip", "0.0.0.0"
            ));

            HttpRequest req = HttpRequest.newBuilder()
                    .uri(URI.create(lmUrl + "/api/licenses/verify"))
                    .header("Content-Type", "application/json")
                    .header("Accept", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(body))
                    .timeout(Duration.ofSeconds(15))
                    .build();

            HttpResponse<String> resp = client.send(req, HttpResponse.BodyHandlers.ofString());
            Map<String, Object> data = mapper.readValue(resp.body(), Map.class);

            if (resp.statusCode() == 200 && Boolean.TRUE.equals(data.get("valid"))) {
                Map<String, Object> result = new HashMap<>();
                result.put("valid", true);
                result.put("license", data.get("license"));
                result.put("verified_at", Instant.now().toString());
                cacheResult(result);
                return result;
            }

            Map<String, Object> result = new HashMap<>();
            result.put("valid", false);
            result.put("message", data.getOrDefault("message", "Verification failed"));
            result.put("status", data.getOrDefault("status", "invalid"));
            cacheResult(result);
            return result;

        } catch (Exception e) {
            // Grace period
            Map<String, Object> old = getCachedResult(true);
            if (old != null && Boolean.TRUE.equals(old.get("valid"))) {
                Map<String, Object> stale = new HashMap<>(old);
                stale.put("stale", true);
                stale.put("lm_error", e.getMessage());
                return stale;
            }
            Map<String, Object> r = Map.of("valid", false, "message", "Cannot reach License Manager: " + e.getMessage());
            cacheResult(r);
            return r;
        }
    }

    public void clearCache() {
        synchronized (cacheLock) {
            cache = null;
            cacheLoadedAt = 0;
        }
        new File(cachePath).delete();
    }

    public boolean isExcluded(String path) {
        return excludePaths.stream().anyMatch(path::startsWith);
    }

    // ==========================================
    // CACHE
    // ==========================================

    @SuppressWarnings("unchecked")
    private Map<String, Object> getCachedResult() { return getCachedResult(false); }

    @SuppressWarnings("unchecked")
    private Map<String, Object> getCachedResult(boolean ignoreExpiry) {
        synchronized (cacheLock) {
            if (cache != null && !ignoreExpiry) {
                long age = (System.currentTimeMillis() - cacheLoadedAt) / 1000;
                if (age < cacheTtlSeconds) return cache;
            }
        }
        try {
            String raw = new String(java.nio.file.Files.readAllBytes(java.nio.file.Path.of(cachePath)));
            Map<String, Object> fc = mapper.readValue(raw, Map.class);
            if (!fc.containsKey("cached_at")) return null;
            if (!ignoreExpiry) {
                long age = Instant.now().getEpochSecond() - ((Number) fc.get("cached_at")).longValue();
                if (age > cacheTtlSeconds) return null;
            }
            Map<String, Object> result = (Map<String, Object>) fc.get("result");
            synchronized (cacheLock) {
                cache = result;
                cacheLoadedAt = System.currentTimeMillis();
            }
            return result;
        } catch (Exception e) {
            return null;
        }
    }

    private void cacheResult(Map<String, Object> result) {
        synchronized (cacheLock) {
            cache = result;
            cacheLoadedAt = System.currentTimeMillis();
        }
        try {
            Map<String, Object> payload = Map.of("cached_at", Instant.now().getEpochSecond(), "result", result);
            mapper.writerWithDefaultPrettyPrinter().writeValue(new File(cachePath), payload);
        } catch (Exception ignored) {}
    }

    // ==========================================
    // HELPERS
    // ==========================================

    private static String envOrDefault(String key, String def) {
        String v = System.getenv(key);
        if (v != null && !v.isEmpty()) return v;
        // Also check Spring-style properties
        v = System.getProperty(key.toLowerCase().replace('_', '.'));
        return v != null ? v : def;
    }

    private static String stripTrailingSlash(String s) {
        return s.endsWith("/") ? s.substring(0, s.length() - 1) : s;
    }

    // Trust-all for self-signed certs
    private static class X509TrustAllManager implements X509TrustManager {
        public void checkClientTrusted(java.security.cert.X509Certificate[] c, String a) {}
        public void checkServerTrusted(java.security.cert.X509Certificate[] c, String a) {}
        public java.security.cert.X509Certificate[] getAcceptedIssuers() { return new java.security.cert.X509Certificate[0]; }
    }
}
