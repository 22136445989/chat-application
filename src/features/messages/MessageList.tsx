import { useEffect, useRef } from 'react'
import { Message } from '../../entities/message/model'
import './MessageList.css'

interface MessageListProps {
  messages: Message[]
}

export function MessageList({ messages }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (messages.length === 0) {
    return <div className="empty">Сообщений пока нет. Напишите первое!</div>
  }

  return (
    <div className="message-list">
      {messages.map((message) => (
        <div key={message.id} className="message">
          <div className="message-header">
            <strong>{message.user?.username ?? 'Неизвестный'}</strong>
            <span className="message-time">
              {new Date(message.created_at).toLocaleTimeString()}
            </span>
          </div>
          <p className="message-content">{message.content}</p>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  )
}
