import { useState, useCallback } from 'react'
import { useGenerateAnnualFeesMutation } from '@/graphql/generated/operations'
import { LIST_ANNUAL_FEES_QUERY } from '../api/queries'
import type {
  FeeGenerationState,
  FeeGenerationFormData,
  FeeGenerationPreview,
} from '../types'

/**
 * Main hook for managing annual fee generation flow
 *
 * State machine: form → preview → generating → result | error
 *
 * @returns {object} State and actions for fee generation
 */
export const useFeeGeneration = () => {
  const [state, setState] = useState<FeeGenerationState>({
    step: 'form',
    formData: null,
    preview: null,
    result: null,
    error: null,
  })

  // Mutation for generating annual fees
  const [generateFeesMutation, { loading: generating }] = useGenerateAnnualFeesMutation({
    refetchQueries: [{ query: LIST_ANNUAL_FEES_QUERY }],
    awaitRefetchQueries: true,
    onCompleted: (data) => {
      setState((prev) => ({
        ...prev,
        step: 'result',
        result: data.generateAnnualFees,
        error: null,
      }))
    },
    onError: (error) => {
      setState((prev) => ({
        ...prev,
        step: 'error',
        error: error.message,
      }))
    },
  })

  /**
   * Validate form data and show preview
   */
  const validateAndPreview = useCallback(
    async (formData: FeeGenerationFormData) => {
      try {
        setState((prev) => ({ ...prev, step: 'preview' }))

        // TODO: In the future, we could query the backend for actual member counts
        // For now, we'll show a simplified preview
        const preview: FeeGenerationPreview = {
          year: formData.year,
          baseFeeAmount: formData.baseFeeAmount,
          familyFeeExtra: formData.familyFeeExtra,
          // These are placeholders - in reality would come from a query
          estimatedTotalMembers: 0,
          estimatedIndividualMembers: 0,
          estimatedFamilyMembers: 0,
          estimatedTotalAmount: 0,
          feeExists: false,
        }

        setState((prev) => ({
          ...prev,
          formData,
          preview,
        }))
      } catch (error) {
        setState((prev) => ({
          ...prev,
          step: 'error',
          error: error instanceof Error ? error.message : 'Error desconocido',
        }))
      }
    },
    []
  )

  /**
   * Confirm and execute generation
   */
  const confirmGeneration = useCallback(async () => {
    if (!state.formData) {
      setState((prev) => ({
        ...prev,
        step: 'error',
        error: 'No hay datos para generar',
      }))
      return
    }

    setState((prev) => ({ ...prev, step: 'generating' }))

    await generateFeesMutation({
      variables: {
        input: {
          year: state.formData.year,
          base_fee_amount: state.formData.baseFeeAmount,
          family_fee_extra: state.formData.familyFeeExtra,
        },
      },
    })
  }, [state.formData, generateFeesMutation])

  /**
   * Reset to initial state
   */
  const reset = useCallback(() => {
    setState({
      step: 'form',
      formData: null,
      preview: null,
      result: null,
      error: null,
    })
  }, [])

  /**
   * Go back to previous step
   */
  const goBack = useCallback(() => {
    setState((prev) => ({
      ...prev,
      step: prev.step === 'preview' ? 'form' : 'form',
      error: null,
    }))
  }, [])

  return {
    state,
    generating,
    validateAndPreview,
    confirmGeneration,
    reset,
    goBack,
  }
}
