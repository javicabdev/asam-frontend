import React from 'react'
import { Box, CircularProgress, Typography, Fade } from '@mui/material'

interface LoadingScreenProps {
  /**
   * Optional message to display below the spinner
   */
  message?: string
  /**
   * Show minimal loading (just spinner, no text)
   */
  minimal?: boolean
}

/**
 * Loading screen component optimized for React Suspense fallbacks
 * Lighter weight than LoadingOverlay - used for lazy-loaded routes
 */
export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Cargando...',
  minimal = false
}) => {
  return (
    <Fade in={true} timeout={300}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: minimal ? '200px' : '100vh',
          gap: 2,
          width: '100%',
        }}
      >
        <CircularProgress
          size={minimal ? 40 : 48}
          thickness={4}
          sx={{
            color: 'primary.main',
          }}
        />
        {!minimal && (
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              fontWeight: 500,
              animation: 'pulse 2s ease-in-out infinite',
              '@keyframes pulse': {
                '0%, 100%': {
                  opacity: 1,
                },
                '50%': {
                  opacity: 0.5,
                },
              },
            }}
          >
            {message}
          </Typography>
        )}
      </Box>
    </Fade>
  )
}
