# 🗺️ Hoja de Ruta - ASAM Frontend

**Fecha de creación**: 18 de octubre de 2025
**Última actualización**: 2 de noviembre de 2025 (ACTUALIZACIÓN MAYOR - Flujo de Caja Definido)
**Versión actual**: 0.2.0
**Estado**: En desarrollo activo - Listo para Flujo de Caja

---

## 📊 Estado Actual del Proyecto

### 🎯 Visión General
PWA (Aplicación Web Progresiva) para la gestión de la Asociación ASAM, construida con:
- React 18 + TypeScript + Vite
- Apollo Client (GraphQL)
- Material-UI
- React Router + Zustand
- Workbox (PWA)

### Progreso Global: ~80% completado ⬆️

---

## ✅ Funcionalidades Implementadas (80%)

### 1. ✅ Infraestructura Base (100%)
- [x] Configuración del proyecto (React 18 + TypeScript + Vite)
- [x] Apollo Client con conexión GraphQL
- [x] Material-UI como sistema de diseño
- [x] React Router con rutas protegidas
- [x] Zustand para estado global
- [x] PWA configurada con Service Worker
- [x] GraphQL Code Generator para tipado automático
- [x] Scripts de CI/CD (build, lint, testing)

**Archivos clave:**
```
vite.config.ts
src/lib/apollo-client.ts
src/routes.tsx
```

---

### 2. ✅ Sistema de Autenticación (100%)
- [x] Login con credenciales
- [x] Logout
- [x] Refresh automático de tokens
- [x] Rutas protegidas (`ProtectedRoute`)
- [x] Control de roles (admin/user)
- [x] Protección de rutas admin-only (`AdminRoute`)
- [x] Redirección basada en roles
- [x] Páginas de verificación de email
- [x] Páginas de reset de contraseña

**Archivos clave:**
```
src/stores/authStore.ts
src/components/auth/ProtectedRoute.tsx
src/components/auth/AdminRoute.tsx
src/pages/auth/*
```

---

### 3. ✅ Módulo de Miembros (100%) 🎉
- [x] Listado con DataGrid avanzado (paginación, ordenamiento, filtros)
- [x] Creación de socios individuales
- [x] Creación de socios familiares (con cónyuge y familiares dinámicos)
- [x] Validación de fechas RFC3339
- [x] Control de permisos (solo admin)
- [x] Exportación a CSV (todos/filtrados/seleccionados)
- [x] Vista de detalles de socio
- [x] **Visualización completa de miembros de familia** ✅
- [x] Edición de socios existentes
- [x] Acciones en tabla (Ver, Editar, Dar de baja)
- [x] Diálogo de confirmación para dar de baja
- [x] Restricción de acciones por rol
- [x] Validación de email unificada (frontend-backend)
- [x] Página de pago inicial tras alta

**Componentes de Familias Implementados:**
- ✅ Sección "Miembros de la Familia" en MemberDetailsPage
- ✅ Visualización de cónyuges con chips
- ✅ Tabla de familiares adicionales con todos los datos
- ✅ Modal "Editar Familiar" funcional en EditMemberPage
- ✅ Botones de editar/eliminar por familiar
- ✅ Botón "+ Añadir Familiar"

**Archivos clave:**
```
src/features/members/*
src/pages/MembersPage.tsx
src/pages/members/NewMemberPage.tsx
src/pages/members/MemberDetailsPage.tsx
src/pages/members/EditMemberPage.tsx
src/features/members/components/MembersTable.tsx
src/features/members/components/ConfirmDeactivateDialog.tsx
src/features/members/components/FamilyMembersList.tsx
```

---

### 4. ✅ Sistema de Permisos y Navegación (100%)
- [x] Navegación adaptada por roles
- [x] Filtrado de menú según permisos
- [x] Protección de rutas admin-only
- [x] Redirección inteligente según rol

**Estructura de permisos**:

**Solo Admin:**
- Panel de control (Dashboard)
- Usuarios (Users)
- Informes (Reports)

**Todos los usuarios:**
- Socios (Members)
- Pagos (Payments)
- Flujo de Caja (Cash Flow)

**Archivos clave:**
```
src/layouts/MainLayout.tsx
src/routes.tsx
src/components/auth/AdminRoute.tsx
```

---

### 5. ⚠️ Módulo de Usuarios (30%)
- [x] Página básica creada (`UsersPage.tsx`)
- [x] Restricción solo para admin
- [ ] CRUD completo de usuarios
- [ ] Gestión de roles y permisos

---

### 6. ✅ Módulo de Pagos (100%) 🎉
- [x] Página de pago inicial tras alta de socio
- [x] Listado completo de pagos con filtros avanzados
- [x] Confirmación de pagos pendientes (PENDING → PAID)
- [x] Confirmación con fecha y notas personalizables
- [x] Polling para pagos creados asincrónicamente
- [x] Sistema de búsqueda unificado (socios/familias)
- [x] Navegación a detalles de socio desde pagos individuales
- [x] Navegación a detalles de familia desde pagos de familia
- [x] **Generación de recibos PDF profesionales** ✅
- [x] **Historial de pagos por socio** ✅

**Funcionalidades de Recibos PDF:**
- ✅ Template profesional con logo ASAM
- ✅ Número de recibo único (formato: ASAM-YYYY-N)
- ✅ Datos completos del socio/familia
- ✅ Detalles del pago (fecha, método, importe)
- ✅ Pie de página con firma digital
- ✅ Botón "Recibo" en tabla de pagos
- ✅ Descarga automática del PDF

**Historial de Pagos:**
- ✅ Sección en MemberDetailsPage
- ✅ Tabla con todos los pagos del socio
- ✅ Total pagado acumulado
- ✅ Link "Ver Todos" a página de pagos filtrada

**Archivos clave:**
```
src/pages/PaymentsPage.tsx
src/pages/payments/InitialPaymentPage.tsx
src/features/payments/components/PaymentsTable.tsx
src/features/payments/components/PaymentFilters.tsx
src/features/payments/components/ConfirmPaymentDialog.tsx
src/features/payments/components/ReceiptGenerator.tsx (PDF)
src/features/payments/hooks/usePayments.ts
src/features/payments/hooks/useConfirmPayment.ts
src/features/payments/hooks/useSearchMemberOrFamily.ts
```

**Nota Importante sobre Cuotas:**
- ❌ **NO existe "Generación de Cuotas Masivas Mensuales"**
- ✅ Las cuotas son **anuales** según el modelo de negocio
- ✅ Los pagos se registran individualmente (PENDING/PAID)
- ✅ No se requiere generación automática masiva

---

### 7. ⚠️ Otros Módulos Pendientes (0-10%)
- [ ] **CashFlow**: Requisitos definidos, pendiente de implementación
- [ ] **Reports**: Página creada pero sin funcionalidad  
- [ ] **Dashboard**: Página básica, faltan métricas y estadísticas

---

## 🎯 Roadmap para Completar MVP

### 🔴 FASE 4: Flujo de Caja (4 días) ⬅️ **EN CURSO - REQUISITOS DEFINIDOS** ✅

#### **REQ-3.3: Módulo de Cash Flow**
```
Prioridad: ALTA (siguiente fase del roadmap)
Tiempo estimado: 4 días
Complejidad: Media
Estado: 🔴 EN DEFINICIÓN → LISTO PARA IMPLEMENTAR
```

---

#### 📋 **Requisitos Confirmados del Negocio**

**Basado en análisis del Excel actual de la asociación:**

**Sistema Actual (Excel):**
```
GASTOS
├── FECHA (vacía en algunos casos)
├── CONCEPTO (texto libre)
└── CANTIDAD (importe en euros)
```

**Categorías Identificadas en el Excel:**
1. **Repatriaciones**: 1.500,00 € (PAPA NDAO, AS MANIJAK SBD, etc.)
2. **Gastos Administrativos**: Tasas Generalitat, Sellos, Copistería, Tarjetas
3. **Gastos Bancarios**: LA CAIXA ANUAL (48,00 €)
4. **Ayudas Sociales**: MANDIAYE DIAW AJUDA (300,00 €)

---

#### 🗄️ **Estructura de Base de Datos Existente**

```sql
cash_flows
├── id (PK) - integer (autoincrement)
├── member_id (FK) - integer (nullable)
├── family_id (FK) - integer (nullable)
├── payment_id (FK) - integer (nullable)
├── operation_type - varchar(20)
├── amount - numeric(10,2)
├── date - timestamp (NOT NULL)
├── detail - varchar(255)
├── created_at - timestamp
├── updated_at - timestamp
└── deleted_at - timestamp (soft delete)
```

**Reglas de Negocio Confirmadas:**

1. **Repatriaciones**:
   - ✅ Importe por defecto: **1.500€** (editable)
   - ✅ **Obligatorio asociar a socio** (member_id)
   - 🔮 Comprobantes: Nice to have (futuro)

2. **Integración con Pagos**:
   - ✅ **Automática**: Pagos confirmados → Ingresos automáticos en cash_flow
   - ✅ Campo `payment_id` vincula con tabla payments

3. **Fechas**:
   - ✅ **Obligatorias** (NOT NULL en BD)

4. **Permisos**:
   - 👨‍💼 **Admin**: Registra gastos/ingresos y ve todo
   - 👤 **User**: Solo ve sus movimientos (filtrado por member_id)

5. **Tipo de Movimiento**:
   - ➕ **Ingresos**: `amount` positivo
   - ➖ **Gastos**: `amount` negativo
   - 📝 **operation_type**: Identifica categoría (ej: "ingreso_cuota", "gasto_repatriacion")

---

#### 📊 **Categorías de operation_type Definidas**

```typescript
export enum OperationType {
  // INGRESOS (amount > 0)
  INGRESO_CUOTA = 'INGRESO_CUOTA',           // Automático desde pagos
  INGRESO_DONACION = 'INGRESO_DONACION',     // Manual
  INGRESO_OTRO = 'INGRESO_OTRO',             // Manual
  
  // GASTOS (amount < 0)
  GASTO_REPATRIACION = 'GASTO_REPATRIACION', // Asociado a socio
  GASTO_ADMINISTRATIVO = 'GASTO_ADMINISTRATIVO', // Tasas, sellos, copistería
  GASTO_BANCARIO = 'GASTO_BANCARIO',         // Comisiones bancarias
  GASTO_AYUDA = 'GASTO_AYUDA',               // Ayudas sociales
  GASTO_OTRO = 'GASTO_OTRO',                 // Otros gastos
}

export const OPERATION_TYPES = {
  INGRESO_CUOTA: {
    label: 'Cuota de Socio',
    category: 'INGRESO',
    color: '#4caf50',
    autoGenerated: true, // No se crea manualmente
  },
  INGRESO_DONACION: {
    label: 'Donación',
    category: 'INGRESO',
    color: '#4caf50',
  },
  INGRESO_OTRO: {
    label: 'Otro Ingreso',
    category: 'INGRESO',
    color: '#4caf50',
  },
  GASTO_REPATRIACION: {
    label: 'Repatriación',
    category: 'GASTO',
    color: '#f44336',
    defaultAmount: -1500, // Negativo, editable
    requiresMember: true, // Obligatorio asociar a socio
  },
  GASTO_ADMINISTRATIVO: {
    label: 'Gasto Administrativo',
    category: 'GASTO',
    color: '#f44336',
    examples: ['Tasas Generalitat', 'Sellos', 'Copistería', 'Imprenta'],
  },
  GASTO_BANCARIO: {
    label: 'Gasto Bancario',
    category: 'GASTO',
    color: '#f44336',
    examples: ['Comisión anual', 'Mantenimiento cuenta'],
  },
  GASTO_AYUDA: {
    label: 'Ayuda Social',
    category: 'GASTO',
    color: '#f44336',
  },
  GASTO_OTRO: {
    label: 'Otro Gasto',
    category: 'GASTO',
    color: '#f44336',
  },
};
```

---

#### 🏗️ **Plan de Implementación Detallado**

### **SUB-FASE 4.1: Backend - GraphQL Schema y Resolvers** (1 día)

**Queries GraphQL:**
```graphql
# Listar transacciones (filtrado automático por rol)
query GetCashFlows(
  $filters: CashFlowFilters
  $pagination: PaginationInput
) {
  cashFlows(filters: $filters, pagination: $pagination) {
    edges {
      id
      date
      operationType
      amount
      detail
      member { id, firstName, lastName, memberNumber }
      family { id, primaryMemberName }
      payment { id, receiptNumber }
      createdAt
    }
    totalCount
    pageInfo { hasNextPage, hasPreviousPage }
  }
}

# Balance actual
query GetBalance {
  cashFlowBalance {
    totalIncome
    totalExpenses
    currentBalance
  }
}

# Estadísticas por periodo
query GetCashFlowStats($startDate: Date!, $endDate: Date!) {
  cashFlowStats(startDate: $startDate, endDate: $endDate) {
    incomeByCategory
    expensesByCategory
    monthlyTrend
  }
}
```

**Mutations GraphQL:**
```graphql
# Crear transacción manual
mutation CreateCashFlow($input: CreateCashFlowInput!) {
  createCashFlow(input: $input) {
    id
    date
    operationType
    amount
    detail
    member { id, firstName, lastName }
  }
}

# Actualizar transacción
mutation UpdateCashFlow($id: ID!, $input: UpdateCashFlowInput!) {
  updateCashFlow(id: $id, input: $input) {
    id
    date
    operationType
    amount
    detail
  }
}

# Eliminar (soft delete)
mutation DeleteCashFlow($id: ID!) {
  deleteCashFlow(id: $id) {
    success
    message
  }
}
```

**Tipos GraphQL:**
```graphql
input CreateCashFlowInput {
  date: Date!
  operationType: OperationType!
  amount: Float!
  detail: String!
  memberId: ID
  familyId: ID
}

input CashFlowFilters {
  startDate: Date
  endDate: Date
  operationType: OperationType
  memberId: ID
}

enum OperationType {
  INGRESO_CUOTA
  INGRESO_DONACION
  INGRESO_OTRO
  GASTO_REPATRIACION
  GASTO_ADMINISTRATIVO
  GASTO_BANCARIO
  GASTO_AYUDA
  GASTO_OTRO
}
```

**Lógica de Backend Crítica:**
```go
// En el resolver GetCashFlows:
func (r *queryResolver) CashFlows(ctx context.Context, filters *CashFlowFilters) ([]*CashFlow, error) {
    user := middleware.GetUserFromContext(ctx)
    
    // FILTRADO AUTOMÁTICO POR ROL
    if user.Role != "admin" {
        // Usuario normal: solo ve sus movimientos
        filters.MemberID = &user.MemberID
    }
    // Admin: ve todo (no se filtra)
    
    return r.cashFlowService.List(ctx, filters)
}
```

---

### **SUB-FASE 4.2: Frontend - Tipos y Utilidades** (0.5 día)

**Estructura de Archivos:**
```
src/features/cashflow/
├── components/
│   ├── CashFlowTable.tsx          # DataGrid principal
│   ├── CashFlowFilters.tsx        # Filtros avanzados
│   ├── BalanceCard.tsx            # Card con balance actual
│   ├── BalanceChart.tsx           # Gráfico de evolución (Recharts)
│   ├── TransactionForm.tsx        # Formulario unificado
│   ├── IncomeFormFields.tsx       # Campos específicos ingresos
│   ├── ExpenseFormFields.tsx      # Campos específicos gastos
│   ├── RepatriationForm.tsx       # Formulario especializado
│   └── ConfirmDeleteDialog.tsx    # Confirmación eliminación
├── hooks/
│   ├── useCashFlows.ts            # Query listado + filtros
│   ├── useBalance.ts              # Query balance y stats
│   ├── useCreateCashFlow.ts       # Mutation crear
│   ├── useUpdateCashFlow.ts       # Mutation actualizar
│   └── useDeleteCashFlow.ts       # Mutation eliminar
├── utils/
│   ├── operationTypes.ts          # Constantes y labels
│   ├── formatters.ts              # Formato montos y fechas
│   └── validation.ts              # Schemas de validación
└── types.ts
```

**Tipos TypeScript:**
```typescript
// src/features/cashflow/types.ts

export enum OperationType {
  INGRESO_CUOTA = 'INGRESO_CUOTA',
  INGRESO_DONACION = 'INGRESO_DONACION',
  INGRESO_OTRO = 'INGRESO_OTRO',
  GASTO_REPATRIACION = 'GASTO_REPATRIACION',
  GASTO_ADMINISTRATIVO = 'GASTO_ADMINISTRATIVO',
  GASTO_BANCARIO = 'GASTO_BANCARIO',
  GASTO_AYUDA = 'GASTO_AYUDA',
  GASTO_OTRO = 'GASTO_OTRO',
}

export interface CashFlowTransaction {
  id: string;
  date: Date;
  operationType: OperationType;
  amount: number; // Positivo = ingreso, Negativo = gasto
  detail: string;
  member?: {
    id: string;
    firstName: string;
    lastName: string;
    memberNumber: string;
  };
  family?: {
    id: string;
    primaryMemberName: string;
  };
  payment?: {
    id: string;
    receiptNumber: string;
  };
  createdAt: Date;
}

export interface CashFlowBalance {
  totalIncome: number;
  totalExpenses: number;
  currentBalance: number;
}

export interface CashFlowFilters {
  startDate?: Date;
  endDate?: Date;
  operationType?: OperationType;
  memberId?: string;
}
```

---

### **SUB-FASE 4.3: Frontend - Componentes Core** (1 día)

#### 4.3.1 CashFlowTable.tsx
```typescript
// DataGrid con Material-UI
// Columnas: Fecha, Tipo, Categoría, Concepto, Socio, Importe
// Acciones por fila: Ver, Editar (admin), Eliminar (admin)
// Paginación del lado del servidor
// Ordenamiento por columnas
// Row coloring: Verde (ingresos), Rojo (gastos)
```

#### 4.3.2 BalanceCard.tsx
```typescript
// Card grande con 3 métricas:
// - Total Ingresos (verde)
// - Total Gastos (rojo)
// - Balance Actual (negro/verde/rojo según valor)
// Icono de tendencia (↑ ↓)
```

#### 4.3.3 TransactionForm.tsx
```typescript
// Formulario inteligente con dos modos:
// - Modo "Ingreso": amount positivo, categorías de ingreso
// - Modo "Gasto": amount negativo, categorías de gasto
// 
// Campos:
// - Fecha (DatePicker, obligatorio)
// - Categoría (Select, obligatorio)
// - Importe (TextField, validación > 0)
// - Concepto (TextField, obligatorio)
// - Socio (Autocomplete, condicional)
// - Notas (TextField, opcional)
//
// Validación con Yup Schema
// Submit con useCreateCashFlow
```

#### 4.3.4 RepatriationForm.tsx
```typescript
// Formulario especializado para repatriaciones:
// - Fecha (DatePicker)
// - Socio (Autocomplete con búsqueda, obligatorio)
// - Importe (TextField, default: 1500€, editable)
// - Concepto (auto-rellenado: "Repatriación [nombre socio]")
// - Notas (TextField, opcional)
//
// Al seleccionar socio:
// - Pre-rellena concepto automáticamente
// - Valida que el socio exista y esté activo
```

---

### **SUB-FASE 4.4: Frontend - Vista Principal** (1 día)

#### 4.4.1 CashFlowPage.tsx
```typescript
// Layout completo:
// 
// [Header]
//   "Flujo de Caja"
//   
// [Balance Card] (ancho completo, arriba)
//   ├── Total Ingresos: +X.XXX,XX €
//   ├── Total Gastos: -X.XXX,XX €
//   └── Balance Actual: X.XXX,XX €
//
// [Botones de Acción] (solo admin)
//   [+ Ingreso] [+ Gasto] [+ Repatriación] [Exportar CSV]
//
// [Filtros] (lateral izquierdo)
//   ├── Rango de fechas
//   ├── Tipo de operación
//   └── Socio (Autocomplete)
//
// [Tabla de Transacciones] (centro-derecha)
//   └── DataGrid con paginación
//
// Permisos:
// - Si admin: Botones visibles, tabla sin filtrar
// - Si user: Sin botones, tabla filtrada por member_id
```

#### 4.4.2 Hooks Principales
```typescript
// useCashFlows.ts
const useCashFlows = (filters: CashFlowFilters) => {
  const { user } = useAuth();
  
  // Si no es admin, forzar filtro por member_id
  const effectiveFilters = user.role !== 'admin' 
    ? { ...filters, memberId: user.memberId }
    : filters;
  
  return useQuery(GET_CASH_FLOWS, {
    variables: { filters: effectiveFilters },
  });
};

// useBalance.ts
const useBalance = () => {
  return useQuery(GET_BALANCE);
};

// useCreateCashFlow.ts
const useCreateCashFlow = () => {
  return useMutation(CREATE_CASH_FLOW, {
    refetchQueries: ['GetCashFlows', 'GetBalance'],
    onCompleted: () => {
      enqueueSnackbar('Transacción registrada', { variant: 'success' });
    },
  });
};
```

---

### **SUB-FASE 4.5: Integración Automática con Pagos** (0.5 día)

**Backend - Trigger en ConfirmPayment:**
```go
// En el servicio de pagos, al confirmar:
func (s *service) ConfirmPayment(ctx context.Context, paymentID string, input ConfirmPaymentInput) error {
    // 1. Confirmar pago (PENDING → PAID)
    payment, err := s.repo.ConfirmPayment(ctx, paymentID, input)
    if err != nil {
        return err
    }
    
    // 2. Crear registro automático en cash_flows
    cashFlow := &CashFlow{
        PaymentID:     &payment.ID,
        MemberID:      payment.MemberID,
        FamilyID:      payment.FamilyID,
        OperationType: "INGRESO_CUOTA",
        Amount:        payment.Amount, // Positivo
        Date:          payment.PaymentDate,
        Detail:        fmt.Sprintf("Cuota - %s", payment.ReceiptNumber),
    }
    
    if err := s.cashFlowRepo.Create(ctx, cashFlow); err != nil {
        // Log error pero no fallar la confirmación
        log.Errorf("Failed to create cash flow entry: %v", err)
    }
    
    return nil
}
```

**Frontend - Notificación:**
```typescript
// En ConfirmPaymentDialog, tras éxito:
onCompleted: (data) => {
  enqueueSnackbar(
    'Pago confirmado y registrado en flujo de caja',
    { variant: 'success' }
  );
}
```

---

### **SUB-FASE 4.6: Exportación y Gráficos** (0.5 día)

#### 4.6.1 Exportación a CSV
```typescript
// Botón "Exportar CSV" en CashFlowPage
// Exporta transacciones filtradas actuales
// Formato:
// Fecha,Tipo,Categoría,Concepto,Socio,Importe
// 26/10/2025,GASTO,Repatriación,PAPA NDAO,A00015,-1500.00
```

#### 4.6.2 Gráfico de Evolución
```typescript
// Componente BalanceChart.tsx (Recharts)
// Gráfico de líneas con:
// - Eje X: Meses
// - Eje Y: Euros
// - 2 líneas: Ingresos (verde) vs Gastos (rojo)
// - Tooltip con valores detallados
```

---

#### 🎨 **Mockups Visuales**

**Vista de Listado Completa:**
```
┌─────────────────────────────────────────────────────────────────┐
│  FLUJO DE CAJA                                                  │
├─────────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  💰 Balance Actual                                        │  │
│  │  Total Ingresos: +15.320,00 €                            │  │
│  │  Total Gastos: -8.450,00 €                               │  │
│  │  Balance: +6.870,00 € ↑                                   │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  [+ Ingreso]  [+ Gasto]  [+ Repatriación]  [Exportar CSV]      │
│                                                                  │
│  ┌──────────┬──────────┬────────────────┬─────────────┬─────────┐
│  │  Fecha   │ Tipo     │ Categoría      │ Concepto    │ Importe │
│  ├──────────┼──────────┼────────────────┼─────────────┼─────────┤
│  │ 26/10/25 │ 🔴 GASTO │ Repatriación   │ PAPA NDAO   │-1.500€  │
│  │ 25/10/25 │ 🔴 GASTO │ Administrativo │ TASA GEN... │ -18,93€ │
│  │ 24/10/25 │ 🟢 INGRE │ Cuota          │ Pago A00001 │ +40,00€ │
│  │ 23/10/25 │ 🔴 GASTO │ Bancario       │ LA CAIXA... │ -48,00€ │
│  │ ...      │ ...      │ ...            │ ...         │ ...     │
│  └──────────┴──────────┴────────────────┴─────────────┴─────────┘
└─────────────────────────────────────────────────────────────────┘
```

**Formulario de Repatriación:**
```
┌────────────────────────────────────────┐
│  Registrar Gasto - Repatriación        │
├────────────────────────────────────────┤
│  Fecha *                               │
│  [26/10/2025]                          │
│                                         │
│  Socio * (obligatorio)                 │
│  [Buscar socio...]                     │
│  └─> ☑ PAPA NDAO - A00015             │
│                                         │
│  Importe *                             │
│  [1.500,00 €]  (editable)             │
│                                         │
│  Concepto *                            │
│  [Repatriación PAPA NDAO]              │
│  (auto-rellenado)                      │
│                                         │
│  Notas                                 │
│  [..............................]      │
│                                         │
│  [Cancelar]  [Registrar Gasto]        │
└────────────────────────────────────────┘
```

---

#### ⏱️ **Estimación de Tiempo Detallada**

```
SUB-FASE 4.1: Backend (GraphQL)                → 1 día
SUB-FASE 4.2: Frontend (Tipos/Utils)           → 0.5 día
SUB-FASE 4.3: Frontend (Componentes Core)      → 1 día
SUB-FASE 4.4: Frontend (Vista Principal)       → 1 día
SUB-FASE 4.5: Integración con Pagos            → 0.5 día
SUB-FASE 4.6: Exportación y Gráficos           → 0.5 día
───────────────────────────────────────────────────────
TOTAL:                                           4 días
```

---

#### 📝 **Archivos a Crear/Modificar**

**Backend:**
```
internal/graphql/
├── schema/
│   └── cashflow.graphql (nuevo)
├── resolvers/
│   └── cashflow.resolvers.go (nuevo)
└── models/
    └── cashflow.go (actualizar)

internal/services/
└── cashflow/
    ├── service.go (nuevo)
    ├── filters.go (nuevo)
    └── stats.go (nuevo)

internal/services/payment/
└── service.go (modificar - añadir trigger)
```

**Frontend:**
```
src/features/cashflow/ (todo nuevo)
├── components/
│   ├── CashFlowTable.tsx
│   ├── CashFlowFilters.tsx
│   ├── BalanceCard.tsx
│   ├── BalanceChart.tsx
│   ├── TransactionForm.tsx
│   ├── IncomeFormFields.tsx
│   ├── ExpenseFormFields.tsx
│   ├── RepatriationForm.tsx
│   └── ConfirmDeleteDialog.tsx
├── hooks/
│   ├── useCashFlows.ts
│   ├── useBalance.ts
│   ├── useCreateCashFlow.ts
│   ├── useUpdateCashFlow.ts
│   └── useDeleteCashFlow.ts
├── utils/
│   ├── operationTypes.ts
│   ├── formatters.ts
│   └── validation.ts
└── types.ts

src/pages/
└── CashFlowPage.tsx (rediseñar)

src/graphql/operations/
└── cashflow.graphql (nuevo)
```

---

#### 🎯 **Criterios de Aceptación**

**Funcionalidad:**
- [ ] Admin puede registrar ingresos manualmente
- [ ] Admin puede registrar gastos manualmente
- [ ] Admin puede registrar repatriaciones con socio asociado
- [ ] Repatriaciones tienen 1.500€ por defecto (editable)
- [ ] Fechas son obligatorias en todos los formularios
- [ ] User solo ve sus propios movimientos
- [ ] Admin ve todos los movimientos
- [ ] Pagos confirmados se registran automáticamente como ingresos
- [ ] Balance se calcula correctamente (ingresos - gastos)
- [ ] Exportación a CSV funciona con filtros aplicados

**UX:**
- [ ] Tabla con colores semánticos (verde/rojo)
- [ ] Formularios con validación en tiempo real
- [ ] Mensajes de éxito/error claros
- [ ] Confirmación antes de eliminar
- [ ] Filtros persisten al cambiar de página

**Técnico:**
- [ ] Queries optimizadas con paginación
- [ ] Filtrado automático por rol en backend
- [ ] Soft delete (deleted_at)
- [ ] Refetch automático tras operaciones
- [ ] Manejo de errores robusto

---

### 🟢 FASE 3: Dashboard y Reportes (3-4 días)

#### **REQ-3.5: Dashboard con Métricas**
```
Prioridad: MEDIA-ALTA
Tiempo estimado: 2 días
Complejidad: Media
Estado: 🟡 PENDIENTE (tras Flujo de Caja)
```

**Métricas principales**:
- [ ] Total de socios (activos/inactivos)
- [ ] Balance actual (ingresos - gastos)
- [ ] Gráfico de evolución mensual
- [ ] Socios con pagos pendientes (alerta)
- [ ] Últimos movimientos de caja
- [ ] Próximos vencimientos

**Archivos a modificar**:
```
src/pages/DashboardPage.tsx
src/features/dashboard/
├── components/
│   ├── MetricsCards.tsx
│   ├── BalanceChart.tsx
│   ├── PendingPaymentsAlert.tsx
│   └── RecentTransactions.tsx
└── hooks/
    └── useDashboardData.ts
```

---

#### **REQ-3.4: Reportes Básicos**
```
Prioridad: MEDIA
Tiempo estimado: 2 días
Complejidad: Media
Estado: 🟡 PENDIENTE
```

**Reportes a implementar**:

1. **Listado de Morosos**
   - [ ] Socios con cuotas vencidas
   - [ ] Deuda total por socio
   - [ ] Meses de atraso
   - [ ] Exportar a CSV/PDF

2. **Reporte de Ingresos**
   - [ ] Filtro por periodo
   - [ ] Desglose por tipo de pago
   - [ ] Gráfico de tendencia
   - [ ] Total del periodo

3. **Reporte de Gastos**
   - [ ] Filtro por periodo
   - [ ] Desglose por categoría
   - [ ] Comparación con periodos anteriores

**Archivos a crear**:
```
src/pages/ReportsPage.tsx (rediseñar)
src/features/reports/
├── components/
│   ├── DelinquentMembersReport.tsx
│   ├── IncomeReport.tsx
│   ├── ExpensesReport.tsx
│   └── ExportReportButton.tsx
└── hooks/
    └── useReports.ts
```

---

### 🔵 FASE 5: Mejoras de PWA y UX (Post-MVP)

#### **REQ-5.1: Setup Completo de PWA**
```
Prioridad: MEDIA-ALTA
Tiempo estimado: 2-3 días
Complejidad: Media
Estado: 🟡 PENDIENTE
```

**Objetivo**: Convertir la app en una verdadera PWA con funcionalidad offline.

**Tareas**:

1. **Manifest.json Optimizado**
   - [ ] Configurar manifest con todos los campos requeridos
   - [ ] Generar iconos en todos los tamaños (192x192, 512x512)
   - [ ] Añadir iconos maskables para Android
   - [ ] Configurar colores de tema (theme_color, background_color)
   - [ ] Definir start_url optimizada según rol

2. **Service Worker con Workbox**
   - [ ] Configurar estrategia de caché para assets estáticos
   - [ ] Implementar App Shell caching
   - [ ] Página offline personalizada
   - [ ] Estrategia Stale-While-Revalidate para datos dinámicos

3. **Capacidad de Instalación**
   - [ ] Prompt de instalación personalizado
   - [ ] Detección de estado de instalación
   - [ ] Banner "Añadir a pantalla de inicio"

4. **Funcionalidad Offline Básica**
   - [ ] Caché de lista de socios (lectura)
   - [ ] Caché de detalles de socio
   - [ ] Indicador visual de modo offline
   - [ ] Mensajes informativos cuando offline

**Archivos a crear/modificar**:
```
public/manifest.json
public/icons/ (192x192, 512x512, maskable)
src/service-worker.ts
src/components/common/OfflineIndicator.tsx
src/components/common/InstallPrompt.tsx
vite.config.ts (configuración PWA)
```

---

#### **REQ-5.2: Accesibilidad (WCAG 2.1 AA)**
```
Prioridad: MEDIA
Tiempo estimado: 3-4 días
Complejidad: Media
Estado: 🟡 PENDIENTE
```

**Tareas**:

1. **Auditoría de Accesibilidad**
   - [ ] Ejecutar Lighthouse audit
   - [ ] Revisar con WAVE tool
   - [ ] Testing con lectores de pantalla (NVDA/JAWS)

2. **Correcciones Prioritarias**
   - [ ] Navegación completa por teclado
   - [ ] Focus indicators visibles
   - [ ] ARIA labels en componentes dinámicos
   - [ ] Contraste de colores AAA en textos importantes
   - [ ] Alternativas de texto para iconos

3. **Testing y Validación**
   - [ ] Tests automatizados con jest-axe
   - [ ] Manual testing con VoiceOver/NVDA
   - [ ] Verificación con usuarios reales

---

#### **REQ-5.3: Optimización de Rendimiento**
```
Prioridad: MEDIA
Tiempo estimado: 2-3 días
Complejidad: Media
Estado: 🟡 PENDIENTE
```

**Tareas**:

1. **Presupuesto de Rendimiento**
   - [ ] Definir métricas objetivo (TTI < 5s, FCP < 2s)
   - [ ] Setup de monitoreo continuo

2. **Code Splitting Avanzado**
   - [ ] División por rutas con React.lazy
   - [ ] División por componentes pesados
   - [ ] Lazy loading de componentes de tabla

3. **Optimización de Assets**
   - [ ] Compresión de imágenes (WebP/AVIF)
   - [ ] Minificación agresiva
   - [ ] Tree shaking optimizado

4. **Auditoría y Mejoras**
   - [ ] Análisis de bundle con Rollup visualizer
   - [ ] Identificar dependencias pesadas
   - [ ] Implementar mejoras incrementales

---

### 🔵 FASE 6: Funcionalidades Secundarias (Post-MVP)

#### **REQ-3.1: Gestión Completa de Familias**
```
Prioridad: MEDIA-BAJA
Tiempo estimado: 2 días
Estado: 🟡 PENDIENTE
```

- [ ] Vista independiente de familias
- [ ] CRUD completo de familias
- [ ] Añadir/quitar miembros dinámicamente
- [ ] Cambio de titular
- [ ] Historial de cambios

---

#### **Gestión de Usuarios Admin**
```
Prioridad: BAJA
Tiempo estimado: 2 días
Estado: 🟡 PENDIENTE
```

- [ ] CRUD de usuarios
- [ ] Asignación de roles
- [ ] Cambio de contraseña (admin reset)
- [ ] Log de actividad

---

#### **Sistema de Notificaciones**
```
Prioridad: MEDIA-BAJA
Tiempo estimado: 2-3 días
Estado: 🟡 PENDIENTE
```

- [ ] Notificaciones in-app para eventos importantes
- [ ] Push notifications (opcional, complejo)
- [ ] Sistema de alertas para admins
- [ ] Preferencias de notificaciones por usuario

---

#### **Testing Completo**
```
Prioridad: ALTA (para producción)
Tiempo estimado: 1 semana
Estado: 🟡 PENDIENTE
```

- [ ] Tests unitarios para componentes críticos
- [ ] Tests de integración para flujos clave
- [ ] Tests E2E con Playwright/Cypress
- [ ] Tests de accesibilidad automatizados
- [ ] Setup de CI/CD para tests

---

#### **Mejoras Futuras en Flujo de Caja (Nice to Have)**
```
Prioridad: BAJA
Estado: 🔮 FUTURO
```

- [ ] Adjuntar comprobantes (facturas, recibos)
- [ ] Sistema de aprobación de gastos
- [ ] Notificaciones de gastos grandes
- [ ] Presupuestos por categoría
- [ ] Alertas de saldo bajo

---

## 📅 Timeline Actualizado

### Estado Actual (2 de Noviembre de 2025)
```
✅ FASE 1: Módulo de Socios - COMPLETADO 100%
✅ FASE 2: Módulo de Pagos - COMPLETADO 100%
🔴 FASE 4: Flujo de Caja - LISTO PARA IMPLEMENTAR (4 días)
🟡 FASE 3: Dashboard y Reportes - PENDIENTE (3-4 días)
🟡 FASE 5: PWA y UX - PENDIENTE (Post-MVP)
```

### Plan de Desarrollo Propuesto
```
📅 Semana Actual (4 días)
└── 🔴 FLUJO DE CAJA (REQUISITOS DEFINIDOS ✅)
    ├── Día 1: Backend (GraphQL schema/resolvers)
    ├── Día 2: Frontend (Tipos, utils, componentes core)
    ├── Día 3: Frontend (Vista principal, formularios)
    └── Día 4: Integración pagos + Exportación

📅 Semana Siguiente (3-4 días)
└── 🟡 DASHBOARD Y REPORTES
    ├── Día 1-2: Dashboard con métricas
    └── Día 3-4: Reportes básicos

📅 Semanas Posteriores
└── 🟡 PWA + Optimización + Testing
```

---

## 🎯 Criterios de Éxito para MVP

### Funcional
- ✅ Alta completa de socios (individual y familiar)
- ✅ Edición de socios existentes
- ✅ Dar de baja socios (cambio a INACTIVE)
- ✅ Sistema de permisos por roles
- ✅ Registro y confirmación de pagos
- ✅ Generación de recibos PDF
- ✅ Historial de pagos por socio
- [ ] **Sistema de flujo de caja** ⬅️ SIGUIENTE
- [ ] Dashboard con métricas principales

### Técnico
- ✅ Sin errores críticos en consola
- ✅ Tiempo de carga < 3 segundos
- ✅ Responsive en móvil y desktop
- [ ] PWA instalable y funcional offline (lectura)
- ✅ Sistema de permisos robusto

### Usuario
- ✅ Flujo completo sin interrupciones
- ✅ Interfaz intuitiva y consistente
- ✅ Feedback claro en cada acción
- ✅ Manejo de errores amigable
- ✅ Experiencia diferenciada por rol

---

## 📈 Métricas de Progreso

### Estado Actual (2/11/2025) ⬆️⬆️
```
Infraestructura:     ████████████████████ 100%
Autenticación:       ████████████████████ 100%
Permisos y Roles:    ████████████████████ 100%
Miembros:            ████████████████████ 100% ⬆️
Pagos:               ████████████████████ 100% ⬆️
Dashboard:           ██░░░░░░░░░░░░░░░░░░  10%
Flujo de Caja:       ░░░░░░░░░░░░░░░░░░░░   0% (requisitos definidos ✅)
Reportes:            ░░░░░░░░░░░░░░░░░░░░   0%

TOTAL:               ████████████████░░░░  80% ⬆️⬆️
```

### Meta MVP (Estimado: 1.5 semanas)
```
Infraestructura:     ████████████████████ 100%
Autenticación:       ████████████████████ 100%
Permisos y Roles:    ████████████████████ 100%
Miembros:            ████████████████████ 100%
Pagos:               ████████████████████ 100%
Dashboard:           ████████████░░░░░░░░  60%
Flujo de Caja:       ████████████████████ 100%
Reportes:            ████████░░░░░░░░░░░░  40%

TOTAL:               ███████████████████░  95%
```

---

## 📝 Cambios Recientes (Log de Actualizaciones)

### 2 de Noviembre de 2025 - DEFINICIÓN COMPLETA DE FLUJO DE CAJA ✅

#### 📊 Requisitos de Negocio Confirmados

**Análisis del Sistema Actual:**
- ✅ Examinado Excel de registro actual de la asociación
- ✅ Identificadas categorías reales de gastos/ingresos
- ✅ Detectado patrón: Repatriaciones = 1.500€
- ✅ Confirmada estructura de BD existente (tabla cash_flows)

**Decisiones Clave de Negocio:**
1. **Repatriaciones**: 1.500€ por defecto, editable, asociadas a socio
2. **Integración Pagos**: Automática (pagos confirmados → ingresos)
3. **Fechas**: Obligatorias en todos los apuntes
4. **Permisos**: Admin registra, User solo ve sus movimientos
5. **Tipo**: Basado en signo de amount (+ ingreso, - gasto)

**Categorías Definidas:**
- **Ingresos**: Cuota (auto), Donación, Otro
- **Gastos**: Repatriación, Administrativo, Bancario, Ayuda, Otro

**Plan de Implementación:**
- ✅ 5 sub-fases definidas con detalle técnico
- ✅ Mockups visuales creados
- ✅ Estructura de archivos definida
- ✅ Criterios de aceptación establecidos
- ✅ Estimación: 4 días

**Estado**: 🔴 LISTO PARA IMPLEMENTAR

---

### 2 de Noviembre de 2025 - ACTUALIZACIÓN CRÍTICA 🎉

#### ✅ Estado Real del Proyecto Verificado

**Correcciones Importantes al Roadmap:**

1. **Módulo de Miembros: 90% → 100%** ⬆️
   - ✅ La visualización de miembros de familia SÍ está implementada
   - ✅ Confirmado funcionamiento completo en MemberDetailsPage
   - ✅ Confirmado funcionamiento completo en EditMemberPage
   - ✅ Sección "Miembros de la Familia" visible y funcional
   - ✅ Modal "Editar Familiar" operativo
   - ❌ ELIMINADO bug crítico (no existía, era error de documentación)

2. **Módulo de Pagos: 50% → 100%** ⬆️
   - ✅ Generación de PDFs SÍ está implementada
   - ✅ Recibos profesionales con logo ASAM verificados
   - ✅ Template completo con todos los datos
   - ✅ Descarga funcional desde tabla de pagos
   - ✅ Historial de pagos por socio implementado
   - ❌ ELIMINADA tarea de "Cuotas Masivas Mensuales" (no tiene sentido en el modelo de negocio)

3. **Progreso Total: 67% → 80%** ⬆️⬆️

**Verificaciones Realizadas:**
- ✅ Captura de pantalla 1: MemberDetailsPage con familia completa visible
- ✅ Captura de pantalla 2: EditMemberPage con modal de edición de familiar
- ✅ Captura de pantalla 3: Recibo PDF generado correctamente

**Lecciones Aprendidas:**
- ⚠️ Importancia de verificar el código real vs documentación
- ⚠️ El roadmap estaba desactualizado por ~2 semanas
- ⚠️ Funcionalidades críticas implementadas pero no documentadas

---

#### Cambios en el Modelo de Negocio Documentados

**Cuotas Anuales (no Mensuales):**
- ❌ NO existe generación de cuotas masivas mensuales
- ✅ Las cuotas son ANUALES según modelo de la asociación
- ✅ Sistema actual PENDING/PAID es suficiente
- ✅ No se requiere automatización de generación

---

### Commits Históricos Relevantes

#### 2 de Noviembre de 2025
1. `feat(payments): support custom date and notes in confirmPayment`
2. `fix(payments): add polling and loading states for async payment creation`
3. `feat(members): unify email validation across all member forms`
4. `fix(members): correct email validation to allow form submission`

#### 28 de Octubre de 2025
1. `fix(payments): correct types in useSearchMemberOrFamily hook`
2. `feat(payments): integrate payment confirmation in PaymentsPage`

#### 27 de Octubre de 2025
1. `feat(payments): improve type safety, validation and error handling`

#### 26 de Octubre de 2025
1. `fix(users): corregir clave de traducción del botón cancelar`
2. `feat(members): add edit and deactivate actions to members table`
3. `feat(members): add confirmation dialog for member deactivation`
4. `feat(members): restrict edit and deactivate actions to admin users`
5. `feat(navigation): implement role-based navigation and redirection`
6. `feat(auth): add admin-only route protection for dashboard and admin pages`

---

## 📝 Notas de Arquitectura

### Principios Mantenidos
- ✅ Arquitectura Hexagonal (domain/application/infrastructure)
- ✅ Componentes desacoplados y reutilizables
- ✅ Hooks personalizados para lógica compleja
- ✅ Tipado estricto con TypeScript
- ✅ GraphQL types generados automáticamente
- ✅ Conventional Commits para control de versiones
- ✅ Permisos basados en roles (RBAC)
- ✅ Separación clara de rutas públicas/privadas/admin

### Mejoras Pendientes
- ⚠️ Implementar testing sistemático (cobertura < 10%)
- ⚠️ Añadir Storybook para componentes UI
- ⚠️ Mejorar estrategia offline (Service Worker avanzado)
- ⚠️ Optimizar bundle size (code splitting)
- ⚠️ Añadir logging estructurado
- ⚠️ Implementar auditoría de acciones de usuario

### Seguridad
- ✅ Autenticación JWT con refresh tokens
- ✅ Rutas protegidas en frontend
- ✅ Control de permisos por rol
- ⚠️ PENDIENTE: Backend debe validar permisos en todos los endpoints
- ⚠️ PENDIENTE: Backend debe filtrar datos por usuario en endpoints compartidos

---

## 📚 Referencias

### Documentación Relacionada
- [Guía Estratégica PWA](./Construyendo_para_la_Comunidad_y_la_Confianza__Una_Guía_Estratégica_para_el_Desarrollo_de_la_Aplicación_Web_Progresiva_de_Mutua_ASAM.md)
- [Resumen de Fixes Implementados](./SUMMARY-All-Fixes-Implemented.md)
- [REQ-2.1: Exportación CSV](./REQ-2.1-CSV-Export-Implementation.md)
- [REQ-2.3: Lógica de Familias](./REQ-2.3-Family-Logic-Implementation.md)
- [Testing Guide](../TESTING_GUIDE.md)

### Backend API
- Documentación GraphQL: `/asam-backend/docs/frontend`
- Schema GraphQL: `http://localhost:8080/graphql`

### Sistema Actual
- Registro Excel: Analizado y documentado en FASE 4
- Tabla BD: `cash_flows` (11 columnas, definición completa en FASE 4)

---

**Última actualización**: 2 de noviembre de 2025 (Definición completa de Flujo de Caja)  
**Próxima revisión**: Tras completar Flujo de Caja (estimado: 6 de noviembre de 2025)  
**Mantenido por**: Equipo de desarrollo ASAM Frontend
