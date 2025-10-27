import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import type { PaymentListItem, ReceiptData } from '../types'

/**
 * Generates a unique receipt number in format: ASAM-YYYY-NNNNN
 * Example: ASAM-2025-00142
 */
export function generateReceiptNumber(paymentId: string, paymentDate: string): string {
  const date = new Date(paymentDate)
  const year = date.getFullYear()

  // Use payment ID as unique identifier (remove hyphens and take last 5 chars)
  const idPart = paymentId.replace(/-/g, '').slice(-5).toUpperCase()

  return `ASAM-${year}-${idPart}`
}

/**
 * Formats currency amount to EUR
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

/**
 * Formats date for receipt display
 */
export function formatReceiptDate(dateString: string): string {
  const date = new Date(dateString)
  return format(date, "d 'de' MMMM 'de' yyyy", { locale: es })
}

/**
 * Translates payment method code to Spanish
 */
export function translatePaymentMethod(method: string): string {
  const translations: Record<string, string> = {
    CASH: 'Efectivo',
    TRANSFER: 'Transferencia Bancaria',
    CARD: 'Tarjeta',
  }
  return translations[method] || method
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
