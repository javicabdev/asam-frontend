import React from 'react'
import {
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  Alert,
  CircularProgress,
} from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import type { InitialPaymentFormData } from '../types'
import type { MemberPayment } from '../hooks/useMemberPayments'

interface InitialPaymentFormComponentProps {
  memberId: string
  pendingPayment: MemberPayment
  onSubmit: (data: InitialPaymentFormData) => void | Promise<void>
  onCancel?: () => void
  loading: boolean
  error: string | null
}

export const InitialPaymentForm: React.FC<InitialPaymentFormComponentProps> = ({
  pendingPayment,
  onSubmit,
  onCancel,
  loading,
  error,
}) => {
  const [paymentDate, setPaymentDate] = React.useState<Date>(new Date())
  const [notes, setNotes] = React.useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    await onSubmit({
      payment_date: format(paymentDate, 'yyyy-MM-dd'),
      notes: notes.trim() || undefined,
    })
  }

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Confirmar Pago en Efectivo
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Monto a pagar:</strong> {pendingPayment.amount.toFixed(2)} €
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Método de pago:</strong> Efectivo
        </Typography>
      </Alert>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
          <DatePicker
            label="Fecha del Pago"
            value={paymentDate}
            onChange={(date) => date && setPaymentDate(date)}
            maxDate={new Date()}
            slotProps={{
              textField: {
                fullWidth: true,
                margin: 'normal',
                helperText: 'Fecha en que se recibió el pago en efectivo'
              }
            }}
          />
        </LocalizationProvider>

        <TextField
          label="Notas (opcional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          multiline
          rows={3}
          fullWidth
          margin="normal"
          placeholder="Ej: Recibido por [nombre], número de recibo, etc."
        />

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
          <Button variant="outlined" onClick={onCancel} disabled={loading}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? 'Confirmando...' : 'Confirmar Pago'}
          </Button>
        </Box>
      </Box>
    </Paper>
  )
}
