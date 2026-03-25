import { create } from 'zustand'
import { api } from '../api'

export interface MemoryEntry {
  id: string
  projectPath: string
  content: string
  importance: number
  createdAt: string
  tags?: string[]
}

interface MemoryStore {
  memories: MemoryEntry[]
  loading: boolean
  saving: boolean

  loadMemories: (projectPath: string) => Promise<void>
  addMemory: (projectPath: string, content: string, importance?: number) => Promise<void>
  deleteMemory: (id: string) => Promise<void>
  updateMemory: (id: string, content: string) => Promise<void>
  searchMemories: (projectPath: string, query: string) => Promise<MemoryEntry[]>
}

export const useMemoryStore = create<MemoryStore>((set, get) => ({
  memories: [],
  loading: false,
  saving: false,

  loadMemories: async (projectPath: string) => {
    set({ loading: true })
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await (api as any).memory?.list(projectPath) ?? []
      set({ memories: result })
    } catch {
      set({ memories: [] })
    } finally {
      set({ loading: false })
    }
  },

  addMemory: async (projectPath, content, importance = 5) => {
    set({ saving: true })
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const entry = await (api as any).memory?.add(projectPath, content, importance) ?? {
        id: crypto.randomUUID(),
        projectPath,
        content,
        importance,
        createdAt: new Date().toISOString(),
      }
      set((s) => ({ memories: [entry, ...s.memories] }))
    } finally {
      set({ saving: false })
    }
  },

  deleteMemory: async (id) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (api as any).memory?.delete(id)
      set((s) => ({ memories: s.memories.filter((m) => m.id !== id) }))
    } catch {
      set((s) => ({ memories: s.memories.filter((m) => m.id !== id) }))
    }
  },

  updateMemory: async (id, content) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (api as any).memory?.update(id, content)
      set((s) => ({
        memories: s.memories.map((m) => (m.id === id ? { ...m, content } : m)),
      }))
    } catch {
      set((s) => ({
        memories: s.memories.map((m) => (m.id === id ? { ...m, content } : m)),
      }))
    }
  },

  searchMemories: async (projectPath, query) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return await (api as any).memory?.search(projectPath, query) ?? get().memories.filter((m) =>
        m.projectPath === projectPath && m.content.toLowerCase().includes(query.toLowerCase())
      )
    } catch {
      return get().memories.filter((m) =>
        m.projectPath === projectPath && m.content.toLowerCase().includes(query.toLowerCase())
      )
    }
  },
}))
