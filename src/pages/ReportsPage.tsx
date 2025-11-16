import { useState } from 'react'
import { Container, Box, Typography, Alert, CircularProgress } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Assessment } from '@mui/icons-material'
import { useDelinquentReport } from '@/features/reports/hooks/useDelinquentReport'
import { useExportDelinquent } from '@/features/reports/hooks/useExportDelinquent'
import { DelinquentSummaryCards } from '@/features/reports/components/DelinquentSummaryCards'
import { DelinquentTable } from '@/features/reports/components/DelinquentTable'
import { DelinquentExportButtons } from '@/features/reports/components/DelinquentExportButtons'
import { DebtDetailsDialog } from '@/features/reports/components/DebtDetailsDialog'
import type { Debtor } from '@/features/reports/types'

/**
 * Página principal de Informes
 * Actualmente solo muestra el informe de morosos
 */
export default function ReportsPage() {
  const { t } = useTranslation('reports')
  const [selectedDebtor, setSelectedDebtor] = useState<Debtor | null>(null)

  // Hook principal del informe
  const { data, loading, error, filters, updateFilters, resetFilters } =
    useDelinquentReport()

  // Hook de exportación
  const { exportPDF, exportCSV, isExporting } = useExportDelinquent()

  const handleViewDetails = (debtor: Debtor) => {
    setSelectedDebtor(debtor)
  }

  const handleCloseDetails = () => {
    setSelectedDebtor(null)
  }

  return (
    <Container maxWidth="xl" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ py: 2, display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Assessment sx={{ fontSize: 32, color: 'primary.main' }} />
            <Box>
              <Typography variant="h5" component="h1" sx={{ mb: 0.25 }}>
                {t('delinquent.title')}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8125rem' }}>
                {t('delinquent.subtitle')}
              </Typography>
            </Box>
          </Box>

          <DelinquentExportButtons
            data={data}
            onExportPDF={exportPDF}
            onExportCSV={exportCSV}
            isExporting={isExporting}
          />
        </Box>

        {/* Error state */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {t('delinquent.errors.loadFailed')}: {error.message}
          </Alert>
        )}

        {/* Loading state */}
        {loading && !data && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 400,
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {/* Content */}
        {data && (
          <>
            {/* Summary Cards */}
            <Box sx={{ mb: 2 }}>
              <DelinquentSummaryCards summary={data.summary} />
            </Box>

            {/* Table */}
            {data.debtors.length === 0 ? (
              <Alert severity="info">
                {t('delinquent.noData')}
              </Alert>
            ) : (
              <Box
                sx={{
                  flex: 1,
                  minHeight: 400,
                  width: '100%',
                  mb: 3
                }}
              >
                <DelinquentTable
                  debtors={data.debtors}
                  loading={loading}
                  onViewDetails={handleViewDetails}
                />
              </Box>
            )}
          </>
        )}

        {/* Details Dialog */}
        <DebtDetailsDialog
          debtor={selectedDebtor}
          open={!!selectedDebtor}
          onClose={handleCloseDetails}
        />
      </Box>
    </Container>
  )
}
