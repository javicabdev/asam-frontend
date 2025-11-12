import { useEffect, useRef, useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { useSnackbar } from 'notistack'

/**
 * Hook that automatically logs out the user after a period of inactivity
 *
 * Industry best practices:
 * - Track multiple types of user activity (mouse, keyboard, touch)
 * - Show warning before automatic logout
 * - Allow user to extend session when warned
 * - Use debouncing to avoid excessive timer resets
 *
 * @param idleTimeoutMs - Milliseconds of inactivity before logout (default: 15 minutes)
 * @param warningTimeMs - Show warning this many ms before logout (default: 2 minutes)
 * @param enabled - Whether idle timeout is enabled (default: true)
 */
export const useIdleTimeout = (
  idleTimeoutMs = 15 * 60 * 1000, // 15 minutes
  warningTimeMs = 2 * 60 * 1000,  // 2 minutes
  enabled = true
) => {
  const { logout, isAuthenticated } = useAuthStore()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  const idleTimerRef = useRef<NodeJS.Timeout | null>(null)
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null)
  const lastActivityRef = useRef<number>(Date.now())
  const warningSnackbarRef = useRef<string | number | null>(null)
  const [showWarning, setShowWarning] = useState(false)

  // Reset the idle timer
  const resetIdleTimer = () => {
    lastActivityRef.current = Date.now()

    // Clear existing timers
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current)
    }
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current)
    }

    // Clear warning if showing
    if (showWarning) {
      setShowWarning(false)
      if (warningSnackbarRef.current) {
        closeSnackbar(warningSnackbarRef.current)
        warningSnackbarRef.current = null
      }
    }

    // Set warning timer (fires before logout)
    const timeUntilWarning = idleTimeoutMs - warningTimeMs
    if (timeUntilWarning > 0) {
      warningTimerRef.current = setTimeout(() => {
        console.log('[IdleTimeout] Showing inactivity warning')
        setShowWarning(true)

        // Show warning snackbar
        const snackbarKey = enqueueSnackbar(
          `Tu sesión se cerrará en ${Math.floor(warningTimeMs / 1000 / 60)} minutos por inactividad. Mueve el cursor para continuar.`,
          {
            variant: 'warning',
            persist: true,
            anchorOrigin: { vertical: 'top', horizontal: 'center' },
          }
        )
        warningSnackbarRef.current = snackbarKey
      }, timeUntilWarning)
    }

    // Set idle timer (fires to logout)
    idleTimerRef.current = setTimeout(() => {
      console.log('[IdleTimeout] User inactive, logging out...')

      // Clear warning snackbar
      if (warningSnackbarRef.current) {
        closeSnackbar(warningSnackbarRef.current)
        warningSnackbarRef.current = null
      }

      // Show logout notification
      enqueueSnackbar('Tu sesión ha expirado por inactividad.', {
        variant: 'info',
        autoHideDuration: 5000,
        anchorOrigin: { vertical: 'top', horizontal: 'center' },
      })

      // Logout user
      logout()
    }, idleTimeoutMs)
  }

  // Debounced activity handler to avoid excessive resets
  const handleActivity = useRef<() => void>()

  useEffect(() => {
    // Debounce activity events (only reset timer once per second)
    const DEBOUNCE_MS = 1000
    let debounceTimeout: NodeJS.Timeout | null = null

    handleActivity.current = () => {
      if (debounceTimeout) return

      debounceTimeout = setTimeout(() => {
        debounceTimeout = null
        resetIdleTimer()
      }, DEBOUNCE_MS)
    }
  }, [idleTimeoutMs, warningTimeMs])

  useEffect(() => {
    if (!enabled || !isAuthenticated) {
      // Clean up timers if disabled or not authenticated
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current)
      }
      if (warningTimerRef.current) {
        clearTimeout(warningTimerRef.current)
      }
      if (warningSnackbarRef.current) {
        closeSnackbar(warningSnackbarRef.current)
        warningSnackbarRef.current = null
      }
      return
    }

    console.log(`[IdleTimeout] Enabled with ${idleTimeoutMs / 1000 / 60} minute timeout`)

    // Activity events to track
    const events = [
      'mousedown',
      'mousemove',
      'keydown',
      'scroll',
      'touchstart',
      'click',
    ]

    // Add event listeners
    const activityHandler = () => {
      handleActivity.current?.()
    }

    events.forEach((event) => {
      window.addEventListener(event, activityHandler, { passive: true })
    })

    // Start the initial timer
    resetIdleTimer()

    // Cleanup
    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, activityHandler)
      })

      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current)
      }
      if (warningTimerRef.current) {
        clearTimeout(warningTimerRef.current)
      }
      if (warningSnackbarRef.current) {
        closeSnackbar(warningSnackbarRef.current)
      }
    }
  }, [enabled, isAuthenticated, idleTimeoutMs, warningTimeMs, logout, enqueueSnackbar, closeSnackbar])

  return {
    resetTimer: resetIdleTimer,
    showWarning,
  }
}
