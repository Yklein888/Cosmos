import { useRef, useEffect } from 'react'
import { Icon } from '../common/Icon'
import { useProjectStore } from '../../store/useProjectStore'
import { useAppStore } from '../../store/useAppStore'

export function ProjectTabBar() {
  const openProjects = useProjectStore((s) => s.openProjects)
  const activeProjectPath = useProjectStore((s) => s.activeProjectPath)
  const setActiveProject = useProjectStore((s) => s.setActiveProject)
  const closeProject = useProjectStore((s) => s.closeProject)
  const openProject = useProjectStore((s) => s.openProject)
  const setActiveView = useAppStore((s) => s.setActiveView)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Ctrl+Tab / Ctrl+Shift+Tab cycle through tabs
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!e.ctrlKey || e.key !== 'Tab') return
      if (openProjects.length < 2) return
      e.preventDefault()
      const idx = openProjects.findIndex((p) => p.projectPath === activeProjectPath)
      const next = e.shiftKey
        ? (idx - 1 + openProjects.length) % openProjects.length
        : (idx + 1) % openProjects.length
      setActiveProject(openProjects[next].projectPath)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [openProjects, activeProjectPath, setActiveProject])

  const handleClose = (e: React.MouseEvent, projectPath: string) => {
    e.stopPropagation()
    closeProject(projectPath)
  }

  const handleNewProject = async () => {
    useProjectStore.setState({ activeProjectPath: null })
    setActiveView('dashboard')
  }

  if (openProjects.length === 0) return null

  return (
    <div className="flex items-center border-b border-cosmos-border bg-cosmos-bg overflow-hidden flex-shrink-0 h-9 titlebar-drag">
      <div ref={scrollRef} className="flex items-end flex-1 overflow-x-auto no-scrollbar h-full titlebar-no-drag">
        {openProjects.map((project) => {
          const isActive = project.projectPath === activeProjectPath
          const name = project.projectName || project.projectPath.split('/').pop() || project.projectPath.split('\\').pop() || 'Project'

          return (
            <button
              key={project.projectPath}
              onClick={() => setActiveProject(project.projectPath)}
              className={`group flex items-center gap-2 px-3 h-full text-xs font-medium border-r border-cosmos-border transition-all flex-shrink-0 relative titlebar-no-drag ${
                isActive
                  ? 'bg-cosmos-card text-cosmos-text border-t-2 border-t-cosmos-accent'
                  : 'text-cosmos-text-muted hover:text-cosmos-text hover:bg-cosmos-card/50'
              }`}
              style={{ paddingTop: isActive ? '2px' : '0' }}
            >
              <Icon
                icon="lucide:folder"
                className={`text-[10px] flex-shrink-0 ${isActive ? 'text-cosmos-accent' : 'text-cosmos-text-dim'}`}
              />
              <span className="max-w-[120px] truncate">{name}</span>
              {project.unreadCount > 0 && (
                <span className="text-[9px] font-bold bg-cosmos-accent text-white rounded-full px-1 min-w-[14px] text-center">
                  {project.unreadCount}
                </span>
              )}
              <span
                onClick={(e) => handleClose(e, project.projectPath)}
                className={`ml-0.5 p-0.5 rounded transition-all text-cosmos-text-dim hover:text-cosmos-text hover:bg-cosmos-border cursor-pointer ${
                  isActive ? 'opacity-60 hover:opacity-100' : 'opacity-0 group-hover:opacity-60 group-hover:hover:opacity-100'
                }`}
                role="button"
                title="Close"
              >
                <Icon icon="lucide:x" className="text-[10px]" />
              </span>
            </button>
          )
        })}
      </div>

      <button
        onClick={handleNewProject}
        className="flex items-center justify-center w-9 h-full flex-shrink-0 text-cosmos-text-dim hover:text-cosmos-text hover:bg-cosmos-card transition-colors titlebar-no-drag border-l border-cosmos-border"
        title="Open project (Ctrl+Tab to switch)"
      >
        <Icon icon="lucide:plus" className="text-sm" />
      </button>
    </div>
  )
}
