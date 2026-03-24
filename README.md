# 🌌 COSMOS

**Multi-Agent Intelligence Platform for Claude Code**

A powerful desktop application built with Tauri + React that provides a unified development environment with five specialized AI agents, project management, terminal integration, task scheduling, and MCP marketplace.

[![Status](https://img.shields.io/badge/Status-v0.1.0%20Complete-success?style=flat-square)](https://github.com/yklein888/cosmos)
[![Version](https://img.shields.io/badge/Version-0.1.0-blue?style=flat-square)](https://github.com/yklein888/cosmos/releases)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![GitHub Issues](https://img.shields.io/github/issues/yklein888/cosmos?style=flat-square)](https://github.com/yklein888/cosmos/issues)
[![Platform](https://img.shields.io/badge/Platform-Windows%2010%2B-blue?style=flat-square)](#)
[![Built with Tauri](https://img.shields.io/badge/Built%20with-Tauri%202.0-24C8D8?style=flat-square)](https://tauri.app/)

## 🎯 Vision

COSMOS brings **five specialized AI agents** working together in a unified desktop environment:

| Agent | Role | Purpose |
|-------|------|---------|
| 🎯 **PM** | Project Manager | Oversee scope, timeline, resource allocation |
| 🏗️ **Architect** | System Architect | Design scalable, maintainable systems |
| 💻 **Developer** | Senior Developer | Implement features, fix bugs, ensure quality |
| 🎨 **Designer** | UI/UX Designer | Create beautiful, intuitive interfaces |
| 🔒 **Security** | Security Expert | Identify vulnerabilities, harden systems |

## ✨ Features

### Phase 1: Foundation ✅
- ✅ Tauri 2.0 + React 19 + TypeScript setup
- ✅ Zustand state management (5 stores)
- ✅ SQLite database schema
- ✅ Tauri IPC command architecture

### Phase 2: Claude Integration ✅
- ✅ Claude CLI detection and validation
- ✅ Subprocess spawning with stream handling
- ✅ Real-time message streaming via Tokio
- ✅ Markdown parser (code blocks, formatting)
- ✅ Chat UI (messages, input, formatting)
- ✅ Message persistence to SQLite

### Phase 3: Multi-Project & Terminal ✅
- ✅ Project tab navigation
- ✅ Multi-project switching with instant context
- ✅ xterm.js embedded terminal
- ✅ Shell command execution (cross-platform)
- ✅ PTY spawning support
- ✅ Terminal commands: execute, list, navigate

### Phase 4: Agent System & Memory ✅
- ✅ Global 5-agent pool (always available)
- ✅ Project-scoped memory (complete isolation)
- ✅ Memory types: decisions, context, warnings, patterns
- ✅ Tag-based memory organization
- ✅ Agent configuration and enablement
- ✅ Memory search and filtering

### Phase 5: MCP Marketplace ✅
- ✅ 10+ featured MCP servers
- ✅ One-click installation interface
- ✅ Category-based organization
- ✅ Search and filtering capabilities
- ✅ Repository links for each server
- ✅ Install/uninstall toggle

### Phase 6: Task Scheduler ✅
- ✅ Create recurring tasks
- ✅ Schedule patterns (daily, hourly, weekly, monthly, custom)
- ✅ Background execution (separate tokio thread)
- ✅ Task enable/disable toggle
- ✅ Execution history tracking
- ✅ Manual task execution

### Phase 7: Build & Polish ✅
- ✅ Comprehensive documentation
- ✅ Complete feature implementation
- ✅ Architecture documentation
- ✅ Setup and build instructions

## 🏗️ Architecture

### Technology Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | React 19 + TypeScript + Vite |
| **Desktop** | Tauri 2.0 (Rust-based) |
| **Backend** | Rust + Tokio |
| **Database** | SQLite (per-project) |
| **State** | Zustand |
| **Terminal** | xterm.js + Tauri PTY |
| **Styling** | CSS3 (Dark theme) |

### Project Isolation

**Perfect isolation between projects** - Each project has:
- Its own SQLite database in `<project>/.cosmos/memory.db`
- Isolated agent memories
- Separate terminal contexts
- No cross-project data leakage

### Global Agent System

5 agents are initialized globally but maintain **project-scoped memories**:
- Agents are always available (not tied to specific projects)
- Agent memories are loaded per project
- Switching projects updates agent context
- Complete isolation prevents memory leakage

### IPC Communication

React ↔ Rust bridge via Tauri:
```typescript
const result = await invoke('command_name', { projectPath, data })
```

All commands are type-safe with Zustand stores managing state.

## 📁 Project Structure

```
cosmos/
├── src/                              # React frontend (TypeScript)
│   ├── components/
│   │   ├── v2/                      # Main layout components
│   │   ├── chat/                    # Claude chat interface
│   │   ├── terminal/                # xterm.js terminal
│   │   ├── agents/                  # Agent management UI
│   │   ├── mcp/                     # MCP marketplace
│   │   ├── tasks/                   # Task scheduler
│   │   └── layout/                  # Navigation components
│   ├── store/                       # Zustand state
│   ├── hooks/                       # React hooks (IPC, terminal)
│   ├── utils/                       # Helpers (markdown, API client)
│   └── data/                        # Constants (MCP servers)
│
├── src-tauri/                        # Rust backend
│   ├── src/
│   │   ├── commands/                # Tauri IPC handlers
│   │   │   ├── claude.rs            # Claude CLI integration
│   │   │   ├── conversations.rs     # Chat management
│   │   │   ├── terminal.rs          # Shell execution
│   │   │   ├── agents.rs            # Agent operations
│   │   │   ├── memory.rs            # Memory persistence
│   │   │   └── tasks.rs             # Task scheduling
│   │   ├── services/                # Business logic
│   │   │   ├── claude.rs            # Claude subprocess
│   │   │   ├── cli_checker.rs       # CLI detection
│   │   │   ├── terminal.rs          # PTY/Shell service
│   │   │   ├── memory_engine.rs     # Memory storage
│   │   │   ├── scheduler.rs         # Background tasks
│   │   │   ├── agent_manager.rs     # Agent pool
│   │   │   └── mcp_manager.rs       # MCP management
│   │   ├── db/                      # Database
│   │   │   ├── sqlite.rs            # SQLite wrapper
│   │   │   └── schema.rs            # Database schema
│   │   └── main.rs                  # Entry point
│   ├── Cargo.toml
│   └── tauri.conf.json
│
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html
├── README.md
└── .gitignore
```

## 🚀 Getting Started

### Prerequisites
- **Rust 1.81+** - [Install](https://rustup.rs/)
- **Node 18+** - [Install](https://nodejs.org/)
- **npm or yarn** - [Install](https://docs.npmjs.com/cli/v9)

### Installation

```bash
# 1. Clone and navigate
git clone https://github.com/yklein888/cosmos.git
cd cosmos

# 2. Install dependencies
npm install

# 3. Run development server
npm run tauri:dev

# 4. Build for production
npm run tauri:build
```

### Development

```bash
# Frontend development (Vite + React hot reload)
npm run dev

# Backend development (Rust compilation)
cargo build

# Run with devtools
npm run tauri:dev

# Build desktop app
npm run tauri:build
```

## 📊 Database Schema

### Tables
- **conversations** - Chat sessions per project
- **messages** - Chat messages with agent metadata
- **project_memory** - Agent decisions, context, warnings, patterns
- **projects** - Project metadata and paths
- **mcp_servers** - Installed MCP servers and config
- **settings** - Application settings

### Isolation
- Project path serves as partition key
- Memory queries filtered by project path
- No cross-project queries possible
- Each project has independent data

## 🔌 API Commands

### Chat
- `send_message_to_claude` - Send message and get response
- `stream_claude_response` - Stream response chunks
- `create_conversation` - Create new chat session
- `add_message_to_conversation` - Store message

### Terminal
- `execute_terminal_command` - Run shell command
- `list_directory` - List files in directory
- `get_working_directory` - Get current path

### Agents
- `get_all_agents` - List all 5 agents
- `save_agent_memory` - Store agent memory
- `get_agent_memories` - Retrieve memories
- `search_memories` - Search by tag

### Tasks
- `create_task` - Schedule task
- `execute_task` - Run task immediately
- `get_task_results` - Task execution history
- `toggle_task` - Enable/disable

### Projects
- `create_project` - Create new project
- `get_projects` - List projects
- `switch_project_context` - Update agent context

## 🎨 UI/UX

### Dark Theme
- Primary: `#0a0e27` (Dark blue)
- Card: `#151a2e` (Slightly lighter)
- Accent: `#6366f1` (Indigo)
- Text: `#e0e7ff` (Light gray)

### Components
- Tab-based navigation (Chat, Terminal, MCP)
- Project tabs with instant switching
- Modal dialogs for creation flows
- Responsive grid layouts
- Dark theme throughout

## 📚 Resources

- [Tauri Docs](https://tauri.app/)
- [React Docs](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Zustand](https://github.com/pmndrs/zustand)
- [xterm.js](https://xtermjs.org/)

## 🤝 Contributing

COSMOS is open source. Contributions welcome!

### Development Workflow
1. Fork and clone
2. Create feature branch
3. Implement with tests
4. Submit pull request

## 📄 License

MIT License - See LICENSE file for details

---

**🌌 Build Status**: All 7 Phases Complete ✅
- Phase 1: Foundation ✅
- Phase 2: Claude Integration ✅
- Phase 3: Projects & Terminal ✅
- Phase 4: Agents & Memory ✅
- Phase 5: MCP Marketplace ✅
- Phase 6: Task Scheduler ✅
- Phase 7: Build & Polish ✅

**Last Updated**: March 24, 2026
**Maintainer**: COSMOS Team
**Repository**: https://github.com/yklein888/cosmos
