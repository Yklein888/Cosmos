# Build COSMOS Windows Installer (.EXE)
# PowerShell script for building on Windows
# Run: powershell -ExecutionPolicy Bypass -File BUILD_WINDOWS.ps1

Write-Host ""
Write-Host "========================================"
Write-Host "  COSMOS Windows Installer Builder"
Write-Host "========================================"
Write-Host ""

# Check prerequisites
Write-Host "Checking prerequisites..."

$nodeVersion = & node --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Node.js not found!" -ForegroundColor Red
    Write-Host "Install from https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

$npmVersion = & npm --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: npm not found!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

$rustVersion = & rustc --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Rust not found!" -ForegroundColor Red
    Write-Host "Install from https://rustup.rs/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Prerequisites OK!" -ForegroundColor Green
Write-Host "Node:  $nodeVersion"
Write-Host "npm:   $npmVersion"
Write-Host "Rust:  $rustVersion"
Write-Host ""

# Install dependencies
Write-Host ""
Write-Host "Step 1: Installing Node dependencies..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: npm install failed!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Build frontend
Write-Host ""
Write-Host "Step 2: Building React frontend..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Frontend build failed!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Build Tauri app
Write-Host ""
Write-Host "Step 3: Building COSMOS Windows installer..." -ForegroundColor Cyan
Write-Host "This may take 5-10 minutes on first build..."
npm run tauri:build
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Tauri build failed!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Output location
Write-Host ""
Write-Host "========================================"
Write-Host "  BUILD SUCCESSFUL!" -ForegroundColor Green
Write-Host "========================================"
Write-Host ""
Write-Host "Installer created at:"
Write-Host ""
Write-Host "   src-tauri\target\release\bundle\nsis\"
Write-Host ""
Write-Host "Files:"
Get-ChildItem -Path "src-tauri\target\release\bundle\nsis\*.exe" 2>$null | ForEach-Object {
    Write-Host "   - $($_.Name) ($([math]::Round($_.Length / 1MB, 2)) MB)"
}
Write-Host ""
Write-Host "To install COSMOS:"
Write-Host "1. Find COSMOS_0.1.0_x64_en-US.exe"
Write-Host "2. Double-click to run installer"
Write-Host "3. Follow installation wizard"
Write-Host ""
Read-Host "Press Enter to exit"
