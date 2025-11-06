import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Grid,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import type { CashFlowFilters as CashFlowFiltersType, OperationType } from '../types'
import { OPERATION_TYPES } from '../utils/operationTypes'
import { MemberAutocomplete } from '@/features/users/components/MemberAutocomplete'
import type { Member } from '@/graphql/generated/operations'

interface CashFlowFiltersProps {
  filters: CashFlowFiltersType
  onChange: (filters: CashFlowFiltersType) => void
}

export const CashFlowFilters = ({ filters, onChange }: CashFlowFiltersProps) => {
  const { t } = useTranslation('cashflow')

  const [startDate, setStartDate] = useState<Date | null>(
    filters.startDate ? new Date(filters.startDate) : null
  )
  const [endDate, setEndDate] = useState<Date | null>(
    filters.endDate ? new Date(filters.endDate) : null
  )
  const [operationType, setOperationType] = useState<OperationType | ''>(
    filters.operationType || ''
  )
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)

  const handleApplyFilters = () => {
    onChange({
      startDate: startDate?.toISOString() || null,
      endDate: endDate?.toISOString() || null,
      operationType: operationType || null,
      memberId: selectedMember?.miembro_id || null,
    })
  }

  const handleClearFilters = () => {
    setStartDate(null)
    setEndDate(null)
    setOperationType('')
    setSelectedMember(null)
    onChange({})
  }

  return (
    <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
      <Grid container spacing={2}>
        {/* Rango de fechas */}
        <Grid item xs={12} md={3}>
          <DatePicker
            label={t('filters.dateFrom')}
            value={startDate}
            onChange={setStartDate}
            slotProps={{
              textField: { fullWidth: true, size: 'small' },
            }}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <DatePicker
            label={t('filters.dateTo')}
            value={endDate}
            onChange={setEndDate}
            slotProps={{
              textField: { fullWidth: true, size: 'small' },
            }}
          />
        </Grid>

        {/* Tipo de operación */}
        <Grid item xs={12} md={3}>
          <TextField
            select
            fullWidth
            size="small"
            label={t('filters.operationType')}
            value={operationType}
            onChange={(e) => setOperationType(e.target.value as OperationType)}
          >
            <MenuItem value="">{t('filters.all')}</MenuItem>
            {Object.entries(OPERATION_TYPES).map(([key, config]) => (
              <MenuItem key={key} value={key}>
                {config.icon} {t(`operationTypes.${key}`)}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Búsqueda de socio */}
        <Grid item xs={12} md={3}>
          <MemberAutocomplete
            value={selectedMember}
            onChange={setSelectedMember}
            label={t('filters.member')}
          />
        </Grid>

        {/* Botones */}
        <Grid item xs={12}>
          <Box display="flex" gap={2}>
            <Button variant="contained" onClick={handleApplyFilters}>
              {t('filters.apply')}
            </Button>
            <Button variant="outlined" onClick={handleClearFilters}>
              {t('filters.clear')}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}
