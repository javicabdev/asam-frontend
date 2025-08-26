import { Card, CardContent, Typography, Box, useTheme, Skeleton, Chip } from '@mui/material'
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

  // Transformar datos para el gráfico
  const chartData = data.map((item) => ({
    mes: item.month,
    Ingresos: item.paymentAmount,
    'Número de Pagos': item.totalPayments,
  }))

  const formatMonth = (month: string) => {
    const months = {
      '01': 'Ene',
      '02': 'Feb',
      '03': 'Mar',
      '04': 'Abr',
      '05': 'May',
      '06': 'Jun',
      '07': 'Jul',
      '08': 'Ago',
      '09': 'Sep',
      '10': 'Oct',
      '11': 'Nov',
      '12': 'Dic',
    }
    return months[month.split('-')[1] as keyof typeof months] || month
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
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
            Ingresos: {formatCurrency(payload[0]?.value || 0)}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              color: theme.palette.text.secondary,
              fontWeight: 400,
            }}
          >
            Total Pagos: {payload[0]?.payload['Número de Pagos'] || 0}
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
            Ingresos por Mes
          </Typography>
          <Box display="flex" gap={1}>
            <Chip
              label={`Total: ${formatCurrency(totalIngresos)}`}
              size="small"
              color="primary"
              variant="outlined"
            />
            <Chip label={`${totalPagos} pagos`} size="small" variant="outlined" />
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

            <Bar dataKey="Ingresos" radius={[8, 8, 0, 0]} maxBarSize={50}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.Ingresos, maxValue)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
