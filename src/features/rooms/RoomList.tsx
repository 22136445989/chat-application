import { useEffect, useState } from 'react'
import { Room } from '../../entities/room/model'
import { getRooms, createRoom, deleteRoom } from '../../entities/room/api'
import { Modal } from '../../shared/ui/Modal'
import './RoomList.css'

interface RoomListProps {
  selectedRoomId: string | null
  onSelectRoom: (roomId: string | null) => void
}

export function RoomList({ selectedRoomId, onSelectRoom }: RoomListProps) {
  const [rooms, setRooms] = useState<Room[]>([])
  const [newRoomName, setNewRoomName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null)

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

  const handleDeleteRoom = async () => {
    if (!roomToDelete) return

    try {
      await deleteRoom(roomToDelete.id)
      setRooms((prev) => prev.filter((room) => room.id !== roomToDelete.id))
      if (selectedRoomId === roomToDelete.id) {
        onSelectRoom(null)
      }
      setRoomToDelete(null)
    } catch (err: any) {
      setError(err.message)
      setRoomToDelete(null)
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
            <span className="room-name">{room.name}</span>
            <button
              className="room-delete"
              onClick={(e) => {
                e.stopPropagation()
                setRoomToDelete(room)
              }}
              title="Удалить комнату"
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      <Modal
        isOpen={roomToDelete !== null}
        title="Удаление комнаты"
        onConfirm={handleDeleteRoom}
        onCancel={() => setRoomToDelete(null)}
        confirmText="Удалить"
        cancelText="Отмена"
      >
        Вы уверены, что хотите удалить комнату «{roomToDelete?.name}»? Все сообщения в ней также будут удалены.
      </Modal>
    </div>
  )
}
