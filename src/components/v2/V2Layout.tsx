import { useState } from 'react'
import ProjectTabBar from '../layout/ProjectTabBar'
import ChatView from '../chat/ChatView'
import TerminalView from '../terminal/TerminalView'
import McpMarketplace from '../mcp/McpMarketplace'
import SettingsView from '../settings/SettingsView'
import { useProjectStore } from '../../store/useProjectStore'
import './V2Layout.css'

export default function V2Layout() {
  const [activeTab, setActiveTab] = useState<'chat' | 'terminal' | 'mcp' | 'settings'>('chat')
  const activeProject = useProjectStore((state) => state.getActiveProject())

  return (
    <div className="v2-layout">
      <ProjectTabBar />

      <div className="main-content">
        <div className="tab-buttons">
          <button
            className={`tab-button ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            💬 Chat
          </button>
          <button
            className={`tab-button ${activeTab === 'terminal' ? 'active' : ''}`}
            onClick={() => setActiveTab('terminal')}
          >
            🖥️ Terminal
          </button>
          <button
            className={`tab-button ${activeTab === 'mcp' ? 'active' : ''}`}
            onClick={() => setActiveTab('mcp')}
          >
            🏪 MCP
          </button>
          <button
            className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ Settings
          </button>
        </div>

        <div className="view-container">
          {activeTab === 'chat' && <ChatView />}
          {activeTab === 'terminal' && (
            <TerminalView projectPath={activeProject?.path} />
          )}
          {activeTab === 'mcp' && <McpMarketplace />}
          {activeTab === 'settings' && <SettingsView />}
        </div>
      </div>

      {!activeProject && activeTab !== 'mcp' && activeTab !== 'settings' && (
        <div className="empty-state">
          <h2>No Project Selected</h2>
          <p>Create or select a project to get started</p>
        </div>
      )}
    </div>
  )
}
