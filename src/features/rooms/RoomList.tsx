import { useEffect, useState } from 'react'
import { Room } from '../../entities/room/model'
import { getRooms, createRoom } from '../../entities/room/api'
import './RoomList.css'

interface RoomListProps {
  selectedRoomId: string | null
  onSelectRoom: (roomId: string) => void
}

export function RoomList({ selectedRoomId, onSelectRoom }: RoomListProps) {
  const [rooms, setRooms] = useState<Room[]>([])
  const [newRoomName, setNewRoomName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getRooms()
      .then(setRooms)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
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

  if (loading) {
    return <div className="room-list loader">Загрузка комнат...</div>
  }

  return (
    <div className="room-list">
      <h2>Комнаты</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleCreateRoom} className="room-form">
        <input
          type="text"
          placeholder="Новая комната"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
        />
        <button type="submit">Создать</button>
      </form>
      <ul className="room-items">
        {rooms.map((room) => (
          <li
            key={room.id}
            onClick={() => onSelectRoom(room.id)}
            className={room.id === selectedRoomId ? 'room-item active' : 'room-item'}
          >
            {room.name}
          </li>
        ))}
      </ul>
    </div>
  )
}
