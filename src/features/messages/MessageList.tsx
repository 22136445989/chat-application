import { useEffect, useRef } from 'react'
import { Message } from '../../entities/message/model'

interface MessageListProps {
  messages: Message[]
}

export function MessageList({ messages }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
      {messages.map((message) => (
        <div key={message.id} style={{ marginBottom: '1rem' }}>
          <strong>{message.user?.username ?? 'Неизвестный'}</strong>
          <span style={{ color: '#888', fontSize: '0.8rem', marginLeft: '0.5rem' }}>
            {new Date(message.created_at).toLocaleTimeString()}
          </span>
          <p style={{ margin: '0.25rem 0 0' }}>{message.content}</p>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  )
}
