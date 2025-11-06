import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material'
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material'
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { es } from 'date-fns/locale';

import { MemberStatus, MembershipType, MemberFilter } from '../types'

// Spanish provinces - TODO: Uncomment when backend supports province filtering
/*
const PROVINCES = [
  'Álava', 'Albacete', 'Alicante', 'Almería', 'Asturias', 'Ávila', 'Badajoz', 'Barcelona',
  'Burgos', 'Cáceres', 'Cádiz', 'Cantabria', 'Castellón', 'Ciudad Real', 'Córdoba', 'Cuenca',
  'Girona', 'Granada', 'Guadalajara', 'Guipúzcoa', 'Huelva', 'Huesca', 'Islas Baleares',
  'Jaén', 'La Coruña', 'La Rioja', 'Las Palmas', 'León', 'Lérida', 'Lugo', 'Madrid',
  'Málaga', 'Murcia', 'Navarra', 'Orense', 'Palencia', 'Pontevedra', 'Salamanca',
  'Santa Cruz de Tenerife', 'Segovia', 'Sevilla', 'Soria', 'Tarragona', 'Teruel',
  'Toledo', 'Valencia', 'Valladolid', 'Vizcaya', 'Zamora', 'Zaragoza',
];
*/

interface MembersFiltersProps {
  onFilterChange: (filter: Partial<MemberFilter>) => void
}

export function MembersFilters({ onFilterChange }: MembersFiltersProps) {
  const { t } = useTranslation('members')
  const [localFilter, setLocalFilter] = useState<Partial<MemberFilter>>({})
  const [expanded, setExpanded] = useState(false)

  const handleChange = <K extends keyof MemberFilter>(
    field: K, 
    value: MemberFilter[K] | ''
  ) => {
    const newValue = value === '' ? undefined : value
    const updatedFilter = {
      ...localFilter,
      [field]: newValue as MemberFilter[K],
    }

    // Remove undefined values
    Object.keys(updatedFilter).forEach((key) => {
      if (updatedFilter[key as keyof MemberFilter] === undefined) {
        delete updatedFilter[key as keyof MemberFilter]
      }
    })

    setLocalFilter(updatedFilter)

    // Apply filters immediately for estado and tipo_membresia
    if (field === 'estado' || field === 'tipo_membresia') {
      const cleanedFilter: Partial<MemberFilter> = {}

      if (updatedFilter.estado) {
        cleanedFilter.estado = updatedFilter.estado
      }
      if (updatedFilter.tipo_membresia) {
        cleanedFilter.tipo_membresia = updatedFilter.tipo_membresia
      }
      if (updatedFilter.search_term) {
        cleanedFilter.search_term = updatedFilter.search_term
      }

      onFilterChange(cleanedFilter)
    }
  }

  const handleApplyFilters = () => {
    // Clean up empty values and only include supported fields
    const cleanedFilter: Partial<MemberFilter> = {}

    if (localFilter.estado) {
      cleanedFilter.estado = localFilter.estado
    }
    if (localFilter.tipo_membresia) {
      cleanedFilter.tipo_membresia = localFilter.tipo_membresia
    }
    if (localFilter.search_term) {
      cleanedFilter.search_term = localFilter.search_term
    }

    onFilterChange(cleanedFilter)
  }

  const handleClearFilters = () => {
    // Clear local state
    setLocalFilter({})
    // Notify parent to clear all filters
    onFilterChange({})
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApplyFilters()
    }
  }

  return (
    <Paper sx={{ mb: 3 }}>
      {/* Basic filters always visible */}
      <Box sx={{ p: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label={t('filters.searchPlaceholder')}
              value={localFilter.search_term || ''}
              onChange={(e) => handleChange('search_term', e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('filters.search')}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleApplyFilters} edge="end">
                    <SearchIcon />
                  </IconButton>
                ),
              }}
            />
          </Grid>

          <Grid item xs={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>{t('filters.status.label')}</InputLabel>
              <Select
                value={localFilter.estado || ''}
                onChange={(e) => handleChange('estado', e.target.value as MemberStatus | undefined)}
                label={t('filters.status.label')}
              >
                <MenuItem value="">{t('filters.status.all')}</MenuItem>
                <MenuItem value={MemberStatus.ACTIVE}>{t('filters.status.active')}</MenuItem>
                <MenuItem value={MemberStatus.INACTIVE}>{t('filters.status.inactive')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>{t('filters.type.label')}</InputLabel>
              <Select
                value={localFilter.tipo_membresia || ''}
                onChange={(e) => handleChange('tipo_membresia', e.target.value as MembershipType | undefined)}
                label={t('filters.type.label')}
              >
                <MenuItem value="">{t('filters.type.all')}</MenuItem>
                <MenuItem value={MembershipType.INDIVIDUAL}>{t('filters.type.individual')}</MenuItem>
                <MenuItem value={MembershipType.FAMILY}>{t('filters.type.family')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box display="flex" gap={1} alignItems="center">
              <Button
                fullWidth
                variant="contained"
                onClick={handleApplyFilters}
                startIcon={<SearchIcon />}
              >
                {t('filters.apply')}
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleClearFilters}
                startIcon={<ClearIcon />}
              >
                {t('filters.clear')}
              </Button>
              <Tooltip title={t('filters.advancedTooltip')}>
                <IconButton onClick={() => setExpanded(!expanded)} color="default">
                  <FilterListIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Advanced filters in accordion */}
      <Accordion expanded={expanded} onChange={(_, isExpanded) => setExpanded(isExpanded)}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{t('filters.advancedTitle')}</Typography>
          <Typography sx={{ ml: 2, color: 'text.secondary' }}>
            {t('filters.advancedUnavailable')}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography color="text.secondary">
              {t('filters.advancedMessage')}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              {t('filters.advancedHint')}
            </Typography>
          </Box>
          {/* TODO: Uncomment when backend supports these filters
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Población"
                  value={localFilter.poblacion || ''}
                  onChange={(e) => handleChange('poblacion', e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Provincia</InputLabel>
                  <Select
                    value={localFilter.provincia || ''}
                    onChange={(e) => handleChange('provincia', e.target.value)}
                    label="Provincia"
                  >
                    <MenuItem value="">Todas</MenuItem>
                    {PROVINCES.map((province) => (
                      <MenuItem key={province} value={province}>
                        {province}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={3}>
                <DatePicker
                  label="Fecha alta desde"
                  value={localFilter.fecha_alta_desde ? new Date(localFilter.fecha_alta_desde) : null}
                  onChange={(date) => handleChange('fecha_alta_desde', date?.toISOString())}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <DatePicker
                  label="Fecha alta hasta"
                  value={localFilter.fecha_alta_hasta ? new Date(localFilter.fecha_alta_hasta) : null}
                  onChange={(date) => handleChange('fecha_alta_hasta', date?.toISOString())}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <DatePicker
                  label="Fecha baja desde"
                  value={localFilter.fecha_baja_desde ? new Date(localFilter.fecha_baja_desde) : null}
                  onChange={(date) => handleChange('fecha_baja_desde', date?.toISOString())}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <DatePicker
                  label="Fecha baja hasta"
                  value={localFilter.fecha_baja_hasta ? new Date(localFilter.fecha_baja_hasta) : null}
                  onChange={(date) => handleChange('fecha_baja_hasta', date?.toISOString())}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Email"
                  value={localFilter.correo_electronico || ''}
                  onChange={(e) => handleChange('correo_electronico', e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Documento de identidad"
                  value={localFilter.documento_identidad || ''}
                  onChange={(e) => handleChange('documento_identidad', e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </Grid>
            </Grid>
          </LocalizationProvider>
          */}
        </AccordionDetails>
      </Accordion>
    </Paper>
  )
}
