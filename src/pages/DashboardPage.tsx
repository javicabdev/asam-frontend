import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  Grid,
  Box,
  Typography,
  Paper,
  Container,
  Alert,
  AlertTitle,
  Button,
  CircularProgress,
  Switch,
  FormControlLabel,
} from '@mui/material'
import {
  People,
  AccountBalance,
  TrendingUp,
  Warning,
  CheckCircle,
  Refresh,
  Group,
  TrendingDown,
} from '@mui/icons-material'
import {
  StatsCard,
  MembersChart,
  PaymentsChart,
  RecentActivity,
  QuickActions,
  useDashboardStats,
  useMockDashboardData,
} from '../features/dashboard'

export default function DashboardPage() {
  const { t } = useTranslation('dashboard')
  const [useMockData, setUseMockData] = React.useState(false)

  // Hook para datos reales con estructura del backend
  const {
    stats: realBackendStats,
    recentActivity: realActivity,
    monthlyData: realMonthlyData,
    loading: realLoading,
    error: realError,
    refetch: realRefetch,
  } = useDashboardStats({ skip: useMockData })

  // Hook para datos mock
  const mockData = useMockDashboardData()

  // Seleccionar datos según el switch
  const backendStats = useMockData ? mockData.backendStats : realBackendStats
  const monthlyData = useMockData ? mockData.monthlyData : realMonthlyData
  const recentActivity = useMockData ? mockData.recentActivity : realActivity
  const loading = useMockData ? mockData.loading : realLoading
  const error = useMockData ? mockData.error : realError

  const [isRefreshing, setIsRefreshing] = React.useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    if (!useMockData) {
      await realRefetch()
    } else {
      // Simular refresh con un delay para mock data
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
    setIsRefreshing(false)
  }

  if (loading && !backendStats) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">
          <AlertTitle>{t('error.title')}</AlertTitle>
          {error.message}
          <Box mt={2}>
            <Button variant="outlined" size="small" onClick={() => setUseMockData(true)}>
              {t('error.useMockData')}
            </Button>
          </Box>
        </Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box mb={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" component="h1">
            {t('title')}
          </Typography>
          <Box display="flex" gap={2} alignItems="center">
            {/* Toggle para datos mock */}
            {import.meta.env.DEV && (
              <FormControlLabel
                control={
                  <Switch checked={useMockData} onChange={(e) => setUseMockData(e.target.checked)} />
                }
                label={t('header.toggleMockData')}
              />
            )}

            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              {isRefreshing ? <CircularProgress size={20} /> : t('header.refresh')}
            </Button>
          </Box>
        </Box>

        {/* Mensaje de última actualización */}
        {backendStats && (
          <Typography variant="body2" color="textSecondary">
            {t('header.lastUpdate')}: {new Date().toLocaleString()}
          </Typography>
        )}
      </Box>

      {/* Alert for Mock Data */}
      {useMockData && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <AlertTitle>{t('devMode.title')}</AlertTitle>
          {t('devMode.message')}
        </Alert>
      )}

      {/* Stats Cards - Grid mejorado para la estructura del backend */}
      <Grid container spacing={3} mb={4}>
        {/* Primera fila - 4 cards principales */}
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title={t('stats.totalMembers')}
            value={backendStats?.totalMembers || 0}
            icon={<People />}
            trend={backendStats?.memberGrowthPercentage || 0}
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title={t('stats.activeMembers')}
            value={backendStats?.activeMembers || 0}
            icon={<CheckCircle />}
            trend={backendStats?.memberGrowthPercentage || 0}
            loading={loading}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title={t('stats.totalRevenue')}
            value={backendStats?.totalRevenue || 0}
            icon={<AccountBalance />}
            trend={backendStats?.revenueGrowthPercentage || 0}
            loading={loading}
            color="primary"
            isCurrency
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title={t('stats.pendingPayments')}
            value={backendStats?.pendingPayments || 0}
            icon={<Warning />}
            loading={loading}
            color="warning"
          />
        </Grid>

        {/* Segunda fila - 4 cards adicionales */}
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title={t('stats.familiesRegistered')}
            value={backendStats?.familyMembers || 0}
            icon={<Group />}
            loading={loading}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title={t('stats.averageContribution')}
            value={backendStats?.averagePayment || 0}
            icon={<TrendingUp />}
            loading={loading}
            color="success"
            isCurrency
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title={t('stats.monthlyGrowth')}
            value={backendStats?.memberGrowthPercentage || 0}
            icon={<TrendingUp />}
            loading={loading}
            color="primary"
            isPercentage
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title={t('stats.paymentRate')}
            value={backendStats?.paymentCompletionRate || 0}
            icon={(backendStats?.paymentCompletionRate || 0) >= 80 ? <CheckCircle /> : <TrendingDown />}
            loading={loading}
            color={(backendStats?.paymentCompletionRate || 0) >= 80 ? 'success' : 'error'}
            isPercentage
          />
        </Grid>
      </Grid>

      {/* Charts and Activity */}
      <Grid container spacing={3}>
        {/* Gráfico de miembros */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, height: '100%' }}>
            <MembersChart data={monthlyData} loading={loading} />
          </Paper>
        </Grid>

        {/* Gráfico de pagos */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, height: '100%' }}>
            <PaymentsChart data={monthlyData} loading={loading} />
          </Paper>
        </Grid>

        {/* Actividad reciente */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, height: '400px' }}>
            <RecentActivity activities={recentActivity} loading={loading} />
          </Paper>
        </Grid>

        {/* Acciones rápidas */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, height: '400px' }}>
            <QuickActions />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}
