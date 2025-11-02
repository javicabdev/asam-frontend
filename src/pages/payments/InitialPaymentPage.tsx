import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  Breadcrumbs,
  Link,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Button,
} from '@mui/material'
import { NavigateNext } from '@mui/icons-material'

import { InitialPaymentForm } from '@/features/payments/components/InitialPaymentForm'
import { PaymentSummary } from '@/features/payments/components/PaymentSummary'
import { useMemberData } from '@/features/payments/hooks/useMemberData'
import { useMemberPayments } from '@/features/payments/hooks/useMemberPayments'
import { usePaymentForm } from '@/features/payments/hooks/usePaymentForm'
import { useReceiptGenerator } from '@/features/payments/hooks/useReceiptGenerator'
import type { InitialPaymentFormData, PaymentListItem } from '@/features/payments/types'

export const InitialPaymentPage: React.FC = () => {
  const { memberId } = useParams<{ memberId: string }>()
  const navigate = useNavigate()
  const [paymentRegistered, setPaymentRegistered] = useState(false)
  const [paymentData, setPaymentData] = useState<any>(null)

  // Get member data
  const {
    member,
    family,
    isFamily,
    loading: memberLoading,
    error: memberError,
  } = useMemberData(memberId || '')

  // Load payments to find the PENDING payment created by backend
  const {
    payments,
    loading: paymentsLoading,
    error: paymentsError
  } = useMemberPayments(
    memberId || '',
    member?.tipo_membresia || 'INDIVIDUAL'
  )

  // Find the PENDING payment (automatically created by backend)
  const pendingPayment = React.useMemo(() => {
    const pending = payments.filter(p => p.status.toUpperCase() === 'PENDING')
    if (pending.length > 1) {
      console.warn('Multiple pending payments found, using most recent:', pending)
    }
    // Return most recent if multiple exist
    return pending.sort((a, b) => 
      new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime()
    )[0]
  }, [payments])

  // Check if payment is already PAID
  const isPaid = React.useMemo(() => {
    return payments.some(p => p.status.toUpperCase() === 'PAID')
  }, [payments])

  // Redirect if payment is already confirmed
  React.useEffect(() => {
    if (!paymentsLoading && isPaid && member) {
      console.log('Payment already confirmed, redirecting to member details')
      navigate(`/members/${memberId}`, { replace: true })
    }
  }, [isPaid, paymentsLoading, navigate, memberId, member])

  // Hook for receipt generation
  const { generateReceipt } = useReceiptGenerator()

  // Hook to handle payment form
  const {
    handleSubmit,
    loading: paymentLoading,
    error: paymentError,
  } = usePaymentForm({
    memberId: memberId || '',
    pendingPaymentId: pendingPayment?.id || '',
    getFamilyId: () => family?.id,
    isFamily,
    onSuccess: async (payment) => {
      console.log('✅ Payment confirmed, generating receipt...')
      
      // Mark as registered and show summary
      setPaymentData(payment)
      setPaymentRegistered(true)
      
      // Transform payment to PaymentListItem for receipt generation
      try {
        const paymentForReceipt: PaymentListItem = {
          id: payment.id,
          memberId: payment.member?.miembro_id,
          familyId: payment.family?.id,
          memberName: payment.member 
            ? `${payment.member.nombre} ${payment.member.apellidos}` 
            : '',
          memberNumber: payment.member?.numero_socio || payment.family?.numero_socio || '',
          familyName: payment.family 
            ? `${payment.family.esposo_nombre} y ${payment.family.esposa_nombre}` 
            : undefined,
          amount: payment.amount,
          paymentDate: payment.payment_date,
          status: 'PAID',
          paymentMethod: payment.payment_method,
          notes: payment.notes,
        }

        await generateReceipt(paymentForReceipt, true)
        console.log('✅ Receipt generated successfully')
      } catch (error) {
        console.error('❌ Error generating receipt:', error)
        // Don't fail the whole flow if receipt generation fails
      }
      
      // Clear session storage
      sessionStorage.removeItem(`payment_registered_${memberId}`)
      sessionStorage.removeItem(`payment_data_${memberId}`)
      
      // Show success message briefly, then redirect
      setTimeout(() => {
        navigate(`/members/${memberId}`, { replace: true })
      }, 2000)
    },
  })

  // Check if payment was already registered (prevents duplicates on page reload)
  useEffect(() => {
    const wasRegistered = sessionStorage.getItem(`payment_registered_${memberId}`)
    const storedPaymentData = sessionStorage.getItem(`payment_data_${memberId}`)
    
    if (wasRegistered === 'true' && storedPaymentData) {
      try {
        const payment = JSON.parse(storedPaymentData)
        setPaymentData(payment)
        setPaymentRegistered(true)
      } catch (error) {
        console.error('Error parsing stored payment data:', error)
        // Clear invalid data
        sessionStorage.removeItem(`payment_registered_${memberId}`)
        sessionStorage.removeItem(`payment_data_${memberId}`)
      }
    }
  }, [memberId])

  const onPaymentSubmit = async (formData: InitialPaymentFormData) => {
    await handleSubmit(formData)
  }

  const handleGoToMembers = () => {
    // Clear payment state when leaving the page
    sessionStorage.removeItem(`payment_registered_${memberId}`)
    sessionStorage.removeItem(`payment_data_${memberId}`)
    navigate('/members')
  }

  if (!memberId) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">ID de socio no válido</Alert>
      </Container>
    )
  }

  if (memberLoading || paymentsLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  if (memberError || !member) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">
          No se pudo cargar la información del socio. Por favor, verifica que el ID sea correcto.
        </Alert>
        <Button onClick={handleGoToMembers} sx={{ mt: 2 }}>
          Volver a Socios
        </Button>
      </Container>
    )
  }

  if (paymentsError) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">
          Error al cargar los pagos del socio. Por favor, intente nuevamente.
        </Alert>
        <Button onClick={handleGoToMembers} sx={{ mt: 2 }}>
          Volver a Socios
        </Button>
      </Container>
    )
  }

  if (!pendingPayment) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">
          No se encontró un pago pendiente para este socio. 
          El pago debe crearse automáticamente al registrar el socio.
          Por favor, contacte al administrador del sistema.
        </Alert>
        <Button onClick={handleGoToMembers} sx={{ mt: 2 }}>
          Volver a Socios
        </Button>
      </Container>
    )
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs separator={<NavigateNext fontSize="small" />} aria-label="breadcrumb">
          <Link
            underline="hover"
            color="inherit"
            href="#"
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.preventDefault()
              navigate('/dashboard')
            }}
          >
            Dashboard
          </Link>
          <Link
            underline="hover"
            color="inherit"
            href="#"
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.preventDefault()
              navigate('/members')
            }}
          >
            Socios
          </Link>
          <Typography color="text.primary">Pago Inicial</Typography>
        </Breadcrumbs>
      </Box>

      {/* Title */}
      <Typography variant="h4" component="h1" gutterBottom>
        Pago Inicial - Cuota de Alta
      </Typography>

      {/* Member Information */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Socio: {member.nombre} {member.apellidos}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Número de Socio: {member.numero_socio}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tipo de Membresía: {member.tipo_membresia === 'FAMILY' ? 'Familiar' : 'Individual'}
          </Typography>
          {isFamily && family && (
            <Typography variant="body2" color="text.secondary">
              Familia: {family.esposo_nombre} {family.esposo_apellidos} y {family.esposa_nombre}{' '}
              {family.esposa_apellidos}
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Form or Summary */}
      {!paymentRegistered ? (
        <>
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Pago en efectivo:</strong> Confirme que ha recibido el pago de la cuota inicial en efectivo.
              El pago se marcará como PAGADO tras la confirmación.
            </Typography>
          </Alert>

          <InitialPaymentForm
            memberId={memberId}
            pendingPayment={pendingPayment}
            onSubmit={onPaymentSubmit}
            onCancel={handleGoToMembers}
            loading={paymentLoading}
            error={paymentError}
          />
        </>
      ) : (
        <>
          <Alert severity="success" sx={{ mb: 3 }}>
            <Typography variant="h6">
              ✓ Pago Confirmado
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              El pago en efectivo ha sido registrado correctamente.
              {paymentData && ` Monto: ${paymentData.amount.toFixed(2)} €`}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              El recibo se ha generado automáticamente.
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
              Redirigiendo al detalle del socio...
            </Typography>
          </Alert>

          {paymentData && (
            <PaymentSummary
              amount={paymentData.amount}
              paymentMethod={paymentData.payment_method}
              status={paymentData.status}
              paymentDate={paymentData.payment_date}
              notes={paymentData.notes}
            />
          )}
        </>
      )}
    </Container>
  )
}

export default InitialPaymentPage
