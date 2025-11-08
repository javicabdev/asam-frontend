import React, { useState } from 'react'
import {
  Box,
  TextField,
  Button,
  Alert,
  InputAdornment,
  Stack,
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useFeeValidation, type ValidationErrors } from '../hooks/useFeeValidation'
import type { FeeGenerationFormData } from '../types'

interface FeeGenerationFormProps {
  onSubmit: (data: FeeGenerationFormData) => void
  disabled?: boolean
}

export const FeeGenerationForm: React.FC<FeeGenerationFormProps> = ({
  onSubmit,
  disabled = false,
}) => {
  const { t } = useTranslation('fees')
  const { validateForm, isValid } = useFeeValidation()
  const currentYear = new Date().getFullYear()

  const [formData, setFormData] = useState<FeeGenerationFormData>({
    year: currentYear,
    baseFeeAmount: 30,
    familyFeeExtra: 10,
  })

  const [errors, setErrors] = useState<ValidationErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const handleChange = (field: keyof FeeGenerationFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value
    const numValue = field === 'year' ? parseInt(value, 10) : parseFloat(value)

    setFormData((prev) => ({
      ...prev,
      [field]: isNaN(numValue) ? 0 : numValue,
    }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleBlur = (field: keyof FeeGenerationFormData) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }))

    // Validate on blur
    const validationErrors = validateForm(formData)
    if (validationErrors[field]) {
      setErrors((prev) => ({ ...prev, [field]: validationErrors[field]! }))
    }
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    // Mark all fields as touched
    setTouched({
      year: true,
      baseFeeAmount: true,
      familyFeeExtra: true,
    })

    // Validate all fields
    const validationErrors = validateForm(formData)
    setErrors(validationErrors)

    // Submit if valid
    if (isValid(formData)) {
      onSubmit(formData)
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Stack spacing={3}>
        <Typography variant="body2" color="text.secondary">
          {t('generation.form.description')}
        </Typography>

        <TextField
          fullWidth
          required
          type="number"
          label={t('generation.form.year')}
          value={formData.year}
          onChange={handleChange('year')}
          onBlur={handleBlur('year')}
          error={touched.year && !!errors.year}
          helperText={
            touched.year && errors.year
              ? errors.year
              : t('generation.form.yearHelp')
          }
          disabled={disabled}
          inputProps={{
            min: 2000,
            max: currentYear,
          }}
        />

        <TextField
          fullWidth
          required
          type="number"
          label={t('generation.form.baseFeeAmount')}
          value={formData.baseFeeAmount}
          onChange={handleChange('baseFeeAmount')}
          onBlur={handleBlur('baseFeeAmount')}
          error={touched.baseFeeAmount && !!errors.baseFeeAmount}
          helperText={
            touched.baseFeeAmount && errors.baseFeeAmount
              ? errors.baseFeeAmount
              : t('generation.form.baseFeeAmountHelp')
          }
          disabled={disabled}
          InputProps={{
            startAdornment: <InputAdornment position="start">€</InputAdornment>,
            inputProps: { min: 0, step: 0.01 },
          }}
        />

        <TextField
          fullWidth
          type="number"
          label={t('generation.form.familyFeeExtra')}
          value={formData.familyFeeExtra}
          onChange={handleChange('familyFeeExtra')}
          onBlur={handleBlur('familyFeeExtra')}
          error={touched.familyFeeExtra && !!errors.familyFeeExtra}
          helperText={
            touched.familyFeeExtra && errors.familyFeeExtra
              ? errors.familyFeeExtra
              : t('generation.form.familyFeeExtraHelp')
          }
          disabled={disabled}
          InputProps={{
            startAdornment: <InputAdornment position="start">€</InputAdornment>,
            inputProps: { min: 0, step: 0.01 },
          }}
        />

        {Object.keys(errors).length > 0 && (
          <Alert severity="error">
            Por favor, corrige los errores antes de continuar
          </Alert>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={disabled}
          >
            {t('generation.form.continue')}
          </Button>
        </Box>
      </Stack>
    </Box>
  )
}
