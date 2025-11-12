import React from 'react'
import { Box, Typography, Alert, Chip, Stack, useTheme, Paper } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useTranslation } from 'react-i18next'

import { MembersTable } from '@/features/members/components/MembersTable'
import { MembersFilters } from '@/features/members/components/MembersFilters'
import { ConfirmDeactivateDialog } from '@/features/members/components/ConfirmDeactivateDialog'
import { useMembersTable } from '@/features/members/hooks/useMembersTable'
import type { Member } from '@/features/members/types'

export default function MembersPage() {
  const navigate = useNavigate()
  const theme = useTheme()
  const { t } = useTranslation('members')
  const { user } = useAuthStore()
  const isAdmin = user?.role === 'admin'
  
  // State for deactivate dialog
  const [deactivateDialog, setDeactivateDialog] = React.useState<{
    open: boolean
    member: Member | null
  }>({ open: false, member: null })
  
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
  } = useMembersTable()

  const handleEditClick = (member: Member) => {
    navigate(`/members/${member.miembro_id}/edit`)
  }

  const handleDeactivateClick = (member: Member) => {
    setDeactivateDialog({ open: true, member })
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        gap: 3,
      }}
    >
      {/* Header */}
      <Box>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            color: theme.palette.text.primary,
            fontWeight: 600,
          }}
        >
          👥 {t('title', 'Gestión de Socios')}
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
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

      {/* Error Alert */}
      {error && (
        <Alert severity="error">
          {t('loadError', 'Error al cargar los socios')}: {error.message}
        </Alert>
      )}

      {/* Filters */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          🔍 {t('filters.title', 'Filtros')}
        </Typography>
        <MembersFilters onFilterChange={handleFilterChange} />
      </Paper>

      {/* Table */}
      <Paper
        sx={{
          p: 2,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
        }}
      >
        <Typography variant="h6" gutterBottom>
          📊 {t('table.title', 'Listado de Socios')} ({totalCount})
        </Typography>
        <Box
          sx={{
            flex: 1,
            minHeight: 400,
            width: '100%',
            height: '100%',
          }}
        >
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
            isAdmin={isAdmin}
            onAddMember={() => navigate('/members/new')}
          />
        </Box>
      </Paper>

      {/* Deactivate Confirmation Dialog */}
      <ConfirmDeactivateDialog
        open={deactivateDialog.open}
        member={deactivateDialog.member}
        onClose={() => setDeactivateDialog({ open: false, member: null })}
        onSuccess={() => {
          // Reload the page to refresh data after successful deactivation
          window.location.reload()
        }}
      />
    </Box>
  )
}
