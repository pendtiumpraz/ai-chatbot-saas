# 📦 Privasimu License SDK — C# / ASP.NET Core

## Cara Publish ke NuGet

### 1. Setup Akun NuGet
1. Register di [nuget.org](https://www.nuget.org/users/account/LogOn)
2. Buat API Key: Account → API Keys → Create

### 2. Build Package
```bash
cd sdk/dotnet

# Build
dotnet build -c Release

# Pack
dotnet pack -c Release
# Output: bin/Release/Privasimu.License.1.0.0.nupkg
```

### 3. Publish
```bash
# Push ke NuGet.org
dotnet nuget push bin/Release/Privasimu.License.1.0.0.nupkg \
  --api-key YOUR_API_KEY \
  --source https://api.nuget.org/v3/index.json
```

### 4. Update Versi
```xml
<!-- Privasimu.License.csproj -->
<Version>1.0.1</Version>
```
```bash
dotnet pack -c Release
dotnet nuget push bin/Release/Privasimu.License.1.0.1.nupkg --api-key YOUR_KEY --source https://api.nuget.org/v3/index.json
```

---

## Cara Pasang di Aplikasi

### ASP.NET Core (Minimal API / MVC / Blazor Server)

#### Step 1: Install
```bash
dotnet add package Privasimu.License
```

#### Step 2: `appsettings.json`
```json
{
  "Privasimu": {
    "LicenseKey": "PRIV-XXXX-XXXX-XXXX-XXXX",
    "LmUrl": "https://license-priva.sainskerta.net"
  }
}
```
Atau lewat environment variable:
```bash
set PRIVASIMU_LICENSE_KEY=PRIV-XXXX-XXXX-XXXX-XXXX
set PRIVASIMU_LM_URL=https://license-priva.sainskerta.net
```

#### Step 3: Register di `Program.cs` (2 baris)
```csharp
using Privasimu.License;

var builder = WebApplication.CreateBuilder(args);

// Register license checker
builder.Services.AddPrivasimuLicense();  // ← Baris 1

var app = builder.Build();

// Use license middleware
app.UsePrivasimuLicense();  // ← Baris 2

app.MapGet("/", () => "Licensed!");
app.Run();
```

#### Dengan Custom Config:
```csharp
builder.Services.AddPrivasimuLicense(opts =>
{
    opts.LicenseKey = builder.Configuration["Privasimu:LicenseKey"]!;
    opts.LmUrl = builder.Configuration["Privasimu:LmUrl"]!;
    opts.CacheTtlSeconds = 3600; // 1 jam
    opts.ExcludePaths = new() { "/health", "/swagger" };
});
```

#### Step 4: Gunakan di Controller / Endpoint
```csharp
// Inject LicenseChecker via DI
app.MapGet("/api/status", (LicenseChecker license) => new
{
    Licensed = license.IsValid(),
    Package = license.GetPackageType(),
    HasAI = license.HasFeature("ai_assistant"),
});

// Atau di Controller
[ApiController]
[Route("api/[controller]")]
public class StatusController : ControllerBase
{
    private readonly LicenseChecker _license;
    public StatusController(LicenseChecker license) => _license = license;

    [HttpGet]
    public IActionResult Get() => Ok(new
    {
        Licensed = _license.IsValid(),
        Package = _license.GetPackageType(),
    });
}
```

#### Feature Gating
```csharp
app.MapGet("/api/ai/generate", async (LicenseChecker license) =>
{
    if (!license.HasFeature("ai_assistant"))
        return Results.StatusCode(403);

    return Results.Ok(new { result = "AI content" });
});
```

#### Access License Info dari HttpContext
```csharp
app.MapGet("/api/info", (HttpContext ctx) =>
{
    var license = ctx.Items["privasimu.license"];   // Dictionary
    var package = ctx.Items["privasimu.package"];   // string
    return Results.Ok(new { package });
});
```

---

### Blazor Server
```csharp
// Program.cs — sama persis
builder.Services.AddPrivasimuLicense();
app.UsePrivasimuLicense();

// Di Razor component
@inject LicenseChecker License

@if (License.HasFeature("ai_assistant"))
{
    <AiChatComponent />
}
```
