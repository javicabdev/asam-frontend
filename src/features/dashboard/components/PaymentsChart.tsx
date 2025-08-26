import { Card, CardContent, Typography, Box, useTheme, Skeleton, Chip } from '@mui/material'
import { useTranslation } from 'react-i18next'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { MonthlyStats } from '../types'

interface PaymentsChartProps {
  data: MonthlyStats[]
  loading?: boolean
  height?: number
}

export default function PaymentsChart({ data, loading = false, height = 300 }: PaymentsChartProps) {
  const theme = useTheme()
  const { t, i18n } = useTranslation('dashboard')

  // Transformar datos para el gráfico
  const chartData = data.map((item) => ({
    mes: item.month,
    [t('charts.monthlyRevenue')]: item.paymentAmount,
    [t('charts.numberOfPayments')]: item.totalPayments,
  }))

  const formatMonth = (month: string) => {
    const monthNumber = month.split('-')[1]
    const monthNames = {
      '01': t('months.january'),
      '02': t('months.february'),
      '03': t('months.march'),
      '04': t('months.april'),
      '05': t('months.may'),
      '06': t('months.june'),
      '07': t('months.july'),
      '08': t('months.august'),
      '09': t('months.september'),
      '10': t('months.october'),
      '11': t('months.november'),
      '12': t('months.december'),
    }
    
    // Para abreviaciones, tomar las primeras 3 letras
    const fullName = monthNames[monthNumber as keyof typeof monthNames] || month
    return i18n.language === 'wo' ? fullName : fullName.substring(0, 3)
  }

  const formatCurrency = (value: number) => {
    // Mapear idioma i18n a locale
    const localeMap: { [key: string]: string } = {
      es: 'es-ES',
      fr: 'fr-FR',
      wo: 'fr-SN', // Usar formato francés para wolof en Senegal
    }
    const locale = localeMap[i18n.language] || 'es-ES'
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(value)
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: 'background.paper',
            p: 1.5,
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            boxShadow: 2,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
            {formatMonth(label)}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              color: theme.palette.primary.main,
              fontWeight: 500,
            }}
          >
            {t('charts.monthlyRevenue')}: {formatCurrency(payload[0]?.value || 0)}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              color: theme.palette.text.secondary,
              fontWeight: 400,
            }}
          >
            {t('charts.numberOfPayments')}: {payload[0]?.payload[t('charts.numberOfPayments')] || 0}
          </Typography>
        </Box>
      )
    }
    return null
  }

  // Calcular totales para mostrar en el header
  const totalIngresos = data.reduce((sum, item) => sum + item.paymentAmount, 0)
  const totalPagos = data.reduce((sum, item) => sum + item.totalPayments, 0)

  // Generar colores dinámicos para las barras
  const getBarColor = (value: number, max: number) => {
    const ratio = value / max
    if (ratio > 0.75) return theme.palette.success.main
    if (ratio > 0.5) return theme.palette.primary.main
    if (ratio > 0.25) return theme.palette.warning.main
    return theme.palette.grey[400]
  }

  const maxValue = Math.max(...data.map((d) => d.paymentAmount))

  if (loading) {
    return (
      <Card elevation={0} sx={{ borderRadius: 2, border: 1, borderColor: 'divider' }}>
        <CardContent>
          <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={height} />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 2,
        border: 1,
        borderColor: 'divider',
        height: '100%',
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
            }}
          >
            {t('charts.monthlyPayments')}
          </Typography>
          <Box display="flex" gap={1}>
            <Chip
              label={`${t('charts.amount')}: ${formatCurrency(totalIngresos)}`}
              size="small"
              color="primary"
              variant="outlined"
            />
            <Chip 
              label={`${totalPagos} ${t('charts.numberOfPayments').toLowerCase()}`} 
              size="small" 
              variant="outlined" 
            />
          </Box>
        </Box>

        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} vertical={false} />

            <XAxis
              dataKey="mes"
              tickFormatter={formatMonth}
              stroke={theme.palette.text.secondary}
              style={{ fontSize: 12 }}
            />

            <YAxis
              stroke={theme.palette.text.secondary}
              style={{ fontSize: 12 }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k€`}
            />

            <Tooltip content={<CustomTooltip />} />

            <Bar dataKey={t('charts.monthlyRevenue')} radius={[8, 8, 0, 0]} maxBarSize={50}>
              {chartData.map((entry, index) => {
                const value = entry[t('charts.monthlyRevenue')]
                const numValue = typeof value === 'number' ? value : 0
                return <Cell key={`cell-${index}`} fill={getBarColor(numValue, maxValue)} />
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
