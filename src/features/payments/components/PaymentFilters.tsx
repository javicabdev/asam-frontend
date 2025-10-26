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

import { PAYMENT_METHODS } from '../types'
import type { PaymentFiltersState } from '../types'

interface PaymentFiltersProps {
  filters: PaymentFiltersState
  onFilterChange: (updates: Partial<PaymentFiltersState>) => void
  onReset: () => void
}

export function PaymentFilters({ filters, onFilterChange, onReset }: PaymentFiltersProps) {
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
              label="Buscar por socio o nº socio"
              value={filters.searchTerm}
              onChange={(e) => onFilterChange({ searchTerm: e.target.value })}
              onKeyDown={handleKeyDown}
              placeholder="Buscar..."
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
              <InputLabel>Estado</InputLabel>
              <Select
                value={filters.status}
                onChange={(e) =>
                  onFilterChange({ status: e.target.value as PaymentFiltersState['status'] })
                }
                label="Estado"
              >
                <MenuItem value="ALL">Todos</MenuItem>
                <MenuItem value="PENDING">Pendiente</MenuItem>
                <MenuItem value="PAID">Pagado</MenuItem>
                <MenuItem value="CANCELLED">Cancelado</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Payment method filter */}
          <Grid item xs={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Método</InputLabel>
              <Select
                value={filters.paymentMethod}
                onChange={(e) => onFilterChange({ paymentMethod: e.target.value })}
                label="Método"
              >
                <MenuItem value="ALL">Todos</MenuItem>
                {Object.entries(PAYMENT_METHODS).map(([key, label]) => (
                  <MenuItem key={key} value={key}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Start date */}
          <Grid item xs={6} md={2}>
            <DatePicker
              label="Desde"
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
              label="Hasta"
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
                title="Limpiar filtros"
              >
                Limpiar
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </LocalizationProvider>
  )
}
