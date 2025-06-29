import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Email as EmailIcon,
  Home as HomeIcon,
  Login as LoginIcon,
} from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/authStore';

export const VerifyEmailPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { verifyEmail } = useAuth();
  const { isAuthenticated } = useAuthStore();
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('');
  
  // Get token from URL
  const token = searchParams.get('token');

  // Verify email on mount
  useEffect(() => {
    const performVerification = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Token de verificación no proporcionado');
        return;
      }

      const result = await verifyEmail(token);
      
      if (result.success) {
        setStatus('success');
        setMessage(result.message || 'Email verificado exitosamente');
      } else {
        setStatus('error');
        setMessage(result.message || 'Error al verificar el email');
      }
    };

    performVerification();
  }, [token, verifyEmail]);

  // Handle navigation based on auth status
  const handleContinue = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
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
            textAlign: 'center',
          }}
        >
          {/* Loading state */}
          {status === 'loading' && (
            <>
              <CircularProgress size={64} sx={{ mb: 3 }} />
              <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
                Verificando Email
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Por favor espera mientras verificamos tu dirección de correo electrónico...
              </Typography>
            </>
          )}

          {/* Success state */}
          {status === 'success' && (
            <>
              <Box
                sx={{
                  m: 2,
                  p: 3,
                  bgcolor: 'success.light',
                  borderRadius: '50%',
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 48, color: 'success.dark' }} />
              </Box>

              <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
                ¡Email Verificado!
              </Typography>

              <Alert severity="success" sx={{ width: '100%', mb: 3 }}>
                {message}
              </Alert>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Tu cuenta ha sido verificada exitosamente. Ya puedes acceder a todas las funcionalidades del sistema.
              </Typography>

              <Button
                variant="contained"
                fullWidth
                size="large"
                startIcon={isAuthenticated ? <HomeIcon /> : <LoginIcon />}
                onClick={handleContinue}
              >
                {isAuthenticated ? 'Ir al Dashboard' : 'Iniciar Sesión'}
              </Button>
            </>
          )}

          {/* Error state */}
          {status === 'error' && (
            <>
              <Box
                sx={{
                  m: 2,
                  p: 3,
                  bgcolor: 'error.light',
                  borderRadius: '50%',
                }}
              >
                <ErrorIcon sx={{ fontSize: 48, color: 'error.dark' }} />
              </Box>

              <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
                Error de Verificación
              </Typography>

              <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
                {message}
              </Alert>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                No pudimos verificar tu email. El enlace puede haber expirado o ser inválido.
              </Typography>

              <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                {isAuthenticated ? (
                  <>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<EmailIcon />}
                      onClick={() => navigate('/email-verification-pending')}
                    >
                      Solicitar Nuevo Email
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<HomeIcon />}
                      onClick={() => navigate('/dashboard')}
                    >
                      Ir al Dashboard
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<LoginIcon />}
                    onClick={() => navigate('/login')}
                  >
                    Ir a Iniciar Sesión
                  </Button>
                )}
              </Box>
            </>
          )}
        </Paper>

        {/* Footer */}
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 4 }}>
          © {new Date().getFullYear()} Mutua ASAM. Todos los derechos reservados.
        </Typography>
      </Box>
    </Container>
  );
};
