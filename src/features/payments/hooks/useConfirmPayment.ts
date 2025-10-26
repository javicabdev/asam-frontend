import { useCallback } from 'react'
import { useConfirmPaymentMutation } from '../api/mutations'
import type { ApolloError } from '@apollo/client'

interface UseConfirmPaymentResult {
  confirmPayment: (paymentId: string) => Promise<boolean>
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
 *   const success = await confirmPayment(payment.id)
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
   * @returns Promise<boolean> - true if successful, false otherwise
   */
  const confirmPayment = useCallback(
    async (paymentId: string): Promise<boolean> => {
      try {
        const result = await confirmPaymentMutation({
          variables: { id: paymentId },
        })

        if (result.data?.confirmPayment) {
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
