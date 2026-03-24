/**
 * Featured MCP Servers for COSMOS
 * These are pre-configured servers available in the marketplace
 */

export interface MCPServer {
  id: string
  name: string
  description: string
  icon: string
  category: string
  repository?: string
  installed: boolean
  config?: Record<string, unknown>
}

export const FEATURED_MCP_SERVERS: MCPServer[] = [
  {
    id: 'github-mcp',
    name: 'GitHub MCP',
    description: 'Interact with GitHub repositories, issues, and PRs',
    icon: '🐙',
    category: 'version-control',
    repository: 'https://github.com/anthropics/github-mcp',
    installed: false,
  },
  {
    id: 'filesystem-mcp',
    name: 'Filesystem MCP',
    description: 'Read and write files, browse directories',
    icon: '📁',
    category: 'file-system',
    repository: 'https://github.com/anthropics/filesystem-mcp',
    installed: false,
  },
  {
    id: 'supabase-mcp',
    name: 'Supabase MCP',
    description: 'Access Supabase databases and APIs',
    icon: '🚀',
    category: 'database',
    repository: 'https://github.com/anthropics/supabase-mcp',
    installed: false,
  },
  {
    id: 'docker-mcp',
    name: 'Docker MCP',
    description: 'Manage Docker containers and images',
    icon: '🐳',
    category: 'devops',
    repository: 'https://github.com/anthropics/docker-mcp',
    installed: false,
  },
  {
    id: 'aws-mcp',
    name: 'AWS MCP',
    description: 'Interact with AWS services (EC2, S3, Lambda, etc.)',
    icon: '☁️',
    category: 'cloud',
    repository: 'https://github.com/anthropics/aws-mcp',
    installed: false,
  },
  {
    id: 'slack-mcp',
    name: 'Slack MCP',
    description: 'Send messages, manage channels, read conversations',
    icon: '💬',
    category: 'communication',
    repository: 'https://github.com/anthropics/slack-mcp',
    installed: false,
  },
  {
    id: 'postgres-mcp',
    name: 'PostgreSQL MCP',
    description: 'Connect to PostgreSQL databases, run queries',
    icon: '🗄️',
    category: 'database',
    repository: 'https://github.com/anthropics/postgres-mcp',
    installed: false,
  },
  {
    id: 'sqlite-mcp',
    name: 'SQLite MCP',
    description: 'Query and manage SQLite databases',
    icon: '💾',
    category: 'database',
    repository: 'https://github.com/anthropics/sqlite-mcp',
    installed: false,
  },
  {
    id: 'npm-mcp',
    name: 'NPM MCP',
    description: 'Search npm packages and get documentation',
    icon: '📦',
    category: 'package-management',
    repository: 'https://github.com/anthropics/npm-mcp',
    installed: false,
  },
  {
    id: 'web-search-mcp',
    name: 'Web Search MCP',
    description: 'Search the web for information',
    icon: '🔍',
    category: 'search',
    repository: 'https://github.com/anthropics/web-search-mcp',
    installed: false,
  },
]

export const MCP_CATEGORIES = [
  { id: 'all', name: 'All' },
  { id: 'version-control', name: 'Version Control' },
  { id: 'file-system', name: 'File System' },
  { id: 'database', name: 'Database' },
  { id: 'devops', name: 'DevOps' },
  { id: 'cloud', name: 'Cloud' },
  { id: 'communication', name: 'Communication' },
  { id: 'package-management', name: 'Package Management' },
  { id: 'search', name: 'Search' },
]
