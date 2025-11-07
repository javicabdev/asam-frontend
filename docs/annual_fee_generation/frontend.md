# Frontend Implementation - Annual Fee Generation

## 📋 Tabla de Contenidos

1. [Arquitectura de Features](#arquitectura-de-features)
2. [GraphQL Operations](#graphql-operations)
3. [Tipos TypeScript](#tipos-typescript)
4. [Hooks Personalizados](#hooks-personalizados)
5. [Componentes UI](#componentes-ui)
6. [Páginas](#páginas)
7. [Internacionalización](#internacionalización)
8. [Tests](#tests)

---

## 🏗️ Arquitectura de Features

### Estructura de Archivos

```
src/
├── features/
│   └── fees/                           # ✨ NUEVA FEATURE
│       ├── api/
│       │   ├── index.ts
│       │   ├── mutations.ts           # GraphQL mutations
│       │   ├── queries.ts             # GraphQL queries
│       │   └── types.ts               # TypeScript types
│       ├── components/
│       │   ├── AnnualFeeCard.tsx      # Tarjeta resumen de cuota
│       │   ├── FeeGenerationDialog.tsx # Diálogo principal
│       │   ├── FeeGenerationForm.tsx   # Formulario de generación
│       │   ├── FeeGenerationPreview.tsx # Vista previa antes de confirmar
│       │   ├── FeeGenerationResult.tsx  # Resultado de generación
│       │   ├── FeeListTable.tsx        # Tabla de cuotas existentes
│       │   ├── PendingFeesChip.tsx     # Chip de cuotas pendientes
│       │   └── index.ts
│       ├── hooks/
│       │   ├── index.ts
│       │   ├── useFeeGeneration.ts    # Lógica principal
│       │   ├── useFeesList.ts         # Listar cuotas
│       │   ├── useFeeValidation.ts    # Validaciones
│       │   └── usePendingFees.ts      # Cuotas pendientes
│       ├── utils/
│       │   ├── feeCalculations.ts     # Cálculos de montos
│       │   ├── feeFormatters.ts       # Formateo de datos
│       │   └── feeValidation.ts       # Validaciones auxiliares
│       ├── index.ts
│       └── types.ts                   # Tipos compartidos
│
├── pages/
│   └── fees/
│       ├── AnnualFeesPage.tsx        # ✨ NUEVA PÁGINA
│       └── index.ts
│
├── graphql/
│   └── operations/
│       └── fees.graphql              # ✨ NUEVO
│
└── lib/
    └── i18n/
        └── locales/
            ├── es/
            │   └── fees.json          # ✨ NUEVO
            ├── fr/
            │   └── fees.json          # ✨ NUEVO
            └── wo/
                └── fees.json          # ✨ NUEVO
```

---

## 📡 GraphQL Operations

### 1. Crear `src/graphql/operations/fees.graphql`

```graphql
# ============================================
# QUERIES
# ============================================

query GetMembershipFee($year: Int!) {
  getMembershipFee(year: $year) {
    id
    year
    baseFeeAmount
    familyFeeExtra
    dueDate
  }
}

query ListMembershipFees($page: Int, $pageSize: Int) {
  listMembershipFees(page: $page, pageSize: $pageSize) {
    nodes {
      id
      year
      baseFeeAmount
      familyFeeExtra
      dueDate
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      totalCount
    }
  }
}

query CheckFeeExists($year: Int!) {
  checkFeeExists(year: $year)
}

query GetPendingFeesForMember($memberId: ID!) {
  getPendingFeesForMember(memberId: $memberId) {
    id
    year
    baseFeeAmount
    familyFeeExtra
    dueDate
  }
}

# ============================================
# MUTATIONS
# ============================================

mutation GenerateAnnualFees($input: GenerateAnnualFeesInput!) {
  generateAnnualFees(input: $input) {
    membershipFee {
      id
      year
      baseFeeAmount
      familyFeeExtra
      dueDate
    }
    totalMembers
    individualMembers
    familyMembers
    paymentsCreated
    totalExpectedAmount
    alreadyExisted
  }
}

mutation UpdateMembershipFee(
  $id: ID!
  $baseFeeAmount: Float
  $familyFeeExtra: Float
) {
  updateMembershipFee(
    id: $id
    baseFeeAmount: $baseFeeAmount
    familyFeeExtra: $familyFeeExtra
  ) {
    id
    year
    baseFeeAmount
    familyFeeExtra
    dueDate
  }
}

mutation DeleteMembershipFee($id: ID!) {
  deleteMembershipFee(id: $id) {
    success
    message
    error
  }
}
```

### 2. Generar tipos TypeScript

Después de crear el archivo GraphQL, regenerar tipos:

```bash
npm run codegen
```

---

## 📘 Tipos TypeScript

### `src/features/fees/types.ts`

```typescript
import { MembershipFee, FeeGenerationResult } from '@/graphql/generated/operations';

export interface FeeGenerationFormData {
  year: number;
  baseFeeAmount: number;
  familyFeeExtra: number;
}

export interface FeeGenerationState {
  step: 'form' | 'preview' | 'generating' | 'result' | 'error';
  formData: FeeGenerationFormData | null;
  preview: FeeGenerationPreview | null;
  result: FeeGenerationResult | null;
  error: string | null;
}

export interface FeeGenerationPreview {
  year: number;
  baseFeeAmount: number;
  familyFeeExtra: number;
  estimatedTotalMembers: number;
  estimatedIndividualMembers: number;
  estimatedFamilyMembers: number;
  estimatedTotalAmount: number;
  feeExists: boolean;
}

export interface FeeListFilters {
  page: number;
  pageSize: number;
}

export interface PendingFeesSummary {
  totalPending: number;
  oldestYear: number | null;
  totalAmount: number;
  fees: MembershipFee[];
}
```

---

## 🎣 Hooks Personalizados

### 1. `src/features/fees/hooks/useFeeGeneration.ts`

```typescript
import { useState, useCallback } from 'react';
import { useMutation, useQuery, useApolloClient } from '@apollo/client';
import { useNotification } from '@/hooks';
import { 
  GenerateAnnualFeesMutation,
  GenerateAnnualFeesMutationVariables,
  CheckFeeExistsQuery,
  CheckFeeExistsQueryVariables 
} from '@/graphql/generated/operations';
import { 
  GENERATE_ANNUAL_FEES,
  CHECK_FEE_EXISTS 
} from '../api/mutations';
import { FeeGenerationState, FeeGenerationFormData } from '../types';

export const useFeeGeneration = () => {
  const client = useApolloClient();
  const { showSuccess, showError } = useNotification();
  
  const [state, setState] = useState<FeeGenerationState>({
    step: 'form',
    formData: null,
    preview: null,
    result: null,
    error: null,
  });

  // Mutation para generar cuotas
  const [generateFees, { loading: generating }] = useMutation<
    GenerateAnnualFeesMutation,
    GenerateAnnualFeesMutationVariables
  >(GENERATE_ANNUAL_FEES, {
    onCompleted: (data) => {
      setState((prev) => ({
        ...prev,
        step: 'result',
        result: data.generateAnnualFees,
        error: null,
      }));
      
      showSuccess(
        data.generateAnnualFees.alreadyExisted
          ? 'Cuotas actualizadas correctamente'
          : `Se crearon ${data.generateAnnualFees.paymentsCreated} pagos pendientes`
      );
    },
    onError: (error) => {
      setState((prev) => ({
        ...prev,
        step: 'error',
        error: error.message,
      }));
      showError(`Error al generar cuotas: ${error.message}`);
    },
    refetchQueries: ['ListMembershipFees'],
  });

  // Validar y mostrar preview
  const validateAndPreview = useCallback(
    async (formData: FeeGenerationFormData) => {
      try {
        setState((prev) => ({ ...prev, step: 'preview' }));

        // Verificar si ya existe la cuota
        const { data } = await client.query<
          CheckFeeExistsQuery,
          CheckFeeExistsQueryVariables
        >({
          query: CHECK_FEE_EXISTS,
          variables: { year: formData.year },
          fetchPolicy: 'network-only',
        });

        const feeExists = data?.checkFeeExists ?? false;

        // TODO: Obtener conteo estimado de miembros activos
        // Por ahora usamos valores mockeados
        const preview = {
          ...formData,
          estimatedTotalMembers: 150, // Mock
          estimatedIndividualMembers: 100, // Mock
          estimatedFamilyMembers: 50, // Mock
          estimatedTotalAmount: 
            (100 * formData.baseFeeAmount) + 
            (50 * (formData.baseFeeAmount + formData.familyFeeExtra)),
          feeExists,
        };

        setState((prev) => ({
          ...prev,
          formData,
          preview,
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          step: 'error',
          error: error instanceof Error ? error.message : 'Error desconocido',
        }));
        showError('Error al validar los datos');
      }
    },
    [client, showError]
  );

  // Confirmar generación
  const confirmGeneration = useCallback(async () => {
    if (!state.formData) {
      showError('No hay datos para generar');
      return;
    }

    setState((prev) => ({ ...prev, step: 'generating' }));

    await generateFees({
      variables: {
        input: state.formData,
      },
    });
  }, [state.formData, generateFees, showError]);

  // Reiniciar flujo
  const reset = useCallback(() => {
    setState({
      step: 'form',
      formData: null,
      preview: null,
      result: null,
      error: null,
    });
  }, []);

  // Ir atrás en el flujo
  const goBack = useCallback(() => {
    setState((prev) => ({
      ...prev,
      step: prev.step === 'preview' ? 'form' : 'form',
      error: null,
    }));
  }, []);

  return {
    state,
    generating,
    validateAndPreview,
    confirmGeneration,
    reset,
    goBack,
  };
};
```

### 2. `src/features/fees/hooks/useFeesList.ts`

```typescript
import { useState } from 'react';
import { useQuery } from '@apollo/client';
import {
  ListMembershipFeesQuery,
  ListMembershipFeesQueryVariables,
} from '@/graphql/generated/operations';
import { LIST_MEMBERSHIP_FEES } from '../api/queries';
import { FeeListFilters } from '../types';

export const useFeesList = () => {
  const [filters, setFilters] = useState<FeeListFilters>({
    page: 1,
    pageSize: 10,
  });

  const { data, loading, error, refetch } = useQuery<
    ListMembershipFeesQuery,
    ListMembershipFeesQueryVariables
  >(LIST_MEMBERSHIP_FEES, {
    variables: filters,
    fetchPolicy: 'cache-and-network',
  });

  const fees = data?.listMembershipFees?.nodes ?? [];
  const pageInfo = data?.listMembershipFees?.pageInfo;

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setFilters((prev) => ({ ...prev, page: 1, pageSize: newPageSize }));
  };

  return {
    fees,
    pageInfo,
    filters,
    loading,
    error,
    refetch,
    handlePageChange,
    handlePageSizeChange,
  };
};
```

### 3. `src/features/fees/hooks/usePendingFees.ts`

```typescript
import { useQuery } from '@apollo/client';
import {
  GetPendingFeesForMemberQuery,
  GetPendingFeesForMemberQueryVariables,
} from '@/graphql/generated/operations';
import { GET_PENDING_FEES_FOR_MEMBER } from '../api/queries';
import { PendingFeesSummary } from '../types';

export const usePendingFees = (memberId: string | null) => {
  const { data, loading, error } = useQuery<
    GetPendingFeesForMemberQuery,
    GetPendingFeesForMemberQueryVariables
  >(GET_PENDING_FEES_FOR_MEMBER, {
    variables: { memberId: memberId! },
    skip: !memberId,
    fetchPolicy: 'cache-and-network',
  });

  const fees = data?.getPendingFeesForMember ?? [];

  const summary: PendingFeesSummary = {
    totalPending: fees.length,
    oldestYear: fees.length > 0 
      ? Math.min(...fees.map(f => f.year)) 
      : null,
    totalAmount: fees.reduce((sum, fee) => sum + fee.baseFeeAmount, 0),
    fees,
  };

  return {
    fees,
    summary,
    loading,
    error,
  };
};
```

### 4. `src/features/fees/hooks/useFeeValidation.ts`

```typescript
import { useCallback } from 'react';
import { FeeGenerationFormData } from '../types';

interface ValidationErrors {
  year?: string;
  baseFeeAmount?: string;
  familyFeeExtra?: string;
}

export const useFeeValidation = () => {
  const validateForm = useCallback((data: FeeGenerationFormData): ValidationErrors => {
    const errors: ValidationErrors = {};
    const currentYear = new Date().getFullYear();

    // Validar año
    if (!data.year) {
      errors.year = 'El año es requerido';
    } else if (data.year > currentYear) {
      errors.year = `El año no puede ser mayor a ${currentYear}`;
    } else if (data.year < 2000) {
      errors.year = 'El año debe ser mayor o igual a 2000';
    }

    // Validar monto base
    if (!data.baseFeeAmount) {
      errors.baseFeeAmount = 'El monto base es requerido';
    } else if (data.baseFeeAmount <= 0) {
      errors.baseFeeAmount = 'El monto debe ser mayor a 0';
    } else if (data.baseFeeAmount > 10000) {
      errors.baseFeeAmount = 'El monto parece demasiado alto';
    }

    // Validar extra familiar
    if (data.familyFeeExtra < 0) {
      errors.familyFeeExtra = 'El monto no puede ser negativo';
    } else if (data.familyFeeExtra > 5000) {
      errors.familyFeeExtra = 'El monto parece demasiado alto';
    }

    return errors;
  }, []);

  const isValid = useCallback((data: FeeGenerationFormData): boolean => {
    const errors = validateForm(data);
    return Object.keys(errors).length === 0;
  }, [validateForm]);

  return {
    validateForm,
    isValid,
  };
};
```

---

## 🎨 Componentes UI

### 1. `src/features/fees/components/FeeGenerationDialog.tsx`

Componente principal que orquesta todo el flujo:

```typescript
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import { useFeeGeneration } from '../hooks/useFeeGeneration';
import { FeeGenerationForm } from './FeeGenerationForm';
import { FeeGenerationPreview } from './FeeGenerationPreview';
import { FeeGenerationResult } from './FeeGenerationResult';

interface FeeGenerationDialogProps {
  open: boolean;
  onClose: () => void;
}

const STEPS = ['Datos', 'Confirmar', 'Resultado'];

export const FeeGenerationDialog: React.FC<FeeGenerationDialogProps> = ({
  open,
  onClose,
}) => {
  const { t } = useTranslation('fees');
  const {
    state,
    generating,
    validateAndPreview,
    confirmGeneration,
    reset,
    goBack,
  } = useFeeGeneration();

  const handleClose = () => {
    reset();
    onClose();
  };

  const getActiveStep = () => {
    switch (state.step) {
      case 'form':
        return 0;
      case 'preview':
        return 1;
      case 'generating':
      case 'result':
      case 'error':
        return 2;
      default:
        return 0;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '500px' },
      }}
    >
      <DialogTitle>
        {t('generation.title')}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Stepper activeStep={getActiveStep()} sx={{ mb: 4 }}>
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {state.step === 'form' && (
          <FeeGenerationForm onSubmit={validateAndPreview} />
        )}

        {state.step === 'preview' && state.preview && (
          <FeeGenerationPreview
            preview={state.preview}
            onConfirm={confirmGeneration}
            onBack={goBack}
          />
        )}

        {(state.step === 'result' || state.step === 'error') && (
          <FeeGenerationResult
            result={state.result}
            error={state.error}
            onClose={handleClose}
          />
        )}

        {state.step === 'generating' && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            Generando cuotas...
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
```

### 2. `src/features/fees/components/FeeGenerationForm.tsx`

Formulario para capturar datos:

```typescript
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Alert,
  InputAdornment,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFeeValidation } from '../hooks/useFeeValidation';
import { FeeGenerationFormData } from '../types';

interface FeeGenerationFormProps {
  onSubmit: (data: FeeGenerationFormData) => void;
}

export const FeeGenerationForm: React.FC<FeeGenerationFormProps> = ({
  onSubmit,
}) => {
  const { t } = useTranslation('fees');
  const { validateForm, isValid } = useFeeValidation();
  const currentYear = new Date().getFullYear();

  const [formData, setFormData] = useState<FeeGenerationFormData>({
    year: currentYear,
    baseFeeAmount: 100,
    familyFeeExtra: 50,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof FeeGenerationFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(e.target.value) || 0;
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpiar error de este campo
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Alert severity="info" sx={{ mb: 3 }}>
        {t('generation.form.description')}
      </Alert>

      <TextField
        fullWidth
        label={t('generation.form.year')}
        type="number"
        value={formData.year}
        onChange={handleChange('year')}
        error={!!errors.year}
        helperText={errors.year || t('generation.form.yearHelp')}
        margin="normal"
        required
        InputProps={{
          inputProps: { min: 2000, max: currentYear },
        }}
      />

      <TextField
        fullWidth
        label={t('generation.form.baseFeeAmount')}
        type="number"
        value={formData.baseFeeAmount}
        onChange={handleChange('baseFeeAmount')}
        error={!!errors.baseFeeAmount}
        helperText={errors.baseFeeAmount || t('generation.form.baseFeeAmountHelp')}
        margin="normal"
        required
        InputProps={{
          startAdornment: <InputAdornment position="start">€</InputAdornment>,
          inputProps: { min: 0, step: 0.01 },
        }}
      />

      <TextField
        fullWidth
        label={t('generation.form.familyFeeExtra')}
        type="number"
        value={formData.familyFeeExtra}
        onChange={handleChange('familyFeeExtra')}
        error={!!errors.familyFeeExtra}
        helperText={errors.familyFeeExtra || t('generation.form.familyFeeExtraHelp')}
        margin="normal"
        InputProps={{
          startAdornment: <InputAdornment position="start">€</InputAdornment>,
          inputProps: { min: 0, step: 0.01 },
        }}
      />

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="submit"
          variant="contained"
          disabled={!isValid(formData)}
        >
          {t('generation.form.continue')}
        </Button>
      </Box>
    </Box>
  );
};
```

### 3. `src/features/fees/components/FeeGenerationPreview.tsx`

Vista previa antes de confirmar:

```typescript
import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  Divider,
  Grid,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FeeGenerationPreview as PreviewType } from '../types';
import { formatCurrency } from '@/utils/formatters';

interface FeeGenerationPreviewProps {
  preview: PreviewType;
  onConfirm: () => void;
  onBack: () => void;
}

export const FeeGenerationPreview: React.FC<FeeGenerationPreviewProps> = ({
  preview,
  onConfirm,
  onBack,
}) => {
  const { t } = useTranslation('fees');

  return (
    <Box sx={{ mt: 2 }}>
      {preview.feeExists && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {t('generation.preview.alreadyExistsWarning')}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {t('generation.preview.title', { year: preview.year })}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                {t('generation.preview.baseFeeAmount')}
              </Typography>
              <Typography variant="h6">
                {formatCurrency(preview.baseFeeAmount)}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                {t('generation.preview.familyFeeExtra')}
              </Typography>
              <Typography variant="h6">
                {formatCurrency(preview.familyFeeExtra)}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary">
                {t('generation.preview.individualMembers')}
              </Typography>
              <Typography variant="h6">
                {preview.estimatedIndividualMembers}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary">
                {t('generation.preview.familyMembers')}
              </Typography>
              <Typography variant="h6">
                {preview.estimatedFamilyMembers}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary">
                {t('generation.preview.totalMembers')}
              </Typography>
              <Typography variant="h6">
                {preview.estimatedTotalMembers}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                {t('generation.preview.totalExpected')}
              </Typography>
              <Typography variant="h5" color="primary">
                {formatCurrency(preview.estimatedTotalAmount)}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={onBack} variant="outlined">
          {t('common.back')}
        </Button>
        <Button onClick={onConfirm} variant="contained" color="primary">
          {t('generation.preview.confirm')}
        </Button>
      </Box>
    </Box>
  );
};
```

### 4. `src/features/fees/components/FeeListTable.tsx`

Tabla para mostrar cuotas existentes:

```typescript
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import { MembershipFee } from '@/graphql/generated/operations';
import { formatCurrency, formatDate } from '@/utils/formatters';

interface FeeListTableProps {
  fees: MembershipFee[];
  onEdit?: (fee: MembershipFee) => void;
  onDelete?: (fee: MembershipFee) => void;
}

export const FeeListTable: React.FC<FeeListTableProps> = ({
  fees,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation('fees');

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t('list.table.year')}</TableCell>
            <TableCell align="right">{t('list.table.baseFeeAmount')}</TableCell>
            <TableCell align="right">{t('list.table.familyFeeExtra')}</TableCell>
            <TableCell>{t('list.table.dueDate')}</TableCell>
            <TableCell align="center">{t('list.table.status')}</TableCell>
            <TableCell align="center">{t('list.table.actions')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fees.map((fee) => (
            <TableRow key={fee.id}>
              <TableCell>
                <strong>{fee.year}</strong>
              </TableCell>
              <TableCell align="right">
                {formatCurrency(fee.baseFeeAmount)}
              </TableCell>
              <TableCell align="right">
                {formatCurrency(fee.familyFeeExtra)}
              </TableCell>
              <TableCell>
                {formatDate(fee.dueDate)}
              </TableCell>
              <TableCell align="center">
                {isOverdue(fee.dueDate) ? (
                  <Chip label={t('list.status.overdue')} color="error" size="small" />
                ) : (
                  <Chip label={t('list.status.active')} color="success" size="small" />
                )}
              </TableCell>
              <TableCell align="center">
                {onEdit && (
                  <Tooltip title={t('list.actions.edit')}>
                    <IconButton onClick={() => onEdit(fee)} size="small">
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                )}
                {onDelete && (
                  <Tooltip title={t('list.actions.delete')}>
                    <IconButton onClick={() => onDelete(fee)} size="small" color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
```

---

## 📄 Páginas

### `src/pages/fees/AnnualFeesPage.tsx`

Página principal de gestión de cuotas:

```typescript
import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useTranslation } from 'react-i18next';
import { useFeesList } from '@/features/fees/hooks/useFeesList';
import { FeeGenerationDialog } from '@/features/fees/components/FeeGenerationDialog';
import { FeeListTable } from '@/features/fees/components/FeeListTable';
import { withPageTransition } from '@/components/common';

const AnnualFeesPageComponent: React.FC = () => {
  const { t } = useTranslation('fees');
  const [dialogOpen, setDialogOpen] = useState(false);
  const { fees, loading, error } = useFeesList();

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">
          {t('list.error', { error: error.message })}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          {t('page.title')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          {t('page.generateButton')}
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('list.title')}
              </Typography>
              <FeeListTable fees={fees} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <FeeGenerationDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
      />
    </Container>
  );
};

export const AnnualFeesPage = withPageTransition(AnnualFeesPageComponent);
```

---

## 🌐 Internacionalización

### `src/lib/i18n/locales/es/fees.json`

```json
{
  "page": {
    "title": "Cuotas Anuales",
    "generateButton": "Generar Cuotas"
  },
  "generation": {
    "title": "Generar Cuotas Anuales",
    "form": {
      "description": "Complete los datos para generar las cuotas anuales de todos los miembros activos.",
      "year": "Año",
      "yearHelp": "Año para el que se generarán las cuotas (máximo: año actual)",
      "baseFeeAmount": "Cuota Base",
      "baseFeeAmountHelp": "Monto de la cuota para miembros individuales",
      "familyFeeExtra": "Extra Familiar",
      "familyFeeExtraHelp": "Monto adicional para familias (opcional)",
      "continue": "Continuar"
    },
    "preview": {
      "title": "Resumen para el año {year}",
      "alreadyExistsWarning": "Ya existen cuotas para este año. Se actualizarán los montos pero NO se crearán pagos duplicados.",
      "baseFeeAmount": "Cuota Base",
      "familyFeeExtra": "Extra Familiar",
      "individualMembers": "Miembros Individuales",
      "familyMembers": "Familias",
      "totalMembers": "Total Miembros",
      "totalExpected": "Recaudación Esperada",
      "confirm": "Confirmar Generación"
    },
    "result": {
      "success": "¡Cuotas generadas exitosamente!",
      "error": "Error al generar cuotas",
      "summary": "Resumen de la Generación",
      "totalMembers": "Miembros Procesados",
      "paymentsCreated": "Pagos Creados",
      "totalExpectedAmount": "Monto Total Esperado",
      "close": "Cerrar"
    }
  },
  "list": {
    "title": "Cuotas Existentes",
    "table": {
      "year": "Año",
      "baseFeeAmount": "Cuota Base",
      "familyFeeExtra": "Extra Familiar",
      "dueDate": "Fecha Límite",
      "status": "Estado",
      "actions": "Acciones"
    },
    "status": {
      "active": "Activa",
      "overdue": "Vencida"
    },
    "actions": {
      "edit": "Editar",
      "delete": "Eliminar"
    },
    "error": "Error al cargar cuotas: {error}"
  },
  "pending": {
    "title": "Cuotas Pendientes",
    "totalPending": "Total Pendiente",
    "oldestYear": "Año Más Antiguo",
    "totalAmount": "Monto Total"
  },
  "common": {
    "back": "Atrás",
    "cancel": "Cancelar",
    "confirm": "Confirmar",
    "save": "Guardar"
  }
}
```

### `src/lib/i18n/locales/fr/fees.json`

```json
{
  "page": {
    "title": "Cotisations Annuelles",
    "generateButton": "Générer les Cotisations"
  },
  "generation": {
    "title": "Générer les Cotisations Annuelles",
    "form": {
      "description": "Remplissez les données pour générer les cotisations annuelles de tous les membres actifs.",
      "year": "Année",
      "yearHelp": "Année pour laquelle les cotisations seront générées (maximum : année actuelle)",
      "baseFeeAmount": "Cotisation de Base",
      "baseFeeAmountHelp": "Montant de la cotisation pour les membres individuels",
      "familyFeeExtra": "Supplément Familial",
      "familyFeeExtraHelp": "Montant supplémentaire pour les familles (facultatif)",
      "continue": "Continuer"
    },
    "preview": {
      "title": "Résumé pour l'année {year}",
      "alreadyExistsWarning": "Des cotisations existent déjà pour cette année. Les montants seront mis à jour mais AUCUN paiement en double ne sera créé.",
      "baseFeeAmount": "Cotisation de Base",
      "familyFeeExtra": "Supplément Familial",
      "individualMembers": "Membres Individuels",
      "familyMembers": "Familles",
      "totalMembers": "Total des Membres",
      "totalExpected": "Recette Attendue",
      "confirm": "Confirmer la Génération"
    }
  }
}
```

### `src/lib/i18n/locales/wo/fees.json`

```json
{
  "page": {
    "title": "Ay-bi Atu",
    "generateButton": "Doxal Ay-bi"
  }
}
```

---

## 🧪 Tests

### 1. Test del Hook: `src/features/fees/hooks/__tests__/useFeeGeneration.test.tsx`

```typescript
import { renderHook, act, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { useFeeGeneration } from '../useFeeGeneration';
import { GENERATE_ANNUAL_FEES, CHECK_FEE_EXISTS } from '../../api/mutations';

const mocks = [
  {
    request: {
      query: CHECK_FEE_EXISTS,
      variables: { year: 2024 },
    },
    result: {
      data: {
        checkFeeExists: false,
      },
    },
  },
  {
    request: {
      query: GENERATE_ANNUAL_FEES,
      variables: {
        input: {
          year: 2024,
          baseFeeAmount: 100,
          familyFeeExtra: 50,
        },
      },
    },
    result: {
      data: {
        generateAnnualFees: {
          membershipFee: {
            id: '1',
            year: 2024,
            baseFeeAmount: 100,
            familyFeeExtra: 50,
            dueDate: '2024-12-31T23:59:59Z',
          },
          totalMembers: 150,
          individualMembers: 100,
          familyMembers: 50,
          paymentsCreated: 150,
          totalExpectedAmount: 17500,
          alreadyExisted: false,
        },
      },
    },
  },
];

describe('useFeeGeneration', () => {
  it('should initialize with form step', () => {
    const { result } = renderHook(() => useFeeGeneration(), {
      wrapper: ({ children }) => (
        <MockedProvider mocks={mocks} addTypename={false}>
          {children}
        </MockedProvider>
      ),
    });

    expect(result.current.state.step).toBe('form');
    expect(result.current.state.formData).toBeNull();
  });

  it('should validate and show preview', async () => {
    const { result } = renderHook(() => useFeeGeneration(), {
      wrapper: ({ children }) => (
        <MockedProvider mocks={mocks} addTypename={false}>
          {children}
        </MockedProvider>
      ),
    });

    await act(async () => {
      await result.current.validateAndPreview({
        year: 2024,
        baseFeeAmount: 100,
        familyFeeExtra: 50,
      });
    });

    await waitFor(() => {
      expect(result.current.state.step).toBe('preview');
      expect(result.current.state.preview).toBeDefined();
      expect(result.current.state.preview?.feeExists).toBe(false);
    });
  });

  it('should generate fees successfully', async () => {
    const { result } = renderHook(() => useFeeGeneration(), {
      wrapper: ({ children }) => (
        <MockedProvider mocks={mocks} addTypename={false}>
          {children}
        </MockedProvider>
      ),
    });

    // First validate
    await act(async () => {
      await result.current.validateAndPreview({
        year: 2024,
        baseFeeAmount: 100,
        familyFeeExtra: 50,
      });
    });

    await waitFor(() => {
      expect(result.current.state.step).toBe('preview');
    });

    // Then generate
    await act(async () => {
      await result.current.confirmGeneration();
    });

    await waitFor(() => {
      expect(result.current.state.step).toBe('result');
      expect(result.current.state.result).toBeDefined();
      expect(result.current.state.result?.paymentsCreated).toBe(150);
    });
  });
});
```

### 2. Test del Componente: `src/features/fees/components/__tests__/FeeGenerationForm.test.tsx`

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FeeGenerationForm } from '../FeeGenerationForm';

describe('FeeGenerationForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('should render form fields', () => {
    render(<FeeGenerationForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/año/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cuota base/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/extra familiar/i)).toBeInTheDocument();
  });

  it('should validate year is not in the future', async () => {
    render(<FeeGenerationForm onSubmit={mockOnSubmit} />);

    const yearInput = screen.getByLabelText(/año/i);
    const futureYear = new Date().getFullYear() + 1;

    fireEvent.change(yearInput, { target: { value: futureYear.toString() } });
    fireEvent.click(screen.getByText(/continuar/i));

    await waitFor(() => {
      expect(screen.getByText(/no puede ser mayor/i)).toBeInTheDocument();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  it('should submit valid form data', async () => {
    render(<FeeGenerationForm onSubmit={mockOnSubmit} />);

    const yearInput = screen.getByLabelText(/año/i);
    const baseFeeInput = screen.getByLabelText(/cuota base/i);
    const familyExtraInput = screen.getByLabelText(/extra familiar/i);

    fireEvent.change(yearInput, { target: { value: '2024' } });
    fireEvent.change(baseFeeInput, { target: { value: '100' } });
    fireEvent.change(familyExtraInput, { target: { value: '50' } });

    fireEvent.click(screen.getByText(/continuar/i));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        year: 2024,
        baseFeeAmount: 100,
        familyFeeExtra: 50,
      });
    });
  });
});
```

---

## ✅ Checklist de Implementación Frontend

### Fase 1: Setup GraphQL
- [ ] Crear `fees.graphql` con todas las operations
- [ ] Ejecutar `npm run codegen` para generar tipos
- [ ] Verificar que los tipos están correctamente generados

### Fase 2: API Layer
- [ ] Crear `src/features/fees/api/queries.ts`
- [ ] Crear `src/features/fees/api/mutations.ts`
- [ ] Crear `src/features/fees/api/types.ts`
- [ ] Crear `src/features/fees/api/index.ts`

### Fase 3: Hooks
- [ ] Implementar `useFeeGeneration.ts`
- [ ] Implementar `useFeesList.ts`
- [ ] Implementar `usePendingFees.ts`
- [ ] Implementar `useFeeValidation.ts`
- [ ] Tests unitarios de hooks

### Fase 4: Componentes
- [ ] `FeeGenerationDialog.tsx`
- [ ] `FeeGenerationForm.tsx`
- [ ] `FeeGenerationPreview.tsx`
- [ ] `FeeGenerationResult.tsx`
- [ ] `FeeListTable.tsx`
- [ ] Tests de componentes

### Fase 5: Páginas
- [ ] `AnnualFeesPage.tsx`
- [ ] Añadir ruta en `routes.tsx`
- [ ] Añadir entrada en navegación

### Fase 6: i18n
- [ ] `es/fees.json`
- [ ] `fr/fees.json`
- [ ] `wo/fees.json`
- [ ] Verificar todas las traducciones

### Fase 7: Integración
- [ ] Probar flujo completo en desarrollo
- [ ] Verificar manejo de errores
- [ ] Verificar loading states
- [ ] Verificar responsive design

---

**Próximo Paso**: Continuar con [Testing Strategy](./testing.md)
