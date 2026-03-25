import { useState, useMemo, useCallback, useEffect } from 'react'
import { Icon } from '../common/Icon'
import { McpIcon } from '../mcp/McpIcon'
import { IconPicker } from '../common/IconPicker'
import { GradientAvatar } from './components/GradientAvatar'
import { StatusDot } from './components/StatusDot'
import { TokenMeter } from './components/TokenMeter'
import { FormInput } from './components/FormInput'
import { FormSelect } from './components/FormSelect'
import { FormTextarea } from './components/FormTextarea'
import { FormToggle } from './components/FormToggle'
import { AddAgentDialog } from './AddAgentDialog'
import { useGlobalAgentStore } from '../../store/useGlobalAgentStore'
import { useAnalyticsStore } from '../../store/useAnalyticsStore'
import type { AgentDefinition, AgentCapabilities, ResponseFormat } from '../../types'
import { AVAILABLE_TOOLS, DEFAULT_CAPABILITIES } from '../../data/agent-templates'
import { MCP_SERVER_TEMPLATES } from '../../data/mcp-server-templates'

const CONFIG_TABS = ['Basic Settings', 'Capabilities', 'Integrations', 'Memory & Context', 'Advanced'] as const

// ── Agent List Item ──────────────────────────────────────────────────────────

function AgentListItem({
  agent,
  isSelected,
  onClick,
}: {
  agent: AgentDefinition
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left ${
        isSelected
          ? 'bg-blue-500/10 border border-blue-500/20'
          : 'hover:bg-zinc-800/50 border border-transparent'
      }`}
    >
      <GradientAvatar gradient={agent.color} icon={agent.icon} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-white truncate">{agent.name}</h4>
          <StatusDot color={agent.enabled !== false ? 'green' : 'gray'} />
        </div>
        <p className="text-[10px] text-zinc-500 truncate">{agent.role}</p>
      </div>
    </button>
  )
}

// ── Agent Form ───────────────────────────────────────────────────────────────

function AgentForm({
  agent,
  onUpdate,
  onDelete,
}: {
  agent: AgentDefinition
  onUpdate: (updates: Partial<AgentDefinition>) => void
  onDelete: () => void
}) {
  const [activeTab, setActiveTab] = useState<typeof CONFIG_TABS[number]>('Basic Settings')

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Tabs */}
      <div className="flex items-center gap-1 px-4 border-b border-cosmos-border flex-shrink-0">
        {CONFIG_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-2.5 text-xs font-medium transition-colors border-b-2 ${
              activeTab === tab
                ? 'text-cosmos-accent border-cosmos-accent'
                : 'text-zinc-500 border-transparent hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        {activeTab === 'Basic Settings' && (
          <div className="space-y-6 max-w-lg">
            <div>
              <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-4">Identity & Model</h3>
              <div className="space-y-4">
                <FormInput
                  label="Agent Name"
                  value={agent.name}
                  onChange={(e) => onUpdate({ name: e.target.value })}
                />
                <FormInput
                  label="Role"
                  value={agent.role}
                  onChange={(e) => onUpdate({ role: e.target.value })}
                />
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Icon</label>
                  <IconPicker value={agent.icon} onChange={(icon) => onUpdate({ icon })} />
                </div>
                <FormSelect
                  label="Color Theme"
                  value={agent.color}
                  onChange={(e) => onUpdate({ color: e.target.value })}
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

            <div>
              <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-4">System Instructions</h3>
              <FormTextarea
                codeEditor
                value={agent.personality}
                onChange={(e) => onUpdate({ personality: e.target.value })}
                rows={8}
                placeholder="Define agent personality and behavior..."
              />
            </div>

            <div>
              <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-4">Expertise Areas</h3>
              <FormInput
                value={agent.expertise.join(', ')}
                onChange={(e) =>
                  onUpdate({ expertise: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })
                }
                placeholder="e.g. implementation, debugging, code review"
              />
              <p className="text-[10px] text-zinc-600 mt-1">Comma-separated list of expertise areas</p>
            </div>
          </div>
        )}

        {activeTab === 'Capabilities' && (() => {
          const caps = agent.capabilities || DEFAULT_CAPABILITIES
          const updateCaps = (updates: Partial<AgentCapabilities>) => {
            onUpdate({ capabilities: { ...caps, ...updates } })
          }
          const toggleTool = (toolId: string) => {
            const tools = caps.tools.includes(toolId)
              ? caps.tools.filter((t) => t !== toolId)
              : [...caps.tools, toolId]
            updateCaps({ tools })
          }

          return (
            <div className="space-y-8 max-w-lg">
              <div>
                <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Tool Access</h3>
                <p className="text-[10px] text-zinc-600 mb-4">Enable or disable tools this agent can use.</p>
                <div className="space-y-2">
                  {AVAILABLE_TOOLS.map((tool) => {
                    const enabled = caps.tools.includes(tool.id)
                    return (
                      <div
                        key={tool.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                          enabled ? 'bg-blue-500/5 border-blue-500/20' : 'bg-cosmos-card border-cosmos-border'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${enabled ? 'bg-blue-500/15' : 'bg-zinc-800'}`}>
                          <Icon icon={tool.icon} className={enabled ? 'text-blue-400' : 'text-zinc-500'} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-bold ${enabled ? 'text-white' : 'text-zinc-400'}`}>{tool.name}</p>
                          <p className="text-[10px] text-zinc-600">{tool.description}</p>
                        </div>
                        <FormToggle checked={enabled} onChange={() => toggleTool(tool.id)} />
                      </div>
                    )
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Permission Level</h3>
                <p className="text-[10px] text-zinc-600 mb-4">Control how much autonomy this agent has.</p>
                <div className="space-y-2">
                  {([
                    { value: 'restricted', label: 'Restricted', desc: 'Read-only access, no command execution', icon: 'lucide:shield' },
                    { value: 'standard', label: 'Standard', desc: 'Standard access with approval prompts', icon: 'lucide:shield-check' },
                    { value: 'elevated', label: 'Elevated', desc: 'Full access, auto-approve safe operations', icon: 'lucide:shield-off' },
                  ] as const).map((level) => {
                    const selected = caps.permissionLevel === level.value
                    return (
                      <button
                        key={level.value}
                        onClick={() => updateCaps({ permissionLevel: level.value })}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-colors ${
                          selected ? 'bg-blue-500/5 border-blue-500/20' : 'bg-cosmos-card border-cosmos-border hover:border-zinc-600'
                        }`}
                      >
                        <Icon icon={level.icon} className={selected ? 'text-blue-400' : 'text-zinc-500'} />
                        <div className="flex-1">
                          <p className={`text-xs font-bold ${selected ? 'text-white' : 'text-zinc-400'}`}>{level.label}</p>
                          <p className="text-[10px] text-zinc-600">{level.desc}</p>
                        </div>
                        {selected && <Icon icon="lucide:check" className="text-blue-400 text-sm" />}
                      </button>
                    )
                  })}
                </div>
              </div>

              {caps.tools.includes('fs_access') && (
                <div>
                  <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">File Access Restrictions</h3>
                  <p className="text-[10px] text-zinc-600 mb-4">Restrict which directories this agent can access.</p>
                  <FormInput
                    value={caps.allowedPaths.join(', ')}
                    onChange={(e) => updateCaps({ allowedPaths: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
                    placeholder="e.g. src/, tests/, docs/"
                  />
                </div>
              )}

              <div>
                <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Token Limit</h3>
                <p className="text-[10px] text-zinc-600 mb-4">Maximum tokens per request for this agent.</p>
                <div className="flex items-center gap-4">
                  <input
                    type="range" min="1024" max="16384" step="1024"
                    value={caps.maxTokensPerRequest}
                    onChange={(e) => updateCaps({ maxTokensPerRequest: Number(e.target.value) })}
                    className="flex-1 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <span className="text-xs font-bold text-white font-mono w-16 text-right">
                    {caps.maxTokensPerRequest >= 1000 ? `${(caps.maxTokensPerRequest / 1024).toFixed(0)}k` : caps.maxTokensPerRequest}
                  </span>
                </div>
              </div>
            </div>
          )
        })()}

        {activeTab === 'Integrations' && (() => {
          const caps = agent.capabilities || DEFAULT_CAPABILITIES
          const allowed = caps.allowedMcpServers || []
          const allAccess = allowed.length === 0
          const updateCaps = (updates: Partial<AgentCapabilities>) => {
            onUpdate({ capabilities: { ...caps, ...updates } })
          }

          return (
            <div className="space-y-8 max-w-lg">
              <div>
                <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">MCP Server Access</h3>
                <p className="text-[10px] text-zinc-600 mb-4">Control which MCP servers this agent can use. All servers are accessible by default.</p>
                <div className="flex items-center justify-between p-3 bg-cosmos-card border border-cosmos-border rounded-lg mb-3">
                  <div>
                    <p className="text-xs font-bold text-white">Access All Servers</p>
                    <p className="text-[10px] text-zinc-600">Agent can use any MCP server</p>
                  </div>
                  <FormToggle
                    checked={allAccess}
                    onChange={(checked) => updateCaps({ allowedMcpServers: checked ? [] : [] })}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Available Integrations</h3>
                <p className="text-[10px] text-zinc-600 mb-4">MCP server templates available for projects.</p>
                <div className="space-y-2">
                  {MCP_SERVER_TEMPLATES.map((template) => (
                    <div key={template.id} className="flex items-center gap-3 p-3 bg-cosmos-card border border-cosmos-border rounded-lg">
                      <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-base">
                        <McpIcon icon={template.icon} className="w-5 h-5 text-zinc-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-zinc-300">{template.name}</p>
                          <span className="text-[9px] text-zinc-600 bg-zinc-800 px-1.5 py-0.5 rounded">{template.category}</span>
                        </div>
                        <p className="text-[10px] text-zinc-600">{template.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })()}

        {activeTab === 'Memory & Context' && (() => {
          const caps = agent.capabilities || DEFAULT_CAPABILITIES
          const updateCaps = (updates: Partial<AgentCapabilities>) => {
            onUpdate({ capabilities: { ...caps, ...updates } })
          }

          return (
            <div className="space-y-8 max-w-lg">
              <div>
                <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Context Window</h3>
                <p className="text-[10px] text-zinc-600 mb-4">Maximum context window size for this agent.</p>
                <div className="flex items-center gap-4">
                  <input
                    type="range" min="32000" max="200000" step="8000"
                    value={caps.contextWindowSize}
                    onChange={(e) => updateCaps({ contextWindowSize: Number(e.target.value) })}
                    className="flex-1 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <span className="text-xs font-bold text-white font-mono w-16 text-right">
                    {Math.round(caps.contextWindowSize / 1000)}k
                  </span>
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className="text-[10px] text-zinc-600">32k</span>
                  <span className="text-[10px] text-zinc-600">200k</span>
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Conversation History</h3>
                <p className="text-[10px] text-zinc-600 mb-4">Number of previous messages to include as context. Set to 0 for unlimited.</p>
                <div className="flex items-center gap-4">
                  <input
                    type="range" min="0" max="200" step="10"
                    value={caps.conversationHistoryLimit}
                    onChange={(e) => updateCaps({ conversationHistoryLimit: Number(e.target.value) })}
                    className="flex-1 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <span className="text-xs font-bold text-white font-mono w-16 text-right">
                    {caps.conversationHistoryLimit === 0 ? '∞' : caps.conversationHistoryLimit}
                  </span>
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className="text-[10px] text-zinc-600">Unlimited</span>
                  <span className="text-[10px] text-zinc-600">200</span>
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Memory</h3>
                <p className="text-[10px] text-zinc-600 mb-4">Control how this agent retains and manages knowledge.</p>
                <div className="space-y-2">
                  <div className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${caps.memoryEnabled ? 'bg-blue-500/5 border-blue-500/20' : 'bg-cosmos-card border-cosmos-border'}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${caps.memoryEnabled ? 'bg-blue-500/15' : 'bg-zinc-800'}`}>
                      <Icon icon="lucide:brain" className={caps.memoryEnabled ? 'text-blue-400' : 'text-zinc-500'} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-bold ${caps.memoryEnabled ? 'text-white' : 'text-zinc-400'}`}>Persistent Memory</p>
                      <p className="text-[10px] text-zinc-600">Remember information across conversation sessions</p>
                    </div>
                    <FormToggle checked={caps.memoryEnabled} onChange={(v) => updateCaps({ memoryEnabled: v })} />
                  </div>

                  {caps.memoryEnabled && (
                    <div className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${caps.memorySummarizationEnabled ? 'bg-blue-500/5 border-blue-500/20' : 'bg-cosmos-card border-cosmos-border'}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${caps.memorySummarizationEnabled ? 'bg-blue-500/15' : 'bg-zinc-800'}`}>
                        <Icon icon="lucide:file-text" className={caps.memorySummarizationEnabled ? 'text-blue-400' : 'text-zinc-500'} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-bold ${caps.memorySummarizationEnabled ? 'text-white' : 'text-zinc-400'}`}>Auto-Summarization</p>
                        <p className="text-[10px] text-zinc-600">Automatically summarize long conversations to save context</p>
                      </div>
                      <FormToggle checked={caps.memorySummarizationEnabled} onChange={(v) => updateCaps({ memorySummarizationEnabled: v })} />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Custom Instructions</h3>
                <p className="text-[10px] text-zinc-600 mb-4">Agent-specific instructions always included in the system prompt.</p>
                <FormTextarea
                  codeEditor
                  value={caps.customInstructions}
                  onChange={(e) => updateCaps({ customInstructions: e.target.value })}
                  rows={8}
                  placeholder="e.g. Always use TypeScript strict mode. Follow the project's ESLint config..."
                />
              </div>
            </div>
          )
        })()}

        {activeTab === 'Advanced' && (() => {
          const caps = agent.capabilities || DEFAULT_CAPABILITIES
          const updateCaps = (updates: Partial<AgentCapabilities>) => {
            onUpdate({ capabilities: { ...caps, ...updates } })
          }

          return (
            <div className="space-y-8 max-w-lg">
              <div>
                <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Response Behavior</h3>
                <p className="text-[10px] text-zinc-600 mb-4">Control how this agent generates responses.</p>
                <div className="mb-6">
                  <label className="block text-xs font-medium text-zinc-400 mb-3">Temperature</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range" min="0" max="1" step="0.1"
                      value={caps.temperature}
                      onChange={(e) => updateCaps({ temperature: Number(e.target.value) })}
                      className="flex-1 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <span className="text-xs font-bold text-white font-mono w-10 text-right">{caps.temperature.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between mt-1.5">
                    <span className="text-[10px] text-zinc-600">Precise</span>
                    <span className="text-[10px] text-zinc-600">Creative</span>
                  </div>
                </div>
                <label className="block text-xs font-medium text-zinc-400 mb-3">Response Format</label>
                <div className="space-y-2">
                  {([
                    { value: 'markdown', label: 'Markdown', desc: 'Rich formatting with headers, code blocks, and lists', icon: 'lucide:file-type' },
                    { value: 'plain', label: 'Plain Text', desc: 'Simple unformatted text responses', icon: 'lucide:type' },
                    { value: 'structured', label: 'Structured', desc: 'JSON-like structured output for programmatic use', icon: 'lucide:braces' },
                  ] as const).map((fmt) => {
                    const selected = caps.responseFormat === fmt.value
                    return (
                      <button
                        key={fmt.value}
                        onClick={() => updateCaps({ responseFormat: fmt.value as ResponseFormat })}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-colors ${
                          selected ? 'bg-blue-500/5 border-blue-500/20' : 'bg-cosmos-card border-cosmos-border hover:border-zinc-600'
                        }`}
                      >
                        <Icon icon={fmt.icon} className={selected ? 'text-blue-400' : 'text-zinc-500'} />
                        <div className="flex-1">
                          <p className={`text-xs font-bold ${selected ? 'text-white' : 'text-zinc-400'}`}>{fmt.label}</p>
                          <p className="text-[10px] text-zinc-600">{fmt.desc}</p>
                        </div>
                        {selected && <Icon icon="lucide:check" className="text-blue-400 text-sm" />}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Reliability</h3>
                <p className="text-[10px] text-zinc-600 mb-4">Configure retry and timeout behavior for operations.</p>
                <div className="mb-6">
                  <label className="block text-xs font-medium text-zinc-400 mb-3">Max Retries</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range" min="0" max="5" step="1"
                      value={caps.maxRetries}
                      onChange={(e) => updateCaps({ maxRetries: Number(e.target.value) })}
                      className="flex-1 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <span className="text-xs font-bold text-white font-mono w-10 text-right">{caps.maxRetries}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-3">Request Timeout</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range" min="30" max="600" step="30"
                      value={caps.timeoutSeconds}
                      onChange={(e) => updateCaps({ timeoutSeconds: Number(e.target.value) })}
                      className="flex-1 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <span className="text-xs font-bold text-white font-mono w-10 text-right">
                      {caps.timeoutSeconds >= 60 ? `${Math.floor(caps.timeoutSeconds / 60)}m${caps.timeoutSeconds % 60 ? caps.timeoutSeconds % 60 + 's' : ''}` : `${caps.timeoutSeconds}s`}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Execution</h3>
                <p className="text-[10px] text-zinc-600 mb-4">Control agent execution behavior and logging.</p>
                <div className="space-y-2">
                  <div className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${caps.autoApproveReadOnly ? 'bg-blue-500/5 border-blue-500/20' : 'bg-cosmos-card border-cosmos-border'}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${caps.autoApproveReadOnly ? 'bg-blue-500/15' : 'bg-zinc-800'}`}>
                      <Icon icon="lucide:check-circle" className={caps.autoApproveReadOnly ? 'text-blue-400' : 'text-zinc-500'} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-bold ${caps.autoApproveReadOnly ? 'text-white' : 'text-zinc-400'}`}>Auto-Approve Read-Only</p>
                      <p className="text-[10px] text-zinc-600">Automatically approve read-only operations without prompting</p>
                    </div>
                    <FormToggle checked={caps.autoApproveReadOnly} onChange={(v) => updateCaps({ autoApproveReadOnly: v })} />
                  </div>
                  <div className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${caps.debugMode ? 'bg-amber-500/5 border-amber-500/20' : 'bg-cosmos-card border-cosmos-border'}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${caps.debugMode ? 'bg-amber-500/15' : 'bg-zinc-800'}`}>
                      <Icon icon="lucide:bug" className={caps.debugMode ? 'text-amber-400' : 'text-zinc-500'} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-bold ${caps.debugMode ? 'text-white' : 'text-zinc-400'}`}>Debug Mode</p>
                      <p className="text-[10px] text-zinc-600">Enable verbose logging for troubleshooting agent behavior</p>
                    </div>
                    <FormToggle checked={caps.debugMode} onChange={(v) => updateCaps({ debugMode: v })} />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-bold text-red-500/70 uppercase tracking-widest mb-1">Danger Zone</h3>
                <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
                  <p className="text-[10px] text-zinc-500 mb-3">Reset all capability, integration, memory, and advanced settings to defaults.</p>
                  <button
                    onClick={() => onUpdate({ capabilities: { ...DEFAULT_CAPABILITIES } })}
                    className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5"
                  >
                    <Icon icon="lucide:rotate-ccw" className="text-xs" />
                    Reset to Defaults
                  </button>
                </div>
              </div>
            </div>
          )
        })()}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-6 py-3 border-t border-cosmos-border flex-shrink-0">
        <button
          onClick={onDelete}
          className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5"
        >
          <Icon icon="lucide:trash-2" className="text-xs" />
          Delete Agent
        </button>
        <div className="flex items-center gap-1.5 text-zinc-600">
          <Icon icon="lucide:check-circle" className="text-xs text-emerald-500/60" />
          <span className="text-[10px]">Changes saved automatically</span>
        </div>
      </div>
    </div>
  )
}

// ── Main Editor ──────────────────────────────────────────────────────────────

export function GlobalAgentsEditor() {
  const { getGlobalAgents, updateGlobalAgent, removeCustomGlobalAgent, addCustomGlobalAgent } = useGlobalAgentStore()
  const globalAgents = getGlobalAgents()
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(globalAgents[0]?.id || null)
  const [searchQuery, setSearchQuery] = useState('')
  const [addDialogOpen, setAddDialogOpen] = useState(false)

  const selectedAgent = globalAgents.find((a) => a.id === selectedAgentId)

  const filteredAgents = globalAgents.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Per-agent analytics
  const allEntries = useAnalyticsStore((s) => s.entries)
  const agentStats = useMemo(() => {
    if (!selectedAgent) return null
    const entries = allEntries.filter((e) => e.agentName === selectedAgent.name)
    if (entries.length === 0) return null
    const successCount = entries.filter((e) => e.success).length
    const successRate = Math.round((successCount / entries.length) * 100)
    const avgTime = entries.reduce((sum, e) => sum + e.durationMs, 0) / entries.length
    const totalTokens = entries.reduce((sum, e) => sum + e.tokens, 0)
    return { sessions: entries.length, successRate, avgTime, totalTokens }
  }, [selectedAgent, allEntries])

  // Listen for "New Agent" event from header button
  const openAddDialog = useCallback(() => setAddDialogOpen(true), [])
  useEffect(() => {
    window.addEventListener('cosmos:new-agent', openAddDialog)
    return () => window.removeEventListener('cosmos:new-agent', openAddDialog)
  }, [openAddDialog])

  const handleAddAgent = (agent: AgentDefinition) => {
    addCustomGlobalAgent(agent)
    setSelectedAgentId(agent.id)
  }

  const handleUpdateAgent = (updates: Partial<AgentDefinition>) => {
    if (selectedAgentId) updateGlobalAgent(selectedAgentId, updates)
  }

  const handleDeleteAgent = () => {
    if (!selectedAgent) return
    removeCustomGlobalAgent(selectedAgent.id)
    const remaining = globalAgents.filter((a) => a.id !== selectedAgent.id)
    setSelectedAgentId(remaining[0]?.id || null)
  }

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Agent List Sidebar */}
      <div className="w-72 border-r border-cosmos-border bg-cosmos-bg flex flex-col flex-shrink-0">
        <div className="p-3 space-y-2">
          <div className="relative">
            <Icon icon="lucide:search" className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 text-xs" />
            <input
              type="text"
              placeholder="Search agents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-cosmos-card border border-cosmos-border rounded-lg text-xs text-white placeholder-zinc-600 outline-none focus:border-cosmos-accent"
            />
          </div>
          <button
            onClick={() => setAddDialogOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-cosmos-card border border-cosmos-border rounded-lg text-xs font-medium hover:border-zinc-600 text-zinc-300 transition-colors"
          >
            <Icon icon="lucide:plus" className="text-xs" />
            New Agent
          </button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar px-2 space-y-0.5">
          {filteredAgents.map((agent) => (
            <AgentListItem
              key={agent.id}
              agent={agent}
              isSelected={selectedAgentId === agent.id}
              onClick={() => setSelectedAgentId(agent.id)}
            />
          ))}
          {filteredAgents.length === 0 && (
            <div className="p-4 text-center">
              <p className="text-[10px] text-zinc-600">No agents found</p>
            </div>
          )}
        </div>
      </div>

      {/* Config Form */}
      {selectedAgent ? (
        <AgentForm
          agent={selectedAgent}
          onUpdate={handleUpdateAgent}
          onDelete={handleDeleteAgent}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Icon icon="lucide:user-cog" className="text-zinc-800 text-3xl mb-3" />
            <h3 className="text-sm font-medium text-zinc-500 mb-1">Select an agent</h3>
            <p className="text-xs text-zinc-600">Choose an agent from the list to configure</p>
          </div>
        </div>
      )}

      {/* Performance Sidebar */}
      {selectedAgent && (
        <div className="w-64 border-l border-cosmos-border bg-cosmos-bg p-4 overflow-y-auto custom-scrollbar flex-shrink-0">
          <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-4">Performance</h3>
          <div className="flex flex-col items-center p-4 bg-cosmos-card border border-cosmos-border rounded-xl mb-4">
            <TokenMeter
              used={agentStats?.successRate ?? 0}
              total={100}
              size={64}
              color={agentStats ? (agentStats.successRate >= 90 ? '#10b981' : agentStats.successRate >= 70 ? '#f59e0b' : '#ef4444') : '#3b82f6'}
              label={agentStats ? `${agentStats.successRate}%` : '--'}
            />
            <p className="text-[10px] text-zinc-500 mt-2">Success Rate</p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-zinc-500">Sessions</span>
              <span className="text-xs font-bold text-white">{agentStats?.sessions ?? '--'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-zinc-500">Total Tokens</span>
              <span className="text-xs font-bold text-white">
                {agentStats ? (agentStats.totalTokens > 1000 ? `${(agentStats.totalTokens / 1000).toFixed(1)}k` : agentStats.totalTokens) : '--'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-zinc-500">Avg Response</span>
              <span className="text-xs font-bold text-white">
                {agentStats ? `${(agentStats.avgTime / 1000).toFixed(1)}s` : '--'}
              </span>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-3">Active Tools</h3>
            <div className="flex flex-wrap gap-1.5">
              {(selectedAgent.capabilities || DEFAULT_CAPABILITIES).tools.map((toolId) => {
                const tool = AVAILABLE_TOOLS.find((t) => t.id === toolId)
                if (!tool) return null
                return (
                  <span key={toolId} className="px-2 py-1 bg-zinc-800 text-zinc-400 text-[10px] font-bold rounded flex items-center gap-1.5">
                    <Icon icon={tool.icon} className="text-[10px]" />
                    {tool.name}
                  </span>
                )
              })}
              {(selectedAgent.capabilities || DEFAULT_CAPABILITIES).tools.length === 0 && (
                <span className="text-[10px] text-zinc-600">No tools enabled</span>
              )}
            </div>
          </div>
        </div>
      )}

      {addDialogOpen && (
        <AddAgentDialog
          onAdd={handleAddAgent}
          onClose={() => setAddDialogOpen(false)}
        />
      )}
    </div>
  )
}
