import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  TextField,
  Typography,
} from '@mui/material'
import { useMutation } from '@apollo/client'
import { LOGIN_MUTATION } from '@/graphql/auth'
import { useAuthStore } from '@/stores/authStore'
import { LoginInput } from '@/types'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login: storeLogin } = useAuthStore()
  const [error, setError] = useState('')
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>()
  
  const [loginMutation, { loading }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      storeLogin(data.login)
      navigate('/dashboard')
    },
    onError: (error) => {
      setError(error.message || 'Error al iniciar sesión')
    },
  })

  const onSubmit = async (data: LoginInput) => {
    setError('')
    await loginMutation({
      variables: {
        input: data,
      },
    })
  }

  return (
    <Box>
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            ASAM
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
            Asociación solidaridad y ayudas mutuos
          </Typography>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label="Correo electrónico"
              type="email"
              margin="normal"
              {...register('username', {
                required: 'El correo es requerido',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Correo inválido',
                },
              })}
              error={!!errors.username}
              helperText={errors.username?.message}
              disabled={loading}
            />
            
            <TextField
              fullWidth
              label="Contraseña"
              type="password"
              margin="normal"
              {...register('password', {
                required: 'La contraseña es requerida',
                minLength: {
                  value: 6,
                  message: 'La contraseña debe tener al menos 6 caracteres',
                },
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
              disabled={loading}
            />
            
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}
