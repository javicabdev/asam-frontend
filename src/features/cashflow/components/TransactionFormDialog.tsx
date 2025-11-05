import { useState, useEffect } from 'react'
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
import { DatePicker } from '@mui/x-date-pickers'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { createCashFlowSchema } from '../utils/validation'
import { useCreateCashFlow } from '../hooks/useCreateCashFlow'
import { getIncomeTypes, getExpenseTypes, getOperationTypeConfig } from '../utils/operationTypes'
import { OperationCategory, OperationType } from '../types'
import { MemberAutocomplete } from '@/features/users/components/MemberAutocomplete'
import type { Member } from '@/graphql/generated/operations'

interface TransactionFormDialogProps {
  open: boolean
  onClose: () => void
}

export const TransactionFormDialog = ({
  open,
  onClose,
}: TransactionFormDialogProps) => {
  const [category, setCategory] = useState<OperationCategory>('INGRESO')
  const { createCashFlow, loading } = useCreateCashFlow()

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
      await createCashFlow({
        date: data.date.toISOString(),
        operationType: data.operationType,
        amount: data.amount,
        detail: data.detail,
        memberId: data.memberId,
      })
      reset()
      onClose()
    } catch (error) {
      // Error ya manejado por el hook useCreateCashFlow
      console.error('Error al crear transacción:', error)
    }
  }

  const availableTypes =
    category === 'INGRESO' ? getIncomeTypes() : getExpenseTypes()

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Registrar Transacción</DialogTitle>

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
                  Ingreso
                </ToggleButton>
                <ToggleButton value="GASTO" color="error">
                  <RemoveIcon sx={{ mr: 1 }} />
                  Gasto
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>

            {/* Fecha */}
            <Grid item xs={12} md={6}>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Fecha *"
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
                    label="Categoría *"
                    error={!!errors.operationType}
                    helperText={errors.operationType?.message}
                  >
                    {availableTypes.map((type) => {
                      const config = getOperationTypeConfig(type)
                      return (
                        <MenuItem key={type} value={type}>
                          {config.icon} {config.label}
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
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    fullWidth
                    label="Importe *"
                    InputProps={{
                      startAdornment: category === 'INGRESO' ? '+' : '-',
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
                    value={Math.abs(field.value || 0)}
                  />
                )}
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
                    label="Concepto *"
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
                      label="Socio *"
                      error={!!errors.memberId}
                      helperText={errors.memberId?.message || 'Obligatorio para repatriaciones'}
                    />
                  )}
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Registrar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
