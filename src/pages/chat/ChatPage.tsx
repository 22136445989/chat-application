import { useEffect, useState } from 'react'
import { useAuth } from '../../features/auth/AuthContext'
import { RoomList } from '../../features/rooms/RoomList'
import { MessageList } from '../../features/messages/MessageList'
import { MessageInput } from '../../features/messages/MessageInput'
import { Message } from '../../entities/message/model'
import { getMessages, sendMessage, subscribeToMessages } from '../../entities/message/api'
import './ChatPage.css'

function getSendErrorMessage(errorMessage: string): string {
  if (errorMessage.includes('foreign key constraint') || errorMessage.includes('messages_room_id_fkey')) {
    return 'Эта комната была удалена. Перезагрузите страницу.'
  }
  return errorMessage
}

export function ChatPage() {
  const { user, signOut } = useAuth()
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    if (!selectedRoomId) {
      setMessages([])
      return
    }

    setError('')
    getMessages(selectedRoomId)
      .then(setMessages)
      .catch((err) => setError(err.message))

    const unsubscribe = subscribeToMessages(selectedRoomId, (message) => {
      setMessages((prev) => [...prev, message])
    })

    return () => unsubscribe()
  }, [selectedRoomId])

  const handleSendMessage = async (content: string) => {
    if (!selectedRoomId || !user) return

    try {
      await sendMessage(selectedRoomId, user.id, content)
    } catch (err: any) {
      setError(getSendErrorMessage(err.message))
    }
  }

  return (
    <div className="chat-page">
      <header className="chat-header">
        <h1>Chat</h1>
        <div className="chat-user">
          <span>{user?.email}</span>
          <button onClick={() => signOut()}>Выйти</button>
        </div>
      </header>

      <div className="chat-body">
        <RoomList selectedRoomId={selectedRoomId} onSelectRoom={setSelectedRoomId} />

        <div className="chat-messages">
          {error && (
            <div className="chat-error">
              <p>{error}</p>
            </div>
          )}

          {selectedRoomId ? (
            <>
              <MessageList messages={messages} />
              <MessageInput onSend={handleSendMessage} />
            </>
          ) : (
            <div className="empty">Выберите комнату, чтобы начать общение</div>
          )}
        </div>
      </div>
    </div>
  )
}
