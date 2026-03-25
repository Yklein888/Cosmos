import { create } from 'zustand'
import { api } from '../api'

interface NotionStore {
  token: string
  connected: boolean
  connecting: boolean
  workspaceName: string
  error: string | null

  // Settings
  autoLogConversations: boolean
  injectProjectContext: boolean
  syncTasks: boolean

  loadSettings: () => Promise<void>
  connect: (token: string) => Promise<void>
  disconnect: () => Promise<void>
  setAutoLog: (val: boolean) => void
  setInjectContext: (val: boolean) => void
  setSyncTasks: (val: boolean) => void
  logConversation: (projectName: string, summary: string, messages: unknown[]) => Promise<void>
  getProjectContext: (projectName: string) => Promise<string>
}

export const useNotionStore = create<NotionStore>((set, get) => ({
  token: '',
  connected: false,
  connecting: false,
  workspaceName: '',
  error: null,
  autoLogConversations: true,
  injectProjectContext: true,
  syncTasks: false,

  loadSettings: async () => {
    try {
      const token = (await api.settings.get('notionToken') as string) || ''
      const workspaceName = (await api.settings.get('notionWorkspace') as string) || ''
      const autoLog = (await api.settings.get('notionAutoLog') as boolean) ?? true
      const injectCtx = (await api.settings.get('notionInjectContext') as boolean) ?? true
      const syncTasks = (await api.settings.get('notionSyncTasks') as boolean) ?? false
      set({
        token,
        connected: !!token && !!workspaceName,
        workspaceName,
        autoLogConversations: autoLog,
        injectProjectContext: injectCtx,
        syncTasks,
      })
    } catch {
      // ignore
    }
  },

  connect: async (token: string) => {
    set({ connecting: true, error: null })
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await (api as any).notion?.testConnection(token)
      if (result?.ok) {
        set({ token, connected: true, workspaceName: result.workspaceName || 'Notion', connecting: false })
        await api.settings.set('notionToken', token)
        await api.settings.set('notionWorkspace', result.workspaceName || 'Notion')
      } else {
        set({ connected: false, error: result?.error || 'Connection failed', connecting: false })
      }
    } catch (e: unknown) {
      set({ connected: false, error: String(e), connecting: false })
    }
  },

  disconnect: async () => {
    set({ token: '', connected: false, workspaceName: '', error: null })
    await api.settings.set('notionToken', '')
    await api.settings.set('notionWorkspace', '')
  },

  setAutoLog: (val) => {
    set({ autoLogConversations: val })
    api.settings.set('notionAutoLog', val)
  },

  setInjectContext: (val) => {
    set({ injectProjectContext: val })
    api.settings.set('notionInjectContext', val)
  },

  setSyncTasks: (val) => {
    set({ syncTasks: val })
    api.settings.set('notionSyncTasks', val)
  },

  logConversation: async (projectName, summary, messages) => {
    const { token, autoLogConversations } = get()
    if (!token || !autoLogConversations) return
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (api as any).notion?.logConversation(token, projectName, summary, messages)
    } catch {
      // Non-critical — fail silently
    }
  },

  getProjectContext: async (projectName) => {
    const { token, injectProjectContext } = get()
    if (!token || !injectProjectContext) return ''
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ctx = await (api as any).notion?.getProjectContext(token, projectName)
      return ctx || ''
    } catch {
      return ''
    }
  },
}))
