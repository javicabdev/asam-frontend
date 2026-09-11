import { getDefaultFeeFormData } from '../defaultFormData'

const CURRENT_YEAR = 2026

describe('getDefaultFeeFormData', () => {
  it('returns the defaults when there are no fees', () => {
    expect(getDefaultFeeFormData([], CURRENT_YEAR)).toEqual({
      year: CURRENT_YEAR,
      baseFeeAmount: 30,
      familyFeeExtra: 20,
    })
  })

  it('proposes the current year and copies the amounts when the latest fee is from the previous year', () => {
    const fees = [{ year: 2025, base_fee_amount: 35, family_fee_extra: 25 }]

    expect(getDefaultFeeFormData(fees, CURRENT_YEAR)).toEqual({
      year: CURRENT_YEAR,
      baseFeeAmount: 35,
      familyFeeExtra: 25,
    })
  })

  it('never proposes a future year when the latest fee is from the current year', () => {
    const fees = [{ year: CURRENT_YEAR, base_fee_amount: 40, family_fee_extra: 15 }]

    expect(getDefaultFeeFormData(fees, CURRENT_YEAR)).toEqual({
      year: CURRENT_YEAR,
      baseFeeAmount: 40,
      familyFeeExtra: 15,
    })
  })

  it('picks the fee with the highest year from an unsorted list without mutating it', () => {
    const fees = [
      { year: 2023, base_fee_amount: 30, family_fee_extra: 20 },
      { year: 2025, base_fee_amount: 50, family_fee_extra: 10 },
      { year: 2024, base_fee_amount: 45, family_fee_extra: 12 },
    ]
    const snapshot = fees.map((fee) => ({ ...fee }))

    expect(getDefaultFeeFormData(fees, CURRENT_YEAR)).toEqual({
      year: CURRENT_YEAR,
      baseFeeAmount: 50,
      familyFeeExtra: 10,
    })
    expect(fees).toEqual(snapshot)
  })

  it('keeps a family_fee_extra of 0 instead of replacing it with the default', () => {
    const fees = [{ year: 2025, base_fee_amount: 30, family_fee_extra: 0 }]

    expect(getDefaultFeeFormData(fees, CURRENT_YEAR).familyFeeExtra).toBe(0)
  })
})
