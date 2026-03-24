/**
 * Simple Markdown parser for Claude responses
 * Handles: code blocks, bold, italic, lists
 */

export interface ParsedContent {
  type: 'text' | 'code' | 'bold' | 'italic' | 'list' | 'heading'
  content: string
  language?: string
}

export class MarkdownParser {
  /**
   * Parse markdown content into structured blocks
   */
  static parse(content: string): ParsedContent[] {
    const lines = content.split('\n')
    const blocks: ParsedContent[] = []
    let i = 0

    while (i < lines.length) {
      const line = lines[i]

      // Code block (``` ````)
      if (line.trim().startsWith('```')) {
        const language = line.trim().slice(3).trim() || 'text'
        const codeLines: string[] = []
        i++

        while (i < lines.length && !lines[i].trim().startsWith('```')) {
          codeLines.push(lines[i])
          i++
        }

        blocks.push({
          type: 'code',
          content: codeLines.join('\n'),
          language,
        })
        i++ // Skip closing ```
      }
      // Heading
      else if (line.trim().startsWith('#')) {
        blocks.push({
          type: 'heading',
          content: line.trim(),
        })
        i++
      }
      // List item
      else if (line.trim().startsWith('-') || line.trim().startsWith('*')) {
        blocks.push({
          type: 'list',
          content: line.trim(),
        })
        i++
      }
      // Regular text
      else if (line.trim()) {
        blocks.push({
          type: 'text',
          content: line,
        })
        i++
      } else {
        i++
      }
    }

    return blocks
  }

  /**
   * Convert parsed content to HTML string
   */
  static toHTML(parsed: ParsedContent[]): string {
    return parsed
      .map((block) => {
        switch (block.type) {
          case 'code':
            return `<pre><code class="language-${block.language}">${escapeHtml(
              block.content
            )}</code></pre>`
          case 'heading':
            return `<h3>${escapeHtml(block.content)}</h3>`
          case 'list':
            return `<li>${escapeHtml(block.content.slice(1).trim())}</li>`
          case 'text':
          default:
            return `<p>${escapeHtml(block.content)}</p>`
        }
      })
      .join('\n')
  }

  /**
   * Format content for display in React
   */
  static formatForDisplay(content: string): string {
    return content
      // Bold **text**
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic *text*
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Inline code `text`
      .replace(/`([^`]+)`/g, '<code>$1</code>')
  }
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}
