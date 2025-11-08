import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import { useAuth } from '@/hooks/useAuth'
import { useCashFlows, useBalance } from '@/features/cashflow/hooks'
import {
  BalanceCard,
  CashFlowFilters,
  CashFlowTable,
  TransactionFormDialog,
  RepatriationFormDialog,
} from '@/features/cashflow/components'
import { exportToCSV } from '@/features/cashflow/utils/exportCSV'
import type { CashFlowFilters as CashFlowFiltersType } from '@/features/cashflow/types'

export default function CashFlowPage() {
  const { t } = useTranslation('cashflow')
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const location = useLocation()

  // Estados para filtros y diálogos
  const [filters, setFilters] = useState<CashFlowFiltersType>({})
  const [openTransactionForm, setOpenTransactionForm] = useState(false)
  const [openRepatriationForm, setOpenRepatriationForm] = useState(false)
  const [transactionToEdit, setTransactionToEdit] = useState<any>(null)

  // Abrir diálogo automáticamente si viene desde quick actions
  useEffect(() => {
    if (location.state?.openTransactionForm) {
      setOpenTransactionForm(true)
    }
  }, [location.state])

  // Queries
  const { balance, loading: balanceLoading } = useBalance()
  const { cashFlows, totalCount, loading: cashFlowsLoading } = useCashFlows(filters)

  // Exportar CSV
  const handleExportCSV = () => {
    exportToCSV(cashFlows, 'flujo_caja')
  }

  return (
    <Box>
      {/* Header */}
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" component="h1">
          💰 {t('title')}
        </Typography>

        {isAdmin && (
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenTransactionForm(true)}
            >
              {t('actions.new')}
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<FlightTakeoffIcon />}
              onClick={() => setOpenRepatriationForm(true)}
            >
              {t('actions.newRepatriation')}
            </Button>
            <Button
              variant="outlined"
              startIcon={<FileDownloadIcon />}
              onClick={handleExportCSV}
              disabled={cashFlows.length === 0}
            >
              {t('actions.export')}
            </Button>
          </Stack>
        )}
      </Box>

      {/* Balance Card */}
      <BalanceCard balance={balance} loading={balanceLoading} />

      {/* Filtros */}
      <Paper sx={{ mt: 3, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          🔍 {t('filters.title')}
        </Typography>
        <CashFlowFilters filters={filters} onChange={setFilters} />
      </Paper>

      {/* Tabla de Transacciones */}
      <Paper sx={{ mt: 3, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          📊 {t('table.title')} ({totalCount})
        </Typography>
        <CashFlowTable
          cashFlows={cashFlows}
          loading={cashFlowsLoading}
          totalCount={totalCount}
          onEditClick={(transaction) => {
            setTransactionToEdit(transaction)
            setOpenTransactionForm(true)
          }}
        />
      </Paper>

      {/* Diálogos */}
      <TransactionFormDialog
        open={openTransactionForm}
        onClose={() => {
          setOpenTransactionForm(false)
          setTransactionToEdit(null)
        }}
        transaction={transactionToEdit}
      />

      <RepatriationFormDialog
        open={openRepatriationForm}
        onClose={() => setOpenRepatriationForm(false)}
      />
    </Box>
  )
}
