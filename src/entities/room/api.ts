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
