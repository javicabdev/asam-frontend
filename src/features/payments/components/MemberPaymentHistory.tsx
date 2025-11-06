import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Stack,
  Divider,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Receipt as ReceiptIcon, Launch as LaunchIcon, CheckCircleOutline as ConfirmIcon } from '@mui/icons-material'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useMemberPayments, MemberPayment } from '../hooks/useMemberPayments'
import { PaymentStatusChip } from './PaymentStatusChip'
import { useReceiptGenerator } from '../hooks/useReceiptGenerator'
import { ConfirmPaymentDialog } from './ConfirmPaymentDialog'
import type { PaymentListItem } from '../types'

interface MemberPaymentHistoryProps {
  memberId: string
  membershipType: 'INDIVIDUAL' | 'FAMILY'
  maxRows?: number
}

/**
 * Component to display member's payment history
 * Shows a compact table with recent payments and summary
 */
export function MemberPaymentHistory({ memberId, membershipType, maxRows = 10 }: MemberPaymentHistoryProps) {
  const { t } = useTranslation('payments')
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const { payments, loading, error, totalPaid } = useMemberPayments(memberId, membershipType)
  const { generateReceipt, isGenerating } = useReceiptGenerator()
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; payment: PaymentListItem | null }>({
    open: false,
    payment: null,
  })

  // Format currency to EUR
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount)
  }

  // Format date to DD/MM/YYYY
  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return ''

    try {
      const date = new Date(dateString)
      // Check if date is valid (not 0001-01-01 or other invalid dates)
      if (date.getFullYear() < 1900 || isNaN(date.getTime())) {
        return ''
      }
      return format(date, 'dd/MM/yyyy', { locale: es })
    } catch {
      return ''
    }
  }

  // Translate payment method
  const translateMethod = (method: string | null | undefined): string => {
    if (!method) return ''

    const methodKey = method.toUpperCase()
    if (methodKey === 'CASH') return t('history.methodCash')
    if (methodKey === 'TRANSFER') return t('history.methodTransfer')
    if (methodKey === 'CARD') return t('history.methodCard')
    return method
  }

  // Handle download receipt
  const handleDownloadReceipt = async (payment: MemberPayment) => {
    try {
      // Validate that we have member data
      if (!payment.member) {
        enqueueSnackbar(
          t('history.errorNoMemberData'),
          { variant: 'error' }
        )
        return
      }

      // Transform MemberPayment (nested GraphQL structure) to PaymentListItem (flat structure)
      const isFamilyPayment = payment.member.tipo_membresia === 'FAMILY'
      const paymentListItem: PaymentListItem = {
        id: payment.id,
        memberId: payment.member.miembro_id,
        memberName: `${payment.member.nombre} ${payment.member.apellidos}`,
        memberNumber: payment.member.numero_socio,
        familyName: isFamilyPayment ? `Familia ${payment.member.numero_socio}` : undefined,
        amount: payment.amount,
        paymentDate: payment.payment_date,
        status: payment.status as 'PENDING' | 'PAID' | 'CANCELLED',
        paymentMethod: payment.payment_method,
        notes: payment.notes,
      }

      await generateReceipt(paymentListItem, true)

      enqueueSnackbar(t('history.receiptSuccess'), { variant: 'success' })
    } catch (error) {
      console.error('Error downloading receipt:', error)
      enqueueSnackbar(
        t('history.receiptError'),
        { variant: 'error' }
      )
    }
  }

  // Handle confirm payment - open dialog
  const handleConfirmPayment = (payment: MemberPayment) => {
    // Transform MemberPayment to PaymentListItem for the dialog
    const isFamilyPayment = payment.member.tipo_membresia === 'FAMILY'
    const paymentListItem: PaymentListItem = {
      id: payment.id,
      memberId: payment.member.miembro_id,
      memberName: `${payment.member.nombre} ${payment.member.apellidos}`,
      memberNumber: payment.member.numero_socio,
      familyName: isFamilyPayment ? `Familia ${payment.member.numero_socio}` : undefined,
      amount: payment.amount,
      paymentDate: payment.payment_date,
      status: payment.status as 'PENDING' | 'PAID' | 'CANCELLED',
      paymentMethod: payment.payment_method,
      notes: payment.notes,
    }

    setConfirmDialog({ open: true, payment: paymentListItem })
  }

  // Handle dialog success - reload page to show updated data
  const handleDialogSuccess = () => {
    setConfirmDialog({ open: false, payment: null })
    // Reload page to refresh payment data
    window.location.reload()
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={4}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {t('history.loadError')} {error.message}
      </Alert>
    )
  }

  const displayPayments = payments.slice(0, maxRows)
  const hasMorePayments = payments.length > maxRows

  return (
    <Box>
      {/* Header with summary */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          <Typography variant="h6" gutterBottom>
            {t('history.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {payments.length} {payments.length === 1 ? t('history.paymentSingular') : t('history.paymentPlural')}
          </Typography>
        </Box>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box textAlign="right">
            <Typography variant="caption" color="text.secondary" display="block">
              {t('history.totalPaid')}
            </Typography>
            <Typography variant="h6" color="success.main" fontWeight="bold">
              {formatCurrency(totalPaid)}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            size="small"
            endIcon={<LaunchIcon />}
            onClick={() => navigate(`/payments?search=${memberId}`)}
          >
            {t('history.viewAll')}
          </Button>
        </Stack>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {payments.length === 0 ? (
        <Alert severity="info" sx={{ my: 2 }}>
          {t('history.noPayments')}
        </Alert>
      ) : (
        <>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t('history.columnDate')}</TableCell>
                  <TableCell>{t('history.columnMethod')}</TableCell>
                  <TableCell align="right">{t('history.columnAmount')}</TableCell>
                  <TableCell align="center">{t('history.columnStatus')}</TableCell>
                  <TableCell align="center">{t('history.columnActions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayPayments.map((payment) => (
                  <TableRow
                    key={payment.id}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                  >
                    <TableCell>{formatDate(payment.payment_date)}</TableCell>
                    <TableCell>{translateMethod(payment.payment_method)}</TableCell>
                    <TableCell align="right">
                      <Typography
                        variant="body2"
                        fontWeight="medium"
                        color="success.main"
                      >
                        {formatCurrency(payment.amount)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <PaymentStatusChip status={payment.status} />
                    </TableCell>
                    <TableCell align="center">
                      {payment.status.toUpperCase() === 'PAID' && (
                        <Button
                          size="small"
                          startIcon={<ReceiptIcon />}
                          onClick={() => handleDownloadReceipt(payment)}
                          disabled={isGenerating}
                        >
                          {t('history.receiptButton')}
                        </Button>
                      )}
                      {payment.status.toUpperCase() === 'PENDING' && (
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          startIcon={<ConfirmIcon />}
                          onClick={() => handleConfirmPayment(payment)}
                        >
                          {t('history.confirmButton')}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {hasMorePayments && (
            <Box display="flex" justifyContent="center" mt={2}>
              <Button
                variant="text"
                size="small"
                onClick={() => navigate(`/payments?search=${memberId}`)}
              >
                {t('history.viewRemaining', { count: payments.length - maxRows })}
              </Button>
            </Box>
          )}
        </>
      )}

      {/* Confirm Payment Dialog */}
      <ConfirmPaymentDialog
        open={confirmDialog.open}
        payment={confirmDialog.payment}
        onClose={() => setConfirmDialog({ open: false, payment: null })}
        onSuccess={handleDialogSuccess}
      />
    </Box>
  )
}
