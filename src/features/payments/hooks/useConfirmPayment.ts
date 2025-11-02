import { useCallback } from 'react'
import { useConfirmPaymentMutation } from '../api/mutations'
import type { ApolloError } from '@apollo/client'

interface UseConfirmPaymentResult {
  confirmPayment: (paymentId: string, paymentMethod: string) => Promise<boolean>
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
 *   const success = await confirmPayment(payment.id, 'CASH')
 *   if (success) {
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
   * @returns Promise<boolean> - true if successful, false otherwise
   */
  const confirmPayment = useCallback(
    async (paymentId: string, paymentMethod: string): Promise<boolean> => {
      try {
        const result = await confirmPaymentMutation({
          variables: {
            id: paymentId,
            paymentMethod: paymentMethod,
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

          return true
        }

        return false
      } catch (err) {
        console.error('Error confirming payment:', err)
        return false
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
