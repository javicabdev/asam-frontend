import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
  Link,
  Divider,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  LockOutlined as LockIcon,
} from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import { createLoginSchema, LoginFormData } from './loginSchema';
import { LanguageSelector } from '@/components/LanguageSelector';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation('auth');
  const { login, isAuthenticated, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get the redirect location from state
  const from = location.state?.from?.pathname || '/dashboard';

  // Create the validation schema with current translations
  const validationSchema = useMemo(() => createLoginSchema(t), [t, i18n.language]);

  // Form configuration
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setFocus,
  } = useForm<LoginFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // Focus on username field on mount
  useEffect(() => {
    setFocus('username');
  }, [setFocus]);

  // Handle form submission
  const onSubmit = async (data: LoginFormData) => {
    setError(null);

    const result = await login(data.username, data.password);

    if (!result.success) {
      // Try to use a specific error translation if available
      const errorKey = result.error?.replace(/\s+/g, '').toLowerCase();
      const translationKey = `login.errors.${errorKey}`;
      const translatedError = t(translationKey);
      
      // If translation exists, use it, otherwise use the original error or generic
      setError(
        translatedError !== translationKey 
          ? translatedError 
          : result.error || t('login.errors.generic')
      );
      
      // Focus on username field after error
      setFocus('username');
    }
  };

  // Toggle password visibility
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
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
            position: 'relative',
          }}
        >
          {/* Language Selector */}
          <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
            <LanguageSelector variant="chip" size="small" />
          </Box>

          {/* Logo/Icon */}
          <Box
            sx={{
              m: 1,
              p: 2,
              bgcolor: 'primary.main',
              borderRadius: '50%',
            }}
          >
            <LockIcon sx={{ color: 'white' }} />
          </Box>

          {/* Title */}
          <Typography component="h1" variant="h5" sx={{ mb: 1 }}>
            {t('login.title')}
          </Typography>
          
          {/* Subtitle */}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {t('login.subtitle')}
          </Typography>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ width: '100%' }}
          >
            <TextField
              {...register('username')}
              margin="normal"
              required
              fullWidth
              id="username"
              label={t('login.username')}
              autoComplete="username"
              autoFocus
              error={!!errors.username}
              helperText={errors.username?.message}
              disabled={isSubmitting}
            />

            <TextField
              {...register('password')}
              margin="normal"
              required
              fullWidth
              label={t('login.password')}
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              error={!!errors.password}
              helperText={errors.password?.message}
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
                t('login.submit')
              )}
            </Button>

            <Divider sx={{ my: 2 }}>{t('common:or', { defaultValue: 'O' })}</Divider>

            {/* Links */}
            <Box sx={{ textAlign: 'center' }}>
              <Link
                component={RouterLink}
                to="/forgot-password"
                variant="body2"
                sx={{ display: 'block', mb: 1 }}
              >
                {t('login.forgotPassword')}
              </Link>
              
              <Typography variant="body2" color="text.secondary">
                {t('login.noAccount')}{' '}
                <Link component={RouterLink} to="/contact" variant="body2">
                  {t('login.contactUs')}
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Footer */}
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 4 }}>
          © {new Date().getFullYear()} Mutua ASAM. {t('common:footer.rights', { defaultValue: 'Todos los derechos reservados.' })}
        </Typography>
      </Box>
    </Container>
  );
};
