import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material'
import { CheckCircleOutline as CheckIcon } from '@mui/icons-material'
import { useSnackbar } from 'notistack'
import { format } from 'date-fns'
import { useTranslation } from 'react-i18next'

import { useConfirmPayment } from '../hooks/useConfirmPayment'
import type { PaymentListItem } from '../types'

interface ConfirmPaymentDialogProps {
  open: boolean
  payment: PaymentListItem | null
  onClose: () => void
  onSuccess?: () => void
}

/**
 * Dialog to confirm a pending payment (PENDING → PAID)
 */
export const ConfirmPaymentDialog: React.FC<ConfirmPaymentDialogProps> = ({
  open,
  payment,
  onClose,
  onSuccess,
}) => {
  const { t } = useTranslation('payments')
  const { enqueueSnackbar } = useSnackbar()
  const { confirmPayment, loading, error } = useConfirmPayment()

  // Form state
  const [paymentDate, setPaymentDate] = useState<string>('')
  const [paymentMethod, setPaymentMethod] = useState<string>('CASH')
  const [notes, setNotes] = useState<string>('')

  // Initialize form when dialog opens or payment changes
  useEffect(() => {
    if (payment && open) {
      // Set payment date to today if not set
      const today = format(new Date(), 'yyyy-MM-dd')
      setPaymentDate(payment.paymentDate ? format(new Date(payment.paymentDate), 'yyyy-MM-dd') : today)
      setPaymentMethod(payment.paymentMethod || 'CASH')
      setNotes(payment.notes || '')
    }
  }, [payment, open])

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount)
  }

  const handleConfirm = async () => {
    if (!payment) return

    try {
      // Format date to ISO 8601 if provided
      const formattedDate = paymentDate
        ? new Date(paymentDate).toISOString()
        : undefined

      // Confirm payment with all data in a single operation
      // Backend will update: status, payment_method, payment_date, and notes
      const success = await confirmPayment(
        payment.id,
        paymentMethod,
        formattedDate,
        notes.trim() || undefined
      )

      if (success) {
        enqueueSnackbar(t('confirmDialog.successMessage'), { variant: 'success' })
        onSuccess?.()
        onClose()
      } else {
        enqueueSnackbar(t('confirmDialog.errorMessage'), { variant: 'error' })
      }
    } catch (err) {
      console.error('Error confirming payment:', err)
      enqueueSnackbar(
        err instanceof Error ? err.message : t('confirmDialog.errorMessage'),
        { variant: 'error' }
      )
    }
  }

  if (!payment) return null

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CheckIcon color="success" />
          <Typography variant="h6" component="span">
            {t('confirmDialog.title')}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error.message}
          </Alert>
        )}

        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" gutterBottom>
            {t('confirmDialog.subtitle')}
          </Typography>
        </Box>

        {/* Member info (read-only) */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {t('confirmDialog.member')}
          </Typography>
          <Typography variant="h6" gutterBottom>
            {payment.memberName}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {t('confirmDialog.memberNumber')}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {payment.memberNumber}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {t('confirmDialog.concept')}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {payment.membershipFeeYear
              ? t('confirmDialog.conceptAnnualFee', { year: payment.membershipFeeYear })
              : t('confirmDialog.conceptOther')}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {t('confirmDialog.amount')}
          </Typography>
          <Typography variant="h5" color="success.main">
            {formatCurrency(payment.amount)}
          </Typography>
        </Box>

        {/* Editable fields */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Payment Date */}
          <TextField
            label={t('confirmDialog.paymentDateLabel')}
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            helperText={t('confirmDialog.paymentDateHelper')}
          />

          {/* Payment Method */}
          <FormControl fullWidth>
            <InputLabel>{t('confirmDialog.paymentMethodLabel')}</InputLabel>
            <Select
              value={paymentMethod}
              label={t('confirmDialog.paymentMethodLabel')}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <MenuItem value="CASH">{t('confirmDialog.methodCash')}</MenuItem>
              <MenuItem value="TRANSFER">{t('confirmDialog.methodTransfer')}</MenuItem>
              <MenuItem value="CARD">{t('confirmDialog.methodCard')}</MenuItem>
            </Select>
          </FormControl>

          {/* Notes */}
          <TextField
            label={t('confirmDialog.notesLabel')}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            multiline
            rows={3}
            fullWidth
            placeholder={t('confirmDialog.notesPlaceholder')}
          />
        </Box>

        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            {t('confirmDialog.infoMessage')}
          </Typography>
        </Alert>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {t('confirmDialog.cancel')}
        </Button>
        <Button
          onClick={() => void handleConfirm()}
          variant="contained"
          color="success"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <CheckIcon />}
        >
          {loading ? t('confirmDialog.confirming') : t('confirmDialog.confirmButton')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
