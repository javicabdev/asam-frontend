import { useQuery } from '@apollo/client'
import { gql } from '@apollo/client'
import {
  DashboardStats,
  RecentActivity,
  MonthlyStats,
  mapBackendToLegacyStats,
  convertTrendsToChartData,
} from '../types'

// Query para obtener estadísticas del dashboard - Estructura real del backend
const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    getDashboardStats {
      # Member stats
      totalMembers
      activeMembers
      inactiveMembers
      individualMembers
      familyMembers
      newMembersThisMonth
      newMembersLastMonth
      memberGrowthPercentage

      # Payment stats
      totalRevenue
      monthlyRevenue
      pendingPayments
      averagePayment
      paymentCompletionRate
      revenueGrowthPercentage

      # Financial stats
      currentBalance
      monthlyExpenses

      # Activity stats
      totalTransactions
      recentPaymentsCount

      # Time-based data for charts
      membershipTrend {
        month
        newMembers
        totalMembers
      }
      revenueTrend {
        month
        revenue
        expenses
      }
    }
  }
`

// Query para obtener actividad reciente
const GET_RECENT_ACTIVITY = gql`
  query GetRecentActivity($limit: Int) {
    getRecentActivity(limit: $limit) {
      id
      type
      description
      timestamp
      amount
      relatedMember {
        miembro_id
        nombre
        apellidos
      }
      relatedFamily {
        id
        esposo_nombre
        esposa_nombre
      }
    }
  }
`

interface UseDashboardStatsOptions {
  pollInterval?: number
  skip?: boolean
}

interface UseDashboardStatsResult {
  stats: DashboardStats | null
  recentActivity: RecentActivity[]
  monthlyData: MonthlyStats[]
  loading: boolean
  error: Error | undefined
  refetch: () => void
}

export function useDashboardStats(options: UseDashboardStatsOptions = {}): UseDashboardStatsResult {
  const { pollInterval = 30000, skip = false } = options

  // Query para las estadísticas principales
  const {
    data: statsData,
    loading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useQuery(GET_DASHBOARD_STATS, {
    skip,
    pollInterval,
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  })

  // Query para la actividad reciente
  const {
    data: activityData,
    loading: activityLoading,
    refetch: refetchActivity,
  } = useQuery(GET_RECENT_ACTIVITY, {
    variables: { limit: 10 },
    skip,
    fetchPolicy: 'cache-and-network',
  })

  // Combinar refetch
  const refetch = () => {
    refetchStats()
    refetchActivity()
  }

  // Convertir los datos del backend al formato esperado para los charts
  const monthlyData = statsData?.getDashboardStats
    ? convertTrendsToChartData(
        statsData.getDashboardStats.membershipTrend,
        statsData.getDashboardStats.revenueTrend
      )
    : []

  return {
    stats: statsData?.getDashboardStats || null,
    recentActivity: activityData?.getRecentActivity || [],
    monthlyData,
    loading: statsLoading || activityLoading,
    error: statsError,
    refetch,
  }
}

// Hook con formato legacy para compatibilidad
export function useDashboardStatsLegacy(options: UseDashboardStatsOptions = {}) {
  const {
    stats: backendStats,
    recentActivity,
    monthlyData,
    loading,
    error,
    refetch,
  } = useDashboardStats(options)

  const legacyStats = backendStats
    ? {
        ...mapBackendToLegacyStats(backendStats),
        recentActivity: recentActivity.map((activity) => ({
          type: activity.type.toLowerCase().replace('_', '_') as any,
          description: activity.description,
          timestamp: activity.timestamp,
          userId: activity.relatedMember?.miembro_id,
          userName: activity.relatedMember
            ? `${activity.relatedMember.nombre} ${activity.relatedMember.apellidos}`
            : undefined,
        })),
      }
    : null

  return {
    stats: legacyStats,
    monthlyData,
    loading,
    error,
    refetch,
  }
}

// Hook para datos mock - Se mantiene como fallback para desarrollo
export function useMockDashboardData() {
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth()

  // Generar datos mock para los últimos 12 meses
  const generateMonthlyData = (): MonthlyStats[] => {
    const data: MonthlyStats[] = []

    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - i, 1)
      const month = date.toISOString().slice(0, 7)

      data.push({
        month,
        newMembers: Math.floor(Math.random() * 15) + 5,
        totalPayments: Math.floor(Math.random() * 50) + 20,
        paymentAmount: Math.floor(Math.random() * 10000) + 5000,
      })
    }

    return data
  }

  const mockStats: DashboardStats = {
    // Member stats
    totalMembers: 1234,
    activeMembers: 1156,
    inactiveMembers: 78,
    individualMembers: 734,
    familyMembers: 500,
    newMembersThisMonth: 23,
    newMembersLastMonth: 19,
    memberGrowthPercentage: 2.5,

    // Payment stats
    totalRevenue: 523400,
    monthlyRevenue: 45600,
    pendingPayments: 12300,
    averagePayment: 150,
    paymentCompletionRate: 92.5,
    revenueGrowthPercentage: 3.8,

    // Financial stats
    currentBalance: 125000,
    monthlyExpenses: 8500,

    // Activity stats
    totalTransactions: 3456,
    recentPaymentsCount: 45,

    // Trends
    membershipTrend: generateMonthlyData().map((d) => ({
      month: d.month,
      newMembers: d.newMembers,
      totalMembers: 1200 + Math.floor(Math.random() * 100),
    })),
    revenueTrend: generateMonthlyData().map((d) => ({
      month: d.month,
      revenue: d.paymentAmount,
      expenses: Math.floor(Math.random() * 3000) + 2000,
    })),
  }

  const mockRecentActivity: RecentActivity[] = [
    {
      id: '1',
      type: 'MEMBER_REGISTERED',
      description: 'Juan García Pérez se ha unido como nuevo miembro',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      relatedMember: {
        miembro_id: '123',
        nombre: 'Juan',
        apellidos: 'García Pérez',
      },
    },
    {
      id: '2',
      type: 'PAYMENT_RECEIVED',
      description: 'Pago de cuota mensual recibido',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      amount: 150,
    },
    {
      id: '3',
      type: 'FAMILY_CREATED',
      description: 'Nueva familia registrada: Familia Rodríguez',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      relatedFamily: {
        id: '456',
        esposo_nombre: 'Pedro',
        esposa_nombre: 'María',
      },
    },
  ]

  // Convertir al formato legacy para compatibilidad
  const legacyStats = mapBackendToLegacyStats(mockStats)
  const legacyFormat = {
    ...legacyStats,
    recentActivity: mockRecentActivity.map((activity) => ({
      type: activity.type.toLowerCase().replace('_', '_') as any,
      description: activity.description,
      timestamp: activity.timestamp,
      userId: activity.relatedMember?.miembro_id,
      userName: activity.relatedMember
        ? `${activity.relatedMember.nombre} ${activity.relatedMember.apellidos}`
        : undefined,
    })),
  }

  return {
    stats: legacyFormat,
    backendStats: mockStats,
    recentActivity: mockRecentActivity,
    monthlyData: generateMonthlyData(),
    loading: false,
    error: undefined,
  }
}
