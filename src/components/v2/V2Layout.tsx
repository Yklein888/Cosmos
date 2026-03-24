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
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const addProject = useProjectStore((state) => state.addProject)
  const setActiveProject = useProjectStore((state) => state.setActiveProject)

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProjectName.trim()) return

    const project = {
      id: Date.now().toString(),
      name: newProjectName.trim(),
      path: './',
      createdAt: new Date().toISOString(),
    }

    addProject(project)
    setActiveProject(project.id)
    setNewProjectName('')
    setShowProjectForm(false)
  }

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
          <h2>🚀 No Project Selected</h2>
          <p>Create or select a project to get started</p>

          {showProjectForm ? (
            <form className="quick-project-form" onSubmit={handleCreateProject}>
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Enter project name..."
                autoFocus
              />
              <button type="submit" disabled={!newProjectName.trim()}>
                Create Project
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowProjectForm(false)
                  setNewProjectName('')
                }}
              >
                Cancel
              </button>
            </form>
          ) : (
            <div className="empty-state-actions">
              <button
                className="action-button primary"
                onClick={() => setShowProjectForm(true)}
              >
                ➕ Create New Project
              </button>
              <p className="or-text">or</p>
              <button className="action-button secondary">
                📁 Select Existing Project
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
