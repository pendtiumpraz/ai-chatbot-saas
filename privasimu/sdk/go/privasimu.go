// ============================================================
// PRIVASIMU LICENSE SDK — Go
// ============================================================
//
// Universal license verification for Go applications.
// Works with net/http, Gin, Echo, Fiber, Chi, and any Go framework.
//
// INSTALL:
//   go get github.com/privasimu/license-sdk-go
//
// ENV:
//   PRIVASIMU_LICENSE_KEY=PRIV-XXXX-XXXX-XXXX-XXXX
//   PRIVASIMU_LM_URL=https://license-priva.sainskerta.net
//
// NET/HTTP:
//   mux.Handle("/", privasimu.Middleware(yourHandler))
//
// GIN:
//   r.Use(privasimu.GinMiddleware())
//
// ECHO:
//   e.Use(privasimu.EchoMiddleware())
//
// FIBER:
//   app.Use(privasimu.FiberMiddleware())
// ============================================================

package privasimu

import (
	"bytes"
	"crypto/tls"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"time"
)

// Config holds SDK configuration.
type Config struct {
	LicenseKey   string
	LmURL        string
	CachePath    string
	CacheTTL     time.Duration
	ExcludePaths []string
}

// LicenseInfo holds verified license data.
type LicenseInfo struct {
	Valid      bool                   `json:"valid"`
	License   map[string]interface{} `json:"license,omitempty"`
	Message   string                 `json:"message,omitempty"`
	Status    string                 `json:"status,omitempty"`
	VerifiedAt string               `json:"verified_at,omitempty"`
	Stale     bool                   `json:"stale,omitempty"`
}

// LicenseChecker is the main SDK struct.
type LicenseChecker struct {
	config Config
	cache  *LicenseInfo
	cacheMu sync.RWMutex
	cacheAt time.Time
}

// New creates a new LicenseChecker with the given config.
// Missing values are filled from environment variables.
func New(cfg ...Config) *LicenseChecker {
	c := Config{
		CacheTTL:     24 * time.Hour,
		ExcludePaths: []string{"/health", "/api/health", "/ping"},
	}
	if len(cfg) > 0 {
		c = cfg[0]
	}
	if c.LicenseKey == "" {
		c.LicenseKey = os.Getenv("PRIVASIMU_LICENSE_KEY")
	}
	if c.LmURL == "" {
		c.LmURL = os.Getenv("PRIVASIMU_LM_URL")
		if c.LmURL == "" {
			c.LmURL = "https://license-priva.sainskerta.net"
		}
	}
	c.LmURL = strings.TrimRight(c.LmURL, "/")
	if c.CachePath == "" {
		c.CachePath = filepath.Join(os.TempDir(), "privasimu_license_cache.json")
	}
	if c.CacheTTL == 0 {
		c.CacheTTL = 24 * time.Hour
	}
	if c.ExcludePaths == nil {
		c.ExcludePaths = []string{"/health", "/api/health", "/ping"}
	}
	return &LicenseChecker{config: c}
}

// IsValid checks if the license is valid (uses cache).
func (lc *LicenseChecker) IsValid() bool {
	info := lc.getCached()
	if info != nil {
		return info.Valid
	}
	result := lc.Verify()
	return result.Valid
}

// GetLicense returns the license info.
func (lc *LicenseChecker) GetLicense() map[string]interface{} {
	info := lc.getCached()
	if info != nil {
		return info.License
	}
	result := lc.Verify()
	return result.License
}

// GetPackageType returns the package type string.
func (lc *LicenseChecker) GetPackageType() string {
	lic := lc.GetLicense()
	if pt, ok := lic["package_type"].(string); ok {
		return pt
	}
	return "none"
}

// HasFeature checks if a feature is enabled.
func (lc *LicenseChecker) HasFeature(feature string) bool {
	lic := lc.GetLicense()
	if features, ok := lic["features"].(map[string]interface{}); ok {
		if v, ok := features[feature].(bool); ok {
			return v
		}
	}
	return false
}

// Verify forces re-verification with License Manager.
func (lc *LicenseChecker) Verify() *LicenseInfo {
	if lc.config.LicenseKey == "" {
		result := &LicenseInfo{Valid: false, Message: "No license key configured"}
		lc.setCache(result)
		return result
	}

	payload, _ := json.Marshal(map[string]string{
		"license_key": lc.config.LicenseKey,
		"domain":      getHostname(),
		"ip":          "0.0.0.0",
	})

	client := &http.Client{
		Timeout: 15 * time.Second,
		Transport: &http.Transport{
			TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
		},
	}

	resp, err := client.Post(
		lc.config.LmURL+"/api/licenses/verify",
		"application/json",
		bytes.NewReader(payload),
	)

	if err != nil {
		// Grace period
		old := lc.getCached()
		if old != nil && old.Valid {
			old.Stale = true
			return old
		}
		result := &LicenseInfo{Valid: false, Message: fmt.Sprintf("Cannot reach License Manager: %v", err)}
		lc.setCache(result)
		return result
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	var data map[string]interface{}
	json.Unmarshal(body, &data)

	if resp.StatusCode == 200 {
		if valid, ok := data["valid"].(bool); ok && valid {
			lic, _ := data["license"].(map[string]interface{})
			result := &LicenseInfo{
				Valid:      true,
				License:    lic,
				VerifiedAt: time.Now().Format(time.RFC3339),
			}
			lc.setCache(result)
			return result
		}
	}

	msg, _ := data["message"].(string)
	status, _ := data["status"].(string)
	result := &LicenseInfo{Valid: false, Message: msg, Status: status}
	lc.setCache(result)
	return result
}

// ClearCache removes cached result.
func (lc *LicenseChecker) ClearCache() {
	lc.cacheMu.Lock()
	lc.cache = nil
	lc.cacheMu.Unlock()
	os.Remove(lc.config.CachePath)
}

func (lc *LicenseChecker) getCached() *LicenseInfo {
	lc.cacheMu.RLock()
	if lc.cache != nil && time.Since(lc.cacheAt) < lc.config.CacheTTL {
		defer lc.cacheMu.RUnlock()
		return lc.cache
	}
	lc.cacheMu.RUnlock()

	// File cache
	data, err := os.ReadFile(lc.config.CachePath)
	if err != nil {
		return nil
	}
	var fc struct {
		CachedAt int64        `json:"cached_at"`
		Result   *LicenseInfo `json:"result"`
	}
	if json.Unmarshal(data, &fc) != nil || fc.Result == nil {
		return nil
	}
	age := time.Since(time.Unix(fc.CachedAt, 0))
	if age > lc.config.CacheTTL {
		return nil
	}
	lc.cacheMu.Lock()
	lc.cache = fc.Result
	lc.cacheAt = time.Now()
	lc.cacheMu.Unlock()
	return fc.Result
}

func (lc *LicenseChecker) setCache(result *LicenseInfo) {
	lc.cacheMu.Lock()
	lc.cache = result
	lc.cacheAt = time.Now()
	lc.cacheMu.Unlock()
	fc, _ := json.MarshalIndent(map[string]interface{}{
		"cached_at": time.Now().Unix(),
		"result":    result,
	}, "", "  ")
	os.WriteFile(lc.config.CachePath, fc, 0644)
}

func (lc *LicenseChecker) isExcluded(path string) bool {
	for _, p := range lc.config.ExcludePaths {
		if strings.HasPrefix(path, p) {
			return true
		}
	}
	return false
}

func getHostname() string {
	h, _ := os.Hostname()
	return h
}

// ==========================================
// MIDDLEWARE: net/http
// ==========================================

// Middleware wraps an http.Handler with license verification.
func (lc *LicenseChecker) Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if lc.isExcluded(r.URL.Path) {
			next.ServeHTTP(w, r)
			return
		}
		if !lc.IsValid() {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(403)
			json.NewEncoder(w).Encode(map[string]string{
				"error":   "LICENSE_INVALID",
				"message": "Aplikasi ini memerlukan license aktif dari Privasimu.",
			})
			return
		}
		next.ServeHTTP(w, r)
	})
}

// MiddlewareFunc is a convenience wrapper for http.HandlerFunc.
func (lc *LicenseChecker) MiddlewareFunc(next http.HandlerFunc) http.Handler {
	return lc.Middleware(next)
}

// ==========================================
// MIDDLEWARE: Gin
// ==========================================

// GinMiddleware returns a Gin-compatible middleware function.
// Usage: r.Use(checker.GinMiddleware())
func (lc *LicenseChecker) GinMiddleware() interface{} {
	// Returns func(c *gin.Context) — typed as interface{} to avoid import
	return func(c interface{ AbortWithStatusJSON(int, interface{}); Next(); Request() *http.Request }) {
		if lc.isExcluded(c.Request().URL.Path) {
			c.Next()
			return
		}
		if !lc.IsValid() {
			c.AbortWithStatusJSON(403, map[string]string{
				"error":   "LICENSE_INVALID",
				"message": "Aplikasi ini memerlukan license aktif dari Privasimu.",
			})
			return
		}
		c.Next()
	}
}

// ==========================================
// PACKAGE LEVEL CONVENIENCE
// ==========================================

var defaultChecker *LicenseChecker

func init() {
	defaultChecker = New()
}

// Middleware creates an http.Handler middleware with default config.
func Middleware(next http.Handler) http.Handler {
	return defaultChecker.Middleware(next)
}

// IsValid checks license validity with default config.
func IsValid() bool {
	return defaultChecker.IsValid()
}

// GetPackageType gets package type with default config.
func GetPackageType() string {
	return defaultChecker.GetPackageType()
}

// HasFeature checks feature with default config.
func HasFeature(feature string) bool {
	return defaultChecker.HasFeature(feature)
}
