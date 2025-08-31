import { Box, Typography } from '@mui/material'
import { UsersTable } from '@/features/users/components/UsersTable'
import type { User } from '@/graphql/generated/operations'
import { useTranslation } from 'react-i18next'

export default function UsersPage() {
  const { t } = useTranslation('users')
  
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
        {t('title')}
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        {t('subtitle')}
      </Typography>
      
      <Box sx={{ mt: 3 }}>
        <UsersTable onEditUser={handleEditUser} onAddUser={handleAddUser} />
      </Box>
    </Box>
  )
}
