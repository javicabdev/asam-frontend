import { format, parseISO } from 'date-fns'
import { es, fr } from 'date-fns/locale'
import type { PaymentListItem, ReceiptData } from '../types'

/**
 * Generates a unique receipt number using the payment ID
 * Format: ASAM-{paymentId}
 * Example: ASAM-550e8400-e29b-41d4-a716-446655440000
 *
 * This ensures the receipt number is unique and irrepetible since it's based
 * directly on the unique payment ID from the database.
 */
export function generateReceiptNumber(paymentId: string): string {
  return `ASAM-${paymentId}`
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
  const date = parseISO(dateString)

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
    receiptNumber: generateReceiptNumber(payment.id),
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
