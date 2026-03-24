use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Project {
    pub id: String,
    pub path: String,
    pub name: String,
    pub created_at: String,
}

#[tauri::command]
pub fn create_project(path: String, name: String) -> Result<Project, String> {
    let project = Project {
        id: Uuid::new_v4().to_string(),
        path,
        name,
        created_at: chrono::Utc::now().to_rfc3339(),
    };

    Ok(project)
}

#[tauri::command]
pub fn get_projects() -> Result<Vec<Project>, String> {
    // TODO: Implement database query
    Ok(vec![])
}
