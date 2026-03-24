import { useEffect, useRef, useState } from 'react'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import 'xterm/css/xterm.css'
import './TerminalView.css'

interface TerminalViewProps {
  projectPath?: string
}

export default function TerminalView({ projectPath }: TerminalViewProps) {
  const terminalRef = useRef<HTMLDivElement>(null)
  const terminalRef_xterm = useRef<Terminal | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [command, setCommand] = useState('')

  useEffect(() => {
    if (!terminalRef.current) return

    // Initialize xterm.js
    const term = new Terminal({
      cursorBlink: true,
      cursorStyle: 'block',
      fontSize: 12,
      fontFamily: 'Courier New, monospace',
      theme: {
        background: '#0a0e27',
        foreground: '#e0e7ff',
        cursor: '#6366f1',
        selection: 'rgba(99, 102, 241, 0.3)',
      },
    })

    const fitAddon = new FitAddon()
    term.loadAddon(fitAddon)

    term.open(terminalRef.current)
    fitAddon.fit()

    terminalRef_xterm.current = term

    // Write welcome message
    term.writeln('🌌 COSMOS Terminal')
    term.writeln(`Project: ${projectPath || 'No project selected'}`)
    term.writeln('Type your command:')
    term.write('$ ')

    setIsConnected(true)

    // Handle terminal resize
    const handleResize = () => {
      fitAddon.fit()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      term.dispose()
    }
  }, [projectPath])

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!command.trim() || !terminalRef_xterm.current) return

    const term = terminalRef_xterm.current
    term.writeln(command)

    // TODO: Send command to Rust backend via IPC
    // const result = await ApiClient.executeTerminalCommand(projectPath, command)
    // term.writeln(result)
    // term.write('$ ')

    // For now, just echo the command
    if (command === 'clear') {
      term.clear()
    } else if (command === 'help') {
      term.writeln('Available commands:')
      term.writeln('  help    - Show this help message')
      term.writeln('  clear   - Clear terminal')
      term.writeln('  claude  - Start Claude chat')
    } else {
      term.writeln(`Command not implemented: ${command}`)
    }

    term.write('$ ')
    setCommand('')
  }

  if (!isConnected) {
    return <div className="terminal-loading">Initializing terminal...</div>
  }

  return (
    <div className="terminal-view">
      <div ref={terminalRef} className="terminal-container" />

      <form className="terminal-input-bar" onSubmit={handleCommandSubmit}>
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="Enter command..."
          className="terminal-input"
        />
        <button type="submit" className="terminal-send-btn">
          ↵
        </button>
      </form>
    </div>
  )
}
