use serde::{Deserialize, Serialize};
use crate::services::{Agent, AgentMemory};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AgentInfo {
    pub name: String,
    pub role: String,
    pub description: String,
    pub enabled: bool,
    pub model: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct MemoryEntry {
    pub id: String,
    pub agent_name: String,
    pub memory_type: String,
    pub content: String,
    pub timestamp: String,
    pub tags: Vec<String>,
}

/// Get all agents
#[tauri::command]
pub fn get_all_agents() -> Result<Vec<AgentInfo>, String> {
    // TODO: Get from AgentManager singleton
    Ok(vec![])
}

/// Get agent configuration
#[tauri::command]
pub fn get_agent(agent_name: String) -> Result<AgentInfo, String> {
    // TODO: Get from AgentManager
    Ok(AgentInfo {
        name: agent_name,
        role: "".to_string(),
        description: "".to_string(),
        enabled: true,
        model: "claude-3-5-sonnet-20241022".to_string(),
    })
}

/// Save agent memory
#[tauri::command]
pub fn save_agent_memory(
    project_path: String,
    agent_name: String,
    memory_type: String,
    content: String,
    tags: Vec<String>,
) -> Result<String, String> {
    // TODO: Save to database using MemoryEngine
    Ok(uuid::Uuid::new_v4().to_string())
}

/// Get agent memories
#[tauri::command]
pub fn get_agent_memories(
    project_path: String,
    agent_name: String,
) -> Result<Vec<MemoryEntry>, String> {
    // TODO: Query from database
    Ok(vec![])
}

/// Get all project memories
#[tauri::command]
pub fn get_project_memories(project_path: String) -> Result<Vec<MemoryEntry>, String> {
    // TODO: Query from database
    Ok(vec![])
}

/// Search memories by tag
#[tauri::command]
pub fn search_memories(project_path: String, tag: String) -> Result<Vec<MemoryEntry>, String> {
    // TODO: Search in database
    Ok(vec![])
}

/// Delete a memory entry
#[tauri::command]
pub fn delete_memory(memory_id: String) -> Result<(), String> {
    // TODO: Delete from database
    Ok(())
}

/// Switch active project (updates agent context)
#[tauri::command]
pub fn switch_project_context(project_path: String) -> Result<(), String> {
    // TODO: Update AgentManager's current project
    // This triggers memory reloading for all agents
    Ok(())
}
