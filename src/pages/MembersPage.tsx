import React from 'react'
import { Box, Typography, Alert, Chip, Stack, useTheme } from '@mui/material'
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
    <Box>
      {/* Header */}
      <Box mb={3}>
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

      {/* Filters */}
      <MembersFilters onFilterChange={handleFilterChange} />

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {t('loadError', 'Error al cargar los socios')}: {error.message}
        </Alert>
      )}

      {/* Table */}
      <Box sx={{ height: 600, width: '100%' }}>
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
