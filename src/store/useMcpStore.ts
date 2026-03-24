import { create } from 'zustand'

export interface MCPServer {
  id: string
  name: string
  description: string
  installed: boolean
  config?: Record<string, unknown>
}

interface MCPState {
  servers: MCPServer[]
  addServer: (server: MCPServer) => void
  removeServer: (serverId: string) => void
  toggleServer: (serverId: string) => void
  updateServerConfig: (serverId: string, config: Record<string, unknown>) => void
}

export const useMcpStore = create<MCPState>((set) => ({
  servers: [],
  addServer: (server) =>
    set((state) => ({
      servers: [...state.servers, server],
    })),
  removeServer: (serverId) =>
    set((state) => ({
      servers: state.servers.filter((s) => s.id !== serverId),
    })),
  toggleServer: (serverId) =>
    set((state) => ({
      servers: state.servers.map((server) =>
        server.id === serverId
          ? { ...server, installed: !server.installed }
          : server
      ),
    })),
  updateServerConfig: (serverId, config) =>
    set((state) => ({
      servers: state.servers.map((server) =>
        server.id === serverId ? { ...server, config } : server
      ),
    })),
}))
