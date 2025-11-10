import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Alert,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { repatriationSchema } from '../utils/validation'
import { useCreateCashFlow } from '../hooks/useCreateCashFlow'
import { OperationType } from '../types'
import { MemberAutocomplete } from '@/features/users/components/MemberAutocomplete'
import type { Member } from '@/graphql/generated/operations'

interface RepatriationFormDialogProps {
  open: boolean
  onClose: () => void
}

const DEFAULT_REPATRIATION_AMOUNT = -1500

export const RepatriationFormDialog = ({
  open,
  onClose,
}: RepatriationFormDialogProps) => {
  const { t } = useTranslation('cashflow')
  const { createCashFlow, loading } = useCreateCashFlow()
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(repatriationSchema),
    defaultValues: {
      date: new Date(),
      memberId: '',
      amount: DEFAULT_REPATRIATION_AMOUNT,
      detail: '',
    },
  })

  // Auto-rellenar concepto al seleccionar socio
  const handleMemberChange = (member: Member | null) => {
    setSelectedMember(member)
    if (member) {
      setValue('memberId', member.miembro_id)
      setValue(
        'detail',
        `Repatriación ${member.nombre} ${member.apellidos}`
      )
    }
  }

  const onSubmit = async (data: any) => {
    await createCashFlow({
      date: data.date.toISOString(),
      operationType: OperationType.GASTO_REPATRIACION,
      amount: data.amount,
      detail: data.detail,
      memberId: data.memberId,
    })
    reset()
    setSelectedMember(null)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>✈️ {t('repatriation.title')}</DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 3 }}>
            {t('repatriation.defaultAmountInfo')}
          </Alert>

          <Grid container spacing={3}>
            {/* Fecha */}
            <Grid item xs={12}>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label={`${t('repatriation.form.date')} *`}
                    value={field.value}
                    onChange={field.onChange}
                    maxDate={new Date()}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.date,
                        helperText: errors.date?.message,
                      },
                    }}
                  />
                )}
              />
            </Grid>

            {/* Socio (obligatorio) */}
            <Grid item xs={12}>
              <Controller
                name="memberId"
                control={control}
                render={() => (
                  <MemberAutocomplete
                    value={selectedMember}
                    onChange={handleMemberChange}
                    label={`${t('repatriation.form.member')} *`}
                    error={!!errors.memberId}
                    helperText={errors.memberId?.message}
                  />
                )}
              />
            </Grid>

            {/* Importe (editable) */}
            <Grid item xs={12}>
              <Controller
                name="amount"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    fullWidth
                    label={`${t('repatriation.form.amount')} *`}
                    inputProps={{
                      step: '0.01',
                      min: '0',
                    }}
                    InputProps={{
                      startAdornment: '-',
                      endAdornment: '€',
                    }}
                    error={!!errors.amount}
                    helperText={errors.amount?.message}
                    onChange={(e) => {
                      field.onChange(-Math.abs(parseFloat(e.target.value)))
                    }}
                    value={Math.abs(field.value || 0)}
                  />
                )}
              />
            </Grid>

            {/* Concepto (auto-rellenado) */}
            <Grid item xs={12}>
              <Controller
                name="detail"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={`${t('repatriation.form.detail')} *`}
                    multiline
                    rows={2}
                    error={!!errors.detail}
                    helperText={errors.detail?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            {t('actions.cancel')}
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="error"
            disabled={loading || !selectedMember}
          >
            {loading ? t('actions.registering') : t('actions.register')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
