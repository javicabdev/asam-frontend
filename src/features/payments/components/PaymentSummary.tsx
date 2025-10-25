import React from 'react'
import { Paper, Typography, Box, Chip, Divider, Grid } from '@mui/material'
import { CheckCircle } from '@mui/icons-material'
import { formatPaymentDate, formatAmount, getPaymentStatusColor, getPaymentStatusLabel } from '../utils'

interface PaymentSummaryProps {
  amount: number
  paymentMethod: string
  status: string
  paymentDate: string
  notes?: string | null
}

export const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  amount,
  paymentMethod,
  status,
  paymentDate,
  notes,
}) => {
  const formattedDate = formatPaymentDate(paymentDate)
  const statusColor = getPaymentStatusColor(status)
  const statusLabel = getPaymentStatusLabel(status)

  return (
    <Paper elevation={2} sx={{ p: 3, bgcolor: 'success.lighter' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <CheckCircle color="success" sx={{ fontSize: 40 }} />
        <Box>
          <Typography variant="h6">Pago Registrado Exitosamente</Typography>
          <Typography variant="body2" color="text.secondary">
            El pago ha sido registrado y está pendiente de confirmación
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="body2" color="text.secondary">
            Monto:
          </Typography>
          <Typography variant="h6">{formatAmount(amount)}</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="body2" color="text.secondary">
            Método de Pago:
          </Typography>
          <Typography variant="body1">{paymentMethod}</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="body2" color="text.secondary">
            Estado:
          </Typography>
          <Chip label={statusLabel} color={statusColor} size="small" />
        </Grid>

        <Grid item xs={6}>
          <Typography variant="body2" color="text.secondary">
            Fecha:
          </Typography>
          <Typography variant="body1">{formattedDate}</Typography>
        </Grid>

        {notes && (
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">
              Notas:
            </Typography>
            <Typography variant="body2">{notes}</Typography>
          </Grid>
        )}
      </Grid>
    </Paper>
  )
}
