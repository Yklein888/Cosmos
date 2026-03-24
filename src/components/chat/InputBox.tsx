import { useState, useRef, useEffect } from 'react'
import './InputBox.css'

interface InputBoxProps {
  onSend: (message: string) => void
  disabled?: boolean
  loading?: boolean
}

export default function InputBox({ onSend, disabled = false, loading = false }: InputBoxProps) {
  const [input, setInput] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-expand textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px'
    }
  }, [input])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !disabled) {
      onSend(input)
      setInput('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Submit on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit(e as any)
    }
  }

  return (
    <form className="input-box" onSubmit={handleSubmit}>
      <div className="input-wrapper">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message... (Ctrl+Enter to send)"
          disabled={disabled}
          className="message-input"
          rows={1}
        />
        <button
          type="submit"
          disabled={!input.trim() || disabled}
          className="send-button"
          title="Send (Ctrl+Enter)"
        >
          {loading ? (
            <>
              <span className="spinner" />
              Sending...
            </>
          ) : (
            <>
              <span>Send</span>
              <span className="send-icon">→</span>
            </>
          )}
        </button>
      </div>
      <p className="input-hint">💡 Tip: Ctrl+Enter to send</p>
    </form>
  )
}
