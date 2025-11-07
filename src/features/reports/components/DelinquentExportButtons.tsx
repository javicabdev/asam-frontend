import { Box, Button, CircularProgress } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { PictureAsPdf, TableChart } from '@mui/icons-material'
import type { DelinquentReportResponse } from '../types'

interface DelinquentExportButtonsProps {
  data: DelinquentReportResponse | null | undefined
  onExportPDF: (data: DelinquentReportResponse) => void
  onExportCSV: (data: DelinquentReportResponse) => void
  isExporting: boolean
}

/**
 * Botones de exportación para el informe de morosos
 */
export function DelinquentExportButtons({
  data,
  onExportPDF,
  onExportCSV,
  isExporting,
}: DelinquentExportButtonsProps) {
  const { t } = useTranslation('reports')

  const hasData = data && data.debtors.length > 0
  const disabled = !hasData || isExporting

  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Button
        variant="outlined"
        startIcon={
          isExporting ? <CircularProgress size={20} /> : <PictureAsPdf />
        }
        onClick={() => data && onExportPDF(data)}
        disabled={disabled}
      >
        {t('delinquent.actions.exportPDF')}
      </Button>

      <Button
        variant="outlined"
        startIcon={
          isExporting ? <CircularProgress size={20} /> : <TableChart />
        }
        onClick={() => data && onExportCSV(data)}
        disabled={disabled}
      >
        {t('delinquent.actions.exportCSV')}
      </Button>
    </Box>
  )
}
