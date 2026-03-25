import { Icon } from '../common/Icon'
import { useListeningAgentStore, type AgentInsight } from '../../store/useListeningAgentStore'
import { useConversationStore } from '../../store/useConversationStore'

const TYPE_STYLE: Record<AgentInsight['type'], { border: string; icon: string; color: string }> = {
  info: { border: 'border-blue-500/20', icon: 'lucide:info', color: 'text-blue-400' },
  warning: { border: 'border-amber-500/20', icon: 'lucide:alert-triangle', color: 'text-amber-400' },
  suggestion: { border: 'border-cosmos-accent/20', icon: 'lucide:lightbulb', color: 'text-cosmos-accent' },
}

function InsightCard({ insight }: { insight: AgentInsight }) {
  const dismiss = useListeningAgentStore((s) => s.dismissInsight)
  const injectInsightToChat = useListeningAgentStore((s) => s.injectInsightToChat)
  const style = TYPE_STYLE[insight.type]

  const handleInject = () => {
    const text = injectInsightToChat(insight.id)
    if (text) {
      // Dispatch custom event that TerminalPage listens to
      window.dispatchEvent(new CustomEvent('cosmos:inject-to-chat', { detail: { text } }))
      dismiss(insight.id)
    }
  }

  return (
    <div className={`bg-cosmos-card border ${style.border} rounded-xl p-3 space-y-2`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <Icon icon={style.icon} className={`text-sm ${style.color} flex-shrink-0`} />
          <span className="text-xs font-semibold text-cosmos-text">{insight.agentName}</span>
        </div>
        <button
          onClick={() => dismiss(insight.id)}
          className="text-cosmos-text-dim hover:text-cosmos-text transition-colors flex-shrink-0"
        >
          <Icon icon="lucide:x" className="text-xs" />
        </button>
      </div>
      <p className="text-xs text-cosmos-text-muted leading-relaxed">{insight.text}</p>
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-cosmos-text-dim">
          {new Date(insight.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
        <button
          onClick={handleInject}
          className="flex items-center gap-1 text-[10px] text-cosmos-accent hover:text-cosmos-accent/80 transition-colors"
          title="Inject into chat"
        >
          <Icon icon="lucide:corner-down-left" className="text-[10px]" />
          Inject
        </button>
      </div>
    </div>
  )
}

export function AgentInsightsSidebar({ onClose }: { onClose: () => void }) {
  const insights = useListeningAgentStore((s) => s.insights)
  const isListening = useListeningAgentStore((s) => s.isListening)
  const clearInsights = useListeningAgentStore((s) => s.clearInsights)

  return (
    <div className="w-72 flex-shrink-0 flex flex-col border-l border-cosmos-border bg-cosmos-bg">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-cosmos-border">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${isListening ? 'bg-green-400 animate-pulse' : 'bg-zinc-600'}`} />
          <span className="text-xs font-semibold text-cosmos-text">Agent Insights</span>
          {insights.length > 0 && (
            <span className="text-[10px] font-bold bg-cosmos-accent text-white rounded-full px-1.5 min-w-[18px] text-center">
              {insights.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {insights.length > 0 && (
            <button
              onClick={clearInsights}
              className="p-1 text-cosmos-text-dim hover:text-cosmos-text transition-colors"
              title="Clear all"
            >
              <Icon icon="lucide:trash-2" className="text-xs" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 text-cosmos-text-dim hover:text-cosmos-text transition-colors"
          >
            <Icon icon="lucide:panel-right-close" className="text-sm" />
          </button>
        </div>
      </div>

      {/* Insights list */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
        {insights.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <div className="w-12 h-12 rounded-xl bg-cosmos-card border border-cosmos-border flex items-center justify-center mb-3">
              <Icon icon="lucide:bot" className="text-xl text-cosmos-text-dim" />
            </div>
            <p className="text-xs font-medium text-cosmos-text">No insights yet</p>
            <p className="text-[10px] text-cosmos-text-muted mt-1 leading-relaxed">
              Agents will post insights as you chat
            </p>
          </div>
        ) : (
          insights.map((insight) => <InsightCard key={insight.id} insight={insight} />)
        )}
      </div>
    </div>
  )
}
