use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Task {
    pub id: String,
    pub name: String,
    pub description: String,
    pub command: String,
    pub schedule: String,
    pub enabled: bool,
    pub project_path: String,
    pub created_at: String,
    pub last_run: Option<String>,
    pub next_run: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct TaskResult {
    pub id: String,
    pub task_id: String,
    pub status: String,
    pub output: String,
    pub error: Option<String>,
    pub started_at: String,
    pub completed_at: Option<String>,
    pub duration_ms: Option<u64>,
}

/// Create a scheduled task
#[tauri::command]
pub fn create_task(
    name: String,
    description: String,
    command: String,
    schedule: String,
    project_path: String,
) -> Result<Task, String> {
    let task = Task {
        id: Uuid::new_v4().to_string(),
        name,
        description,
        command,
        schedule,
        enabled: true,
        project_path,
        created_at: chrono::Utc::now().to_rfc3339(),
        last_run: None,
        next_run: None,
    };

    // TODO: Save to database
    Ok(task)
}

/// Get all tasks for a project
#[tauri::command]
pub fn get_project_tasks(project_path: String) -> Result<Vec<Task>, String> {
    // TODO: Query from database
    Ok(vec![])
}

/// Execute a task immediately
#[tauri::command]
pub async fn execute_task(task_id: String) -> Result<TaskResult, String> {
    // TODO: Execute task via TaskScheduler
    let result = TaskResult {
        id: Uuid::new_v4().to_string(),
        task_id,
        status: "success".to_string(),
        output: "Task executed".to_string(),
        error: None,
        started_at: chrono::Utc::now().to_rfc3339(),
        completed_at: Some(chrono::Utc::now().to_rfc3339()),
        duration_ms: Some(100),
    };

    Ok(result)
}

/// Get task results/history
#[tauri::command]
pub fn get_task_results(task_id: String) -> Result<Vec<TaskResult>, String> {
    // TODO: Query from database
    Ok(vec![])
}

/// Toggle task enabled/disabled
#[tauri::command]
pub fn toggle_task(task_id: String) -> Result<(), String> {
    // TODO: Update in database
    Ok(())
}

/// Delete a task
#[tauri::command]
pub fn delete_task(task_id: String) -> Result<(), String> {
    // TODO: Delete from database
    Ok(())
}
