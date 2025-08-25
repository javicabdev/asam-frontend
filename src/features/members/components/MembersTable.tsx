import React, { useMemo, useState, useCallback } from 'react';
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridSortModel,
  GridValueGetterParams,
  GridRenderCellParams,
  GridRowParams,
  GridRowSelectionModel,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
  esES,
} from '@mui/x-data-grid';
import { 
  Chip, 
  Box, 
  Tooltip, 
  IconButton,
  LinearProgress,
  Typography,
  Button,
  Menu,
  MenuItem,
  Divider,
  CircularProgress,
  Alert,
  Snackbar,
  useTheme,
} from '@mui/material';
import { 
  Visibility as VisibilityIcon,
  Email as EmailIcon,
  FileDownload as FileDownloadIcon,
  ExpandMore as ExpandMoreIcon,
  TableChart as TableChartIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { Member, MemberStatus, MembershipType } from '../types';
import { useExportMembers } from '@/features/members/hooks';
import { MemberFilter } from '@/graphql/generated/operations';

interface MembersTableProps {
  members: Member[];
  totalCount: number;
  loading: boolean;
  page: number;
  pageSize: number;
  filters?: MemberFilter;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSortChange: (field: string, direction: 'ASC' | 'DESC' | null) => void;
  onRowClick: (member: Member) => void;
  onSelectionChange?: (selectedIds: string[]) => void;
  selectable?: boolean;
}

// Custom toolbar component
interface CustomToolbarProps {
  selectedCount: number;
  filters?: MemberFilter;
  onExportAll: () => void;
  onExportFiltered: () => void;
  onExportSelected: () => void;
  isExporting: boolean;
  exportProgress: number;
}

function CustomToolbar({
  selectedCount,
  filters,
  onExportAll,
  onExportFiltered,
  onExportSelected,
  isExporting,
  exportProgress,
}: CustomToolbarProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExportAll = () => {
    handleClose();
    onExportAll();
  };

  const handleExportFiltered = () => {
    handleClose();
    onExportFiltered();
  };

  const handleExportSelected = () => {
    handleClose();
    onExportSelected();
  };

  return (
    <GridToolbarContainer sx={{ justifyContent: 'space-between' }}>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <Divider orientation="vertical" flexItem />
        
        {/* Export button */}
        <Button
          variant="outlined"
          size="small"
          startIcon={isExporting ? <CircularProgress size={16} /> : <FileDownloadIcon />}
          endIcon={<ExpandMoreIcon />}
          onClick={handleClick}
          disabled={isExporting}
        >
          {isExporting ? `Exportando... ${Math.round(exportProgress)}%` : 'Exportar'}
        </Button>
        
        {selectedCount > 0 && (
          <Typography variant="body2" color="text.secondary">
            {selectedCount} seleccionado{selectedCount > 1 ? 's' : ''}
          </Typography>
        )}
      </Box>
      
      <GridToolbarQuickFilter debounceMs={500} />
      
      {/* Export menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={handleExportAll}>
          <TableChartIcon sx={{ mr: 1, fontSize: 20 }} />
          Exportar todos los socios
        </MenuItem>
        
        {filters && (
          <MenuItem onClick={handleExportFiltered}>
            <TableChartIcon sx={{ mr: 1, fontSize: 20 }} />
            Exportar socios filtrados
          </MenuItem>
        )}
        
        {selectedCount > 0 && (
          <MenuItem onClick={handleExportSelected}>
            <TableChartIcon sx={{ mr: 1, fontSize: 20 }} />
            Exportar {selectedCount} seleccionado{selectedCount > 1 ? 's' : ''}
          </MenuItem>
        )}
        
        <Divider />
        
        <MenuItem disabled>
          <DescriptionIcon sx={{ mr: 1, fontSize: 20 }} />
          Exportar a Excel (próximamente)
        </MenuItem>
      </Menu>
    </GridToolbarContainer>
  );
}

export function MembersTable({
  members,
  totalCount,
  loading,
  page,
  pageSize,
  filters,
  onPageChange,
  onPageSizeChange,
  onSortChange,
  onRowClick,
  onSelectionChange,
  selectable = false,
}: MembersTableProps) {
  const theme = useTheme();
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Export hook
  const {
    exportAllMembers,
    exportFilteredMembers,
    exportSelectedMembers,
    isExporting,
    exportProgress,
  } = useExportMembers({
    format: 'csv',
    onSuccess: () => {
      setSnackbar({
        open: true,
        message: 'Exportación completada exitosamente',
        severity: 'success',
      });
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: `Error al exportar: ${error.message}`,
        severity: 'error',
      });
    },
    csvOptions: {
      filename: `socios_${format(new Date(), 'yyyy-MM-dd')}`,
      dateFormat: 'ES',
    },
  });

  const handleExportAll = useCallback(() => {
    exportAllMembers();
  }, [exportAllMembers]);

  const handleExportFiltered = useCallback(() => {
    if (filters) {
      exportFilteredMembers(filters);
    }
  }, [exportFilteredMembers, filters]);

  const handleExportSelected = useCallback(() => {
    const selectedIds = rowSelectionModel as string[];
    if (selectedIds.length > 0) {
      exportSelectedMembers(selectedIds, filters);
    }
  }, [exportSelectedMembers, rowSelectionModel, filters]);

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

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
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
          toolbar: CustomToolbar,
          loadingOverlay: LinearProgress,
        }}
        slotProps={{
          toolbar: {
            selectedCount: rowSelectionModel.length,
            filters,
            onExportAll: handleExportAll,
            onExportFiltered: handleExportFiltered,
            onExportSelected: handleExportSelected,
            isExporting,
            exportProgress,
          } as CustomToolbarProps,
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
            backgroundColor: theme.palette.mode === 'light' 
              ? 'rgba(0, 0, 0, 0.04)' 
              : 'rgba(255, 255, 255, 0.04)',
            '&:hover': {
              backgroundColor: theme.palette.mode === 'light'
                ? 'rgba(0, 0, 0, 0.08)'
                : 'rgba(255, 255, 255, 0.08)',
            },
          },
          // Encabezados de columna con colores adaptativos
          '& .MuiDataGrid-columnHeader': {
            backgroundColor: theme.palette.mode === 'light'
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
            color: theme.palette.mode === 'light'
              ? theme.palette.text.primary
              : theme.palette.text.primary,
            fontWeight: 'bold',
            borderBottom: `1px solid ${theme.palette.divider}`,
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 600,
            color: theme.palette.mode === 'light'
              ? theme.palette.text.primary
              : theme.palette.text.primary,
          },
          // Separador de columna
          '& .MuiDataGrid-columnSeparator': {
            color: theme.palette.divider,
          },
          // Celdas
          '& .MuiDataGrid-cell': {
            borderBottom: `1px solid ${theme.palette.divider}`,
            color: theme.palette.text.primary,
          },
          // Toolbar
          '& .MuiDataGrid-toolbar': {
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          },
          // Footer/Pagination
          '& .MuiDataGrid-footerContainer': {
            backgroundColor: theme.palette.mode === 'light'
              ? theme.palette.grey[50]
              : theme.palette.grey[900],
            borderTop: `1px solid ${theme.palette.divider}`,
          },
          // Iconos de ordenamiento
          '& .MuiDataGrid-sortIcon': {
            color: theme.palette.mode === 'light'
              ? theme.palette.text.secondary
              : theme.palette.text.secondary,
          },
          '& .MuiDataGrid-menuIconButton': {
            color: theme.palette.mode === 'light'
              ? theme.palette.text.secondary
              : theme.palette.text.secondary,
          },
          // Checkboxes
          '& .MuiDataGrid-checkboxInput': {
            color: theme.palette.mode === 'light'
              ? theme.palette.primary.main
              : theme.palette.primary.light,
          },
          // Panel de filtros
          '& .MuiDataGrid-panel': {
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          },
          // Overlay cuando no hay datos
          '& .MuiDataGrid-overlay': {
            backgroundColor: theme.palette.mode === 'light'
              ? 'rgba(255, 255, 255, 0.9)'
              : 'rgba(0, 0, 0, 0.9)',
          },
        }}
      />
      
      {/* Snackbar for export feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
