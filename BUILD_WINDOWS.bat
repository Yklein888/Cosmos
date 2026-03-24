@echo off
REM Build COSMOS Windows Installer (.EXE)
REM Run this script on Windows with Node.js, npm, and Rust installed

echo.
echo ========================================
echo   COSMOS Windows Installer Builder
echo ========================================
echo.

REM Check prerequisites
echo Checking prerequisites...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js not found! Install from https://nodejs.org/
    pause
    exit /b 1
)

where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm not found! Install Node.js
    pause
    exit /b 1
)

where rustc >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Rust not found! Install from https://rustup.rs/
    pause
    exit /b 1
)

echo.
echo Prerequisites OK!
echo Node: && node --version
echo npm: && npm --version
echo Rust: && rustc --version
echo.

REM Install dependencies
echo.
echo Step 1: Installing Node dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm install failed!
    pause
    exit /b 1
)

REM Build frontend
echo.
echo Step 2: Building React frontend...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Frontend build failed!
    pause
    exit /b 1
)

REM Build Tauri app
echo.
echo Step 3: Building COSMOS Windows installer...
echo This may take 5-10 minutes on first build...
call npm run tauri:build
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Tauri build failed!
    pause
    exit /b 1
)

REM Output location
echo.
echo ========================================
echo   BUILD SUCCESSFUL!
echo ========================================
echo.
echo Installer created at:
echo.
echo   src-tauri\target\release\bundle\nsis\
echo.
echo Files:
dir "src-tauri\target\release\bundle\nsis\*.exe" 2>nul
echo.
echo To install COSMOS:
echo 1. Find COSMOS_0.1.0_x64_en-US.exe
echo 2. Double-click to run installer
echo 3. Follow installation wizard
echo.
pause
