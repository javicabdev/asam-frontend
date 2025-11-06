import { View, Text, Image } from '@react-pdf/renderer'
import { receiptStyles } from './styles'
import { formatReceiptDate } from '../../utils/receiptUtils'
import type { ReceiptData } from '../../types'
import type { ReceiptTranslations } from '../../hooks/useReceiptGenerator'

interface ReceiptHeaderProps {
  receipt: ReceiptData
  translations: ReceiptTranslations
}

export function ReceiptHeader({ receipt, translations }: ReceiptHeaderProps) {
  // Use existing logo from public/icons directory
  const logoPath = '/icons/original-logo.png'
  const hasLogo = true

  return (
    <View style={receiptStyles.header}>
      <View style={receiptStyles.headerTop}>
        {/* Logo o texto ASAM */}
        <View>
          {hasLogo ? (
            <Image src={logoPath} style={receiptStyles.logo} />
          ) : (
            <Text style={receiptStyles.logoText}>ASAM</Text>
          )}
        </View>

        {/* Título y número de recibo */}
        <View>
          <Text style={receiptStyles.receiptTitle}>{translations.title.toUpperCase()}</Text>
          <Text style={receiptStyles.receiptNumber}>
            {translations.receiptNumber} {receipt.receiptNumber}
          </Text>
        </View>
      </View>

      {/* Información de ASAM */}
      <Text style={receiptStyles.headerInfo}>
        {translations.organizationName}{'\n'}
        {translations.location}{'\n'}
        {translations.issuedDate}: {formatReceiptDate(receipt.generatedAt)}
      </Text>
    </View>
  )
}
