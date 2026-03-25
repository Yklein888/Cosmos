import { create } from 'zustand'
import { api } from '../api'
import type { McpServer } from '../types'

interface GlobalMcpStore {
  servers: McpServer[]
  loading: boolean

  loadServers: () => Promise<void>
  addServer: (server: McpServer) => Promise<void>
  removeServer: (id: string) => Promise<void>
  updateServer: (id: string, updates: Partial<McpServer>) => Promise<void>
  toggleServer: (id: string) => Promise<void>
}

const SETTINGS_KEY = 'globalMcpServers'

export const useGlobalMcpStore = create<GlobalMcpStore>((set, get) => ({
  servers: [],
  loading: false,

  loadServers: async () => {
    set({ loading: true })
    try {
      const stored = await api.settings.get(SETTINGS_KEY)
      const servers = Array.isArray(stored) ? (stored as McpServer[]) : []
      set({ servers })
    } catch {
      set({ servers: [] })
    } finally {
      set({ loading: false })
    }
  },

  addServer: async (server) => {
    const servers = [...get().servers, server]
    set({ servers })
    await api.settings.set(SETTINGS_KEY, servers)
  },

  removeServer: async (id) => {
    const servers = get().servers.filter((s) => s.id !== id)
    set({ servers })
    await api.settings.set(SETTINGS_KEY, servers)
  },

  updateServer: async (id, updates) => {
    const servers = get().servers.map((s) => (s.id === id ? { ...s, ...updates } : s))
    set({ servers })
    await api.settings.set(SETTINGS_KEY, servers)
  },

  toggleServer: async (id) => {
    const servers = get().servers.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    set({ servers })
    await api.settings.set(SETTINGS_KEY, servers)
  },
}))
