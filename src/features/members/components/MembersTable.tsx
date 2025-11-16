import React, { useMemo, useState, useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridSortModel,
  GridRowParams,
  GridRowSelectionModel,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  esES,
} from '@mui/x-data-grid'
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
  TextField,
  InputAdornment,
} from '@mui/material'
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  PersonRemove as PersonRemoveIcon,
  Phone as PhoneIcon,
  FileDownload as FileDownloadIcon,
  ExpandMore as ExpandMoreIcon,
  TableChart as TableChartIcon,
  Description as DescriptionIcon,
  PersonAdd as PersonAddIcon,
  Search as SearchIcon,
} from '@mui/icons-material'
import { format } from 'date-fns'

import { Member, MemberStatus, MembershipType, MemberFilter } from '../types'
import { useExportMembers } from '@/features/members/hooks'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'

interface MembersTableProps {
  members: Member[]
  totalCount: number
  loading: boolean
  page: number
  pageSize: number
  filters?: MemberFilter
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  onSortChange: (field: string, direction: 'ASC' | 'DESC' | null) => void
  onRowClick: (member: Member) => void
  onEditClick: (member: Member) => void
  onDeactivateClick: (member: Member) => void
  onSelectionChange?: (selectedIds: string[]) => void
  onFilterChange?: (filter: Partial<MemberFilter>) => void
  selectable?: boolean
  isAdmin?: boolean
  onAddMember?: () => void
}

// Custom toolbar component
interface CustomToolbarProps {
  filters?: MemberFilter
  onExportAll: () => void
  onExportFiltered: () => void
  isExporting: boolean
  exportProgress: number
  onAddMember?: () => void
  isAdmin?: boolean
  onSearchChange?: (searchTerm: string) => void
}

function CustomToolbar({
  filters,
  onExportAll,
  onExportFiltered,
  isExporting,
  exportProgress,
  onAddMember,
  isAdmin,
  onSearchChange,
}: CustomToolbarProps) {
  const { t } = useTranslation('members')
  const { isOnline } = useOnlineStatus()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [searchTerm, setSearchTerm] = useState<string>(filters?.search_term || '')
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleExportAll = () => {
    handleClose()
    onExportAll()
  }

  const handleExportFiltered = () => {
    handleClose()
    onExportFiltered()
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSearchTerm(value)
    // Debounce the search to avoid too many API calls
    if (onSearchChange) {
      onSearchChange(value)
    }
  }

  return (
    <GridToolbarContainer sx={{ justifyContent: 'space-between' }}>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
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
          {isExporting ? t('table.exporting') + ` ${Math.round(exportProgress)}%` : t('table.export')}
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <TextField
          size="small"
          placeholder={t('table.toolbar.search')}
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 200 }}
        />
        {onAddMember && (
          <Tooltip
            title={
              !isOnline
                ? t('offlineDisabled', 'Función no disponible sin conexión')
                : !isAdmin
                  ? t('adminOnly', 'Solo los administradores pueden crear nuevos socios')
                  : ''
            }
            arrow
          >
            <span>
              <Button
                variant="contained"
                startIcon={<PersonAddIcon />}
                onClick={onAddMember}
                disabled={!isAdmin || !isOnline}
                size="small"
              >
                {t('newMember', 'Nuevo Socio')}
              </Button>
            </span>
          </Tooltip>
        )}
      </Box>

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
          {t('table.exportAll')}
        </MenuItem>

        {filters && (
          <MenuItem onClick={handleExportFiltered}>
            <TableChartIcon sx={{ mr: 1, fontSize: 20 }} />
            {t('table.exportFiltered')}
          </MenuItem>
        )}

        <Divider />

        <MenuItem disabled>
          <DescriptionIcon sx={{ mr: 1, fontSize: 20 }} />
          {t('table.exportExcel')}
        </MenuItem>
      </Menu>
    </GridToolbarContainer>
  )
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
  onEditClick,
  onDeactivateClick,
  onSelectionChange,
  onFilterChange,
  selectable = false,
  isAdmin = false,
  onAddMember,
}: MembersTableProps) {
  const { t } = useTranslation('members')
  const theme = useTheme()
  const { isOnline } = useOnlineStatus()
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([])

  // Track if we initiated the change (to ignore reflection events)
  const changingRef = useRef(false)

  // Debounce timer for search
  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null)

  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    severity: 'success' | 'error'
  }>({
    open: false,
    message: '',
    severity: 'success',
  })

  // Custom locale text for DataGrid
  const customLocaleText = {
    ...esES.components.MuiDataGrid.defaultProps.localeText,
    // Toolbar buttons
    toolbarColumns: t('table.toolbar.columns'),
    toolbarFilters: t('table.toolbar.filters'),
    toolbarDensity: t('table.toolbar.density'),
    toolbarExport: t('table.toolbar.export'),
    // Quick filter (search field in toolbar)
    toolbarQuickFilterPlaceholder: t('table.toolbar.search'),
    // Filter operators
    filterOperatorContains: t('table.filterOperators.contains'),
    filterOperatorEquals: t('table.filterOperators.equals'),
    filterOperatorStartsWith: t('table.filterOperators.startsWith'),
    filterOperatorEndsWith: t('table.filterOperators.endsWith'),
    filterOperatorIsEmpty: t('table.filterOperators.isEmpty'),
    filterOperatorIsNotEmpty: t('table.filterOperators.isNotEmpty'),
    filterOperatorIsAnyOf: t('table.filterOperators.isAnyOf'),
    // Filter panel
    filterPanelColumns: t('table.filterPanel.columns'),
    filterPanelOperator: t('table.filterPanel.operator'),
    filterPanelInputLabel: t('table.filterPanel.value'),
    filterPanelInputPlaceholder: t('table.filterPanel.filterValue'),
    // Pagination
    MuiTablePagination: {
      labelRowsPerPage: t('table.rowsPerPage'),
      labelDisplayedRows: ({ from, to, count }: { from: number; to: number; count: number }) =>
        t('table.displayedRows', { from, to, count: count !== -1 ? count : to }),
    },
    // Footer text for selected rows
    footerRowSelected: (count: number) =>
      count === 1
        ? t('table.footerRowSelected', { count })
        : t('table.footerRowSelected_plural', { count }),
  }

  // Export hook
  const {
    exportAllMembers,
    exportFilteredMembers,
    isExporting,
    exportProgress,
  } = useExportMembers({
    format: 'csv',
    onSuccess: () => {
      setSnackbar({
        open: true,
        message: t('export.success'),
        severity: 'success',
      })
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: t('export.error', { message: error.message }),
        severity: 'error',
      })
    },
    csvOptions: {
      filename: `socios_${format(new Date(), 'yyyy-MM-dd')}`,
      dateFormat: 'ES',
    },
  })

  const handleExportAll = useCallback(() => {
    void exportAllMembers()
  }, [exportAllMembers])

  const handleExportFiltered = useCallback(() => {
    if (filters) {
      void exportFilteredMembers(filters)
    }
  }, [exportFilteredMembers, filters])

  const handleSearchChange = useCallback((searchTerm: string) => {
    // Clear existing debounce timer
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current)
    }

    // Set new debounce timer
    searchDebounceRef.current = setTimeout(() => {
      if (onFilterChange) {
        onFilterChange({ search_term: searchTerm || undefined })
      }
    }, 500) // 500ms debounce
  }, [onFilterChange])

  const columns: GridColDef<Member>[] = useMemo(
    () => [
      {
        field: 'numero_socio',
        headerName: t('list.columns.memberNumber'),
        width: 110,
        sortable: true,
        renderCell: (params) => (
          <Tooltip title={`${t('list.actions.view')} ${params.row ? params.row.nombre || '' : ''}`}>
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
        headerName: t('list.columns.fullName'),
        width: 250,
        sortable: false, // Disabled because it's a computed field
        valueGetter: (params) => {
          if (!params.row) return ''
          return `${params.row.nombre || ''} ${params.row.apellidos || ''}`
        },
        renderCell: (params) => (
          <Box>
            <Typography variant="body2">{params.value || ''}</Typography>
            {params.row && params.row.documento_identidad && (
              <Typography variant="caption" color="text.secondary">
                {t('table.dni')}: {params.row.documento_identidad}
              </Typography>
            )}
          </Box>
        ),
      },
      {
        field: 'tipo_membresia',
        headerName: t('list.columns.membershipType'),
        width: 120,
        sortable: true,
        filterable: true,
        renderCell: (params) => (
          <Chip
            label={params.value === MembershipType.INDIVIDUAL ? t('form.membershipType.individual') : t('form.membershipType.family')}
            color={params.value === MembershipType.INDIVIDUAL ? 'primary' : 'secondary'}
            size="small"
          />
        ),
      },
      {
        field: 'estado',
        headerName: t('list.columns.status'),
        width: 120,
        sortable: true,
        filterable: true,
        renderCell: (params) => (
          <Chip
            label={params.value === MemberStatus.ACTIVE ? t('details.status.active') : t('details.status.inactive')}
            color={params.value === MemberStatus.ACTIVE ? 'success' : 'default'}
            size="small"
            variant={params.value === MemberStatus.ACTIVE ? 'filled' : 'outlined'}
          />
        ),
      },
      {
        field: 'telefonos',
        headerName: t('list.columns.phone'),
        width: 200,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          const telefonos = params.row?.telefonos
          if (!telefonos || telefonos.length === 0) return '-'

          // Show first phone number, with tooltip showing all if multiple
          const firstPhone = telefonos[0].numero_telefono
          const allPhones = telefonos.map(t => t.numero_telefono).join(', ')

          return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PhoneIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
              <Tooltip title={allPhones}>
                <Typography variant="body2" noWrap>
                  {firstPhone}
                  {telefonos.length > 1 && ` (+${telefonos.length - 1})`}
                </Typography>
              </Tooltip>
            </Box>
          )
        },
      },
      {
        field: 'actions',
        headerName: t('list.columns.actions'),
        width: isAdmin ? 150 : 80,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params) => (
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title={t('list.actions.view')}>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation()
                  if (params.row) {
                    onRowClick(params.row)
                  }
                }}
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            {isAdmin && (
              <>
                <Tooltip title={!isOnline ? t('offlineDisabled', 'Función no disponible sin conexión') : t('list.actions.edit')}>
                  <span>
                    <IconButton
                      size="small"
                      disabled={!isOnline}
                      onClick={(e) => {
                        e.stopPropagation()
                        if (params.row) {
                          onEditClick(params.row)
                        }
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>

                <Tooltip title={!isOnline ? t('offlineDisabled', 'Función no disponible sin conexión') : t('table.deactivate')}>
                  <span>
                    <IconButton
                      size="small"
                      disabled={params.row?.estado === MemberStatus.INACTIVE || !isOnline}
                      onClick={(e) => {
                        e.stopPropagation()
                        if (params.row) {
                          onDeactivateClick(params.row)
                        }
                      }}
                    >
                      <PersonRemoveIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              </>
            )}
          </Box>
        ),
      },
    ],
    [onRowClick, onEditClick, onDeactivateClick, isAdmin, isOnline, t]
  )

  const handlePaginationModelChange = useCallback((model: GridPaginationModel) => {
    // Ignore events while we're changing props (reflection from our own updates)
    if (changingRef.current) {
      return
    }

    const targetPage = model.page + 1 // Convert from 0-based to 1-based

    // Check what changed
    const sizeChanged = model.pageSize !== pageSize
    const pageChanged = targetPage !== page

    // Set flag before calling handlers
    changingRef.current = true

    try {
      // Priority 1: Handle pageSize change (resets to page 1)
      if (sizeChanged) {
        onPageSizeChange(model.pageSize)
        return
      }

      // Priority 2: Handle page change (only if size didn't change)
      if (pageChanged) {
        onPageChange(targetPage)
      }
    } finally {
      // Reset flag after a tick (allow React to update)
      setTimeout(() => {
        changingRef.current = false
      }, 0)
    }
  }, [page, pageSize, onPageChange, onPageSizeChange])

  const handleSortModelChange = (model: GridSortModel) => {
    if (model.length > 0) {
      const { field, sort } = model[0]
      // Convert MUI DataGrid sort ('asc'/'desc') to GraphQL format ('ASC'/'DESC')
      const direction = sort ? (sort.toUpperCase() as 'ASC' | 'DESC') : null

      // Map frontend field names to backend database column names
      const fieldMapping: Record<string, string> = {
        numero_socio: 'membership_number',
        tipo_membresia: 'membership_type',
        estado: 'state',
        poblacion: 'city',
        provincia: 'province',
        fecha_alta: 'registration_date',
        fecha_baja: 'leaving_date',
      }

      const mappedField = fieldMapping[field] || field
      onSortChange(mappedField, direction)
    } else {
      onSortChange('', null)
    }
  }

  const handleSelectionModelChange = (newSelectionModel: GridRowSelectionModel) => {
    setRowSelectionModel(newSelectionModel)
    if (onSelectionChange) {
      onSelectionChange(newSelectionModel as string[])
    }
  }

  const getRowClassName = (params: GridRowParams<Member>) => {
    if (params.row.estado === MemberStatus.INACTIVE) {
      return 'inactive-row'
    }
    return ''
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <DataGrid
        rows={members}
        columns={columns}
        getRowId={(row) => row.miembro_id}
        rowCount={totalCount}
        loading={loading}
        pageSizeOptions={[10, 25, 50, 100]}
        paginationModel={{
          page: page - 1,  // Convert 1-based to 0-based
          pageSize,
        }}
        onPaginationModelChange={handlePaginationModelChange}
        onSortModelChange={handleSortModelChange}
        paginationMode="server"
        sortingMode="server"
        onRowClick={(params) => {
          if (params.row) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            onRowClick(params.row)
          }
        }}
        disableRowSelectionOnClick
        checkboxSelection={selectable}
        rowSelectionModel={rowSelectionModel}
        onRowSelectionModelChange={handleSelectionModelChange}
        getRowClassName={getRowClassName}
        density="comfortable"
        slots={{
          toolbar: CustomToolbar,
          loadingOverlay: LinearProgress,
        }}
        slotProps={{
          toolbar: {
            filters,
            onExportAll: handleExportAll,
            onExportFiltered: handleExportFiltered,
            isExporting,
            exportProgress,
            onAddMember,
            isAdmin,
            onSearchChange: handleSearchChange,
          } as CustomToolbarProps,
        }}
        localeText={customLocaleText}
        sx={{
          '& .MuiDataGrid-row': {
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          },
          '& .inactive-row': {
            backgroundColor:
              theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.04)',
            '&:hover': {
              backgroundColor:
                theme.palette.mode === 'light'
                  ? 'rgba(0, 0, 0, 0.08)'
                  : 'rgba(255, 255, 255, 0.08)',
            },
          },
          // Encabezados de columna con colores adaptativos
          '& .MuiDataGrid-columnHeader': {
            backgroundColor:
              theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
            color:
              theme.palette.mode === 'light'
                ? theme.palette.text.primary
                : theme.palette.text.primary,
            fontWeight: 'bold',
            borderBottom: `1px solid ${theme.palette.divider}`,
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 600,
            color:
              theme.palette.mode === 'light'
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
            backgroundColor:
              theme.palette.mode === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
            borderTop: `1px solid ${theme.palette.divider}`,
          },
          // Iconos de ordenamiento
          '& .MuiDataGrid-sortIcon': {
            color:
              theme.palette.mode === 'light'
                ? theme.palette.text.secondary
                : theme.palette.text.secondary,
          },
          '& .MuiDataGrid-menuIconButton': {
            color:
              theme.palette.mode === 'light'
                ? theme.palette.text.secondary
                : theme.palette.text.secondary,
          },
          // Checkboxes
          '& .MuiDataGrid-checkboxInput': {
            color:
              theme.palette.mode === 'light'
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
            backgroundColor:
              theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)',
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
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}
