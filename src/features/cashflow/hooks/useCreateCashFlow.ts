import { useCreateCashFlowMutation } from '@/graphql/generated/operations'
import { useSnackbar } from 'notistack'
import { CreateCashFlowInput } from '../types'

interface UseCreateCashFlowResult {
  createCashFlow: (input: CreateCashFlowInput) => Promise<any>
  loading: boolean
  error: any
}

export const useCreateCashFlow = (): UseCreateCashFlowResult => {
  const { enqueueSnackbar } = useSnackbar()

  const [mutate, { loading, error }] = useCreateCashFlowMutation({
    refetchQueries: ['GetCashFlows', 'GetCashFlowBalance'],
    awaitRefetchQueries: true,
    onCompleted: () => {
      enqueueSnackbar('Transacción registrada correctamente', {
        variant: 'success',
      })
    },
    onError: (err) => {
      enqueueSnackbar(`Error al registrar transacción: ${err.message}`, {
        variant: 'error',
      })
    },
  })

  const createCashFlow = async (input: CreateCashFlowInput) => {
    return mutate({
      variables: {
        input: {
          date: input.date,
          operation_type: input.operationType,
          amount: input.amount,
          detail: input.detail,
          member_id: input.memberId || undefined,
        },
      },
    })
  }

  return { createCashFlow, loading, error }
}
