import { useEffect, useState } from 'react'
import { api } from '../api'
import type { UpdateStatusEvent } from '../types'

export function UpdateNotification() {
  const [update, setUpdate] = useState<UpdateStatusEvent | null>(null)
  const [dismissed, setDismissed] = useState(false)
  const [checking, setChecking] = useState(false)

  useEffect(() => {
    const unsub = api.updater.onStatus((data: UpdateStatusEvent) => {
      setUpdate(data)
      if (data.status === 'ready') setDismissed(false)
      if (data.status === 'checking' || data.status === 'up-to-date') {
        setChecking(false)
      }
    })
    return unsub
  }, [])

  const handleCheckForUpdates = async () => {
    setChecking(true)
    await api.updater.checkForUpdates()
  }

  // Show manual check button when no active update notification
  const showButton = dismissed || !update || update.status === 'checking' || update.status === 'up-to-date' || update.status === 'error'

  if (showButton) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={handleCheckForUpdates}
          disabled={checking || update?.status === 'checking'}
          className="px-3 py-1.5 text-xs font-medium bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-neutral-200 hover:border-neutral-600 rounded transition-all disabled:opacity-50 flex items-center gap-1.5"
          title="Check for updates manually"
        >
          {checking || update?.status === 'checking' ? (
            <>
              <div className="w-3 h-3 border border-neutral-400 border-t-transparent rounded-full animate-spin" />
              Checking...
            </>
          ) : (
            <>
              <span>🔄</span>
              Updates
            </>
          )}
        </button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm bg-neutral-800 border border-neutral-700 rounded-lg shadow-xl p-4 animate-in slide-in-from-bottom-2">
      {update.status === 'available' && (
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
          <p className="text-sm text-neutral-300">
            Update <span className="font-medium text-neutral-200">v{update.version}</span> is downloading...
          </p>
        </div>
      )}

      {update.status === 'downloading' && (
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-blue-400 shrink-0 animate-pulse" />
            <p className="text-sm text-neutral-300">Downloading update... {update.percent}%</p>
          </div>
          <div className="h-1 bg-neutral-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${update.percent || 0}%` }}
            />
          </div>
        </div>
      )}

      {update.status === 'ready' && (
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            <p className="text-sm text-neutral-300">
              <span className="font-medium text-neutral-200">v{update.version}</span> ready to install
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setDismissed(true)}
              className="px-2.5 py-1 text-xs text-neutral-400 hover:text-neutral-300 transition-colors"
            >
              Later
            </button>
            <button
              onClick={() => api.updater.install()}
              className="px-3 py-1 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors"
            >
              Restart
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
