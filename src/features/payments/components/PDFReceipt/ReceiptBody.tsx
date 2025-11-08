import { View, Text } from '@react-pdf/renderer'
import { receiptStyles } from './styles'
import { formatCurrency, formatReceiptDate } from '../../utils/receiptUtils'
import type { ReceiptData } from '../../types'
import type { ReceiptTranslations } from '../../hooks/useReceiptGenerator'

interface ReceiptBodyProps {
  receipt: ReceiptData
  translations: ReceiptTranslations
  language: string
}

export function ReceiptBody({ receipt, translations, language }: ReceiptBodyProps) {
  const memberInfo = receipt.familyName
    ? `${receipt.memberName} (${translations.family}: ${receipt.familyName})`
    : receipt.memberName

  return (
    <View style={receiptStyles.body}>
      {/* Sección de datos del socio */}
      <View style={receiptStyles.section}>
        <Text style={receiptStyles.sectionTitle}>{translations.memberData}</Text>

        <View style={receiptStyles.row}>
          <Text style={receiptStyles.label}>{translations.memberNumber}:</Text>
          <Text style={receiptStyles.value}>{receipt.memberNumber}</Text>
        </View>

        <View style={receiptStyles.row}>
          <Text style={receiptStyles.label}>{translations.name}:</Text>
          <Text style={receiptStyles.value}>{memberInfo}</Text>
        </View>
      </View>

      {/* Sección de detalles del pago */}
      <View style={receiptStyles.section}>
        <Text style={receiptStyles.sectionTitle}>{translations.paymentDetails}</Text>

        <View style={receiptStyles.row}>
          <Text style={receiptStyles.label}>{translations.concept}:</Text>
          <Text style={receiptStyles.value}>{translations.conceptValue}</Text>
        </View>

        <View style={receiptStyles.row}>
          <Text style={receiptStyles.label}>{translations.paymentDate}:</Text>
          <Text style={receiptStyles.value}>{formatReceiptDate(receipt.paymentDate, language)}</Text>
        </View>

        <View style={receiptStyles.row}>
          <Text style={receiptStyles.label}>{translations.paymentMethod}:</Text>
          <Text style={receiptStyles.value}>
            {translations.paymentMethodValue}
          </Text>
        </View>

        <View style={receiptStyles.row}>
          <Text style={receiptStyles.label}>{translations.receiptNumber}:</Text>
          <Text style={receiptStyles.value}>{receipt.receiptNumber}</Text>
        </View>

        {/* Caja de importe */}
        <View style={receiptStyles.amountBox}>
          <Text style={receiptStyles.amountLabel}>{translations.totalAmount}</Text>
          <Text style={receiptStyles.amountValue}>{formatCurrency(receipt.amount)}</Text>
        </View>
      </View>

      {/* Notas (si existen) */}
      {receipt.notes && (
        <View style={receiptStyles.notes}>
          <Text style={receiptStyles.notesLabel}>{translations.notes}:</Text>
          <Text style={receiptStyles.notesText}>{receipt.notes}</Text>
        </View>
      )}
    </View>
  )
}
