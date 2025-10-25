import { useEffect, useState } from 'react'
import { Alert, Snackbar, Button } from '@mui/material'
import { useAuthStore } from '@/stores/authStore'
import { useNavigate } from 'react-router-dom'

/**
 * Component that shows a warning when the session is about to expire
 * Follows industry best practices for session management UX
 */
export const SessionExpirationWarning: React.FC = () => {
  const { expiresAt, isAuthenticated, logout } = useAuthStore()
  const [showWarning, setShowWarning] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated || !expiresAt) {
      setShowWarning(false)
      return
    }

    // Check every 30 seconds
    const intervalId = setInterval(() => {
      const expirationTime = new Date(expiresAt).getTime()
      const currentTime = Date.now()
      const timeUntilExpiration = expirationTime - currentTime
      const TWO_MINUTES = 2 * 60 * 1000

      // Show warning if token expires in less than 2 minutes
      // (This is after the automatic refresh should have happened at 5 minutes)
      if (timeUntilExpiration < TWO_MINUTES && timeUntilExpiration > 0) {
        setShowWarning(true)
      } else {
        setShowWarning(false)
      }

      // If already expired, logout
      if (timeUntilExpiration <= 0) {
        handleLogout()
      }
    }, 30 * 1000)

    return () => clearInterval(intervalId)
  }, [expiresAt, isAuthenticated])

  const handleLogout = () => {
    setShowWarning(false)
    logout()
    navigate('/login', {
      state: { message: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.' },
    })
  }

  const handleStayLoggedIn = () => {
    setShowWarning(false)
    // The useTokenRefresh hook will handle the refresh automatically
  }

  if (!showWarning) {
    return null
  }

  return (
    <Snackbar
      open={showWarning}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{ zIndex: 9999 }}
    >
      <Alert
        severity="warning"
        sx={{ width: '100%', alignItems: 'center' }}
        action={
          <>
            <Button color="inherit" size="small" onClick={handleStayLoggedIn}>
              Continuar
            </Button>
            <Button color="inherit" size="small" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </>
        }
      >
        Tu sesión está a punto de expirar. ¿Deseas continuar?
      </Alert>
    </Snackbar>
  )
}
