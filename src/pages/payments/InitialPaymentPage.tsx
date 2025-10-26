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
import { NavigateNext, ArrowForward } from '@mui/icons-material'

import { InitialPaymentForm } from '@/features/payments/components/InitialPaymentForm'
import { PaymentSummary } from '@/features/payments/components/PaymentSummary'
import { useMemberData } from '@/features/payments/hooks/useMemberData'
import { usePaymentForm } from '@/features/payments/hooks/usePaymentForm'
import type { InitialPaymentFormData } from '@/features/payments/types'

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

  // Hook to handle payment form
  const {
    handleSubmit,
    loading: paymentLoading,
    error: paymentError,
  } = usePaymentForm({
    memberId: memberId || '',
    familyId: family?.id,
    isFamily,
    onSuccess: (payment) => {
      // Mark as registered and show summary
      setPaymentData(payment)
      setPaymentRegistered(true)
      
      // CRITICAL: Replace history entry to prevent going back to the form
      // This prevents duplicate payments if user clicks browser back button
      navigate(`/payments/initial/${memberId}`, { replace: true })
      
      // Persist payment state in sessionStorage to prevent re-submission on page reload
      sessionStorage.setItem(`payment_registered_${memberId}`, 'true')
      sessionStorage.setItem(`payment_data_${memberId}`, JSON.stringify(payment))
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

  const handleGoToMemberDetails = () => {
    // Clear payment state when leaving the page
    sessionStorage.removeItem(`payment_registered_${memberId}`)
    sessionStorage.removeItem(`payment_data_${memberId}`)
    navigate(`/members/${memberId}`)
  }

  if (!memberId) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">ID de socio no válido</Alert>
      </Container>
    )
  }

  if (memberLoading) {
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
              <strong>Importante:</strong> Registre el pago inicial de la cuota de alta. El pago
              se marcará como PENDIENTE hasta que sea confirmado manualmente.
            </Typography>
          </Alert>

          <InitialPaymentForm
            memberId={memberId}
            onSubmit={onPaymentSubmit}
            onCancel={handleGoToMembers}
            loading={paymentLoading}
            error={paymentError}
          />
        </>
      ) : (
        <>
          {paymentData && (
            <PaymentSummary
              amount={paymentData.amount}
              paymentMethod={paymentData.payment_method}
              status={paymentData.status}
              paymentDate={paymentData.payment_date}
              notes={paymentData.notes}
            />
          )}

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
            <Button variant="outlined" onClick={handleGoToMembers}>
              Ir a Lista de Socios
            </Button>
            <Button
              variant="contained"
              endIcon={<ArrowForward />}
              onClick={handleGoToMemberDetails}
            >
              Ver Detalles del Socio
            </Button>
          </Box>
        </>
      )}
    </Container>
  )
}

export default InitialPaymentPage
