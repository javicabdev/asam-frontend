import { useState, useEffect } from 'react'

/**
 * Hook to detect online/offline status
 *
 * Returns:
 * - isOnline: boolean indicating if the browser is online
 * - wasOffline: boolean indicating if the browser was offline at least once during the session
 *
 * Usage:
 * ```tsx
 * const { isOnline, wasOffline } = useOnlineStatus()
 *
 * if (!isOnline) {
 *   return <Alert>You are offline</Alert>
 * }
 * ```
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  )
  const [wasOffline, setWasOffline] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setWasOffline(true)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return { isOnline, wasOffline }
}
