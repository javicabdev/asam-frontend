import React from 'react'
import {
  Paper,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  IconButton,
} from '@mui/material'
import {
  Search as SearchIcon,
  Clear as ClearIcon,
} from '@mui/icons-material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { es } from 'date-fns/locale'
import { useTranslation } from 'react-i18next'

import { PAYMENT_METHODS } from '../types'
import type { PaymentFiltersState } from '../types'

interface PaymentFiltersProps {
  filters: PaymentFiltersState
  onFilterChange: (updates: Partial<PaymentFiltersState>) => void
  onReset: () => void
}

export function PaymentFilters({ filters, onFilterChange, onReset }: PaymentFiltersProps) {
  const { t } = useTranslation('payments')

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      // Trigger search (filters are already applied on change)
      e.preventDefault()
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Paper sx={{ mb: 3, p: 3 }}>
        <Grid container spacing={2} alignItems="center">
          {/* Search field */}
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label={t('filters.searchPlaceholder')}
              value={filters.searchTerm}
              onChange={(e) => onFilterChange({ searchTerm: e.target.value })}
              onKeyDown={handleKeyDown}
              placeholder={t('filters.search')}
              InputProps={{
                endAdornment: (
                  <IconButton edge="end" size="small">
                    <SearchIcon />
                  </IconButton>
                ),
              }}
            />
          </Grid>

          {/* Status filter */}
          <Grid item xs={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>{t('filters.status.label')}</InputLabel>
              <Select
                value={filters.status}
                onChange={(e) =>
                  onFilterChange({ status: e.target.value as PaymentFiltersState['status'] })
                }
                label={t('filters.status.label')}
              >
                <MenuItem value="ALL">{t('filters.status.all')}</MenuItem>
                <MenuItem value="PENDING">{t('filters.status.pending')}</MenuItem>
                <MenuItem value="PAID">{t('filters.status.paid')}</MenuItem>
                <MenuItem value="CANCELLED">{t('filters.status.cancelled')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Payment method filter */}
          <Grid item xs={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>{t('filters.method.label')}</InputLabel>
              <Select
                value={filters.paymentMethod}
                onChange={(e) => onFilterChange({ paymentMethod: e.target.value })}
                label={t('filters.method.label')}
              >
                <MenuItem value="ALL">{t('filters.method.all')}</MenuItem>
                {Object.entries(PAYMENT_METHODS).map(([key]) => (
                  <MenuItem key={key} value={key}>
                    {t(`filters.method.${key.toLowerCase()}`)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Start date */}
          <Grid item xs={6} md={2}>
            <DatePicker
              label={t('filters.dateFrom')}
              value={filters.startDate}
              onChange={(date) => onFilterChange({ startDate: date })}
              slotProps={{
                textField: {
                  fullWidth: true,
                },
              }}
            />
          </Grid>

          {/* End date */}
          <Grid item xs={6} md={2}>
            <DatePicker
              label={t('filters.dateTo')}
              value={filters.endDate}
              onChange={(date) => onFilterChange({ endDate: date })}
              slotProps={{
                textField: {
                  fullWidth: true,
                },
              }}
            />
          </Grid>

          {/* Action buttons */}
          <Grid item xs={12} md={1}>
            <Box display="flex" gap={1}>
              <Button
                fullWidth
                variant="outlined"
                onClick={onReset}
                startIcon={<ClearIcon />}
                title={t('filters.clearTooltip')}
              >
                {t('filters.clear')}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </LocalizationProvider>
  )
}
