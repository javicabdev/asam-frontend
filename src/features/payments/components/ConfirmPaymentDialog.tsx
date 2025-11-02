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

import { useConfirmPayment } from '../hooks/useConfirmPayment'
import { useUpdatePaymentMutation } from '../api/mutations'
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
  const { enqueueSnackbar } = useSnackbar()
  const { confirmPayment, loading: confirmLoading, error } = useConfirmPayment()
  const [updatePayment, { loading: updateLoading }] = useUpdatePaymentMutation()

  // Form state
  const [paymentDate, setPaymentDate] = useState<string>('')
  const [paymentMethod, setPaymentMethod] = useState<string>('CASH')
  const [notes, setNotes] = useState<string>('')

  const loading = confirmLoading || updateLoading

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
      // Step 1: Update notes if provided
      if (notes && notes.trim() !== '') {
        const updateResult = await updatePayment({
          variables: {
            id: payment.id,
            input: {
              notes: notes,
              amount: payment.amount, // Required field
              payment_method: paymentMethod, // Required field
              member_id: payment.memberId || null,
              family_id: payment.familyId || null,
            }
          }
        })

        if (updateResult.errors && updateResult.errors.length > 0) {
          throw new Error(updateResult.errors[0].message || 'Error al actualizar las notas')
        }
      }

      // Step 2: Confirm payment with payment method (PENDING → PAID)
      // Backend now sets payment_method and payment_date when confirming
      const success = await confirmPayment(payment.id, paymentMethod)

      if (success) {
        enqueueSnackbar('Pago confirmado correctamente', { variant: 'success' })
        onSuccess?.()
        onClose()
      } else {
        enqueueSnackbar('Error al confirmar el pago', { variant: 'error' })
      }
    } catch (err) {
      console.error('Error confirming payment:', err)
      enqueueSnackbar(
        err instanceof Error ? err.message : 'Error al confirmar el pago',
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
            Confirmar Pago
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
            Complete los detalles del pago antes de confirmar:
          </Typography>
        </Box>

        {/* Member info (read-only) */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Socio:
          </Typography>
          <Typography variant="h6" gutterBottom>
            {payment.memberName}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Número de Socio:
          </Typography>
          <Typography variant="body1" gutterBottom>
            {payment.memberNumber}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Importe:
          </Typography>
          <Typography variant="h5" color="success.main">
            {formatCurrency(payment.amount)}
          </Typography>
        </Box>

        {/* Editable fields */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Payment Date */}
          <TextField
            label="Fecha de pago"
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            fullWidth
            disabled
            InputLabelProps={{
              shrink: true,
            }}
            helperText="La fecha se establece automáticamente al confirmar el pago"
          />

          {/* Payment Method */}
          <FormControl fullWidth>
            <InputLabel>Forma de pago</InputLabel>
            <Select
              value={paymentMethod}
              label="Forma de pago"
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <MenuItem value="CASH">Efectivo</MenuItem>
              <MenuItem value="TRANSFER">Transferencia</MenuItem>
              <MenuItem value="CARD">Tarjeta</MenuItem>
            </Select>
          </FormControl>

          {/* Notes */}
          <TextField
            label="Notas"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            multiline
            rows={3}
            fullWidth
            placeholder="Añadir notas opcionales sobre el pago..."
          />
        </Box>

        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            Esta acción cambiará el estado del pago a <strong>PAGADO</strong>. El pago quedará
            registrado como confirmado en el sistema.
          </Typography>
        </Alert>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={() => void handleConfirm()}
          variant="contained"
          color="success"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <CheckIcon />}
        >
          {loading ? 'Confirmando...' : 'Confirmar Pago'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
