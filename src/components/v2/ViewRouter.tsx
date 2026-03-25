import { lazy, Suspense } from 'react'
import type { AppView } from '../../store/useAppStore'

const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const TerminalPage = lazy(() => import('./pages/TerminalPage'))
const TasksPage = lazy(() => import('./pages/TasksPage'))
const ConfigPage = lazy(() => import('./pages/ConfigPage'))
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'))
const McpPage = lazy(() => import('./pages/McpPage'))
const ResultsPage = lazy(() => import('./pages/ResultsPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))
const MarketplacePage = lazy(() => import('./pages/MarketplacePage'))
const MemoryPage = lazy(() => import('./pages/MemoryPage'))

function ViewLoading() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-cosmos-accent border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export function ViewRouter({ view }: { view: AppView }) {
  return (
    <Suspense fallback={<ViewLoading />}>
      {view === 'dashboard' && <DashboardPage />}
      {view === 'terminal' && <TerminalPage />}
      {view === 'tasks' && <TasksPage />}
      {view === 'results' && <ResultsPage />}
      {view === 'config' && <ConfigPage />}
      {view === 'analytics' && <AnalyticsPage />}
      {view === 'mcp' && <McpPage />}
      {view === 'settings' && <SettingsPage />}
      {view === 'marketplace' && <MarketplacePage />}
      {view === 'memory' && <MemoryPage />}
    </Suspense>
  )
}
