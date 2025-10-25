export interface InitialPaymentFormData {
  amount: number
  payment_method: string
  notes?: string | null
}

export interface PaymentFormProps {
  memberId: string
  onSuccess?: (paymentId: string) => void
  onCancel?: () => void
}

export const PAYMENT_METHODS = {
  CASH: 'Efectivo',
  TRANSFER: 'Transferencia',
  CARD: 'Tarjeta',
} as const

// Default annual membership fee amount (€40 per year)
export const DEFAULT_INITIAL_PAYMENT_AMOUNT = 40
