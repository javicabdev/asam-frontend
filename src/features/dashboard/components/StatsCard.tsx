import { Card, CardContent, Typography, Box, Skeleton, Chip, useTheme, alpha } from '@mui/material'
import { TrendingUp, TrendingDown } from '@mui/icons-material'
import type { StatsCardProps } from '../types'

export default function StatsCard({
  title,
  value,
  icon,
  trend,
  color = 'primary',
  subtitle,
  loading = false,
}: StatsCardProps) {
  const theme = useTheme()

  const getColorValue = () => {
    const colorMap = {
      primary: theme.palette.primary.main,
      secondary: theme.palette.secondary.main,
      success: theme.palette.success.main,
      warning: theme.palette.warning.main,
      error: theme.palette.error.main,
      info: theme.palette.info.main,
    }
    return colorMap[color]
  }

  const formatValue = (val: number | string) => {
    if (typeof val === 'number') {
      return val.toLocaleString('es-ES')
    }
    return val
  }

  const formatTrend = (trendValue: number) => {
    const isPositive = trendValue > 0
    return (
      <Chip
        icon={isPositive ? <TrendingUp /> : <TrendingDown />}
        label={`${isPositive ? '+' : ''}${trendValue.toFixed(1)}%`}
        size="small"
        color={isPositive ? 'success' : 'error'}
        variant="outlined"
        sx={{
          borderRadius: 1,
          fontWeight: 600,
          '& .MuiChip-icon': { fontSize: 16 },
        }}
      />
    )
  }

  if (loading) {
    return (
      <Card
        elevation={0}
        sx={{
          height: '100%',
          borderRadius: 2,
          border: 1,
          borderColor: 'divider',
        }}
      >
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box flex={1}>
              <Skeleton variant="text" width="60%" height={24} />
              <Skeleton variant="text" width="80%" height={40} sx={{ my: 1 }} />
              <Skeleton variant="text" width="40%" height={20} />
            </Box>
            <Skeleton variant="circular" width={48} height={48} />
          </Box>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        borderRadius: 2,
        border: 1,
        borderColor: 'divider',
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: getColorValue(),
          boxShadow: `0 4px 20px ${alpha(getColorValue(), 0.15)}`,
        },
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box flex={1}>
            <Typography
              color="text.secondary"
              gutterBottom
              variant="body2"
              sx={{ fontWeight: 500, mb: 1 }}
            >
              {title}
            </Typography>

            <Typography
              variant="h4"
              component="div"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                mb: 1,
              }}
            >
              {formatValue(value)}
            </Typography>

            <Box display="flex" alignItems="center" gap={1}>
              {trend !== undefined && formatTrend(trend)}
              {subtitle && (
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 400 }}>
                  {subtitle}
                </Typography>
              )}
            </Box>
          </Box>

          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: alpha(getColorValue(), 0.1),
              color: getColorValue(),
              '& .MuiSvgIcon-root': {
                fontSize: 24,
              },
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
