// Dashboard types definitions - Matching backend structure

// Estructura real del backend para DashboardStats
export interface DashboardStats {
  // Member stats
  totalMembers: number
  activeMembers: number
  inactiveMembers: number
  individualMembers: number
  familyMembers: number
  newMembersThisMonth: number
  newMembersLastMonth: number
  memberGrowthPercentage: number

  // Payment stats
  totalRevenue: number
  monthlyRevenue: number
  pendingPayments: number
  averagePayment: number
  paymentCompletionRate: number
  revenueGrowthPercentage: number

  // Financial stats
  currentBalance: number
  monthlyExpenses: number

  // Activity stats
  totalTransactions: number
  recentPaymentsCount: number

  // Time-based data for charts
  membershipTrend: MembershipTrendData[]
  revenueTrend: RevenueTrendData[]
}

export interface MembershipTrendData {
  month: string
  newMembers: number
  totalMembers: number
}

export interface RevenueTrendData {
  month: string
  revenue: number
  expenses: number
}

export type ActivityType =
  | 'MEMBER_REGISTERED'
  | 'PAYMENT_RECEIVED'
  | 'FAMILY_CREATED'
  | 'MEMBER_DEACTIVATED'
  | 'TRANSACTION_RECORDED'

export interface RecentActivity {
  id: string
  type: ActivityType
  description: string
  timestamp: string
  amount?: number
  relatedMember?: {
    miembro_id: string
    nombre: string
    apellidos: string
  }
  relatedFamily?: {
    id: string
    esposo_nombre: string
    esposa_nombre: string
  }
}

// Tipos para los charts - compatibles con Recharts
export interface ChartDataPoint {
  name: string
  value: number
  [key: string]: string | number | undefined
}

// Tipos para los componentes
export interface StatsCardProps {
  title: string
  value: number | string
  icon: React.ReactNode
  trend?: number
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  subtitle?: string
  loading?: boolean
}

// Tipos legacy para mantener compatibilidad temporal
// Se pueden eliminar una vez actualicemos todos los componentes

export interface MemberStats {
  total: number
  active: number
  inactive: number
  newThisMonth: number
  growthPercentage: number
}

export interface PaymentStats {
  totalThisMonth: number
  totalThisYear: number
  pending: number
  overdue: number
  averageAmount: number
  lastPaymentDate: string | null
}

export interface FamilyStats {
  total: number
  active: number
  averageSize: number
}

export interface MonthlyStats {
  month: string
  newMembers: number
  totalPayments: number
  paymentAmount: number
}

// Función helper para mapear de la estructura del backend a la estructura legacy
export function mapBackendToLegacyStats(backendStats: DashboardStats): {
  members: MemberStats
  payments: PaymentStats
  families: FamilyStats
} {
  return {
    members: {
      total: backendStats.totalMembers,
      active: backendStats.activeMembers,
      inactive: backendStats.inactiveMembers,
      newThisMonth: backendStats.newMembersThisMonth,
      growthPercentage: backendStats.memberGrowthPercentage,
    },
    payments: {
      totalThisMonth: backendStats.monthlyRevenue,
      totalThisYear: backendStats.totalRevenue,
      pending: Math.floor(backendStats.pendingPayments),
      overdue: 0, // No disponible en el backend
      averageAmount: backendStats.averagePayment,
      lastPaymentDate: null, // No disponible en el backend
    },
    families: {
      total: backendStats.familyMembers,
      active: backendStats.familyMembers, // Asumimos todos activos
      averageSize: 0, // No disponible en el backend
    },
  }
}

// Función helper para convertir trends a formato de charts
export function convertTrendsToChartData(
  membershipTrend: MembershipTrendData[],
  revenueTrend: RevenueTrendData[]
): MonthlyStats[] {
  return membershipTrend.map((trend, index) => {
    const revenueItem = index < revenueTrend.length ? revenueTrend[index] : null
    return {
      month: trend.month,
      newMembers: trend.newMembers,
      totalPayments: 0, // No disponible directamente
      paymentAmount: revenueItem?.revenue || 0,
    }
  })
}
