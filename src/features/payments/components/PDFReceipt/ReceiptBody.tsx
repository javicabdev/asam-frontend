import { View, Text } from '@react-pdf/renderer'
import { receiptStyles } from './styles'
import {
  formatCurrency,
  formatReceiptDate,
  translatePaymentMethod,
} from '../../utils/receiptUtils'
import type { ReceiptData } from '../../types'

interface ReceiptBodyProps {
  receipt: ReceiptData
}

export function ReceiptBody({ receipt }: ReceiptBodyProps) {
  const memberInfo = receipt.familyName
    ? `${receipt.memberName} (Familia: ${receipt.familyName})`
    : receipt.memberName

  return (
    <View style={receiptStyles.body}>
      {/* Sección de datos del socio */}
      <View style={receiptStyles.section}>
        <Text style={receiptStyles.sectionTitle}>Datos del Socio</Text>

        <View style={receiptStyles.row}>
          <Text style={receiptStyles.label}>Número de Socio:</Text>
          <Text style={receiptStyles.value}>{receipt.memberNumber}</Text>
        </View>

        <View style={receiptStyles.row}>
          <Text style={receiptStyles.label}>Nombre:</Text>
          <Text style={receiptStyles.value}>{memberInfo}</Text>
        </View>
      </View>

      {/* Sección de detalles del pago */}
      <View style={receiptStyles.section}>
        <Text style={receiptStyles.sectionTitle}>Detalles del Pago</Text>

        <View style={receiptStyles.row}>
          <Text style={receiptStyles.label}>Fecha de Pago:</Text>
          <Text style={receiptStyles.value}>{formatReceiptDate(receipt.paymentDate)}</Text>
        </View>

        <View style={receiptStyles.row}>
          <Text style={receiptStyles.label}>Método de Pago:</Text>
          <Text style={receiptStyles.value}>
            {translatePaymentMethod(receipt.paymentMethod)}
          </Text>
        </View>

        <View style={receiptStyles.row}>
          <Text style={receiptStyles.label}>Número de Recibo:</Text>
          <Text style={receiptStyles.value}>{receipt.receiptNumber}</Text>
        </View>

        {/* Caja de importe */}
        <View style={receiptStyles.amountBox}>
          <Text style={receiptStyles.amountLabel}>Importe Total</Text>
          <Text style={receiptStyles.amountValue}>{formatCurrency(receipt.amount)}</Text>
        </View>
      </View>

      {/* Notas (si existen) */}
      {receipt.notes && (
        <View style={receiptStyles.notes}>
          <Text style={receiptStyles.notesLabel}>Observaciones:</Text>
          <Text style={receiptStyles.notesText}>{receipt.notes}</Text>
        </View>
      )}
    </View>
  )
}
