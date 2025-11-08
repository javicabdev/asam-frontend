import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Grid,
  Typography,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { DatePicker } from '@mui/x-date-pickers'
import { MemberAutocomplete } from '@/features/users/components/MemberAutocomplete'
import type { Member } from '@/graphql/generated/operations'
import { PAYMENT_METHODS } from '../types'
import type { PaymentFiltersState } from '../types'

interface PaymentFiltersProps {
  filters: PaymentFiltersState
  onFilterChange: (updates: Partial<PaymentFiltersState>) => void
  onReset: () => void
}

export function PaymentFilters({ filters, onFilterChange, onReset }: PaymentFiltersProps) {
  const { t } = useTranslation('payments')

  const [startDate, setStartDate] = useState<Date | null>(filters.startDate)
  const [endDate, setEndDate] = useState<Date | null>(filters.endDate)
  const [status, setStatus] = useState<PaymentFiltersState['status']>(filters.status)
  const [paymentMethod, setPaymentMethod] = useState<string>(filters.paymentMethod)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)

  const handleApplyFilters = () => {
    // Ajustar endDate para incluir todo el día (hasta las 23:59:59.999)
    const adjustedEndDate = endDate ? new Date(endDate) : null
    if (adjustedEndDate) {
      adjustedEndDate.setHours(23, 59, 59, 999)
    }

    const filtersToApply = {
      startDate: startDate,
      endDate: adjustedEndDate,
      status,
      paymentMethod,
      memberId: selectedMember?.miembro_id || null,
    }

    console.log('Applying filters:', filtersToApply)
    onFilterChange(filtersToApply)
  }

  const handleClearFilters = () => {
    setStartDate(null)
    setEndDate(null)
    setStatus('ALL')
    setPaymentMethod('ALL')
    setSelectedMember(null)
    onReset()
  }

  return (
    <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <SearchIcon />
        {t('filters.title')}
      </Typography>
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

        {/* Estado */}
        <Grid item xs={12} md={3}>
          <TextField
            select
            fullWidth
            size="small"
            label={t('filters.status.label')}
            value={status}
            onChange={(e) => setStatus(e.target.value as PaymentFiltersState['status'])}
          >
            <MenuItem value="ALL">{t('filters.status.all')}</MenuItem>
            <MenuItem value="PENDING">{t('filters.status.pending')}</MenuItem>
            <MenuItem value="PAID">{t('filters.status.paid')}</MenuItem>
            <MenuItem value="CANCELLED">{t('filters.status.cancelled')}</MenuItem>
          </TextField>
        </Grid>

        {/* Método de pago */}
        <Grid item xs={12} md={3}>
          <TextField
            select
            fullWidth
            size="small"
            label={t('filters.method.label')}
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <MenuItem value="ALL">{t('filters.method.all')}</MenuItem>
            {Object.entries(PAYMENT_METHODS).map(([key]) => (
              <MenuItem key={key} value={key}>
                {t(`filters.method.${key.toLowerCase()}`)}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Búsqueda de socio */}
        <Grid item xs={12} md={6}>
          <MemberAutocomplete
            value={selectedMember}
            onChange={setSelectedMember}
            label={t('filters.searchPlaceholder')}
            size="small"
          />
        </Grid>

        {/* Botones */}
        <Grid item xs={12} md={6}>
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
