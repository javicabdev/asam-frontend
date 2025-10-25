import { Alert, Box, Chip } from '@mui/material'
import { useAuth } from '@/hooks/useAuth'

/**
 * Componente temporal de debug para mostrar el rol del usuario
 * IMPORTANTE: Eliminar en producción
 */
export const UserRoleDebug: React.FC = () => {
  const { user } = useAuth()

  if (!user) return null

  const isAdmin = user.role === 'admin'

  return (
    <Box sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 9999 }}>
      <Alert severity={isAdmin ? 'success' : 'warning'} sx={{ alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <strong>Usuario:</strong> {user.username}
          <Chip
            label={user.role}
            color={isAdmin ? 'success' : 'warning'}
            size="small"
            sx={{ ml: 1 }}
          />
        </Box>
      </Alert>
    </Box>
  )
}
