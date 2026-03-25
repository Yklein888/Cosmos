/**
 * Notion integration service — all API calls go through Electron main process
 * to avoid CORS issues in the renderer.
 */

const NOTION_API = 'https://api.notion.com/v1'
const NOTION_VERSION = '2022-06-28'
const CHANGELOG_DB_ID = '47927afcd5b24cf1814d000dfe33d335'

function headers(token: string) {
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Notion-Version': NOTION_VERSION,
  }
}

export interface NotionTestResult {
  ok: boolean
  workspaceName?: string
  error?: string
}

export async function testConnection(token: string): Promise<NotionTestResult> {
  try {
    const res = await fetch(`${NOTION_API}/users/me`, { headers: headers(token) })
    if (!res.ok) {
      return { ok: false, error: `HTTP ${res.status}: ${res.statusText}` }
    }
    const data = await res.json() as { name?: string; bot?: { workspace_name?: string } }
    return {
      ok: true,
      workspaceName: data.bot?.workspace_name || data.name || 'Notion',
    }
  } catch (e) {
    return { ok: false, error: String(e) }
  }
}

export async function logConversation(
  token: string,
  projectName: string,
  summary: string,
  messages: unknown[]
): Promise<void> {
  const messageCount = Array.isArray(messages) ? messages.length : 0
  const body = {
    parent: { database_id: CHANGELOG_DB_ID },
    properties: {
      Name: { title: [{ text: { content: `[${projectName}] ${summary.slice(0, 100)}` } }] },
      Project: { rich_text: [{ text: { content: projectName } }] },
      Date: { date: { start: new Date().toISOString() } },
      Messages: { number: messageCount },
    },
    children: [
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{ type: 'text', text: { content: summary.slice(0, 2000) } }],
        },
      },
    ],
  }

  try {
    await fetch(`${NOTION_API}/pages`, {
      method: 'POST',
      headers: headers(token),
      body: JSON.stringify(body),
    })
  } catch {
    // Non-critical
  }
}

export async function getProjectContext(token: string, projectName: string): Promise<string> {
  try {
    const body = { query: projectName, filter: { value: 'page', property: 'object' } }
    const res = await fetch(`${NOTION_API}/search`, {
      method: 'POST',
      headers: headers(token),
      body: JSON.stringify(body),
    })
    if (!res.ok) return ''
    const data = await res.json() as { results?: Array<{ properties?: Record<string, unknown>; url?: string }> }
    const pages = data.results || []
    if (pages.length === 0) return ''

    const topPage = pages[0]
    const titleProp = topPage.properties?.Name || topPage.properties?.title
    let title = 'Notion context'
    if (titleProp && typeof titleProp === 'object') {
      const tp = titleProp as { title?: Array<{ plain_text?: string }>; rich_text?: Array<{ plain_text?: string }> }
      title = tp.title?.[0]?.plain_text || tp.rich_text?.[0]?.plain_text || title
    }
    return `[Notion context for "${projectName}": ${title} — ${topPage.url || ''}]`
  } catch {
    return ''
  }
}
