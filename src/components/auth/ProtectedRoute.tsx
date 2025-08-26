import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'
import { useAuth } from '@/hooks/useAuth'

interface ProtectedRouteProps {
  children?: React.ReactNode
  redirectTo?: string
  requireEmailVerification?: boolean
}

/**
 * ProtectedRoute component that guards routes requiring authentication
 *
 * @param children - Optional children to render instead of Outlet
 * @param redirectTo - Path to redirect when not authenticated (default: /login)
 * @param requireEmailVerification - Whether to require email verification
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = '/login',
  requireEmailVerification = false,
}) => {
  const { isAuthenticated, isLoading, user } = useAuth()
  const location = useLocation()

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Save the attempted location for redirecting after login
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  // Check email verification if required
  if (requireEmailVerification && user && !user.emailVerified) {
    return <Navigate to="/email-verification-check" replace />
  }

  // Render children or Outlet for nested routes
  return <>{children || <Outlet />}</>
}

export default ProtectedRoute
