import { useState } from 'react'
import { ApolloError } from '@apollo/client'
import { useRegisterPaymentMutation } from '../api/mutations'
import type { InitialPaymentFormData } from '../types'
import type { PaymentInput } from '@/graphql/generated/operations'

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
  getFamilyId: () => string | null | undefined // ← Changed: function instead of value
  isFamily: boolean
  onSuccess?: (payment: any) => void
}

export const usePaymentForm = (options: UsePaymentFormOptions) => {
  const { memberId, getFamilyId, isFamily, onSuccess } = options
  const [error, setError] = useState<string | null>(null)

  const [registerPayment, { loading }] = useRegisterPaymentMutation()

  const handleSubmit = async (formData: InitialPaymentFormData) => {
    setError(null)

    try {
      // Get familyId DYNAMICALLY at submit time, not at hook initialization
      const familyId = getFamilyId()
      
      console.log('💳 [usePaymentForm] Submitting payment:', {
        memberId,
        familyId,
        isFamily,
        formData,
      })

      // Prepare the input based on membership type
      const input: PaymentInput = {
        amount: formData.amount,
        payment_method: formData.payment_method,
        notes: formData.notes || null,
        // If it's a family, send family_id; otherwise, send member_id
        ...(isFamily && familyId ? { family_id: familyId } : { member_id: memberId }),
      }
      
      console.log('💳 [usePaymentForm] Payment input:', input)

      const result = await registerPayment({
        variables: { input },
      })

      const payment = result.data?.registerPayment

      if (!payment?.id) {
        throw new Error('No se recibió el ID del pago')
      }
      
      console.log('✅ [usePaymentForm] Payment registered:', payment)

      if (onSuccess) {
        onSuccess(payment)
      }

      return payment
    } catch (err) {
      console.error('❌ [usePaymentForm] Error registering payment:', err)
      const errorMessage = parseErrorMessage(err)
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
