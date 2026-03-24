// Services module for COSMOS
// Contains agent management, MCP server management, CLI detection, Claude subprocess, etc.

pub mod cli_checker;
pub mod agent_manager;
pub mod mcp_manager;
pub mod claude;

pub use cli_checker::CliChecker;
pub use agent_manager::AgentManager;
pub use mcp_manager::McpManager;
pub use claude::ClaudeProcess;
