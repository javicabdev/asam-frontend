import { useState } from 'react'
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
} from '@mui/material'
import {
  Clear as ClearIcon,
} from '@mui/icons-material'

import { MemberStatus, MembershipType, MemberFilter } from '../types'

interface MembersFiltersProps {
  onFilterChange: (filter: Partial<MemberFilter>) => void
}

export function MembersFilters({ onFilterChange }: MembersFiltersProps) {
  const { t } = useTranslation('members')
  const [localFilter, setLocalFilter] = useState<Partial<MemberFilter>>({})

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

    // Apply filters immediately for all fields
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

  const handleClearFilters = () => {
    // Clear local state
    setLocalFilter({})
    // Notify parent to clear all filters
    onFilterChange({})
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
              placeholder={t('filters.search')}
            />
          </Grid>

          <Grid item xs={6} md={3}>
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

          <Grid item xs={6} md={3}>
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

          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleClearFilters}
              startIcon={<ClearIcon />}
              sx={{ height: '56px' }}
            >
              {t('filters.clear')}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  )
}
