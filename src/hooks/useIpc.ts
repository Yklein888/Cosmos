import { invoke } from '@tauri-apps/api/core'
import { useCallback } from 'react'

/**
 * Hook for invoking Tauri IPC commands
 */
export const useIpc = () => {
  const call = useCallback(
    async <T,>(command: string, args?: Record<string, unknown>): Promise<T> => {
      try {
        const result = await invoke<T>(command, args)
        return result
      } catch (error) {
        console.error(`IPC Error [${command}]:`, error)
        throw error
      }
    },
    []
  )

  return { call }
}

/**
 * Hook for checking Claude CLI
 */
export const useClaudeCli = () => {
  const { call } = useIpc()

  const checkClaude = useCallback(async () => {
    return call<string>('check_claude_cli')
  }, [call])

  return { checkClaude }
}

/**
 * Hook for sending messages to Claude
 */
export const useClaude = () => {
  const { call } = useIpc()

  const sendMessage = useCallback(
    async (conversationId: string, message: string, model = 'claude-3-5-sonnet-20241022') => {
      return call<string>('send_message_to_claude', {
        conversation_id: conversationId,
        message,
        model,
      })
    },
    [call]
  )

  const streamResponse = useCallback(
    async (message: string, model = 'claude-3-5-sonnet-20241022') => {
      return call<string[]>('stream_claude_response', { message, model })
    },
    [call]
  )

  return { sendMessage, streamResponse }
}
