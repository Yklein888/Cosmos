use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Conversation {
    pub id: String,
    pub project_path: String,
    pub title: String,
    pub model: String,
    pub created_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct MessageRecord {
    pub role: String,
    pub content: String,
    pub agent_name: Option<String>,
}

/// Create a new conversation
#[tauri::command]
pub fn create_conversation(
    project_path: String,
    title: String,
    model: String,
) -> Result<Conversation, String> {
    let conversation = Conversation {
        id: Uuid::new_v4().to_string(),
        project_path,
        title,
        model,
        created_at: chrono::Utc::now().to_rfc3339(),
    };

    // TODO: Save to SQLite
    Ok(conversation)
}

/// Get all conversations for a project
#[tauri::command]
pub fn get_conversations(project_path: String) -> Result<Vec<Conversation>, String> {
    // TODO: Query from SQLite
    Ok(vec![])
}

/// Get all messages for a conversation
#[tauri::command]
pub fn get_conversation_messages(conversation_id: String) -> Result<Vec<MessageRecord>, String> {
    // TODO: Query from SQLite
    Ok(vec![])
}

/// Add a message to a conversation
#[tauri::command]
pub fn add_message_to_conversation(
    conversation_id: String,
    role: String,
    content: String,
    agent_name: Option<String>,
) -> Result<(), String> {
    // TODO: Save to SQLite
    Ok(())
}
