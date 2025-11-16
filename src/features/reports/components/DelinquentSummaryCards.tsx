import { Grid, Card, CardContent, Typography, Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import type { DelinquentSummary } from '../types'
import { formatCurrency } from '../utils/delinquentFormatters'

interface DelinquentSummaryCardsProps {
  summary: DelinquentSummary
}

interface MetricCardProps {
  label: string
  value: string | number
}

/**
 * Tarjeta individual de métrica
 */
function MetricCard({ label, value }: MetricCardProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
            {label}
          </Typography>
          <Typography variant="h6" component="div" fontWeight="bold">
            {value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

/**
 * Grid de tarjetas con el resumen del informe de morosos
 */
export function DelinquentSummaryCards({
  summary,
}: DelinquentSummaryCardsProps) {
  const { t } = useTranslation('reports')

  const metrics = [
    {
      label: t('delinquent.summary.totalDebtors'),
      value: summary.totalDebtors,
    },
    {
      label: t('delinquent.summary.individualDebtors'),
      value: summary.individualDebtors,
    },
    {
      label: t('delinquent.summary.familyDebtors'),
      value: summary.familyDebtors,
    },
    {
      label: t('delinquent.summary.totalDebt'),
      value: formatCurrency(summary.totalDebtAmount),
    },
  ]

  return (
    <Grid container spacing={1.5}>
      {metrics.map((metric, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <MetricCard {...metric} />
        </Grid>
      ))}
    </Grid>
  )
}
