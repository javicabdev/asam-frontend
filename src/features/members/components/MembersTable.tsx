import { useMemo, useState } from 'react';
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridSortModel,
  GridToolbar,
  GridValueGetterParams,
  GridRenderCellParams,
  GridRowParams,
  GridCellParams,
  GridColumnHeaderParams,
  GridFilterModel,
  GridRowSelectionModel,
  esES,
} from '@mui/x-data-grid';
import { 
  Chip, 
  Box, 
  Tooltip, 
  IconButton,
  LinearProgress,
  Typography,
} from '@mui/material';
import { 
  Visibility as VisibilityIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
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
  onSelectionChange?: (selectedIds: string[]) => void;
  selectable?: boolean;
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
  onSelectionChange,
  selectable = false,
}: MembersTableProps) {
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'numero_socio',
        headerName: 'Nº Socio',
        width: 110,
        sortable: true,
        renderCell: (params: GridRenderCellParams) => (
          <Tooltip title={`Ver detalles de ${params.row.nombre}`}>
            <Box
              sx={{
                cursor: 'pointer',
                fontWeight: 'medium',
                color: 'primary.main',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              {params.value}
            </Box>
          </Tooltip>
        ),
      },
      {
        field: 'nombre_completo',
        headerName: 'Nombre Completo',
        width: 250,
        sortable: true,
        valueGetter: (params: GridValueGetterParams) =>
          `${params.row.nombre} ${params.row.apellidos}`,
        renderCell: (params: GridRenderCellParams) => (
          <Box>
            <Typography variant="body2">{params.value}</Typography>
            {params.row.documento_identidad && (
              <Typography variant="caption" color="text.secondary">
                DNI: {params.row.documento_identidad}
              </Typography>
            )}
          </Box>
        ),
      },
      {
        field: 'tipo_membresia',
        headerName: 'Tipo',
        width: 120,
        sortable: true,
        filterable: true,
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
        filterable: true,
        renderCell: (params: GridRenderCellParams) => (
          <Chip
            label={params.value === MemberStatus.ACTIVE ? 'Activo' : 'Inactivo'}
            color={params.value === MemberStatus.ACTIVE ? 'success' : 'default'}
            size="small"
            variant={params.value === MemberStatus.ACTIVE ? 'filled' : 'outlined'}
          />
        ),
      },
      {
        field: 'poblacion',
        headerName: 'Población',
        width: 150,
        sortable: true,
        filterable: true,
      },
      {
        field: 'provincia',
        headerName: 'Provincia',
        width: 130,
        sortable: true,
        filterable: true,
        renderCell: (params: GridRenderCellParams) => params.value || '-',
      },
      {
        field: 'correo_electronico',
        headerName: 'Email',
        width: 200,
        sortable: false,
        filterable: true,
        renderCell: (params: GridRenderCellParams) => {
          if (!params.value) return '-';
          return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <EmailIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
              <Tooltip title={params.value}>
                <Typography variant="body2" noWrap>
                  {params.value}
                </Typography>
              </Tooltip>
            </Box>
          );
        },
      },
      {
        field: 'fecha_alta',
        headerName: 'Fecha Alta',
        width: 130,
        sortable: true,
        filterable: true,
        valueFormatter: (params) => {
          if (!params.value) return '';
          return format(new Date(params.value), 'dd/MM/yyyy', { locale: es });
        },
      },
      {
        field: 'fecha_baja',
        headerName: 'Fecha Baja',
        width: 130,
        sortable: true,
        filterable: true,
        valueFormatter: (params) => {
          if (!params.value) return '-';
          return format(new Date(params.value), 'dd/MM/yyyy', { locale: es });
        },
        renderCell: (params: GridRenderCellParams) => {
          if (!params.value) return '-';
          return (
            <Typography
              variant="body2"
              color="error"
              sx={{ fontWeight: 'medium' }}
            >
              {params.formattedValue}
            </Typography>
          );
        },
      },
      {
        field: 'actions',
        headerName: 'Acciones',
        width: 100,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params: GridRenderCellParams) => (
          <Box>
            <Tooltip title="Ver detalles">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onRowClick(params.row as Member);
                }}
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [onRowClick]
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

  const handleSelectionModelChange = (newSelectionModel: GridRowSelectionModel) => {
    setRowSelectionModel(newSelectionModel);
    if (onSelectionChange) {
      onSelectionChange(newSelectionModel as string[]);
    }
  };

  const getRowClassName = (params: GridRowParams) => {
    if (params.row.estado === MemberStatus.INACTIVE) {
      return 'inactive-row';
    }
    return '';
  };

  return (
    <Box sx={{ width: '100%' }}>
      <DataGrid
        rows={members}
        columns={columns}
        getRowId={(row) => row.miembro_id}
        rowCount={totalCount}
        loading={loading}
        pageSizeOptions={[10, 25, 50, 100]}
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
        checkboxSelection={selectable}
        rowSelectionModel={rowSelectionModel}
        onRowSelectionModelChange={handleSelectionModelChange}
        getRowClassName={getRowClassName}
        autoHeight
        density="comfortable"
        slots={{
          toolbar: GridToolbar,
          loadingOverlay: LinearProgress,
        }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
            csvOptions: {
              fileName: `socios_${format(new Date(), 'yyyy-MM-dd')}`,
              utf8WithBom: true,
            },
            printOptions: {
              hideFooter: true,
              hideToolbar: true,
            },
          },
        }}
        localeText={esES.components.MuiDataGrid.defaultProps.localeText}
        sx={{
          '& .MuiDataGrid-row': {
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          },
          '& .inactive-row': {
            backgroundColor: 'action.disabledBackground',
            '&:hover': {
              backgroundColor: 'action.disabled',
            },
          },
          '& .MuiDataGrid-columnHeader': {
            backgroundColor: 'grey.100',
            fontWeight: 'bold',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid',
            borderBottomColor: 'divider',
          },
        }}
      />
    </Box>
  );
}
