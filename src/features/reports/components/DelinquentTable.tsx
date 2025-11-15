import { useState, useMemo } from 'react'
import { Card, CardContent, Box, Typography } from '@mui/material'
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
  esES,
} from '@mui/x-data-grid'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Visibility, Person, Phone as PhoneIcon } from '@mui/icons-material'
import { IconButton, Tooltip } from '@mui/material'
import { DebtorType } from '../types'
import type { Debtor } from '../types'
import { DebtorTypeChip } from './DebtorTypeChip'
import { formatCurrency, formatDate } from '../utils/delinquentFormatters'
import { getDebtorId } from '../utils/debtorId'

interface DelinquentTableProps {
  debtors: Debtor[]
  loading: boolean
  onViewDetails: (debtor: Debtor) => void
}

/**
 * Obtiene el nombre del deudor
 */
function getDebtorName(debtor: Debtor): string {
  if (debtor.type === 'INDIVIDUAL' && debtor.member) {
    return `${debtor.member.firstName} ${debtor.member.lastName}`
  } else if (debtor.type === 'FAMILY' && debtor.family) {
    return debtor.family.familyName
  }
  return '-'
}

/**
 * Obtiene el número de socio del deudor
 */
function getDebtorMemberNumber(debtor: Debtor): string {
  if (debtor.type === 'INDIVIDUAL' && debtor.member) {
    return debtor.member.memberNumber
  } else if (debtor.type === 'FAMILY' && debtor.family) {
    return debtor.family.primaryMember.memberNumber
  }
  return '-'
}

/**
 * Obtiene la información de contacto del deudor (teléfono prioritario)
 */
function getDebtorContact(debtor: Debtor): string {
  if (debtor.type === 'INDIVIDUAL' && debtor.member) {
    return debtor.member.phone || debtor.member.email || '-'
  } else if (debtor.type === 'FAMILY' && debtor.family) {
    return (
      debtor.family.primaryMember.phone ||
      debtor.family.primaryMember.email ||
      '-'
    )
  }
  return '-'
}

/**
 * Obtiene el ID del socio para navegar a sus detalles
 */
function getMemberId(debtor: Debtor): string | null {
  if (debtor.type === 'INDIVIDUAL' && debtor.member) {
    return debtor.member.id
  } else if (debtor.type === 'FAMILY' && debtor.family) {
    return debtor.family.primaryMember.id
  }
  return null
}

/**
 * Tabla principal del informe de morosos usando DataGrid
 */
export function DelinquentTable({
  debtors,
  loading,
  onViewDetails,
}: DelinquentTableProps) {
  const { t } = useTranslation('reports')
  const navigate = useNavigate()
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  })

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
      toolbarColumns: t('delinquent.table.toolbar.columns'),
      toolbarFilters: t('delinquent.table.toolbar.filters'),
      toolbarDensity: t('delinquent.table.toolbar.density'),
      toolbarQuickFilterPlaceholder: t('delinquent.table.toolbar.search'),
      // Filter operators
      filterOperatorContains: t('delinquent.table.filterOperators.contains'),
      filterOperatorEquals: t('delinquent.table.filterOperators.equals'),
      filterOperatorStartsWith: t('delinquent.table.filterOperators.startsWith'),
      filterOperatorEndsWith: t('delinquent.table.filterOperators.endsWith'),
      filterOperatorIsEmpty: t('delinquent.table.filterOperators.isEmpty'),
      filterOperatorIsNotEmpty: t('delinquent.table.filterOperators.isNotEmpty'),
      filterOperatorIsAnyOf: t('delinquent.table.filterOperators.isAnyOf'),
      // Filter panel
      filterPanelColumns: t('delinquent.table.filterPanel.columns'),
      filterPanelOperator: t('delinquent.table.filterPanel.operator'),
      filterPanelInputLabel: t('delinquent.table.filterPanel.value'),
      filterPanelInputPlaceholder: t('delinquent.table.filterPanel.filterValue'),
      // Pagination
      MuiTablePagination: {
        labelRowsPerPage: t('delinquent.table.rowsPerPage'),
        labelDisplayedRows: ({ from, to, count }: { from: number; to: number; count: number }) =>
          t('delinquent.table.displayedRows', { from, to, count: count !== -1 ? count : to }),
      },
    }),
    [t]
  )

  const columns: GridColDef<Debtor>[] = [
    {
      field: 'name',
      headerName: t('delinquent.table.debtor'),
      flex: 1,
      minWidth: 200,
      valueGetter: (params) => getDebtorName(params.row),
    },
    {
      field: 'type',
      headerName: t('delinquent.table.type'),
      width: 140,
      renderCell: (params: GridRenderCellParams<Debtor>) => (
        <DebtorTypeChip type={params.row.type as DebtorType} />
      ),
    },
    {
      field: 'memberNumber',
      headerName: t('delinquent.table.memberNumber'),
      width: 140,
      valueGetter: (params) => getDebtorMemberNumber(params.row),
    },
    {
      field: 'contact',
      headerName: t('delinquent.table.contact'),
      flex: 1,
      minWidth: 200,
      valueGetter: (params) => getDebtorContact(params.row),
      renderCell: (params: GridRenderCellParams<Debtor>) => {
        const contact = getDebtorContact(params.row)
        if (contact === '-') return '-'

        // Check if it's a phone number (prioritized now)
        const isPhone = params.row.type === 'INDIVIDUAL'
          ? !!params.row.member?.phone
          : !!params.row.family?.primaryMember.phone

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isPhone && <PhoneIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />}
            <Typography variant="body2" noWrap>
              {contact}
            </Typography>
          </Box>
        )
      },
    },
    {
      field: 'totalDebt',
      headerName: t('delinquent.table.totalDebt'),
      width: 130,
      align: 'right',
      headerAlign: 'right',
      valueGetter: (params) => formatCurrency(params.row.totalDebt),
    },
    {
      field: 'oldestDebtDays',
      headerName: t('delinquent.table.oldestDebt'),
      width: 140,
      align: 'right',
      headerAlign: 'right',
      valueGetter: (params) =>
        t('delinquent.table.daysOverdue', { count: params.row.oldestDebtDays }),
    },
    {
      field: 'lastPaymentDate',
      headerName: t('delinquent.table.lastPayment'),
      width: 150,
      valueGetter: (params) =>
        params.row.lastPaymentDate
          ? formatDate(params.row.lastPaymentDate)
          : '-',
    },
    {
      field: 'actions',
      headerName: t('delinquent.table.actions'),
      width: 120,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      renderCell: (params: GridRenderCellParams<Debtor>) => {
        const memberId = getMemberId(params.row)
        return (
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title={t('delinquent.actions.viewDebtDetails')}>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation()
                  onViewDetails(params.row)
                }}
              >
                <Visibility />
              </IconButton>
            </Tooltip>
            {memberId && (
              <Tooltip title={t('delinquent.actions.viewMemberDetails')}>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate(`/members/${memberId}`)
                  }}
                >
                  <Person />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        )
      },
    },
  ]

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flex: 1, minHeight: 300, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">
            {t('delinquent.table.title')} ({debtors.length})
          </Typography>
        </Box>

        <Box sx={{ width: '100%', height: '100%', flex: 1, minHeight: 300 }}>
          <DataGrid
            rows={debtors}
            columns={columns}
            loading={loading}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10, 25, 50, 100]}
            disableRowSelectionOnClick
            getRowId={(row) => getDebtorId(row)}
            onRowClick={(params) => onViewDetails(params.row as Debtor)}
            slots={{
              toolbar: CustomToolbar,
            }}
            localeText={customLocaleText}
            sx={{
              height: '100%',
              '& .MuiDataGrid-cell:focus': {
                outline: 'none',
              },
              '& .MuiDataGrid-row:hover': {
                cursor: 'pointer',
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  )
}
