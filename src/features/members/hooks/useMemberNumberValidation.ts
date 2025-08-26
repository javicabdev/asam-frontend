import { useState, useCallback, useRef } from 'react'
import { useLazyQuery } from '@apollo/client'
import { CheckMemberNumberExistsDocument } from '@/graphql/generated/operations'

interface UseMemberNumberValidationResult {
  isValidating: boolean
  isDuplicate: boolean | null
  error: string | null
  validateMemberNumber: (memberNumber: string) => Promise<boolean>
  clearValidation: () => void
}

/**
 * Hook to validate if a member number already exists in the database
 * @returns Validation state and methods
 */
export function useMemberNumberValidation(): UseMemberNumberValidationResult {
  const [isValidating, setIsValidating] = useState(false)
  const [isDuplicate, setIsDuplicate] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Use a ref to store the timeout for debouncing
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const [checkExists] = useLazyQuery(CheckMemberNumberExistsDocument, {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const validateMemberNumber = useCallback(
    async (memberNumber: string): Promise<boolean> => {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Reset state
      setError(null)
      setIsDuplicate(null)

      // Don't validate empty or invalid format
      if (!memberNumber || !/^[AB]\d{5}$/.test(memberNumber)) {
        setIsValidating(false)
        return true // Let other validations handle format errors
      }

      setIsValidating(true)

      return new Promise((resolve) => {
        timeoutRef.current = setTimeout(async () => {
          try {
            const { data, error: queryError } = await checkExists({
              variables: { memberNumber },
            })

            if (queryError) {
              setError('Error al verificar el número de socio')
              setIsValidating(false)
              resolve(false)
              return
            }

            const exists = data?.checkMemberNumberExists || false
            setIsDuplicate(exists)
            setIsValidating(false)
            resolve(!exists)
          } catch (err) {
            setError('Error al verificar el número de socio')
            setIsValidating(false)
            resolve(false)
          }
        }, 500) // 500ms debounce
      })
    },
    [checkExists]
  )

  const clearValidation = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsValidating(false)
    setIsDuplicate(null)
    setError(null)
  }, [])

  return {
    isValidating,
    isDuplicate,
    error,
    validateMemberNumber,
    clearValidation,
  }
}
