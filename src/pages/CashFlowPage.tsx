import { useState } from 'react'
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import { useAuth } from '@/hooks/useAuth'
import { useCashFlows, useBalance } from '@/features/cashflow/hooks'
import { BalanceCard, CashFlowFilters, CashFlowTable } from '@/features/cashflow/components'
import { exportToCSV } from '@/features/cashflow/utils/exportCSV'
import type { CashFlowFilters as CashFlowFiltersType } from '@/features/cashflow/types'

export default function CashFlowPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  // Estados para filtros
  const [filters, setFilters] = useState<CashFlowFiltersType>({})

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
          💰 Flujo de Caja
        </Typography>

        {isAdmin && (
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                // TODO: Abrir formulario de transacción (Commit 5)
                console.log('Abrir formulario de transacción')
              }}
            >
              Registrar Transacción
            </Button>
            <Button
              variant="outlined"
              startIcon={<FileDownloadIcon />}
              onClick={handleExportCSV}
              disabled={cashFlows.length === 0}
            >
              Exportar CSV
            </Button>
          </Stack>
        )}
      </Box>

      {/* Balance Card */}
      <BalanceCard balance={balance} loading={balanceLoading} />

      {/* Filtros */}
      <Paper sx={{ mt: 3, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          🔍 Filtros
        </Typography>
        <CashFlowFilters filters={filters} onChange={setFilters} />
      </Paper>

      {/* Tabla de Transacciones */}
      <Paper sx={{ mt: 3, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          📊 Transacciones ({totalCount})
        </Typography>
        <CashFlowTable
          cashFlows={cashFlows}
          loading={cashFlowsLoading}
          totalCount={totalCount}
          onEditClick={(transaction) => {
            // TODO: Abrir formulario de edición (Commit 5)
            console.log('Editar transacción:', transaction)
          }}
        />
      </Paper>
    </Box>
  )
}
