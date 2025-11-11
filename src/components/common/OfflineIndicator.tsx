import React, { useState, useEffect } from 'react'
import { Alert, Collapse, Box, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import {
  CloudOff as OfflineIcon,
  CloudQueue as OnlineIcon,
  CheckCircle as AvailableIcon
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'

/**
 * Component that displays a banner when the app is offline
 * Shows at the top of the screen with offline status
 * Lists available functionality when offline
 * Automatically hides when connection is restored
 */
export const OfflineIndicator: React.FC = () => {
  const { t } = useTranslation('common')
  const { isOnline } = useOnlineStatus()
  const [showReconnected, setShowReconnected] = useState(false)
  const [showOfflineFeatures, setShowOfflineFeatures] = useState(false)

  useEffect(() => {
    let reconnectedTimer: NodeJS.Timeout

    if (isOnline) {
      // Show "reconnected" message briefly
      setShowReconnected(true)
      reconnectedTimer = setTimeout(() => {
        setShowReconnected(false)
      }, 3000)
    } else {
      // User is offline, hide reconnected message
      setShowReconnected(false)
    }

    return () => {
      if (reconnectedTimer) {
        clearTimeout(reconnectedTimer)
      }
    }
  }, [isOnline])

  // Don't render anything if online and not showing reconnected message
  if (isOnline && !showReconnected) {
    return null
  }

  const offlineFeatures = [
    t('pwa.offline.features.viewMembers'),
    t('pwa.offline.features.viewPayments'),
    t('pwa.offline.features.viewDetails'),
  ]

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
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" fontWeight={600}>
                    {t('pwa.offline.title')}
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                    {t('pwa.offline.message')}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      '&:hover': { opacity: 0.8 },
                    }}
                    onClick={() => setShowOfflineFeatures(!showOfflineFeatures)}
                  >
                    {showOfflineFeatures ? t('pwa.offline.hideFeatures') : t('pwa.offline.showFeatures')}
                  </Typography>
                </Box>
              </Box>

              {/* Expandable list of available features */}
              <Collapse in={showOfflineFeatures}>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" fontWeight={600} sx={{ display: 'block', mb: 1 }}>
                    {t('pwa.offline.availableFeatures')}:
                  </Typography>
                  <List dense disablePadding>
                    {offlineFeatures.map((feature, index) => (
                      <ListItem key={index} disablePadding sx={{ py: 0.25 }}>
                        <ListItemIcon sx={{ minWidth: 28 }}>
                          <AvailableIcon fontSize="small" color="success" />
                        </ListItemIcon>
                        <ListItemText
                          primary={feature}
                          primaryTypographyProps={{ variant: 'caption' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                  <Typography variant="caption" sx={{ display: 'block', mt: 1, fontStyle: 'italic' }}>
                    {t('pwa.offline.writeDisabled')}
                  </Typography>
                </Box>
              </Collapse>
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
