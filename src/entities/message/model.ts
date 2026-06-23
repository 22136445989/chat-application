export interface Message {
  id: string
  room_id: string
  user_id: string
  content: string
  created_at: string
  user?: {
    username: string
  }
}
