import React, { useState, useMemo } from 'react'
import {
  Box,
  Paper,
  IconButton,
  Chip,
  Tab,
  Tabs,
  Typography,
  Tooltip,
  Button,
  Alert,
  useTheme,
} from '@mui/material'
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
  esES,
} from '@mui/x-data-grid'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  PersonAdd as PersonAddIcon,
  AdminPanelSettings as AdminIcon,
  Person as UserIcon,
} from '@mui/icons-material'
import { useQuery, useMutation } from '@apollo/client'
import { LIST_USERS, DELETE_USER } from '../api/userQueries'
import { useAuthStore } from '@/stores/authStore'
import type { User, UserRole } from '@/graphql/generated/operations'
import { useTranslation } from 'react-i18next'

interface UsersTableProps {
  onEditUser: (user: User) => void
  onAddUser: () => void
  onRefetchReady?: (refetch: () => void) => void
}

interface ListUsersResponse {
  listUsers: User[]
}

interface DeleteUserResponse {
  deleteUser: {
    success: boolean
    message?: string | null
    error?: string | null
  }
}

// Custom Toolbar component
function CustomToolbar({ onAddUser }: { onAddUser: () => void }) {
  const { t } = useTranslation('users')

  return (
    <GridToolbarContainer sx={{ justifyContent: 'space-between' }}>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
      </Box>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <GridToolbarQuickFilter debounceMs={500} />
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={onAddUser}
          size="small"
        >
          {t('table.addButton')}
        </Button>
      </Box>
    </GridToolbarContainer>
  )
}

export const UsersTable: React.FC<UsersTableProps> = ({ onEditUser, onAddUser, onRefetchReady }) => {
  const { t } = useTranslation('users')
  const theme = useTheme()
  const [tabValue, setTabValue] = useState<UserRole>('admin')

  const currentUser = useAuthStore((state) => state.user)

  // Query for users
  const { data, loading, error, refetch } = useQuery<ListUsersResponse>(LIST_USERS, {
    variables: {
      page: page + 1,
      pageSize: 100, // Get all users, we'll filter client-side
    },
  })

  // Expose refetch function to parent component
  React.useEffect(() => {
    if (onRefetchReady && refetch) {
      onRefetchReady(() => void refetch())
    }
  }, [onRefetchReady, refetch])

  // Delete mutation
  const [deleteUser, { loading: deleteLoading }] = useMutation<DeleteUserResponse>(DELETE_USER, {
    onCompleted: () => {
      void refetch()
    },
    onError: (error) => {
      console.error('Error deleting user:', error)
    },
  })

  // Filter users by role (tab), excluding "javi" admin
  const filteredUsers = useMemo(() => {
    if (!data?.listUsers) return []

    return data.listUsers.filter((user) => {
      // Filter out admin user "javi"
      if (user.role === 'admin' && user.username.toLowerCase() === 'javi') {
        return false
      }

      // Filter by role (tab)
      return user.role === tabValue
    })
  }, [data, tabValue])

  const handleDelete = (userId: string) => {
    if (window.confirm(t('table.actions.deleteConfirm'))) {
      void deleteUser({ variables: { id: userId } })
    }
  }

  const canDeleteUser = (user: User) => {
    // Cannot delete yourself
    if (currentUser?.id === user.id) return false
    // Cannot delete admin "javi"
    return !(user.role === 'admin' && user.username.toLowerCase() === 'javi')
  }

  // Custom locale text for DataGrid
  const customLocaleText = useMemo(() => ({
    ...esES.components.MuiDataGrid.defaultProps.localeText,
    toolbarColumns: t('table.toolbar.columns'),
    toolbarFilters: t('table.toolbar.filters'),
    toolbarDensity: t('table.toolbar.density'),
    toolbarQuickFilterPlaceholder: t('table.toolbar.search'),
    MuiTablePagination: {
      labelRowsPerPage: t('table.pagination.rowsPerPage'),
      labelDisplayedRows: ({ from, to, count }: { from: number; to: number; count: number }) =>
        t('table.pagination.displayedRows', { from, to, count: count !== -1 ? count : to }),
    },
  }), [t])

  // Column definitions
  const columns: GridColDef<User>[] = useMemo(
    () => [
      {
        field: 'username',
        headerName: t('table.columns.username'),
        width: 150,
        sortable: true,
      },
      {
        field: 'email',
        headerName: t('table.columns.email'),
        width: 220,
        sortable: true,
      },
      {
        field: 'role',
        headerName: t('table.columns.role'),
        width: 130,
        sortable: true,
        renderCell: (params) => (
          <Chip
            label={params.value === 'admin' ? t('table.roles.admin') : t('table.roles.user')}
            color={params.value === 'admin' ? 'warning' : 'default'}
            size="small"
            icon={params.value === 'admin' ? <AdminIcon /> : <UserIcon />}
          />
        ),
      },
      ...(tabValue === 'user'
        ? [
            {
              field: 'member',
              headerName: t('table.columns.associatedMember'),
              width: 250,
              sortable: false,
              renderCell: (params: any) =>
                params.value ? (
                  <Box>
                    <Typography variant="body2">
                      {params.value.nombre} {params.value.apellidos}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t('table.memberStatus.memberNumber')} {params.value.numero_socio}
                    </Typography>
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    {t('table.memberStatus.notAssociated')}
                  </Typography>
                ),
            } as GridColDef<User>,
          ]
        : []),
      {
        field: 'isActive',
        headerName: t('table.columns.status'),
        width: 120,
        sortable: true,
        renderCell: (params) => (
          <Chip
            label={params.value ? t('table.status.active') : t('table.status.inactive')}
            color={params.value ? 'success' : 'default'}
            size="small"
            variant={params.value ? 'filled' : 'outlined'}
          />
        ),
      },
      {
        field: 'emailVerified',
        headerName: t('table.columns.emailVerified'),
        width: 140,
        sortable: true,
        renderCell: (params) => (
          <Chip
            label={params.value ? t('table.emailStatus.verified') : t('table.emailStatus.pending')}
            color={params.value ? 'success' : 'warning'}
            size="small"
            variant="outlined"
          />
        ),
      },
      {
        field: 'lastLogin',
        headerName: t('table.columns.lastLogin'),
        width: 140,
        sortable: true,
        renderCell: (params) =>
          params.value ? (
            <Typography variant="body2">
              {new Date(params.value).toLocaleDateString('es-ES')}
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary">
              {t('table.lastLoginStatus.never')}
            </Typography>
          ),
      },
      {
        field: 'actions',
        headerName: t('table.columns.actions'),
        width: 120,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params) => (
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title={t('table.actions.edit')}>
              <IconButton size="small" onClick={() => onEditUser(params.row)} color="primary">
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip
              title={
                canDeleteUser(params.row)
                  ? t('table.actions.delete')
                  : params.row.id === currentUser?.id
                  ? t('table.actions.cannotDeleteSelf')
                  : t('table.actions.cannotDelete')
              }
            >
              <span>
                <IconButton
                  size="small"
                  onClick={() => handleDelete(params.row.id)}
                  disabled={!canDeleteUser(params.row) || deleteLoading}
                  color="error"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [t, tabValue, currentUser, deleteLoading, onEditUser]
  )

  if (error) {
    return (
      <Alert severity="error">
        {t('table.error', { message: error.message })}
      </Alert>
    )
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Tabs para filtrar por rol */}
      <Paper sx={{ mb: 2 }}>
        <Tabs value={tabValue} onChange={(_, value) => setTabValue(value as UserRole)}>
          <Tab
            icon={<AdminIcon />}
            label={t('table.tabs.admins')}
            value={'admin' as UserRole}
            iconPosition="start"
          />
          <Tab
            icon={<UserIcon />}
            label={t('table.tabs.users')}
            value={'user' as UserRole}
            iconPosition="start"
          />
        </Tabs>
      </Paper>

      {/* DataGrid con toolbar */}
      <DataGrid
        rows={filteredUsers}
        columns={columns}
        loading={loading}
        pageSizeOptions={[10, 25, 50, 100]}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10 },
          },
        }}
        slots={{
          toolbar: CustomToolbar,
        }}
        slotProps={{
          toolbar: {
            onAddUser,
          },
        }}
        localeText={customLocaleText}
        autoHeight
        density="comfortable"
        disableRowSelectionOnClick
        sx={{
          '& .MuiDataGrid-row': {
            cursor: 'default',
          },
          // Header styling
          '& .MuiDataGrid-columnHeader': {
            backgroundColor:
              theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
            fontWeight: 'bold',
            borderBottom: `1px solid ${theme.palette.divider}`,
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 600,
          },
          // Cell styling
          '& .MuiDataGrid-cell': {
            borderBottom: `1px solid ${theme.palette.divider}`,
          },
          // Footer styling
          '& .MuiDataGrid-footerContainer': {
            backgroundColor:
              theme.palette.mode === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
            borderTop: `1px solid ${theme.palette.divider}`,
          },
        }}
      />
    </Box>
  )
}
