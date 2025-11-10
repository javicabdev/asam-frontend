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
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useTranslation } from 'react-i18next'
import type { InitialPaymentFormData } from '../types'
import type { MemberPayment } from '../hooks/useMemberPayments'

interface InitialPaymentFormComponentProps {
  memberId: string
  pendingPayment: MemberPayment
  memberRegistrationDate?: string | null // ⭐ NUEVO - Fecha de alta del socio
  onSubmit: (data: InitialPaymentFormData) => void | Promise<void>
  onCancel?: () => void
  loading: boolean
  error: string | null
}

export const InitialPaymentForm: React.FC<InitialPaymentFormComponentProps> = ({
  pendingPayment,
  memberRegistrationDate,
  onSubmit,
  onCancel,
  loading,
  error,
}) => {
  const { t } = useTranslation('payments')

  // ⭐ Usar fecha de alta del socio si existe, sino usar fecha actual
  const initialDate = React.useMemo(() => {
    if (memberRegistrationDate) {
      return new Date(memberRegistrationDate)
    }
    return new Date()
  }, [memberRegistrationDate])

  const [paymentDate, setPaymentDate] = React.useState<Date>(initialDate)
  const [notes, setNotes] = React.useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    await onSubmit({
      payment_date: format(paymentDate, "yyyy-MM-dd'T'HH:mm:ss"),
      notes: notes.trim() || undefined,
    })
  }

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {t('initialPaymentForm.title')}
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>{t('initialPaymentForm.amountToPay')}</strong>{' '}
          {new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR',
          }).format(pendingPayment.amount)}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>{t('initialPaymentForm.paymentMethod')}</strong> {t('initialPaymentForm.cash')}
        </Typography>
      </Alert>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
          <DateTimePicker
            label={t('initialPaymentForm.paymentDateLabel')}
            value={paymentDate}
            onChange={(date) => date && setPaymentDate(date)}
            maxDateTime={new Date()}
            ampm={false}
            format="dd/MM/yyyy HH:mm"
            slotProps={{
              textField: {
                fullWidth: true,
                margin: 'normal',
                helperText: t('initialPaymentForm.paymentDateHelper')
              }
            }}
          />
        </LocalizationProvider>

        <TextField
          label={t('initialPaymentForm.notesLabel')}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          multiline
          rows={3}
          fullWidth
          margin="normal"
          placeholder={t('initialPaymentForm.notesPlaceholder')}
        />

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
          <Button variant="outlined" onClick={onCancel} disabled={loading}>
            {t('initialPaymentForm.cancel')}
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? t('initialPaymentForm.confirming') : t('initialPaymentForm.confirmPayment')}
          </Button>
        </Box>
      </Box>
    </Paper>
  )
}
