import { useGetCashFlowBalanceQuery } from '@/graphql/generated/operations'
import { CashFlowBalance } from '../types'

interface UseBalanceResult {
  balance: CashFlowBalance
  loading: boolean
  error: any
  refetch: () => void
}

export const useBalance = (): UseBalanceResult => {
  const { data, loading, error, refetch } = useGetCashFlowBalanceQuery({
    fetchPolicy: 'cache-and-network',
  })

  return {
    balance: data?.cashFlowBalance || {
      totalIncome: 0,
      totalExpenses: 0,
      currentBalance: 0,
    },
    loading,
    error,
    refetch,
  }
}
