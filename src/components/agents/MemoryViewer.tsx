import { useState, useEffect } from 'react'
import { useProjectStore } from '../../store/useProjectStore'
import { useAgentStore } from '../../store/useAgentStore'
import { ApiClient } from '../../utils/api-client'
import './MemoryViewer.css'

interface Memory {
  id: string
  agent_name: string
  memory_type: string
  content: string
  timestamp: string
  tags: string[]
}

export default function MemoryViewer() {
  const [memories, setMemories] = useState<Memory[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState<string>('all')
  const [selectedAgent, setSelectedAgent] = useState<string>('all')

  const activeProject = useProjectStore((state) => state.getActiveProject())
  const agents = useAgentStore((state) => state.agents)

  useEffect(() => {
    if (!activeProject) return

    const fetchMemories = async () => {
      setLoading(true)
      try {
        const result = await ApiClient.getMemory(activeProject.path)
        setMemories(result as Memory[])
      } catch (error) {
        console.error('Failed to fetch memories:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMemories()
  }, [activeProject])

  const filteredMemories = memories.filter((m) => {
    if (selectedAgent !== 'all' && m.agent_name !== selectedAgent) return false
    if (selectedFilter !== 'all' && m.memory_type !== selectedFilter) return false
    return true
  })

  const memoryTypes = ['all', ...new Set(memories.map((m) => m.memory_type))]
  const agentNames = ['all', ...new Set(memories.map((m) => m.agent_name))]

  return (
    <div className="memory-viewer">
      <div className="memory-header">
        <h3>Agent Memory Store</h3>
        <span className="memory-count">{filteredMemories.length} entries</span>
      </div>

      <div className="memory-filters">
        <div className="filter-group">
          <label>Type:</label>
          <select value={selectedFilter} onChange={(e) => setSelectedFilter(e.target.value)}>
            {memoryTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Agent:</label>
          <select value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value)}>
            {agentNames.map((agent) => (
              <option key={agent} value={agent}>
                {agent.charAt(0).toUpperCase() + agent.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="memory-list">
        {loading ? (
          <p className="memory-loading">Loading memories...</p>
        ) : filteredMemories.length === 0 ? (
          <p className="memory-empty">No memories yet</p>
        ) : (
          filteredMemories.map((memory) => (
            <div key={memory.id} className="memory-entry">
              <div className="memory-entry-header">
                <span className="memory-agent">{memory.agent_name}</span>
                <span className={`memory-type memory-type-${memory.memory_type}`}>
                  {memory.memory_type}
                </span>
                <time className="memory-time">
                  {new Date(memory.timestamp).toLocaleDateString()}
                </time>
              </div>
              <p className="memory-content">{memory.content}</p>
              {memory.tags.length > 0 && (
                <div className="memory-tags">
                  {memory.tags.map((tag) => (
                    <span key={tag} className="memory-tag">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
