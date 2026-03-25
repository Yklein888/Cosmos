import { app } from 'electron'
import path from 'path'
import fs from 'fs'

export interface MemoryEntry {
  id: string
  projectPath: string
  content: string
  importance: number
  createdAt: string
  keywords: string[]
}

let db: ReturnType<typeof openDatabase> | null = null

function openDatabase() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Database = require('better-sqlite3')
    const dbPath = path.join(app.getPath('userData'), 'memories.db')
    const dbDir = path.dirname(dbPath)
    if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true })

    const database = new Database(dbPath)
    database.exec(`
      CREATE TABLE IF NOT EXISTS memories (
        id TEXT PRIMARY KEY,
        project_path TEXT NOT NULL,
        content TEXT NOT NULL,
        importance INTEGER DEFAULT 5,
        created_at TEXT NOT NULL,
        keywords TEXT DEFAULT '[]'
      );
      CREATE INDEX IF NOT EXISTS idx_memories_project ON memories(project_path);
    `)
    return database
  } catch {
    return null
  }
}

function getDb() {
  if (!db) db = openDatabase()
  return db
}

function extractKeywords(text: string): string[] {
  const stopWords = new Set(['the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'this', 'that', 'it', 'its', 'we', 'our', 'you', 'your', 'and', 'or', 'but', 'not'])
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 3 && !stopWords.has(w))
    .slice(0, 20)
}

export function listMemories(projectPath: string): MemoryEntry[] {
  const database = getDb()
  if (!database) return []
  try {
    const rows = database.prepare(
      'SELECT id, project_path, content, importance, created_at, keywords FROM memories WHERE project_path = ? ORDER BY importance DESC, created_at DESC'
    ).all(projectPath) as Array<{ id: string; project_path: string; content: string; importance: number; created_at: string; keywords: string }>
    return rows.map((r) => ({
      id: r.id,
      projectPath: r.project_path,
      content: r.content,
      importance: r.importance,
      createdAt: r.created_at,
      keywords: JSON.parse(r.keywords || '[]'),
    }))
  } catch {
    return []
  }
}

export function addMemory(projectPath: string, content: string, importance = 5): MemoryEntry {
  const database = getDb()
  const entry: MemoryEntry = {
    id: crypto.randomUUID(),
    projectPath,
    content,
    importance: Math.max(1, Math.min(10, importance)),
    createdAt: new Date().toISOString(),
    keywords: extractKeywords(content),
  }

  if (database) {
    try {
      database.prepare(
        'INSERT INTO memories (id, project_path, content, importance, created_at, keywords) VALUES (?, ?, ?, ?, ?, ?)'
      ).run(entry.id, entry.projectPath, entry.content, entry.importance, entry.createdAt, JSON.stringify(entry.keywords))
    } catch {
      // ignore
    }
  }
  return entry
}

export function deleteMemory(id: string): void {
  const database = getDb()
  if (database) {
    try {
      database.prepare('DELETE FROM memories WHERE id = ?').run(id)
    } catch {
      // ignore
    }
  }
}

export function updateMemory(id: string, content: string): void {
  const database = getDb()
  if (database) {
    try {
      const keywords = extractKeywords(content)
      database.prepare('UPDATE memories SET content = ?, keywords = ? WHERE id = ?').run(
        content, JSON.stringify(keywords), id
      )
    } catch {
      // ignore
    }
  }
}

export function searchMemories(projectPath: string, query: string, limit = 5): MemoryEntry[] {
  const all = listMemories(projectPath)
  if (!query.trim()) return all.slice(0, limit)

  const queryKeywords = extractKeywords(query)
  const scored = all.map((m) => {
    const overlap = m.keywords.filter((k) => queryKeywords.includes(k)).length
    const textMatch = m.content.toLowerCase().includes(query.toLowerCase()) ? 3 : 0
    return { memory: m, score: overlap + textMatch + m.importance * 0.1 }
  })

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.memory)
}

export function getTopMemoriesForPrompt(projectPath: string, limit = 5): string {
  const memories = listMemories(projectPath).slice(0, limit)
  if (memories.length === 0) return ''
  const lines = memories.map((m, i) => `${i + 1}. ${m.content}`)
  return `\n\n## Project Memory\nKey facts about this project:\n${lines.join('\n')}\n`
}
