import { create } from 'zustand'

export interface MarketplaceItem {
  id: string
  name: string
  description: string
  author: string
  category: string
  installCount?: number
  type: 'mcp' | 'agent'
  installCommand?: string
  tags?: string[]
}

interface MarketplaceStore {
  mcpServers: MarketplaceItem[]
  loadingMcp: boolean
  installedMcp: MarketplaceItem[]
  installedAgents: MarketplaceItem[]

  fetchMcpServers: () => Promise<void>
  installMcp: (item: MarketplaceItem) => Promise<void>
  uninstallMcp: (id: string) => void
  installAgent: (item: MarketplaceItem) => Promise<void>
  uninstallAgent: (id: string) => void
}

// Smithery registry API
async function fetchSmitheryServers(): Promise<MarketplaceItem[]> {
  try {
    const res = await fetch('https://registry.smithery.ai/servers?pageSize=50&q=', {
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) throw new Error('Smithery fetch failed')
    const data = await res.json()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const servers: any[] = data.servers || data.items || data || []
    return servers.map((s) => ({
      id: s.qualifiedName || s.id || s.name,
      name: s.displayName || s.name,
      description: s.description || '',
      author: s.vendor?.name || s.author || 'Community',
      category: mapCategory(s.categories?.[0] || ''),
      installCount: s.useCount || s.downloads,
      type: 'mcp' as const,
      installCommand: s.qualifiedName ? `npx -y @smithery/cli@latest install ${s.qualifiedName}` : undefined,
      tags: (s.categories || []).slice(0, 3),
    }))
  } catch {
    return []
  }
}

function mapCategory(raw: string): string {
  const map: Record<string, string> = {
    development: 'Dev Tools',
    database: 'Databases',
    productivity: 'Productivity',
    communication: 'Communication',
    security: 'Security',
    analytics: 'Analytics',
    ai: 'AI',
  }
  return map[raw.toLowerCase()] || 'Dev Tools'
}

export const useMarketplaceStore = create<MarketplaceStore>((set, get) => ({
  mcpServers: [],
  loadingMcp: false,
  installedMcp: [],
  installedAgents: [],

  fetchMcpServers: async () => {
    set({ loadingMcp: true })
    try {
      const servers = await fetchSmitheryServers()
      set({ mcpServers: servers })
    } catch {
      set({ mcpServers: [] })
    } finally {
      set({ loadingMcp: false })
    }
  },

  installMcp: async (item) => {
    // In a full implementation this would call electron IPC to run the install command
    // For now, add to installed list
    const { installedMcp } = get()
    if (!installedMcp.find((m) => m.id === item.id)) {
      set({ installedMcp: [...installedMcp, item] })
    }
  },

  uninstallMcp: (id) => {
    set((s) => ({ installedMcp: s.installedMcp.filter((m) => m.id !== id) }))
  },

  installAgent: async (item) => {
    const { installedAgents } = get()
    if (!installedAgents.find((a) => a.id === item.id)) {
      set({ installedAgents: [...installedAgents, item] })
    }
  },

  uninstallAgent: (id) => {
    set((s) => ({ installedAgents: s.installedAgents.filter((a) => a.id !== id) }))
  },
}))
