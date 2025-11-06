import { Document, Page } from '@react-pdf/renderer'
import { ReceiptHeader } from './ReceiptHeader'
import { ReceiptBody } from './ReceiptBody'
import { ReceiptFooter } from './ReceiptFooter'
import { receiptStyles } from './styles'
import type { ReceiptData } from '../../types'
import type { ReceiptTranslations } from '../../hooks/useReceiptGenerator'

interface ReceiptDocumentProps {
  receipt: ReceiptData
  translations: ReceiptTranslations
  language?: string
}

/**
 * Main PDF receipt document component
 */
export function ReceiptDocument({ receipt, translations, language = 'es-ES' }: ReceiptDocumentProps) {
  return (
    <Document
      title={`${translations.title} ${receipt.receiptNumber}`}
      author="ASAM - Asociación para la Solidaridad y Apoyo Mutuo"
      subject={`${translations.title} ${translations.memberNumber} ${receipt.memberNumber}`}
      creator="ASAM Frontend v0.1.0"
      producer="@react-pdf/renderer"
      language={language}
    >
      <Page size="A4" style={receiptStyles.page}>
        <ReceiptHeader receipt={receipt} translations={translations} />
        <ReceiptBody receipt={receipt} translations={translations} />
        <ReceiptFooter translations={translations} />
      </Page>
    </Document>
  )
}
