import { supabase } from '../../shared/lib/supabase'
import { Message } from './model'

export async function getMessages(roomId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*, user:profiles(username)')
    .eq('room_id', roomId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function sendMessage(roomId: string, userId: string, content: string): Promise<Message> {
  const { data, error } = await supabase
    .from('messages')
    .insert({ room_id: roomId, user_id: userId, content })
    .select('*, user:profiles(username)')
    .single()

  if (error) throw error
  return data
}

export function subscribeToMessages(roomId: string, callback: (message: Message) => void) {
  const channel = supabase
    .channel(`room-${roomId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `room_id=eq.${roomId}`,
      },
      async (payload) => {
        const message = payload.new as Message
        const { data } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', message.user_id)
          .single()
        callback({ ...message, user: data ?? undefined })
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}
