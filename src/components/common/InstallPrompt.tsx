import React, { useState, useEffect } from 'react'
import { Alert, Button, IconButton, Collapse, Box } from '@mui/material'
import { Close as CloseIcon, GetApp as InstallIcon } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

/**
 * Component that shows a discreet banner prompting users to install the PWA
 * Only shows if:
 * - App is not already installed
 * - Browser supports PWA installation
 * - User hasn't dismissed it permanently
 */
export const InstallPrompt: React.FC = () => {
  const { t } = useTranslation('common')
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    // Check if user has dismissed the prompt permanently
    const dismissed = localStorage.getItem('pwa-install-dismissed')
    if (dismissed === 'true') {
      return
    }

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return // App is already installed
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the default mini-infobar from appearing
      e.preventDefault()

      // Store the event for later use
      setDeferredPrompt(e as BeforeInstallPromptEvent)

      // Show our custom install prompt after a short delay
      setTimeout(() => {
        setShowPrompt(true)
      }, 3000) // Wait 3 seconds before showing
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Check if already installed (iOS doesn't fire beforeinstallprompt)
    if ('navigator' in window && 'standalone' in (window.navigator as any)) {
      const isInstalled = (window.navigator as any).standalone === true
      if (!isInstalled) {
        // For iOS, show a simpler message
        setTimeout(() => {
          setShowPrompt(true)
        }, 3000)
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // For browsers that don't support the API (like iOS Safari)
      // Just close the prompt as we can't trigger installation
      setShowPrompt(false)
      return
    }

    // Show the install prompt
    await deferredPrompt.prompt()

    // Wait for the user's response
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt')
    } else {
      console.log('User dismissed the install prompt')
    }

    // Clear the deferredPrompt for next time
    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
  }

  const handleDismissForever = () => {
    localStorage.setItem('pwa-install-dismissed', 'true')
    setShowPrompt(false)
  }

  if (!showPrompt) {
    return null
  }

  return (
    <Collapse in={showPrompt}>
      <Box
        sx={{
          position: 'fixed',
          bottom: { xs: 0, sm: 16 },
          left: { xs: 0, sm: 16 },
          right: { xs: 0, sm: 'auto' },
          zIndex: 1300,
          maxWidth: { xs: '100%', sm: 400 },
          boxShadow: { xs: 0, sm: 3 },
        }}
      >
        <Alert
          severity="info"
          icon={<InstallIcon />}
          action={
            <>
              <Button
                color="inherit"
                size="small"
                onClick={handleInstallClick}
                sx={{ fontWeight: 600 }}
              >
                {t('pwa.install')}
              </Button>
              <IconButton
                size="small"
                color="inherit"
                onClick={handleDismiss}
                aria-label={t('pwa.close')}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </>
          }
          sx={{
            borderRadius: { xs: 0, sm: 1 },
            '& .MuiAlert-message': {
              width: '100%',
            },
          }}
        >
          <Box>
            <strong>{t('pwa.installTitle')}</strong>
            <br />
            <Box component="span" sx={{ fontSize: '0.875rem' }}>
              {t('pwa.installMessage')}
            </Box>
          </Box>
          <Button
            size="small"
            onClick={handleDismissForever}
            sx={{
              mt: 1,
              textTransform: 'none',
              fontSize: '0.75rem',
              color: 'text.secondary',
            }}
          >
            {t('pwa.dontShowAgain')}
          </Button>
        </Alert>
      </Box>
    </Collapse>
  )
}
