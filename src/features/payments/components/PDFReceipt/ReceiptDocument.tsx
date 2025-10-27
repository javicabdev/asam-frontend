import { Document, Page } from '@react-pdf/renderer'
import { ReceiptHeader } from './ReceiptHeader'
import { ReceiptBody } from './ReceiptBody'
import { ReceiptFooter } from './ReceiptFooter'
import { receiptStyles } from './styles'
import type { ReceiptData } from '../../types'

interface ReceiptDocumentProps {
  receipt: ReceiptData
}

/**
 * Main PDF receipt document component
 */
export function ReceiptDocument({ receipt }: ReceiptDocumentProps) {
  return (
    <Document
      title={`Recibo ${receipt.receiptNumber}`}
      author="ASAM - Asociación para la Solidaridad y Apoyo Mutuo"
      subject={`Recibo de pago del socio ${receipt.memberNumber}`}
      creator="ASAM Frontend v0.1.0"
      producer="@react-pdf/renderer"
      language="es-ES"
    >
      <Page size="A4" style={receiptStyles.page}>
        <ReceiptHeader receipt={receipt} />
        <ReceiptBody receipt={receipt} />
        <ReceiptFooter />
      </Page>
    </Document>
  )
}
