import { useEffect, useState } from 'react'
import { useAuth } from '../../features/auth/AuthContext'
import { RoomList } from '../../features/rooms/RoomList'
import { MessageList } from '../../features/messages/MessageList'
import { MessageInput } from '../../features/messages/MessageInput'
import { Message } from '../../entities/message/model'
import { getMessages, sendMessage, subscribeToMessages } from '../../entities/message/api'

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
      setError(err.message)
    }
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem',
          borderBottom: '1px solid #ddd',
          background: '#fff',
        }}
      >
        <h1 style={{ margin: 0 }}>Chat</h1>
        <div>
          <span style={{ marginRight: '1rem' }}>{user?.email}</span>
          <button onClick={() => signOut()}>Выйти</button>
        </div>
      </header>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <RoomList selectedRoomId={selectedRoomId} onSelectRoom={setSelectedRoomId} />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {error && <p style={{ color: 'red', padding: '0 1rem' }}>{error}</p>}

          {selectedRoomId ? (
            <>
              <MessageList messages={messages} />
              <MessageInput onSend={handleSendMessage} />
            </>
          ) : (
            <div style={{ padding: '2rem', color: '#888' }}>Выберите комнату, чтобы начать общение</div>
          )}
        </div>
      </div>
    </div>
  )
}
