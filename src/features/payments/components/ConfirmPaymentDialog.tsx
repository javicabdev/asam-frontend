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
import { DateTimePicker } from '@mui/x-date-pickers'
import { CheckCircleOutline as CheckIcon } from '@mui/icons-material'
import { useSnackbar } from 'notistack'
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
  const [paymentDate, setPaymentDate] = useState<Date>(new Date())
  const [paymentMethod, setPaymentMethod] = useState<string>('CASH')
  const [notes, setNotes] = useState<string>('')
  const [amount, setAmount] = useState<number>(0)

  // Initialize form when dialog opens or payment changes
  useEffect(() => {
    if (payment && open) {
      // Use payment date if it exists and is in the past, otherwise use current date/time
      let initialDate = new Date()
      if (payment.paymentDate) {
        const paymentDateObj = new Date(payment.paymentDate)
        const now = new Date()

        // If payment date is in the past, use it
        if (paymentDateObj < now) {
          initialDate = paymentDateObj
        }
      }

      setPaymentDate(initialDate)
      setPaymentMethod(payment.paymentMethod || 'CASH')
      setNotes(payment.notes || '')
      setAmount(payment.amount)
    }
  }, [payment, open])

  const handleConfirm = async () => {
    if (!payment) return

    try {
      // Format date to ISO 8601 RFC3339 with timezone (backend expects this format)
      const formattedDate = paymentDate
        ? paymentDate.toISOString()
        : undefined

      // Confirm payment with all data in a single operation
      // Backend will update: status, payment_method, payment_date, notes, and amount
      const success = await confirmPayment(
        payment.id,
        paymentMethod,
        formattedDate,
        notes.trim() || undefined,
        amount
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
          <Typography variant="body1">
            {payment.membershipFeeYear
              ? t('confirmDialog.conceptAnnualFee', { year: payment.membershipFeeYear })
              : t('confirmDialog.conceptOther')}
          </Typography>
        </Box>

        {/* Editable fields */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Amount */}
          <TextField
            label={t('confirmDialog.amount')}
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            fullWidth
            required
            inputProps={{
              min: 0,
              step: 0.01,
            }}
            helperText={t('confirmDialog.amountHelper')}
          />

          {/* Payment Date */}
          <DateTimePicker
            label={t('confirmDialog.paymentDateLabel')}
            value={paymentDate}
            onChange={(newValue) => newValue && setPaymentDate(newValue)}
            maxDateTime={new Date()}
            ampm={false}
            format="dd/MM/yyyy HH:mm"
            slotProps={{
              textField: {
                fullWidth: true,
                helperText: t('confirmDialog.paymentDateHelper'),
              },
            }}
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
