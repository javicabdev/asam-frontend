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
  PersonOff as PersonOffIcon,
  PersonAddAlt as PersonAddAltIcon,
} from '@mui/icons-material'
import { useQuery, useMutation } from '@apollo/client'
import { LIST_USERS, DELETE_USER, UPDATE_USER } from '../api/userQueries'
import { useAuthStore } from '@/stores/authStore'
import type { User, UserRole } from '@/graphql/generated/operations'
import { useTranslation } from 'react-i18next'
import { useSnackbar } from 'notistack'

interface UsersTableProps {
  onEditUser: (user: User) => void
  onAddUser: () => void
  onRefetchReady?: (refetch: () => void) => void
}

interface ListUsersResponse {
  listUsers: {
    nodes: User[]
    pageInfo: {
      totalCount: number
      hasNextPage: boolean
      hasPreviousPage: boolean
    }
  }
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
  const { enqueueSnackbar } = useSnackbar()
  const [tabValue, setTabValue] = useState<UserRole>('admin')

  const currentUser = useAuthStore((state) => state.user)

  // Query for users with server-side pagination
  // Note: Getting all users since backend doesn't support role filtering yet
  const { data, loading, error, refetch } = useQuery<ListUsersResponse>(LIST_USERS, {
    variables: {
      page: 1,
      pageSize: 1000, // Get all users to filter client-side by role
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
    onCompleted: (data) => {
      if (data.deleteUser.success) {
        enqueueSnackbar(
          data.deleteUser.message || t('table.actions.deleteSuccess', 'Usuario eliminado correctamente'),
          { variant: 'success' }
        )
        void refetch()
      } else {
        enqueueSnackbar(
          data.deleteUser.error || t('table.actions.deleteError', 'Error al eliminar usuario'),
          { variant: 'error' }
        )
      }
    },
    onError: (error) => {
      console.error('Error deleting user:', error)
      enqueueSnackbar(
        error.message || t('table.actions.deleteError', 'Error al eliminar usuario'),
        { variant: 'error' }
      )
    },
  })

  // Toggle active status mutation
  const [toggleUserStatus, { loading: toggleLoading }] = useMutation(UPDATE_USER, {
    onCompleted: (data) => {
      const isActive = data.updateUser.isActive
      enqueueSnackbar(
        isActive
          ? t('table.actions.activateSuccess', 'Usuario activado correctamente')
          : t('table.actions.deactivateSuccess', 'Usuario desactivado correctamente'),
        { variant: 'success' }
      )
      void refetch()
    },
    onError: (error) => {
      console.error('Error toggling user status:', error)
      enqueueSnackbar(
        error.message || t('table.actions.statusError', 'Error al cambiar el estado del usuario'),
        { variant: 'error' }
      )
    },
  })

  // Get users and filter by role and exclude "javi" admin
  const users = useMemo(() => {
    if (!data?.listUsers?.nodes) return []

    return data.listUsers.nodes.filter((user) => {
      // Filter out admin user "javi"
      if (user.role === 'admin' && user.username.toLowerCase() === 'javi') {
        return false
      }

      // Filter by selected role tab
      return user.role === tabValue
    })
  }, [data, tabValue])

  // Get total count from pageInfo (will be the count for all roles)
  // Note: This shows total users, not filtered by role. Backend would need to support role filter for accurate count.


  const handleDelete = (userId: string) => {
    if (window.confirm(t('table.actions.deleteConfirm'))) {
      void deleteUser({ variables: { id: userId } })
    }
  }

  const handleToggleStatus = (user: User) => {
    const confirmMessage = user.isActive
      ? t('table.actions.deactivateConfirm', `¿Estás seguro de que deseas desactivar este usuario?`)
      : t('table.actions.activateConfirm', `¿Estás seguro de que deseas activar este usuario?`)

    if (window.confirm(confirmMessage)) {
      void toggleUserStatus({
        variables: {
          input: {
            id: user.id,
            isActive: !user.isActive,
          },
        },
      })
    }
  }

  const canDeleteUser = (user: User) => {
    // Cannot delete yourself
    if (currentUser?.id === user.id) return false
    // Cannot delete admin "javi"
    return !(user.role === 'admin' && user.username.toLowerCase() === 'javi')
  }

  const canToggleStatus = (user: User) => {
    // Cannot deactivate yourself
    if (currentUser?.id === user.id) return false
    // Cannot deactivate admin "javi"
    return !(user.role === 'admin' && user.username.toLowerCase() === 'javi')
  }

  // Custom locale text for DataGrid
  const customLocaleText = useMemo(() => ({
    ...esES.components.MuiDataGrid.defaultProps.localeText,
    toolbarColumns: t('table.toolbar.columns'),
    toolbarFilters: t('table.toolbar.filters'),
    toolbarDensity: t('table.toolbar.density'),
    toolbarQuickFilterPlaceholder: t('table.toolbar.search'),
    // Filter operators
    filterOperatorContains: t('table.filterOperators.contains'),
    filterOperatorEquals: t('table.filterOperators.equals'),
    filterOperatorStartsWith: t('table.filterOperators.startsWith'),
    filterOperatorEndsWith: t('table.filterOperators.endsWith'),
    filterOperatorIsEmpty: t('table.filterOperators.isEmpty'),
    filterOperatorIsNotEmpty: t('table.filterOperators.isNotEmpty'),
    filterOperatorIsAnyOf: t('table.filterOperators.isAnyOf'),
    // Filter panel
    filterPanelColumns: t('table.filterPanel.columns'),
    filterPanelOperator: t('table.filterPanel.operator'),
    filterPanelInputLabel: t('table.filterPanel.value'),
    filterPanelInputPlaceholder: t('table.filterPanel.filterValue'),
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
        width: 170,
        sortable: true,
        renderCell: (params) =>
          params.value ? (
            <Typography variant="body2">
              {new Date(params.value).toLocaleString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
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
        width: 160,
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
                !canToggleStatus(params.row)
                  ? params.row.id === currentUser?.id
                    ? t('table.actions.cannotToggleSelf', 'No puedes cambiar tu propio estado')
                    : t('table.actions.cannotToggle', 'No se puede cambiar el estado de este usuario')
                  : params.row.isActive
                    ? t('table.actions.deactivate', 'Desactivar')
                    : t('table.actions.activate', 'Activar')
              }
            >
              <span>
                <IconButton
                  size="small"
                  onClick={() => handleToggleStatus(params.row)}
                  disabled={!canToggleStatus(params.row) || toggleLoading}
                  color={params.row.isActive ? 'warning' : 'success'}
                >
                  {params.row.isActive ? (
                    <PersonOffIcon fontSize="small" />
                  ) : (
                    <PersonAddAltIcon fontSize="small" />
                  )}
                </IconButton>
              </span>
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
    [t, tabValue, currentUser, deleteLoading, toggleLoading, onEditUser]
  )

  if (error) {
    return (
      <Alert severity="error">
        {t('table.error', { message: error.message })}
      </Alert>
    )
  }

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
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
        rows={users}
        columns={columns}
        loading={loading}
        pageSizeOptions={[10, 25, 50, 100]}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 25 },
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
        density="comfortable"
        disableRowSelectionOnClick
        sx={{
          height: '100%',
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
