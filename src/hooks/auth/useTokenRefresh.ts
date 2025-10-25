import { useEffect, useRef } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { useRefreshTokenMutation } from '@/graphql/generated/operations'
import { useSnackbar } from 'notistack'

/**
 * Hook that automatically refreshes the access token before it expires
 * 
 * Industry best practices:
 * - Refresh token proactively before expiration (5 minutes buffer)
 * - Show discrete notifications to the user
 * - Handle refresh failures gracefully with automatic logout
 * 
 * @param enabled - Whether token refresh is enabled (default: true)
 */
export const useTokenRefresh = (enabled = true) => {
  const { accessToken, refreshToken, expiresAt, updateTokens, logout, isAuthenticated } = useAuthStore()
  const [refreshTokenMutation] = useRefreshTokenMutation()
  const { enqueueSnackbar } = useSnackbar()
  const isRefreshing = useRef(false)
  const lastRefreshAttempt = useRef<number>(0)

  useEffect(() => {
    if (!enabled || !isAuthenticated || !accessToken || !refreshToken || !expiresAt) {
      return
    }

    // Check token expiration every minute
    const intervalId = setInterval(() => {
      checkAndRefreshToken()
    }, 60 * 1000) // Check every 60 seconds

    // Also check immediately on mount
    checkAndRefreshToken()

    return () => {
      clearInterval(intervalId)
    }
  }, [enabled, isAuthenticated, accessToken, refreshToken, expiresAt])

  const checkAndRefreshToken = async () => {
    // Prevent multiple simultaneous refresh attempts
    if (isRefreshing.current) {
      return
    }

    // Prevent refresh attempts more than once per minute
    const now = Date.now()
    if (now - lastRefreshAttempt.current < 60 * 1000) {
      return
    }

    if (!expiresAt || !refreshToken) {
      return
    }

    const expirationTime = new Date(expiresAt).getTime()
    const currentTime = Date.now()
    const timeUntilExpiration = expirationTime - currentTime
    const FIVE_MINUTES = 5 * 60 * 1000

    // If token expires in less than 5 minutes, refresh it proactively
    if (timeUntilExpiration < FIVE_MINUTES && timeUntilExpiration > 0) {
      console.log('[TokenRefresh] Token expiring soon, refreshing proactively...')
      await performTokenRefresh()
    }
    
    // If token is already expired, try to refresh immediately
    if (timeUntilExpiration <= 0) {
      console.log('[TokenRefresh] Token expired, attempting refresh...')
      await performTokenRefresh()
    }
  }

  const performTokenRefresh = async () => {
    if (!refreshToken) {
      console.warn('[TokenRefresh] No refresh token available')
      return
    }

    isRefreshing.current = true
    lastRefreshAttempt.current = Date.now()

    try {
      const { data } = await refreshTokenMutation({
        variables: {
          input: { refreshToken },
        },
        context: {
          // Skip auth link to avoid circular dependency
          skipAuthLink: true,
        },
      })

      if (data?.refreshToken) {
        console.log('[TokenRefresh] Token refresh successful')
        
        updateTokens({
          accessToken: data.refreshToken.accessToken,
          refreshToken: data.refreshToken.refreshToken,
          expiresAt: data.refreshToken.expiresAt,
        })

        // Show discrete success notification
        enqueueSnackbar('Sesión renovada automáticamente', {
          variant: 'info',
          autoHideDuration: 2000,
          anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
        })
      } else {
        throw new Error('No data returned from refresh token mutation')
      }
    } catch (error) {
      console.error('[TokenRefresh] Token refresh failed:', error)
      
      // Show error notification
      enqueueSnackbar('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.', {
        variant: 'warning',
        autoHideDuration: 5000,
        anchorOrigin: { vertical: 'top', horizontal: 'center' },
      })

      // Logout user and redirect to login
      logout()
    } finally {
      isRefreshing.current = false
    }
  }
}
