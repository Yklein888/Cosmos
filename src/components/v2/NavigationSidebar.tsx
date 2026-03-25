import { useState, useRef, useEffect, useMemo } from 'react'
import { Icon } from '../common/Icon'
import { useAppStore, type AppView } from '../../store/useAppStore'
import { useProjectStore } from '../../store/useProjectStore'
import { useLicenseStore } from '../../store/useLicenseStore'
import { useTaskStore } from '../../store/useTaskStore'
import cosmosLogo from '../../assets/cosmos-logo.webp'

interface NavItem {
  id: AppView
  label: string
  icon: string
  badge?: number
}

function NavSection({ label, items }: { label: string; items: NavItem[] }) {
  const activeView = useAppStore((s) => s.activeView)
  const setActiveView = useAppStore((s) => s.setActiveView)

  return (
    <div className="mb-2">
      <div className="px-4 py-2">
        <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{label}</span>
      </div>
      <div className="space-y-0.5 px-2">
        {items.map((item) => {
          const isActive = activeView === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all titlebar-no-drag ${
                isActive
                  ? 'bg-cosmos-accent/10 text-cosmos-accent shadow-[0_0_12px_rgba(99,102,241,0.1)]'
                  : 'text-cosmos-text-muted hover:text-cosmos-text hover:bg-cosmos-card'
              }`}
            >
              <Icon icon={item.icon} className={isActive ? 'text-cosmos-accent' : 'text-cosmos-text-dim'} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="text-[10px] font-bold bg-cosmos-border text-cosmos-text-dim px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  {item.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

const TIER_BADGE: Record<string, { bg: string; text: string }> = {
  free: { bg: 'bg-zinc-700', text: 'text-zinc-400' },
  pro: { bg: 'bg-amber-500/20', text: 'text-amber-400' },
  teams: { bg: 'bg-purple-500/20', text: 'text-purple-400' },
}

function SidebarFooter() {
  const setActiveView = useAppStore((s) => s.setActiveView)
  const email = useLicenseStore((s) => s.email)
  const tier = useLicenseStore((s) => s.tier)
  const logout = useLicenseStore((s) => s.logout)

  const initials = email
    ? email.split('@')[0].slice(0, 2).toUpperCase()
    : '??'

  const badge = TIER_BADGE[tier] || TIER_BADGE.free

  return (
    <div className="border-t border-cosmos-border p-3 titlebar-no-drag">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-gradient-to-br from-cosmos-accent/20 to-cosmos-accent-2/20 rounded-full flex items-center justify-center border border-cosmos-accent/20">
          <span className="text-[10px] font-bold text-cosmos-accent">{initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-xs font-medium text-cosmos-text truncate">{email || 'Unknown'}</p>
            <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${badge.bg} ${badge.text}`}>
              {tier}
            </span>
          </div>
          <p className="text-[10px] text-cosmos-text-dim">v1.0.0</p>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => setActiveView('settings')}
            className="p-1.5 text-zinc-600 hover:text-zinc-300 transition-colors"
            title="Settings"
          >
            <Icon icon="lucide:settings" className="text-sm" />
          </button>
          <button
            onClick={logout}
            className="p-1.5 text-zinc-600 hover:text-red-400 transition-colors"
            title="Sign out"
          >
            <Icon icon="lucide:log-out" className="text-sm" />
          </button>
        </div>
      </div>
    </div>
  )
}

function ProjectSelector({ openProjects, activeProjectPath, activeProject, setActiveProject, onNewProject }: {
  openProjects: { projectPath: string; projectName: string }[]
  activeProjectPath: string | null
  activeProject?: { projectName: string }
  setActiveProject: (path: string) => Promise<void>
  onNewProject: () => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  return (
    <div className="px-3 py-2 titlebar-no-drag relative" ref={ref}>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setOpen(!open)}
          className="flex-1 flex items-center gap-2 px-3 py-2 bg-cosmos-card border border-cosmos-border rounded-lg text-left hover:border-cosmos-accent/40 transition-colors"
        >
          <Icon icon="lucide:folder" className="text-cosmos-text-dim text-xs" />
          <span className="text-xs text-cosmos-text-muted truncate flex-1">{activeProject?.projectName || 'No Project'}</span>
          <Icon icon="lucide:chevron-down" className={`text-cosmos-text-dim text-[10px] transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        <button
          onClick={onNewProject}
          className="p-2 text-cosmos-text-dim hover:text-cosmos-text hover:bg-cosmos-card rounded-lg transition-colors"
          title="Open project"
        >
          <Icon icon="lucide:plus" className="text-sm" />
        </button>
      </div>

      {open && (
        <div className="absolute left-3 right-3 top-full mt-1 bg-cosmos-card border border-cosmos-border rounded-lg shadow-xl z-50 overflow-hidden">
          {openProjects.map((p) => (
            <button
              key={p.projectPath}
              onClick={() => { setActiveProject(p.projectPath); setOpen(false) }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-left text-xs transition-colors ${
                p.projectPath === activeProjectPath
                  ? 'bg-cosmos-accent/10 text-cosmos-accent'
                  : 'text-cosmos-text-muted hover:bg-cosmos-border/40'
              }`}
            >
              <Icon icon="lucide:folder" className={`text-xs ${p.projectPath === activeProjectPath ? 'text-cosmos-accent' : 'text-cosmos-text-dim'}`} />
              <span className="truncate">{p.projectName}</span>
              {p.projectPath === activeProjectPath && (
                <Icon icon="lucide:check" className="text-cosmos-accent text-xs ml-auto" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function NavigationSidebar() {
  const openProjects = useProjectStore((s) => s.openProjects)
  const activeProjectPath = useProjectStore((s) => s.activeProjectPath)
  const openProject = useProjectStore((s) => s.openProject)
  const setActiveProject = useProjectStore((s) => s.setActiveProject)
  const setActiveView = useAppStore((s) => s.setActiveView)

  const activeProject = openProjects.find((p) => p.projectPath === activeProjectPath)
  const agentCount = activeProject?.agents.length || 0
  const mcpCount = (activeProject?.mcpServers || []).filter((s) => s.enabled).length
  const tasks = useTaskStore((s) => s.tasks)
  const resultsLastViewedAt = useAppStore((s) => s.resultsLastViewedAt)

  const unseenRunCount = useMemo(() => {
    if (!resultsLastViewedAt) {
      // Never viewed — show today's runs as a sensible default
      const startOfDay = new Date()
      startOfDay.setHours(0, 0, 0, 0)
      const startMs = startOfDay.getTime()
      return tasks.reduce((count, task) =>
        count + task.runs.filter((r) => new Date(r.startedAt).getTime() >= startMs).length, 0
      )
    }
    const lastViewedMs = new Date(resultsLastViewedAt).getTime()
    return tasks.reduce((count, task) =>
      count + task.runs.filter((r) => new Date(r.startedAt).getTime() > lastViewedMs).length, 0
    )
  }, [tasks, resultsLastViewedAt])

  const workspaceItems: NavItem[] = [
    { id: 'dashboard', label: 'Command Center', icon: 'lucide:layout-dashboard' },
    { id: 'config', label: 'Agent Swarm', icon: 'lucide:bot', badge: agentCount },
    { id: 'tasks', label: 'Tasks', icon: 'lucide:list-checks' },
    { id: 'results', label: 'Results', icon: 'lucide:file-check-2', badge: unseenRunCount },
    { id: 'terminal', label: 'Terminal', icon: 'lucide:terminal' },
  ]

  const advancedItems: NavItem[] = [
    { id: 'analytics', label: 'Performance', icon: 'lucide:activity' },
    { id: 'mcp', label: 'MCP Registry', icon: 'lucide:puzzle', badge: mcpCount },
    { id: 'memory', label: 'Memory', icon: 'lucide:brain' },
    { id: 'marketplace', label: 'Marketplace', icon: 'lucide:store' },
    { id: 'settings', label: 'Settings', icon: 'lucide:settings' },
  ]

  const handleOpenProject = () => {
    useProjectStore.setState({ activeProjectPath: null })
    setActiveView('dashboard')
  }

  return (
    <div className="w-64 h-full border-r border-cosmos-border cosmos-nebula-bg flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="p-3 pb-2 titlebar-drag">
        <div className="flex items-center gap-2 titlebar-no-drag">
          <img src={cosmosLogo} alt="COSMOS" className="h-7 w-auto object-contain" />
        </div>
      </div>

      {/* Project Selector */}
      <ProjectSelector
        openProjects={openProjects}
        activeProjectPath={activeProjectPath}
        activeProject={activeProject}
        setActiveProject={setActiveProject}
        onNewProject={handleOpenProject}
      />

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar py-2 titlebar-no-drag">
        <NavSection label="Workspace" items={workspaceItems} />
        <NavSection label="Advanced" items={advancedItems} />
      </nav>

      {/* Footer — User Account */}
      <SidebarFooter />
    </div>
  )
}
