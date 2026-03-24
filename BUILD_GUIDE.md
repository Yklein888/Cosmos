# 🚀 COSMOS Build Guide

Complete instructions for building COSMOS desktop application and Windows installer.

## Prerequisites

### Required
- **Node.js 18+** - https://nodejs.org/
- **npm or yarn** - Included with Node.js
- **Rust 1.81+** - https://rustup.rs/
- **Visual C++ Build Tools** (Windows only) - Required by Rust

### Optional (for development)
- Visual Studio Code
- Rust Analyzer extension
- Tauri CLI

## Installation Steps

### 1. Install Rust (if not already installed)

```bash
# Download and install rustup
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Verify installation
rustc --version
cargo --version
```

### 2. Clone and Setup Project

```bash
# Clone repository
git clone https://github.com/yklein888/cosmos.git
cd cosmos

# Install Node dependencies
npm install

# Verify Tauri CLI is available
npm run tauri --version
```

### 3. Verify Configuration

Check that key files exist:
- `tauri.conf.json` - Tauri configuration
- `Cargo.toml` - Rust dependencies
- `package.json` - Node dependencies
- `src-tauri/src/main.rs` - Rust entry point

## Development Build

### Run Development Server

```bash
# Start development mode with hot reload
npm run tauri:dev
```

This will:
1. Start Vite dev server (http://localhost:5173)
2. Compile Rust backend
3. Open Tauri window
4. Enable hot reload for React changes

### Debug Build

```bash
# Build in debug mode (faster, with debug symbols)
cargo build

# Run with devtools
npm run tauri:dev -- --dev-tools
```

## Production Build

### 1. Build Frontend

```bash
# Build React frontend for production
npm run build

# Output goes to dist/
```

### 2. Build Desktop Application

```bash
# Build Tauri desktop app (Windows executable + installer)
npm run tauri:build
```

This creates:
- `src-tauri/target/release/` - Binary files
- `src-tauri/target/release/bundle/` - Installer files

### Output Files

**Windows Installer** (recommended):
```
COSMOS_0.1.0_x64_en-US.msi          # MSI installer
COSMOS_0.1.0_x64_en-US.exe          # NSIS installer (recommended)
```

**Location**: `src-tauri/target/release/bundle/`

### 3. Create Production Build (Step-by-Step)

```bash
# 1. Clean previous builds
npm run tauri:build -- --clean

# 2. Build frontend
npm run build

# 3. Build and bundle application
npm run tauri:build

# 4. Wait for completion (5-10 minutes on first build)
```

## Windows Installer (.EXE)

### Generated Files

After `npm run tauri:build`, you'll find:

```
src-tauri/target/release/bundle/
├── nsis/
│   ├── COSMOS_0.1.0_x64_en-US.exe    ✅ Windows Installer
│   ├── NSIS_x64-setup/               ✅ Uninstaller
│   └── ...
├── msi/
│   └── COSMOS_0.1.0_x64_en-US.msi    ✅ Alternative MSI installer
└── ...
```

### Install COSMOS

1. Download `COSMOS_0.1.0_x64_en-US.exe`
2. Double-click to run installer
3. Follow installation wizard
4. Choose installation directory
5. COSMOS starts automatically

### Uninstall COSMOS

**Method 1: Control Panel**
- Settings → Apps → COSMOS → Uninstall

**Method 2: Installer**
- Run `Uninstall COSMOS` from Start Menu

## Distribution

### Create Release on GitHub

```bash
# 1. Create git tag
git tag v0.1.0

# 2. Push tag
git push origin v0.1.0

# 3. Create release on GitHub
# - Upload .exe file
# - Upload .msi file
# - Add release notes
```

### Share Installer

- **Recommended**: Use `COSMOS_0.1.0_x64_en-US.exe` (NSIS)
  - Smaller download
  - Better user experience
  - Standard Windows installer

- **Alternative**: Use `.msi` file
  - Compatible with enterprise deployments
  - Group Policy deployments

## Troubleshooting

### Build Fails with "Rust Not Found"

```bash
# Reinstall Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Update Rust
rustup update
```

### "Visual C++ Build Tools Not Installed"

```bash
# Install Visual C++ Build Tools
# Download from: https://visualstudio.microsoft.com/downloads/
# Select "Desktop development with C++"
```

### Installer Creation Fails

```bash
# Clean and rebuild
npm run tauri:build -- --clean

# Check disk space (need ~2GB)
# Check internet connection
```

### App Won't Start After Installation

```bash
# Check logs
# Windows: %APPDATA%/cosmos/logs/

# Reinstall
# Uninstall COSMOS completely
# Delete C:\Program Files\COSMOS
# Run installer again
```

## Optimization Tips

### Reduce Binary Size

```bash
# Use release profile in Cargo.toml
[profile.release]
opt-level = "z"     # Optimize for size
lto = true          # Enable Link Time Optimization
```

### Faster Builds

```bash
# Use incremental compilation
export CARGO_INCREMENTAL=1

# Build in release mode
cargo build --release
```

## Advanced Configuration

### Custom Installer Icon

Replace icon files in `src-tauri/icons/`:
- `icon.ico` - 256x256 Windows icon
- `icon.icns` - macOS icon (future)

### Custom Product Name

Edit `tauri.conf.json`:
```json
{
  "productName": "COSMOS",
  "version": "0.1.0"
}
```

### Signing Executables (Optional)

For production releases with code signing:

```bash
# Generate certificate
signtool sign /f certificate.pfx /p password /t http://timestamp.server /d "COSMOS" output.exe
```

## Size and Performance

| Metric | Value |
|--------|-------|
| Installer | ~40-50 MB |
| Installed Size | ~150-200 MB |
| Memory Usage | ~100-200 MB (idle) |
| Startup Time | ~2-3 seconds |

## Next Steps

After building:

1. **Test Installation**
   - Run installer on fresh Windows VM
   - Test all features
   - Check for missing dependencies

2. **Create Release**
   - Tag version in git
   - Create GitHub release
   - Upload installer files

3. **Distribute**
   - Share .exe on website
   - Add to app stores
   - Release notes

## Resources

- **Tauri Docs**: https://tauri.app/
- **Rust Guide**: https://doc.rust-lang.org/
- **Cargo Book**: https://doc.rust-lang.org/cargo/
- **Node.js**: https://nodejs.org/docs/

## Support

For build issues:
1. Check Rust version: `rustc --version`
2. Update toolchain: `rustup update`
3. Check Node version: `node --version`
4. Clear cache: `npm cache clean --force`

---

**Last Updated**: March 24, 2026
**Maintainer**: COSMOS Team
