import { useState } from 'react';
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
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';

import { MemberStatus, MembershipType, MemberFilter } from '../types';

interface MembersFiltersProps {
  onFilterChange: (filter: Partial<MemberFilter>) => void;
}

export function MembersFilters({ onFilterChange }: MembersFiltersProps) {
  const [localFilter, setLocalFilter] = useState<Partial<MemberFilter>>({});

  const handleChange = (field: keyof MemberFilter, value: any) => {
    setLocalFilter((prev) => ({
      ...prev,
      [field]: value || undefined,
    }));
  };

  const handleApplyFilters = () => {
    onFilterChange(localFilter);
  };

  const handleClearFilters = () => {
    setLocalFilter({});
    onFilterChange({});
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Buscar por nombre, apellidos o nº socio"
            value={localFilter.search_term || ''}
            onChange={(e) => handleChange('search_term', e.target.value)}
            placeholder="Buscar..."
          />
        </Grid>

        <Grid item xs={12} sm={3}>
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

        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Tipo Membresía</InputLabel>
            <Select
              value={localFilter.tipo_membresia || ''}
              onChange={(e) => handleChange('tipo_membresia', e.target.value)}
              label="Tipo Membresía"
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value={MembershipType.INDIVIDUAL}>Individual</MenuItem>
              <MenuItem value={MembershipType.FAMILY}>Familiar</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={2}>
          <Box display="flex" gap={1}>
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
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}
