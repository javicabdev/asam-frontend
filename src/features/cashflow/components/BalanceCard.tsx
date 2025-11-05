import { Card, CardContent, Grid, Typography, Box } from '@mui/material'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import { formatCurrency } from '../utils/formatters'
import { CashFlowBalance } from '../types'

interface BalanceCardProps {
  balance: CashFlowBalance
  loading?: boolean
}

export const BalanceCard = ({ balance }: BalanceCardProps) => {
  const { totalIncome, totalExpenses, currentBalance } = balance
  const isPositive = currentBalance >= 0

  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          💰 Balance Actual
        </Typography>

        <Grid container spacing={3} sx={{ mt: 1 }}>
          {/* Total Ingresos */}
          <Grid item xs={12} md={4}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Total Ingresos
              </Typography>
              <Typography
                variant="h4"
                sx={{ color: '#4caf50', fontWeight: 'bold', mt: 1 }}
              >
                +{formatCurrency(totalIncome)}
              </Typography>
            </Box>
          </Grid>

          {/* Total Gastos */}
          <Grid item xs={12} md={4}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Total Gastos
              </Typography>
              <Typography
                variant="h4"
                sx={{ color: '#f44336', fontWeight: 'bold', mt: 1 }}
              >
                -{formatCurrency(Math.abs(totalExpenses))}
              </Typography>
            </Box>
          </Grid>

          {/* Balance Final */}
          <Grid item xs={12} md={4}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Balance Actual
              </Typography>
              <Box display="flex" alignItems="center" gap={1} mt={1}>
                <Typography
                  variant="h4"
                  sx={{
                    color: isPositive ? '#4caf50' : '#f44336',
                    fontWeight: 'bold',
                  }}
                >
                  {formatCurrency(currentBalance)}
                </Typography>
                {isPositive ? (
                  <TrendingUpIcon sx={{ color: '#4caf50', fontSize: 32 }} />
                ) : (
                  <TrendingDownIcon sx={{ color: '#f44336', fontSize: 32 }} />
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
