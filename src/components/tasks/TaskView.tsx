import { useState, useEffect } from 'react'
import { useProjectStore } from '../../store/useProjectStore'
import { ApiClient } from '../../utils/api-client'
import TaskScheduler from './TaskScheduler'
import './TaskView.css'

interface Task {
  id: string
  name: string
  description: string
  command: string
  schedule: string
  enabled: boolean
  created_at: string
  last_run?: string
  next_run?: string
}

interface TaskResult {
  id: string
  task_id: string
  status: string
  output: string
  error?: string
  started_at: string
  completed_at?: string
  duration_ms?: number
}

export default function TaskView() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [taskResults, setTaskResults] = useState<TaskResult[]>([])
  const [showScheduler, setShowScheduler] = useState(false)
  const [loading, setLoading] = useState(false)

  const activeProject = useProjectStore((state) => state.getActiveProject())

  useEffect(() => {
    if (!activeProject) return

    const fetchTasks = async () => {
      setLoading(true)
      try {
        const result = await ApiClient.getTasks?.(activeProject.path)
        if (result) {
          setTasks(result as Task[])
        }
      } catch (error) {
        console.error('Failed to fetch tasks:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [activeProject])

  const handleSelectTask = async (task: Task) => {
    setSelectedTask(task)
    // Fetch task results
    // const results = await ApiClient.getTaskResults(task.id)
    // setTaskResults(results)
  }

  const handleExecuteTask = async (taskId: string) => {
    try {
      // const result = await ApiClient.executeTask(taskId)
      // Add to results
    } catch (error) {
      console.error('Failed to execute task:', error)
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      // await ApiClient.deleteTask(taskId)
      setTasks(tasks.filter((t) => t.id !== taskId))
      if (selectedTask?.id === taskId) {
        setSelectedTask(null)
      }
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  }

  if (!activeProject) {
    return (
      <div className="task-view empty">
        <p>Select a project to view tasks</p>
      </div>
    )
  }

  return (
    <div className="task-view">
      <div className="task-header">
        <h2>Scheduled Tasks</h2>
        <button
          className="btn-create-task"
          onClick={() => setShowScheduler(!showScheduler)}
        >
          ➕ New Task
        </button>
      </div>

      {showScheduler && (
        <TaskScheduler
          onClose={() => setShowScheduler(false)}
          projectPath={activeProject.path}
        />
      )}

      <div className="task-container">
        <div className="tasks-list">
          <h3>Tasks ({tasks.length})</h3>
          {loading ? (
            <p>Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p className="empty">No tasks yet</p>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className={`task-item ${selectedTask?.id === task.id ? 'selected' : ''}`}
                onClick={() => handleSelectTask(task)}
              >
                <div className="task-name">{task.name}</div>
                <div className="task-schedule">{task.schedule}</div>
                {task.last_run && (
                  <div className="task-last-run">Last: {new Date(task.last_run).toLocaleDateString()}</div>
                )}
              </div>
            ))
          )}
        </div>

        {selectedTask && (
          <div className="task-details">
            <h3>{selectedTask.name}</h3>
            <p className="task-description">{selectedTask.description}</p>

            <div className="task-info">
              <div>
                <strong>Command:</strong>
                <code>{selectedTask.command}</code>
              </div>
              <div>
                <strong>Schedule:</strong>
                <span>{selectedTask.schedule}</span>
              </div>
              <div>
                <strong>Status:</strong>
                <span className={`status-badge ${selectedTask.enabled ? 'enabled' : 'disabled'}`}>
                  {selectedTask.enabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>

            <div className="task-actions">
              <button onClick={() => handleExecuteTask(selectedTask.id)}>Run Now</button>
              <button onClick={() => handleDeleteTask(selectedTask.id)} className="btn-danger">
                Delete
              </button>
            </div>

            {taskResults.length > 0 && (
              <div className="task-results">
                <h4>Execution History</h4>
                {taskResults.map((result) => (
                  <div key={result.id} className={`result-item status-${result.status}`}>
                    <div className="result-status">{result.status}</div>
                    <div className="result-time">{new Date(result.started_at).toLocaleString()}</div>
                    {result.duration_ms && <div className="result-duration">{result.duration_ms}ms</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
