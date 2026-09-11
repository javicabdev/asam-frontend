import React from 'react'
import { Alert, Box, CircularProgress } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useListAnnualFeesQuery } from '@/graphql/generated/operations'
import { getDefaultFeeFormData } from '../utils/defaultFormData'
import { FeeGenerationForm } from './FeeGenerationForm'
import type { FeeGenerationFormData } from '../types'

interface FeeGenerationFormStepProps {
  savedFormData: FeeGenerationFormData | null
  onSubmit: (data: FeeGenerationFormData, existingYears: readonly number[]) => void
  disabled?: boolean
}

/**
 * Form step of the fee generation flow.
 *
 * Loads the existing annual fees so the form can be prefilled from the latest
 * one and the preview can flag when the chosen year already has a fee.
 * Financial data: always fetched from the network, never from the cache.
 */
export const FeeGenerationFormStep: React.FC<FeeGenerationFormStepProps> = ({
  savedFormData,
  onSubmit,
  disabled = false,
}) => {
  const { t } = useTranslation('fees')
  const { data, error } = useListAnnualFeesQuery({ fetchPolicy: 'network-only' })

  if (error) {
    return <Alert severity="error">{t('list.error')}</Alert>
  }

  if (!data) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    )
  }

  const fees = data.listAnnualFees
  const existingYears = fees.map((f) => f.year)

  return (
    <FeeGenerationForm
      initialValues={savedFormData ?? getDefaultFeeFormData(fees, new Date().getFullYear())}
      onSubmit={(d) => onSubmit(d, existingYears)}
      disabled={disabled}
    />
  )
}
