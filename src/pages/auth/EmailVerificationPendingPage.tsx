import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Link,
  Divider,
  Collapse,
  IconButton,
} from '@mui/material'
import {
  Email as EmailIcon,
  CheckCircle as CheckCircleIcon,
  Refresh as RefreshIcon,
  Logout as LogoutIcon,
  ExpandMore as ExpandMoreIcon,
  Error as ErrorIcon,
} from '@mui/icons-material'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/stores/authStore'

export const EmailVerificationPendingPage: React.FC = () => {
  const { user } = useAuthStore()
  const { sendVerificationEmail, logout } = useAuth()
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState<string>('')
  const [errorDetails, setErrorDetails] = useState<string>('')
  const [cooldown, setCooldown] = useState(false)
  const [showErrorDetails, setShowErrorDetails] = useState(false)
  const [hasTriedSending, setHasTriedSending] = useState(false)

  // Auto-send verification email on mount (only once)
  useEffect(() => {
    const sendInitialEmail = async () => {
      if (!user || !user.username || hasTriedSending) {
        return
      }

      // Don't auto-send if email is already verified
      if (user.emailVerified) {
        return
      }

      console.log('[EmailVerificationPending] Auto-sending verification email...')
      setHasTriedSending(true)

      // Wait a bit to ensure token is properly set in Apollo Client
      await new Promise((resolve) => setTimeout(resolve, 1000))

      try {
        const result = await sendVerificationEmail()
        if (result.success) {
          setStatus('success')
          setMessage(result.message || 'Email de verificación enviado automáticamente')
          setCooldown(true)
          setTimeout(() => {
            setCooldown(false)
            setStatus('idle')
          }, 60000)
        } else {
          console.error('[EmailVerificationPending] Auto-send failed:', result.message)
          setStatus('error')
          setMessage('No se pudo enviar el email automáticamente. Por favor, intenta manualmente.')
        }
      } catch (error) {
        console.error('[EmailVerificationPending] Auto-send error:', error)
      }
    }

    sendInitialEmail()
  }, [user, sendVerificationEmail, hasTriedSending])

  // Handle resend verification email
  const handleResendEmail = async () => {
    if (cooldown) return

    setStatus('loading')
    setMessage('')
    setErrorDetails('')

    try {
      const result = await sendVerificationEmail()

      if (result.success) {
        setStatus('success')
        setMessage(result.message || 'Email de verificación enviado exitosamente')

        // Set cooldown to prevent spam
        setCooldown(true)
        setTimeout(() => {
          setCooldown(false)
          setStatus('idle')
        }, 60000) // 1 minute cooldown
      } else {
        setStatus('error')

        // Provide more specific error messages based on common issues
        if (result.message?.includes('Internal server error')) {
          setMessage('Error al enviar el email. Por favor, contacta con soporte.')
          setErrorDetails(
            'El servidor no pudo procesar la solicitud. Posibles causas:\n' +
              '• Problema con el servicio de email (SMTP)\n' +
              '• Error de configuración del servidor\n' +
              '• Problema temporal del sistema'
          )
        } else if (
          result.message?.includes('UNAUTHORIZED') ||
          result.message?.includes('Unauthorized')
        ) {
          setMessage('Error de autorización. Por favor, contacta con soporte técnico.')
          setErrorDetails(
            'El servidor rechazó la solicitud a pesar de estar autenticado.\n' +
              'Este es un problema conocido del backend que está siendo investigado.\n\n' +
              'Solución temporal:\n' +
              '1. Cierra sesión y vuelve a iniciar sesión\n' +
              '2. Si el problema persiste, contacta a soporte con el código de error'
          )
        } else if (result.message?.includes('rate limit')) {
          setMessage('Has enviado demasiados emails. Intenta de nuevo más tarde.')
        } else if (result.message?.includes('invalid email')) {
          setMessage('La dirección de email no es válida.')
        } else {
          setMessage(result.message || 'Error al enviar el email de verificación')
        }

        console.error('Failed to send verification email:', result.message)
      }
    } catch (error: any) {
      setStatus('error')
      setMessage('Error inesperado. Por favor, intenta de nuevo.')
      setErrorDetails(error.message || 'Error desconocido')
      console.error('Exception in handleResendEmail:', error.message)
    }
  }

  // Handle logout
  const handleLogout = async () => {
    await logout()
  }

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {/* Icon */}
          <Box
            sx={{
              m: 2,
              p: 3,
              bgcolor:
                status === 'success'
                  ? 'success.light'
                  : status === 'error'
                    ? 'error.light'
                    : 'warning.light',
              borderRadius: '50%',
            }}
          >
            {status === 'success' ? (
              <CheckCircleIcon sx={{ fontSize: 48, color: 'success.dark' }} />
            ) : status === 'error' ? (
              <ErrorIcon sx={{ fontSize: 48, color: 'error.dark' }} />
            ) : (
              <EmailIcon sx={{ fontSize: 48, color: 'warning.dark' }} />
            )}
          </Box>

          {/* Title */}
          <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
            Verificación de Email Pendiente
          </Typography>

          {/* User info */}
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 1 }}>
            Hola <strong>{user?.username}</strong>,
          </Typography>

          {/* Instructions */}
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Tu cuenta está casi lista. Por favor, verifica tu dirección de correo electrónico para
            acceder a todas las funcionalidades del sistema.
          </Typography>

          {/* Alert messages */}
          {status === 'success' && (
            <Alert severity="success" sx={{ width: '100%', mb: 3 }}>
              {message}
              <Typography variant="body2" sx={{ mt: 1 }}>
                Revisa tu bandeja de entrada y sigue las instrucciones del email.
              </Typography>
            </Alert>
          )}

          {status === 'error' && (
            <Alert
              severity="error"
              sx={{ width: '100%', mb: 3 }}
              action={
                errorDetails && (
                  <IconButton
                    aria-label="show more"
                    size="small"
                    onClick={() => setShowErrorDetails(!showErrorDetails)}
                  >
                    <ExpandMoreIcon
                      sx={{
                        transform: showErrorDetails ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s',
                      }}
                    />
                  </IconButton>
                )
              }
            >
              {message}
              <Collapse in={showErrorDetails}>
                <Box sx={{ mt: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
                  <Typography variant="caption" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                    {errorDetails}
                  </Typography>
                </Box>
              </Collapse>
            </Alert>
          )}

          {/* Info box */}
          <Box
            sx={{
              width: '100%',
              p: 2,
              mb: 3,
              bgcolor: 'grey.100',
              borderRadius: 1,
              textAlign: 'center',
            }}
          >
            <Typography variant="body2" color="text.secondary" gutterBottom>
              ¿No recibiste el email?
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Revisa tu carpeta de spam o solicita un nuevo email de verificación.
            </Typography>
          </Box>

          {/* Actions */}
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              variant="contained"
              fullWidth
              startIcon={
                status === 'loading' ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <RefreshIcon />
                )
              }
              onClick={handleResendEmail}
              disabled={status === 'loading' || cooldown}
            >
              {status === 'loading'
                ? 'Enviando...'
                : cooldown
                  ? `Espera ${60} segundos antes de reenviar`
                  : 'Reenviar Email de Verificación'}
            </Button>

            <Divider>O</Divider>

            <Button
              variant="outlined"
              fullWidth
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              color="error"
            >
              Cerrar Sesión
            </Button>
          </Box>

          {/* Help section */}
          <Box sx={{ mt: 3, textAlign: 'center', width: '100%' }}>
            <Divider sx={{ mb: 2 }} />

            <Typography variant="body2" color="text.secondary" gutterBottom>
              ¿Necesitas ayuda?
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
              <Link href="mailto:javierfernandezc@gmail.com" underline="hover">
                📧 javierfernandezc@gmail.com
              </Link>

              {status === 'error' && (
                <Typography variant="caption" color="error">
                  Si el problema persiste, incluye el siguiente código al contactar soporte:
                  <br />
                  <code>ERR_SEND_VERIFICATION_{new Date().getTime()}</code>
                </Typography>
              )}
            </Box>
          </Box>
        </Paper>

        {/* Footer */}
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 4 }}>
          © {new Date().getFullYear()} Mutua ASAM. Todos los derechos reservados.
        </Typography>
      </Box>
    </Container>
  )
}
