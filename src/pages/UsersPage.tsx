import { Box, Typography } from '@mui/material'
import { UsersTable } from '@/features/users/components/UsersTable'
import type { User } from '@/graphql/generated/operations'

export default function UsersPage() {
  const handleEditUser = (user: User) => {
    // TODO: Implement edit user dialog
    console.log('Edit user:', user)
  }

  const handleAddUser = () => {
    // TODO: Implement add user dialog
    console.log('Add new user')
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Gestión de Usuarios
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Administra los usuarios del sistema, tanto administradores como miembros de la asociación.
      </Typography>
      
      <Box sx={{ mt: 3 }}>
        <UsersTable onEditUser={handleEditUser} onAddUser={handleAddUser} />
      </Box>
    </Box>
  )
}
