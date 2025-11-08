import { useTranslation } from 'react-i18next'
import { DataGrid, GridColDef, GridPaginationModel, GridSortModel } from '@mui/x-data-grid'
import { Box, Chip, IconButton, Tooltip, useTheme } from '@mui/material'
import {
  Visibility as VisibilityIcon,
  CheckCircleOutline as ConfirmIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material'
import { format } from 'date-fns'
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
  onDownloadReceipt?: (payment: PaymentListItem) => void
  isAdmin?: boolean
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
  onDownloadReceipt,
  isAdmin = false,
}: PaymentsTableProps) {
  const { t, i18n } = useTranslation('payments')
  const theme = useTheme()

  // Format currency to EUR
  const formatCurrency = (amount: number): string => {
    const locale = i18n.language === 'wo' ? 'fr-SN' : i18n.language === 'fr' ? 'fr-FR' : 'es-ES'
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'EUR',
    }).format(amount)
  }

  // Format date to DD/MM/YYYY
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return ''
    try {
      const date = new Date(dateString)
      // Check if date is valid
      if (isNaN(date.getTime())) return ''
      return format(date, 'dd/MM/yyyy', { locale: es })
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
      width: 120,
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
      width: isAdmin ? 180 : 110,
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
  const handlePaginationChange = (model: GridPaginationModel) => {
    if (model.page !== page - 1) {
      onPageChange(model.page + 1) // DataGrid uses 0-based, we use 1-based
    }
    if (model.pageSize !== pageSize) {
      onPageSizeChange(model.pageSize)
    }
  }

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

  return (
    <Box sx={{ width: '100%' }}>
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
        autoHeight
        localeText={{
          noRowsLabel: t('table.empty'),
          MuiTablePagination: {
            labelRowsPerPage: t('table.rowsPerPage'),
            labelDisplayedRows: ({ from, to, count }) =>
              count !== -1
                ? t('table.displayedRows', { from, to, count })
                : `${from}–${to} de más de ${to}`,
          },
        }}
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
