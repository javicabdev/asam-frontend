import { useMemo } from 'react'
import { useListPaymentsQuery } from '@/graphql/generated/operations'
import type { PaymentFiltersState, PaymentListItem } from '../types'
import type { PaymentStatus } from '@/graphql/generated/schema'

/**
 * Custom hook to fetch and manage payments list
 * Uses the listPayments GraphQL query with server-side filtering and pagination
 */
export const usePayments = (filters: PaymentFiltersState) => {
  // Build GraphQL variables from filters
  const variables = useMemo(() => {
    const filter: Record<string, any> = {
      pagination: {
        page: filters.page,
        pageSize: filters.pageSize,
      },
    }

    // Only include filters that have values
    if (filters.status !== 'ALL') {
      filter.status = filters.status as PaymentStatus
    }

    if (filters.paymentMethod && filters.paymentMethod !== 'ALL') {
      filter.payment_method = filters.paymentMethod
    }

    if (filters.startDate) {
      filter.start_date = filters.startDate.toISOString()
    }

    if (filters.endDate) {
      filter.end_date = filters.endDate.toISOString()
    }

    // Note: searchTerm is handled by backend through member/family name search
    // This might need to be implemented in backend if not available yet

    return { filter }
  }, [filters])

  // Fetch payments from API
  const { data, loading, error, refetch } = useListPaymentsQuery({
    variables,
    fetchPolicy: 'network-only', // Always fetch fresh data
  })

  // Transform GraphQL response to PaymentListItem format
  const payments = useMemo<PaymentListItem[]>(() => {
    if (!data?.listPayments?.nodes) {
      return []
    }

    return data.listPayments.nodes.map((payment) => {
      // Determine member name and number (could be from member or family)
      let memberName = ''
      let memberNumber = ''
      let familyName: string | undefined

      if (payment.member) {
        memberName = `${payment.member.nombre} ${payment.member.apellidos}`.trim()
        memberNumber = payment.member.numero_socio
      } else if (payment.family) {
        // For family payments, show family info
        const esposo = payment.family.esposo_nombre || ''
        const esposa = payment.family.esposa_nombre || ''
        familyName = `${esposo}${esposo && esposa ? ' / ' : ''}${esposa}`.trim()
        memberName = familyName
        memberNumber = payment.family.numero_socio
      }

      return {
        id: payment.id,
        memberName,
        memberNumber,
        familyName,
        amount: payment.amount,
        paymentDate: payment.payment_date,
        status: payment.status as 'PENDING' | 'PAID' | 'CANCELLED',
        paymentMethod: payment.payment_method,
        notes: payment.notes,
      }
    })
  }, [data])

  // Extract page info
  const pageInfo = useMemo(
    () => ({
      totalCount: data?.listPayments?.pageInfo?.totalCount || 0,
      hasNextPage: data?.listPayments?.pageInfo?.hasNextPage || false,
      hasPreviousPage: data?.listPayments?.pageInfo?.hasPreviousPage || false,
    }),
    [data]
  )

  return {
    payments,
    pageInfo,
    loading,
    error,
    refetch,
  }
}
