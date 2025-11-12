import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { createCashFlowSchema } from '../utils/validation'
import { useCreateCashFlow } from '../hooks/useCreateCashFlow'
import { useUpdateCashFlow } from '../hooks/useUpdateCashFlow'
import { getIncomeTypes, getExpenseTypes, getOperationTypeConfig } from '../utils/operationTypes'
import { OperationCategory, OperationType, CashFlowTransaction } from '../types'
import { MemberAutocomplete } from '@/features/users/components/MemberAutocomplete'
import type { Member } from '@/graphql/generated/operations'

interface TransactionFormDialogProps {
  open: boolean
  onClose: () => void
  transaction?: CashFlowTransaction | null
}

export const TransactionFormDialog = ({
  open,
  onClose,
  transaction,
}: TransactionFormDialogProps) => {
  const { t } = useTranslation('cashflow')
  const isEdit = !!transaction
  const [category, setCategory] = useState<OperationCategory>('INGRESO')
  const { createCashFlow, loading: createLoading } = useCreateCashFlow()
  const { updateCashFlow, loading: updateLoading } = useUpdateCashFlow()
  const loading = createLoading || updateLoading

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(createCashFlowSchema),
    defaultValues: {
      date: new Date(),
      operationType: '' as OperationType,
      amount: 0,
      detail: '',
      memberId: null as string | null,
    },
  })

  const selectedType = watch('operationType')
  const currentAmount = watch('amount')

  // Inicializar formulario cuando se abre en modo edición
  useEffect(() => {
    if (open && transaction) {
      const config = getOperationTypeConfig(transaction.operationType)
      setCategory(config.category)
      reset({
        date: new Date(transaction.date),
        operationType: transaction.operationType,
        amount: transaction.amount,
        detail: transaction.detail,
        memberId: transaction.member?.id || null,
      })
    } else if (open && !transaction) {
      // Reset al abrir para crear
      setCategory('INGRESO')
      reset({
        date: new Date(),
        operationType: '' as OperationType,
        amount: 0,
        detail: '',
        memberId: null,
      })
    }
  }, [open, transaction, reset])

  // Cambiar signo del amount según categoría
  useEffect(() => {
    if (category === 'GASTO' && currentAmount > 0) {
      setValue('amount', -Math.abs(currentAmount))
    } else if (category === 'INGRESO' && currentAmount < 0) {
      setValue('amount', Math.abs(currentAmount))
    }
  }, [category, currentAmount, setValue])

  const handleCategoryChange = (_: any, newCategory: OperationCategory | null) => {
    if (newCategory) {
      setCategory(newCategory)
      setValue('operationType', '' as OperationType)
      setValue('amount', 0)
    }
  }

  const onSubmit = async (data: any) => {
    try {
      const payload = {
        date: data.date.toISOString(),
        operationType: data.operationType,
        amount: data.amount,
        detail: data.detail,
        memberId: data.memberId,
      }

      if (isEdit && transaction) {
        await updateCashFlow({
          id: transaction.id,
          ...payload,
        })
      } else {
        await createCashFlow(payload)
      }

      reset()
      onClose()
    } catch (error) {
      // Error ya manejado por los hooks
      console.error('Error al guardar transacción:', error)
    }
  }

  const availableTypes =
    category === 'INGRESO' ? getIncomeTypes() : getExpenseTypes()

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEdit ? t('form.edit') : t('form.new')}</DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={3}>
            {/* Selector Ingreso/Gasto */}
            <Grid item xs={12}>
              <ToggleButtonGroup
                value={category}
                exclusive
                onChange={handleCategoryChange}
                fullWidth
              >
                <ToggleButton value="INGRESO" color="success">
                  <AddIcon sx={{ mr: 1 }} />
                  {t('form.income')}
                </ToggleButton>
                <ToggleButton value="GASTO" color="error">
                  <RemoveIcon sx={{ mr: 1 }} />
                  {t('form.expense')}
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>

            {/* Fecha */}
            <Grid item xs={12} md={6}>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <DateTimePicker
                    label={`${t('form.fields.date')} *`}
                    value={field.value}
                    onChange={field.onChange}
                    maxDateTime={new Date()}
                    ampm={false}
                    format="dd/MM/yyyy HH:mm"
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

            {/* Tipo de operación */}
            <Grid item xs={12} md={6}>
              <Controller
                name="operationType"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label={`${t('form.fields.category')} *`}
                    error={!!errors.operationType}
                    helperText={errors.operationType?.message}
                  >
                    {availableTypes.map((type) => {
                      const config = getOperationTypeConfig(type)
                      return (
                        <MenuItem key={type} value={type}>
                          {config.icon} {t(`operationTypes.${type}`)}
                        </MenuItem>
                      )
                    })}
                  </TextField>
                )}
              />
            </Grid>

            {/* Importe */}
            <Grid item xs={12} md={6}>
              <Controller
                name="amount"
                control={control}
                render={({ field }) => {
                  const absValue = Math.abs(field.value || 0)
                  const hasValue = absValue > 0

                  return (
                    <TextField
                      {...field}
                      type="number"
                      fullWidth
                      label={`${t('form.fields.amount')} *`}
                      inputProps={{
                        step: '0.01',
                        min: '0',
                      }}
                      InputProps={{
                        startAdornment: hasValue ? (category === 'INGRESO' ? '+' : '-') : undefined,
                        endAdornment: '€',
                      }}
                      error={!!errors.amount}
                      helperText={errors.amount?.message}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value)
                        field.onChange(
                          category === 'GASTO' ? -Math.abs(value) : Math.abs(value)
                        )
                      }}
                      value={absValue || ''}
                    />
                  )
                }}
              />
            </Grid>

            {/* Concepto */}
            <Grid item xs={12}>
              <Controller
                name="detail"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={`${t('form.fields.detail')} *`}
                    multiline
                    rows={2}
                    error={!!errors.detail}
                    helperText={errors.detail?.message}
                  />
                )}
              />
            </Grid>

            {/* Socio (condicional para repatriación) */}
            {selectedType === OperationType.GASTO_REPATRIACION && (
              <Grid item xs={12}>
                <Controller
                  name="memberId"
                  control={control}
                  render={({ field }) => (
                    <MemberAutocomplete
                      value={null}
                      onChange={(member: Member | null) => {
                        field.onChange(member?.miembro_id || null)
                      }}
                      label={`${t('form.fields.member')} *`}
                      error={!!errors.memberId}
                      helperText={errors.memberId?.message || t('form.memberRequired')}
                    />
                  )}
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            {t('actions.cancel')}
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
          >
            {loading
              ? isEdit
                ? t('actions.updating')
                : t('actions.registering')
              : isEdit
                ? t('actions.update')
                : t('actions.register')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
