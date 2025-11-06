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
  memberData: string
  memberNumber: string
  name: string
  family: string
  paymentDetails: string
  paymentDate: string
  paymentMethod: string
  totalAmount: string
  notes: string
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
        setError(new Error('Solo se pueden generar recibos para pagos confirmados'))
        return
      }

      try {
        setIsGenerating(true)
        setError(null)

        // Convert payment to receipt data
        const receiptData: ReceiptData = paymentToReceiptData(payment)

        // Prepare translations for PDF
        const translations: ReceiptTranslations = {
          title: t('receipt.title'),
          receiptNumber: t('receipt.number'),
          issuedDate: t('receipt.date'),
          memberData: t('receipt.member'),
          memberNumber: t('list.columns.memberNumber') || t('table.memberNumber'),
          name: t('list.columns.name') || 'Nombre',
          family: t('table.family'),
          paymentDetails: 'Detalles del Pago',
          paymentDate: t('receipt.date'),
          paymentMethod: t('receipt.method'),
          totalAmount: t('receipt.amount'),
          notes: 'Observaciones',
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
          link.download = `recibo-${receiptData.receiptNumber}.pdf`
          link.click()
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Error desconocido al generar el recibo'

        setError(new Error(errorMessage))
        console.error('Error generating receipt:', err)
      } finally {
        setIsGenerating(false)
      }
    },
    []
  )

  return {
    generateReceipt,
    isGenerating,
    error,
    receiptUrl,
  }
}
