use rusqlite::{Connection, params};
use std::path::Path;
use uuid::Uuid;

pub struct Database {
    conn: Connection,
}

impl Database {
    pub fn open<P: AsRef<Path>>(path: P) -> rusqlite::Result<Self> {
        let conn = Connection::open(path)?;
        Ok(Database { conn })
    }

    pub fn init(&self) -> rusqlite::Result<()> {
        crate::db::init_db(&self.conn)
    }

    pub fn connection(&self) -> &Connection {
        &self.conn
    }

    // Conversation operations
    pub fn create_conversation(
        &self,
        project_path: &str,
        title: &str,
        model: &str,
    ) -> rusqlite::Result<String> {
        let id = Uuid::new_v4().to_string();
        let now = chrono::Utc::now().to_rfc3339();

        self.conn.execute(
            "INSERT INTO conversations (id, project_path, title, model, created_at)
             VALUES (?1, ?2, ?3, ?4, ?5)",
            params![&id, project_path, title, model, &now],
        )?;

        Ok(id)
    }

    pub fn get_conversations(&self, project_path: &str) -> rusqlite::Result<Vec<(String, String, String)>> {
        let mut stmt = self.conn.prepare(
            "SELECT id, title, model FROM conversations WHERE project_path = ?1 ORDER BY created_at DESC"
        )?;

        let convos = stmt.query_map(params![project_path], |row| {
            Ok((row.get::<_, String>(0)?, row.get::<_, String>(1)?, row.get::<_, String>(2)?))
        })?;

        let mut result = Vec::new();
        for convo in convos {
            result.push(convo?);
        }
        Ok(result)
    }

    // Message operations
    pub fn add_message(
        &self,
        conversation_id: &str,
        role: &str,
        content: &str,
        agent_name: Option<&str>,
    ) -> rusqlite::Result<()> {
        let now = chrono::Utc::now().to_rfc3339();

        self.conn.execute(
            "INSERT INTO messages (conversation_id, role, content, agent_name, created_at)
             VALUES (?1, ?2, ?3, ?4, ?5)",
            params![conversation_id, role, content, agent_name, &now],
        )?;

        Ok(())
    }

    pub fn get_messages(&self, conversation_id: &str) -> rusqlite::Result<Vec<(String, String, Option<String>)>> {
        let mut stmt = self.conn.prepare(
            "SELECT role, content, agent_name FROM messages WHERE conversation_id = ?1 ORDER BY created_at"
        )?;

        let messages = stmt.query_map(params![conversation_id], |row| {
            Ok((row.get::<_, String>(0)?, row.get::<_, String>(1)?, row.get::<_, Option<String>>(2)?))
        })?;

        let mut result = Vec::new();
        for msg in messages {
            result.push(msg?);
        }
        Ok(result)
    }
}
