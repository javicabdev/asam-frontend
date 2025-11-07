import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material'
import { Warning as WarningIcon, ErrorOutline as ErrorIcon } from '@mui/icons-material'
import { useMutation } from '@apollo/client'
import { useSnackbar } from 'notistack'
import { useTranslation } from 'react-i18next'

import { CHANGE_MEMBER_STATUS_MUTATION } from '../api/mutations'
import { LIST_MEMBERS_QUERY } from '../api/queries'
import { useGetMemberPaymentsQuery } from '@/features/payments/api/queries'
import type { Member, MemberStatus } from '../types'

interface ConfirmDeactivateDialogProps {
  open: boolean
  member: Member | null
  onClose: () => void
  onSuccess?: () => void
}

export const ConfirmDeactivateDialog: React.FC<ConfirmDeactivateDialogProps> = ({
  open,
  member,
  onClose,
  onSuccess,
}) => {
  const { t } = useTranslation('members')
  const { enqueueSnackbar } = useSnackbar()

  // Check for pending payments
  const { data: paymentsData, loading: paymentsLoading } = useGetMemberPaymentsQuery({
    variables: { memberId: member?.miembro_id || '' },
    skip: !open || !member,
  })

  const pendingPayments = React.useMemo(() => {
    return (paymentsData?.getMemberPayments || []).filter(
      (payment) => payment.status.toUpperCase() === 'PENDING'
    )
  }, [paymentsData])

  const hasPendingPayments = pendingPayments.length > 0
  const totalPendingAmount = React.useMemo(() => {
    return pendingPayments.reduce((sum, payment) => sum + payment.amount, 0)
  }, [pendingPayments])

  const [changeMemberStatus, { loading, error }] = useMutation(
    CHANGE_MEMBER_STATUS_MUTATION,
    {
      refetchQueries: [{ query: LIST_MEMBERS_QUERY }],
      onCompleted: () => {
        enqueueSnackbar(t('deactivateDialog.successMessage'), { variant: 'success' })
        onSuccess?.()
        onClose()
      },
      onError: (err) => {
        enqueueSnackbar(`${t('deactivateDialog.errorMessage')}: ${err.message}`, { variant: 'error' })
      },
    }
  )

  const handleConfirm = () => {
    if (!member) return

    void changeMemberStatus({
      variables: {
        id: member.miembro_id,
        status: 'INACTIVE' as MemberStatus,
      },
    })
  }

  if (!member) return null

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon color="warning" />
          <Typography variant="h6" component="span">
            {t('deactivateDialog.title')}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error.message}
          </Alert>
        )}

        {paymentsLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}

        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" gutterBottom>
            {t('deactivateDialog.confirmMessage')}
          </Typography>
        </Box>

        <Box
          sx={{
            p: 2,
            bgcolor: 'background.default',
            borderRadius: 1,
            border: 1,
            borderColor: 'divider',
          }}
        >
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {t('deactivateDialog.memberNumber')}:
          </Typography>
          <Typography variant="h6" gutterBottom>
            {member.numero_socio}
          </Typography>

          <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mt: 1 }}>
            {t('deactivateDialog.fullName')}:
          </Typography>
          <Typography variant="h6">
            {member.nombre} {member.apellidos}
          </Typography>
        </Box>

        {hasPendingPayments ? (
          <Alert severity="error" icon={<ErrorIcon />} sx={{ mt: 2 }}>
            <Typography variant="body2" fontWeight="bold" gutterBottom>
              {t('deactivateDialog.errorTitle')}
            </Typography>
            <Typography variant="body2">
              {t('deactivateDialog.errorPendingPayments', {
                count: pendingPayments.length,
                amount: totalPendingAmount.toFixed(2),
              })}
            </Typography>
          </Alert>
        ) : (
          <Alert severity="warning" sx={{ mt: 2 }}>
            <Typography variant="body2">
              {t('deactivateDialog.warningMessage')}
            </Typography>
          </Alert>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {t('deactivateDialog.cancel')}
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="error"
          disabled={loading || hasPendingPayments || paymentsLoading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? t('deactivateDialog.processing') : t('deactivateDialog.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
