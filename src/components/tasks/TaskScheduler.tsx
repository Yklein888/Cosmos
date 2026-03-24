import { useState } from 'react'
import { ApiClient } from '../../utils/api-client'
import './TaskScheduler.css'

interface TaskSchedulerProps {
  onClose: () => void
  projectPath: string
}

const SCHEDULE_OPTIONS = [
  { label: 'Once', value: 'once' },
  { label: 'Hourly', value: 'hourly' },
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Custom', value: 'custom' },
]

export default function TaskScheduler({ onClose, projectPath }: TaskSchedulerProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [command, setCommand] = useState('')
  const [schedule, setSchedule] = useState('daily')
  const [customSchedule, setCustomSchedule] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !command.trim()) return

    setLoading(true)
    try {
      const finalSchedule = schedule === 'custom' ? customSchedule : schedule
      // const task = await ApiClient.createTask(
      //   name,
      //   description,
      //   command,
      //   finalSchedule,
      //   projectPath
      // )
      onClose()
    } catch (error) {
      console.error('Failed to create task:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="task-scheduler-overlay">
      <div className="task-scheduler-modal">
        <div className="modal-header">
          <h3>Create Scheduled Task</h3>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-group">
            <label>Task Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Daily Backup"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this task do?"
              rows={2}
            />
          </div>

          <div className="form-group">
            <label>Command</label>
            <input
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder="e.g., npm run build"
              required
            />
          </div>

          <div className="form-group">
            <label>Schedule</label>
            <select value={schedule} onChange={(e) => setSchedule(e.target.value)}>
              {SCHEDULE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {schedule === 'custom' && (
            <div className="form-group">
              <label>Cron Expression</label>
              <input
                type="text"
                value={customSchedule}
                onChange={(e) => setCustomSchedule(e.target.value)}
                placeholder="0 9 * * * (9 AM daily)"
              />
              <small>Format: minute hour day month weekday</small>
            </div>
          )}

          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Task'}
            </button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
