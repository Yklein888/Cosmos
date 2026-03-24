use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct McpServer {
    pub id: String,
    pub name: String,
    pub description: String,
    pub installed: bool,
    pub config: Option<serde_json::Value>,
}

/// MCP Server Manager for installation and configuration
pub struct McpManager {
    servers: Vec<McpServer>,
}

impl McpManager {
    pub fn new() -> Self {
        Self {
            servers: vec![],
        }
    }

    pub fn install_server(&mut self, _server_id: &str) -> Result<(), String> {
        // TODO: Download and install MCP server
        Ok(())
    }

    pub fn uninstall_server(&mut self, _server_id: &str) -> Result<(), String> {
        // TODO: Uninstall MCP server
        Ok(())
    }
}

impl Default for McpManager {
    fn default() -> Self {
        Self::new()
    }
}
