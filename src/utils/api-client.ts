import { invoke } from '@tauri-apps/api/core'

/**
 * API client for communicating with Tauri backend
 */
export class ApiClient {
  /**
   * Check if Claude CLI is installed
   */
  static async checkClaudeCli(): Promise<string> {
    return invoke<string>('check_claude_cli')
  }

  /**
   * Send message to Claude
   */
  static async sendMessage(
    conversationId: string,
    message: string,
    model = 'claude-3-5-sonnet-20241022'
  ): Promise<string> {
    return invoke<string>('send_message_to_claude', {
      conversation_id: conversationId,
      message,
      model,
    })
  }

  /**
   * Stream Claude response
   */
  static async streamResponse(
    message: string,
    model = 'claude-3-5-sonnet-20241022'
  ): Promise<string[]> {
    return invoke<string[]>('stream_claude_response', { message, model })
  }

  /**
   * Create a new conversation
   */
  static async createConversation(
    projectPath: string,
    title: string,
    model = 'claude-3-5-sonnet-20241022'
  ): Promise<{ id: string }> {
    const result = await invoke<any>('create_conversation', {
      project_path: projectPath,
      title,
      model,
    })
    return result
  }

  /**
   * Get all conversations for a project
   */
  static async getConversations(projectPath: string): Promise<any[]> {
    return invoke<any[]>('get_conversations', { project_path: projectPath })
  }

  /**
   * Get messages for a conversation
   */
  static async getConversationMessages(conversationId: string): Promise<any[]> {
    return invoke<any[]>('get_conversation_messages', {
      conversation_id: conversationId,
    })
  }

  /**
   * Add a message to a conversation
   */
  static async addMessage(
    conversationId: string,
    role: 'user' | 'assistant',
    content: string,
    agentName?: string
  ): Promise<void> {
    return invoke<void>('add_message_to_conversation', {
      conversation_id: conversationId,
      role,
      content,
      agent_name: agentName,
    })
  }

  /**
   * Create a new project
   */
  static async createProject(path: string, name: string): Promise<any> {
    return invoke<any>('create_project', { path, name })
  }

  /**
   * Get all projects
   */
  static async getProjects(): Promise<any[]> {
    return invoke<any[]>('get_projects')
  }

  /**
   * Save agent memory
   */
  static async saveMemory(
    projectPath: string,
    agentName: string,
    memoryType: string,
    content: string
  ): Promise<any> {
    return invoke<any>('save_memory', {
      project_path: projectPath,
      agent_name: agentName,
      memory_type: memoryType,
      content,
    })
  }

  /**
   * Get agent memory
   */
  static async getMemory(projectPath: string): Promise<any[]> {
    return invoke<any[]>('get_memory', { project_path: projectPath })
  }
}
