import { View, Text, Image } from '@react-pdf/renderer'
import { receiptStyles } from './styles'
import { formatReceiptDate } from '../../utils/receiptUtils'
import type { ReceiptData } from '../../types'

interface ReceiptHeaderProps {
  receipt: ReceiptData
}

export function ReceiptHeader({ receipt }: ReceiptHeaderProps) {
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
          <Text style={receiptStyles.receiptTitle}>RECIBO DE PAGO</Text>
          <Text style={receiptStyles.receiptNumber}>Nº {receipt.receiptNumber}</Text>
        </View>
      </View>

      {/* Información de ASAM */}
      <Text style={receiptStyles.headerInfo}>
        Asociación para la Solidaridad y Apoyo Mutuo{'\n'}
        Sabadell, Catalunya{'\n'}
        Fecha de emisión: {formatReceiptDate(receipt.generatedAt)}
      </Text>
    </View>
  )
}
