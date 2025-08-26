import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link as RouterLink } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Link,
  IconButton,
  InputAdornment,
} from '@mui/material'
import {
  Lock as LockIcon,
  CheckCircle as CheckCircleIcon,
  Visibility,
  VisibilityOff,
  Error as ErrorIcon,
} from '@mui/icons-material'
import { useAuthPublic } from '@/hooks/useAuthPublic'
import { resetPasswordSchema, ResetPasswordFormData } from './passwordSchemas'

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { resetPasswordWithToken } = useAuthPublic()

  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState<string>('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Get token from URL
  const token = searchParams.get('token')

  // Form configuration
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setFocus,
  } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  })

  // Check if token exists
  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Token inválido o no proporcionado')
    } else {
      setFocus('newPassword')
    }
  }, [token, setFocus])

  // Handle form submission
  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) return

    setStatus('idle')
    setMessage('')

    const result = await resetPasswordWithToken(token, data.newPassword)

    if (result.success) {
      setStatus('success')
      setMessage(result.message || 'Contraseña restablecida exitosamente')

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } else {
      setStatus('error')
      setMessage(result.message || 'Error al restablecer la contraseña')
    }
  }

  // Toggle password visibility
  const handleTogglePassword = () => {
    setShowPassword(!showPassword)
  }

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  // If no token, show error
  if (!token) {
    return (
      <Container component="main" maxWidth="xs">
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
              Enlace Inválido
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              El enlace de recuperación de contraseña es inválido o ha expirado.
            </Typography>

            <Button component={RouterLink} to="/forgot-password" variant="contained" fullWidth>
              Solicitar nuevo enlace
            </Button>
          </Paper>
        </Box>
      </Container>
    )
  }

  return (
    <Container component="main" maxWidth="xs">
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
              m: 1,
              p: 2,
              bgcolor: status === 'success' ? 'success.light' : 'primary.main',
              borderRadius: '50%',
            }}
          >
            {status === 'success' ? (
              <CheckCircleIcon sx={{ color: 'white' }} />
            ) : (
              <LockIcon sx={{ color: 'white' }} />
            )}
          </Box>

          {/* Title */}
          <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
            Nueva Contraseña
          </Typography>

          {/* Success message */}
          {status === 'success' ? (
            <Box sx={{ width: '100%', textAlign: 'center' }}>
              <Alert severity="success" sx={{ mb: 3 }}>
                {message}
              </Alert>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Serás redirigido al inicio de sesión en unos segundos...
              </Typography>

              <CircularProgress size={24} />
            </Box>
          ) : (
            <>
              {/* Instructions */}
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                Ingresa tu nueva contraseña. Debe tener al menos 6 caracteres e incluir mayúsculas,
                minúsculas y números.
              </Typography>

              {/* Error Alert */}
              {status === 'error' && (
                <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                  {message}
                </Alert>
              )}

              {/* Form */}
              <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
                <TextField
                  {...register('newPassword')}
                  margin="normal"
                  required
                  fullWidth
                  label="Nueva contraseña"
                  type={showPassword ? 'text' : 'password'}
                  id="newPassword"
                  autoComplete="new-password"
                  autoFocus
                  error={!!errors.newPassword}
                  helperText={errors.newPassword?.message}
                  disabled={isSubmitting}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleTogglePassword}
                          edge="end"
                          disabled={isSubmitting}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  {...register('confirmPassword')}
                  margin="normal"
                  required
                  fullWidth
                  label="Confirmar contraseña"
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  autoComplete="new-password"
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  disabled={isSubmitting}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleToggleConfirmPassword}
                          edge="end"
                          disabled={isSubmitting}
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Restablecer contraseña'
                  )}
                </Button>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    ¿Recordaste tu contraseña?{' '}
                    <Link component={RouterLink} to="/login" variant="body2">
                      Iniciar sesión
                    </Link>
                  </Typography>
                </Box>
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
  )
}
