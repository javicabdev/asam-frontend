import { useCallback, useRef, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridSortModel,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  esES,
} from '@mui/x-data-grid'
import { Box, Chip, IconButton, Tooltip, useTheme, TextField, InputAdornment } from '@mui/material'
import {
  Visibility as VisibilityIcon,
  CheckCircleOutline as ConfirmIcon,
  Receipt as ReceiptIcon,
  Search as SearchIcon,
} from '@mui/icons-material'

import { PaymentStatusChip } from './PaymentStatusChip'
import type { PaymentListItem } from '../types'

interface PaymentsTableProps {
  payments: PaymentListItem[]
  totalCount: number
  loading: boolean
  page: number
  pageSize: number
  searchTerm?: string
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  onSortChange?: (field: string, direction: 'ASC' | 'DESC' | null) => void
  onSearchChange?: (searchTerm: string) => void
  onRowClick?: (payment: PaymentListItem) => void
  onConfirmClick?: (payment: PaymentListItem) => void
  onDownloadReceipt?: (payment: PaymentListItem) => void
  isAdmin?: boolean
}

// Custom Toolbar component
interface CustomToolbarProps {
  searchTerm?: string
  onSearchChange?: (searchTerm: string) => void
}

function CustomToolbar({ searchTerm = '', onSearchChange }: CustomToolbarProps) {
  const { t } = useTranslation('payments')
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm)

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setLocalSearchTerm(value)
    if (onSearchChange) {
      onSearchChange(value)
    }
  }

  return (
    <GridToolbarContainer sx={{ justifyContent: 'space-between' }}>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <GridToolbarDensitySelector />
      </Box>

      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <TextField
          size="small"
          placeholder={t('table.toolbar.search')}
          value={localSearchTerm}
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
  searchTerm = '',
  onPageChange,
  onPageSizeChange,
  onSortChange,
  onSearchChange,
  onRowClick,
  onConfirmClick,
  onDownloadReceipt,
  isAdmin = false,
}: PaymentsTableProps) {
  const { t, i18n } = useTranslation('payments')
  const theme = useTheme()

  // Track if we initiated the change (to ignore reflection events)
  const changingRef = useRef(false)

  // Debounce timer for search
  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null)

  // Format currency to EUR
  const formatCurrency = (amount: number): string => {
    const locale = i18n.language === 'wo' ? 'fr-SN' : i18n.language === 'fr' ? 'fr-FR' : 'es-ES'
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'EUR',
    }).format(amount)
  }

  // Handle search change with debouncing
  const handleSearchChange = useCallback((searchValue: string) => {
    // Clear existing debounce timer
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current)
    }

    // Set new debounce timer
    searchDebounceRef.current = setTimeout(() => {
      if (onSearchChange) {
        onSearchChange(searchValue)
      }
    }, 500) // 500ms debounce
  }, [onSearchChange])

  // Filter payments locally by search term
  const filteredPayments = useMemo(() => {
    if (!searchTerm || searchTerm.trim() === '') {
      return payments
    }

    const lowerSearchTerm = searchTerm.toLowerCase().trim()
    return payments.filter((payment) => {
      const memberName = payment.memberName.toLowerCase()
      const memberNumber = payment.memberNumber.toLowerCase()

      return (
        memberName.includes(lowerSearchTerm) ||
        memberNumber.includes(lowerSearchTerm)
      )
    })
  }, [payments, searchTerm])

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
        rows={filteredPayments}
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
        slotProps={{
          toolbar: {
            searchTerm,
            onSearchChange: handleSearchChange,
          } as CustomToolbarProps,
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
