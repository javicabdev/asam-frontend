import { Chip } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Person, Group } from '@mui/icons-material'
import type { DebtorType } from '../types'

interface DebtorTypeChipProps {
  type: DebtorType
}

/**
 * Chip visual para mostrar el tipo de deudor (Individual o Familia)
 */
export function DebtorTypeChip({ type }: DebtorTypeChipProps) {
  const { t } = useTranslation('reports')

  const isIndividual = type === 'INDIVIDUAL'

  return (
    <Chip
      icon={isIndividual ? <Person /> : <Group />}
      label={t(`delinquent.debtorType.${type.toLowerCase()}`)}
      size="small"
      color={isIndividual ? 'primary' : 'secondary'}
      variant="outlined"
    />
  )
}
