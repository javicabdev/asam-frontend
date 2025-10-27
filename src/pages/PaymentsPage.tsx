import { useState } from 'react'
import { Box, Typography, Button, Alert, Stack, useTheme } from '@mui/material'
import { Add as AddIcon, Refresh as RefreshIcon } from '@mui/icons-material'
import { useAuthStore } from '@/stores/authStore'

import { PaymentFilters } from '@/features/payments/components/PaymentFilters'
import { PaymentsTable } from '@/features/payments/components/PaymentsTable'
import { ConfirmPaymentDialog } from '@/features/payments/components/ConfirmPaymentDialog'
import { usePaymentFilters } from '@/features/payments/hooks/usePaymentFilters'
import { usePayments } from '@/features/payments/hooks/usePayments'
import { useReceiptGenerator } from '@/features/payments/hooks/useReceiptGenerator'
import type { PaymentListItem } from '@/features/payments/types'

export default function PaymentsPage() {
  const theme = useTheme()
  const { user } = useAuthStore()
  const isAdmin = user?.role === 'admin'

  // State for confirm dialog
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    payment: PaymentListItem | null
  }>({ open: false, payment: null })

  // Filter state management
  const { filters, updateFilters, resetFilters, setPage, setPageSize } = usePaymentFilters()

  // Fetch payments with current filters
  const { payments, pageInfo, loading, error, refetch } = usePayments(filters)

  // Receipt generator hook
  const { generateReceipt, isGenerating: isGeneratingReceipt } = useReceiptGenerator()

  // Handle row click - navigate to payment details (placeholder for now)
  const handleRowClick = (payment: PaymentListItem) => {
    // TODO: Implement payment details page
    console.log('View payment details:', payment.id)
    // navigate(`/payments/${payment.id}`)
  }

  // Handle confirm payment - open dialog
  const handleConfirmClick = (payment: PaymentListItem) => {
    setConfirmDialog({ open: true, payment })
  }

  // Handle cancel payment (admin only, future implementation)
  const handleCancelClick = (payment: PaymentListItem) => {
    // TODO: Implement cancel payment dialog
    console.log('Cancel payment:', payment.id)
  }

  // Handle download receipt
  const handleDownloadReceipt = async (payment: PaymentListItem) => {
    try {
      await generateReceipt(payment, true)
    } catch (error) {
      console.error('Error downloading receipt:', error)
    }
  }

  // Handle new payment button (future implementation)
  const handleNewPayment = () => {
    // TODO: Implement manual payment registration
    console.log('New payment')
    // navigate('/payments/new')
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
            Gestión de Pagos
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Total: {pageInfo.totalCount} pagos
            </Typography>
          </Stack>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => void refetch()}
            disabled={loading}
          >
            Actualizar
          </Button>
          {isAdmin && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleNewPayment}
              disabled
              title="Próximamente: Registro manual de pagos"
            >
              Nuevo Pago
            </Button>
          )}
        </Stack>
      </Box>

      {/* Filters */}
      <PaymentFilters filters={filters} onFilterChange={updateFilters} onReset={resetFilters} />

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error al cargar los pagos: {error.message}
        </Alert>
      )}

      {/* Table */}
      <PaymentsTable
        payments={payments}
        totalCount={pageInfo.totalCount}
        loading={loading || isGeneratingReceipt}
        page={filters.page}
        pageSize={filters.pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onRowClick={handleRowClick}
        onConfirmClick={handleConfirmClick}
        onCancelClick={handleCancelClick}
        onDownloadReceipt={handleDownloadReceipt}
        isAdmin={isAdmin}
      />

      {/* Confirm Payment Dialog */}
      <ConfirmPaymentDialog
        open={confirmDialog.open}
        payment={confirmDialog.payment}
        onClose={() => setConfirmDialog({ open: false, payment: null })}
        onSuccess={() => void refetch()}
      />
    </Box>
  )
}
