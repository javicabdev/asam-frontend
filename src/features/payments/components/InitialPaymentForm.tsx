import React from 'react'
import {
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
  Alert,
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import {
  InitialPaymentFormData,
  PAYMENT_METHODS,
  DEFAULT_INITIAL_PAYMENT_AMOUNT,
} from '../types'

// Schema de validación explícitamente tipado
const validationSchema: Yup.ObjectSchema<InitialPaymentFormData> = Yup.object({
  amount: Yup.number()
    .required('El monto es obligatorio')
    .positive('El monto debe ser positivo')
    .min(1, 'El monto mínimo es 1€'),
  payment_method: Yup.string().required('El método de pago es obligatorio'),
  notes: Yup.string().nullable().optional(),
}).required()

interface InitialPaymentFormComponentProps {
  memberId: string
  onSubmit: (data: InitialPaymentFormData) => void | Promise<void>
  onCancel?: () => void
  loading: boolean
  error: string | null
}

export const InitialPaymentForm: React.FC<InitialPaymentFormComponentProps> = ({
  onSubmit,
  onCancel,
  loading,
  error,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<InitialPaymentFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      amount: DEFAULT_INITIAL_PAYMENT_AMOUNT,
      payment_method: 'Efectivo',
      notes: null,
    },
  })

  const handleFormSubmit = (data: InitialPaymentFormData) => {
    onSubmit(data)
  }

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Registrar Pago Inicial
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        El pago se registrará como <strong>PENDIENTE</strong> hasta que sea confirmado
        manualmente.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Monto"
                  type="number"
                  required
                  error={!!errors.amount}
                  helperText={errors.amount?.message}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">€</InputAdornment>,
                  }}
                  inputProps={{
                    min: 1,
                    step: 0.01,
                  }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="payment_method"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth required error={!!errors.payment_method}>
                  <InputLabel>Método de Pago</InputLabel>
                  <Select {...field} label="Método de Pago">
                    {Object.entries(PAYMENT_METHODS).map(([key, label]) => (
                      <MenuItem key={key} value={label}>
                        {label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={field.value || ''}
                  fullWidth
                  multiline
                  rows={3}
                  label="Notas (opcional)"
                  placeholder="Ej: Pago realizado en efectivo, recibido por..."
                />
              )}
            />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
          <Button variant="outlined" onClick={onCancel} disabled={loading}>
            Registrar Más Tarde
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrar Pago'}
          </Button>
        </Box>
      </Box>
    </Paper>
  )
}
