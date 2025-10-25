import { useState } from 'react'
import { useRegisterPaymentMutation } from '../api/mutations'
import type { InitialPaymentFormData } from '../types'
import type { PaymentInput } from '@/graphql/generated/operations'

interface UsePaymentFormOptions {
  memberId: string
  familyId?: string | null
  isFamily: boolean
  onSuccess?: (payment: any) => void
}

export const usePaymentForm = (options: UsePaymentFormOptions) => {
  const { memberId, familyId, isFamily, onSuccess } = options
  const [error, setError] = useState<string | null>(null)

  const [registerPayment, { loading }] = useRegisterPaymentMutation()

  const handleSubmit = async (formData: InitialPaymentFormData) => {
    setError(null)

    try {
      // Prepare the input based on membership type
      const input: PaymentInput = {
        amount: formData.amount,
        payment_method: formData.payment_method,
        notes: formData.notes || null,
        // If it's a family, send family_id; otherwise, send member_id
        ...(isFamily && familyId ? { family_id: familyId } : { member_id: memberId }),
      }

      const result = await registerPayment({
        variables: { input },
      })

      const payment = result.data?.registerPayment

      if (!payment?.id) {
        throw new Error('No se recibió el ID del pago')
      }

      if (onSuccess) {
        onSuccess(payment)
      }

      return payment
    } catch (err) {
      console.error('Error al registrar pago:', err)
      const errorMessage = err instanceof Error ? err.message : 'Error al registrar el pago'
      setError(errorMessage)
      return null
    }
  }

  return {
    handleSubmit,
    loading,
    error,
    setError,
  }
}
