import { Card, CardContent, Grid, Typography, Box } from '@mui/material'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import { useTranslation } from 'react-i18next'
import { formatCurrency } from '../utils/formatters'
import { CashFlowBalance } from '../types'

interface BalanceCardProps {
  balance: CashFlowBalance
  loading?: boolean
}

export const BalanceCard = ({ balance }: BalanceCardProps) => {
  const { t } = useTranslation('cashflow')
  const { totalIncome, totalExpenses, currentBalance } = balance
  const isPositive = currentBalance >= 0

  return (
    <Card elevation={2}>
      <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Grid container spacing={2} alignItems="center">
          {/* Total Ingresos */}
          <Grid item xs={12} sm={4}>
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                {t('balance.totalIncome')}
              </Typography>
              <Typography
                variant="h6"
                sx={{ color: '#4caf50', fontWeight: 'bold' }}
              >
                +{formatCurrency(totalIncome)}
              </Typography>
            </Box>
          </Grid>

          {/* Total Gastos */}
          <Grid item xs={12} sm={4}>
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                {t('balance.totalExpenses')}
              </Typography>
              <Typography
                variant="h6"
                sx={{ color: '#f44336', fontWeight: 'bold' }}
              >
                -{formatCurrency(Math.abs(totalExpenses))}
              </Typography>
            </Box>
          </Grid>

          {/* Balance Final */}
          <Grid item xs={12} sm={4}>
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                {t('balance.currentBalance')}
              </Typography>
              <Box display="flex" alignItems="center" gap={0.5}>
                <Typography
                  variant="h6"
                  sx={{
                    color: isPositive ? '#4caf50' : '#f44336',
                    fontWeight: 'bold',
                  }}
                >
                  {formatCurrency(currentBalance)}
                </Typography>
                {isPositive ? (
                  <TrendingUpIcon sx={{ color: '#4caf50', fontSize: 24 }} />
                ) : (
                  <TrendingDownIcon sx={{ color: '#f44336', fontSize: 24 }} />
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
