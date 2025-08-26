import React from 'react'
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
  // const legacyStats = useMockData ? mockData.stats : (realBackendStats ? mockData.stats : null)
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
          <AlertTitle>Error al cargar el dashboard</AlertTitle>
          {error.message}
          <Box mt={2}>
            <Button variant="outlined" size="small" onClick={() => setUseMockData(true)}>
              Usar datos de prueba
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
          <Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
              Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Bienvenido al sistema de gestión ASAM. Vista general del estado actual.
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={useMockData}
                  onChange={(e) => setUseMockData(e.target.checked)}
                  size="small"
                />
              }
              label="Datos de prueba"
            />
            <Button
              variant="outlined"
              startIcon={isRefreshing ? <CircularProgress size={20} /> : <Refresh />}
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              Actualizar
            </Button>
          </Box>
        </Box>

        {/* Alert de información */}
        {backendStats && backendStats.pendingPayments > 0 && (
          <Alert
            severity="warning"
            sx={{ mb: 3 }}
            action={
              <Button color="inherit" size="small">
                Ver pagos pendientes
              </Button>
            }
          >
            Hay €{backendStats.pendingPayments.toLocaleString('es-ES')} en pagos pendientes que
            requieren atención
          </Alert>
        )}

        {/* Indicador de modo de datos */}
        {useMockData && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Usando datos de prueba. Active la conexión con el backend para ver datos reales.
          </Alert>
        )}
      </Box>

      {/* Primera fila de Stats Cards - Miembros */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Miembros"
            value={backendStats?.totalMembers || 0}
            icon={<People />}
            trend={backendStats?.memberGrowthPercentage}
            color="primary"
            subtitle={`${backendStats?.activeMembers || 0} activos`}
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Nuevos este mes"
            value={backendStats?.newMembersThisMonth || 0}
            icon={<TrendingUp />}
            trend={
              backendStats && backendStats.newMembersLastMonth > 0
                ? ((backendStats.newMembersThisMonth - backendStats.newMembersLastMonth) /
                    backendStats.newMembersLastMonth) *
                  100
                : undefined
            }
            color="success"
            subtitle="miembros"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Miembros Individuales"
            value={backendStats?.individualMembers || 0}
            icon={<People />}
            color="info"
            subtitle={`${Math.round(((backendStats?.individualMembers || 0) / (backendStats?.totalMembers || 1)) * 100)}% del total`}
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Miembros Familiares"
            value={backendStats?.familyMembers || 0}
            icon={<Group />}
            color="secondary"
            subtitle={`${Math.round(((backendStats?.familyMembers || 0) / (backendStats?.totalMembers || 1)) * 100)}% del total`}
            loading={loading}
          />
        </Grid>
      </Grid>

      {/* Segunda fila - Finanzas */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Ingresos del mes"
            value={`€${(backendStats?.monthlyRevenue || 0).toLocaleString('es-ES')}`}
            icon={<AccountBalance />}
            trend={backendStats?.revenueGrowthPercentage}
            color="success"
            subtitle="recaudado"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Pagos Pendientes"
            value={`€${(backendStats?.pendingPayments || 0).toLocaleString('es-ES')}`}
            icon={<Warning />}
            color="warning"
            subtitle="por cobrar"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Balance Actual"
            value={`€${(backendStats?.currentBalance || 0).toLocaleString('es-ES')}`}
            icon={<AccountBalance />}
            color="primary"
            subtitle="en caja"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Gastos del mes"
            value={`€${(backendStats?.monthlyExpenses || 0).toLocaleString('es-ES')}`}
            icon={<TrendingDown />}
            color="error"
            subtitle="gastos"
            loading={loading}
          />
        </Grid>
      </Grid>

      {/* Tercera fila - Métricas adicionales */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Promedio de Pago"
            value={`€${(backendStats?.averagePayment || 0).toFixed(2)}`}
            icon={<AccountBalance />}
            color="info"
            subtitle="por cuota"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Tasa de Cobro"
            value={`${(backendStats?.paymentCompletionRate || 0).toFixed(1)}%`}
            icon={<CheckCircle />}
            color="success"
            subtitle="completado"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Miembros Inactivos"
            value={backendStats?.inactiveMembers || 0}
            icon={<Warning />}
            color="error"
            subtitle="revisar"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Transacciones"
            value={backendStats?.totalTransactions || 0}
            icon={<TrendingUp />}
            color="primary"
            subtitle={`${backendStats?.recentPaymentsCount || 0} recientes`}
            loading={loading}
          />
        </Grid>
      </Grid>

      {/* Charts and Activity */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} lg={6}>
          <MembersChart data={monthlyData} loading={loading} height={350} />
        </Grid>
        <Grid item xs={12} lg={6}>
          <PaymentsChart data={monthlyData} loading={loading} height={350} />
        </Grid>
      </Grid>

      {/* Recent Activity and Quick Actions */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={5} lg={4}>
          <RecentActivity
            activities={recentActivity || []}
            loading={loading}
            onRefresh={handleRefresh}
            onViewAll={() => console.log('View all activities')}
          />
        </Grid>
        <Grid item xs={12} md={7} lg={8}>
          <QuickActions />
        </Grid>
      </Grid>

      {/* Summary Stats */}
      <Box mt={4}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 2,
            border: 1,
            borderColor: 'divider',
            background: (theme) => theme.palette.background.default,
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Box textAlign="center">
                <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  €{backendStats ? (backendStats.totalRevenue / 1000).toFixed(1) : '0'}k
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Recaudado total
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box textAlign="center">
                <Typography variant="h3" sx={{ fontWeight: 700, color: 'success.main' }}>
                  {backendStats && backendStats.totalMembers > 0
                    ? Math.round((backendStats.activeMembers / backendStats.totalMembers) * 100)
                    : 0}
                  %
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tasa de actividad
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box textAlign="center">
                <Typography variant="h3" sx={{ fontWeight: 700, color: 'info.main' }}>
                  €{backendStats?.averagePayment.toFixed(0) || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Cuota promedio
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box textAlign="center">
                <Typography variant="h3" sx={{ fontWeight: 700, color: 'warning.main' }}>
                  {backendStats?.paymentCompletionRate.toFixed(0) || 0}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tasa de cobro
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  )
}
