use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use tokio::time::{sleep, Duration};
use std::sync::Arc;
use tokio::sync::Mutex;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Task {
    pub id: String,
    pub name: String,
    pub description: String,
    pub command: String,
    pub schedule: String, // Cron-like: "daily", "hourly", "0 9 * * *", etc.
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
    pub status: String, // "pending", "running", "success", "failed"
    pub output: String,
    pub error: Option<String>,
    pub started_at: String,
    pub completed_at: Option<String>,
    pub duration_ms: Option<u64>,
}

/// Background task scheduler
pub struct TaskScheduler {
    tasks: Arc<Mutex<HashMap<String, Task>>>,
    results: Arc<Mutex<Vec<TaskResult>>>,
}

impl TaskScheduler {
    pub fn new() -> Self {
        Self {
            tasks: Arc::new(Mutex::new(HashMap::new())),
            results: Arc::new(Mutex::new(Vec::new())),
        }
    }

    /// Create a new task
    pub async fn create_task(
        &self,
        name: String,
        description: String,
        command: String,
        schedule: String,
        project_path: String,
    ) -> Result<Task, String> {
        let task = Task {
            id: uuid::Uuid::new_v4().to_string(),
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

        let mut tasks = self.tasks.lock().await;
        tasks.insert(task.id.clone(), task.clone());

        Ok(task)
    }

    /// Get all tasks
    pub async fn get_all_tasks(&self) -> Vec<Task> {
        let tasks = self.tasks.lock().await;
        tasks.values().cloned().collect()
    }

    /// Get tasks for a project
    pub async fn get_project_tasks(&self, project_path: &str) -> Vec<Task> {
        let tasks = self.tasks.lock().await;
        tasks
            .values()
            .filter(|t| t.project_path == project_path)
            .cloned()
            .collect()
    }

    /// Execute a task
    pub async fn execute_task(&self, task_id: String) -> Result<TaskResult, String> {
        let tasks = self.tasks.lock().await;
        let task = tasks.get(&task_id).cloned().ok_or("Task not found")?;
        drop(tasks);

        let result = TaskResult {
            id: uuid::Uuid::new_v4().to_string(),
            task_id: task.id.clone(),
            status: "running".to_string(),
            output: String::new(),
            error: None,
            started_at: chrono::Utc::now().to_rfc3339(),
            completed_at: None,
            duration_ms: None,
        };

        // TODO: Execute command asynchronously
        // For now, simulate execution
        let mut result = result;
        result.status = "success".to_string();
        result.output = format!("Executed: {}", task.command);
        result.completed_at = Some(chrono::Utc::now().to_rfc3339());

        let mut results = self.results.lock().await;
        results.push(result.clone());

        Ok(result)
    }

    /// Get task results
    pub async fn get_task_results(&self, task_id: &str) -> Vec<TaskResult> {
        let results = self.results.lock().await;
        results
            .iter()
            .filter(|r| r.task_id == task_id)
            .cloned()
            .collect()
    }

    /// Delete a task
    pub async fn delete_task(&self, task_id: &str) -> Result<(), String> {
        let mut tasks = self.tasks.lock().await;
        tasks.remove(task_id).ok_or("Task not found")?;
        Ok(())
    }

    /// Update task enabled status
    pub async fn toggle_task(&self, task_id: &str) -> Result<(), String> {
        let mut tasks = self.tasks.lock().await;
        let task = tasks.get_mut(task_id).ok_or("Task not found")?;
        task.enabled = !task.enabled;
        Ok(())
    }

    /// Start background scheduler (runs indefinitely)
    pub async fn start_background_scheduler(&self) {
        let tasks_ref = Arc::clone(&self.tasks);
        let results_ref = Arc::clone(&self.results);

        tokio::spawn(async move {
            loop {
                let tasks = tasks_ref.lock().await;
                for task in tasks.values().filter(|t| t.enabled) {
                    // Check if task should run based on schedule
                    // For now, simulate a simple check
                    if should_run_task(task) {
                        let task_id = task.id.clone();
                        let command = task.command.clone();
                        let results_ref = Arc::clone(&results_ref);

                        tokio::spawn(async move {
                            let result = TaskResult {
                                id: uuid::Uuid::new_v4().to_string(),
                                task_id,
                                status: "success".to_string(),
                                output: format!("Background execution: {}", command),
                                error: None,
                                started_at: chrono::Utc::now().to_rfc3339(),
                                completed_at: Some(chrono::Utc::now().to_rfc3339()),
                                duration_ms: Some(100),
                            };

                            let mut results = results_ref.lock().await;
                            results.push(result);
                        });
                    }
                }
                drop(tasks);

                // Check every minute
                sleep(Duration::from_secs(60)).await;
            }
        });
    }
}

impl Default for TaskScheduler {
    fn default() -> Self {
        Self::new()
    }
}

/// Simple check if a task should run (placeholder)
fn should_run_task(task: &Task) -> bool {
    // TODO: Implement proper cron scheduling
    // For now, return false to avoid running tasks automatically
    false
}
