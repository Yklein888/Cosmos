# 📦 COSMOS Installation Guide

**Complete guide for installing COSMOS on Windows**

## System Requirements

### Minimum
- **OS**: Windows 10 or later (64-bit)
- **RAM**: 2 GB
- **Disk**: 500 MB free space
- **Internet**: Required for Claude integration

### Recommended
- **OS**: Windows 11 (latest)
- **RAM**: 4+ GB
- **Disk**: 1 GB free space
- **Processor**: Intel i5 or equivalent

## Installation Methods

### Method 1: Windows Installer (.EXE) - Recommended

1. **Download**
   - Get `COSMOS_0.1.0_x64_en-US.exe` from releases
   - Size: ~40-50 MB

2. **Install**
   - Double-click the `.exe` file
   - Choose installation directory (default: `C:\Program Files\COSMOS`)
   - Follow installer wizard
   - Click "Finish"

3. **Run**
   - COSMOS starts automatically
   - Or find "COSMOS" in Start Menu

### Method 2: MSI Installer

1. **Download**
   - Get `COSMOS_0.1.0_x64_en-US.msi`

2. **Install**
   - Right-click → "Install"
   - Or double-click and follow wizard

3. **Admin Requirements**
   - May require Administrator privileges
   - Better for corporate deployments

## First Launch

### Initial Setup

1. **Create Project**
   - Click "+" in Project Tab Bar
   - Enter project name
   - Select directory

2. **Configure Claude**
   - Settings → About
   - Verify Claude CLI is installed
   - Set default model (Sonnet/Opus/Haiku)

3. **Install MCP Servers** (Optional)
   - Go to MCP tab
   - Browse featured servers
   - Click "Install" for each needed server

### Running Commands

```bash
# Chat with Claude
💬 Chat tab → Type message → Ctrl+Enter

# Execute terminal commands
🖥️ Terminal tab → Type command → Enter

# Schedule tasks
⏲️ Tasks → Create scheduled task → Set cron pattern
```

## Configuration

### Settings Panel

Access via **⚙️ Settings** tab:

- **Theme**: Dark/Light mode
- **Font Size**: Adjust UI text (12-18px)
- **Terminal Font**: Adjust terminal text (10-16px)
- **Claude Model**: Select AI model
  - Sonnet (recommended)
  - Opus (most capable)
  - Haiku (fastest)
- **Auto-Save**: Enable/disable auto-saving
- **Notifications**: Enable/disable notifications

### Project Structure

```
Your Project/
├── .cosmos/
│   └── memory.db          # Agent memories
├── .claude/
│   └── mcp.json           # MCP configuration
└── ... (your project files)
```

## Features

### Chat Interface 💬
- Real-time streaming from Claude
- Markdown formatting support
- Code block syntax highlighting
- Agent selection
- Message history

### Terminal 🖥️
- Cross-platform shell support
- Syntax highlighting
- Full command history
- Auto-completion ready

### Agents 🤖
- 5 specialized AI agents
- Project-scoped memory
- Decision tracking
- Pattern recognition
- Warning logs

### MCP Marketplace 🏪
- 10+ featured MCP servers
- One-click installation
- GitHub integration
- Database connections
- Cloud service access

### Task Scheduler ⏲️
- Recurring task scheduling
- Cron pattern support
- Background execution
- History tracking
- Manual execution

## Troubleshooting

### COSMOS Won't Start

**Problem**: Application crashes on startup

**Solutions**:
1. Uninstall completely
   - Remove from "Add/Remove Programs"
   - Delete `C:\Program Files\COSMOS`
   - Delete `%APPDATA%\cosmos`

2. Reinstall
   - Download fresh installer
   - Run as Administrator
   - Follow wizard

### Claude Integration Not Working

**Problem**: "Claude CLI not found"

**Solutions**:
1. Install Claude CLI
   - https://github.com/anthropics/claude-code
   - Follow installation instructions
   - Verify: `claude --version` in terminal

2. Check PATH
   - Press Win+R
   - Type: `sysdm.cpl`
   - Environment Variables → PATH
   - Ensure Claude is in PATH

3. Restart COSMOS
   - Close application
   - Reopen
   - Check Settings → Claude version

### Terminal Not Working

**Problem**: Terminal shows "not initialized"

**Solutions**:
1. Select a project first
   - Terminal requires active project
   - Create or select project in tabs

2. Check permissions
   - Ensure project directory is writable
   - Try different directory

3. Restart application

### High Memory Usage

**Problem**: COSMOS using too much RAM

**Solutions**:
1. Close unused terminals
   - Each terminal uses ~50MB

2. Reduce agent count
   - Settings → Disable unused agents

3. Clear memory cache
   - Delete `.cosmos/memory.db`
   - Memories will be recreated

### Installer Won't Run

**Problem**: "This app can't run on your PC"

**Solutions**:
1. Check Windows version
   - Must be Windows 10 or later (64-bit)
   - Check: Settings → System → About

2. Enable Windows Subsystem for Linux (WSL)
   - Open PowerShell as Admin
   - Run: `wsl --install`
   - Restart computer

3. Update Visual C++ Redistributables
   - Download from Microsoft
   - Install latest version
   - Restart

## Uninstallation

### Method 1: Settings
1. Press Win+I (Settings)
2. Apps → Apps & Features
3. Find "COSMOS"
4. Click → Uninstall

### Method 2: Control Panel
1. Press Win+R
2. Type: `appwiz.cpl`
3. Find "COSMOS"
4. Click "Uninstall"

### Method 3: Manual
1. Delete `C:\Program Files\COSMOS`
2. Delete `%APPDATA%\cosmos`
3. Remove from Start Menu

## Advanced Configuration

### Custom Claude Model

Edit `%APPDATA%\cosmos\settings.json`:

```json
{
  "defaultModel": "claude-opus-4-6",
  "enableNotifications": true,
  "autoSave": true
}
```

### MCP Server Configuration

Edit `.claude/mcp.json` in project:

```json
{
  "mcpServers": {
    "github": {
      "command": "node",
      "args": ["server.js"],
      "env": {
        "GITHUB_TOKEN": "your-token"
      }
    }
  }
}
```

## Performance Tips

1. **Reduce Agent Count**
   - Disable unused agents in Settings
   - Each agent uses ~10MB memory

2. **Clear History**
   - Trim old conversations
   - Archive memories

3. **Update Regularly**
   - Check for app updates
   - Update Claude CLI
   - Update MCP servers

4. **System Resources**
   - Close other heavy applications
   - Ensure 2GB+ free RAM
   - Check disk space (500MB+)

## Getting Help

### Documentation
- **README.md** - Features and overview
- **ARCHITECTURE.md** - Technical design
- **BUILD_GUIDE.md** - Building from source

### Support
- GitHub Issues: https://github.com/yklein888/cosmos/issues
- Email: support@cosmos.app (future)

### Community
- Discussions: GitHub Discussions
- Discord: (coming soon)

## Updates

### Check for Updates
- Settings → About
- Shows current version
- Links to releases

### Install Updates
1. Download new installer
2. Run installer (automatic upgrade)
3. Existing projects preserved
4. Settings preserved

## Data Privacy

### Local Storage
- All data stored locally
- No cloud sync by default
- Full control over data

### Optional Cloud Backup
- Future: Notion sync (opt-in)
- Encrypted storage
- User control

## License

COSMOS is MIT Licensed. See LICENSE file for details.

---

**Questions?** Check the documentation or GitHub issues!

**Ready to get started?** Launch COSMOS and create your first project! 🌌
