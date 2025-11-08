import { useQuery, ApolloError } from '@apollo/client'
import {
  GetDashboardStatsQuery,
  GetDashboardStatsDocument,
  GetRecentActivityQuery,
  GetRecentActivityQueryVariables,
  GetRecentActivityDocument,
} from '@/graphql/generated/operations'
import {
  DashboardStats,
  RecentActivity,
  MonthlyStats,
  convertTrendsToChartData,
} from '../types'

interface UseDashboardStatsOptions {
  pollInterval?: number
  skip?: boolean
}

interface UseDashboardStatsResult {
  stats: DashboardStats | null
  monthlyStats: MonthlyStats[]
  recentActivity: RecentActivity[]
  loading: boolean
  error: ApolloError | undefined
  refetch: () => Promise<void>
}

/**
 * Hook to fetch dashboard statistics and recent activity
 * Provides both real-time stats and formatted data for charts
 */
export function useDashboardStats(
  options: UseDashboardStatsOptions = {}
): UseDashboardStatsResult {
  const { pollInterval = 0, skip = false } = options

  // Fetch dashboard statistics
  const {
    data: statsData,
    loading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useQuery<GetDashboardStatsQuery>(GetDashboardStatsDocument, {
    skip,
    pollInterval,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  })

  // Fetch recent activity
  const {
    data: activityData,
    loading: activityLoading,
    error: activityError,
    refetch: refetchActivity,
  } = useQuery<GetRecentActivityQuery, GetRecentActivityQueryVariables>(
    GetRecentActivityDocument,
    {
      variables: { limit: 10 },
      skip,
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    }
  )

  // Combined refetch function
  const refetch = async (): Promise<void> => {
    await Promise.all([refetchStats(), refetchActivity()])
  }

  // Process dashboard stats
  const stats = statsData?.getDashboardStats || null

  // Convert trends to chart-compatible format - Fixed: passing both required arguments
  const monthlyStats = stats
    ? convertTrendsToChartData(stats.membershipTrend, stats.revenueTrend)
    : []

  // Debug: Log all dashboard data to verify backend is sending correct data
  if (stats) {
    console.group('📊 Dashboard Stats from Backend')
    console.log('Full stats object:', stats)
    console.groupEnd()

    console.group('👥 Member Statistics')
    console.log('Total members:', stats.totalMembers)
    console.log('Active members:', stats.activeMembers)
    console.log('New members this month:', stats.newMembersThisMonth)
    console.log('Membership trend (by month):', stats.membershipTrend)
    console.groupEnd()

    console.group('💰 Payment Statistics')
    console.log('Pending payments (COUNT):', stats.pendingPayments, typeof stats.pendingPayments)
    console.log('Total revenue:', stats.totalRevenue)
    console.log('Monthly revenue:', stats.monthlyRevenue)
    console.log('Revenue trend (by month):', stats.revenueTrend)
    console.groupEnd()
  }

  // Process recent activity - Fixed: mapping to handle null values
  const recentActivity: RecentActivity[] = (activityData?.getRecentActivity || [])
    .map(activity => ({
      id: activity.id,
      type: activity.type,
      description: activity.description,
      timestamp: activity.timestamp,
      amount: activity.amount ?? undefined, // Convert null to undefined
      relatedMember: activity.relatedMember ? {
        miembro_id: activity.relatedMember.miembro_id,
        nombre: activity.relatedMember.nombre,
        apellidos: activity.relatedMember.apellidos,
      } : undefined,
      relatedFamily: activity.relatedFamily ? {
        id: activity.relatedFamily.id,
        esposo_nombre: activity.relatedFamily.esposo_nombre,
        esposa_nombre: activity.relatedFamily.esposa_nombre,
      } : undefined,
    }))
    // Remove duplicates by ID (backend might return duplicates)
    .filter((activity, index, self) =>
      index === self.findIndex(a => a.id === activity.id)
    )
    // Sort by timestamp descending (most recent first) including hour, minute, second
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  // Combined loading state
  const loading = statsLoading || activityLoading

  // Prioritize stats error over activity error
  const error = statsError || activityError

  return {
    stats,
    monthlyStats,
    recentActivity,
    loading,
    error,
    refetch,
  }
}

/**
 * Hook to fetch only dashboard statistics (without activity)
 * Useful for components that only need stats data
 * @deprecated Currently not in use, kept for future implementation
 */
// export function useDashboardStatsOnly(
//   options: UseDashboardStatsOptions = {}
// ): Omit<UseDashboardStatsResult, 'recentActivity'> {
//   const { pollInterval = 0, skip = false } = options

//   const {
//     data,
//     loading,
//     error,
//     refetch,
//   } = useQuery<GetDashboardStatsQuery>(GetDashboardStatsDocument, {
//     skip,
//     pollInterval,
//     fetchPolicy: 'cache-and-network',
//     errorPolicy: 'all',
//   })

//   const stats = data?.getDashboardStats || null
//   // Fixed: passing both required arguments
//   const monthlyStats = stats 
//     ? convertTrendsToChartData(stats.membershipTrend, stats.revenueTrend)
//     : []

//   return {
//     stats,
//     monthlyStats,
//     loading,
//     error,
//     refetch: async () => {
//       await refetch()
//     },
//   }
// }

/**
 * Hook to fetch only recent activity
 * Useful for activity feed components
 * @deprecated Currently not in use, kept for future implementation
 */
// export function useRecentActivity(
//   limit = 10,
//   skip = false
// ): {
//   activities: RecentActivity[]
//   loading: boolean
//   error: ApolloError | undefined
//   refetch: () => Promise<void>
// } {
//   const { data, loading, error, refetch } = useQuery<
//     GetRecentActivityQuery,
//     GetRecentActivityQueryVariables
//   >(GetRecentActivityDocument, {
//     variables: { limit },
//     skip,
//     fetchPolicy: 'cache-and-network',
//     errorPolicy: 'all',
//   })

//   // Map to handle null values in amount field
//   const activities: RecentActivity[] = (data?.getRecentActivity || [])
//     .map(activity => ({
//       id: activity.id,
//       type: activity.type,
//       description: activity.description,
//       timestamp: activity.timestamp,
//       amount: activity.amount ?? undefined,
//       relatedMember: activity.relatedMember ? {
//         miembro_id: activity.relatedMember.miembro_id,
//         nombre: activity.relatedMember.nombre,
//         apellidos: activity.relatedMember.apellidos,
//       } : undefined,
//       relatedFamily: activity.relatedFamily ? {
//         id: activity.relatedFamily.id,
//         esposo_nombre: activity.relatedFamily.esposo_nombre,
//         esposa_nombre: activity.relatedFamily.esposa_nombre,
//       } : undefined,
//     }))

//   return {
//     activities,
//     loading,
//     error,
//     refetch: async () => {
//       await refetch()
//     },
//   }
// }

/**
 * Hook to fetch legacy format dashboard data
 * This is for backward compatibility with existing components
 * @deprecated Currently not in use, kept for backward compatibility
 */
// export function useLegacyDashboardStats(
//   options: UseDashboardStatsOptions = {}
// ): {
//   stats: ReturnType<typeof mapBackendToLegacyStats> | null
//   loading: boolean
//   error: ApolloError | undefined
//   refetch: () => Promise<void>
// } {
//   const { stats: backendStats, loading, error, refetch } = useDashboardStatsOnly(options)

//   const legacyStats = backendStats ? mapBackendToLegacyStats(backendStats) : null

//   return {
//     stats: legacyStats,
//     loading,
//     error,
//     refetch,
//   }
// }
