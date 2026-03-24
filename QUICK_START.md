# 🚀 COSMOS Quick Start

## For Users (Install COSMOS)

### Download & Install (30 seconds)

1. Download: `COSMOS_0.1.0_x64_en-US.exe`
2. Double-click the .exe file
3. Click "Next" through installer
4. Click "Finish"
5. **Done!** COSMOS launches automatically

### First Use (2 minutes)

```
1. Create a project:
   - Click "+" button in tab bar
   - Enter project name
   - Click "Create"

2. Start chatting:
   - Go to "💬 Chat" tab
   - Type a message
   - Press Ctrl+Enter to send

3. Optional - Install MCP servers:
   - Click "🏪 MCP" tab
   - Browse and install servers
```

### Settings

Access via **⚙️ Settings** tab to customize:
- Theme (dark/light)
- Font sizes
- Claude model
- Notifications

---

## For Developers (Build COSMOS)

### Prerequisites
- Windows 10+ (64-bit)
- Node.js 18+ - https://nodejs.org/
- Rust 1.81+ - https://rustup.rs/
- Git

### Build EXE (10 minutes)

#### Option 1: Batch Script (Easiest)
```batch
REM Windows Command Prompt
BUILD_WINDOWS.bat
```

#### Option 2: PowerShell
```powershell
powershell -ExecutionPolicy Bypass -File BUILD_WINDOWS.ps1
```

#### Option 3: Manual
```bash
npm install
npm run build
npm run tauri:build
```

### Output
```
src-tauri/target/release/bundle/nsis/
└── COSMOS_0.1.0_x64_en-US.exe  ← Your installer!
```

### Development

```bash
# Clone and setup
git clone <repo>
cd cosmos
npm install

# Start dev server (hot reload)
npm run tauri:dev

# Make changes and see them live!
```

---

## Key Features

### 5 AI Agents
- **PM** - Project oversight
- **Architect** - System design
- **Developer** - Implementation
- **Designer** - UI/UX
- **Security** - Security review

### Chat with Claude
- Real-time streaming
- Code highlighting
- Full conversation history

### Embedded Terminal
- Full shell support
- Command execution
- Output streaming

### Task Scheduler
- Schedule recurring tasks
- Cron pattern support
- Background execution

### MCP Marketplace
- 10+ ready-to-install servers
- GitHub, Docker, AWS, Slack, etc.

---

## Common Commands

### Terminal Tab
```bash
# List files
ls          # or: dir (Windows)

# Build project
npm run build

# Run app
npm start

# Check git status
git status
```

### Chat Tab
```
Ask Claude:
"What's the architecture of this project?"
"Help me debug this error"
"Suggest improvements"
"Create a task for X"
```

### Schedule Task
```
Create → Name: "Daily Backup"
Schedule: "daily" (or: "0 9 * * *")
Command: "npm run backup"
```

---

## Troubleshooting

### Claude CLI not found?
```bash
# Install Claude CLI
# Follow: https://github.com/anthropics/claude-code

# Verify:
claude --version
```

### Installer won't run?
```
- Check Windows version (10+, 64-bit)
- Run as Administrator
- Check disk space (1GB+)
- Update Visual C++ Redistributables
```

### High memory usage?
```
- Close unused terminals
- Disable unused agents
- Reduce agent count
```

---

## Documentation

| Document | For |
|----------|-----|
| **INSTALL.md** | Users installing COSMOS |
| **BUILD_GUIDE.md** | Developers building from source |
| **ARCHITECTURE.md** | Understanding the system |
| **README.md** | Feature overview |
| **RELEASE_SUMMARY.md** | Complete project summary |

---

## Quick Links

- **Repository**: https://github.com/yklein888/cosmos
- **Issues**: Report bugs there
- **Releases**: Download installers
- **License**: MIT (open source)

---

## File Locations

### Data
```
Windows: %APPDATA%\cosmos\
Linux:   ~/.cosmos/
Mac:     ~/Library/Application Support/cosmos/
```

### Settings
```
%APPDATA%\cosmos\settings.json
```

### Project Databases
```
YourProject/.cosmos/memory.db
```

---

## Next Steps

1. **Install**: Download and run .exe
2. **Create**: Make a project
3. **Chat**: Start using Claude
4. **Explore**: Try terminal and tasks
5. **Extend**: Install MCP servers

---

**Questions?** See the full documentation in this repository!

**Ready?** Build and launch COSMOS now! 🌌
