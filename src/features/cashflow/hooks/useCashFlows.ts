import { useGetCashFlowsQuery } from '@/graphql/generated/operations'
import { CashFlowFilters, CashFlowTransaction, MemberRef } from '../types'

interface UseCashFlowsResult {
  cashFlows: CashFlowTransaction[]
  totalCount: number
  loading: boolean
  error: any
  refetch: () => void
}

export const useCashFlows = (
  filters: CashFlowFilters = {},
  pagination = { page: 1, pageSize: 50 }
): UseCashFlowsResult => {
  // Filtros efectivos (la seguridad por rol se maneja en el backend)
  const effectiveFilters = filters

  const { data, loading, error, refetch } = useGetCashFlowsQuery({
    variables: {
      filter: {
        start_date: effectiveFilters.startDate || undefined,
        end_date: effectiveFilters.endDate || undefined,
        operation_type: effectiveFilters.operationType || undefined,
        member_id: effectiveFilters.memberId || undefined,
        pagination,
      },
    },
    fetchPolicy: 'cache-and-network',
  })

  // Transformar datos del backend a nuestro tipo
  const cashFlows: CashFlowTransaction[] =
    data?.getTransactions?.nodes?.map((node) => ({
      id: node.id,
      date: node.date,
      operationType: node.operation_type as any,
      amount: node.amount,
      detail: node.detail,
      member: node.member
        ? ({
            id: node.member.miembro_id,
            firstName: node.member.nombre,
            lastName: node.member.apellidos,
            memberNumber: node.member.numero_socio,
          } as MemberRef)
        : null,
      payment: node.payment
        ? {
            id: node.payment.id,
            receiptNumber: node.payment.id, // TODO: Verificar si existe receiptNumber en schema
          }
        : null,
      createdAt: node.created_at,
    })) || []

  return {
    cashFlows,
    totalCount: data?.getTransactions?.pageInfo?.totalCount || 0,
    loading,
    error,
    refetch,
  }
}
