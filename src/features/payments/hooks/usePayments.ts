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

    return data.listPayments.nodes
      .filter((payment) => {
        // Filter out any payments without member data (shouldn't happen but be defensive)
        if (!payment.member) {
          console.warn('Payment without member data found:', payment.id)
          return false
        }
        return true
      })
      .map((payment) => {
        // All payments now have a member (origin member for families)
        const memberName = `${payment.member.nombre} ${payment.member.apellidos}`.trim()
        const memberNumber = payment.member.numero_socio
        const memberId = payment.member.miembro_id

        // Determine if this is a family payment by checking membership type
        const isFamilyPayment = payment.member.tipo_membresia === 'FAMILY'
        const familyName = isFamilyPayment ? `Familia ${memberNumber}` : undefined

        return {
          id: payment.id,
          memberId,
          memberName,
          memberNumber,
          familyName,
          amount: payment.amount,
          paymentDate: payment.payment_date ?? null,
          status: payment.status as 'PENDING' | 'PAID' | 'CANCELLED',
          paymentMethod: payment.payment_method ?? null,
          notes: payment.notes ?? null,
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
