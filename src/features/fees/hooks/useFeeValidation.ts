import { useCallback } from 'react'
import type { FeeGenerationFormData } from '../types'

export interface ValidationErrors {
  year?: string
  baseFeeAmount?: string
  familyFeeExtra?: string
}

/**
 * Hook for validating annual fee generation form data
 *
 * @returns {object} Validation functions
 */
export const useFeeValidation = () => {
  /**
   * Validate form data and return errors
   */
  const validateForm = useCallback((data: FeeGenerationFormData): ValidationErrors => {
    const errors: ValidationErrors = {}
    const currentYear = new Date().getFullYear()

    // Validate year
    if (!data.year) {
      errors.year = 'El año es requerido'
    } else if (data.year > currentYear) {
      errors.year = `El año no puede ser mayor a ${currentYear}`
    } else if (data.year < 2000) {
      errors.year = 'El año debe ser mayor o igual a 2000'
    }

    // Validate base fee amount
    if (data.baseFeeAmount === undefined || data.baseFeeAmount === null) {
      errors.baseFeeAmount = 'El monto base es requerido'
    } else if (data.baseFeeAmount <= 0) {
      errors.baseFeeAmount = 'El monto debe ser mayor a 0'
    } else if (data.baseFeeAmount > 10000) {
      errors.baseFeeAmount = 'El monto parece demasiado alto (máximo: 10,000)'
    }

    // Validate family fee extra
    if (data.familyFeeExtra < 0) {
      errors.familyFeeExtra = 'El monto no puede ser negativo'
    } else if (data.familyFeeExtra > 5000) {
      errors.familyFeeExtra = 'El monto parece demasiado alto (máximo: 5,000)'
    }

    return errors
  }, [])

  /**
   * Check if form data is valid (no errors)
   */
  const isValid = useCallback(
    (data: FeeGenerationFormData): boolean => {
      const errors = validateForm(data)
      return Object.keys(errors).length === 0
    },
    [validateForm]
  )

  return {
    validateForm,
    isValid,
  }
}
