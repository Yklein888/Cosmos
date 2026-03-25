import { useState, useEffect, useCallback } from 'react'
import { Icon } from '../../common/Icon'
import { useMarketplaceStore } from '../../../store/useMarketplaceStore'

type MarketplaceTab = 'mcp' | 'agents' | 'installed'

interface MarketplaceItem {
  id: string
  name: string
  description: string
  author: string
  category: string
  installCount?: number
  type: 'mcp' | 'agent'
  installCommand?: string
  stars?: number
  tags?: string[]
}

const CATEGORIES = ['All', 'Dev Tools', 'AI', 'Productivity', 'Databases', 'Communication', 'Security', 'Analytics']

const BUILT_IN_AGENTS: MarketplaceItem[] = [
  {
    id: 'code-reviewer',
    name: 'Code Reviewer',
    description: 'Reviews code for bugs, security issues, and best practices. Runs as a listening agent on every conversation.',
    author: 'COSMOS',
    category: 'Dev Tools',
    type: 'agent',
    tags: ['security', 'quality', 'review'],
  },
  {
    id: 'security-auditor',
    name: 'Security Auditor',
    description: 'Detects OWASP vulnerabilities, injection risks, and insecure patterns in real-time.',
    author: 'COSMOS',
    category: 'Security',
    type: 'agent',
    tags: ['security', 'owasp', 'vulnerabilities'],
  },
  {
    id: 'performance-analyzer',
    name: 'Performance Analyzer',
    description: 'Identifies N+1 queries, memory leaks, and performance bottlenecks as you code.',
    author: 'COSMOS',
    category: 'Analytics',
    type: 'agent',
    tags: ['performance', 'optimization'],
  },
  {
    id: 'docs-writer',
    name: 'Documentation Writer',
    description: 'Auto-generates JSDoc comments and README sections from your code.',
    author: 'COSMOS',
    category: 'Productivity',
    type: 'agent',
    tags: ['docs', 'jsdoc', 'readme'],
  },
  {
    id: 'test-generator',
    name: 'Test Generator',
    description: 'Suggests unit tests and identifies untested code paths in the active conversation.',
    author: 'COSMOS',
    category: 'Dev Tools',
    type: 'agent',
    tags: ['testing', 'jest', 'vitest'],
  },
]

function CategoryFilter({ selected, onSelect }: { selected: string; onSelect: (c: string) => void }) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
            selected === cat
              ? 'bg-cosmos-accent text-white'
              : 'bg-cosmos-card border border-cosmos-border text-cosmos-text-muted hover:border-cosmos-accent/40'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}

function MarketplaceCard({ item, isInstalled, onInstall, onUninstall, installing }: {
  item: MarketplaceItem
  isInstalled: boolean
  onInstall: (item: MarketplaceItem) => void
  onUninstall: (id: string) => void
  installing: string | null
}) {
  return (
    <div className="bg-cosmos-card border border-cosmos-border rounded-xl p-4 flex flex-col gap-3 hover:border-cosmos-accent/30 transition-all">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cosmos-accent/10 flex items-center justify-center flex-shrink-0">
              <Icon
                icon={item.type === 'mcp' ? 'lucide:puzzle' : 'lucide:bot'}
                className="text-cosmos-accent text-sm"
              />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-cosmos-text truncate">{item.name}</h3>
              <p className="text-[10px] text-cosmos-text-dim">by {item.author}</p>
            </div>
          </div>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-cosmos-border text-cosmos-text-muted flex-shrink-0">
          {item.category}
        </span>
      </div>

      <p className="text-xs text-cosmos-text-muted leading-relaxed flex-1">{item.description}</p>

      {item.tags && (
        <div className="flex gap-1 flex-wrap">
          {item.tags.map((tag) => (
            <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-cosmos-bg rounded text-cosmos-text-dim">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        {item.installCount !== undefined && (
          <span className="text-[10px] text-cosmos-text-dim flex items-center gap-1">
            <Icon icon="lucide:download" className="text-[10px]" />
            {item.installCount.toLocaleString()}
          </span>
        )}
        <div className="ml-auto">
          {isInstalled ? (
            <button
              onClick={() => onUninstall(item.id)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all"
            >
              Uninstall
            </button>
          ) : (
            <button
              onClick={() => onInstall(item)}
              disabled={installing === item.id}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-cosmos-accent text-white hover:bg-cosmos-accent/80 transition-all disabled:opacity-50 flex items-center gap-1.5"
            >
              {installing === item.id ? (
                <>
                  <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                  Installing...
                </>
              ) : (
                <>
                  <Icon icon="lucide:plus" className="text-xs" />
                  Install
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function InstalledSection() {
  const installedMcp = useMarketplaceStore((s) => s.installedMcp)
  const installedAgents = useMarketplaceStore((s) => s.installedAgents)
  const uninstallMcp = useMarketplaceStore((s) => s.uninstallMcp)
  const uninstallAgent = useMarketplaceStore((s) => s.uninstallAgent)

  if (installedMcp.length === 0 && installedAgents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-cosmos-card border border-cosmos-border flex items-center justify-center mb-4">
          <Icon icon="lucide:package-open" className="text-2xl text-cosmos-text-dim" />
        </div>
        <p className="text-sm font-medium text-cosmos-text">Nothing installed yet</p>
        <p className="text-xs text-cosmos-text-muted mt-1">Browse MCP Servers or Agent Templates to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {installedAgents.length > 0 && (
        <div>
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Installed Agents</h3>
          <div className="space-y-2">
            {installedAgents.map((a) => (
              <div key={a.id} className="flex items-center gap-3 p-3 bg-cosmos-card border border-cosmos-border rounded-lg">
                <Icon icon="lucide:bot" className="text-cosmos-accent text-sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-cosmos-text">{a.name}</p>
                  <p className="text-xs text-cosmos-text-muted truncate">{a.description}</p>
                </div>
                <button
                  onClick={() => uninstallAgent(a.id)}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {installedMcp.length > 0 && (
        <div>
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Installed MCP Servers</h3>
          <div className="space-y-2">
            {installedMcp.map((m) => (
              <div key={m.id} className="flex items-center gap-3 p-3 bg-cosmos-card border border-cosmos-border rounded-lg">
                <Icon icon="lucide:puzzle" className="text-cosmos-accent text-sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-cosmos-text">{m.name}</p>
                  <p className="text-xs text-cosmos-text-muted truncate">{m.description}</p>
                </div>
                <button
                  onClick={() => uninstallMcp(m.id)}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState<MarketplaceTab>('mcp')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [installing, setInstalling] = useState<string | null>(null)

  const mcpServers = useMarketplaceStore((s) => s.mcpServers)
  const loadingMcp = useMarketplaceStore((s) => s.loadingMcp)
  const installedMcp = useMarketplaceStore((s) => s.installedMcp)
  const installedAgents = useMarketplaceStore((s) => s.installedAgents)
  const fetchMcpServers = useMarketplaceStore((s) => s.fetchMcpServers)
  const installMcp = useMarketplaceStore((s) => s.installMcp)
  const uninstallMcp = useMarketplaceStore((s) => s.uninstallMcp)
  const installAgent = useMarketplaceStore((s) => s.installAgent)
  const uninstallAgent = useMarketplaceStore((s) => s.uninstallAgent)

  useEffect(() => {
    if (activeTab === 'mcp' && mcpServers.length === 0) {
      fetchMcpServers()
    }
  }, [activeTab, mcpServers.length, fetchMcpServers])

  const handleInstallMcp = useCallback(async (item: MarketplaceItem) => {
    setInstalling(item.id)
    try {
      await installMcp(item)
    } finally {
      setInstalling(null)
    }
  }, [installMcp])

  const handleInstallAgent = useCallback(async (item: MarketplaceItem) => {
    setInstalling(item.id)
    try {
      await installAgent(item)
    } finally {
      setInstalling(null)
    }
  }, [installAgent])

  const filteredMcp = mcpServers.filter((item) => {
    const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase()) || item.description.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'All' || item.category === category
    return matchSearch && matchCat
  })

  const filteredAgents = BUILT_IN_AGENTS.filter((item) => {
    const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase()) || item.description.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'All' || item.category === category
    return matchSearch && matchCat
  })

  const tabs: { id: MarketplaceTab; label: string; icon: string }[] = [
    { id: 'mcp', label: 'MCP Servers', icon: 'lucide:puzzle' },
    { id: 'agents', label: 'Agent Templates', icon: 'lucide:bot' },
    { id: 'installed', label: `Installed (${installedMcp.length + installedAgents.length})`, icon: 'lucide:package-check' },
  ]

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-cosmos-border px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-lg font-bold text-cosmos-text">Marketplace</h1>
            <p className="text-xs text-cosmos-text-muted mt-0.5">Discover MCP servers and agent templates to extend COSMOS</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-cosmos-accent/10 text-cosmos-accent border border-cosmos-accent/20'
                  : 'text-cosmos-text-muted hover:text-cosmos-text hover:bg-cosmos-card'
              }`}
            >
              <Icon icon={tab.icon} className="text-sm" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab !== 'installed' && (
          <div className="flex gap-3 flex-col">
            <div className="relative">
              <Icon icon="lucide:search" className="absolute left-3 top-1/2 -translate-y-1/2 text-cosmos-text-dim text-sm" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search ${activeTab === 'mcp' ? 'MCP servers' : 'agent templates'}...`}
                className="w-full pl-9 pr-4 py-2 bg-cosmos-card border border-cosmos-border rounded-lg text-sm text-cosmos-text placeholder:text-cosmos-text-dim focus:outline-none focus:border-cosmos-accent/50"
              />
            </div>
            <CategoryFilter selected={category} onSelect={setCategory} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        {activeTab === 'installed' && <InstalledSection />}

        {activeTab === 'mcp' && (
          <>
            {loadingMcp ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-6 h-6 border-2 border-cosmos-accent border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredMcp.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Icon icon="lucide:search-x" className="text-3xl text-cosmos-text-dim mb-3" />
                <p className="text-sm text-cosmos-text-muted">No MCP servers found</p>
                <p className="text-xs text-cosmos-text-dim mt-1">Try a different search or category</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredMcp.map((item) => (
                  <MarketplaceCard
                    key={item.id}
                    item={item}
                    isInstalled={installedMcp.some((m) => m.id === item.id)}
                    onInstall={handleInstallMcp}
                    onUninstall={uninstallMcp}
                    installing={installing}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'agents' && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredAgents.map((item) => (
              <MarketplaceCard
                key={item.id}
                item={item}
                isInstalled={installedAgents.some((a) => a.id === item.id)}
                onInstall={handleInstallAgent}
                onUninstall={uninstallAgent}
                installing={installing}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
