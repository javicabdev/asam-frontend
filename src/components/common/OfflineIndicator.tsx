import React, { useState, useEffect } from 'react'
import { Alert, Collapse, Box, Typography } from '@mui/material'
import { CloudOff as OfflineIcon, CloudQueue as OnlineIcon } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

/**
 * Component that displays a banner when the app is offline
 * Shows at the top of the screen with offline status
 * Automatically hides when connection is restored
 */
export const OfflineIndicator: React.FC = () => {
  const { t } = useTranslation('common')
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [showReconnected, setShowReconnected] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      // Show "reconnected" message briefly
      setShowReconnected(true)
      setTimeout(() => {
        setShowReconnected(false)
      }, 3000)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowReconnected(false)
    }

    // Listen to online/offline events
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Don't render anything if online and not showing reconnected message
  if (isOnline && !showReconnected) {
    return null
  }

  return (
    <>
      {/* Offline indicator */}
      <Collapse in={!isOnline}>
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1400, // Above AppBar
          }}
        >
          <Alert
            severity="warning"
            icon={<OfflineIcon />}
            sx={{
              borderRadius: 0,
              '& .MuiAlert-message': {
                width: '100%',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="body2" fontWeight={600}>
                  {t('pwa.offline.title')}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                  {t('pwa.offline.message')}
                </Typography>
              </Box>
            </Box>
          </Alert>
        </Box>
      </Collapse>

      {/* Reconnected indicator (temporary) */}
      <Collapse in={showReconnected}>
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1400,
          }}
        >
          <Alert
            severity="success"
            icon={<OnlineIcon />}
            sx={{
              borderRadius: 0,
            }}
          >
            <Typography variant="body2" fontWeight={600}>
              {t('pwa.online.title')}
            </Typography>
          </Alert>
        </Box>
      </Collapse>
    </>
  )
}
