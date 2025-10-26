import { useState, useEffect, useMemo } from 'react'
import { useListMembersQuery } from '@/graphql/generated/operations'
import type { PaymentFiltersState, PaymentListItem } from '../types'

/**
 * Temporary workaround: Aggregates member payments into a unified list
 * 
 * TODO: Replace with listPayments query when backend implements it
 * See: docs/backend-requirements/PAYMENTS-API-REQUIREMENTS.md
 */
export const usePayments = (filters: PaymentFiltersState) => {
  const [allPayments, setAllPayments] = useState<PaymentListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all members (we'll get their payments)
  const { data: membersData, loading: membersLoading } = useListMembersQuery({
    variables: {
      filter: {
        pagination: { page: 1, pageSize: 1000 }, // Get all members for now
      },
    },
  })

  useEffect(() => {
    const fetchAllPayments = async () => {
      try {
        setLoading(true)
        setError(null)

        // TODO: This is a temporary workaround
        // In a real scenario, we would call a single listPayments query
        // For now, we'll use the existing getMemberPayments for each member
        
        // Placeholder: For now, return empty array until backend is ready
        // or we implement the aggregation logic
        setAllPayments([])
        
      } catch (err) {
        console.error('Error fetching payments:', err)
        setError(err instanceof Error ? err.message : 'Error al cargar los pagos')
      } finally {
        setLoading(false)
      }
    }

    if (!membersLoading) {
      void fetchAllPayments()
    }
  }, [membersLoading, membersData])

  // Apply client-side filtering
  const filteredPayments = useMemo(() => {
    return allPayments.filter((payment) => {
      // Status filter
      if (filters.status !== 'ALL' && payment.status !== filters.status) {
        return false
      }

      // Payment method filter
      if (filters.paymentMethod && filters.paymentMethod !== 'ALL') {
        if (payment.paymentMethod !== filters.paymentMethod) {
          return false
        }
      }

      // Date range filter
      if (filters.startDate) {
        const paymentDate = new Date(payment.paymentDate)
        if (paymentDate < filters.startDate) {
          return false
        }
      }

      if (filters.endDate) {
        const paymentDate = new Date(payment.paymentDate)
        if (paymentDate > filters.endDate) {
          return false
        }
      }

      // Search term filter (member name or number)
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase()
        const memberName = payment.memberName.toLowerCase()
        const memberNumber = payment.memberNumber.toLowerCase()
        
        if (!memberName.includes(searchLower) && !memberNumber.includes(searchLower)) {
          return false
        }
      }

      return true
    })
  }, [allPayments, filters])

  // Apply client-side pagination
  const paginatedPayments = useMemo(() => {
    const startIndex = (filters.page - 1) * filters.pageSize
    const endIndex = startIndex + filters.pageSize
    return filteredPayments.slice(startIndex, endIndex)
  }, [filteredPayments, filters.page, filters.pageSize])

  const pageInfo = useMemo(
    () => ({
      totalCount: filteredPayments.length,
      hasNextPage: filters.page * filters.pageSize < filteredPayments.length,
      hasPreviousPage: filters.page > 1,
    }),
    [filteredPayments.length, filters.page, filters.pageSize]
  )

  const refetch = () => {
    // Trigger re-fetch
    setLoading(true)
    // In the real implementation, this would refetch from the API
  }

  return {
    payments: paginatedPayments,
    pageInfo,
    loading: loading || membersLoading,
    error,
    refetch,
  }
}
