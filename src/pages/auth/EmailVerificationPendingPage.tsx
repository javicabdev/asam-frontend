import React, { useState } from 'react';
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
} from '@mui/material';
import {
  Email as EmailIcon,
  CheckCircle as CheckCircleIcon,
  Refresh as RefreshIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/authStore';

export const EmailVerificationPendingPage: React.FC = () => {
  const { user } = useAuthStore();
  const { sendVerificationEmail, logout } = useAuth();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');
  const [cooldown, setCooldown] = useState(false);

  // Handle resend verification email
  const handleResendEmail = async () => {
    if (cooldown) return;

    setStatus('loading');
    setMessage('');
    
    const result = await sendVerificationEmail();
    
    if (result.success) {
      setStatus('success');
      setMessage(result.message || 'Email de verificación enviado exitosamente');
      
      // Set cooldown to prevent spam
      setCooldown(true);
      setTimeout(() => {
        setCooldown(false);
        setStatus('idle');
      }, 60000); // 1 minute cooldown
    } else {
      setStatus('error');
      setMessage(result.message || 'Error al enviar el email de verificación');
    }
  };

  // Handle logout
  const handleLogout = async () => {
    await logout();
  };

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
              bgcolor: status === 'success' ? 'success.light' : 'warning.light',
              borderRadius: '50%',
            }}
          >
            {status === 'success' ? (
              <CheckCircleIcon sx={{ fontSize: 48, color: 'success.dark' }} />
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
            Tu cuenta está casi lista. Por favor, verifica tu dirección de correo electrónico 
            para acceder a todas las funcionalidades del sistema.
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
            <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
              {message}
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
              startIcon={status === 'loading' ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon />}
              onClick={handleResendEmail}
              disabled={status === 'loading' || cooldown}
            >
              {status === 'loading' 
                ? 'Enviando...' 
                : cooldown 
                  ? 'Espera un momento antes de reenviar'
                  : 'Reenviar Email de Verificación'
              }
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

          {/* Help text */}
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              ¿Necesitas ayuda?{' '}
              <Link href="mailto:soporte@mutuaasam.org" underline="hover">
                Contacta con soporte
              </Link>
            </Typography>
          </Box>
        </Paper>

        {/* Footer */}
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 4 }}>
          © {new Date().getFullYear()} Mutua ASAM. Todos los derechos reservados.
        </Typography>
      </Box>
    </Container>
  );
};
