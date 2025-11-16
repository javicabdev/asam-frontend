import React from 'react'
import { Box, Alert, Paper } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useTranslation } from 'react-i18next'

import { MembersTable } from '@/features/members/components/MembersTable'
import { ConfirmDeactivateDialog } from '@/features/members/components/ConfirmDeactivateDialog'
import { useMembersTable } from '@/features/members/hooks/useMembersTable'
import type { Member } from '@/features/members/types'

export default function MembersPage() {
  const navigate = useNavigate()
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
  } = useMembersTable()

  const handleEditClick = (member: Member) => {
    navigate(`/members/${member.miembro_id}/edit`)
  }

  const handleDeactivateClick = (member: Member) => {
    setDeactivateDialog({ open: true, member })
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {t('loadError', 'Error al cargar los socios')}: {error.message}
        </Alert>
      )}

      {/* Table */}
      <Paper sx={{ p: 2, mb: 3, display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
        <Box sx={{ flex: 1, minHeight: 400, width: '100%' }}>
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
            onFilterChange={handleFilterChange}
            selectable={false}
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
