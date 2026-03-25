import { create } from 'zustand'
import { AGENT_TEMPLATES } from '../data/agent-templates'
import type { AgentDefinition } from '../types'

interface GlobalAgentStore {
  // Default agents enabled for all new projects
  enabledAgentIds: Set<string>

  // Custom agents from marketplace or user-created
  customAgents: AgentDefinition[]

  // Toggle agent on/off
  toggleAgent: (agentId: string) => void

  // Set multiple agents at once
  setEnabledAgents: (agentIds: string[]) => void

  // Get all enabled agents (built-in + custom)
  getEnabledAgents: () => AgentDefinition[]

  // Add custom agent
  addCustomAgent: (agent: AgentDefinition) => void

  // Remove custom agent
  removeCustomAgent: (agentId: string) => void

  // Load from localStorage
  loadFromStorage: () => void

  // Save to localStorage
  saveToStorage: () => void
}

// Default agents that come enabled
const DEFAULT_ENABLED_IDS = new Set(['developer', 'architect', 'pm'])

export const useGlobalAgentStore = create<GlobalAgentStore>((set, get) => ({
  enabledAgentIds: DEFAULT_ENABLED_IDS,
  customAgents: [],

  toggleAgent: (agentId: string) => {
    set((state) => {
      const newEnabled = new Set(state.enabledAgentIds)
      if (newEnabled.has(agentId)) {
        newEnabled.delete(agentId)
      } else {
        newEnabled.add(agentId)
      }
      return { enabledAgentIds: newEnabled }
    })
    get().saveToStorage()
  },

  setEnabledAgents: (agentIds: string[]) => {
    set({ enabledAgentIds: new Set(agentIds) })
    get().saveToStorage()
  },

  getEnabledAgents: () => {
    const state = get()
    const builtIn = AGENT_TEMPLATES.filter((a) => state.enabledAgentIds.has(a.id))
    return [...builtIn, ...state.customAgents]
  },

  addCustomAgent: (agent: AgentDefinition) => {
    set((state) => ({
      customAgents: [...state.customAgents, agent],
      enabledAgentIds: new Set([...state.enabledAgentIds, agent.id]),
    }))
    get().saveToStorage()
  },

  removeCustomAgent: (agentId: string) => {
    set((state) => ({
      customAgents: state.customAgents.filter((a) => a.id !== agentId),
      enabledAgentIds: new Set([...state.enabledAgentIds].filter((id) => id !== agentId)),
    }))
    get().saveToStorage()
  },

  loadFromStorage: () => {
    try {
      const stored = localStorage.getItem('cosmos:global-agents')
      if (stored) {
        const { enabledAgentIds, customAgents } = JSON.parse(stored)
        set({
          enabledAgentIds: new Set(enabledAgentIds || Array.from(DEFAULT_ENABLED_IDS)),
          customAgents: customAgents || [],
        })
      }
    } catch (err) {
      console.error('Failed to load agent settings:', err)
    }
  },

  saveToStorage: () => {
    try {
      const state = get()
      localStorage.setItem(
        'cosmos:global-agents',
        JSON.stringify({
          enabledAgentIds: Array.from(state.enabledAgentIds),
          customAgents: state.customAgents,
        })
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
