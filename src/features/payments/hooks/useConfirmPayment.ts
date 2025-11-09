import { useCallback } from 'react'
import { useConfirmPaymentMutation, type ConfirmPaymentMutation } from '../api/mutations'
import type { ApolloError } from '@apollo/client'

type ConfirmedPayment = ConfirmPaymentMutation['confirmPayment']

interface UseConfirmPaymentResult {
  confirmPayment: (
    paymentId: string,
    paymentMethod: string,
    paymentDate?: string | null,
    notes?: string | null
  ) => Promise<ConfirmedPayment | null>
  loading: boolean
  error: ApolloError | undefined
}

/**
 * Custom hook to confirm a pending payment (PENDING → PAID)
 * 
 * @returns Object with confirmPayment function, loading and error states
 * 
 * @example
 * ```tsx
 * const { confirmPayment, loading, error } = useConfirmPayment()
 *
 * const handleConfirm = async () => {
 *   const payment = await confirmPayment(
 *     payment.id,
 *     'CASH',
 *     '2025-11-02T10:30:00Z', // Optional: custom date
 *     'Pago recibido en efectivo' // Optional: notes
 *   )
 *   if (payment) {
 *     // Show success notification
 *     // Close dialog
 *   }
 * }
 * ```
 */
export function useConfirmPayment(): UseConfirmPaymentResult {
  const [confirmPaymentMutation, { loading, error }] = useConfirmPaymentMutation()

  /**
   * Confirm a payment by ID
   * Changes status from PENDING to PAID
   *
   * @param paymentId - The ID of the payment to confirm
   * @param paymentMethod - The payment method (CASH, TRANSFER, CARD)
   * @param paymentDate - Optional: custom payment date (ISO 8601 string), uses NOW if not provided
   * @param notes - Optional: payment notes
   * @returns Promise<ConfirmedPayment | null> - the confirmed payment object if successful, null otherwise
   */
  const confirmPayment = useCallback(
    async (
      paymentId: string,
      paymentMethod: string,
      paymentDate?: string | null,
      notes?: string | null
    ): Promise<ConfirmedPayment | null> => {
      try {
        const result = await confirmPaymentMutation({
          variables: {
            id: paymentId,
            paymentMethod: paymentMethod,
            paymentDate: paymentDate || undefined,
            notes: notes || undefined,
          },
        })

        if (result.data?.confirmPayment) {
          console.log('🔍 [useConfirmPayment] Payment confirmed, verificando datos:', {
            payment_method: result.data.confirmPayment.payment_method,
            payment_date: result.data.confirmPayment.payment_date,
            status: result.data.confirmPayment.status,
          })

          if (!result.data.confirmPayment.payment_method) {
            console.error('❌ [useConfirmPayment] ERROR: payment_method es null después de confirmar!')
            console.error('   El backend debe preservar payment_method al confirmar el pago')
          }

          return result.data.confirmPayment
        }

        return null
      } catch (err) {
        console.error('Error confirming payment:', err)
        return null
      }
    },
    [confirmPaymentMutation]
  )

  return {
    confirmPayment,
    loading,
    error,
  }
}
