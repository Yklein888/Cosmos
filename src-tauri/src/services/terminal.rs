use std::process::{Command, Stdio};
use std::io::{BufRead, BufReader};
use tokio::sync::mpsc;

/// Terminal/PTY service for spawning shell commands
pub struct TerminalService;

impl TerminalService {
    /// Execute a shell command and stream output
    pub async fn execute_command(
        project_path: &str,
        command: &str,
    ) -> Result<mpsc::Receiver<String>, String> {
        let (tx, rx) = mpsc::channel(100);
        let command = command.to_string();
        let project_path = project_path.to_string();

        tokio::spawn(async move {
            // Spawn shell command (use sh on Unix, cmd on Windows)
            let mut child = if cfg!(target_os = "windows") {
                Command::new("cmd")
                    .args(&["/C", &command])
                    .current_dir(&project_path)
                    .stdout(Stdio::piped())
                    .stderr(Stdio::piped())
                    .spawn()
            } else {
                Command::new("sh")
                    .args(&["-c", &command])
                    .current_dir(&project_path)
                    .stdout(Stdio::piped())
                    .stderr(Stdio::piped())
                    .spawn()
            };

            match child {
                Ok(mut process) => {
                    // Read stdout
                    if let Some(stdout) = process.stdout.take() {
                        let reader = BufReader::new(stdout);
                        for line in reader.lines() {
                            if let Ok(line) = line {
                                let _ = tx.send(line).await;
                            }
                        }
                    }

                    // Read stderr
                    if let Some(stderr) = process.stderr.take() {
                        let reader = BufReader::new(stderr);
                        for line in reader.lines() {
                            if let Ok(line) = line {
                                let _ = tx.send(format!("ERR: {}", line)).await;
                            }
                        }
                    }

                    // Wait for completion
                    let _ = process.wait();
                }
                Err(e) => {
                    let _ = tx.send(format!("Error executing command: {}", e)).await;
                }
            }
        });

        Ok(rx)
    }

    /// Get current working directory (useful for terminal context)
    pub fn get_working_directory(project_path: &str) -> String {
        project_path.to_string()
    }

    /// List files in a directory
    pub fn list_files(path: &str) -> Result<Vec<String>, String> {
        std::fs::read_dir(path)
            .map_err(|e| e.to_string())?
            .filter_map(|entry| {
                entry
                    .ok()
                    .and_then(|e| e.file_name().into_string().ok())
            })
            .collect::<Vec<_>>()
            .into()
            .map(Ok)
    }
}
