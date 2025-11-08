import { format } from 'date-fns'
import { es, fr } from 'date-fns/locale'
import type { PaymentListItem, ReceiptData } from '../types'

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
 * Formats currency amount to EUR
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

/**
 * Formats date for receipt display according to language
 * @param dateString - ISO date string
 * @param language - Language code (es-ES, fr-FR, fr-SN for Wolof)
 */
export function formatReceiptDate(dateString: string | null, language: string = 'es-ES'): string {
  if (!dateString) return ''
  const date = new Date(dateString)

  // Wolof uses French locale since date-fns doesn't have Wolof
  const locale = language === 'fr-FR' || language === 'fr-SN' ? fr : es

  // French format: "d MMMM yyyy" (e.g., "15 janvier 2025")
  // Spanish format: "d 'de' MMMM 'de' yyyy" (e.g., "15 de enero de 2025")
  const dateFormat = language === 'fr-FR' || language === 'fr-SN'
    ? 'd MMMM yyyy'
    : "d 'de' MMMM 'de' yyyy"

  return format(date, dateFormat, { locale })
}

/**
 * Translates payment method code to Spanish
 */
export function translatePaymentMethod(method: string | null): string {
  if (!method) return ''
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
    membershipFeeYear: payment.membershipFeeYear,
  }
}
