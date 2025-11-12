import { useState, useRef } from 'react'
import { Box, Typography } from '@mui/material'
import { UsersTable, UserFormDialog } from '@/features/users'
import type { User } from '@/graphql/generated/operations'
import { useTranslation } from 'react-i18next'
import { useSnackbar } from 'notistack'

export default function UsersPage() {
  const { t } = useTranslation('users')
  const { enqueueSnackbar } = useSnackbar()
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const refetchUsers = useRef<(() => void) | null>(null)

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setOpenDialog(true)
  }

  const handleAddUser = () => {
    setSelectedUser(null)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedUser(null)
  }

  const handleSuccess = () => {
    const message = selectedUser
      ? t('form.success.updated')
      : t('form.success.created')
    enqueueSnackbar(message, { variant: 'success' })

    // Refetch the users list
    if (refetchUsers.current) {
      refetchUsers.current()
    }
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('title')}
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        {t('subtitle')}
      </Typography>

      <Box
        sx={{
          mt: 3,
          height: 'calc(100vh - 280px)',
          minHeight: 400,
          width: '100%',
          mb: 3
        }}
      >
        <UsersTable
          onEditUser={handleEditUser}
          onAddUser={handleAddUser}
          onRefetchReady={(refetch) => { refetchUsers.current = refetch }}
        />
      </Box>

      <UserFormDialog
        open={openDialog}
        onClose={handleCloseDialog}
        user={selectedUser}
        onSuccess={handleSuccess}
      />
    </Box>
  )
}
