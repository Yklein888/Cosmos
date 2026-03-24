import { MCPServer } from '../../data/mcp-servers'
import './McpServerCard.css'

interface McpServerCardProps {
  server: MCPServer
  onInstall: () => void
  onToggle: () => void
}

export default function McpServerCard({ server, onInstall, onToggle }: McpServerCardProps) {
  return (
    <div className={`mcp-server-card ${server.installed ? 'installed' : ''}`}>
      <div className="card-icon">{server.icon}</div>

      <div className="card-content">
        <h3>{server.name}</h3>
        <p>{server.description}</p>

        <div className="card-category">
          <span className="category-badge">{server.category}</span>
        </div>
      </div>

      <div className="card-actions">
        {!server.installed ? (
          <button className="install-btn" onClick={onInstall}>
            Install
          </button>
        ) : (
          <div className="installed-controls">
            <label className="toggle-wrapper">
              <input
                type="checkbox"
                checked={server.installed}
                onChange={onToggle}
              />
              <span className="toggle-label">
                {server.installed ? '✓ Enabled' : 'Disabled'}
              </span>
            </label>
          </div>
        )}
      </div>

      {server.repository && (
        <a href={server.repository} target="_blank" rel="noopener noreferrer" className="card-link">
          View Repo →
        </a>
      )}
    </div>
  )
}
