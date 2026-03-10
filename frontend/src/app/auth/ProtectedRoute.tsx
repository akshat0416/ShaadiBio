import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/app/auth/AuthContext'

export function ProtectedRoute() {
  const { token, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return null
  if (!token) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return <Outlet />
}

