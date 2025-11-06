import { View, Text } from '@react-pdf/renderer'
import { receiptStyles } from './styles'
import type { ReceiptTranslations } from '../../hooks/useReceiptGenerator'

interface ReceiptFooterProps {
  translations: ReceiptTranslations
}

export function ReceiptFooter({ translations }: ReceiptFooterProps) {
  return (
    <View style={receiptStyles.footer}>
      {/* Espacio para firma */}
      <View style={receiptStyles.signature}>
        <View style={receiptStyles.signatureLine} />
        <Text style={receiptStyles.signatureLabel}>{translations.signature}</Text>
      </View>

      {/* Texto legal */}
      <Text style={receiptStyles.footerText}>
        {translations.footer}
      </Text>
    </View>
  )
}
