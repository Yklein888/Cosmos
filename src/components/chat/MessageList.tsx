import { Message } from '../../store/useConversationStore'
import { MarkdownParser } from '../../utils/markdown-parser'
import './MessageList.css'

interface MessageListProps {
  messages: Message[]
}

export default function MessageList({ messages }: MessageListProps) {
  return (
    <div className="message-list">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`message message-${message.role}`}
          data-agent={message.agentName}
        >
          <div className="message-header">
            <span className="message-role">
              {message.role === 'user' ? '👤 You' : '🤖 Claude'}
            </span>
            {message.agentName && (
              <span className="message-agent">{message.agentName}</span>
            )}
            <time className="message-time">
              {new Date(message.createdAt).toLocaleTimeString()}
            </time>
          </div>

          <div className="message-content">
            {message.role === 'assistant' ? (
              <FormattedContent content={message.content} />
            ) : (
              <p>{message.content}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

interface FormattedContentProps {
  content: string
}

function FormattedContent({ content }: FormattedContentProps) {
  const parsed = MarkdownParser.parse(content)

  return (
    <div className="formatted-content">
      {parsed.map((block, idx) => {
        switch (block.type) {
          case 'code':
            return (
              <pre key={idx} className={`code-block language-${block.language}`}>
                <code>{block.content}</code>
              </pre>
            )
          case 'heading':
            return <h4 key={idx}>{block.content.replace(/^#+\s/, '')}</h4>
          case 'list':
            return <li key={idx}>{block.content.replace(/^[-*]\s/, '')}</li>
          case 'text':
          default:
            return (
              <p
                key={idx}
                dangerouslySetInnerHTML={{
                  __html: MarkdownParser.formatForDisplay(block.content),
                }}
              />
            )
        }
      })}
    </div>
  )
}
