# 🌌 COSMOS

**Multi-Agent Intelligence Platform for Claude Code**

A desktop application built with Tauri + React that provides a multi-agent system for AI-powered project management, architecture design, development, UI/UX design, and security analysis.

## 🎯 Vision

COSMOS brings five specialized AI agents working together in a unified desktop environment:
- **PM Agent** - Project management and scope
- **Architect Agent** - System design and architecture
- **Developer Agent** - Implementation and debugging
- **Designer Agent** - UI/UX design
- **Security Agent** - Security review and hardening

## 🏗️ Architecture

### Technology Stack
- **Frontend**: React 19 + TypeScript + Vite
- **Desktop**: Tauri 2.0 (Rust-based)
- **Backend**: Rust + Tokio
- **Database**: SQLite (per-project isolation)
- **State**: Zustand

### Key Features (Planned)
- ✅ Multi-agent system (global agents, project-scoped memory)
- 📋 Multi-project management (instant switching)
- 🤖 Claude Code integration (real-time chat)
- 🖥️ Embedded terminal (xterm.js + PTY)
- 📦 MCP Marketplace (one-click server installation)
- 💾 Project memory engine (SQLite + Notion sync)
- ⏲️ Task scheduler (background execution)

## 📁 Project Structure

```
cosmos/
├── src/                    # React frontend (TypeScript)
│   ├── components/         # React components
│   ├── store/             # Zustand state stores
│   ├── hooks/             # React hooks
│   └── utils/             # Utility functions
├── src-tauri/             # Rust backend (Tauri)
│   ├── src/
│   │   ├── commands/      # Tauri IPC commands
│   │   ├── db/           # Database management
│   │   ├── services/     # Business logic
│   │   └── main.rs       # Entry point
│   └── Cargo.toml        # Rust dependencies
├── package.json          # Node dependencies
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Rust 1.81+ (https://rustup.rs/)
- Node 18+ (https://nodejs.org/)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Development server (runs frontend + Tauri dev window)
npm run tauri:dev

# Build for production
npm run tauri:build
```

## 📋 Development Phases

- **Phase 1** ✅ Foundation (Tauri + React setup)
- **Phase 2** 📋 Claude Integration (CLI subprocess)
- **Phase 3** 📋 Projects & Terminal (xterm.js, PTY)
- **Phase 4** 📋 Agents (Memory engine, Notion sync)
- **Phase 5** 📋 MCP Marketplace (Server installation)
- **Phase 6** 📋 Scheduler (Background tasks)
- **Phase 7** 📋 Polish (Testing, build, docs)

## 📝 Key Implementation Details

### Database Isolation
Each project has its own SQLite database stored in `<project>/.cosmos/memory.db`. This ensures **zero data leakage** between projects.

### IPC Communication
React ↔ Rust communication happens via Tauri's IPC bridge:
```typescript
const result = await invoke('command_name', { param: value })
```

### Global Agent Pool
5 agents are initialized globally but maintain **project-scoped memories**. Switching projects automatically loads/clears agent context.

## 🔗 Resources

- [Tauri Documentation](https://tauri.app/)
- [React Documentation](https://react.dev/)
- [Zustand Docs](https://github.com/pmndrs/zustand)

## 📄 License

MIT - See LICENSE file

---

**Status**: Phase 1 Foundation Complete ✅
**Last Updated**: March 24, 2026
