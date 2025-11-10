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
import { useTranslation } from 'react-i18next'

import { InitialPaymentForm } from '@/features/payments/components/InitialPaymentForm'
import { PaymentSummary } from '@/features/payments/components/PaymentSummary'
import { useMemberData } from '@/features/payments/hooks/useMemberData'
import { useMemberPayments } from '@/features/payments/hooks/useMemberPayments'
import { usePaymentForm } from '@/features/payments/hooks/usePaymentForm'
import { useReceiptGenerator } from '@/features/payments/hooks/useReceiptGenerator'
import type { InitialPaymentFormData, PaymentListItem } from '@/features/payments/types'
import type { ConfirmPaymentMutation } from '@/features/payments/api/mutations'

type ConfirmedPayment = ConfirmPaymentMutation['confirmPayment']

export const InitialPaymentPage: React.FC = () => {
  const { t } = useTranslation('payments')
  const { memberId } = useParams<{ memberId: string }>()
  const navigate = useNavigate()
  const [paymentRegistered, setPaymentRegistered] = useState(false)
  const [paymentData, setPaymentData] = useState<ConfirmedPayment | null>(null)
  const [hasWaitedEnough, setHasWaitedEnough] = useState(false)

  // Get member data
  const {
    member,
    family,
    isFamily,
    loading: memberLoading,
    error: memberError,
  } = useMemberData(memberId || '')

  // Load member payments
  const {
    payments,
    loading: paymentsLoading,
    error: paymentsError
  } = useMemberPayments(
    memberId || '',
    member?.tipo_membresia || 'INDIVIDUAL',
    !member // skip if member not loaded yet
  )

  // Find the PENDING payment
  const pendingPayment = React.useMemo(() => {
    console.log('🔍 [InitialPaymentPage] Buscando pago pendiente...')
    console.log('   Total payments:', payments.length)
    console.log('   Payments:', payments.map(p => ({ id: p.id, status: p.status, raw_status: p.status })))

    const pending = payments.filter(p => {
      const statusUpper = p.status.toUpperCase()
      console.log(`   Checking payment ${p.id}: status="${p.status}" -> uppercase="${statusUpper}" -> isPending=${statusUpper === 'PENDING'}`)
      return statusUpper === 'PENDING'
    })

    console.log('   Pending payments found:', pending.length)
    if (pending.length > 1) {
      console.warn('   Multiple pending payments found, using most recent:', pending)
    }

    // Return most recent if multiple exist (handle null payment_date)
    const result = pending.sort((a, b) => {
      const dateA = a.payment_date ? new Date(a.payment_date).getTime() : 0
      const dateB = b.payment_date ? new Date(b.payment_date).getTime() : 0
      return dateB - dateA
    })[0]

    console.log('   Selected pending payment:', result)
    return result
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
    isFamily,
    onSuccess: async (payment) => {
      console.log('✅ Payment confirmed, generating receipt...', payment)

      // Mark as registered and show summary
      setPaymentData(payment)
      setPaymentRegistered(true)

      // Transform payment to PaymentListItem for receipt generation
      try {
        // Validate that we have member data
        if (!payment.member) {
          console.error('❌ Payment confirmed but member data is missing')
          throw new Error('No se pudo obtener la información del socio')
        }

        const isFamilyPayment = payment.member.tipo_membresia === 'FAMILY'
        const paymentForReceipt: PaymentListItem = {
          id: payment.id,
          memberId: payment.member.miembro_id,
          memberName: `${payment.member.nombre} ${payment.member.apellidos}`,
          memberNumber: payment.member.numero_socio,
          familyName: isFamilyPayment
            ? `Familia ${payment.member.numero_socio}`
            : undefined,
          amount: payment.amount,
          paymentDate: payment.payment_date ?? null,
          status: 'PAID',
          paymentMethod: payment.payment_method ?? null,
          notes: payment.notes ?? null,
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

  // Wait 10 seconds before showing "payment not found" error
  // This handles the race condition where backend creates payment asynchronously
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasWaitedEnough(true)
    }, 10000) // 10 seconds

    return () => clearTimeout(timer)
  }, [])

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
        <Alert severity="error">{t('initialPaymentPage.errors.invalidMemberId')}</Alert>
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
          {t('initialPaymentPage.errors.memberNotFound')}
        </Alert>
        <Button onClick={handleGoToMembers} sx={{ mt: 2 }}>
          {t('initialPaymentPage.actions.backToMembers')}
        </Button>
      </Container>
    )
  }

  if (paymentsError) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">
          {t('initialPaymentPage.errors.paymentsError')}
        </Alert>
        <Button onClick={handleGoToMembers} sx={{ mt: 2 }}>
          {t('initialPaymentPage.actions.backToMembers')}
        </Button>
      </Container>
    )
  }

  // Show loading while waiting for payment to be created by backend
  if (!paymentsLoading && member && !pendingPayment && !hasWaitedEnough) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <CircularProgress />
          <Typography variant="body1" color="text.secondary">
            {t('initialPaymentPage.loading.preparingPayment')}
          </Typography>
        </Box>
      </Container>
    )
  }

  // Only show "no pending payment" error if we finished loading, there's no payment, AND we've waited enough time
  // This prevents showing the error during backend async payment creation
  if (!paymentsLoading && member && !pendingPayment && hasWaitedEnough) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">
          {t('initialPaymentPage.errors.noPendingPayment')}
        </Alert>
        <Button onClick={handleGoToMembers} sx={{ mt: 2 }}>
          {t('initialPaymentPage.actions.backToMembers')}
        </Button>
      </Container>
    )
  }

  // Don't render form if pendingPayment is not available yet
  if (!pendingPayment) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
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
            {t('initialPaymentPage.breadcrumbs.dashboard')}
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
            {t('initialPaymentPage.breadcrumbs.members')}
          </Link>
          <Typography color="text.primary">{t('initialPaymentPage.breadcrumbs.initialPayment')}</Typography>
        </Breadcrumbs>
      </Box>

      {/* Title */}
      <Typography variant="h4" component="h1" gutterBottom>
        {t('initialPaymentPage.title')}
      </Typography>

      {/* Member Information */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {t('initialPaymentPage.memberInfo.title')}: {member.nombre} {member.apellidos}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('initialPaymentPage.memberInfo.memberNumber')}: {member.numero_socio}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('initialPaymentPage.memberInfo.membershipType')}: {member.tipo_membresia === 'FAMILY' ? t('initialPaymentPage.memberInfo.typeFamily') : t('initialPaymentPage.memberInfo.typeIndividual')}
          </Typography>
          {isFamily && family && (
            <Typography variant="body2" color="text.secondary">
              {t('initialPaymentPage.memberInfo.family')}: {family.esposo_nombre} {family.esposo_apellidos} y {family.esposa_nombre}{' '}
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
              <strong>{t('initialPaymentPage.alert.cashPaymentTitle')}</strong> {t('initialPaymentPage.alert.cashPaymentMessage')}
            </Typography>
          </Alert>

          <InitialPaymentForm
            memberId={memberId}
            pendingPayment={pendingPayment}
            memberRegistrationDate={member.fecha_alta} // ⭐ Pasar fecha de alta para mostrar en el formulario
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
              {t('initialPaymentPage.success.title')}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {t('initialPaymentPage.success.message')}
              {paymentData && ` ${t('initialPaymentPage.success.amount')} ${new Intl.NumberFormat('es-ES', {
                style: 'currency',
                currency: 'EUR',
                useGrouping: true,
              }).format(paymentData.amount)}`}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {t('initialPaymentPage.success.receiptGenerated')}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
              {t('initialPaymentPage.success.redirecting')}
            </Typography>
          </Alert>

          {paymentData && paymentData.payment_method && paymentData.payment_date && (
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
