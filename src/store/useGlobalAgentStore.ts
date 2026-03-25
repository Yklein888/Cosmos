import { create } from 'zustand'
import { AGENT_TEMPLATES } from '../data/agent-templates'
import type { AgentDefinition } from '../types'

interface GlobalAgentStore {
  // All global agents (built-in + custom) with full definitions
  globalAgents: Map<string, AgentDefinition>

  // Toggle agent on/off globally
  toggleAgent: (agentId: string) => void

  // Update global agent
  updateGlobalAgent: (agentId: string, updates: Partial<AgentDefinition>) => void

  // Get all global agents
  getGlobalAgents: () => AgentDefinition[]

  // Add custom global agent
  addCustomGlobalAgent: (agent: AgentDefinition) => void

  // Merge legacy agents from project-local settings into the global registry
  importAgents: (agents: AgentDefinition[]) => void

  // Remove custom global agent
  removeCustomGlobalAgent: (agentId: string) => void

  // Load from localStorage
  loadFromStorage: () => void

  // Save to localStorage
  saveToStorage: () => void
}

// Default agents that come enabled
const DEFAULT_ENABLED_IDS = new Set(['developer', 'architect', 'pm'])

export const useGlobalAgentStore = create<GlobalAgentStore>((set, get) => ({
  globalAgents: new Map(),

  toggleAgent: (agentId: string) => {
    set((state) => {
      const agent = state.globalAgents.get(agentId)
      if (agent) {
        const updated = { ...agent, enabled: !agent.enabled }
        const newMap = new Map(state.globalAgents)
        newMap.set(agentId, updated)
        return { globalAgents: newMap }
      }
      return state
    })
    get().saveToStorage()
  },

  updateGlobalAgent: (agentId: string, updates: Partial<AgentDefinition>) => {
    set((state) => {
      const agent = state.globalAgents.get(agentId)
      if (agent) {
        const newMap = new Map(state.globalAgents)
        newMap.set(agentId, { ...agent, ...updates })
        return { globalAgents: newMap }
      }
      return state
    })
    get().saveToStorage()
  },

  getGlobalAgents: () => {
    const state = get()
    return Array.from(state.globalAgents.values()).sort((a, b) => {
      if (a.enabled !== b.enabled) return b.enabled ? 1 : -1
      return a.name.localeCompare(b.name)
    })
  },

  addCustomGlobalAgent: (agent: AgentDefinition) => {
    set((state) => {
      const newMap = new Map(state.globalAgents)
      newMap.set(agent.id, { ...agent, enabled: true })
      return { globalAgents: newMap }
    })
    get().saveToStorage()
  },

  importAgents: (agents: AgentDefinition[]) => {
    if (agents.length === 0) return

    set((state) => {
      const newMap = new Map(state.globalAgents)
      for (const agent of agents) {
        newMap.set(agent.id, { ...agent, enabled: agent.enabled ?? true })
      }
      return { globalAgents: newMap }
    })
    get().saveToStorage()
  },

  removeCustomGlobalAgent: (agentId: string) => {
    set((state) => {
      const newMap = new Map(state.globalAgents)
      newMap.delete(agentId)
      return { globalAgents: newMap }
    })
    get().saveToStorage()
  },

  loadFromStorage: () => {
    try {
      const stored = localStorage.getItem('cosmos:global-agents')
      if (stored) {
        const { globalAgents: storedAgents } = JSON.parse(stored)
        const agentsMap = new Map()

        // Initialize with built-in templates
        AGENT_TEMPLATES.forEach((template) => {
          agentsMap.set(template.id, {
            ...template,
            enabled: DEFAULT_ENABLED_IDS.has(template.id),
          })
        })

        // Override with stored values
        if (storedAgents) {
          Object.entries(storedAgents).forEach(([id, agent]: any) => {
            agentsMap.set(id, { ...agent, enabled: agent.enabled ?? true })
          })
        }

        set({ globalAgents: agentsMap })
      } else {
        // Initialize with defaults
        const agentsMap = new Map()
        AGENT_TEMPLATES.forEach((template) => {
          agentsMap.set(template.id, {
            ...template,
            enabled: DEFAULT_ENABLED_IDS.has(template.id),
          })
        })
        set({ globalAgents: agentsMap })
      }
    } catch (err) {
      console.error('Failed to load agent settings:', err)
    }
  },

  saveToStorage: () => {
    try {
      const state = get()
      const agentsObj: Record<string, AgentDefinition> = {}
      state.globalAgents.forEach((agent, id) => {
        agentsObj[id] = agent
      })
      localStorage.setItem(
        'cosmos:global-agents',
        JSON.stringify({ globalAgents: agentsObj })
      )
    } catch (err) {
      console.error('Failed to save agent settings:', err)
    }
  },
}))

// Load settings on app startup
if (typeof window !== 'undefined') {
  useGlobalAgentStore.getState().loadFromStorage()
}
