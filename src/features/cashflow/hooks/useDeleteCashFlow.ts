import { useDeleteCashFlowMutation } from '@/graphql/generated/operations'
import { useSnackbar } from 'notistack'

interface UseDeleteCashFlowResult {
  deleteCashFlow: (id: string) => Promise<any>
  loading: boolean
  error: any
}

export const useDeleteCashFlow = (): UseDeleteCashFlowResult => {
  const { enqueueSnackbar } = useSnackbar()

  const [mutate, { loading, error }] = useDeleteCashFlowMutation({
    refetchQueries: ['GetCashFlows', 'GetCashFlowBalance'],
    awaitRefetchQueries: true,
    onCompleted: () => {
      enqueueSnackbar('Transacción eliminada correctamente', {
        variant: 'success',
      })
    },
    onError: (err) => {
      enqueueSnackbar(`Error al eliminar transacción: ${err.message}`, {
        variant: 'error',
      })
    },
  })

  const deleteCashFlow = async (id: string) => {
    return mutate({ variables: { id } })
  }

  return { deleteCashFlow, loading, error }
}
