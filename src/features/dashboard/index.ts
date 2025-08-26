// Dashboard feature exports
export { default as StatsCard } from './components/StatsCard'
export { default as MembersChart } from './components/MembersChart'
export { default as PaymentsChart } from './components/PaymentsChart'
export { default as RecentActivity } from './components/RecentActivity'
export { default as QuickActions } from './components/QuickActions'

export {
  useDashboardStats,
  useDashboardStatsLegacy,
  useMockDashboardData,
} from './hooks/useDashboardStats'

export type {
  DashboardStats,
  MembershipTrendData,
  RevenueTrendData,
  ActivityType,
  RecentActivity as RecentActivityType,
  MemberStats,
  PaymentStats,
  FamilyStats,
  MonthlyStats,
  ChartDataPoint,
  StatsCardProps,
} from './types'
