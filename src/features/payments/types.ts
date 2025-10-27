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

// Maximum payment amount allowed without admin approval (€1000)
export const MAX_PAYMENT_AMOUNT = 1000

/**
 * Payment filters state for list view
 */
export interface PaymentFiltersState {
  status: 'ALL' | 'PENDING' | 'PAID' | 'CANCELLED'
  paymentMethod: string
  startDate: Date | null
  endDate: Date | null
  searchTerm: string
  page: number
  pageSize: number
}

/**
 * Flattened payment data for table display
 */
export interface PaymentListItem {
  id: string
  memberId?: string // ID of the member (for individual payments)
  familyId?: string // ID of the family (for family payments)
  memberName: string
  memberNumber: string
  familyName?: string
  amount: number
  paymentDate: string
  status: 'PENDING' | 'PAID' | 'CANCELLED'
  paymentMethod: string
  notes?: string | null
}

/**
 * Receipt data for PDF generation
 */
export interface ReceiptData {
  receiptNumber: string
  paymentId: string
  memberName: string
  memberNumber: string
  familyName?: string | null
  amount: number
  paymentDate: string
  paymentMethod: string
  notes?: string | null
  generatedAt: string
}

/**
 * Options for receipt generator
 */
export interface ReceiptGeneratorOptions {
  payment: PaymentListItem
  autoDownload?: boolean
}
