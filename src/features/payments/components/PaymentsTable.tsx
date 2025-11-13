import { useCallback, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridSortModel,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
  esES,
} from '@mui/x-data-grid'
import { Box, Chip, IconButton, Tooltip, useTheme } from '@mui/material'
import {
  Visibility as VisibilityIcon,
  CheckCircleOutline as ConfirmIcon,
  Receipt as ReceiptIcon,
  Edit as EditIcon,
} from '@mui/icons-material'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

import { PaymentStatusChip } from './PaymentStatusChip'
import type { PaymentListItem } from '../types'

interface PaymentsTableProps {
  payments: PaymentListItem[]
  totalCount: number
  loading: boolean
  page: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  onSortChange?: (field: string, direction: 'ASC' | 'DESC' | null) => void
  onRowClick?: (payment: PaymentListItem) => void
  onConfirmClick?: (payment: PaymentListItem) => void
  onEditClick?: (payment: PaymentListItem) => void
  onDownloadReceipt?: (payment: PaymentListItem) => void
  isAdmin?: boolean
}

// Custom Toolbar component
function CustomToolbar() {
  return (
    <GridToolbarContainer sx={{ justifyContent: 'space-between' }}>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
      </Box>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <GridToolbarQuickFilter debounceMs={500} />
      </Box>
    </GridToolbarContainer>
  )
}

/**
 * Table component to display payments with DataGrid
 */
export function PaymentsTable({
  payments,
  totalCount,
  loading,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onSortChange,
  onRowClick,
  onConfirmClick,
  onEditClick,
  onDownloadReceipt,
  isAdmin = false,
}: PaymentsTableProps) {
  const { t, i18n } = useTranslation('payments')
  const theme = useTheme()

  // Track if we initiated the change (to ignore reflection events)
  const changingRef = useRef(false)

  // Format currency to EUR
  const formatCurrency = (amount: number): string => {
    const locale = i18n.language === 'wo' ? 'fr-SN' : i18n.language === 'fr' ? 'fr-FR' : 'es-ES'
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'EUR',
    }).format(amount)
  }

  // Format date to DD/MM/YYYY HH:mm
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return ''
    try {
      // Use parseISO to correctly parse ISO date strings
      const date = parseISO(dateString)
      // Check if date is valid
      if (isNaN(date.getTime())) return ''

      // Check if this looks like a date-only value (stored as UTC midnight)
      // When backend stores a date without time as UTC 00:00:00Z, it becomes 01:00 or 02:00 in local time
      const hours = date.getHours()
      const minutes = date.getMinutes()
      const seconds = date.getSeconds()

      // If it's midnight (00:00:00) or 01:00:00/02:00:00 with no minutes/seconds (UTC conversion artifact)
      const isProbablyDateOnly =
        (hours === 0 && minutes === 0 && seconds === 0) || // Midnight local
        ((hours === 1 || hours === 2) && minutes === 0 && seconds === 0) // UTC midnight -> local conversion

      // If it looks like a date-only, show only date; otherwise show date and time
      return isProbablyDateOnly
        ? format(date, 'dd/MM/yyyy', { locale: es })
        : format(date, 'dd/MM/yyyy HH:mm', { locale: es })
    } catch {
      return ''
    }
  }

  // Column definitions
  const columns: GridColDef<PaymentListItem>[] = [
    {
      field: 'memberNumber',
      headerName: t('table.memberNumber'),
      width: 120,
      sortable: true,
    },
    {
      field: 'memberName',
      headerName: t('table.member'),
      flex: 1,
      minWidth: 200,
      sortable: true,
      renderCell: (params) => (
        <Box>
          <Box sx={{ fontWeight: 500 }}>{params.value}</Box>
          {params.row.familyName && (
            <Chip
              label={t('table.family')}
              size="small"
              sx={{
                height: 18,
                fontSize: '0.65rem',
                mt: 0.5,
                backgroundColor: theme.palette.info.light,
                color: theme.palette.info.contrastText,
              }}
            />
          )}
        </Box>
      ),
    },
    {
      field: 'amount',
      headerName: t('table.amount'),
      width: 120,
      sortable: true,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => (
        <Box sx={{ fontWeight: 600, color: theme.palette.success.main }}>
          {formatCurrency(params.value)}
        </Box>
      ),
    },
    {
      field: 'membershipFeeYear',
      headerName: t('table.annualFee'),
      width: 130,
      sortable: true,
      renderCell: (params) => {
        if (!params.value) return t('table.otherPayment')
        return t('table.annualFeeYear', { year: params.value })
      },
    },
    {
      field: 'paymentDate',
      headerName: t('table.date'),
      width: 150,
      sortable: true,
      renderCell: (params) => formatDate(params.value),
    },
    {
      field: 'paymentMethod',
      headerName: t('table.paymentMethod'),
      width: 130,
      sortable: true,
      renderCell: (params) => {
        if (!params.value) return ''
        return t(`table.paymentMethods.${params.value}`) || params.value
      },
    },
    {
      field: 'status',
      headerName: t('table.status'),
      width: 130,
      sortable: true,
      renderCell: (params) => <PaymentStatusChip status={params.value} />,
    },
    {
      field: 'actions',
      headerName: t('table.actions'),
      width: isAdmin ? 220 : 150,
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title={t('table.viewDetails')}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation()
                onRowClick?.(params.row)
              }}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {params.row.status.toUpperCase() === 'PAID' && (
            <>
              <Tooltip title={t('table.downloadReceipt')}>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDownloadReceipt?.(params.row)
                  }}
                >
                  <ReceiptIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              {isAdmin && (
                <Tooltip title={t('table.editPayment')}>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation()
                      onEditClick?.(params.row)
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </>
          )}

          {isAdmin && params.row.status.toUpperCase() === 'PENDING' && (
            <Tooltip title={t('table.confirmPayment')}>
              <IconButton
                size="small"
                color="success"
                onClick={(e) => {
                  e.stopPropagation()
                  onConfirmClick?.(params.row)
                }}
              >
                <ConfirmIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ]

  // Handle pagination changes
  const handlePaginationChange = useCallback(
    (model: GridPaginationModel) => {
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
    },
    [page, pageSize, onPageChange, onPageSizeChange]
  )

  // Handle sort changes
  const handleSortChange = (model: GridSortModel) => {
    if (!onSortChange) return

    if (model.length === 0) {
      onSortChange('', null)
    } else {
      const { field, sort } = model[0]
      onSortChange(field, sort?.toUpperCase() as 'ASC' | 'DESC')
    }
  }

  // Handle row click
  const handleRowClick = (params: any) => {
    onRowClick?.(params.row)
  }

  // Custom locale text for DataGrid
  const customLocaleText = useMemo(
    () => ({
      ...esES.components.MuiDataGrid.defaultProps.localeText,
      toolbarColumns: t('table.toolbar.columns'),
      toolbarFilters: t('table.toolbar.filters'),
      toolbarDensity: t('table.toolbar.density'),
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
      MuiTablePagination: {
        labelRowsPerPage: t('table.rowsPerPage'),
        labelDisplayedRows: ({ from, to, count }: { from: number; to: number; count: number }) =>
          t('table.displayedRows', { from, to, count: count !== -1 ? count : to }),
      },
    }),
    [t]
  )

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <DataGrid
        rows={payments}
        columns={columns}
        loading={loading}
        pageSizeOptions={[10, 25, 50, 100]}
        paginationMode="server"
        sortingMode="server"
        rowCount={totalCount}
        paginationModel={{
          page: page - 1, // DataGrid uses 0-based indexing
          pageSize,
        }}
        onPaginationModelChange={handlePaginationChange}
        onSortModelChange={handleSortChange}
        onRowClick={handleRowClick}
        disableRowSelectionOnClick
        slots={{
          toolbar: CustomToolbar,
        }}
        localeText={customLocaleText}
        sx={{
          cursor: 'pointer',
          '& .MuiDataGrid-row': {
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          },
          // Header styling
          '& .MuiDataGrid-columnHeader': {
            backgroundColor:
              theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
            fontWeight: 'bold',
            borderBottom: `1px solid ${theme.palette.divider}`,
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 600,
          },
          // Cell styling
          '& .MuiDataGrid-cell': {
            borderBottom: `1px solid ${theme.palette.divider}`,
          },
          // Footer styling
          '& .MuiDataGrid-footerContainer': {
            backgroundColor:
              theme.palette.mode === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
            borderTop: `1px solid ${theme.palette.divider}`,
          },
          // Empty overlay
          '& .MuiDataGrid-overlay': {
            backgroundColor:
              theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)',
          },
        }}
      />
    </Box>
  )
}
