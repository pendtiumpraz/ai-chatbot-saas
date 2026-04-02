# 📦 Privasimu License SDK — Go (net/http / Gin / Echo / Fiber)

## Cara Publish ke Go Modules

### 1. Buat Repository GitHub
```bash
cd sdk/go
git init
git remote add origin https://github.com/privasimu/license-sdk-go.git
git add -A
git commit -m "v1.0.0 — Privasimu License SDK for Go"
git tag v1.0.0
git push origin main --tags
```

### 2. Selesai!
Go Modules otomatis mengambil dari GitHub. Tidak perlu daftar ke registry apapun (seperti npm/PyPI). Cukup push ke GitHub dengan tag semver.

### 3. Update Versi
```bash
# Edit code → commit
git tag v1.0.1
git push origin main --tags
```

### 4. Trigger Module Proxy (opsional, untuk caching cepat)
```bash
GOPROXY=proxy.golang.org go list -m github.com/privasimu/license-sdk-go@v1.0.0
```

---

## Cara Pasang di Aplikasi

### net/http (Standard Library)

#### Step 1: Install
```bash
go get github.com/privasimu/license-sdk-go
```

#### Step 2: Environment
```bash
export PRIVASIMU_LICENSE_KEY=PRIV-XXXX-XXXX-XXXX-XXXX
export PRIVASIMU_LM_URL=https://license-priva.sainskerta.net
```

#### Step 3: Pasang Middleware
```go
package main

import (
    "fmt"
    "net/http"
    privasimu "github.com/privasimu/license-sdk-go"
)

func main() {
    checker := privasimu.New() // auto-baca dari env

    mux := http.NewServeMux()
    mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprintf(w, "Licensed! Package: %s", checker.GetPackageType())
    })

    // Wrap dengan middleware
    protected := checker.Middleware(mux)

    http.ListenAndServe(":8080", protected)
}
```

---

### Gin

```go
package main

import (
    "net/http"
    "github.com/gin-gonic/gin"
    privasimu "github.com/privasimu/license-sdk-go"
)

func main() {
    checker := privasimu.New()
    r := gin.Default()

    // Middleware global
    r.Use(func(c *gin.Context) {
        if checker.IsExcluded(c.Request.URL.Path) {
            c.Next()
            return
        }
        if !checker.IsValid() {
            c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
                "error":   "LICENSE_INVALID",
                "message": "License Privasimu diperlukan.",
            })
            return
        }
        c.Set("privasimu_package", checker.GetPackageType())
        c.Next()
    })

    r.GET("/", func(c *gin.Context) {
        pkg, _ := c.Get("privasimu_package")
        c.JSON(200, gin.H{"package": pkg, "licensed": true})
    })

    r.Run(":8080")
}
```

---

### Echo

```go
package main

import (
    "net/http"
    "github.com/labstack/echo/v4"
    privasimu "github.com/privasimu/license-sdk-go"
)

func main() {
    checker := privasimu.New()
    e := echo.New()

    e.Use(func(next echo.HandlerFunc) echo.HandlerFunc {
        return func(c echo.Context) error {
            if checker.IsExcluded(c.Path()) { return next(c) }
            if !checker.IsValid() {
                return c.JSON(http.StatusForbidden, map[string]string{
                    "error": "LICENSE_INVALID",
                })
            }
            c.Set("privasimu_package", checker.GetPackageType())
            return next(c)
        }
    })

    e.GET("/", func(c echo.Context) error {
        return c.JSON(200, map[string]interface{}{
            "package": c.Get("privasimu_package"),
        })
    })

    e.Start(":8080")
}
```

---

### Fiber

```go
package main

import (
    "github.com/gofiber/fiber/v2"
    privasimu "github.com/privasimu/license-sdk-go"
)

func main() {
    checker := privasimu.New()
    app := fiber.New()

    app.Use(func(c *fiber.Ctx) error {
        if checker.IsExcluded(c.Path()) { return c.Next() }
        if !checker.IsValid() {
            return c.Status(403).JSON(fiber.Map{"error": "LICENSE_INVALID"})
        }
        c.Locals("privasimu_package", checker.GetPackageType())
        return c.Next()
    })

    app.Get("/", func(c *fiber.Ctx) error {
        return c.JSON(fiber.Map{"package": c.Locals("privasimu_package")})
    })

    app.Listen(":8080")
}
```

---

### Feature Gating
```go
checker := privasimu.New()

if checker.HasFeature("ai_assistant") {
    // AI features available
}
if checker.GetPackageType() == "ai_agent" {
    // Enterprise features
}
```
