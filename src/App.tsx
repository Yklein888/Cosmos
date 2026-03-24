import { useEffect, useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import './App.css'

function App() {
  const [greetMsg, setGreetMsg] = useState('')
  const [name, setName] = useState('')

  useEffect(() => {
    invoke<string>('greet', { name: 'World' })
      .then((message) => setGreetMsg(message))
      .catch(console.error)
  }, [])

  return (
    <div className="app">
      <header>
        <h1>🌌 COSMOS</h1>
        <p>Multi-Agent Intelligence Platform for Claude Code</p>
      </header>

      <main>
        <div className="welcome-box">
          <h2>Welcome to COSMOS</h2>
          <p>{greetMsg}</p>

          <div className="input-group">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
              placeholder="Enter a project name"
            />
            <button
              onClick={() => {
                invoke<string>('greet', { name })
                  .then((message) => setGreetMsg(message))
                  .catch(console.error)
              }}
            >
              Greet
            </button>
          </div>

          <div className="features">
            <h3>Phase 1: Foundation (In Progress)</h3>
            <ul>
              <li>✅ Tauri + React + TypeScript Setup</li>
              <li>✅ Zustand State Management</li>
              <li>✅ SQLite Database (Rust Backend)</li>
              <li>✅ IPC Communication Bridge</li>
              <li>📋 Coming: Multi-Project Management</li>
              <li>📋 Coming: Claude Integration</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
