import { useState } from 'react'
import { ApolloError } from '@apollo/client'
import { useUpdatePaymentMutation } from '../api/mutations'
import { useConfirmPayment } from './useConfirmPayment'
import type { InitialPaymentFormData } from '../types'

/**
 * Parse and extract meaningful error messages from various error types
 */
const parseErrorMessage = (error: unknown): string => {
  // Handle ApolloError with specific error types
  if (error instanceof ApolloError) {
    // Network errors (connection issues, timeouts)
    if (error.networkError) {
      const networkError = error.networkError
      
      // Check for timeout
      if ('statusCode' in networkError && networkError.statusCode === 408) {
        return 'Tiempo de espera agotado. Por favor, verifica tu conexión e inténtalo de nuevo.'
      }
      
      // Check for server unavailable
      if ('statusCode' in networkError && networkError.statusCode >= 500) {
        return 'El servidor no está disponible. Por favor, inténtalo más tarde.'
      }
      
      return 'Error de conexión. Por favor, verifica tu conexión a internet e inténtalo de nuevo.'
    }
    
    // GraphQL errors with extensions (validation errors, business logic errors)
    if (error.graphQLErrors && error.graphQLErrors.length > 0) {
      const graphQLError = error.graphQLErrors[0]
      
      // Check for field-specific validation errors
      if (graphQLError.extensions?.fields) {
        const fields = graphQLError.extensions.fields as Record<string, string>
        const fieldErrors = Object.entries(fields)
          .map(([field, message]) => `${field}: ${message}`)
          .join(', ')
        return `Error de validación: ${fieldErrors}`
      }
      
      // Check for specific error codes
      const errorCode = graphQLError.extensions?.code as string | undefined
      
      if (errorCode === 'UNAUTHENTICATED') {
        return 'Sesión expirada. Por favor, inicia sesión nuevamente.'
      }
      
      if (errorCode === 'FORBIDDEN') {
        return 'No tienes permisos para realizar esta acción.'
      }
      
      if (errorCode === 'BAD_USER_INPUT') {
        return graphQLError.message || 'Datos inválidos. Por favor, verifica el formulario.'
      }
      
      // Return the GraphQL error message
      return graphQLError.message
    }
    
    // Fallback to Apollo error message
    return error.message
  }
  
  // Handle standard Error objects
  if (error instanceof Error) {
    return error.message
  }
  
  // Fallback for unknown error types
  return 'Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.'
}

interface UsePaymentFormOptions {
  memberId: string
  pendingPaymentId: string
  getFamilyId?: () => string | null | undefined
  isFamily: boolean
  onSuccess?: (payment: any) => void
}

export const usePaymentForm = (options: UsePaymentFormOptions) => {
  const { pendingPaymentId, onSuccess } = options
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [updatePayment] = useUpdatePaymentMutation()
  const { confirmPayment, loading: confirmLoading } = useConfirmPayment()

  const handleSubmit = async (formData: InitialPaymentFormData) => {
    setError(null)
    setIsLoading(true)

    try {
      console.log('💳 [usePaymentForm] Confirming payment:', {
        pendingPaymentId,
        formData,
      })

      // Step 1: Update notes if provided
      let payment = null
      if (formData.notes && formData.notes.trim() !== '') {
        const updateResult = await updatePayment({
          variables: {
            id: pendingPaymentId,
            input: {
              notes: formData.notes,
              amount: 0, // Required field - will be set by backend based on membership type
              payment_method: 'CASH', // Required field
            }
          }
        })

        if (updateResult.errors && updateResult.errors.length > 0) {
          throw new Error(updateResult.errors[0].message || 'Error al actualizar las notas')
        }

        payment = updateResult.data?.updatePayment
      }

      // Step 2: Confirm payment with payment method (PENDING → PAID)
      // Backend now sets payment_method and payment_date when confirming
      const confirmed = await confirmPayment(pendingPaymentId, 'CASH')

      if (!confirmed) {
        throw new Error('Error al confirmar el pago')
      }

      console.log('✅ [usePaymentForm] Payment confirmed successfully with CASH method')

      // Success callback
      if (onSuccess) {
        onSuccess(payment)
      }

      return payment
    } catch (err) {
      console.error('❌ [usePaymentForm] Error processing payment:', err)
      const errorMessage = parseErrorMessage(err)
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    handleSubmit,
    loading: isLoading || confirmLoading,
    error,
    setError,
  }
}
