import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Загрузка...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}
