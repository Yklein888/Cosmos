import { useState, useEffect } from 'react'
import './SettingsView.css'

interface AppSettings {
  theme: 'dark' | 'light'
  fontSize: number
  autoSave: boolean
  enableNotifications: boolean
  defaultModel: string
  terminalFontSize: number
}

export default function SettingsView() {
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'dark',
    fontSize: 14,
    autoSave: true,
    enableNotifications: true,
    defaultModel: 'claude-3-5-sonnet-20241022',
    terminalFontSize: 12,
  })

  const [savedMessage, setSavedMessage] = useState(false)

  useEffect(() => {
    // Load settings from localStorage
    const saved = localStorage.getItem('cosmos-settings')
    if (saved) {
      setSettings(JSON.parse(saved))
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem('cosmos-settings', JSON.stringify(settings))
    setSavedMessage(true)
    setTimeout(() => setSavedMessage(false), 2000)

    // Apply theme change
    if (settings.theme === 'dark') {
      document.documentElement.style.colorScheme = 'dark'
    } else {
      document.documentElement.style.colorScheme = 'light'
    }
  }

  return (
    <div className="settings-view">
      <div className="settings-header">
        <h2>⚙️ Settings</h2>
        {savedMessage && <span className="saved-message">✓ Saved!</span>}
      </div>

      <div className="settings-container">
        <div className="settings-section">
          <h3>Appearance</h3>

          <div className="setting-item">
            <label>Theme</label>
            <div className="button-group">
              <button
                className={`theme-btn ${settings.theme === 'dark' ? 'active' : ''}`}
                onClick={() => setSettings({ ...settings, theme: 'dark' })}
              >
                🌙 Dark
              </button>
              <button
                className={`theme-btn ${settings.theme === 'light' ? 'active' : ''}`}
                onClick={() => setSettings({ ...settings, theme: 'light' })}
              >
                ☀️ Light
              </button>
            </div>
          </div>

          <div className="setting-item">
            <label>
              Font Size
              <span className="value">{settings.fontSize}px</span>
            </label>
            <input
              type="range"
              min="12"
              max="18"
              value={settings.fontSize}
              onChange={(e) =>
                setSettings({ ...settings, fontSize: parseInt(e.target.value) })
              }
            />
          </div>

          <div className="setting-item">
            <label>Terminal Font Size</label>
            <input
              type="range"
              min="10"
              max="16"
              value={settings.terminalFontSize}
              onChange={(e) =>
                setSettings({ ...settings, terminalFontSize: parseInt(e.target.value) })
              }
            />
            <span className="value">{settings.terminalFontSize}px</span>
          </div>
        </div>

        <div className="settings-section">
          <h3>General</h3>

          <div className="setting-item">
            <label>Claude Model</label>
            <select
              value={settings.defaultModel}
              onChange={(e) =>
                setSettings({ ...settings, defaultModel: e.target.value })
              }
            >
              <option value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet</option>
              <option value="claude-opus-4-6">Claude Opus 4.6</option>
              <option value="claude-haiku-4-5-20251001">Claude Haiku 4.5</option>
            </select>
          </div>

          <div className="setting-item toggle">
            <label>Auto-Save</label>
            <input
              type="checkbox"
              checked={settings.autoSave}
              onChange={(e) =>
                setSettings({ ...settings, autoSave: e.target.checked })
              }
            />
          </div>

          <div className="setting-item toggle">
            <label>Enable Notifications</label>
            <input
              type="checkbox"
              checked={settings.enableNotifications}
              onChange={(e) =>
                setSettings({ ...settings, enableNotifications: e.target.checked })
              }
            />
          </div>
        </div>

        <div className="settings-section">
          <h3>About COSMOS</h3>
          <div className="about-info">
            <p>
              <strong>Version:</strong> 0.1.0
            </p>
            <p>
              <strong>Built with:</strong> Tauri 2.0 + React 19 + Rust
            </p>
            <p>
              <strong>License:</strong> MIT
            </p>
            <p>
              <strong>Repository:</strong>{' '}
              <a href="https://github.com/yklein888/cosmos" target="_blank" rel="noopener noreferrer">
                github.com/yklein888/cosmos
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="settings-footer">
        <button className="save-btn" onClick={handleSave}>
          💾 Save Settings
        </button>
      </div>
    </div>
  )
}
