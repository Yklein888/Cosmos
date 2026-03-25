import { create } from 'zustand'

export interface AgentInsight {
  id: string
  agentId: string
  agentName: string
  agentIcon: string
  text: string
  type: 'info' | 'warning' | 'suggestion'
  createdAt: string
  conversationId?: string
}

interface ListeningAgentStore {
  insights: AgentInsight[]
  isListening: boolean
  sidebarOpen: boolean
  enabledAgentIds: Set<string>

  addInsight: (insight: Omit<AgentInsight, 'id' | 'createdAt'>) => void
  dismissInsight: (id: string) => void
  clearInsights: () => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setListening: (val: boolean) => void
  toggleAgent: (agentId: string) => void
  injectInsightToChat: (id: string) => string
}

export const useListeningAgentStore = create<ListeningAgentStore>((set, get) => ({
  insights: [],
  isListening: false,
  sidebarOpen: false,
  enabledAgentIds: new Set<string>(),

  addInsight: (insight) => {
    const entry: AgentInsight = {
      ...insight,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    set((s) => ({
      insights: [entry, ...s.insights].slice(0, 50), // keep last 50
      sidebarOpen: true, // auto-open when new insight arrives
    }))
  },

  dismissInsight: (id) => {
    set((s) => ({ insights: s.insights.filter((i) => i.id !== id) }))
  },

  clearInsights: () => {
    set({ insights: [] })
  },

  toggleSidebar: () => {
    set((s) => ({ sidebarOpen: !s.sidebarOpen }))
  },

  setSidebarOpen: (open) => {
    set({ sidebarOpen: open })
  },

  setListening: (val) => {
    set({ isListening: val })
  },

  toggleAgent: (agentId) => {
    set((s) => {
      const next = new Set(s.enabledAgentIds)
      if (next.has(agentId)) {
        next.delete(agentId)
      } else {
        next.add(agentId)
      }
      return { enabledAgentIds: next }
    })
  },

  injectInsightToChat: (id) => {
    const insight = get().insights.find((i) => i.id === id)
    return insight ? `[${insight.agentName}]: ${insight.text}` : ''
  },
}))
