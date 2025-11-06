import React from 'react'
import { Chip } from '@mui/material'
import { useTranslation } from 'react-i18next'
import type { PaymentStatus } from '@/graphql/generated/schema'

interface PaymentStatusChipProps {
  status: PaymentStatus | string
}

/**
 * Display payment status as a colored chip
 */
export const PaymentStatusChip: React.FC<PaymentStatusChipProps> = ({ status }) => {
  const { t } = useTranslation('payments')

  const statusConfig: Record<
    string,
    { labelKey: string; color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' }
  > = {
    PENDING: { labelKey: 'status.pending', color: 'warning' },
    PAID: { labelKey: 'status.paid', color: 'success' },
    CANCELLED: { labelKey: 'status.cancelled', color: 'error' },
  }

  const config = statusConfig[status]
  const label = config ? t(config.labelKey) : status

  return <Chip label={label} color={config?.color || 'default'} size="small" />
}
