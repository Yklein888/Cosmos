use serde::{Deserialize, Serialize};
use crate::db::Database;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct MemoryEntry {
    pub id: String,
    pub project_path: String,
    pub agent_name: String,
    pub memory_type: String, // "decision", "context", "warning", "pattern"
    pub content: String,
    pub timestamp: String,
    pub tags: Vec<String>,
}

/// Project Memory Engine
/// Manages agent memories with SQLite persistence
pub struct MemoryEngine;

impl MemoryEngine {
    /// Save memory entry to database
    pub fn save_memory(
        db: &Database,
        project_path: &str,
        agent_name: &str,
        memory_type: &str,
        content: &str,
        tags: Vec<String>,
    ) -> Result<String, String> {
        let id = uuid::Uuid::new_v4().to_string();
        let timestamp = chrono::Utc::now().to_rfc3339();

        let tags_json = serde_json::to_string(&tags)
            .map_err(|e| format!("Failed to serialize tags: {}", e))?;

        db.connection()
            .execute(
                "INSERT INTO project_memory (id, project_path, agent_name, memory_type, content, tags, created_at)
                 VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
                rusqlite::params![
                    &id,
                    project_path,
                    agent_name,
                    memory_type,
                    content,
                    &tags_json,
                    &timestamp
                ],
            )
            .map_err(|e| e.to_string())?;

        Ok(id)
    }

    /// Get memories for an agent in a project
    pub fn get_agent_memories(
        db: &Database,
        project_path: &str,
        agent_name: &str,
    ) -> Result<Vec<MemoryEntry>, String> {
        let mut stmt = db
            .connection()
            .prepare(
                "SELECT id, project_path, agent_name, memory_type, content, tags, created_at
                 FROM project_memory
                 WHERE project_path = ?1 AND agent_name = ?2
                 ORDER BY created_at DESC",
            )
            .map_err(|e| e.to_string())?;

        let memories = stmt
            .query_map(rusqlite::params![project_path, agent_name], |row| {
                let tags_json: String = row.get(5)?;
                let tags: Vec<String> = serde_json::from_str(&tags_json).unwrap_or_default();

                Ok(MemoryEntry {
                    id: row.get(0)?,
                    project_path: row.get(1)?,
                    agent_name: row.get(2)?,
                    memory_type: row.get(3)?,
                    content: row.get(4)?,
                    timestamp: row.get(6)?,
                    tags,
                })
            })
            .map_err(|e| e.to_string())?;

        let mut result = Vec::new();
        for memory in memories {
            result.push(memory.map_err(|e| e.to_string())?);
        }

        Ok(result)
    }

    /// Get all memories for a project
    pub fn get_project_memories(
        db: &Database,
        project_path: &str,
    ) -> Result<Vec<MemoryEntry>, String> {
        let mut stmt = db
            .connection()
            .prepare(
                "SELECT id, project_path, agent_name, memory_type, content, tags, created_at
                 FROM project_memory
                 WHERE project_path = ?1
                 ORDER BY created_at DESC",
            )
            .map_err(|e| e.to_string())?;

        let memories = stmt
            .query_map(rusqlite::params![project_path], |row| {
                let tags_json: String = row.get(5)?;
                let tags: Vec<String> = serde_json::from_str(&tags_json).unwrap_or_default();

                Ok(MemoryEntry {
                    id: row.get(0)?,
                    project_path: row.get(1)?,
                    agent_name: row.get(2)?,
                    memory_type: row.get(3)?,
                    content: row.get(4)?,
                    timestamp: row.get(6)?,
                    tags,
                })
            })
            .map_err(|e| e.to_string())?;

        let mut result = Vec::new();
        for memory in memories {
            result.push(memory.map_err(|e| e.to_string())?);
        }

        Ok(result)
    }

    /// Search memories by tags
    pub fn search_memories(
        db: &Database,
        project_path: &str,
        tag: &str,
    ) -> Result<Vec<MemoryEntry>, String> {
        let mut stmt = db
            .connection()
            .prepare(
                "SELECT id, project_path, agent_name, memory_type, content, tags, created_at
                 FROM project_memory
                 WHERE project_path = ?1 AND tags LIKE ?2
                 ORDER BY created_at DESC",
            )
            .map_err(|e| e.to_string())?;

        let search_pattern = format!("%\"{}%", tag);

        let memories = stmt
            .query_map(rusqlite::params![project_path, search_pattern], |row| {
                let tags_json: String = row.get(5)?;
                let tags: Vec<String> = serde_json::from_str(&tags_json).unwrap_or_default();

                Ok(MemoryEntry {
                    id: row.get(0)?,
                    project_path: row.get(1)?,
                    agent_name: row.get(2)?,
                    memory_type: row.get(3)?,
                    content: row.get(4)?,
                    timestamp: row.get(6)?,
                    tags,
                })
            })
            .map_err(|e| e.to_string())?;

        let mut result = Vec::new();
        for memory in memories {
            result.push(memory.map_err(|e| e.to_string())?);
        }

        Ok(result)
    }

    /// Delete a memory entry
    pub fn delete_memory(db: &Database, memory_id: &str) -> Result<(), String> {
        db.connection()
            .execute("DELETE FROM project_memory WHERE id = ?1", rusqlite::params![memory_id])
            .map_err(|e| e.to_string())?;

        Ok(())
    }
}
