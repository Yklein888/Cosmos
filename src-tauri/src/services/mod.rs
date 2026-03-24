// Services module for COSMOS
// Will contain agent management, MCP server management, CLI detection, etc.

pub mod cli_checker;
pub mod agent_manager;
pub mod mcp_manager;

pub use cli_checker::CliChecker;
pub use agent_manager::AgentManager;
pub use mcp_manager::McpManager;
