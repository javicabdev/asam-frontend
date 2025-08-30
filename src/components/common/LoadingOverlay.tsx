import React from 'react'
import { Backdrop, Box, CircularProgress, Typography, Fade } from '@mui/material'
import { RefreshOutlined } from '@mui/icons-material'
import { useUIStore } from '@/stores/uiStore'

interface LoadingOverlayProps {
  open?: boolean
  message?: string
  icon?: React.ReactNode
}

/**
 * Global loading overlay component
 * Shows a full-screen loading indicator with optional message
 */
export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  open: openProp,
  message = 'Cargando...',
  icon,
}) => {
  const isRefreshingToken = useUIStore((state) => state.isRefreshingToken)

  // Show overlay if explicitly opened or if token is refreshing
  const open = openProp ?? isRefreshingToken

  // Custom message for token refresh
  const displayMessage = isRefreshingToken ? 'Actualizando sesión...' : message

  const displayIcon = isRefreshingToken ? <RefreshOutlined sx={{ fontSize: 40, mb: 2 }} /> : icon

  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1000,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
      }}
      open={open}
    >
      <Fade in={open}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          {displayIcon}
          <CircularProgress color="inherit" size={60} />
          <Typography
            variant="h6"
            component="div"
            sx={{
              mt: 2,
              textAlign: 'center',
              maxWidth: 300,
            }}
          >
            {displayMessage}
          </Typography>
          {isRefreshingToken && (
            <Typography
              variant="body2"
              sx={{
                opacity: 0.8,
                textAlign: 'center',
              }}
            >
              Por favor, espera un momento...
            </Typography>
          )}
        </Box>
      </Fade>
    </Backdrop>
  )
}
