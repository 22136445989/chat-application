import { useAuth } from '../../features/auth/AuthContext'

export function ChatPage() {
  const { user, signOut } = useAuth()

  return (
    <div style={{ padding: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Chat</h1>
        <div>
          <span style={{ marginRight: '1rem' }}>{user?.email}</span>
          <button onClick={() => signOut()}>Выйти</button>
        </div>
      </header>
      <p>Здесь будет чат.</p>
    </div>
  )
}
