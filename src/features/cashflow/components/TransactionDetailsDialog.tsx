import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
  Grid,
} from '@mui/material'
import { CashFlowTransaction } from '../types'
import { formatTransactionDate, formatAmount, formatCurrency } from '../utils/formatters'
import { getOperationTypeConfig } from '../utils/operationTypes'
import { useNavigate } from 'react-router-dom'

interface TransactionDetailsDialogProps {
  open: boolean
  transaction: CashFlowTransaction | null
  onClose: () => void
}

export const TransactionDetailsDialog = ({
  open,
  transaction,
  onClose,
}: TransactionDetailsDialogProps) => {
  const navigate = useNavigate()

  if (!transaction) return null

  const config = getOperationTypeConfig(transaction.operationType)

  const handleMemberClick = () => {
    if (transaction.member) {
      onClose()
      navigate(`/members/${transaction.member.id}`)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <span>{config.icon}</span>
          Detalles de Transacción
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3}>
          {/* Fecha */}
          <Grid item xs={12} md={6}>
            <Typography variant="caption" color="text.secondary">
              Fecha
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {formatTransactionDate(transaction.date)}
            </Typography>
          </Grid>

          {/* ID */}
          <Grid item xs={12} md={6}>
            <Typography variant="caption" color="text.secondary">
              ID
            </Typography>
            <Typography variant="body2" fontFamily="monospace">
              {transaction.id}
            </Typography>
          </Grid>

          {/* Categoría */}
          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary">
              Categoría
            </Typography>
            <Box mt={0.5}>
              <Chip
                label={config.label}
                size="medium"
                sx={{
                  bgcolor: config.color,
                  color: 'white',
                }}
              />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Concepto/Detalle */}
          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary">
              Concepto
            </Typography>
            <Typography variant="body1">{transaction.detail}</Typography>
          </Grid>

          {/* Importe */}
          <Grid item xs={12} md={6}>
            <Typography variant="caption" color="text.secondary">
              Importe
            </Typography>
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{
                color: transaction.amount >= 0 ? '#4caf50' : '#f44336',
              }}
            >
              {formatAmount(transaction.amount)}
            </Typography>
          </Grid>

          {/* Saldo Acumulado */}
          <Grid item xs={12} md={6}>
            <Typography variant="caption" color="text.secondary">
              Saldo Acumulado
            </Typography>
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{
                color: transaction.runningBalance >= 0 ? '#2e7d32' : '#d32f2f',
              }}
            >
              {formatCurrency(transaction.runningBalance)}
            </Typography>
          </Grid>

          {/* Socio */}
          {transaction.member && (
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary">
                Socio
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  cursor: 'pointer',
                  color: 'primary.main',
                  '&:hover': { textDecoration: 'underline' },
                }}
                onClick={handleMemberClick}
              >
                {transaction.member.firstName} {transaction.member.lastName}
                {transaction.member.memberNumber &&
                  ` (N° ${transaction.member.memberNumber})`}
              </Typography>
            </Grid>
          )}

          {/* Pago asociado */}
          {transaction.payment && (
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary">
                Recibo de Pago
              </Typography>
              <Typography variant="body1" fontFamily="monospace">
                #{transaction.payment.receiptNumber}
              </Typography>
            </Grid>
          )}

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Fecha de creación */}
          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary">
              Registrado el
            </Typography>
            <Typography variant="body2">
              {new Date(transaction.createdAt).toLocaleString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  )
}
