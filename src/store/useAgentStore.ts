import { create } from 'zustand'

export interface Agent {
  name: 'pm' | 'architect' | 'developer' | 'designer' | 'security'
  enabled: boolean
  description: string
  systemPrompt?: string
}

interface AgentState {
  agents: Agent[]
  initializeAgents: () => void
  toggleAgent: (agentName: Agent['name']) => void
  updateAgentPrompt: (agentName: Agent['name'], prompt: string) => void
}

const DEFAULT_AGENTS: Agent[] = [
  {
    name: 'pm',
    enabled: true,
    description: 'Project Manager - Oversees project scope and timeline',
  },
  {
    name: 'architect',
    enabled: true,
    description: 'Architect - Designs system architecture',
  },
  {
    name: 'developer',
    enabled: true,
    description: 'Developer - Implements features and fixes bugs',
  },
  {
    name: 'designer',
    enabled: true,
    description: 'Designer - Creates UI/UX designs',
  },
  {
    name: 'security',
    enabled: true,
    description: 'Security Agent - Reviews security concerns',
  },
]

export const useAgentStore = create<AgentState>((set) => ({
  agents: DEFAULT_AGENTS,
  initializeAgents: () => set({ agents: DEFAULT_AGENTS }),
  toggleAgent: (agentName) =>
    set((state) => ({
      agents: state.agents.map((agent) =>
        agent.name === agentName ? { ...agent, enabled: !agent.enabled } : agent
      ),
    })),
  updateAgentPrompt: (agentName, prompt) =>
    set((state) => ({
      agents: state.agents.map((agent) =>
        agent.name === agentName ? { ...agent, systemPrompt: prompt } : agent
      ),
    })),
}))
