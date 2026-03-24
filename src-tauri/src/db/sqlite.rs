use rusqlite::Connection;
use std::path::Path;

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
}
