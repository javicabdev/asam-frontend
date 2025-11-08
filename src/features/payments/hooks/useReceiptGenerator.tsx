import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { pdf } from '@react-pdf/renderer'
import { ReceiptDocument } from '../components/PDFReceipt'
import { paymentToReceiptData } from '../utils/receiptUtils'
import type { PaymentListItem, ReceiptData } from '../types'

export interface ReceiptTranslations {
  title: string
  receiptNumber: string
  issuedDate: string
  organizationName: string
  location: string
  memberData: string
  memberNumber: string
  name: string
  family: string
  paymentDetails: string
  concept: string
  conceptValue: string // Translated value of the concept (e.g., "Cuota 2024" or "Otro pago")
  paymentDate: string
  paymentMethod: string
  paymentMethodValue: string // Translated value of the payment method
  totalAmount: string
  notes: string
  signature: string
  footer: string
}

interface UseReceiptGeneratorReturn {
  generateReceipt: (payment: PaymentListItem, autoDownload?: boolean) => Promise<void>
  isGenerating: boolean
  error: Error | null
  receiptUrl: string | null
}

/**
 * Hook for generating and downloading PDF receipts
 */
export function useReceiptGenerator(): UseReceiptGeneratorReturn {
  const { t, i18n } = useTranslation('payments')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null)

  const generateReceipt = useCallback(
    async (payment: PaymentListItem, autoDownload = true) => {
      // Validate payment status
      if (payment.status.toUpperCase() !== 'PAID') {
        setError(new Error(t('receipt.errorOnlyPaid')))
        return
      }

      try {
        setIsGenerating(true)
        setError(null)

        // Convert payment to receipt data
        const receiptData: ReceiptData = paymentToReceiptData(payment)

        // Translate payment method
        const getPaymentMethodTranslation = (method: string | null): string => {
          if (!method) return ''
          const methodUpper = method.toUpperCase()
          switch (methodUpper) {
            case 'CASH':
              return t('methods.cash')
            case 'TRANSFER':
              return t('methods.transfer')
            case 'CARD':
              return t('methods.card')
            default:
              return method
          }
        }

        // Translate concept (annual fee or other payment)
        const getConceptTranslation = (year: number | null | undefined): string => {
          if (year) {
            return t('receipt.annualFeeYear', { year })
          }
          return t('receipt.otherPayment')
        }

        // Prepare translations for PDF
        const translations: ReceiptTranslations = {
          title: t('receipt.title'),
          receiptNumber: t('receipt.number'),
          issuedDate: t('receipt.issuedDate'),
          organizationName: t('receipt.organizationName'),
          location: t('receipt.location'),
          memberData: t('receipt.memberData'),
          memberNumber: t('table.memberNumber'),
          name: t('receipt.name'),
          family: t('table.family'),
          paymentDetails: t('receipt.paymentDetails'),
          concept: t('receipt.concept'),
          conceptValue: getConceptTranslation(receiptData.membershipFeeYear),
          paymentDate: t('receipt.date'),
          paymentMethod: t('receipt.method'),
          paymentMethodValue: getPaymentMethodTranslation(receiptData.paymentMethod),
          totalAmount: t('receipt.amount'),
          notes: t('receipt.notes'),
          signature: t('receipt.signature'),
          footer: t('receipt.footer'),
        }

        // Get current language for PDF metadata
        const language = i18n.language === 'wo' ? 'fr-SN' : i18n.language === 'fr' ? 'fr-FR' : 'es-ES'

        // Generate PDF blob
        const blob = await pdf(
          <ReceiptDocument receipt={receiptData} translations={translations} language={language} />
        ).toBlob()

        // Create URL for the blob
        const url = URL.createObjectURL(blob)
        setReceiptUrl(url)

        // Auto-download if requested
        if (autoDownload) {
          const link = document.createElement('a')
          link.href = url
          // Filename format: recibo-SOCIO123-ASAM-2025-00142.pdf
          link.download = `recibo-${receiptData.memberNumber}-${receiptData.receiptNumber}.pdf`
          link.click()
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : t('receipt.errorUnknown')

        setError(new Error(errorMessage))
        console.error('Error generating receipt:', err)
      } finally {
        setIsGenerating(false)
      }
    },
    [t, i18n.language]
  )

  return {
    generateReceipt,
    isGenerating,
    error,
    receiptUrl,
  }
}
