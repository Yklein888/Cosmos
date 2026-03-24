# COSMOS Architecture

## Overview

COSMOS is a multi-agent intelligence platform built with Tauri, React, and Rust. It provides a unified desktop environment for AI-powered project management with global agents, project-scoped memory, Claude integration, terminal execution, and task scheduling.

## Core Design Principles

### 1. Project Isolation
- **Each project is completely isolated**
- Own SQLite database: `<project>/.cosmos/memory.db`
- Agent memories don't leak between projects
- Terminal contexts are project-scoped

### 2. Global Agents
- **5 agents always available** across all projects
- Agents aren't tied to specific projects
- Switching projects swaps agent memories
- Agent configuration is global, memory is local

### 3. Async-First
- **Tokio runtime** for background tasks
- Non-blocking I/O throughout
- Stream-based responses (Rust → React)
- Background scheduler runs continuously

### 4. Type Safety
- **TypeScript** on frontend (strict mode)
- **Rust** on backend (memory safe)
- Full type integration via Tauri IPC
- Zustand stores for state management

## System Architecture

```
┌─────────────────────────────────────────────────────┐
│              COSMOS Desktop App                      │
├─────────────────────────────────────────────────────┤
│                    React Frontend                    │
│  ┌──────────────┬──────────────┬──────────────────┐ │
│  │ Chat View    │ Terminal     │ MCP Marketplace  │ │
│  │ (Claude)     │ (xterm.js)   │ (10+ servers)    │ │
│  └──────────────┴──────────────┴──────────────────┘ │
│                                                      │
│  ┌──────────────┬──────────────┬──────────────────┐ │
│  │ Agent Panel  │ Memory       │ Task Scheduler   │ │
│  │ (5 agents)   │ Viewer       │ (recurring)      │ │
│  └──────────────┴──────────────┴──────────────────┘ │
│                   Project Tab Bar                    │
├─────────────────────────────────────────────────────┤
│              Zustand State Store                     │
│  useAppStore • useProjectStore • useConversationStore
│  useAgentStore • useMcpStore                        │
├─────────────────────────────────────────────────────┤
│                  Tauri IPC Bridge                    │
├─────────────────────────────────────────────────────┤
│               Rust Backend (Tokio)                   │
│  ┌──────────────────────────────────────────────┐  │
│  │          Commands Layer (IPC)                │  │
│  │  claude • conversations • terminal • agents  │  │
│  │  memory • tasks                              │  │
│  └──────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────┐  │
│  │         Services Layer (Business Logic)      │  │
│  │  ClaudeProcess • TerminalService • Scheduler │  │
│  │  AgentManager • MemoryEngine • CliChecker    │  │
│  └──────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────┐  │
│  │         Database Layer (SQLite)              │  │
│  │  Per-project isolation • Schema versioning   │  │
│  │  Conversation • Messages • Memory • Tasks    │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │      Background Services (Tokio threads)     │  │
│  │  Task Scheduler • Memory Sync • Updates      │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

## Frontend Architecture (React + TypeScript)

### State Management (Zustand)

```typescript
useAppStore
  ├── currentProjectPath
  ├── isDarkMode
  └── setCurrentProjectPath()

useProjectStore
  ├── projects: Project[]
  ├── activeProjectId
  ├── addProject()
  ├── removeProject()
  └── setActiveProject()

useConversationStore
  ├── conversations: Conversation[]
  ├── activeConversationId
  ├── addMessage()
  └── setActiveConversation()

useAgentStore
  ├── agents: Agent[] (5 agents)
  ├── toggleAgent()
  └── updateAgentPrompt()

useMcpStore
  ├── servers: MCPServer[]
  ├── addServer()
  └── toggleServer()
```

### Component Structure

```
V2Layout (Main Layout)
├── ProjectTabBar
│   ├── Tabs for each project
│   └── Add project form
├── Tab Navigation (Chat / Terminal / MCP)
├── ChatView
│   ├── MessageList
│   │   ├── Message (user/assistant)
│   │   └── FormattedContent (markdown)
│   └── InputBox
├── TerminalView
│   ├── xterm.js Terminal
│   └── Command Input
├── McpMarketplace
│   ├── Search & Filter
│   └── McpServerCard[] (10+ servers)
├── AgentPanel
│   └── Agent toggles
└── MemoryViewer
    └── Memory entries (searchable)
```

### Hooks

```typescript
useIpc()              // Generic IPC caller
useClaudeCli()        // Claude detection
useClaude()           // Send messages, stream
```

## Backend Architecture (Rust + Tokio)

### Command Layer (IPC)

Each command is a Tauri invoke handler:

```rust
#[tauri::command]
pub async fn send_message_to_claude(
    conversation_id: String,
    message: String,
    model: String,
) -> Result<String, String>
```

**Command Modules:**
- `commands/claude.rs` - Claude integration
- `commands/conversations.rs` - Chat management
- `commands/terminal.rs` - Shell commands
- `commands/agents.rs` - Agent operations
- `commands/memory.rs` - Memory storage
- `commands/tasks.rs` - Task scheduling

### Services Layer (Business Logic)

```rust
services/
├── claude.rs          // Claude subprocess spawner
├── terminal.rs        // PTY/shell execution
├── agent_manager.rs   // Global agent pool
├── memory_engine.rs   // Memory persistence
├── scheduler.rs       // Background task execution
├── cli_checker.rs     // Claude CLI detection
└── mcp_manager.rs     // MCP server management
```

### Database Layer (SQLite)

```rust
db/
├── sqlite.rs         // Database connection wrapper
└── schema.rs         // Table definitions
```

**Database Schema:**

```sql
conversations
  id, project_path, title, model, created_at

messages
  id, conversation_id, role, content, agent_name, created_at

project_memory
  id, project_path, agent_name, memory_type, content, tags, created_at

projects
  id, path, name, created_at

mcp_servers
  id, name, description, installed, config, created_at

settings
  key, value
```

## Data Flow

### Chat Message Flow

1. **User Types**: React component updates state
2. **User Sends**: `InputBox` → `ChatView` → `useIpc()`
3. **Frontend**: `invoke('send_message_to_claude', { ... })`
4. **IPC Bridge**: Message travels from React → Tauri
5. **Backend**: `commands/claude.rs` receives request
6. **Service**: `ClaudeProcess::send_message()` spawns subprocess
7. **Subprocess**: Claude CLI runs in separate process
8. **Stream**: Output streams back via Tokio MPSC
9. **IPC Return**: Response sent back to React
10. **React Update**: Zustand store updates message
11. **Render**: Message appears in MessageList

### Agent Memory Flow

1. **Decision Made**: Service calls `MemoryEngine::save_memory()`
2. **Database**: Memory persists to SQLite with tags
3. **Memory Loaded**: On project switch, `AgentManager::switch_project()`
4. **Query**: Load all memories for that project
5. **Inject**: Memories loaded into agent context
6. **Available**: Agent can reference previous decisions

### Task Execution Flow

1. **Schedule**: Task created via `TaskScheduler`
2. **Background Loop**: Tokio thread checks every 60s
3. **Trigger**: Time matches schedule pattern
4. **Execute**: `TerminalService::execute_command()`
5. **Stream**: Output collected from subprocess
6. **Result**: Stored in SQLite with status/duration
7. **History**: Available in UI for review

## Project Isolation Strategy

### Database Isolation

```rust
// Every query includes project_path filter
SELECT * FROM project_memory
WHERE project_path = ?1  // Partition key
AND agent_name = ?2
```

### Memory Loading

```rust
// Only load memories for current project
pub fn switch_project(&mut self, project_path: String) {
    self.current_project = Some(project_path);
    // Load ONLY this project's memories
    let memories = db.query("WHERE project_path = ?", &project_path);
    self.inject_memories(memories);
}
```

### Terminal Context

```rust
// Commands execute in project directory
Command::new("sh")
    .current_dir(&project_path)  // Project-scoped
    .spawn()
```

### Conversation Storage

```rust
// Conversations linked to project
INSERT INTO conversations (project_path, ...)
WHERE project_path = ?  // Partition key
```

## Concurrency Model

### Frontend (React)

- **Single-threaded** JavaScript
- **Async/await** for IPC calls
- **Zustand** for state (immediate updates)
- **useEffect** for side effects

### Backend (Rust + Tokio)

```
Main Thread
├── Window Manager
├── IPC Router
└── Tokio Runtime
    ├── Command Handlers (async)
    ├── Background Tasks
    │   ├── Task Scheduler (loop every 60s)
    │   ├── Subprocess Streams (MPSC channels)
    │   └── Memory Syncing
    └── Database Access (Mutex-protected)
```

### Thread Safety

```rust
// AgentManager is thread-safe
pub struct AgentManager {
    tasks: Arc<Mutex<HashMap<String, Task>>>,
    results: Arc<Mutex<Vec<TaskResult>>>,
}

// Multiple background threads can safely access
tokio::spawn(async move {
    let mut tasks = tasks_ref.lock().await;
    // Execute task safely
});
```

## Async Patterns

### Streaming Responses

```rust
pub async fn send_message(message: &str) -> Result<mpsc::Receiver<String>> {
    let (tx, rx) = mpsc::channel(100);

    tokio::spawn(async move {
        // Process in background
        // Send updates via tx
    });

    Ok(rx)  // Return receiver immediately
}
```

### Background Scheduler

```rust
pub async fn start_background_scheduler() {
    tokio::spawn(async move {
        loop {
            // Check task conditions
            // Execute if needed
            sleep(Duration::from_secs(60)).await;
        }
    });
}
```

## Performance Characteristics

### Frontend
- **Fast startup** - React 19 loads quickly
- **Smooth UI** - Zustand updates immediately
- **Responsive** - No blocking calls (all async)
- **Terminal** - xterm.js handles high-speed output

### Backend
- **Non-blocking I/O** - Tokio handles hundreds of tasks
- **Subprocess isolation** - Each subprocess is independent
- **Memory efficient** - SQLite keeps overhead low
- **Scalable** - Can handle many concurrent tasks

## Error Handling

### Frontend
```typescript
try {
    const result = await ApiClient.sendMessage()
} catch (error) {
    // Display error toast
    // Retry option available
}
```

### Backend
```rust
match ClaudeProcess::send_message(&message) {
    Ok(rx) => { /* process */ },
    Err(e) => Err(format!("Error: {}", e))  // Return to frontend
}
```

## Security Considerations

### Project Isolation
- ✅ SQLite partition keys enforce isolation
- ✅ No cross-project queries possible
- ✅ Each subprocess runs in project directory

### Memory Safety
- ✅ Rust's borrow checker prevents use-after-free
- ✅ No null pointer exceptions
- ✅ Type system catches many errors at compile time

### Data Protection
- ✅ Local SQLite only (no cloud sync yet)
- ✅ Subprocess output escaped/sanitized
- ✅ IPC validates message types

## Testing Strategy

### Unit Tests
- Service layer functions
- Database queries
- State management

### Integration Tests
- IPC command handlers
- Database operations
- Subprocess execution

### E2E Tests (Future)
- Full workflow testing
- UI interaction testing
- Performance benchmarks

## Future Improvements

### Phase 8: Notion Sync
- Cloud backup of memories
- Cross-device access
- Collaboration features

### Phase 9: Advanced Scheduling
- Proper cron expression parsing
- Timezone support
- Task dependencies

### Phase 10: MCP Server Development
- Custom MCP server builder
- Marketplace upload
- Community contributions

---

**Architecture Version**: 1.0
**Last Updated**: March 24, 2026
