import { useState } from 'react'
import { Box, Alert, Snackbar, Paper } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/stores/authStore'

import { PaymentsTable } from '@/features/payments/components/PaymentsTable'
import { ConfirmPaymentDialog } from '@/features/payments/components/ConfirmPaymentDialog'
import { usePaymentFilters } from '@/features/payments/hooks/usePaymentFilters'
import { usePayments } from '@/features/payments/hooks/usePayments'
import { useReceiptGenerator } from '@/features/payments/hooks/useReceiptGenerator'
import type { PaymentListItem } from '@/features/payments/types'

export default function PaymentsPage() {
  const { t } = useTranslation('payments')
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const isAdmin = user?.role === 'admin'

  // State for confirm dialog
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    payment: PaymentListItem | null
  }>({ open: false, payment: null })

  // State for family snackbar
  const [familySnackbar, setFamilySnackbar] = useState(false)

  // Filter state management
  const { filters, setPage, setPageSize, setSort, updateFilter } = usePaymentFilters()

  // Fetch payments with current filters
  const { payments, pageInfo, loading, error } = usePayments(filters)

  // Handle search change
  const handleSearchChange = (searchTerm: string) => {
    updateFilter('searchTerm', searchTerm)
  }

  // Receipt generator hook
  const { generateReceipt, isGenerating: isGeneratingReceipt } = useReceiptGenerator()

  // Handle row click - navigate to member details
  const handleRowClick = (payment: PaymentListItem) => {
    // All payments now have memberId (origin member for families)
    navigate(`/members/${payment.memberId}`)
  }

  // Handle confirm payment - open dialog
  const handleConfirmClick = (payment: PaymentListItem) => {
    setConfirmDialog({ open: true, payment })
  }

  // Handle download receipt
  const handleDownloadReceipt = async (payment: PaymentListItem) => {
    try {
      await generateReceipt(payment, true)
    } catch (error) {
      console.error('Error downloading receipt:', error)
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {t('error.load')}: {error.message}
        </Alert>
      )}

      {/* Table */}
      <Paper sx={{ p: 2, mb: 3, display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
        <Box sx={{ flex: 1, minHeight: 400, width: '100%' }}>
          <PaymentsTable
            payments={payments}
            totalCount={pageInfo.totalCount}
            loading={loading || isGeneratingReceipt}
            page={filters.page}
            pageSize={filters.pageSize}
            searchTerm={filters.searchTerm}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            onSortChange={setSort}
            onSearchChange={handleSearchChange}
            onRowClick={handleRowClick}
            onConfirmClick={handleConfirmClick}
            onDownloadReceipt={handleDownloadReceipt}
            isAdmin={isAdmin}
          />
        </Box>
      </Paper>

      {/* Confirm Payment Dialog */}
      <ConfirmPaymentDialog
        open={confirmDialog.open}
        payment={confirmDialog.payment}
        onClose={() => setConfirmDialog({ open: false, payment: null })}
        onSuccess={() => {
          // Reload the page to refresh data after successful payment confirmation
          window.location.reload()
        }}
      />

      {/* Family feature not implemented snackbar */}
      <Snackbar
        open={familySnackbar}
        autoHideDuration={4000}
        onClose={() => setFamilySnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setFamilySnackbar(false)}
          severity="info"
          sx={{ width: '100%' }}
        >
          {t('info.familyDetailsComingSoon')}
        </Alert>
      </Snackbar>
    </Box>
  )
}
