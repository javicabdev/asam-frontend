import { useState } from 'react'
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
  const [localFilter, setLocalFilter] = useState<Partial<MemberFilter>>({})
  const [expanded, setExpanded] = useState(false)

  const handleChange = (field: keyof MemberFilter, value: any) => {
    const newValue = value === '' ? undefined : value
    const updatedFilter = {
      ...localFilter,
      [field]: newValue,
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
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
              label="Buscar por nombre, apellidos o nº socio"
              value={localFilter.search_term || ''}
              onChange={(e) => handleChange('search_term', e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Buscar..."
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
              <InputLabel>Estado</InputLabel>
              <Select
                value={localFilter.estado || ''}
                onChange={(e) => handleChange('estado', e.target.value)}
                label="Estado"
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value={MemberStatus.ACTIVE}>Activo</MenuItem>
                <MenuItem value={MemberStatus.INACTIVE}>Inactivo</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Tipo</InputLabel>
              <Select
                value={localFilter.tipo_membresia || ''}
                onChange={(e) => handleChange('tipo_membresia', e.target.value)}
                label="Tipo"
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value={MembershipType.INDIVIDUAL}>Individual</MenuItem>
                <MenuItem value={MembershipType.FAMILY}>Familiar</MenuItem>
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
                Buscar
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleClearFilters}
                startIcon={<ClearIcon />}
              >
                Limpiar
              </Button>
              <Tooltip title="Filtros avanzados (temporalmente no disponibles)">
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
          <Typography>Filtros Avanzados</Typography>
          <Typography sx={{ ml: 2, color: 'text.secondary' }}>
            (Temporalmente no disponibles)
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography color="text.secondary">
              Los filtros avanzados están temporalmente deshabilitados mientras se implementan en el
              backend.
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              Por ahora, puede usar la búsqueda general para filtrar por nombre, apellidos o número
              de socio.
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
                  onKeyPress={handleKeyPress}
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
                  onKeyPress={handleKeyPress}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Documento de identidad"
                  value={localFilter.documento_identidad || ''}
                  onChange={(e) => handleChange('documento_identidad', e.target.value)}
                  onKeyPress={handleKeyPress}
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
