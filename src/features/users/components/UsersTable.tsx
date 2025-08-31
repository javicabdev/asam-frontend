import React, { useState, useMemo } from 'react'
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Tab,
  Tabs,
  Typography,
  Skeleton,
  Tooltip,
  TextField,
  InputAdornment,
  Button,
  Alert,
} from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  PersonAdd as PersonAddIcon,
  AdminPanelSettings as AdminIcon,
  Person as UserIcon,
} from '@mui/icons-material'
import { useQuery, useMutation } from '@apollo/client'
import { LIST_USERS, DELETE_USER } from '../api/userQueries'
import { useAuthStore } from '@/stores/authStore'
import type { User, UserRole } from '@/graphql/generated/operations'

interface UsersTableProps {
  onEditUser: (user: User) => void
  onAddUser: () => void
}

interface UserWithMember extends User {
  member?: {
    miembro_id: string
    nombre: string
    apellidos: string
    numero_socio: string
  } | null
}

interface ListUsersResponse {
  listUsers: UserWithMember[]
}

interface DeleteUserResponse {
  deleteUser: {
    success: boolean
    message?: string | null
    error?: string | null
  }
}

export const UsersTable: React.FC<UsersTableProps> = ({ onEditUser, onAddUser }) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [tabValue, setTabValue] = useState<UserRole>('admin')
  const [searchTerm, setSearchTerm] = useState('')
  
  const currentUser = useAuthStore((state) => state.user)
  
  // Query for users
  const { data, loading, error, refetch } = useQuery<ListUsersResponse>(LIST_USERS, {
    variables: {
      page: page + 1,
      pageSize: 100, // Get all users, we'll filter client-side
    },
  })

  // Delete mutation
  const [deleteUser, { loading: deleteLoading }] = useMutation<DeleteUserResponse>(DELETE_USER, {
    onCompleted: () => {
      void refetch()
    },
    onError: (error) => {
      console.error('Error deleting user:', error)
    },
  })

  // Filter users by role and search term, excluding "javi" admin
  const filteredUsers = useMemo(() => {
    if (!data?.listUsers) return []
    
    return data.listUsers.filter((user) => {
      // Filter out admin user "javi"
      if (user.role === 'admin' && user.username.toLowerCase() === 'javi') {
        return false
      }
      
      // Filter by role (tab)
      if (user.role !== tabValue) {
        return false
      }
      
      // Filter by search term
      if (searchTerm) {
        const search = searchTerm.toLowerCase()
        return (
          user.username.toLowerCase().includes(search) ||
          user.email.toLowerCase().includes(search) ||
          (user.member &&
            (`${user.member.nombre} ${user.member.apellidos}`
              .toLowerCase()
              .includes(search) ||
              user.member.numero_socio.toLowerCase().includes(search)))
        )
      }
      
      return true
    })
  }, [data, tabValue, searchTerm])

  // Paginated users
  const paginatedUsers = useMemo(() => {
    const start = page * rowsPerPage
    const end = start + rowsPerPage
    return filteredUsers.slice(start, end)
  }, [filteredUsers, page, rowsPerPage])

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleDelete = (userId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      void deleteUser({ variables: { id: userId } })
    }
  }

  const canDeleteUser = (user: UserWithMember) => {
    // Cannot delete yourself
    if (currentUser?.id === user.id) return false
    // Cannot delete admin "javi"
    return !(user.role === 'admin' && user.username.toLowerCase() === 'javi');

  }

  if (error) {
    return (
      <Alert severity="error">
        Error al cargar usuarios: {error.message}
      </Alert>
    )
  }

  return (
    <Paper>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Gestión de Usuarios</Typography>
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={onAddUser}
          >
            Nuevo Usuario
          </Button>
        </Box>
        
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar por nombre, email o número de socio..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />
        
        <Tabs value={tabValue} onChange={(_, value) => setTabValue(value as UserRole)}>
          <Tab
            icon={<AdminIcon />}
            label="Administradores"
            value={'admin' as UserRole}
            iconPosition="start"
          />
          <Tab
            icon={<UserIcon />}
            label="Usuarios"
            value={'user' as UserRole}
            iconPosition="start"
          />
        </Tabs>
      </Box>

      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Usuario</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Rol</TableCell>
              {tabValue === 'user' && <TableCell>Socio Asociado</TableCell>}
              <TableCell>Estado</TableCell>
              <TableCell>Email Verificado</TableCell>
              <TableCell>Último Acceso</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              Array.from(new Array(5)).map((_, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={8}>
                    <Skeleton variant="text" />
                  </TableCell>
                </TableRow>
              ))
            ) : paginatedUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No se encontraron usuarios
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedUsers.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.role === 'admin' ? 'Administrador' : 'Usuario'}
                      color={user.role === 'admin' ? 'warning' : 'default'}
                      size="small"
                      icon={user.role === 'admin' ? <AdminIcon /> : <UserIcon />}
                    />
                  </TableCell>
                  {tabValue === 'user' && (
                    <TableCell>
                      {user.member ? (
                        <Box>
                          <Typography variant="body2">
                            {user.member.nombre} {user.member.apellidos}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            N° {user.member.numero_socio}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Sin asociar
                        </Typography>
                      )}
                    </TableCell>
                  )}
                  <TableCell>
                    <Chip
                      label={user.isActive ? 'Activo' : 'Inactivo'}
                      color={user.isActive ? 'success' : 'default'}
                      size="small"
                      variant={user.isActive ? 'filled' : 'outlined'}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.emailVerified ? 'Verificado' : 'Pendiente'}
                      color={user.emailVerified ? 'success' : 'warning'}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    {user.lastLogin ? (
                      <Typography variant="body2">
                        {new Date(user.lastLogin).toLocaleDateString('es-ES')}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Nunca
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <Tooltip title="Editar">
                        <IconButton
                          size="small"
                          onClick={() => onEditUser(user)}
                          color="primary"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip
                        title={
                          canDeleteUser(user)
                            ? 'Eliminar'
                            : user.id === currentUser?.id
                            ? 'No puedes eliminarte a ti mismo'
                            : 'Este usuario no puede ser eliminado'
                        }
                      >
                        <span>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(user.id)}
                            disabled={!canDeleteUser(user) || deleteLoading}
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={filteredUsers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
      />
    </Paper>
  )
}
