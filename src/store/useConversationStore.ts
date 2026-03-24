import { create } from 'zustand'

export interface Message {
  id: string
  conversationId: string
  role: 'user' | 'assistant'
  content: string
  agentName?: string
  createdAt: string
}

export interface Conversation {
  id: string
  projectPath: string
  title: string
  model: string
  messages: Message[]
  createdAt: string
}

interface ConversationState {
  conversations: Conversation[]
  activeConversationId: string | null
  addConversation: (conversation: Conversation) => void
  addMessage: (conversationId: string, message: Message) => void
  setActiveConversation: (conversationId: string | null) => void
  getActiveConversation: () => Conversation | undefined
}

export const useConversationStore = create<ConversationState>((set, get) => ({
  conversations: [],
  activeConversationId: null,
  addConversation: (conversation) =>
    set((state) => ({
      conversations: [...state.conversations, conversation],
    })),
  addMessage: (conversationId, message) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId
          ? { ...conv, messages: [...conv.messages, message] }
          : conv
      ),
    })),
  setActiveConversation: (conversationId) =>
    set({ activeConversationId: conversationId }),
  getActiveConversation: () => {
    const { conversations, activeConversationId } = get()
    return conversations.find((c) => c.id === activeConversationId)
  },
}))
