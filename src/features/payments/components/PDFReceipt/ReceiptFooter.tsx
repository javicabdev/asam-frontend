import { View, Text } from '@react-pdf/renderer'
import { receiptStyles } from './styles'

export function ReceiptFooter() {
  return (
    <View style={receiptStyles.footer}>
      {/* Espacio para firma */}
      <View style={receiptStyles.signature}>
        <View style={receiptStyles.signatureLine} />
        <Text style={receiptStyles.signatureLabel}>Firmado digitalmente por ASAM</Text>
      </View>

      {/* Texto legal */}
      <Text style={receiptStyles.footerText}>
        Este documento es un comprobante válido de pago{'\n'}
        Generado automáticamente - No requiere firma manuscrita{'\n'}
        Para cualquier consulta, contacte con la administración de ASAM
      </Text>
    </View>
  )
}
