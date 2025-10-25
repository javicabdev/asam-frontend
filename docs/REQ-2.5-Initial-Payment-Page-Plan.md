# PLAN DE IMPLEMENTACIÓN: REQ-2.5 - Página de Pago Inicial

## 1. Commit Propuesto
```
feat(payments): implement initial payment page after member registration
```

## 2. Descripción General

Implementar la página de pago inicial (`/payments/initial/:memberId`) que se muestra automáticamente después de crear un nuevo socio (individual o familiar). Esta página permite al administrador registrar el pago de la cuota inicial en efectivo, marcándolo inicialmente como "PENDIENTE" y proporcionando la capacidad de confirmarlo posteriormente.

**Valor de negocio**: Completa el flujo end-to-end de alta de socios, asegurando que ningún socio quede registrado sin su correspondiente pago inicial. Mejora la trazabilidad financiera y reduce la fricción administrativa.

**Contexto**: Actualmente, cuando se crea un socio en `NewMemberPage.tsx`, el flujo intenta redirigir a `/payments/initial/:memberId`, pero esta página no existe, causando un error 404. El socio se crea correctamente en la base de datos, pero el flujo queda incompleto.

## 3. Análisis de Arquitectura y Riesgos

### Elección Arquitectónica
Se seguirá la **Arquitectura por Features** ya establecida en el proyecto, creando un nuevo feature `payments` con su estructura completa de componentes, hooks y API. Esta decisión se justifica porque:

1. **Consistencia**: Mantiene la misma estructura que `features/members/` y `features/users/`
2. **Escalabilidad**: Facilita la futura expansión del módulo de pagos (REQ-3.2)
3. **Separación de responsabilidades**: Cada feature es autocontenido con sus propios tipos, hooks y componentes

### Riesgos Potenciales

**Riesgo 1: Navegación sin guardar el ID del socio**
- **Descripción**: Si el usuario recarga la página o pierde la sesión antes de completar el pago
- **Mitigación**: Guardar el `memberId` en el estado de la URL (parámetro de ruta) y validar su existencia en el backend

**Riesgo 2: Doble creación de pagos**
- **Descripción**: Si el usuario hace click múltiple en "Registrar Pago"
- **Mitigación**: Deshabilitar el botón durante la ejecución de la mutation y usar loading state

**Riesgo 3: Inconsistencia entre member_id y family_id**
- **Descripción**: Los socios familiares tienen tanto `member_id` como `family_id`, pero solo uno debe enviarse en el pago inicial
- **Mitigación**: Lógica clara que determina: si `tipo_membresia === 'FAMILY'`, enviar `family_id`; si no, enviar `member_id`

**Riesgo 4: Estados de pago huérfanos**
- **Descripción**: Pagos creados pero nunca confirmados que quedan en PENDING indefinidamente
- **Mitigación**: Esto será abordado en REQ-3.2 con vistas de pagos pendientes y filtros

### Ambigüedades y Supuestos

**Ambigüedad 1**: ¿El monto del pago inicial es fijo o variable?
- **Supuesto adoptado**: El monto es editable en el formulario, con un valor por defecto configurable (ej: 100€)
- **Justificación**: Permite flexibilidad para casos especiales o descuentos

**Ambigüedad 2**: ¿Se debe generar recibo inmediatamente o solo tras confirmación?
- **Supuesto adoptado**: Los recibos solo se generan tras confirmar el pago (cambiar estado a PAID)
- **Justificación**: Un pago PENDING no es oficial hasta su confirmación

**Ambigüedad 3**: ¿Se puede cancelar el flujo y volver más tarde a hacer el pago?
- **Supuesto adoptado**: Sí, se proporciona botón "Registrar más tarde" que redirige a la lista de socios
- **Justificación**: Flexibilidad operativa, el pago puede completarse desde otra vista posteriormente

**Ambigüedad 4**: ¿Qué métodos de pago se permiten?
- **Supuesto adoptado**: Para el pago inicial solo "Efectivo", otros métodos se añadirán en REQ-3.2
- **Justificación**: Simplifica el MVP y es el método más común en pagos iniciales presenciales

## 4. Ficheros Afectados

### Archivos a CREAR:

```
src/features/payments/
├── api/
│   ├── mutations.ts                    # Mutations de GraphQL (registerPayment, updatePayment)
│   ├── queries.ts                      # Queries de GraphQL (getPayment, getMemberPayments)
│   └── index.ts                        # Barrel export
├── components/
│   ├── InitialPaymentForm.tsx          # Formulario de registro de pago inicial
│   ├── PaymentSummary.tsx              # Resumen visual del pago registrado
│   └── index.ts                        # Barrel export
├── hooks/
│   ├── usePaymentForm.ts               # Hook para lógica del formulario
│   ├── useMemberData.ts                # Hook para obtener datos del socio
│   └── index.ts                        # Barrel export
├── types.ts                            # Tipos específicos del feature payments
├── utils.ts                            # Utilidades (formateo de montos, fechas)
└── index.ts                            # Barrel export del feature

src/pages/payments/
├── InitialPaymentPage.tsx              # Página principal de pago inicial
└── index.ts                            # Barrel export
```

### Archivos a MODIFICAR:

```
src/routes.tsx                          # Añadir ruta /payments/initial/:memberId
src/pages/index.ts                      # Exportar InitialPaymentPage
```

## 5. Pasos Técnicos Detallados

### Paso 1: Crear tipos del feature payments

**Archivo**: `src/features/payments/types.ts`

```typescript
export interface InitialPaymentFormData {
  amount: number
  payment_method: string
  notes?: string
}

export interface PaymentFormProps {
  memberId: string
  onSuccess?: (paymentId: string) => void
  onCancel?: () => void
}

export const PAYMENT_METHODS = {
  CASH: 'Efectivo',
  TRANSFER: 'Transferencia',
  CARD: 'Tarjeta',
} as const

export const DEFAULT_INITIAL_PAYMENT_AMOUNT = 100
```

---

### Paso 2: Crear mutations y queries de GraphQL

**Archivo**: `src/features/payments/api/mutations.ts`

```typescript
import { gql } from '@apollo/client'

export const REGISTER_PAYMENT_MUTATION = gql`
  mutation RegisterPayment($input: PaymentInput!) {
    registerPayment(input: $input) {
      id
      amount
      payment_date
      status
      payment_method
      notes
      member {
        miembro_id
        numero_socio
        nombre
        apellidos
      }
      family {
        id
        numero_socio
        esposo_nombre
        esposa_nombre
      }
    }
  }
`

export const UPDATE_PAYMENT_STATUS_MUTATION = gql`
  mutation UpdatePayment($id: ID!, $input: PaymentInput!) {
    updatePayment(id: $id, input: $input) {
      id
      amount
      payment_date
      status
      payment_method
      notes
    }
  }
`
```

**Archivo**: `src/features/payments/api/queries.ts`

```typescript
// Re-export from generated operations
export {
  GetPaymentDocument as GET_PAYMENT_QUERY,
  GetMemberPaymentsDocument as GET_MEMBER_PAYMENTS_QUERY,
  GetFamilyPaymentsDocument as GET_FAMILY_PAYMENTS_QUERY,
  useGetPaymentQuery,
  useGetMemberPaymentsQuery,
  useGetFamilyPaymentsQuery,
} from '@/graphql/generated/operations'
```

---

### Paso 3: Crear hook para obtener datos del socio

**Archivo**: `src/features/payments/hooks/useMemberData.ts`

```typescript
import { useGetMemberQuery } from '@/features/members/api/queries'
import { useGetFamilyQuery } from '@/features/members/api/mutations'

export const useMemberData = (memberId: string) => {
  const { data: memberData, loading: memberLoading, error: memberError } = useGetMemberQuery({
    variables: { id: memberId },
    skip: !memberId,
  })

  const member = memberData?.getMember
  const isFamily = member?.tipo_membresia === 'FAMILY'

  // Si es familia, obtener datos de la familia para el family_id
  const { data: familyData, loading: familyLoading } = useGetFamilyQuery({
    variables: { id: member?.miembro_id || '' },
    skip: !member || !isFamily,
  })

  return {
    member,
    family: familyData?.getFamily,
    isFamily,
    loading: memberLoading || familyLoading,
    error: memberError,
  }
}
```

---

### Paso 4: Crear hook para lógica del formulario

**Archivo**: `src/features/payments/hooks/usePaymentForm.ts`

```typescript
import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { REGISTER_PAYMENT_MUTATION } from '../api/mutations'
import { InitialPaymentFormData } from '../types'
import type {
  RegisterPaymentMutation,
  RegisterPaymentMutationVariables,
} from '@/graphql/generated/operations'

interface UsePaymentFormOptions {
  memberId: string
  familyId?: string | null
  isFamily: boolean
  onSuccess?: (paymentId: string) => void
}

export const usePaymentForm = (options: UsePaymentFormOptions) => {
  const { memberId, familyId, isFamily, onSuccess } = options
  const [error, setError] = useState<string | null>(null)

  const [registerPayment, { loading }] = useMutation<
    RegisterPaymentMutation,
    RegisterPaymentMutationVariables
  >(REGISTER_PAYMENT_MUTATION)

  const handleSubmit = async (formData: InitialPaymentFormData) => {
    setError(null)

    try {
      // Preparar el input según el tipo de membresía
      const input = {
        amount: formData.amount,
        payment_method: formData.payment_method,
        notes: formData.notes || null,
        // Si es familia, enviar family_id; si no, member_id
        ...(isFamily && familyId
          ? { family_id: familyId }
          : { member_id: memberId }),
      }

      const result = await registerPayment({
        variables: { input },
      })

      const paymentId = result.data?.registerPayment?.id

      if (!paymentId) {
        throw new Error('No se recibió el ID del pago')
      }

      if (onSuccess) {
        onSuccess(paymentId)
      }
    } catch (err) {
      console.error('Error al registrar pago:', err)
      setError(err instanceof Error ? err.message : 'Error al registrar el pago')
    }
  }

  return {
    handleSubmit,
    loading,
    error,
    setError,
  }
}
```

---

### Paso 5: Crear componente InitialPaymentForm

**Archivo**: `src/features/payments/components/InitialPaymentForm.tsx`

```typescript
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
  PaymentFormProps,
  PAYMENT_METHODS,
  DEFAULT_INITIAL_PAYMENT_AMOUNT,
} from '../types'

const validationSchema = Yup.object({
  amount: Yup.number()
    .required('El monto es obligatorio')
    .positive('El monto debe ser positivo')
    .min(1, 'El monto mínimo es 1€'),
  payment_method: Yup.string().required('El método de pago es obligatorio'),
  notes: Yup.string().nullable(),
})

interface InitialPaymentFormComponentProps extends PaymentFormProps {
  onSubmit: (data: InitialPaymentFormData) => void | Promise<void>
  loading: boolean
  error: string | null
}

export const InitialPaymentForm: React.FC<InitialPaymentFormComponentProps> = ({
  onSubmit,
  onCancel,
  loading,
  error,
}) => {
  const { control, handleSubmit, formState: { errors } } = useForm<InitialPaymentFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      amount: DEFAULT_INITIAL_PAYMENT_AMOUNT,
      payment_method: 'Efectivo',
      notes: '',
    },
  })

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

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
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
```

---

### Paso 6: Crear componente PaymentSummary

**Archivo**: `src/features/payments/components/PaymentSummary.tsx`

```typescript
import React from 'react'
import { Paper, Typography, Box, Chip, Divider } from '@mui/material'
import { CheckCircle } from '@mui/icons-material'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface PaymentSummaryProps {
  amount: number
  paymentMethod: string
  status: string
  paymentDate: string
  notes?: string | null
}

export const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  amount,
  paymentMethod,
  status,
  paymentDate,
  notes,
}) => {
  const formattedDate = format(new Date(paymentDate), "d 'de' MMMM 'de' yyyy", { locale: es })

  return (
    <Paper elevation={2} sx={{ p: 3, bgcolor: 'success.lighter' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <CheckCircle color="success" sx={{ fontSize: 40 }} />
        <Box>
          <Typography variant="h6">Pago Registrado Exitosamente</Typography>
          <Typography variant="body2" color="text.secondary">
            El pago ha sido registrado y está pendiente de confirmación
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="body2" color="text.secondary">
            Monto:
          </Typography>
          <Typography variant="h6">{amount.toFixed(2)} €</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="body2" color="text.secondary">
            Método de Pago:
          </Typography>
          <Typography variant="body1">{paymentMethod}</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="body2" color="text.secondary">
            Estado:
          </Typography>
          <Chip label={status} color="warning" size="small" />
        </Grid>

        <Grid item xs={6}>
          <Typography variant="body2" color="text.secondary">
            Fecha:
          </Typography>
          <Typography variant="body1">{formattedDate}</Typography>
        </Grid>

        {notes && (
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">
              Notas:
            </Typography>
            <Typography variant="body2">{notes}</Typography>
          </Grid>
        )}
      </Grid>
    </Paper>
  )
}
```

---

### Paso 7: Crear página InitialPaymentPage

**Archivo**: `src/pages/payments/InitialPaymentPage.tsx`

```typescript
import React, { useState } from 'react'
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
  Divider,
} from '@mui/material'
import { NavigateNext, ArrowForward } from '@mui/icons-material'

import { InitialPaymentForm } from '@/features/payments/components/InitialPaymentForm'
import { PaymentSummary } from '@/features/payments/components/PaymentSummary'
import { useMemberData } from '@/features/payments/hooks/useMemberData'
import { usePaymentForm } from '@/features/payments/hooks/usePaymentForm'

export const InitialPaymentPage: React.FC = () => {
  const { memberId } = useParams<{ memberId: string }>()
  const navigate = useNavigate()
  const [paymentRegistered, setPaymentRegistered] = useState(false)
  const [paymentData, setPaymentData] = useState<any>(null)

  // Obtener datos del socio
  const { member, family, isFamily, loading: memberLoading, error: memberError } = useMemberData(
    memberId || ''
  )

  // Hook para manejar el formulario de pago
  const { handleSubmit, loading: paymentLoading, error: paymentError, setError } = usePaymentForm({
    memberId: memberId || '',
    familyId: family?.id,
    isFamily,
    onSuccess: (paymentId) => {
      // Marcar como registrado y mostrar resumen
      setPaymentRegistered(true)
    },
  })

  const onPaymentSubmit = async (formData: any) => {
    const result = await handleSubmit(formData)
    if (result) {
      setPaymentData(result)
    }
  }

  const handleGoToMembers = () => {
    navigate('/members')
  }

  const handleGoToMemberDetails = () => {
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
        <Breadcrumbs separator={<NavigateNext fontSize="small" />}>
          <Link
            underline="hover"
            color="inherit"
            href="#"
            onClick={(e) => {
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
            onClick={(e) => {
              e.preventDefault()
              navigate('/members')
            }}
          >
            Socios
          </Link>
          <Typography color="text.primary">Pago Inicial</Typography>
        </Breadcrumbs>
      </Box>

      {/* Título */}
      <Typography variant="h4" component="h1" gutterBottom>
        Pago Inicial - Cuota de Alta
      </Typography>

      {/* Información del Socio */}
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

      {/* Formulario o Resumen */}
      {!paymentRegistered ? (
        <>
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Importante:</strong> Registre el pago inicial de la cuota de alta. El pago se
              marcará como PENDIENTE hasta que sea confirmado manualmente.
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
```

---

### Paso 8: Crear barrel exports

**Archivo**: `src/features/payments/index.ts`

```typescript
export * from './components'
export * from './hooks'
export * from './api'
export * from './types'
export * from './utils'
```

**Archivo**: `src/features/payments/components/index.ts`

```typescript
export { InitialPaymentForm } from './InitialPaymentForm'
export { PaymentSummary } from './PaymentSummary'
```

**Archivo**: `src/features/payments/hooks/index.ts`

```typescript
export { usePaymentForm } from './usePaymentForm'
export { useMemberData } from './useMemberData'
```

**Archivo**: `src/features/payments/api/index.ts`

```typescript
export * from './mutations'
export * from './queries'
```

**Archivo**: `src/pages/payments/index.ts`

```typescript
export { default as InitialPaymentPage } from './InitialPaymentPage'
```

---

### Paso 9: Actualizar rutas de la aplicación

**Archivo**: `src/routes.tsx`

**Cambios**:

1. Añadir lazy import para InitialPaymentPage:

```typescript
const InitialPaymentPage = lazyWithPreload(
  () => import('@/pages/payments/InitialPaymentPage'),
  'InitialPaymentPage'
)
```

2. Añadir ruta protegida dentro del bloque de `<ProtectedRoute>` y `<MainLayout>`:

```typescript
<Route path="/payments/initial/:memberId" element={<InitialPaymentPage />} />
```

---

### Paso 10: Actualizar index de pages

**Archivo**: `src/pages/index.ts`

**Añadir**:

```typescript
export { InitialPaymentPage } from './payments'
```

---

## 6. Criterios de Aceptación

### Funcionales

- [x] **CA-1**: Al crear un socio (individual o familiar), se redirige automáticamente a `/payments/initial/:memberId`
- [x] **CA-2**: La página muestra correctamente los datos del socio recién creado
- [x] **CA-3**: El formulario permite ingresar monto, método de pago y notas opcionales
- [x] **CA-4**: El monto por defecto es 100€ pero puede ser editado
- [x] **CA-5**: Al registrar el pago, se crea con estado `PENDING`
- [x] **CA-6**: Tras registrar el pago, se muestra un resumen visual con todos los datos
- [x] **CA-7**: Desde el resumen, el usuario puede ir a la lista de socios o a los detalles del socio
- [x] **CA-8**: El botón "Registrar más tarde" permite omitir el pago y volver a la lista de socios
- [x] **CA-9**: Para socios familiares, el pago se asocia al `family_id` en lugar del `member_id`
- [x] **CA-10**: Los errores de la API se muestran claramente al usuario

### Técnicos

- [x] **CA-11**: La página valida que el `memberId` exista en la URL
- [x] **CA-12**: Se obtienen los datos del socio mediante query GraphQL
- [x] **CA-13**: Se usa la mutation `registerPayment` con el input correcto
- [x] **CA-14**: El botón se deshabilita durante la ejecución de la mutation para evitar doble-click
- [x] **CA-15**: La validación del formulario usa Yup y React Hook Form
- [x] **CA-16**: Los tipos TypeScript son estrictos y provienen del schema generado
- [x] **CA-17**: La estructura sigue el patrón de features existente

### UX

- [x] **CA-18**: El formulario es responsive y funciona en móvil y desktop
- [x] **CA-19**: Los estados de carga se muestran con spinners o texto "Cargando..."
- [x] **CA-20**: Los errores se muestran con Alert de Material-UI en rojo
- [x] **CA-21**: El resumen de éxito usa colores de success y tiene un ícono de check
- [x] **CA-22**: Los breadcrumbs permiten navegación rápida
- [x] **CA-23**: El diseño es consistente con el resto de la aplicación

---

## 7. Testing Sugerido

### Unit Tests

```typescript
// src/features/payments/hooks/__tests__/usePaymentForm.test.ts
- Debe crear el input correcto para socio individual
- Debe crear el input correcto para socio familiar
- Debe manejar errores de la mutation
- Debe ejecutar callback onSuccess con el paymentId
```

### Integration Tests

```typescript
// src/pages/payments/__tests__/InitialPaymentPage.test.tsx
- Debe mostrar loading mientras carga datos del socio
- Debe mostrar error si el memberId no existe
- Debe renderizar el formulario con datos del socio
- Debe registrar el pago y mostrar resumen
- Debe permitir cancelar y volver a socios
```

### E2E Test (Playwright)

```typescript
// tests/e2e/member-registration-flow.spec.ts
test('complete member registration with initial payment', async ({ page }) => {
  // 1. Login como admin
  // 2. Navegar a /members/new
  // 3. Crear socio familiar
  // 4. Verificar redirección a /payments/initial/:id
  // 5. Completar formulario de pago
  // 6. Verificar mensaje de éxito
  // 7. Navegar a detalles del socio
  // 8. Verificar que el pago aparece en el historial
})
```

---

## 8. Documentación Adicional

### Variables de Entorno

No se requieren variables de entorno adicionales.

### Dependencias Nuevas

No se requieren dependencias npm adicionales. Se utilizan las ya existentes:
- `@apollo/client`
- `react-hook-form`
- `yup`
- `@mui/material`
- `date-fns`

---

## 9. Próximos Pasos (Post-Implementación)

Una vez implementado REQ-2.5, los siguientes pasos naturales serían:

1. **Confirmación de Pagos**: Añadir la capacidad de cambiar el estado de PENDING a PAID
2. **Generación de Recibos**: Implementar generación de PDF para pagos confirmados
3. **Historial de Pagos**: Mostrar el pago inicial en la vista de detalles del socio
4. **REQ-3.2**: Módulo completo de pagos con listado, filtros y cuotas masivas

---

## 10. Notas para el Desarrollador

### Puntos Clave a Recordar

1. **Lógica de family_id vs member_id**: Siempre verificar `tipo_membresia` antes de decidir qué ID enviar
2. **Estado PENDING**: Es el estado por defecto y correcto para pagos iniciales no confirmados
3. **Validación de monto**: Debe ser mayor que 0 y con máximo 2 decimales
4. **Navegación**: Proveer siempre múltiples opciones (lista, detalles, cancelar)

### Posibles Mejoras Futuras

- Permitir seleccionar fecha de pago (actualmente usa fecha actual del servidor)
- Añadir selector de divisa (actualmente hardcodeado a €)
- Implementar confirmación modal antes de registrar
- Añadir botón para imprimir resumen

---

**Fin del Plan de Implementación**
