import React, { useEffect, useState } from 'react';
import {
  Alert,
  AlertTitle,
  Button,
  Snackbar,
  IconButton,
  Box,
} from '@mui/material';
import {
  Close as CloseIcon,
  GetApp as InstallIcon,
  PhoneIphone as PhoneIcon,
} from '@mui/icons-material';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

declare global {
  interface WindowEventMap {
    'beforeinstallprompt': BeforeInstallPromptEvent;
    'appinstalled': Event;
  }
}

export const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if it's iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    // Check if user has dismissed the prompt before
    const promptDismissed = localStorage.getItem('pwa-prompt-dismissed');
    const dismissedDate = promptDismissed ? new Date(promptDismissed) : null;
    const daysSinceDismissed = dismissedDate 
      ? (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24)
      : Infinity;

    // Show prompt again after 30 days
    if (promptDismissed && daysSinceDismissed < 30) {
      return;
    }

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Show our custom prompt after a delay
      setTimeout(() => setShowPrompt(true), 2000);
    };

    const handleAppInstalled = () => {
      console.log('PWA was installed');
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // For iOS, show instructions after a delay
    if (isIOS && !isInstalled) {
      setTimeout(() => {
        setShowIOSInstructions(true);
      }, 5000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isInstalled]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    console.log(`User response to the install prompt: ${outcome}`);

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
      // Save dismissal date
      localStorage.setItem('pwa-prompt-dismissed', new Date().toISOString());
    }

    // Clear the deferred prompt
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleClose = () => {
    setShowPrompt(false);
    setShowIOSInstructions(false);
    // Save dismissal date
    localStorage.setItem('pwa-prompt-dismissed', new Date().toISOString());
  };

  // Don't show anything if already installed
  if (isInstalled) {
    return null;
  }

  // iOS Instructions
  if (showIOSInstructions) {
    return (
      <Snackbar
        open={showIOSInstructions}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ mb: 2 }}
      >
        <Alert
          severity="info"
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
          sx={{ width: '100%', maxWidth: 400 }}
        >
          <AlertTitle>Instala la app de ASAM</AlertTitle>
          <Box sx={{ fontSize: '0.875rem' }}>
            <ol style={{ paddingLeft: 20, margin: '8px 0' }}>
              <li>Toca el botón compartir <span style={{ fontFamily: 'Arial' }}>⎘</span></li>
              <li>Selecciona "Añadir a pantalla de inicio"</li>
              <li>Toca "Añadir"</li>
            </ol>
          </Box>
        </Alert>
      </Snackbar>
    );
  }

  // Android/Desktop prompt
  if (showPrompt && deferredPrompt) {
    return (
      <Snackbar
        open={showPrompt}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ mb: 2 }}
      >
        <Alert
          severity="info"
          icon={<PhoneIcon />}
          action={
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                size="small"
                color="inherit"
                startIcon={<InstallIcon />}
                onClick={handleInstallClick}
                sx={{ whiteSpace: 'nowrap' }}
              >
                Instalar
              </Button>
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          }
          sx={{ width: '100%', maxWidth: 500 }}
        >
          <AlertTitle>Instala la aplicación de ASAM</AlertTitle>
          Accede rápidamente desde tu pantalla de inicio, funciona sin conexión
        </Alert>
      </Snackbar>
    );
  }

  return null;
};

export default InstallPrompt;
