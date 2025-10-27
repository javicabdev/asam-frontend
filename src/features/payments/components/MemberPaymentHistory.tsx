import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Stack,
  Divider,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Receipt as ReceiptIcon, Launch as LaunchIcon } from '@mui/icons-material'
import { useSnackbar } from 'notistack'

import { useMemberPayments, MemberPayment } from '../hooks/useMemberPayments'
import { PaymentStatusChip } from './PaymentStatusChip'
import { useReceiptGenerator } from '../hooks/useReceiptGenerator'
import type { PaymentListItem } from '../types'

interface MemberPaymentHistoryProps {
  memberId: string
  membershipType: 'INDIVIDUAL' | 'FAMILY'
  maxRows?: number
}

/**
 * Component to display member's payment history
 * Shows a compact table with recent payments and summary
 */
export function MemberPaymentHistory({ memberId, membershipType, maxRows = 10 }: MemberPaymentHistoryProps) {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const { payments, loading, error, totalPaid } = useMemberPayments(memberId, membershipType)
  const { generateReceipt, isGenerating } = useReceiptGenerator()

  // Format currency to EUR
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount)
  }

  // Format date to DD/MM/YYYY
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString)
      return format(date, 'dd/MM/yyyy', { locale: es })
    } catch {
      return dateString
    }
  }

  // Translate payment method
  const translateMethod = (method: string): string => {
    const translations: Record<string, string> = {
      CASH: 'Efectivo',
      TRANSFER: 'Transferencia',
      CARD: 'Tarjeta',
    }
    return translations[method] || method
  }

  // Handle download receipt
  const handleDownloadReceipt = async (payment: MemberPayment) => {
    try {
      // Validate that we have either member or family data
      if (!payment.member && !payment.family) {
        enqueueSnackbar(
          'Error: El pago no tiene datos de socio o familia asociados. Por favor, contacte con soporte.',
          { variant: 'error' }
        )
        return
      }
      
      // Transform MemberPayment (nested GraphQL structure) to PaymentListItem (flat structure)
      const paymentListItem: PaymentListItem = {
        id: payment.id,
        memberName: payment.member
          ? `${payment.member.nombre} ${payment.member.apellidos}`
          : `${payment.family!.esposo_nombre} ${payment.family!.esposa_nombre}`,
        memberNumber: payment.member
          ? payment.member.numero_socio
          : payment.family!.numero_socio,
        familyName: payment.family
          ? `${payment.family.esposo_nombre} ${payment.family.esposa_nombre}`
          : undefined,
        amount: payment.amount,
        paymentDate: payment.payment_date,
        status: payment.status as 'PENDING' | 'PAID' | 'CANCELLED',
        paymentMethod: payment.payment_method,
        notes: payment.notes,
      }

      await generateReceipt(paymentListItem, true)
      
      enqueueSnackbar('Recibo generado exitosamente', { variant: 'success' })
    } catch (error) {
      console.error('Error downloading receipt:', error)
      enqueueSnackbar(
        'Error al generar el recibo. Por favor, inténtelo de nuevo.',
        { variant: 'error' }
      )
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={4}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        Error al cargar el historial de pagos: {error.message}
      </Alert>
    )
  }

  const displayPayments = payments.slice(0, maxRows)
  const hasMorePayments = payments.length > maxRows

  return (
    <Box>
      {/* Header with summary */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          <Typography variant="h6" gutterBottom>
            Historial de Pagos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {payments.length} {payments.length === 1 ? 'pago registrado' : 'pagos registrados'}
          </Typography>
        </Box>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box textAlign="right">
            <Typography variant="caption" color="text.secondary" display="block">
              Total Pagado
            </Typography>
            <Typography variant="h6" color="success.main" fontWeight="bold">
              {formatCurrency(totalPaid)}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            size="small"
            endIcon={<LaunchIcon />}
            onClick={() => navigate(`/payments?search=${memberId}`)}
          >
            Ver Todos
          </Button>
        </Stack>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {payments.length === 0 ? (
        <Alert severity="info" sx={{ my: 2 }}>
          Este socio aún no tiene pagos registrados.
        </Alert>
      ) : (
        <>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Método</TableCell>
                  <TableCell align="right">Importe</TableCell>
                  <TableCell align="center">Estado</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayPayments.map((payment) => (
                  <TableRow
                    key={payment.id}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                  >
                    <TableCell>{formatDate(payment.payment_date)}</TableCell>
                    <TableCell>{translateMethod(payment.payment_method)}</TableCell>
                    <TableCell align="right">
                      <Typography
                        variant="body2"
                        fontWeight="medium"
                        color="success.main"
                      >
                        {formatCurrency(payment.amount)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <PaymentStatusChip status={payment.status} />
                    </TableCell>
                    <TableCell align="center">
                      {payment.status.toUpperCase() === 'PAID' && (
                        <Button
                          size="small"
                          startIcon={<ReceiptIcon />}
                          onClick={() => handleDownloadReceipt(payment)}
                          disabled={isGenerating}
                        >
                          Recibo
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {hasMorePayments && (
            <Box display="flex" justifyContent="center" mt={2}>
              <Button
                variant="text"
                size="small"
                onClick={() => navigate(`/payments?search=${memberId}`)}
              >
                Ver los {payments.length - maxRows} pagos restantes →
              </Button>
            </Box>
          )}
        </>
      )}
    </Box>
  )
}
