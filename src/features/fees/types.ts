import type {
  GenerateAnnualFeesInput,
  GenerateAnnualFeesResponse,
  PaymentGenerationDetail,
} from '@/graphql/generated/schema'

// Re-export types from generated schema
export type { GenerateAnnualFeesInput, GenerateAnnualFeesResponse, PaymentGenerationDetail }

/**
 * Form data for generating annual fees
 */
export interface FeeGenerationFormData {
  year: number
  baseFeeAmount: number
  familyFeeExtra: number
}

/**
 * State machine for fee generation flow
 */
export type FeeGenerationStep = 'form' | 'preview' | 'generating' | 'result' | 'error'

export interface FeeGenerationState {
  step: FeeGenerationStep
  formData: FeeGenerationFormData | null
  preview: FeeGenerationPreview | null
  result: GenerateAnnualFeesResponse | null
  error: string | null
}

/**
 * Preview data before confirming generation
 */
export interface FeeGenerationPreview {
  year: number
  baseFeeAmount: number
  familyFeeExtra: number
  // Note: estimations are calculated client-side or could come from a preview query
  estimatedTotalMembers: number
  estimatedIndividualMembers: number
  estimatedFamilyMembers: number
  estimatedTotalAmount: number
  feeExists: boolean
}

/**
 * Summary of generation result for UI display
 */
export interface FeeGenerationSummary {
  year: number
  membershipFeeId: string
  paymentsGenerated: number
  paymentsExisting: number
  totalMembers: number
  totalExpectedAmount: number
  successCount: number
  errorCount: number
  details: PaymentGenerationDetail[]
}
