import React, { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
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
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  Email as EmailIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material'
import { useAuth } from '@/hooks/useAuth'
import { requestPasswordResetSchema, RequestPasswordResetFormData } from './passwordSchemas'

export const RequestPasswordResetPage: React.FC = () => {
  const { requestPasswordReset } = useAuth()
  const { t } = useTranslation('auth')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState<string>('')

  // Form configuration
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setFocus,
    reset,
  } = useForm<RequestPasswordResetFormData>({
    resolver: yupResolver(requestPasswordResetSchema),
    defaultValues: {
      email: '',
    },
  })

  // Focus on email field on mount
  React.useEffect(() => {
    setFocus('email')
  }, [setFocus])

  // Handle form submission
  const onSubmit = async (data: RequestPasswordResetFormData) => {
    setStatus('idle')
    setMessage('')

    const result = await requestPasswordReset(data.email)

    if (result.success) {
      setStatus('success')
      const successMessage = result.message || t('forgotPassword.successMessage')
      setMessage(successMessage)
      reset()
    } else {
      setStatus('error')
      const errorMessage = result.message || t('forgotPassword.errorMessage')
      setMessage(errorMessage)
    }
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
          {/* Back button */}
          <Box sx={{ width: '100%', mb: 2 }}>
            <IconButton component={RouterLink} to="/login" size="small" sx={{ ml: -1 }}>
              <ArrowBackIcon />
            </IconButton>
          </Box>

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
              <EmailIcon sx={{ color: 'white' }} />
            )}
          </Box>

          {/* Title */}
          <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
            {t('forgotPassword.title')}
          </Typography>

          {/* Success message */}
          {status === 'success' ? (
            <Box sx={{ width: '100%', textAlign: 'center' }}>
              <Alert severity="success" sx={{ mb: 3 }}>
                {message}
              </Alert>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {t('forgotPassword.successDescription')}
              </Typography>

              <Button component={RouterLink} to="/login" variant="contained" fullWidth>
                {t('forgotPassword.backToLogin')}
              </Button>
            </Box>
          ) : (
            <>
              {/* Instructions */}
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                {t('forgotPassword.instructions')}
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
                  {...register('email')}
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label={t('forgotPassword.email')}
                  autoComplete="email"
                  autoFocus
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  disabled={isSubmitting}
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
                    t('forgotPassword.submit')
                  )}
                </Button>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    {t('forgotPassword.rememberPassword')}{' '}
                    <Link component={RouterLink} to="/login" variant="body2">
                      {t('forgotPassword.loginLink')}
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
