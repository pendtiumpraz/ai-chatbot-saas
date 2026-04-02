/*
 * Spring Boot Interceptor for Privasimu License.
 *
 * Register in WebMvcConfigurer:
 *
 *   @Configuration
 *   public class WebConfig implements WebMvcConfigurer {
 *       @Override
 *       public void addInterceptors(InterceptorRegistry registry) {
 *           registry.addInterceptor(new PrivasimuLicenseInterceptor())
 *                   .addPathPatterns("/**")
 *                   .excludePathPatterns("/actuator/**", "/health");
 *       }
 *   }
 */

package id.privasimu.license;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.servlet.HandlerInterceptor;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Map;

public class PrivasimuLicenseInterceptor implements HandlerInterceptor {

    private final PrivasimuLicense checker;
    private static final ObjectMapper mapper = new ObjectMapper();

    public PrivasimuLicenseInterceptor() {
        this.checker = new PrivasimuLicense();
    }

    public PrivasimuLicenseInterceptor(PrivasimuLicense checker) {
        this.checker = checker;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String path = request.getRequestURI();
        if (checker.isExcluded(path)) return true;

        if (!checker.isValid()) {
            response.setStatus(403);
            String accept = request.getHeader("Accept");
            boolean isJson = (accept != null && accept.contains("json")) || path.startsWith("/api");

            if (isJson) {
                response.setContentType("application/json");
                mapper.writeValue(response.getWriter(), Map.of(
                        "error", "LICENSE_INVALID",
                        "message", "Aplikasi ini memerlukan license aktif dari Privasimu."
                ));
            } else {
                response.setContentType("text/html");
                response.getWriter().write(LOCK_HTML);
            }
            return false;
        }

        // Inject into request attributes
        request.setAttribute("privasimu.license", checker.getLicense());
        request.setAttribute("privasimu.package", checker.getPackageType());

        return true;
    }

    private static final String LOCK_HTML = """
            <!DOCTYPE html><html><head><meta charset="UTF-8"><title>License Required</title>
            <style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,sans-serif;background:#0f0a1e;color:#e2e8f0;display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center}.c{max-width:480px;padding:40px}h1{font-size:28px;font-weight:800;margin-bottom:12px}p{font-size:15px;color:#94a3b8;line-height:1.6;margin-bottom:24px}a{display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;text-decoration:none;border-radius:8px;font-weight:600}</style>
            </head><body><div class="c"><div style="font-size:64px;margin-bottom:24px">🔒</div><h1>Aplikasi Terkunci</h1><p>License Privasimu™ diperlukan.</p><a href="https://license-priva.sainskerta.net">Dapatkan License →</a></div></body></html>
            """;
}
