import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Close } from '@mui/icons-material'
import { DebtorType } from '../types'
import type { Debtor } from '../types'
import { DebtorTypeChip } from './DebtorTypeChip'
import { formatCurrency, formatDate } from '../utils/delinquentFormatters'

interface DebtDetailsDialogProps {
  debtor: Debtor | null
  open: boolean
  onClose: () => void
}

/**
 * Obtiene el nombre completo del deudor
 */
function getDebtorName(debtor: Debtor): string {
  if (debtor.type === 'INDIVIDUAL' && debtor.member) {
    return `${debtor.member.firstName} ${debtor.member.lastName}`
  } else if (debtor.type === 'FAMILY' && debtor.family) {
    return debtor.family.familyName
  }
  return '-'
}

/**
 * Obtiene el número de socio del deudor
 */
function getDebtorMemberNumber(debtor: Debtor): string {
  if (debtor.type === 'INDIVIDUAL' && debtor.member) {
    return debtor.member.memberNumber
  } else if (debtor.type === 'FAMILY' && debtor.family) {
    return debtor.family.primaryMember.memberNumber
  }
  return '-'
}

/**
 * Obtiene el email del deudor
 */
function getDebtorEmail(debtor: Debtor): string {
  if (debtor.type === 'INDIVIDUAL' && debtor.member) {
    return debtor.member.email || '-'
  } else if (debtor.type === 'FAMILY' && debtor.family) {
    return debtor.family.primaryMember.email || '-'
  }
  return '-'
}

/**
 * Obtiene el teléfono del deudor
 */
function getDebtorPhone(debtor: Debtor): string {
  if (debtor.type === 'INDIVIDUAL' && debtor.member) {
    return debtor.member.phone || '-'
  } else if (debtor.type === 'FAMILY' && debtor.family) {
    return debtor.family.primaryMember.phone || '-'
  }
  return '-'
}

/**
 * Diálogo con el detalle completo de la deuda de un socio/familia
 */
export function DebtDetailsDialog({
  debtor,
  open,
  onClose,
}: DebtDetailsDialogProps) {
  const { t } = useTranslation('reports')

  if (!debtor) return null

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6" component="span">
            {getDebtorName(debtor)}
          </Typography>
          <DebtorTypeChip type={debtor.type as DebtorType} />
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* Información general */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            {t('delinquent.details.generalInfo')}
          </Typography>
          <Box sx={{ display: 'grid', gap: 1, mt: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                {t('delinquent.table.memberNumber')}:
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {getDebtorMemberNumber(debtor)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                {t('delinquent.details.email')}:
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {getDebtorEmail(debtor)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                {t('delinquent.details.phone')}:
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {getDebtorPhone(debtor)}
              </Typography>
            </Box>
            {debtor.type === 'FAMILY' && debtor.family && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  {t('delinquent.details.familyMembers')}:
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {debtor.family.totalMembers}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        <Divider />

        {/* Resumen de deuda */}
        <Box sx={{ my: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            {t('delinquent.details.debtSummary')}
          </Typography>
          <Box sx={{ display: 'grid', gap: 1, mt: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                {t('delinquent.table.totalDebt')}:
              </Typography>
              <Typography
                variant="body2"
                fontWeight="bold"
                color="error.main"
              >
                {formatCurrency(debtor.totalDebt)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                {t('delinquent.table.oldestDebt')}:
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {t('delinquent.table.daysOverdue', {
                  count: debtor.oldestDebtDays,
                })}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                {t('delinquent.details.oldestDebtDate')}:
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {formatDate(debtor.oldestDebtDate)}
              </Typography>
            </Box>
            {debtor.lastPaymentDate && (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    {t('delinquent.table.lastPayment')}:
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {formatDate(debtor.lastPaymentDate)}
                  </Typography>
                </Box>
                {debtor.lastPaymentAmount && (
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {t('delinquent.details.lastPaymentAmount')}:
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {formatCurrency(debtor.lastPaymentAmount)}
                    </Typography>
                  </Box>
                )}
              </>
            )}
          </Box>
        </Box>

        <Divider />

        {/* Lista de pagos pendientes */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            {t('delinquent.details.pendingPayments')} (
            {debtor.pendingPayments.length})
          </Typography>
          <List dense>
            {debtor.pendingPayments.map((payment) => (
              <ListItem
                key={payment.id}
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  mb: 1,
                }}
              >
                <ListItemText
                  primary={
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Typography variant="body2" fontWeight="medium">
                        {formatCurrency(payment.amount)}
                      </Typography>
                      <Chip
                        label={t('delinquent.table.daysOverdue', { count: payment.daysOverdue })}
                        size="small"
                        color={payment.daysOverdue > 90 ? 'error' : 'warning'}
                      />
                    </Box>
                  }
                  secondary={
                    <Box sx={{ mt: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        {t('delinquent.details.createdAt')}:{' '}
                        {formatDate(payment.createdAt)}
                      </Typography>
                      {payment.notes && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                        >
                          {payment.notes}
                        </Typography>
                      )}
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} startIcon={<Close />}>
          {t('delinquent.actions.close')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
