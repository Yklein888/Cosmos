import { useState, useMemo } from 'react'
import { useMcpStore } from '../../store/useMcpStore'
import { FEATURED_MCP_SERVERS, MCP_CATEGORIES } from '../../data/mcp-servers'
import McpServerCard from './McpServerCard'
import './McpMarketplace.css'

export default function McpMarketplace() {
  const servers = useMcpStore((state) => state.servers)
  const addServer = useMcpStore((state) => state.addServer)
  const toggleServer = useMcpStore((state) => state.toggleServer)

  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Merge featured servers with installed servers
  const mergedServers = useMemo(() => {
    return FEATURED_MCP_SERVERS.map((featured) => {
      const installed = servers.find((s) => s.id === featured.id)
      return installed ? installed : featured
    })
  }, [servers])

  // Filter servers
  const filteredServers = useMemo(() => {
    return mergedServers.filter((server) => {
      const matchesCategory = selectedCategory === 'all' || server.category === selectedCategory
      const matchesSearch =
        searchTerm === '' ||
        server.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        server.description.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [mergedServers, selectedCategory, searchTerm])

  const handleInstall = (server: typeof mergedServers[0]) => {
    if (!servers.find((s) => s.id === server.id)) {
      addServer({
        ...server,
        installed: true,
      })
    }
  }

  const handleToggle = (serverId: string) => {
    toggleServer(serverId)
  }

  return (
    <div className="mcp-marketplace">
      <div className="marketplace-header">
        <h2>MCP Marketplace</h2>
        <p>One-click MCP server installation</p>
      </div>

      <div className="marketplace-controls">
        <div className="search-box">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search MCP servers..."
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="category-filter">
          {MCP_CATEGORIES.map((category) => (
            <button
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="servers-grid">
        {filteredServers.length === 0 ? (
          <p className="no-results">No MCP servers found</p>
        ) : (
          filteredServers.map((server) => (
            <McpServerCard
              key={server.id}
              server={server}
              onInstall={() => handleInstall(server)}
              onToggle={() => handleToggle(server.id)}
            />
          ))
        )}
      </div>

      <div className="marketplace-footer">
        <p>
          💡 Tip: Installed MCP servers are available globally across all projects. Configure them
          in Settings.
        </p>
      </div>
    </div>
  )
}
