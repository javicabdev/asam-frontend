import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import i18n from '@/lib/i18n'

/**
 * Format a payment amount with currency symbol
 */
export const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    useGrouping: true,
  }).format(amount)
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
 * Get payment status label (internationalized)
 */
export const getPaymentStatusLabel = (status: string): string => {
  const statusUpper = status.toUpperCase()

  switch (statusUpper) {
    case 'PAID':
      return i18n.t('payments:status.paid')
    case 'PENDING':
      return i18n.t('payments:status.pending')
    case 'CANCELLED':
      return i18n.t('payments:status.cancelled')
    default:
      return status
  }
}

// ============================
// Receipt PDF Utilities
// ============================

import type { PaymentListItem, ReceiptData } from './types'

/**
 * Generates a unique receipt number in format: ASAM-YYYY-NNNNN
 * Example: ASAM-2025-00142
 */
export function generateReceiptNumber(paymentId: string, paymentDate: string | null): string {
  const date = paymentDate ? new Date(paymentDate) : new Date()
  const year = date.getFullYear()

  // Use payment ID as unique identifier (remove hyphens and take last 5 chars)
  const idPart = paymentId.replace(/-/g, '').slice(-5).toUpperCase()

  return `ASAM-${year}-${idPart}`
}

/**
 * Formats currency amount to EUR (for PDF receipts)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

/**
 * Formats date for receipt display (long format)
 */
export function formatReceiptDate(dateString: string | null): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  return format(date, "d 'de' MMMM 'de' yyyy", { locale: es })
}

/**
 * Translates payment method code (internationalized)
 */
export function translatePaymentMethod(method: string | null): string {
  if (!method) return ''

  const methodUpper = method.toUpperCase()

  switch (methodUpper) {
    case 'CASH':
      return i18n.t('payments:methods.cash')
    case 'TRANSFER':
      return i18n.t('payments:methods.transfer')
    case 'CARD':
      return i18n.t('payments:methods.card')
    default:
      return method
  }
}

/**
 * Converts a PaymentListItem to ReceiptData
 */
export function paymentToReceiptData(payment: PaymentListItem): ReceiptData {
  return {
    receiptNumber: generateReceiptNumber(payment.id, payment.paymentDate),
    paymentId: payment.id,
    memberName: payment.memberName,
    memberNumber: payment.memberNumber,
    familyName: payment.familyName,
    amount: payment.amount,
    paymentDate: payment.paymentDate,
    paymentMethod: payment.paymentMethod,
    notes: payment.notes,
    generatedAt: new Date().toISOString(),
  }
}
