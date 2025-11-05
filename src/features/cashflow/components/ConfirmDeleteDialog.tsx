import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material'
import WarningIcon from '@mui/icons-material/Warning'
import { CashFlowTransaction } from '../types'
import { useDeleteCashFlow } from '../hooks/useDeleteCashFlow'
import { formatTransactionDate, formatAmount } from '../utils/formatters'
import { getOperationTypeConfig } from '../utils/operationTypes'

interface ConfirmDeleteDialogProps {
  open: boolean
  transaction: CashFlowTransaction | null
  onClose: () => void
}

export const ConfirmDeleteDialog = ({
  open,
  transaction,
  onClose,
}: ConfirmDeleteDialogProps) => {
  const { deleteCashFlow, loading } = useDeleteCashFlow()

  if (!transaction) return null

  const config = getOperationTypeConfig(transaction.operationType)

  const handleConfirm = async () => {
    await deleteCashFlow(transaction.id)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <WarningIcon color="error" />
          Confirmar Eliminación
        </Box>
      </DialogTitle>

      <DialogContent>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Esta acción no se puede deshacer. La transacción se eliminará
          permanentemente.
        </Alert>

        <Typography variant="body1" gutterBottom>
          ¿Estás seguro de que deseas eliminar esta transacción?
        </Typography>

        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
          <Typography variant="body2">
            <strong>Fecha:</strong> {formatTransactionDate(transaction.date)}
          </Typography>
          <Typography variant="body2">
            <strong>Categoría:</strong> {config.icon} {config.label}
          </Typography>
          <Typography variant="body2">
            <strong>Concepto:</strong> {transaction.detail}
          </Typography>
          <Typography variant="body2">
            <strong>Importe:</strong>{' '}
            <span
              style={{
                color: transaction.amount >= 0 ? '#4caf50' : '#f44336',
                fontWeight: 'bold',
              }}
            >
              {formatAmount(transaction.amount)}
            </span>
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={handleConfirm}
          color="error"
          variant="contained"
          disabled={loading}
        >
          {loading ? 'Eliminando...' : 'Eliminar'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
