import { useState, useCallback, useRef } from 'react'
import { useLazyQuery } from '@apollo/client'
import { ValidateDocumentDocument } from '@/graphql/generated/operations'

interface DocumentValidationResult {
  isValid: boolean
  normalizedValue: string
  errorMessage?: string
}

interface UseDocumentValidationResult {
  isValidating: boolean
  validationResult: DocumentValidationResult | null
  error: string | null
  validateDocument: (documentNumber: string) => Promise<DocumentValidationResult | null>
  clearValidation: () => void
}

/**
 * Hook to validate Spanish DNI/NIE documents
 * @returns Validation state and methods
 */
export function useDocumentValidation(): UseDocumentValidationResult {
  const [isValidating, setIsValidating] = useState(false)
  const [validationResult, setValidationResult] = useState<DocumentValidationResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Use a ref to store the timeout for debouncing
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const [checkDocument] = useLazyQuery(ValidateDocumentDocument, {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const validateDocument = useCallback(
    async (documentNumber: string): Promise<DocumentValidationResult | null> => {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Reset state
      setError(null)
      setValidationResult(null)

      // Don't validate empty documents
      if (!documentNumber || !documentNumber.trim()) {
        setIsValidating(false)
        return null
      }

      setIsValidating(true)

      return new Promise((resolve) => {
        timeoutRef.current = setTimeout(async () => {
          try {
            const { data, error: queryError } = await checkDocument({
              variables: { documentNumber: documentNumber.trim() },
            })

            if (queryError) {
              setError('Error al validar el documento')
              setIsValidating(false)
              resolve(null)
              return
            }

            const result = data?.checkDocumentValidity || null
            setValidationResult(result)
            setIsValidating(false)
            resolve(result)
          } catch (err) {
            setError('Error al validar el documento')
            setIsValidating(false)
            resolve(null)
          }
        }, 500) // 500ms debounce
      })
    },
    [checkDocument]
  )

  const clearValidation = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsValidating(false)
    setValidationResult(null)
    setError(null)
  }, [])

  return {
    isValidating,
    validationResult,
    error,
    validateDocument,
    clearValidation,
  }
}
