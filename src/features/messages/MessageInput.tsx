import { useState } from 'react'
import './MessageInput.css'

interface MessageInputProps {
  onSend: (content: string) => void
}

export function MessageInput({ onSend }: MessageInputProps) {
  const [content, setContent] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    onSend(content.trim())
    setContent('')
  }

  return (
    <form onSubmit={handleSubmit} className="message-input">
      <input
        type="text"
        placeholder="Введите сообщение..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button type="submit">Отправить</button>
    </form>
  )
}
