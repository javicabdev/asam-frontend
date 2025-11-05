import { useGetCashFlowQuery } from '@/graphql/generated/operations'
import { CashFlowTransaction, MemberRef } from '../types'

interface UseCashFlowResult {
  cashFlow: CashFlowTransaction | null
  loading: boolean
  error: any
  refetch: () => void
}

export const useCashFlow = (id: string): UseCashFlowResult => {
  const { data, loading, error, refetch } = useGetCashFlowQuery({
    variables: { id },
    skip: !id,
    fetchPolicy: 'cache-and-network',
  })

  const cashFlow: CashFlowTransaction | null = data?.getCashFlow
    ? {
        id: data.getCashFlow.id,
        date: data.getCashFlow.date,
        operationType: data.getCashFlow.operation_type as any,
        amount: data.getCashFlow.amount,
        detail: data.getCashFlow.detail,
        member: data.getCashFlow.member
          ? ({
              id: data.getCashFlow.member.miembro_id,
              firstName: data.getCashFlow.member.nombre,
              lastName: data.getCashFlow.member.apellidos,
              memberNumber: data.getCashFlow.member.numero_socio,
            } as MemberRef)
          : null,
        payment: data.getCashFlow.payment
          ? {
              id: data.getCashFlow.payment.id,
              receiptNumber: data.getCashFlow.payment.id,
            }
          : null,
        createdAt: data.getCashFlow.created_at,
      }
    : null

  return {
    cashFlow,
    loading,
    error,
    refetch,
  }
}
