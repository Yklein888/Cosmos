import { useState } from 'react'
import { useProjectStore } from '../../store/useProjectStore'
import { useAppStore } from '../../store/useAppStore'
import './ProjectTabBar.css'

export default function ProjectTabBar() {
  const projects = useProjectStore((state) => state.projects)
  const activeProjectId = useProjectStore((state) => state.activeProjectId)
  const setActiveProject = useProjectStore((state) => state.setActiveProject)
  const setCurrentProjectPath = useAppStore((state) => state.setCurrentProjectPath)
  const removeProject = useProjectStore((state) => state.removeProject)

  const [newProjectName, setNewProjectName] = useState('')
  const [showNewForm, setShowNewForm] = useState(false)

  const handleSelectProject = (projectId: string, projectPath: string) => {
    setActiveProject(projectId)
    setCurrentProjectPath(projectPath)
  }

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProjectName.trim()) return

    // TODO: Call API to create project
    // const project = await ApiClient.createProject(path, newProjectName)
    // addProject(project)

    setNewProjectName('')
    setShowNewForm(false)
  }

  const handleRemoveProject = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation()
    removeProject(projectId)
  }

  return (
    <div className="project-tab-bar">
      <div className="tabs-container">
        {projects.map((project) => (
          <button
            key={project.id}
            className={`project-tab ${activeProjectId === project.id ? 'active' : ''}`}
            onClick={() => handleSelectProject(project.id, project.path)}
            title={project.path}
          >
            <span className="tab-name">{project.name}</span>
            <button
              className="tab-close"
              onClick={(e) => handleRemoveProject(e, project.id)}
              title="Close project"
            >
              ×
            </button>
          </button>
        ))}

        <button
          className="tab-add"
          onClick={() => setShowNewForm(!showNewForm)}
          title="Add project"
        >
          +
        </button>
      </div>

      {showNewForm && (
        <form className="new-project-form" onSubmit={handleCreateProject}>
          <input
            type="text"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            placeholder="Project name..."
            autoFocus
          />
          <button type="submit" disabled={!newProjectName.trim()}>
            Create
          </button>
          <button
            type="button"
            onClick={() => {
              setShowNewForm(false)
              setNewProjectName('')
            }}
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  )
}
