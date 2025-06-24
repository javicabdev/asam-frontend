import { useMemo } from 'react';
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridSortModel,
  GridToolbar,
  GridValueGetterParams,
  GridRenderCellParams,
} from '@mui/x-data-grid';
import { Chip, Box } from '@mui/material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { Member, MemberStatus, MembershipType } from '../types';

interface MembersTableProps {
  members: Member[];
  totalCount: number;
  loading: boolean;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSortChange: (field: string, direction: 'ASC' | 'DESC' | null) => void;
  onRowClick: (member: Member) => void;
}

export function MembersTable({
  members,
  totalCount,
  loading,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onSortChange,
  onRowClick,
}: MembersTableProps) {
  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'numero_socio',
        headerName: 'Nº Socio',
        width: 120,
        sortable: true,
      },
      {
        field: 'nombre_completo',
        headerName: 'Nombre Completo',
        width: 250,
        sortable: true,
        valueGetter: (params: GridValueGetterParams) =>
          `${params.row.nombre} ${params.row.apellidos}`,
      },
      {
        field: 'tipo_membresia',
        headerName: 'Tipo',
        width: 120,
        sortable: true,
        renderCell: (params: GridRenderCellParams) => (
          <Chip
            label={params.value === MembershipType.INDIVIDUAL ? 'Individual' : 'Familiar'}
            color={params.value === MembershipType.INDIVIDUAL ? 'primary' : 'secondary'}
            size="small"
          />
        ),
      },
      {
        field: 'estado',
        headerName: 'Estado',
        width: 120,
        sortable: true,
        renderCell: (params: GridRenderCellParams) => (
          <Chip
            label={params.value === MemberStatus.ACTIVE ? 'Activo' : 'Inactivo'}
            color={params.value === MemberStatus.ACTIVE ? 'success' : 'default'}
            size="small"
          />
        ),
      },
      {
        field: 'poblacion',
        headerName: 'Población',
        width: 150,
        sortable: false,
      },
      {
        field: 'correo_electronico',
        headerName: 'Email',
        width: 200,
        sortable: false,
      },
      {
        field: 'fecha_alta',
        headerName: 'Fecha Alta',
        width: 130,
        sortable: true,
        valueFormatter: (params) => {
          if (!params.value) return '';
          return format(new Date(params.value), 'dd/MM/yyyy', { locale: es });
        },
      },
    ],
    []
  );

  const handlePaginationModelChange = (model: GridPaginationModel) => {
    if (model.page !== page - 1) {
      onPageChange(model.page + 1);
    }
    if (model.pageSize !== pageSize) {
      onPageSizeChange(model.pageSize);
    }
  };

  const handleSortModelChange = (model: GridSortModel) => {
    if (model.length > 0) {
      const { field, sort } = model[0];
      onSortChange(field, sort as 'ASC' | 'DESC' | null);
    } else {
      onSortChange('', null);
    }
  };

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <DataGrid
        rows={members}
        columns={columns}
        getRowId={(row) => row.miembro_id}
        rowCount={totalCount}
        loading={loading}
        pageSizeOptions={[10, 25, 50]}
        paginationModel={{
          page: page - 1,
          pageSize,
        }}
        onPaginationModelChange={handlePaginationModelChange}
        onSortModelChange={handleSortModelChange}
        paginationMode="server"
        sortingMode="server"
        onRowClick={(params) => onRowClick(params.row as Member)}
        disableRowSelectionOnClick
        slots={{
          toolbar: GridToolbar,
        }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        localeText={{
          // Spanish translations
          noRowsLabel: 'No hay socios',
          toolbarDensity: 'Densidad',
          toolbarDensityLabel: 'Densidad',
          toolbarDensityCompact: 'Compacta',
          toolbarDensityStandard: 'Estándar',
          toolbarDensityComfortable: 'Cómoda',
          toolbarColumns: 'Columnas',
          toolbarFilters: 'Filtros',
          toolbarExport: 'Exportar',
          toolbarQuickFilterPlaceholder: 'Buscar...',
        }}
      />
    </Box>
  );
}
