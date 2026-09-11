import type { ListAnnualFeesQuery } from '@/graphql/generated/operations'
import type { FeeGenerationFormData } from '../types'

type AnnualFeeSummary = Pick<
  ListAnnualFeesQuery['listAnnualFees'][number],
  'year' | 'base_fee_amount' | 'family_fee_extra'
>

const DEFAULT_BASE_FEE_AMOUNT = 30
const DEFAULT_FAMILY_FEE_EXTRA = 20

/**
 * Build the initial values for the annual fee generation form.
 *
 * Proposes the year after the latest existing fee, capped at the current year
 * (future years are forbidden), and copies the latest fee amounts as they are.
 * Falls back to the historical defaults when no fee exists yet.
 */
export const getDefaultFeeFormData = (
  fees: ReadonlyArray<AnnualFeeSummary>,
  currentYear: number
): FeeGenerationFormData => {
  if (fees.length === 0) {
    return {
      year: currentYear,
      baseFeeAmount: DEFAULT_BASE_FEE_AMOUNT,
      familyFeeExtra: DEFAULT_FAMILY_FEE_EXTRA,
    }
  }

  const latestFee = fees.reduce((latest, fee) =>
    fee.year > latest.year ? fee : latest
  )

  return {
    year: Math.min(latestFee.year + 1, currentYear),
    baseFeeAmount: latestFee.base_fee_amount,
    familyFeeExtra: latestFee.family_fee_extra,
  }
}
