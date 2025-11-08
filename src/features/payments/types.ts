export interface InitialPaymentFormData {
  payment_date?: string  // Optional, defaults to today
  notes?: string         // Optional notes
  // payment_method removed - always CASH
  // amount removed - comes from pending payment
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
  sortField?: string
  sortDirection?: 'ASC' | 'DESC'
}

/**
 * Flattened payment data for table display
 */
export interface PaymentListItem {
  id: string
  memberId: string // ID of the member (always present - origin member for families)
  memberName: string
  memberNumber: string
  familyName?: string // Display name for family payments (derived from member's family)
  amount: number
  paymentDate: string | null  // Can be null or invalid for pending payments
  status: 'PENDING' | 'PAID' | 'CANCELLED'
  paymentMethod: string | null  // Can be null for pending payments
  notes?: string | null
  membershipFeeYear?: number | null // Year of the annual membership fee (if applicable)
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
  paymentDate: string | null  // Can be null for pending payments
  paymentMethod: string | null  // Can be null for pending payments
  notes?: string | null
  generatedAt: string
  membershipFeeYear?: number | null  // Year of annual fee if applicable
}

/**
 * Options for receipt generator
 */
export interface ReceiptGeneratorOptions {
  payment: PaymentListItem
  autoDownload?: boolean
}
