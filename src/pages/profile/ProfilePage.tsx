import React, { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Alert,
  Divider,
  Chip,
  Avatar,
} from '@mui/material'
import {
  AccountCircle as AccountIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
  CalendarToday as CalendarIcon,
  Lock as LockIcon,
  VerifiedUser as VerifiedIcon,
} from '@mui/icons-material'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useAuth } from '@/hooks/useAuth'

// Validation schema for password change
const passwordSchema = yup.object({
  currentPassword: yup.string().required('La contraseña actual es requerida'),
  newPassword: yup
    .string()
    .required('La nueva contraseña es requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'La contraseña debe contener mayúsculas, minúsculas, números y caracteres especiales'
    ),
  confirmPassword: yup
    .string()
    .required('Confirma la nueva contraseña')
    .oneOf([yup.ref('newPassword')], 'Las contraseñas no coinciden'),
})

type PasswordFormData = yup.InferType<typeof passwordSchema>

export const ProfilePage: React.FC = () => {
  const { user, changePassword } = useAuth()
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormData>({
    resolver: yupResolver(passwordSchema),
  })

  const onSubmit = async (data: PasswordFormData) => {
    try {
      setSuccessMessage('')
      setErrorMessage('')

      const result = await changePassword(data.currentPassword, data.newPassword)

      if (result.success) {
        setSuccessMessage(result.message || 'Contraseña actualizada exitosamente')
        reset()
      } else {
        setErrorMessage(result.message || 'Error al cambiar la contraseña')
      }
    } catch {
      setErrorMessage('Error inesperado al cambiar la contraseña')
    }
  }

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getUserInitials = () => {
    if (!user?.username) return '?'
    return user.username.substring(0, 2).toUpperCase()
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Mi Perfil
      </Typography>

      <Grid container spacing={3}>
        {/* User Information Card */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={3}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: 'primary.main',
                    fontSize: 32,
                  }}
                >
                  {getUserInitials()}
                </Avatar>
                <Box ml={2}>
                  <Typography variant="h5">{user?.username}</Typography>
                  <Chip label={user?.role} color="primary" size="small" sx={{ mt: 1 }} />
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box>
                <Box display="flex" alignItems="center" mb={2}>
                  <AccountIcon sx={{ mr: 2, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Nombre de usuario
                    </Typography>
                    <Typography variant="body1">{user?.username}</Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" mb={2}>
                  <EmailIcon sx={{ mr: 2, color: 'text.secondary' }} />
                  <Box flex={1}>
                    <Typography variant="body2" color="text.secondary">
                      Email
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="body1">{user?.email || 'No disponible'}</Typography>
                      {user?.emailVerified ? (
                        <Chip
                          icon={<VerifiedIcon />}
                          label="Verificado"
                          color="success"
                          size="small"
                        />
                      ) : (
                        <Chip label="No verificado" color="warning" size="small" />
                      )}
                    </Box>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" mb={2}>
                  <BadgeIcon sx={{ mr: 2, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Rol
                    </Typography>
                    <Typography variant="body1">{user?.role}</Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center">
                  <CalendarIcon sx={{ mr: 2, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Último acceso
                    </Typography>
                    <Typography variant="body1">{formatDate(user?.lastLogin)}</Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Change Password Card */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={3}>
                <LockIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Cambiar Contraseña</Typography>
              </Box>

              {successMessage && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {successMessage}
                </Alert>
              )}

              {errorMessage && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {errorMessage}
                </Alert>
              )}

              <form onSubmit={(...args) => void handleSubmit(onSubmit)(...args)}>
                <TextField
                  fullWidth
                  type="password"
                  label="Contraseña Actual"
                  {...register('currentPassword')}
                  error={!!errors.currentPassword}
                  helperText={errors.currentPassword?.message}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  type="password"
                  label="Nueva Contraseña"
                  {...register('newPassword')}
                  error={!!errors.newPassword}
                  helperText={errors.newPassword?.message}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  type="password"
                  label="Confirmar Nueva Contraseña"
                  {...register('confirmPassword')}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  sx={{ mb: 3 }}
                />

                <Button type="submit" variant="contained" fullWidth disabled={isSubmitting}>
                  {isSubmitting ? 'Actualizando...' : 'Actualizar Contraseña'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default ProfilePage
