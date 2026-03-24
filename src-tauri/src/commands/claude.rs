use serde::{Deserialize, Serialize};
use crate::services::{CliChecker, ClaudeProcess};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ClaudeMessage {
    pub content: String,
    pub timestamp: String,
}

/// Check if Claude CLI is installed
#[tauri::command]
pub fn check_claude_cli() -> Result<String, String> {
    CliChecker::validate_claude()
}

/// Send a message to Claude and get streaming response
#[tauri::command]
pub async fn send_message_to_claude(
    conversation_id: String,
    message: String,
    model: String,
) -> Result<String, String> {
    // TODO: Save message to database first

    // Spawn Claude subprocess
    match ClaudeProcess::send_message(&message, &model).await {
        Ok(mut rx) => {
            let mut response = String::new();

            // Collect all chunks
            while let Some(chunk) = rx.recv().await {
                response.push_str(&chunk);
                response.push('\n');
            }

            // TODO: Save response to database
            Ok(response)
        }
        Err(e) => Err(format!("Error sending message to Claude: {}", e)),
    }
}

/// Stream Claude response (for real-time updates)
#[tauri::command]
pub async fn stream_claude_response(
    message: String,
    model: String,
) -> Result<Vec<String>, String> {
    match ClaudeProcess::send_message(&message, &model).await {
        Ok(mut rx) => {
            let mut chunks = Vec::new();

            while let Some(chunk) = rx.recv().await {
                chunks.push(chunk);
            }

            Ok(chunks)
        }
        Err(e) => Err(format!("Error streaming response: {}", e)),
    }
}
