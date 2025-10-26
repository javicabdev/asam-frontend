import React from 'react'
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
} from '@mui/material'
import { CheckCircleOutline as CheckIcon } from '@mui/icons-material'
import { useSnackbar } from 'notistack'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

import { useConfirmPayment } from '../hooks/useConfirmPayment'
import { PaymentStatusChip } from './PaymentStatusChip'
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
  const { confirmPayment, loading, error } = useConfirmPayment()

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount)
  }

  // Format date
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString)
      return format(date, 'dd/MM/yyyy', { locale: es })
    } catch {
      return dateString
    }
  }

  // Translate payment method
  const translateMethod = (method: string): string => {
    const methods: Record<string, string> = {
      CASH: 'Efectivo',
      TRANSFER: 'Transferencia',
      CARD: 'Tarjeta',
    }
    return methods[method] || method
  }

  const handleConfirm = async () => {
    if (!payment) return

    const success = await confirmPayment(payment.id)

    if (success) {
      enqueueSnackbar('Pago confirmado correctamente', { variant: 'success' })
      onSuccess?.()
      onClose()
    } else {
      enqueueSnackbar('Error al confirmar el pago', { variant: 'error' })
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
            ¿Está seguro de que desea confirmar el siguiente pago?
          </Typography>
        </Box>

        <Box
          sx={{
            p: 2,
            bgcolor: 'background.default',
            borderRadius: 1,
            border: 1,
            borderColor: 'divider',
          }}
        >
          {/* Member info */}
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Socio:
          </Typography>
          <Typography variant="h6" gutterBottom>
            {payment.memberName}
          </Typography>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            Número de Socio:
          </Typography>
          <Typography variant="body1" gutterBottom>
            {payment.memberNumber}
          </Typography>

          {/* Payment amount */}
          <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
            Importe:
          </Typography>
          <Typography variant="h5" color="success.main" gutterBottom>
            {formatCurrency(payment.amount)}
          </Typography>

          {/* Payment details */}
          <Box sx={{ mt: 2, display: 'flex', gap: 3 }}>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Fecha:
              </Typography>
              <Typography variant="body1">{formatDate(payment.paymentDate)}</Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Método:
              </Typography>
              <Typography variant="body1">{translateMethod(payment.paymentMethod)}</Typography>
            </Box>
          </Box>

          {/* Current status */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Estado actual:
            </Typography>
            <PaymentStatusChip status={payment.status} />
          </Box>

          {/* Notes if any */}
          {payment.notes && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Notas:
              </Typography>
              <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                {payment.notes}
              </Typography>
            </Box>
          )}
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
