import { useState, useEffect } from 'react'
import type { ApolloError } from '@apollo/client'
import type { DashboardStats, MonthlyStats, RecentActivity } from '../types'

interface UseMockDashboardDataResult {
  backendStats: DashboardStats | null
  monthlyData: MonthlyStats[]
  recentActivity: RecentActivity[]
  loading: boolean
  error: ApolloError | undefined
}

/**
 * Hook that provides mock dashboard data for development and testing
 */
export function useMockDashboardData(): UseMockDashboardDataResult {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const backendStats: DashboardStats = {
    // Member stats
    totalMembers: 1250,
    activeMembers: 1180,
    inactiveMembers: 70,
    individualMembers: 794,
    familyMembers: 456,
    newMembersThisMonth: 25,
    newMembersLastMonth: 18,
    memberGrowthPercentage: 5.2,

    // Payment stats
    totalRevenue: 125000,
    monthlyRevenue: 12500,
    pendingPayments: 12,
    averagePayment: 100,
    paymentCompletionRate: 94.4,
    revenueGrowthPercentage: 8.5,

    // Financial stats
    currentBalance: 85000,
    monthlyExpenses: 3500,

    // Activity stats
    totalTransactions: 1450,
    recentPaymentsCount: 48,

    // Time-based data for charts
    membershipTrend: [
      { month: 'Jan', newMembers: 10, totalMembers: 1200 },
      { month: 'Feb', newMembers: 12, totalMembers: 1210 },
      { month: 'Mar', newMembers: 15, totalMembers: 1220 },
      { month: 'Apr', newMembers: 8, totalMembers: 1230 },
      { month: 'May', newMembers: 20, totalMembers: 1240 },
      { month: 'Jun', newMembers: 25, totalMembers: 1250 },
    ],
    revenueTrend: [
      { month: 'Jan', revenue: 11000, expenses: 3000 },
      { month: 'Feb', revenue: 11200, expenses: 3100 },
      { month: 'Mar', revenue: 11500, expenses: 3200 },
      { month: 'Apr', revenue: 11800, expenses: 3300 },
      { month: 'May', revenue: 12200, expenses: 3400 },
      { month: 'Jun', revenue: 12500, expenses: 3500 },
    ],
  }

  const monthlyData: MonthlyStats[] = [
    { month: 'Jan', newMembers: 10, totalPayments: 110, paymentAmount: 11000 },
    { month: 'Feb', newMembers: 12, totalPayments: 112, paymentAmount: 11200 },
    { month: 'Mar', newMembers: 15, totalPayments: 115, paymentAmount: 11500 },
    { month: 'Apr', newMembers: 8, totalPayments: 118, paymentAmount: 11800 },
    { month: 'May', newMembers: 20, totalPayments: 122, paymentAmount: 12200 },
    { month: 'Jun', newMembers: 25, totalPayments: 125, paymentAmount: 12500 },
  ]

  const recentActivity: RecentActivity[] = [
    {
      id: '1',
      type: 'PAYMENT_RECEIVED',
      description: 'Payment received from John Doe',
      timestamp: new Date().toISOString(),
      amount: 100,
      relatedMember: {
        miembro_id: '1',
        nombre: 'John',
        apellidos: 'Doe',
      },
    },
    {
      id: '2',
      type: 'MEMBER_REGISTERED',
      description: 'New member registered: Jane Smith',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      relatedMember: {
        miembro_id: '2',
        nombre: 'Jane',
        apellidos: 'Smith',
      },
    },
    {
      id: '3',
      type: 'FAMILY_CREATED',
      description: 'New family registered',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      relatedFamily: {
        id: '1',
        esposo_nombre: 'Carlos Pérez',
        esposa_nombre: 'María García',
      },
    },
    {
      id: '4',
      type: 'TRANSACTION_RECORDED',
      description: 'Transaction recorded for member',
      timestamp: new Date(Date.now() - 10800000).toISOString(),
      amount: 100,
      relatedMember: {
        miembro_id: '3',
        nombre: 'Bob',
        apellidos: 'Johnson',
      },
    },
    {
      id: '5',
      type: 'PAYMENT_RECEIVED',
      description: 'Payment received from Alice Williams',
      timestamp: new Date(Date.now() - 14400000).toISOString(),
      amount: 100,
      relatedMember: {
        miembro_id: '4',
        nombre: 'Alice',
        apellidos: 'Williams',
      },
    },
  ]

  return {
    backendStats: loading ? null : backendStats,
    monthlyData: loading ? [] : monthlyData,
    recentActivity: loading ? [] : recentActivity,
    loading,
    error: undefined,
  }
}

