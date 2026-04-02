# 📦 Privasimu License SDK — Java / Spring Boot

## Cara Publish ke Maven Central

### 1. Setup Akun Sonatype (Maven Central)
1. Register di [central.sonatype.com](https://central.sonatype.com/)
2. Claim namespace `id.privasimu` (perlu verifikasi domain)
3. Generate **User Token** di Account → User Token

### 2. Setup `~/.m2/settings.xml`
```xml
<settings>
  <servers>
    <server>
      <id>central</id>
      <username>YOUR_TOKEN_USERNAME</username>
      <password>YOUR_TOKEN_PASSWORD</password>
    </server>
  </servers>
</settings>
```

### 3. Setup GPG Signing (wajib untuk Maven Central)
```bash
gpg --gen-key
gpg --keyserver keyserver.ubuntu.com --send-keys YOUR_KEY_ID
```

### 4. Deploy
```bash
cd sdk/java
mvn clean deploy -P release
```

### Alternatif: GitHub Packages (lebih mudah)
```xml
<!-- pom.xml tambahkan -->
<distributionManagement>
  <repository>
    <id>github</id>
    <url>https://maven.pkg.github.com/privasimu/license-sdk-java</url>
  </repository>
</distributionManagement>
```
```bash
mvn deploy
```

### 5. Gradle (publish ke Maven Central alternatif)
```kotlin
// build.gradle.kts
plugins { id("maven-publish") }
publishing {
    publications { create<MavenPublication>("maven") { from(components["java"]) } }
}
```

---

## Cara Pasang di Aplikasi

### Spring Boot

#### Step 1: Install

**Maven:**
```xml
<dependency>
    <groupId>id.privasimu</groupId>
    <artifactId>license-sdk</artifactId>
    <version>1.0.0</version>
</dependency>
```

**Gradle:**
```kotlin
implementation("id.privasimu:license-sdk:1.0.0")
```

#### Step 2: `application.properties`
```properties
# Atau gunakan environment variables
privasimu.license-key=PRIV-XXXX-XXXX-XXXX-XXXX
privasimu.lm-url=https://license-priva.sainskerta.net
```

#### Step 3: Register Interceptor
```java
import id.privasimu.license.PrivasimuLicenseInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new PrivasimuLicenseInterceptor())
                .addPathPatterns("/**")
                .excludePathPatterns("/actuator/**", "/health");
    }
}
```

#### Step 4: Gunakan di Controller
```java
import id.privasimu.license.PrivasimuLicense;

@RestController
public class ApiController {

    private final PrivasimuLicense license = new PrivasimuLicense();

    @GetMapping("/api/status")
    public Map<String, Object> status() {
        return Map.of(
            "licensed", license.isValid(),
            "package", license.getPackageType(),
            "hasAI", license.hasFeature("ai_assistant")
        );
    }

    @GetMapping("/api/ai/generate")
    public ResponseEntity<?> aiGenerate() {
        if (!license.hasFeature("ai_assistant")) {
            return ResponseEntity.status(403).body(Map.of(
                "error", "Fitur ini memerlukan paket Pro"
            ));
        }
        return ResponseEntity.ok(Map.of("result", "AI content"));
    }
}
```

---

### Jakarta EE / Servlet Filter (tanpa Spring)
```java
import id.privasimu.license.PrivasimuLicense;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import java.io.IOException;

public class LicenseFilter implements Filter {
    private final PrivasimuLicense checker = new PrivasimuLicense();

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {
        if (!checker.isValid()) {
            ((HttpServletResponse) res).sendError(403, "License required");
            return;
        }
        chain.doFilter(req, res);
    }
}
```
```xml
<!-- web.xml -->
<filter>
    <filter-name>licenseFilter</filter-name>
    <filter-class>com.yourapp.LicenseFilter</filter-class>
</filter>
<filter-mapping>
    <filter-name>licenseFilter</filter-name>
    <url-pattern>/*</url-pattern>
</filter-mapping>
```
