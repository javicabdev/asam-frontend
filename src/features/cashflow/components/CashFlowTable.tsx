import { useState, useCallback, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridRowParams,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
  esES,
} from '@mui/x-data-grid'
import { Box, Chip } from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { CashFlowTransaction } from '../types'
import { formatTransactionDate, formatAmount, formatCurrency } from '../utils/formatters'
import { getOperationTypeConfig } from '../utils/operationTypes'
import { ConfirmDeleteDialog } from './ConfirmDeleteDialog'
import { TransactionDetailsDialog } from './TransactionDetailsDialog'

interface CashFlowTableProps {
  cashFlows: CashFlowTransaction[]
  loading: boolean
  totalCount: number
  page?: number
  pageSize?: number
  onPageChange?: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
  onEditClick?: (transaction: CashFlowTransaction) => void
}

export const CashFlowTable = ({
  cashFlows,
  loading,
  totalCount,
  page = 1,
  pageSize = 25,
  onPageChange,
  onPageSizeChange,
  onEditClick,
}: CashFlowTableProps) => {
  const { t } = useTranslation('cashflow')
  const { user } = useAuth()
  const navigate = useNavigate()
  const isAdmin = user?.role === 'admin'

  // Track if we initiated the change (to ignore reflection events)
  const changingRef = useRef(false)

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
      // Pagination
      MuiTablePagination: {
        labelRowsPerPage: t('table.rowsPerPage'),
        labelDisplayedRows: ({ from, to, count }: { from: number; to: number; count: number }) =>
          t('table.displayedRows', { from, to, count: count !== -1 ? count : to }),
      },
    }),
    [t]
  )

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [transactionToDelete, setTransactionToDelete] =
    useState<CashFlowTransaction | null>(null)

  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [transactionToView, setTransactionToView] =
    useState<CashFlowTransaction | null>(null)

  const handleViewClick = (transaction: CashFlowTransaction) => {
    setTransactionToView(transaction)
    setDetailsDialogOpen(true)
  }

  const handleDeleteClick = (transaction: CashFlowTransaction) => {
    setTransactionToDelete(transaction)
    setDeleteDialogOpen(true)
  }

  const handleMemberClick = (memberId: string) => {
    navigate(`/members/${memberId}`)
  }

  // Handle pagination changes
  const handlePaginationChange = useCallback(
    (model: { page: number; pageSize: number }) => {
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
        if (sizeChanged && onPageSizeChange) {
          onPageSizeChange(model.pageSize)
          return
        }

        // Priority 2: Handle page change (only if size didn't change)
        if (pageChanged && onPageChange) {
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

  const columns: GridColDef[] = [
    {
      field: 'date',
      headerName: t('table.columns.date'),
      width: 120,
      valueGetter: (params) => formatTransactionDate(params.row.date),
    },
    {
      field: 'operationType',
      headerName: t('table.columns.type'),
      width: 80,
      renderCell: (params) => {
        const config = getOperationTypeConfig(params.value)
        return <span>{config.icon}</span>
      },
    },
    {
      field: 'category',
      headerName: t('table.columns.category'),
      width: 180,
      renderCell: (params) => {
        const config = getOperationTypeConfig(params.row.operationType)
        return (
          <Chip
            label={t(`operationTypes.${params.row.operationType}`)}
            size="small"
            sx={{
              bgcolor: config.color,
              color: 'white',
            }}
          />
        )
      },
    },
    {
      field: 'detail',
      headerName: t('table.columns.detail'),
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'member',
      headerName: t('table.columns.member'),
      width: 180,
      renderCell: (params) => {
        const member = params.row.member
        if (!member) return '-'
        return (
          <Box
            sx={{
              cursor: 'pointer',
              color: 'primary.main',
              '&:hover': { textDecoration: 'underline' },
            }}
            onClick={() => handleMemberClick(member.id)}
          >
            {member.firstName} {member.lastName}
          </Box>
        )
      },
    },
    {
      field: 'amount',
      headerName: t('table.columns.amount'),
      width: 130,
      type: 'number',
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => {
        const amount = params.value as number
        return (
          <Box
            sx={{
              color: amount >= 0 ? '#4caf50' : '#f44336',
              fontWeight: 'bold',
            }}
          >
            {formatAmount(amount)}
          </Box>
        )
      },
    },
    {
      field: 'runningBalance',
      headerName: t('table.columns.runningBalance'),
      width: 140,
      type: 'number',
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => {
        const balance = params.value as number
        return (
          <Box
            sx={{
              color: balance >= 0 ? '#2e7d32' : '#d32f2f',
              fontWeight: 'bold',
              fontSize: '0.95rem',
              bgcolor: balance >= 0 ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
              px: 1,
              py: 0.5,
              borderRadius: 1,
            }}
          >
            {formatCurrency(balance)}
          </Box>
        )
      },
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: t('table.columns.actions'),
      width: 120,
      getActions: (params: GridRowParams) => {
        const actions = [
          <GridActionsCellItem
            key="view"
            icon={<VisibilityIcon />}
            label={t('table.actions.view')}
            onClick={() => handleViewClick(params.row)}
          />,
        ]

        if (isAdmin) {
          actions.push(
            <GridActionsCellItem
              key="edit"
              icon={<EditIcon />}
              label={t('table.actions.edit')}
              onClick={() => onEditClick?.(params.row)}
            />,
            <GridActionsCellItem
              key="delete"
              icon={<DeleteIcon />}
              label={t('table.actions.delete')}
              onClick={() => handleDeleteClick(params.row)}
            />
          )
        }

        return actions
      },
    },
  ]

  return (
    <>
      <DataGrid
        rows={cashFlows}
        columns={columns}
        loading={loading}
        rowCount={totalCount}
        pageSizeOptions={[25, 50, 100]}
        paginationMode="server"
        paginationModel={{
          page: page - 1, // DataGrid uses 0-based indexing
          pageSize,
        }}
        onPaginationModelChange={handlePaginationChange}
        slots={{
          toolbar: CustomToolbar,
        }}
        localeText={customLocaleText}
        getRowClassName={(params) => {
          return params.row.amount >= 0 ? 'row-income' : 'row-expense'
        }}
        sx={{
          '& .row-income': {
            bgcolor: 'rgba(76, 175, 80, 0.08)',
          },
          '& .row-expense': {
            bgcolor: 'rgba(244, 67, 54, 0.08)',
          },
        }}
      />

      <TransactionDetailsDialog
        open={detailsDialogOpen}
        transaction={transactionToView}
        onClose={() => setDetailsDialogOpen(false)}
      />

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        transaction={transactionToDelete}
        onClose={() => setDeleteDialogOpen(false)}
      />
    </>
  )
}
