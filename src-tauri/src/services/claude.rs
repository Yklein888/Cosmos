use std::process::{Command, Stdio};
use std::io::{BufRead, BufReader, Write};
use tokio::sync::mpsc;

/// Spawns Claude CLI subprocess and streams responses
pub struct ClaudeProcess;

impl ClaudeProcess {
    /// Send message to Claude and stream response
    pub async fn send_message(
        message: &str,
        model: &str,
    ) -> Result<mpsc::Receiver<String>, String> {
        let (tx, rx) = mpsc::channel(100);

        let message = message.to_string();
        let model = model.to_string();

        tokio::spawn(async move {
            // Spawn Claude subprocess
            let mut child = Command::new("claude")
                .arg("--model")
                .arg(&model)
                .stdin(Stdio::piped())
                .stdout(Stdio::piped())
                .stderr(Stdio::piped())
                .spawn();

            match child {
                Ok(mut process) => {
                    // Send message to stdin
                    if let Some(mut stdin) = process.stdin.take() {
                        let _ = stdin.write_all(message.as_bytes());
                        let _ = stdin.write_all(b"\n");
                        drop(stdin);
                    }

                    // Read stdout line by line
                    if let Some(stdout) = process.stdout.take() {
                        let reader = BufReader::new(stdout);
                        for line in reader.lines() {
                            if let Ok(line) = line {
                                let _ = tx.send(line).await;
                            }
                        }
                    }
                }
                Err(e) => {
                    let _ = tx.send(format!("Error spawning Claude: {}", e)).await;
                }
            }
        });

        Ok(rx)
    }
}
