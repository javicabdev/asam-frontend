import { useUpdateCashFlowMutation } from '@/graphql/generated/operations'
import { useSnackbar } from 'notistack'
import { UpdateCashFlowInput } from '../types'

interface UseUpdateCashFlowResult {
  updateCashFlow: (input: UpdateCashFlowInput) => Promise<any>
  loading: boolean
  error: any
}

export const useUpdateCashFlow = (): UseUpdateCashFlowResult => {
  const { enqueueSnackbar } = useSnackbar()

  const [mutate, { loading, error }] = useUpdateCashFlowMutation({
    refetchQueries: ['GetCashFlows', 'GetCashFlowBalance'],
    awaitRefetchQueries: true,
    onCompleted: () => {
      enqueueSnackbar('Transacción actualizada correctamente', {
        variant: 'success',
      })
    },
    onError: (err) => {
      enqueueSnackbar(`Error al actualizar transacción: ${err.message}`, {
        variant: 'error',
      })
    },
  })

  const updateCashFlow = async (input: UpdateCashFlowInput) => {
    const { id, ...updateData } = input
    return mutate({
      variables: {
        id,
        input: {
          date: updateData.date,
          operation_type: updateData.operationType,
          amount: updateData.amount,
          detail: updateData.detail,
          member_id: updateData.memberId || undefined,
        },
      },
    })
  }

  return { updateCashFlow, loading, error }
}
