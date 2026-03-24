import { useEffect, useState } from 'react'
import { useAgentStore } from '../../store/useAgentStore'
import './AgentPanel.css'

export default function AgentPanel() {
  const agents = useAgentStore((state) => state.agents)
  const toggleAgent = useAgentStore((state) => state.toggleAgent)
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)

  useEffect(() => {
    if (selectedAgent === null && agents.length > 0) {
      setSelectedAgent(agents[0].name)
    }
  }, [agents, selectedAgent])

  return (
    <div className="agent-panel">
      <div className="agents-list">
        <h3>Active Agents</h3>
        {agents.map((agent) => (
          <div
            key={agent.name}
            className={`agent-item ${selectedAgent === agent.name ? 'selected' : ''}`}
            onClick={() => setSelectedAgent(agent.name)}
          >
            <div className="agent-header">
              <span className="agent-name">{agent.description}</span>
              <label className="agent-toggle">
                <input
                  type="checkbox"
                  checked={agent.enabled}
                  onChange={() => toggleAgent(agent.name)}
                  onClick={(e) => e.stopPropagation()}
                />
                <span className="toggle-switch" />
              </label>
            </div>
            {agent.enabled && <span className="agent-active-indicator">●</span>}
          </div>
        ))}
      </div>

      {selectedAgent && (
        <div className="agent-details">
          <h4>{selectedAgent.toUpperCase()}</h4>
          <p>Specialized agent for project oversight and intelligence</p>
          <div className="agent-actions">
            <button className="action-btn">View Memory</button>
            <button className="action-btn">Configure</button>
          </div>
        </div>
      )}
    </div>
  )
}
