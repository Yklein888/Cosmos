import { useState } from 'react'
import { Icon } from '../common/Icon'
import { IconPicker } from '../common/IconPicker'
import { GradientAvatar } from './components/GradientAvatar'
import { FormInput } from './components/FormInput'
import { FormSelect } from './components/FormSelect'
import { FormTextarea } from './components/FormTextarea'
import { useGlobalAgentStore } from '../../store/useGlobalAgentStore'
import type { AgentDefinition } from '../../types'

export function GlobalAgentsEditor() {
  const { getGlobalAgents, updateGlobalAgent, toggleAgent, removeCustomGlobalAgent } = useGlobalAgentStore()
  const globalAgents = getGlobalAgents()
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(globalAgents[0]?.id || null)
  const selectedAgent = globalAgents.find((a) => a.id === selectedAgentId)

  if (!selectedAgent) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-500">
        <p>No agents configured</p>
      </div>
    )
  }

  const isBuiltIn = ['developer', 'architect', 'pm', 'code-reviewer', 'security-auditor', 'performance-analyzer', 'docs-writer', 'test-generator'].includes(selectedAgent.id)

  return (
    <div className="flex gap-6 h-full">
      {/* Agent List */}
      <div className="w-64 border-r border-cosmos-border flex flex-col">
        <div className="p-4 border-b border-cosmos-border">
          <h3 className="text-xs font-bold text-zinc-400 uppercase">Global Agents</h3>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1 p-2">
          {globalAgents.map((agent) => (
            <button
              key={agent.id}
              onClick={() => setSelectedAgentId(agent.id)}
              className={`w-full flex items-center gap-2 p-2 rounded transition-colors text-left text-xs ${
                selectedAgent.id === agent.id
                  ? 'bg-cosmos-accent/10 border border-cosmos-accent text-white'
                  : 'hover:bg-zinc-800/50 text-zinc-400'
              }`}
            >
              <div className="w-6 h-6 flex-shrink-0">
                <GradientAvatar gradient={agent.color || 'blue'} icon={agent.icon} size="xs" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{agent.name}</p>
                <p className="text-[10px] text-zinc-500 truncate">{agent.role || 'Agent'}</p>
              </div>
              {agent.enabled && (
                <Icon icon="lucide:check" className="text-xs text-cosmos-accent flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Agent Editor */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16">
                <GradientAvatar gradient={selectedAgent.color || 'blue'} icon={selectedAgent.icon} size="lg" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{selectedAgent.name}</h2>
                <p className="text-sm text-zinc-500">{selectedAgent.role || 'Global Agent'}</p>
              </div>
            </div>
            <button
              onClick={() => toggleAgent(selectedAgent.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                selectedAgent.enabled
                  ? 'bg-cosmos-accent/20 text-cosmos-accent border border-cosmos-accent/50'
                  : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
              }`}
            >
              {selectedAgent.enabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          {/* Identity */}
          <div className="space-y-4 max-w-lg">
            <div>
              <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-4">Identity</h3>
              <div className="space-y-4">
                <FormInput
                  label="Agent Name"
                  value={selectedAgent.name}
                  onChange={(e) => updateGlobalAgent(selectedAgent.id, { name: e.target.value })}
                />
                <FormInput
                  label="Role"
                  value={selectedAgent.role || ''}
                  onChange={(e) => updateGlobalAgent(selectedAgent.id, { role: e.target.value })}
                />
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Icon</label>
                  <IconPicker
                    value={selectedAgent.icon}
                    onChange={(icon) => updateGlobalAgent(selectedAgent.id, { icon })}
                  />
                </div>
                <FormSelect
                  label="Color Theme"
                  value={selectedAgent.color || 'blue'}
                  onChange={(e) => updateGlobalAgent(selectedAgent.id, { color: e.target.value })}
                  options={[
                    { value: 'blue', label: 'Blue' },
                    { value: 'green', label: 'Green' },
                    { value: 'purple', label: 'Purple' },
                    { value: 'orange', label: 'Orange' },
                    { value: 'pink', label: 'Pink' },
                    { value: 'cyan', label: 'Cyan' },
                  ]}
                />
              </div>
            </div>

            {/* Personality */}
            <div>
              <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-4">Personality</h3>
              <div className="space-y-4">
                <FormTextarea
                  label="Expertise"
                  value={selectedAgent.expertise || ''}
                  onChange={(e) => updateGlobalAgent(selectedAgent.id, { expertise: e.target.value })}
                  placeholder="e.g., Full-stack web development, DevOps, Cloud architecture"
                />
                <FormTextarea
                  label="Personality"
                  value={selectedAgent.personality || ''}
                  onChange={(e) => updateGlobalAgent(selectedAgent.id, { personality: e.target.value })}
                  placeholder="e.g., Direct and pragmatic, avoids unnecessary complexity"
                />
                <FormTextarea
                  label="Description"
                  value={selectedAgent.description || ''}
                  onChange={(e) => updateGlobalAgent(selectedAgent.id, { description: e.target.value })}
                />
              </div>
            </div>

            {/* Danger Zone */}
            {!isBuiltIn && (
              <div className="pt-4 border-t border-cosmos-border">
                <button
                  onClick={() => {
                    removeCustomGlobalAgent(selectedAgent.id)
                    const remaining = globalAgents.filter((a) => a.id !== selectedAgent.id)
                    setSelectedAgentId(remaining[0]?.id || null)
                  }}
                  className="px-3 py-1.5 text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 rounded hover:bg-red-500/20 transition-colors"
                >
                  Delete Custom Agent
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
