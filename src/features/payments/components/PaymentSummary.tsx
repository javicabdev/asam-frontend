import React from 'react'
import { Paper, Typography, Box, Chip, Divider, Grid } from '@mui/material'
import { CheckCircle } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { formatPaymentDate, formatAmount, getPaymentStatusColor, getPaymentStatusLabel } from '../utils'
import type { PaymentStatus } from '@/graphql/generated/schema'

interface PaymentSummaryProps {
  amount: number
  paymentMethod: string
  status: PaymentStatus | string // Allow string for backward compatibility
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
  const { t } = useTranslation('payments')
  const formattedDate = formatPaymentDate(paymentDate)
  const statusColor = getPaymentStatusColor(status)
  const statusLabel = getPaymentStatusLabel(status)

  return (
    <Paper elevation={2} sx={{ p: 3, bgcolor: 'success.lighter' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <CheckCircle color="success" sx={{ fontSize: 40 }} />
        <Box>
          <Typography variant="h6">{t('summary.title')}</Typography>
          <Typography variant="body2" color="text.secondary">
            {status === 'paid' || status === 'PAID'
              ? t('summary.confirmedMessage')
              : t('summary.pendingMessage')}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="body2" color="text.secondary">
            {t('summary.amount')}
          </Typography>
          <Typography variant="h6">{formatAmount(amount)}</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="body2" color="text.secondary">
            {t('summary.paymentMethod')}
          </Typography>
          <Typography variant="body1">{paymentMethod}</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="body2" color="text.secondary">
            {t('summary.status')}
          </Typography>
          <Chip label={statusLabel} color={statusColor} size="small" />
        </Grid>

        <Grid item xs={6}>
          <Typography variant="body2" color="text.secondary">
            {t('summary.date')}
          </Typography>
          <Typography variant="body1">{formattedDate}</Typography>
        </Grid>

        {notes && (
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">
              {t('summary.notes')}
            </Typography>
            <Typography variant="body2">{notes}</Typography>
          </Grid>
        )}
      </Grid>
    </Paper>
  )
}
