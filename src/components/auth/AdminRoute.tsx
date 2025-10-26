import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

/**
 * AdminRoute - Protects routes that require admin role
 * Redirects non-admin users to /members
 */
export const AdminRoute = () => {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  return isAdmin ? <Outlet /> : <Navigate to="/members" replace />
}
