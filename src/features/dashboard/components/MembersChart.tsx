import { Card, CardContent, Typography, Box, useTheme, Skeleton } from '@mui/material'
import { useTranslation } from 'react-i18next'
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts'
import { MonthlyStats } from '../types'
import type { CustomTooltipProps, TooltipPayloadItem } from '../types/chart-types'
import { formatMonth } from '../utils/chart-utils'

interface MembersChartProps {
  data: MonthlyStats[]
  loading?: boolean
  height?: number
}

export default function MembersChart({ data, loading = false, height = 300 }: MembersChartProps) {
  const theme = useTheme()
  const { t, i18n } = useTranslation('dashboard')

  // Transformar datos para el gráfico
  const chartData = data.map((item) => ({
    mes: item.month,
    [t('charts.newMembers')]: item.newMembers,
    [t('charts.totalAccumulated')]: data
      .filter((_, index) => index <= data.indexOf(item))
      .reduce((sum, d) => sum + d.newMembers, 0),
  }))

  const formatMonthLabel = (month: string) => formatMonth(month, t, i18n.language)

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length && label) {
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
            {formatMonthLabel(label)}
          </Typography>
          {payload.map((entry: TooltipPayloadItem, index: number) => (
            <Typography
              key={index}
              variant="caption"
              sx={{
                display: 'block',
                color: entry.color,
                fontWeight: 500,
              }}
            >
              {entry.name}: {entry.value}
            </Typography>
          ))}
        </Box>
      )
    }
    return null
  }

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
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            fontWeight: 600,
            color: 'text.primary',
            mb: 3,
          }}
        >
          {t('charts.memberGrowth')}
        </Typography>

        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.3} />
                <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={theme.palette.success.main} stopOpacity={0.3} />
                <stop offset="95%" stopColor={theme.palette.success.main} stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} vertical={false} />

            <XAxis
              dataKey="mes"
              tickFormatter={formatMonthLabel}
              stroke={theme.palette.text.secondary}
              style={{ fontSize: 12 }}
            />

            <YAxis stroke={theme.palette.text.secondary} style={{ fontSize: 12 }} />

            <Tooltip content={<CustomTooltip />} />

            <Legend
              wrapperStyle={{
                paddingTop: '20px',
                fontSize: '14px',
              }}
              iconType="rect"
            />

            <Area
              type="monotone"
              dataKey={t('charts.newMembers')}
              stroke={theme.palette.primary.main}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorNew)"
            />

            <Line
              type="monotone"
              dataKey={t('charts.totalAccumulated')}
              stroke={theme.palette.success.main}
              strokeWidth={2}
              dot={{ fill: theme.palette.success.main, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
