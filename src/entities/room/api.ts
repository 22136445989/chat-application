import { supabase } from '../../shared/lib/supabase'
import { Room } from './model'

export async function getRooms(): Promise<Room[]> {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function createRoom(name: string): Promise<Room> {
  const { data, error } = await supabase
    .from('rooms')
    .insert({ name })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteRoom(roomId: string): Promise<void> {
  const { error } = await supabase.from('rooms').delete().eq('id', roomId)
  if (error) throw error
}

export function subscribeToRooms(callback: (change: { event: 'INSERT' | 'UPDATE' | 'DELETE'; room: Room }) => void) {
  const channel = supabase
    .channel('rooms-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'rooms',
      },
      (payload) => {
        const room = (payload.new as Room) ?? (payload.old as Room)
        const event = payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE'
        callback({ event, room })
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}
