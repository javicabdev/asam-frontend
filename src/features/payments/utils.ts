import { format } from 'date-fns'
import { es } from 'date-fns/locale'

/**
 * Format a payment amount with currency symbol
 */
export const formatAmount = (amount: number): string => {
  return `${amount.toFixed(2)} €`
}

/**
 * Format a date to Spanish locale
 */
export const formatPaymentDate = (dateString: string): string => {
  try {
    return format(new Date(dateString), "d 'de' MMMM 'de' yyyy", { locale: es })
  } catch (error) {
    console.error('Error formatting date:', error)
    return dateString
  }
}

/**
 * Get payment status color for MUI components
 */
export const getPaymentStatusColor = (
  status: string
): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
  switch (status) {
    case 'PAID':
      return 'success'
    case 'PENDING':
      return 'warning'
    case 'CANCELLED':
      return 'error'
    default:
      return 'default'
  }
}

/**
 * Get payment status label in Spanish
 */
export const getPaymentStatusLabel = (status: string): string => {
  switch (status) {
    case 'PAID':
      return 'Pagado'
    case 'PENDING':
      return 'Pendiente'
    case 'CANCELLED':
      return 'Cancelado'
    default:
      return status
  }
}
