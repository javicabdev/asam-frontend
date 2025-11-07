import { Grid, Card, CardContent, Typography, Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import {
  People,
  Person,
  Group,
  EuroSymbol,
  CalendarToday,
  TrendingUp,
} from '@mui/icons-material'
import type { DelinquentSummary } from '../types'
import { formatCurrency } from '../utils/delinquentFormatters'

interface DelinquentSummaryCardsProps {
  summary: DelinquentSummary
}

interface MetricCardProps {
  icon: React.ReactNode
  label: string
  value: string | number
  color: string
}

/**
 * Tarjeta individual de métrica
 */
function MetricCard({ icon, label, value, color }: MetricCardProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: `${color}.light`,
              color: `${color}.main`,
            }}
          >
            {icon}
          </Box>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
        </Box>
        <Typography variant="h4" component="div" fontWeight="bold">
          {value}
        </Typography>
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
      icon: <People />,
      label: t('delinquent.summary.totalDebtors'),
      value: summary.totalDebtors,
      color: 'error',
    },
    {
      icon: <Person />,
      label: t('delinquent.summary.individualDebtors'),
      value: summary.individualDebtors,
      color: 'primary',
    },
    {
      icon: <Group />,
      label: t('delinquent.summary.familyDebtors'),
      value: summary.familyDebtors,
      color: 'secondary',
    },
    {
      icon: <EuroSymbol />,
      label: t('delinquent.summary.totalDebt'),
      value: formatCurrency(summary.totalDebtAmount),
      color: 'error',
    },
    {
      icon: <CalendarToday />,
      label: t('delinquent.summary.avgDaysOverdue'),
      value: `${summary.averageDaysOverdue} ${t('delinquent.table.daysOverdue', { count: summary.averageDaysOverdue })}`,
      color: 'warning',
    },
    {
      icon: <TrendingUp />,
      label: t('delinquent.summary.avgDebtPerDebtor'),
      value: formatCurrency(summary.averageDebtPerDebtor),
      color: 'info',
    },
  ]

  return (
    <Grid container spacing={3}>
      {metrics.map((metric, index) => (
        <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
          <MetricCard {...metric} />
        </Grid>
      ))}
    </Grid>
  )
}
