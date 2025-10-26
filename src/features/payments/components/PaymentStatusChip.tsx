import React from 'react'
import { Chip } from '@mui/material'
import type { PaymentStatus } from '@/graphql/generated/schema'

interface PaymentStatusChipProps {
  status: PaymentStatus | string
}

/**
 * Display payment status as a colored chip
 */
export const PaymentStatusChip: React.FC<PaymentStatusChipProps> = ({ status }) => {
  const statusConfig: Record<
    string,
    { label: string; color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' }
  > = {
    PENDING: { label: 'Pendiente', color: 'warning' },
    PAID: { label: 'Pagado', color: 'success' },
    CANCELLED: { label: 'Cancelado', color: 'error' },
  }

  const config = statusConfig[status] || { label: status, color: 'default' as const }

  return <Chip label={config.label} color={config.color} size="small" />
}
