use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Memory {
    pub id: String,
    pub project_path: String,
    pub agent_name: String,
    pub memory_type: String,
    pub content: String,
    pub created_at: String,
}

#[tauri::command]
pub fn save_memory(
    project_path: String,
    agent_name: String,
    memory_type: String,
    content: String,
) -> Result<Memory, String> {
    let memory = Memory {
        id: Uuid::new_v4().to_string(),
        project_path,
        agent_name,
        memory_type,
        content,
        created_at: chrono::Utc::now().to_rfc3339(),
    };

    // TODO: Persist to SQLite
    Ok(memory)
}

#[tauri::command]
pub fn get_memory(project_path: String) -> Result<Vec<Memory>, String> {
    // TODO: Query from SQLite
    Ok(vec![])
}
