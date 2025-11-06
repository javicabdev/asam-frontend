import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSnackbar } from 'notistack'
import type { DelinquentReportResponse } from '../types'
import { exportToPDF, exportToCSV } from '../utils/delinquentExport'

/**
 * Hook para manejar la exportación del informe de morosos
 */
export function useExportDelinquent() {
  const { t } = useTranslation('reports')
  const { enqueueSnackbar } = useSnackbar()
  const [isExporting, setIsExporting] = useState(false)

  const handleExportPDF = async (data: DelinquentReportResponse) => {
    try {
      setIsExporting(true)
      exportToPDF(data, t)
      enqueueSnackbar(t('delinquent.export.success'), { variant: 'success' })
    } catch (error) {
      console.error('Error exporting to PDF:', error)
      enqueueSnackbar(t('delinquent.export.error'), { variant: 'error' })
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportCSV = async (data: DelinquentReportResponse) => {
    try {
      setIsExporting(true)
      exportToCSV(data, t)
      enqueueSnackbar(t('delinquent.export.success'), { variant: 'success' })
    } catch (error) {
      console.error('Error exporting to CSV:', error)
      enqueueSnackbar(t('delinquent.export.error'), { variant: 'error' })
    } finally {
      setIsExporting(false)
    }
  }

  return {
    exportPDF: handleExportPDF,
    exportCSV: handleExportCSV,
    isExporting,
  }
}
