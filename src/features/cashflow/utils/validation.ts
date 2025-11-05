import * as yup from 'yup'
import { OperationType } from '../types'

// Schema para crear transacción
export const createCashFlowSchema = yup.object().shape({
  date: yup
    .date()
    .required('La fecha es obligatoria')
    .max(new Date(), 'La fecha no puede ser futura'),

  operationType: yup
    .string()
    .oneOf(Object.values(OperationType), 'Tipo de operación inválido')
    .required('El tipo de operación es obligatorio'),

  amount: yup
    .number()
    .required('El importe es obligatorio')
    .test('valid-amount', 'El importe debe ser mayor que 0', function (value) {
      return value !== undefined && value !== 0
    }),

  detail: yup
    .string()
    .required('El concepto es obligatorio')
    .min(3, 'El concepto debe tener al menos 3 caracteres')
    .max(255, 'El concepto no puede exceder 255 caracteres'),

  memberId: yup
    .string()
    .nullable()
    .test('required-for-repatriation', 'Debes seleccionar un socio para repatriaciones', function (value) {
      const { operationType } = this.parent
      if (operationType === OperationType.GASTO_REPATRIACION) {
        return !!value
      }
      return true
    }),
})

// Schema específico para repatriación
export const repatriationSchema = yup.object().shape({
  date: yup
    .date()
    .required('La fecha es obligatoria')
    .max(new Date(), 'La fecha no puede ser futura'),

  memberId: yup
    .string()
    .required('Debes seleccionar un socio'),

  amount: yup
    .number()
    .required('El importe es obligatorio')
    .negative('El importe debe ser negativo para gastos')
    .max(-100, 'El importe mínimo es 100€'),

  detail: yup
    .string()
    .required('El concepto es obligatorio'),
})
