import { useState, useEffect } from 'react'
import { Icon } from '../../common/Icon'
import { useMemoryStore } from '../../../store/useMemoryStore'
import { useProjectStore } from '../../../store/useProjectStore'

function ImportanceBar({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-sm ${i < value ? 'bg-cosmos-accent' : 'bg-cosmos-border'}`}
        />
      ))}
    </div>
  )
}

function MemoryCard({ memory, onDelete, onEdit }: {
  memory: import('../../../store/useMemoryStore').MemoryEntry
  onDelete: (id: string) => void
  onEdit: (id: string, content: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [editContent, setEditContent] = useState(memory.content)

  const handleSave = () => {
    if (editContent.trim() && editContent !== memory.content) {
      onEdit(memory.id, editContent.trim())
    }
    setEditing(false)
  }

  return (
    <div className="bg-cosmos-card border border-cosmos-border rounded-xl p-4 group hover:border-cosmos-accent/30 transition-all">
      <div className="flex items-start justify-between gap-2 mb-2">
        <ImportanceBar value={memory.importance} />
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => { setEditing(true); setEditContent(memory.content) }}
            className="p-1 text-cosmos-text-dim hover:text-cosmos-text transition-colors"
            title="Edit"
          >
            <Icon icon="lucide:pencil" className="text-xs" />
          </button>
          <button
            onClick={() => onDelete(memory.id)}
            className="p-1 text-cosmos-text-dim hover:text-red-400 transition-colors"
            title="Delete"
          >
            <Icon icon="lucide:trash-2" className="text-xs" />
          </button>
        </div>
      </div>

      {editing ? (
        <div className="space-y-2">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full bg-cosmos-bg border border-cosmos-border rounded-lg p-2 text-sm text-cosmos-text resize-none focus:outline-none focus:border-cosmos-accent/50"
            rows={3}
            autoFocus
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setEditing(false)}
              className="px-3 py-1 text-xs text-cosmos-text-muted hover:text-cosmos-text transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1 text-xs bg-cosmos-accent text-white rounded-lg hover:bg-cosmos-accent/80 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-cosmos-text leading-relaxed">{memory.content}</p>
      )}

      <p className="text-[10px] text-cosmos-text-dim mt-2">
        {new Date(memory.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
      </p>
    </div>
  )
}

export default function MemoryPage() {
  const [newContent, setNewContent] = useState('')
  const [newImportance, setNewImportance] = useState(5)
  const [search, setSearch] = useState('')
  const [adding, setAdding] = useState(false)

  const activeProjectPath = useProjectStore((s) => s.activeProjectPath)
  const memories = useMemoryStore((s) => s.memories)
  const loading = useMemoryStore((s) => s.loading)
  const saving = useMemoryStore((s) => s.saving)
  const loadMemories = useMemoryStore((s) => s.loadMemories)
  const addMemory = useMemoryStore((s) => s.addMemory)
  const deleteMemory = useMemoryStore((s) => s.deleteMemory)
  const updateMemory = useMemoryStore((s) => s.updateMemory)

  useEffect(() => {
    if (activeProjectPath) {
      loadMemories(activeProjectPath)
    }
  }, [activeProjectPath, loadMemories])

  const handleAdd = async () => {
    if (!newContent.trim() || !activeProjectPath) return
    await addMemory(activeProjectPath, newContent.trim(), newImportance)
    setNewContent('')
    setNewImportance(5)
    setAdding(false)
  }

  const filtered = memories.filter((m) =>
    !search || m.content.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-cosmos-border px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-lg font-bold text-cosmos-text">Project Memory</h1>
            <p className="text-xs text-cosmos-text-muted mt-0.5">
              Persistent facts auto-injected into every conversation
              {activeProjectPath && (
                <span className="ml-2 text-cosmos-text-dim">
                  · {activeProjectPath.split('/').pop() || activeProjectPath.split('\\').pop()}
                </span>
              )}
            </p>
          </div>
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-cosmos-accent text-white rounded-lg text-sm font-medium hover:bg-cosmos-accent/80 transition-colors"
          >
            <Icon icon="lucide:plus" className="text-sm" />
            Add Memory
          </button>
        </div>

        <div className="relative">
          <Icon icon="lucide:search" className="absolute left-3 top-1/2 -translate-y-1/2 text-cosmos-text-dim text-sm" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search memories..."
            className="w-full pl-9 pr-4 py-2 bg-cosmos-card border border-cosmos-border rounded-lg text-sm text-cosmos-text placeholder:text-cosmos-text-dim focus:outline-none focus:border-cosmos-accent/50"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        {/* Add memory form */}
        {adding && (
          <div className="mb-6 bg-cosmos-card border border-cosmos-accent/30 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-semibold text-cosmos-text">New Memory</h3>
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Enter a fact, decision, or context about this project..."
              className="w-full bg-cosmos-bg border border-cosmos-border rounded-lg p-3 text-sm text-cosmos-text placeholder:text-cosmos-text-dim resize-none focus:outline-none focus:border-cosmos-accent/50"
              rows={3}
              autoFocus
            />
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 flex-1">
                <span className="text-xs text-cosmos-text-muted">Importance:</span>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={newImportance}
                  onChange={(e) => setNewImportance(Number(e.target.value))}
                  className="flex-1 accent-indigo-500"
                />
                <span className="text-xs text-cosmos-accent font-bold w-4">{newImportance}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setAdding(false)}
                  className="px-3 py-1.5 text-xs text-cosmos-text-muted hover:text-cosmos-text transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  disabled={saving || !newContent.trim()}
                  className="px-4 py-1.5 text-xs bg-cosmos-accent text-white rounded-lg hover:bg-cosmos-accent/80 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  {saving ? (
                    <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Icon icon="lucide:save" className="text-xs" />
                  )}
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {!activeProjectPath ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-cosmos-card border border-cosmos-border flex items-center justify-center mb-4">
              <Icon icon="lucide:folder-open" className="text-2xl text-cosmos-text-dim" />
            </div>
            <p className="text-sm font-medium text-cosmos-text">No project open</p>
            <p className="text-xs text-cosmos-text-muted mt-1">Open a project to manage its memories</p>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-cosmos-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-cosmos-card border border-cosmos-border flex items-center justify-center mb-4">
              <Icon icon="lucide:brain" className="text-2xl text-cosmos-text-dim" />
            </div>
            <p className="text-sm font-medium text-cosmos-text">
              {search ? 'No matching memories' : 'No memories yet'}
            </p>
            <p className="text-xs text-cosmos-text-muted mt-1">
              {search ? 'Try a different search term' : 'Add facts or decisions to inject into conversations'}
            </p>
            {!search && (
              <button
                onClick={() => setAdding(true)}
                className="mt-4 px-4 py-2 bg-cosmos-accent text-white rounded-lg text-sm font-medium hover:bg-cosmos-accent/80 transition-colors"
              >
                Add First Memory
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-cosmos-text-dim mb-4">
              {filtered.length} {filtered.length === 1 ? 'memory' : 'memories'} · sorted by importance
            </p>
            {filtered
              .slice()
              .sort((a, b) => b.importance - a.importance)
              .map((memory) => (
                <MemoryCard
                  key={memory.id}
                  memory={memory}
                  onDelete={deleteMemory}
                  onEdit={updateMemory}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  )
}
