import { useEffect, useState } from 'react'
import { Room } from '../../entities/room/model'
import { getRooms, createRoom } from '../../entities/room/api'

interface RoomListProps {
  selectedRoomId: string | null
  onSelectRoom: (roomId: string) => void
}

export function RoomList({ selectedRoomId, onSelectRoom }: RoomListProps) {
  const [rooms, setRooms] = useState<Room[]>([])
  const [newRoomName, setNewRoomName] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    getRooms()
      .then(setRooms)
      .catch((err) => setError(err.message))
  }, [])

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRoomName.trim()) return

    try {
      const room = await createRoom(newRoomName.trim())
      setRooms((prev) => [room, ...prev])
      setNewRoomName('')
      onSelectRoom(room.id)
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div style={{ width: '250px', borderRight: '1px solid #ddd', padding: '1rem' }}>
      <h2>Комнаты</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleCreateRoom} style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Новая комната"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
          style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
        />
        <button type="submit" style={{ width: '100%' }}>
          Создать
        </button>
      </form>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {rooms.map((room) => (
          <li
            key={room.id}
            onClick={() => onSelectRoom(room.id)}
            style={{
              padding: '0.5rem',
              cursor: 'pointer',
              background: room.id === selectedRoomId ? '#e0e0e0' : 'transparent',
              borderRadius: '4px',
            }}
          >
            {room.name}
          </li>
        ))}
      </ul>
    </div>
  )
}
