use crate::services::TerminalService;

/// Execute a terminal command in a project directory
#[tauri::command]
pub async fn execute_terminal_command(
    project_path: String,
    command: String,
) -> Result<Vec<String>, String> {
    match TerminalService::execute_command(&project_path, &command).await {
        Ok(mut rx) => {
            let mut output = Vec::new();

            while let Some(line) = rx.recv().await {
                output.push(line);
            }

            Ok(output)
        }
        Err(e) => Err(e),
    }
}

/// Get list of files in a directory
#[tauri::command]
pub fn list_directory(path: String) -> Result<Vec<String>, String> {
    TerminalService::list_files(&path)
}

/// Get current working directory
#[tauri::command]
pub fn get_working_directory(project_path: String) -> Result<String, String> {
    Ok(TerminalService::get_working_directory(&project_path))
}
