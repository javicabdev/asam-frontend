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
  // El backend ya calcula y devuelve running_balance correctamente
  const nodes = data?.getTransactions?.nodes || []

  const cashFlows: CashFlowTransaction[] = nodes.map((node) => {
    return {
      id: node.id,
      date: node.date,
      operationType: node.operation_type as any,
      amount: node.amount,
      detail: node.detail,
      runningBalance: node.running_balance, // Viene del backend
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
            receiptNumber: node.payment.id,
          }
        : null,
      createdAt: node.created_at,
    }
  })

  return {
    cashFlows,
    totalCount: data?.getTransactions?.pageInfo?.totalCount || 0,
    loading,
    error,
    refetch,
  }
}
