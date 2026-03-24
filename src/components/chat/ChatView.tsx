import { useState, useRef, useEffect } from 'react'
import { useClaude } from '../../hooks/useIpc'
import { useConversationStore } from '../../store/useConversationStore'
import MessageList from './MessageList'
import InputBox from './InputBox'
import './ChatView.css'

export default function ChatView() {
  const { sendMessage } = useClaude()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const activeConversation = useConversationStore(
    (state) => state.getActiveConversation()
  )
  const addMessage = useConversationStore((state) => state.addMessage)

  // Auto-scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeConversation?.messages])

  const handleSendMessage = async (content: string) => {
    if (!activeConversation) {
      setError('No active conversation')
      return
    }

    setError(null)
    setLoading(true)

    try {
      // Add user message
      const userMessage = {
        id: `msg-${Date.now()}`,
        conversationId: activeConversation.id,
        role: 'user' as const,
        content,
        createdAt: new Date().toISOString(),
      }

      addMessage(activeConversation.id, userMessage)

      // Send to Claude
      const response = await sendMessage(activeConversation.id, content)

      // Add assistant response
      const assistantMessage = {
        id: `msg-${Date.now()}-response`,
        conversationId: activeConversation.id,
        role: 'assistant' as const,
        content: response,
        createdAt: new Date().toISOString(),
      }

      addMessage(activeConversation.id, assistantMessage)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  if (!activeConversation) {
    return (
      <div className="chat-view empty">
        <p>Select a conversation or create a new one</p>
      </div>
    )
  }

  return (
    <div className="chat-view">
      <div className="chat-header">
        <h2>{activeConversation.title}</h2>
        <span className="model-badge">{activeConversation.model}</span>
      </div>

      <div className="chat-messages">
        <MessageList messages={activeConversation.messages} />
        <div ref={scrollRef} />
      </div>

      {error && <div className="chat-error">{error}</div>}

      <InputBox onSend={handleSendMessage} disabled={loading} loading={loading} />
    </div>
  )
}
