import { Box, Typography, Button, Alert, Chip, Stack, Tooltip, useTheme } from '@mui/material'
import {
  Add as AddIcon,
  DeleteOutline as DeleteIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useTranslation } from 'react-i18next'

import { MembersTable } from '@/features/members/components/MembersTable'
import { MembersFilters } from '@/features/members/components/MembersFilters'
import { useMembersTable } from '@/features/members/hooks/useMembersTable'
import type { Member } from '@/features/members/types'

export default function MembersPage() {
  const navigate = useNavigate()
  const theme = useTheme()
  const { t } = useTranslation('members')
  const { user } = useAuthStore()
  const isAdmin = user?.role === 'admin'
  const {
    members,
    totalCount,
    loading,
    error,
    page,
    pageSize,
    filter,
    handlePageChange,
    handlePageSizeChange,
    handleSortChange,
    handleRowClick,
    handleFilterChange,
    handleSelectionChange,
    selectedMembers,
    refetch, // Added refetch here
  } = useMembersTable()

  const handleBulkDelete = () => {
    // TODO: Implement bulk delete
    console.log('Bulk delete:', selectedMembers)
  }

  const handleEditClick = (member: Member) => {
    navigate(`/members/${member.miembro_id}/edit`)
  }

  const handleDeactivateClick = (member: Member) => {
    // TODO: Implement deactivate confirmation dialog
    console.log('Deactivate member:', member)
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              color: theme.palette.text.primary,
              fontWeight: 600,
            }}
          >
            {t('title', 'Gestión de Socios')}
          </Typography>
          {import.meta.env.DEV && (
            <Typography variant="caption" color="text.secondary">
              Debug: Usuario: {user?.username || 'N/A'}, Rol: '{user?.role || 'N/A'}', Es admin:{' '}
              {isAdmin ? 'SÍ' : 'NO'}
            </Typography>
          )}
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body2" color="text.secondary">
              {t('total', 'Total')}: {totalCount} {t('members', 'socios')}
            </Typography>
            {selectedMembers.length > 0 && (
              <Chip
                label={`${selectedMembers.length} ${t('selected', 'seleccionados')}`}
                color="primary"
                size="small"
              />
            )}
          </Stack>
        </Box>
        <Stack direction="row" spacing={2}>
          {selectedMembers.length > 0 && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleBulkDelete}
            >
              {t('delete', 'Eliminar')} ({selectedMembers.length})
            </Button>
          )}
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => void refetch()}
            disabled={loading}
          >
            {t('refresh', 'Actualizar')}
          </Button>
          <Tooltip
            title={
              !isAdmin ? t('adminOnly', 'Solo los administradores pueden crear nuevos socios') : ''
            }
            arrow
          >
            <span>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/members/new')}
                disabled={!isAdmin}
              >
                {t('newMember', 'Nuevo Socio')}
              </Button>
            </span>
          </Tooltip>
        </Stack>
      </Box>

      {/* Filters */}
      <MembersFilters onFilterChange={handleFilterChange} />

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {t('loadError', 'Error al cargar los socios')}: {error.message}
        </Alert>
      )}

      {/* Table */}
      <MembersTable
        members={members}
        totalCount={totalCount}
        loading={loading}
        page={page}
        pageSize={pageSize}
        filters={filter}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onSortChange={handleSortChange}
        onRowClick={handleRowClick}
        onEditClick={handleEditClick}
        onDeactivateClick={handleDeactivateClick}
        onSelectionChange={handleSelectionChange}
        selectable={true}
      />
    </Box>
  )
}
