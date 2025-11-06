import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link as RouterLink } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useTranslation } from 'react-i18next'
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
import { useAuth } from '@/hooks/useAuth'
import { resetPasswordSchema, ResetPasswordFormData } from './passwordSchemas'

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { resetPasswordWithToken } = useAuth()
  const { t } = useTranslation('auth')

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
      setMessage(t('resetPassword.invalidToken'))
    } else {
      setFocus('newPassword')
    }
  }, [token, setFocus, t])

  // Handle form submission
  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) return

    setStatus('idle')
    setMessage('')

    const result = await resetPasswordWithToken(token, data.newPassword)

    if (result.success) {
      setStatus('success')
      const successMessage = result.message || t('resetPassword.successMessage')
      setMessage(successMessage)

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } else {
      setStatus('error')
      const errorMessage = result.message || t('resetPassword.errorMessage')
      setMessage(errorMessage)
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
              {t('resetPassword.invalidLinkTitle')}
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              {t('resetPassword.invalidLinkMessage')}
            </Typography>

            <Button component={RouterLink} to="/forgot-password" variant="contained" fullWidth>
              {t('resetPassword.requestNewLink')}
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
            {t('resetPassword.title')}
          </Typography>

          {/* Success message */}
          {status === 'success' ? (
            <Box sx={{ width: '100%', textAlign: 'center' }}>
              <Alert severity="success" sx={{ mb: 3 }}>
                {message}
              </Alert>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {t('resetPassword.redirectMessage')}
              </Typography>

              <CircularProgress size={24} />
            </Box>
          ) : (
            <>
              {/* Instructions */}
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                {t('resetPassword.instructions')}
              </Typography>

              {/* Error Alert */}
              {status === 'error' && (
                <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                  {message}
                </Alert>
              )}

              {/* Form */}
              <Box component="form" onSubmit={(...args) => void handleSubmit(onSubmit)(...args)} sx={{ width: '100%' }}>
                <TextField
                  {...register('newPassword')}
                  margin="normal"
                  required
                  fullWidth
                  label={t('resetPassword.newPassword')}
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
                  label={t('resetPassword.confirmPassword')}
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
                    t('resetPassword.submit')
                  )}
                </Button>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    {t('resetPassword.rememberPassword')}{' '}
                    <Link component={RouterLink} to="/login" variant="body2">
                      {t('resetPassword.loginLink')}
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </>
          )}
        </Paper>

        {/* Footer */}
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 4 }}>
          {t('common.footer', { year: new Date().getFullYear() })}
        </Typography>
      </Box>
    </Container>
  )
}
