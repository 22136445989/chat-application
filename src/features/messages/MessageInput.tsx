import { useState } from 'react'

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
    <form onSubmit={handleSubmit} style={{ display: 'flex', padding: '1rem', borderTop: '1px solid #ddd' }}>
      <input
        type="text"
        placeholder="Введите сообщение..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{ flex: 1, padding: '0.5rem' }}
      />
      <button type="submit" style={{ marginLeft: '0.5rem', padding: '0.5rem 1rem' }}>
        Отправить
      </button>
    </form>
  )
}
