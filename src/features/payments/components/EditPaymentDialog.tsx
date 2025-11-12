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
  IconButton,
} from '@mui/material'
import { Edit as EditIcon, Close as CloseIcon } from '@mui/icons-material'
import { useSnackbar } from 'notistack'
import { useTranslation } from 'react-i18next'

import { useUpdatePaymentMutation } from '../api/mutations'
import type { PaymentListItem } from '../types'

interface EditPaymentDialogProps {
  open: boolean
  payment: PaymentListItem | null
  onClose: () => void
  onSuccess?: () => void
}

/**
 * Dialog to edit a paid payment
 * Allows editing amount, payment_method, and notes
 */
export const EditPaymentDialog: React.FC<EditPaymentDialogProps> = ({
  open,
  payment,
  onClose,
  onSuccess,
}) => {
  const { t } = useTranslation('payments')
  const { enqueueSnackbar } = useSnackbar()
  const [updatePaymentMutation, { loading, error }] = useUpdatePaymentMutation()

  // Form state
  const [paymentMethod, setPaymentMethod] = useState<string>('CASH')
  const [notes, setNotes] = useState<string>('')
  const [amount, setAmount] = useState<number>(0)

  // Initialize form when dialog opens or payment changes
  useEffect(() => {
    if (payment && open) {
      setPaymentMethod(payment.paymentMethod || 'CASH')
      setNotes(payment.notes || '')
      setAmount(payment.amount)
    }
  }, [payment, open])

  const handleUpdate = async () => {
    if (!payment) return

    try {
      const result = await updatePaymentMutation({
        variables: {
          id: payment.id,
          input: {
            member_id: payment.memberId,
            amount: amount,
            payment_method: paymentMethod,
            notes: notes.trim() || undefined,
          },
        },
      })

      if (result.data?.updatePayment) {
        enqueueSnackbar(t('editDialog.successMessage'), { variant: 'success' })
        onSuccess?.()
        onClose()
      } else {
        enqueueSnackbar(t('editDialog.errorMessage'), { variant: 'error' })
      }
    } catch (err) {
      console.error('Error updating payment:', err)
      enqueueSnackbar(
        err instanceof Error ? err.message : t('editDialog.errorMessage'),
        { variant: 'error' }
      )
    }
  }

  if (!payment) return null

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EditIcon color="primary" />
            <Typography variant="h6" component="span">
              {t('editDialog.title')}
            </Typography>
          </Box>
          <IconButton
            edge="end"
            color="inherit"
            onClick={onClose}
            aria-label="close"
            disabled={loading}
          >
            <CloseIcon />
          </IconButton>
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
            {t('editDialog.subtitle')}
          </Typography>
        </Box>

        {/* Member info (read-only) */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {t('editDialog.member')}
          </Typography>
          <Typography variant="h6" gutterBottom>
            {payment.memberName}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {t('editDialog.memberNumber')}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {payment.memberNumber}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {t('editDialog.concept')}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {payment.membershipFeeYear
              ? t('editDialog.conceptAnnualFee', { year: payment.membershipFeeYear })
              : t('editDialog.conceptOther')}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {t('editDialog.paymentDate')}
          </Typography>
          <Typography variant="body1">
            {payment.paymentDate
              ? new Date(payment.paymentDate).toLocaleString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : '-'}
          </Typography>
        </Box>

        {/* Editable fields */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Amount */}
          <TextField
            label={t('editDialog.amount')}
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            fullWidth
            required
            inputProps={{
              min: 0,
              step: 0.01,
            }}
            helperText={t('editDialog.amountHelper')}
          />

          {/* Payment Method */}
          <FormControl fullWidth>
            <InputLabel>{t('editDialog.paymentMethodLabel')}</InputLabel>
            <Select
              value={paymentMethod}
              label={t('editDialog.paymentMethodLabel')}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <MenuItem value="CASH">{t('editDialog.methodCash')}</MenuItem>
              <MenuItem value="TRANSFER">{t('editDialog.methodTransfer')}</MenuItem>
              <MenuItem value="CARD">{t('editDialog.methodCard')}</MenuItem>
            </Select>
          </FormControl>

          {/* Notes */}
          <TextField
            label={t('editDialog.notesLabel')}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            multiline
            rows={3}
            fullWidth
            placeholder={t('editDialog.notesPlaceholder')}
          />
        </Box>

        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            {t('editDialog.infoMessage')}
          </Typography>
        </Alert>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {t('editDialog.cancel')}
        </Button>
        <Button
          onClick={() => void handleUpdate()}
          variant="contained"
          color="primary"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <EditIcon />}
        >
          {loading ? t('editDialog.updating') : t('editDialog.updateButton')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
