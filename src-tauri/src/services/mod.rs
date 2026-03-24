// Services module for COSMOS
// Contains agent management, MCP server management, CLI detection, Claude subprocess, terminal, memory, etc.

pub mod cli_checker;
pub mod agent_manager;
pub mod mcp_manager;
pub mod claude;
pub mod terminal;
pub mod memory_engine;

pub use cli_checker::CliChecker;
pub use agent_manager::{AgentManager, Agent, AgentMemory};
pub use mcp_manager::McpManager;
pub use claude::ClaudeProcess;
pub use terminal::TerminalService;
pub use memory_engine::MemoryEngine;
