# 📋 Requisitos de Backend - Módulo de Flujo de Caja

**Fecha de creación**: 2 de noviembre de 2025  
**Prioridad**: 🔴 ALTA - Siguiente fase del roadmap  
**Tiempo estimado**: 1.5 días de desarrollo backend  
**Módulo**: Cash Flow (Flujo de Caja)  
**Versión**: 1.0

---

## 📑 Índice

1. [Contexto de Negocio](#contexto-de-negocio)
2. [Análisis del Sistema Actual](#análisis-del-sistema-actual)
3. [Estructura de Base de Datos](#estructura-de-base-de-datos)
4. [Especificación GraphQL](#especificación-graphql)
5. [Lógica de Negocio](#lógica-de-negocio)
6. [Integración con Módulo de Pagos](#integración-con-módulo-de-pagos)
7. [Tareas Detalladas](#tareas-detalladas)
8. [Criterios de Aceptación](#criterios-de-aceptación)
9. [Testing](#testing)

---

## 🎯 Contexto de Negocio

### Problema a Resolver

La Asociación ASAM necesita un sistema robusto para registrar y monitorizar todos los movimientos financieros (ingresos y gastos). Actualmente, el seguimiento se realiza manualmente en Excel, lo que genera:

- 📊 Falta de visibilidad en tiempo real del balance
- ⚠️ Riesgo de errores manuales en el registro
- 🔍 Dificultad para generar reportes y analizar tendencias
- 🔐 Control de acceso limitado (todos ven todo en Excel)

### Objetivos del Sistema

1. **Automatizar ingresos**: Los pagos confirmados deben registrarse automáticamente como ingresos
2. **Registrar gastos**: Permitir a los administradores registrar gastos clasificados por categoría
3. **Repatriaciones**: Gestionar el gasto más importante (1.500€) asociándolo siempre a un socio
4. **Control de acceso**: Admin ve todo, usuarios solo ven sus movimientos
5. **Visibilidad**: Balance en tiempo real y estadísticas por categoría

---

## 📊 Análisis del Sistema Actual

### Datos del Excel Actual

**Muestra de registros reales:**

```
GASTOS
┌────────────┬──────────────────────────────┬────────────┐
│ FECHA      │ CONCEPTO                     │ CANTIDAD   │
├────────────┼──────────────────────────────┼────────────┤
│ 26/10/2025 │ PAPA NDAO                    │ 1.500,00 € │
│ 25/10/2025 │ TASA GENERALITAT             │    18,93 € │
│ 24/10/2025 │ AS MANIJAK SBD               │ 1.500,00 € │
│ 23/10/2025 │ LA CAIXA ANUAL               │    48,00 € │
│ 22/10/2025 │ MANDIAYE DIAW AJUDA          │   300,00 € │
│ 21/10/2025 │ SELLOS                       │     5,50 € │
└────────────┴──────────────────────────────┴────────────┘
```

### Categorías Identificadas

Del análisis del Excel, se han identificado estas categorías reales:

1. **Repatriaciones** (1.500€ cada una)
   - PAPA NDAO
   - AS MANIJAK SBD
   - [Varios socios más...]

2. **Gastos Administrativos**
   - Tasas Generalitat
   - Sellos
   - Copistería
   - Tarjetas de presentación

3. **Gastos Bancarios**
   - LA CAIXA ANUAL (48,00 €)
   - Comisiones

4. **Ayudas Sociales**
   - MANDIAYE DIAW AJUDA (300,00 €)

### Reglas de Negocio Detectadas

✅ **Repatriaciones**:
- Importe estándar: 1.500€
- Siempre asociadas a un socio específico
- Son el gasto más frecuente e importante

✅ **Fechas**:
- Algunos registros históricos no tienen fecha
- **Decisión**: En el nuevo sistema, las fechas son OBLIGATORIAS

✅ **Ingresos**:
- No están en el Excel (se registran en otro sistema)
- **Decisión**: Los pagos confirmados se registrarán automáticamente

---

## 🗄️ Estructura de Base de Datos

### Tabla Existente: `cash_flows`

```sql
CREATE TABLE cash_flows (
    id SERIAL PRIMARY KEY,
    member_id INTEGER REFERENCES members(id),      -- Nullable, FK al socio
    family_id INTEGER REFERENCES families(id),     -- Nullable, FK a familia
    payment_id INTEGER REFERENCES payments(id),    -- Nullable, FK al pago que generó el ingreso
    operation_type VARCHAR(20) NOT NULL,           -- Tipo de operación (ver enum)
    amount NUMERIC(10,2) NOT NULL,                 -- Importe (+ ingreso, - gasto)
    date TIMESTAMP NOT NULL,                       -- Fecha del movimiento
    detail VARCHAR(255) NOT NULL,                  -- Concepto/detalle
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP                           -- Soft delete
);

-- Índices recomendados
CREATE INDEX idx_cashflows_member ON cash_flows(member_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_cashflows_date ON cash_flows(date) WHERE deleted_at IS NULL;
CREATE INDEX idx_cashflows_type ON cash_flows(operation_type) WHERE deleted_at IS NULL;
CREATE INDEX idx_cashflows_payment ON cash_flows(payment_id) WHERE deleted_at IS NULL;
```

### Campos Clave

| Campo | Tipo | Nullable | Descripción |
|-------|------|----------|-------------|
| `id` | SERIAL | No | PK autoincremental |
| `member_id` | INTEGER | **Sí** | FK opcional al socio (obligatorio en repatriaciones) |
| `family_id` | INTEGER | Sí | FK opcional a familia |
| `payment_id` | INTEGER | Sí | FK al pago si el ingreso viene de pago confirmado |
| `operation_type` | VARCHAR(20) | No | Categoría del movimiento (ver enum) |
| `amount` | NUMERIC(10,2) | No | **Positivo** = ingreso, **Negativo** = gasto |
| `date` | TIMESTAMP | **No** | Fecha del movimiento (OBLIGATORIA) |
| `detail` | VARCHAR(255) | No | Concepto descriptivo |
| `created_at` | TIMESTAMP | No | Timestamp de creación |
| `updated_at` | TIMESTAMP | No | Timestamp de última modificación |
| `deleted_at` | TIMESTAMP | Sí | Soft delete (NULL = activo) |

### Reglas de Integridad

1. **Validación de amount**:
   - Ingresos: `amount > 0`
   - Gastos: `amount < 0`
   - Nunca cero

2. **Repatriaciones**:
   - Si `operation_type = 'GASTO_REPATRIACION'`, entonces `member_id` es OBLIGATORIO
   - Validar en el resolver antes de insertar

3. **Ingresos automáticos**:
   - Si `payment_id` no es NULL, entonces:
     - `operation_type = 'INGRESO_CUOTA'`
     - `amount > 0`
     - `detail` contiene el número de recibo

4. **Soft Delete**:
   - Usar `deleted_at IS NULL` en todas las queries
   - Al "eliminar", solo actualizar `deleted_at = NOW()`

---

## 📡 Especificación GraphQL

### Schema GraphQL

```graphql
# ================================
# TIPOS
# ================================

type CashFlow {
  id: ID!
  date: Time!
  operationType: OperationType!
  amount: Float!
  detail: String!
  member: Member
  family: Family
  payment: Payment
  createdAt: Time!
  updatedAt: Time!
}

type CashFlowEdge {
  node: CashFlow!
  cursor: String!
}

type CashFlowConnection {
  edges: [CashFlowEdge!]!
  totalCount: Int!
  pageInfo: PageInfo!
}

type CashFlowBalance {
  totalIncome: Float!
  totalExpenses: Float!
  currentBalance: Float!
}

type CashFlowStats {
  incomeByCategory: [CategoryAmount!]!
  expensesByCategory: [CategoryAmount!]!
  monthlyTrend: [MonthlyAmount!]!
}

type CategoryAmount {
  category: OperationType!
  amount: Float!
  count: Int!
}

type MonthlyAmount {
  month: String!       # Formato: "2025-10"
  income: Float!
  expenses: Float!
  balance: Float!
}

# ================================
# ENUMS
# ================================

enum OperationType {
  # INGRESOS (amount > 0)
  INGRESO_CUOTA          # Generado automáticamente por pagos
  INGRESO_DONACION       # Registro manual
  INGRESO_OTRO           # Registro manual
  
  # GASTOS (amount < 0)
  GASTO_REPATRIACION     # Requiere member_id
  GASTO_ADMINISTRATIVO   # Tasas, sellos, copistería
  GASTO_BANCARIO         # Comisiones bancarias
  GASTO_AYUDA            # Ayudas sociales
  GASTO_OTRO             # Otros gastos
}

# ================================
# INPUTS
# ================================

input CreateCashFlowInput {
  date: Time!
  operationType: OperationType!
  amount: Float!
  detail: String!
  memberId: ID
  familyId: ID
}

input UpdateCashFlowInput {
  date: Time
  operationType: OperationType
  amount: Float
  detail: String
  memberId: ID
}

input CashFlowFilters {
  startDate: Time
  endDate: Time
  operationType: OperationType
  memberId: ID
  category: String       # "INGRESO" o "GASTO"
}

input PaginationInput {
  first: Int
  after: String
  orderBy: String        # Default: "date"
  orderDirection: String # Default: "DESC"
}

# ================================
# QUERIES
# ================================

type Query {
  """
  Lista de transacciones con filtros y paginación.
  IMPORTANTE: Si el usuario no es admin, solo verá sus movimientos
  """
  cashFlows(
    filters: CashFlowFilters
    pagination: PaginationInput
  ): CashFlowConnection!

  """
  Balance actual (ingresos - gastos)
  Admin: ve balance total
  User: ve solo su balance
  """
  cashFlowBalance: CashFlowBalance!

  """
  Estadísticas por periodo
  Admin: ve todas las estadísticas
  User: ve solo sus estadísticas
  """
  cashFlowStats(
    startDate: Time!
    endDate: Time!
  ): CashFlowStats!

  """
  Obtener una transacción específica por ID
  """
  cashFlow(id: ID!): CashFlow
}

# ================================
# MUTATIONS
# ================================

type Mutation {
  """
  Crear una transacción manual (solo admin)
  VALIDACIONES:
  - Repatriaciones requieren memberId
  - Amount debe ser != 0
  - Fecha obligatoria
  """
  createCashFlow(input: CreateCashFlowInput!): CashFlow!

  """
  Actualizar una transacción (solo admin)
  No se puede actualizar si tiene payment_id (ingreso automático)
  """
  updateCashFlow(id: ID!, input: UpdateCashFlowInput!): CashFlow!

  """
  Eliminar una transacción (soft delete, solo admin)
  No se puede eliminar si tiene payment_id
  """
  deleteCashFlow(id: ID!): DeleteResult!
}

type DeleteResult {
  success: Boolean!
  message: String
}
```

---

## 🔐 Lógica de Negocio

### 1. Control de Acceso por Rol

#### Usuarios Admin
```go
// Admin puede:
// - Ver TODAS las transacciones (sin filtro por member_id)
// - Crear transacciones manualmente (ingresos y gastos)
// - Editar transacciones creadas manualmente
// - Eliminar transacciones creadas manualmente
// - Ver balance total de la asociación
// - Ver estadísticas globales
```

#### Usuarios Normales
```go
// User puede:
// - Ver SOLO sus transacciones (filtro automático por member_id)
// - Ver SOLO su balance personal
// - Ver SOLO sus estadísticas
// - NO puede crear, editar ni eliminar
```

### 2. Validaciones Críticas

#### En `createCashFlow`

```go
func (s *service) CreateCashFlow(ctx context.Context, input CreateCashFlowInput) (*CashFlow, error) {
    user := middleware.GetUserFromContext(ctx)
    
    // 1. Solo admin puede crear transacciones
    if user.Role != "admin" {
        return nil, errors.New("unauthorized: only admins can create cash flows")
    }
    
    // 2. Validar fecha
    if input.Date.IsZero() {
        return nil, errors.New("date is required")
    }
    
    // 3. Validar amount != 0
    if input.Amount == 0 {
        return nil, errors.New("amount cannot be zero")
    }
    
    // 4. REGLA CRÍTICA: Repatriaciones requieren socio
    if input.OperationType == "GASTO_REPATRIACION" {
        if input.MemberID == nil {
            return nil, errors.New("repatriations must be associated with a member")
        }
        
        // Validar que el socio existe y está activo
        member, err := s.memberRepo.GetByID(ctx, *input.MemberID)
        if err != nil || member.Status != "ACTIVE" {
            return nil, errors.New("invalid or inactive member")
        }
    }
    
    // 5. Validar detail no vacío
    if strings.TrimSpace(input.Detail) == "" {
        return nil, errors.New("detail is required")
    }
    
    // 6. Consistencia de signo en amount
    isIncome := strings.HasPrefix(string(input.OperationType), "INGRESO_")
    if isIncome && input.Amount < 0 {
        return nil, errors.New("income must have positive amount")
    }
    if !isIncome && input.Amount > 0 {
        return nil, errors.New("expense must have negative amount")
    }
    
    // 7. Crear registro
    cashFlow := &CashFlow{
        MemberID:      input.MemberID,
        FamilyID:      input.FamilyID,
        OperationType: input.OperationType,
        Amount:        input.Amount,
        Date:          input.Date,
        Detail:        input.Detail,
    }
    
    return s.repo.Create(ctx, cashFlow)
}
```

#### En `updateCashFlow`

```go
func (s *service) UpdateCashFlow(ctx context.Context, id string, input UpdateCashFlowInput) (*CashFlow, error) {
    user := middleware.GetUserFromContext(ctx)
    
    // 1. Solo admin
    if user.Role != "admin" {
        return nil, errors.New("unauthorized")
    }
    
    // 2. Obtener transacción actual
    existing, err := s.repo.GetByID(ctx, id)
    if err != nil {
        return nil, err
    }
    
    // 3. NO se pueden editar transacciones automáticas (con payment_id)
    if existing.PaymentID != nil {
        return nil, errors.New("cannot update auto-generated income from payments")
    }
    
    // 4. Aplicar mismas validaciones que en Create
    // [... validaciones ...]
    
    return s.repo.Update(ctx, id, input)
}
```

#### En `deleteCashFlow`

```go
func (s *service) DeleteCashFlow(ctx context.Context, id string) error {
    user := middleware.GetUserFromContext(ctx)
    
    // 1. Solo admin
    if user.Role != "admin" {
        return errors.New("unauthorized")
    }
    
    // 2. Obtener transacción
    existing, err := s.repo.GetByID(ctx, id)
    if err != nil {
        return err
    }
    
    // 3. NO se pueden eliminar transacciones automáticas
    if existing.PaymentID != nil {
        return errors.New("cannot delete auto-generated income from payments")
    }
    
    // 4. Soft delete
    return s.repo.SoftDelete(ctx, id)
}
```

### 3. Queries con Filtrado Automático

#### En `cashFlows`

```go
func (r *queryResolver) CashFlows(ctx context.Context, filters *CashFlowFilters, pagination *PaginationInput) (*CashFlowConnection, error) {
    user := middleware.GetUserFromContext(ctx)
    
    // FILTRADO AUTOMÁTICO POR ROL
    effectiveFilters := filters
    if filters == nil {
        effectiveFilters = &CashFlowFilters{}
    }
    
    if user.Role != "admin" {
        // Usuario normal: solo ve sus movimientos
        effectiveFilters.MemberID = &user.MemberID
    }
    // Admin: ve todo (no se modifica el filtro)
    
    // Aplicar paginación por defecto
    if pagination == nil {
        pagination = &PaginationInput{
            First:          50,
            OrderBy:        "date",
            OrderDirection: "DESC",
        }
    }
    
    return r.service.List(ctx, effectiveFilters, pagination)
}
```

#### En `cashFlowBalance`

```go
func (r *queryResolver) CashFlowBalance(ctx context.Context) (*CashFlowBalance, error) {
    user := middleware.GetUserFromContext(ctx)
    
    var memberID *string
    if user.Role != "admin" {
        memberID = &user.MemberID
    }
    
    return r.service.GetBalance(ctx, memberID)
}
```

---

## 🔗 Integración con Módulo de Pagos

### Registro Automático de Ingresos

Cuando un admin confirma un pago (PENDING → PAID), el sistema debe crear automáticamente un registro en `cash_flows`.

#### Modificación en `payment/service.go`

```go
// En el método ConfirmPayment
func (s *paymentService) ConfirmPayment(ctx context.Context, paymentID string, input ConfirmPaymentInput) (*Payment, error) {
    // 1. Confirmar el pago
    payment, err := s.repo.ConfirmPayment(ctx, paymentID, input)
    if err != nil {
        return nil, fmt.Errorf("failed to confirm payment: %w", err)
    }
    
    // 2. Crear registro automático en cash_flows
    cashFlow := &CashFlow{
        PaymentID:     &payment.ID,
        MemberID:      payment.MemberID,
        FamilyID:      payment.FamilyID,
        OperationType: "INGRESO_CUOTA",
        Amount:        payment.Amount, // Ya es positivo
        Date:          payment.PaymentDate,
        Detail:        fmt.Sprintf("Cuota %d - Recibo %s", payment.Year, payment.ReceiptNumber),
    }
    
    // 3. Usar el servicio de cash flow
    if _, err := s.cashFlowService.CreateAutomatic(ctx, cashFlow); err != nil {
        // NO fallar la confirmación si esto falla, solo loguear
        log.WithError(err).WithField("payment_id", paymentID).Error("Failed to create cash flow entry")
        // Opcional: enviar alerta a admins para revisión manual
    }
    
    return payment, nil
}
```

#### Método Especial: `CreateAutomatic`

```go
// En cashflow/service.go
func (s *service) CreateAutomatic(ctx context.Context, cashFlow *CashFlow) (*CashFlow, error) {
    // Este método NO requiere autenticación de admin
    // Es llamado internamente por otros servicios
    
    // Validaciones básicas
    if cashFlow.PaymentID == nil {
        return nil, errors.New("automatic cash flows require payment_id")
    }
    
    if cashFlow.OperationType != "INGRESO_CUOTA" {
        return nil, errors.New("automatic cash flows must be INGRESO_CUOTA")
    }
    
    if cashFlow.Amount <= 0 {
        return nil, errors.New("income amount must be positive")
    }
    
    return s.repo.Create(ctx, cashFlow)
}
```

### Consideraciones Importantes

1. **Idempotencia**: 
   - Verificar si ya existe un cash_flow para ese payment_id antes de crear
   - Usar constraint único en BD: `UNIQUE(payment_id) WHERE deleted_at IS NULL`

2. **Transaccionalidad**:
   ```go
   // Opción recomendada: Usar transacción DB
   tx, err := s.db.BeginTx(ctx, nil)
   if err != nil {
       return nil, err
   }
   defer tx.Rollback()
   
   // 1. Confirmar pago
   payment, err := s.repo.ConfirmPayment(ctx, tx, paymentID, input)
   if err != nil {
       return nil, err
   }
   
   // 2. Crear cash flow
   cashFlow, err := s.cashFlowService.CreateAutomatic(ctx, tx, cashFlow)
   if err != nil {
       return nil, err
   }
   
   // 3. Commit
   if err := tx.Commit(); err != nil {
       return nil, err
   }
   
   return payment, nil
   ```

3. **Fallback**:
   - Si la creación del cash_flow falla, loguear el error
   - Enviar notificación a admins
   - Permitir que el pago se confirme de todos modos
   - Proveer herramienta admin para "sincronizar" cash_flows faltantes

---

## 📝 Tareas Detalladas

### 📦 TAREA 1: Setup del Modelo y Repository (2 horas)

#### 1.1 Crear Modelo Go

**Archivo**: `internal/domain/cashflow/model.go`

```go
package cashflow

import (
    "time"
)

type CashFlow struct {
    ID            int64      `json:"id" db:"id"`
    MemberID      *int64     `json:"member_id" db:"member_id"`
    FamilyID      *int64     `json:"family_id" db:"family_id"`
    PaymentID     *int64     `json:"payment_id" db:"payment_id"`
    OperationType string     `json:"operation_type" db:"operation_type"`
    Amount        float64    `json:"amount" db:"amount"`
    Date          time.Time  `json:"date" db:"date"`
    Detail        string     `json:"detail" db:"detail"`
    CreatedAt     time.Time  `json:"created_at" db:"created_at"`
    UpdatedAt     time.Time  `json:"updated_at" db:"updated_at"`
    DeletedAt     *time.Time `json:"deleted_at" db:"deleted_at"`
}

type Filters struct {
    StartDate     *time.Time
    EndDate       *time.Time
    OperationType *string
    MemberID      *int64
    Category      *string // "INGRESO" o "GASTO"
}

type Balance struct {
    TotalIncome    float64
    TotalExpenses  float64
    CurrentBalance float64
}

type CategoryAmount struct {
    Category string
    Amount   float64
    Count    int
}

type MonthlyAmount struct {
    Month    string
    Income   float64
    Expenses float64
    Balance  float64
}

type Stats struct {
    IncomeByCategory   []CategoryAmount
    ExpensesByCategory []CategoryAmount
    MonthlyTrend       []MonthlyAmount
}
```

#### 1.2 Crear Repository Interface

**Archivo**: `internal/domain/cashflow/repository.go`

```go
package cashflow

import (
    "context"
    "database/sql"
)

type Repository interface {
    // CRUD básico
    Create(ctx context.Context, cf *CashFlow) (*CashFlow, error)
    GetByID(ctx context.Context, id int64) (*CashFlow, error)
    Update(ctx context.Context, id int64, cf *CashFlow) (*CashFlow, error)
    SoftDelete(ctx context.Context, id int64) error
    
    // Listado con filtros y paginación
    List(ctx context.Context, filters *Filters, limit, offset int, orderBy string) ([]*CashFlow, int, error)
    
    // Balance y estadísticas
    GetBalance(ctx context.Context, memberID *int64) (*Balance, error)
    GetStats(ctx context.Context, startDate, endDate time.Time, memberID *int64) (*Stats, error)
    
    // Verificaciones
    ExistsByPaymentID(ctx context.Context, paymentID int64) (bool, error)
    
    // Transaccional
    CreateTx(ctx context.Context, tx *sql.Tx, cf *CashFlow) (*CashFlow, error)
}
```

#### 1.3 Implementar Repository

**Archivo**: `internal/infrastructure/postgres/cashflow_repository.go`

```go
package postgres

import (
    "context"
    "database/sql"
    "fmt"
    "strings"
    "time"
    
    "github.com/asam/internal/domain/cashflow"
)

type cashFlowRepository struct {
    db *sql.DB
}

func NewCashFlowRepository(db *sql.DB) cashflow.Repository {
    return &cashFlowRepository{db: db}
}

func (r *cashFlowRepository) Create(ctx context.Context, cf *cashflow.CashFlow) (*cashflow.CashFlow, error) {
    query := `
        INSERT INTO cash_flows (
            member_id, family_id, payment_id, operation_type,
            amount, date, detail, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
        RETURNING id, created_at, updated_at
    `
    
    err := r.db.QueryRowContext(
        ctx, query,
        cf.MemberID, cf.FamilyID, cf.PaymentID, cf.OperationType,
        cf.Amount, cf.Date, cf.Detail,
    ).Scan(&cf.ID, &cf.CreatedAt, &cf.UpdatedAt)
    
    if err != nil {
        return nil, fmt.Errorf("failed to create cash flow: %w", err)
    }
    
    return cf, nil
}

func (r *cashFlowRepository) GetByID(ctx context.Context, id int64) (*cashflow.CashFlow, error) {
    query := `
        SELECT id, member_id, family_id, payment_id, operation_type,
               amount, date, detail, created_at, updated_at, deleted_at
        FROM cash_flows
        WHERE id = $1 AND deleted_at IS NULL
    `
    
    var cf cashflow.CashFlow
    err := r.db.QueryRowContext(ctx, query, id).Scan(
        &cf.ID, &cf.MemberID, &cf.FamilyID, &cf.PaymentID, &cf.OperationType,
        &cf.Amount, &cf.Date, &cf.Detail, &cf.CreatedAt, &cf.UpdatedAt, &cf.DeletedAt,
    )
    
    if err == sql.ErrNoRows {
        return nil, fmt.Errorf("cash flow not found")
    }
    if err != nil {
        return nil, fmt.Errorf("failed to get cash flow: %w", err)
    }
    
    return &cf, nil
}

func (r *cashFlowRepository) List(
    ctx context.Context,
    filters *cashflow.Filters,
    limit, offset int,
    orderBy string,
) ([]*cashflow.CashFlow, int, error) {
    // Construir query con filtros dinámicos
    whereClauses := []string{"deleted_at IS NULL"}
    args := []interface{}{}
    argPos := 1
    
    if filters != nil {
        if filters.StartDate != nil {
            whereClauses = append(whereClauses, fmt.Sprintf("date >= $%d", argPos))
            args = append(args, *filters.StartDate)
            argPos++
        }
        if filters.EndDate != nil {
            whereClauses = append(whereClauses, fmt.Sprintf("date <= $%d", argPos))
            args = append(args, *filters.EndDate)
            argPos++
        }
        if filters.OperationType != nil {
            whereClauses = append(whereClauses, fmt.Sprintf("operation_type = $%d", argPos))
            args = append(args, *filters.OperationType)
            argPos++
        }
        if filters.MemberID != nil {
            whereClauses = append(whereClauses, fmt.Sprintf("member_id = $%d", argPos))
            args = append(args, *filters.MemberID)
            argPos++
        }
        if filters.Category != nil {
            if *filters.Category == "INGRESO" {
                whereClauses = append(whereClauses, "amount > 0")
            } else if *filters.Category == "GASTO" {
                whereClauses = append(whereClauses, "amount < 0")
            }
        }
    }
    
    whereClause := strings.Join(whereClauses, " AND ")
    
    // Query principal
    query := fmt.Sprintf(`
        SELECT id, member_id, family_id, payment_id, operation_type,
               amount, date, detail, created_at, updated_at, deleted_at
        FROM cash_flows
        WHERE %s
        ORDER BY %s
        LIMIT $%d OFFSET $%d
    `, whereClause, orderBy, argPos, argPos+1)
    
    args = append(args, limit, offset)
    
    rows, err := r.db.QueryContext(ctx, query, args...)
    if err != nil {
        return nil, 0, fmt.Errorf("failed to list cash flows: %w", err)
    }
    defer rows.Close()
    
    var cashFlows []*cashflow.CashFlow
    for rows.Next() {
        var cf cashflow.CashFlow
        if err := rows.Scan(
            &cf.ID, &cf.MemberID, &cf.FamilyID, &cf.PaymentID, &cf.OperationType,
            &cf.Amount, &cf.Date, &cf.Detail, &cf.CreatedAt, &cf.UpdatedAt, &cf.DeletedAt,
        ); err != nil {
            return nil, 0, fmt.Errorf("failed to scan cash flow: %w", err)
        }
        cashFlows = append(cashFlows, &cf)
    }
    
    // Count total
    countQuery := fmt.Sprintf("SELECT COUNT(*) FROM cash_flows WHERE %s", whereClause)
    var total int
    if err := r.db.QueryRowContext(ctx, countQuery, args[:len(args)-2]...).Scan(&total); err != nil {
        return nil, 0, fmt.Errorf("failed to count cash flows: %w", err)
    }
    
    return cashFlows, total, nil
}

func (r *cashFlowRepository) GetBalance(ctx context.Context, memberID *int64) (*cashflow.Balance, error) {
    whereClauses := []string{"deleted_at IS NULL"}
    args := []interface{}{}
    
    if memberID != nil {
        whereClauses = append(whereClauses, "member_id = $1")
        args = append(args, *memberID)
    }
    
    whereClause := strings.Join(whereClauses, " AND ")
    
    query := fmt.Sprintf(`
        SELECT 
            COALESCE(SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END), 0) as total_income,
            COALESCE(SUM(CASE WHEN amount < 0 THEN ABS(amount) ELSE 0 END), 0) as total_expenses
        FROM cash_flows
        WHERE %s
    `, whereClause)
    
    var balance cashflow.Balance
    err := r.db.QueryRowContext(ctx, query, args...).Scan(
        &balance.TotalIncome,
        &balance.TotalExpenses,
    )
    if err != nil {
        return nil, fmt.Errorf("failed to get balance: %w", err)
    }
    
    balance.CurrentBalance = balance.TotalIncome - balance.TotalExpenses
    
    return &balance, nil
}

func (r *cashFlowRepository) GetStats(
    ctx context.Context,
    startDate, endDate time.Time,
    memberID *int64,
) (*cashflow.Stats, error) {
    // Implementar queries para estadísticas
    // [Ver implementación completa en el código]
    return &cashflow.Stats{}, nil
}

func (r *cashFlowRepository) ExistsByPaymentID(ctx context.Context, paymentID int64) (bool, error) {
    query := `
        SELECT EXISTS(
            SELECT 1 FROM cash_flows
            WHERE payment_id = $1 AND deleted_at IS NULL
        )
    `
    
    var exists bool
    err := r.db.QueryRowContext(ctx, query, paymentID).Scan(&exists)
    return exists, err
}

func (r *cashFlowRepository) SoftDelete(ctx context.Context, id int64) error {
    query := `UPDATE cash_flows SET deleted_at = NOW(), updated_at = NOW() WHERE id = $1`
    _, err := r.db.ExecContext(ctx, query, id)
    return err
}

// ... otros métodos
```

**Checklist**:
- [ ] Modelo creado con todos los campos
- [ ] Repository interface definida
- [ ] Repository implementado con PostgreSQL
- [ ] Queries optimizadas con índices
- [ ] Manejo correcto de soft deletes
- [ ] Tests unitarios del repository

---

### 📡 TAREA 2: GraphQL Schema y Resolvers (3 horas)

#### 2.1 Crear Schema GraphQL

**Archivo**: `internal/graphql/schema/cashflow.graphql`

```graphql
# Copiar el schema completo de la sección anterior
```

**Checklist**:
- [ ] Tipos definidos
- [ ] Enums definidos
- [ ] Inputs definidos
- [ ] Queries definidas
- [ ] Mutations definidas

#### 2.2 Generar Código GraphQL

```bash
# En el proyecto backend
go run github.com/99designs/gqlgen generate
```

#### 2.3 Implementar Resolvers

**Archivo**: `internal/graphql/resolvers/cashflow.resolvers.go`

```go
package resolvers

import (
    "context"
    "fmt"
    
    "github.com/asam/internal/domain/cashflow"
    "github.com/asam/internal/graphql/model"
    "github.com/asam/internal/middleware"
)

// Query resolvers

func (r *queryResolver) CashFlows(
    ctx context.Context,
    filters *model.CashFlowFilters,
    pagination *model.PaginationInput,
) (*model.CashFlowConnection, error) {
    user := middleware.GetUserFromContext(ctx)
    
    // Filtrado automático por rol
    effectiveFilters := &cashflow.Filters{}
    if filters != nil {
        effectiveFilters = mapFiltersFromGraphQL(filters)
    }
    
    if user.Role != "admin" {
        memberID := int64(user.MemberID)
        effectiveFilters.MemberID = &memberID
    }
    
    // Paginación por defecto
    limit := 50
    offset := 0
    orderBy := "date DESC"
    
    if pagination != nil {
        if pagination.First != nil {
            limit = *pagination.First
        }
        if pagination.After != nil {
            // Decodificar cursor para obtener offset
            offset = decodeCursor(*pagination.After)
        }
        if pagination.OrderBy != nil && pagination.OrderDirection != nil {
            orderBy = fmt.Sprintf("%s %s", *pagination.OrderBy, *pagination.OrderDirection)
        }
    }
    
    // Obtener datos
    cashFlows, total, err := r.cashFlowService.List(ctx, effectiveFilters, limit, offset, orderBy)
    if err != nil {
        return nil, err
    }
    
    // Mapear a GraphQL
    edges := make([]*model.CashFlowEdge, len(cashFlows))
    for i, cf := range cashFlows {
        edges[i] = &model.CashFlowEdge{
            Node:   mapCashFlowToGraphQL(cf),
            Cursor: encodeCursor(offset + i),
        }
    }
    
    return &model.CashFlowConnection{
        Edges:      edges,
        TotalCount: total,
        PageInfo: &model.PageInfo{
            HasNextPage:     offset+limit < total,
            HasPreviousPage: offset > 0,
        },
    }, nil
}

func (r *queryResolver) CashFlowBalance(ctx context.Context) (*model.CashFlowBalance, error) {
    user := middleware.GetUserFromContext(ctx)
    
    var memberID *int64
    if user.Role != "admin" {
        id := int64(user.MemberID)
        memberID = &id
    }
    
    balance, err := r.cashFlowService.GetBalance(ctx, memberID)
    if err != nil {
        return nil, err
    }
    
    return &model.CashFlowBalance{
        TotalIncome:    balance.TotalIncome,
        TotalExpenses:  balance.TotalExpenses,
        CurrentBalance: balance.CurrentBalance,
    }, nil
}

func (r *queryResolver) CashFlowStats(
    ctx context.Context,
    startDate time.Time,
    endDate time.Time,
) (*model.CashFlowStats, error) {
    user := middleware.GetUserFromContext(ctx)
    
    var memberID *int64
    if user.Role != "admin" {
        id := int64(user.MemberID)
        memberID = &id
    }
    
    stats, err := r.cashFlowService.GetStats(ctx, startDate, endDate, memberID)
    if err != nil {
        return nil, err
    }
    
    // Mapear a GraphQL
    return mapStatsToGraphQL(stats), nil
}

// Mutation resolvers

func (r *mutationResolver) CreateCashFlow(
    ctx context.Context,
    input model.CreateCashFlowInput,
) (*model.CashFlow, error) {
    cf, err := r.cashFlowService.Create(ctx, mapCreateInputFromGraphQL(input))
    if err != nil {
        return nil, err
    }
    
    return mapCashFlowToGraphQL(cf), nil
}

func (r *mutationResolver) UpdateCashFlow(
    ctx context.Context,
    id string,
    input model.UpdateCashFlowInput,
) (*model.CashFlow, error) {
    cfID, err := strconv.ParseInt(id, 10, 64)
    if err != nil {
        return nil, fmt.Errorf("invalid id")
    }
    
    cf, err := r.cashFlowService.Update(ctx, cfID, mapUpdateInputFromGraphQL(input))
    if err != nil {
        return nil, err
    }
    
    return mapCashFlowToGraphQL(cf), nil
}

func (r *mutationResolver) DeleteCashFlow(
    ctx context.Context,
    id string,
) (*model.DeleteResult, error) {
    cfID, err := strconv.ParseInt(id, 10, 64)
    if err != nil {
        return nil, fmt.Errorf("invalid id")
    }
    
    if err := r.cashFlowService.Delete(ctx, cfID); err != nil {
        return &model.DeleteResult{
            Success: false,
            Message: &err.Error(),
        }, nil
    }
    
    msg := "Cash flow deleted successfully"
    return &model.DeleteResult{
        Success: true,
        Message: &msg,
    }, nil
}

// Mappers
// [Implementar funciones de mapeo entre domain y GraphQL]
```

**Checklist**:
- [ ] Todos los resolvers implementados
- [ ] Filtrado automático por rol aplicado
- [ ] Validaciones en mutations
- [ ] Mappers entre domain y GraphQL
- [ ] Tests de integración GraphQL

---

### 🔧 TAREA 3: Servicio de Dominio (3 horas)

#### 3.1 Crear Service Interface

**Archivo**: `internal/domain/cashflow/service.go`

```go
package cashflow

import (
    "context"
    "time"
)

type Service interface {
    // CRUD
    Create(ctx context.Context, input *CreateInput) (*CashFlow, error)
    CreateAutomatic(ctx context.Context, cf *CashFlow) (*CashFlow, error) // Para pagos
    GetByID(ctx context.Context, id int64) (*CashFlow, error)
    Update(ctx context.Context, id int64, input *UpdateInput) (*CashFlow, error)
    Delete(ctx context.Context, id int64) error
    
    // Listado
    List(ctx context.Context, filters *Filters, limit, offset int, orderBy string) ([]*CashFlow, int, error)
    
    // Balance y estadísticas
    GetBalance(ctx context.Context, memberID *int64) (*Balance, error)
    GetStats(ctx context.Context, startDate, endDate time.Time, memberID *int64) (*Stats, error)
}

type CreateInput struct {
    Date          time.Time
    OperationType string
    Amount        float64
    Detail        string
    MemberID      *int64
    FamilyID      *int64
}

type UpdateInput struct {
    Date          *time.Time
    OperationType *string
    Amount        *float64
    Detail        *string
    MemberID      *int64
}
```

#### 3.2 Implementar Service

**Archivo**: `internal/application/cashflow/service.go`

```go
package cashflow

import (
    "context"
    "errors"
    "fmt"
    "strings"
    "time"
    
    "github.com/asam/internal/domain/cashflow"
    "github.com/asam/internal/domain/member"
    "github.com/asam/internal/middleware"
)

type service struct {
    repo       cashflow.Repository
    memberRepo member.Repository
}

func NewService(repo cashflow.Repository, memberRepo member.Repository) cashflow.Service {
    return &service{
        repo:       repo,
        memberRepo: memberRepo,
    }
}

func (s *service) Create(ctx context.Context, input *cashflow.CreateInput) (*cashflow.CashFlow, error) {
    user := middleware.GetUserFromContext(ctx)
    
    // 1. Solo admin
    if user.Role != "admin" {
        return nil, errors.New("unauthorized: only admins can create cash flows")
    }
    
    // 2. Validaciones
    if err := s.validateCreateInput(input); err != nil {
        return nil, err
    }
    
    // 3. Validar socio si es repatriación
    if input.OperationType == "GASTO_REPATRIACION" {
        if input.MemberID == nil {
            return nil, errors.New("repatriations must be associated with a member")
        }
        
        member, err := s.memberRepo.GetByID(ctx, *input.MemberID)
        if err != nil {
            return nil, fmt.Errorf("invalid member: %w", err)
        }
        if member.Status != "ACTIVE" {
            return nil, errors.New("member is not active")
        }
    }
    
    // 4. Crear
    cf := &cashflow.CashFlow{
        MemberID:      input.MemberID,
        FamilyID:      input.FamilyID,
        OperationType: input.OperationType,
        Amount:        input.Amount,
        Date:          input.Date,
        Detail:        input.Detail,
    }
    
    return s.repo.Create(ctx, cf)
}

func (s *service) CreateAutomatic(ctx context.Context, cf *cashflow.CashFlow) (*cashflow.CashFlow, error) {
    // Validaciones para ingresos automáticos
    if cf.PaymentID == nil {
        return nil, errors.New("automatic cash flows require payment_id")
    }
    
    if cf.OperationType != "INGRESO_CUOTA" {
        return nil, errors.New("automatic cash flows must be INGRESO_CUOTA")
    }
    
    if cf.Amount <= 0 {
        return nil, errors.New("income amount must be positive")
    }
    
    // Verificar si ya existe
    exists, err := s.repo.ExistsByPaymentID(ctx, *cf.PaymentID)
    if err != nil {
        return nil, err
    }
    if exists {
        return nil, errors.New("cash flow already exists for this payment")
    }
    
    return s.repo.Create(ctx, cf)
}

func (s *service) Update(ctx context.Context, id int64, input *cashflow.UpdateInput) (*cashflow.CashFlow, error) {
    user := middleware.GetUserFromContext(ctx)
    
    // 1. Solo admin
    if user.Role != "admin" {
        return nil, errors.New("unauthorized")
    }
    
    // 2. Obtener existente
    existing, err := s.repo.GetByID(ctx, id)
    if err != nil {
        return nil, err
    }
    
    // 3. No se pueden editar ingresos automáticos
    if existing.PaymentID != nil {
        return nil, errors.New("cannot update auto-generated income from payments")
    }
    
    // 4. Validar cambios
    if err := s.validateUpdateInput(input, existing); err != nil {
        return nil, err
    }
    
    // 5. Aplicar cambios
    if input.Date != nil {
        existing.Date = *input.Date
    }
    if input.OperationType != nil {
        existing.OperationType = *input.OperationType
    }
    if input.Amount != nil {
        existing.Amount = *input.Amount
    }
    if input.Detail != nil {
        existing.Detail = *input.Detail
    }
    if input.MemberID != nil {
        existing.MemberID = input.MemberID
    }
    
    return s.repo.Update(ctx, id, existing)
}

func (s *service) Delete(ctx context.Context, id int64) error {
    user := middleware.GetUserFromContext(ctx)
    
    // 1. Solo admin
    if user.Role != "admin" {
        return errors.New("unauthorized")
    }
    
    // 2. Obtener existente
    existing, err := s.repo.GetByID(ctx, id)
    if err != nil {
        return err
    }
    
    // 3. No se pueden eliminar ingresos automáticos
    if existing.PaymentID != nil {
        return errors.New("cannot delete auto-generated income from payments")
    }
    
    return s.repo.SoftDelete(ctx, id)
}

func (s *service) List(ctx context.Context, filters *cashflow.Filters, limit, offset int, orderBy string) ([]*cashflow.CashFlow, int, error) {
    // Ya se aplicó filtrado por rol en el resolver
    return s.repo.List(ctx, filters, limit, offset, orderBy)
}

func (s *service) GetBalance(ctx context.Context, memberID *int64) (*cashflow.Balance, error) {
    return s.repo.GetBalance(ctx, memberID)
}

func (s *service) GetStats(ctx context.Context, startDate, endDate time.Time, memberID *int64) (*cashflow.Stats, error) {
    return s.repo.GetStats(ctx, startDate, endDate, memberID)
}

// Validaciones privadas

func (s *service) validateCreateInput(input *cashflow.CreateInput) error {
    if input.Date.IsZero() {
        return errors.New("date is required")
    }
    
    if input.Amount == 0 {
        return errors.New("amount cannot be zero")
    }
    
    if strings.TrimSpace(input.Detail) == "" {
        return errors.New("detail is required")
    }
    
    // Validar consistencia de signo
    isIncome := strings.HasPrefix(input.OperationType, "INGRESO_")
    if isIncome && input.Amount < 0 {
        return errors.New("income must have positive amount")
    }
    if !isIncome && input.Amount > 0 {
        return errors.New("expense must have negative amount")
    }
    
    return nil
}

func (s *service) validateUpdateInput(input *cashflow.UpdateInput, existing *cashflow.CashFlow) error {
    // Validaciones similares a Create
    // [Implementar]
    return nil
}
```

**Checklist**:
- [ ] Service interface definido
- [ ] Service implementado
- [ ] Todas las validaciones aplicadas
- [ ] Método CreateAutomatic para pagos
- [ ] Tests unitarios del service

---

### 🔗 TAREA 4: Integración con Pagos (2 horas)

#### 4.1 Modificar Payment Service

**Archivo**: `internal/application/payment/service.go`

```go
// Añadir dependencia del servicio de cash flow
type service struct {
    repo            payment.Repository
    memberRepo      member.Repository
    cashFlowService cashflow.Service  // NUEVO
}

func NewService(
    repo payment.Repository,
    memberRepo member.Repository,
    cashFlowService cashflow.Service,  // NUEVO
) payment.Service {
    return &service{
        repo:            repo,
        memberRepo:      memberRepo,
        cashFlowService: cashFlowService,
    }
}

// Modificar ConfirmPayment
func (s *service) ConfirmPayment(ctx context.Context, paymentID int64, input payment.ConfirmInput) (*payment.Payment, error) {
    // 1. Confirmar pago
    pmt, err := s.repo.ConfirmPayment(ctx, paymentID, input)
    if err != nil {
        return nil, fmt.Errorf("failed to confirm payment: %w", err)
    }
    
    // 2. Crear ingreso automático en cash_flows
    cashFlow := &cashflow.CashFlow{
        PaymentID:     &pmt.ID,
        MemberID:      pmt.MemberID,
        FamilyID:      pmt.FamilyID,
        OperationType: "INGRESO_CUOTA",
        Amount:        pmt.Amount, // Ya es positivo
        Date:          pmt.PaymentDate,
        Detail:        fmt.Sprintf("Cuota %d - Recibo %s", pmt.Year, pmt.ReceiptNumber),
    }
    
    if _, err := s.cashFlowService.CreateAutomatic(ctx, cashFlow); err != nil {
        // Loguear pero no fallar
        log.WithError(err).WithField("payment_id", paymentID).Error("Failed to create cash flow entry")
        // TODO: Enviar alerta a admins
    }
    
    return pmt, nil
}
```

#### 4.2 Actualizar Wire (Dependency Injection)

**Archivo**: `internal/infrastructure/wire.go`

```go
// Añadir el servicio de cash flow en el orden correcto
func InitializeApplication() (*Application, error) {
    wire.Build(
        // Repositories
        postgres.NewMemberRepository,
        postgres.NewPaymentRepository,
        postgres.NewCashFlowRepository,  // NUEVO
        
        // Services
        member.NewService,
        cashflow.NewService,  // NUEVO - antes de payment
        payment.NewService,   // Ahora depende de cashflow
        
        // GraphQL
        graphql.NewResolver,
        
        // App
        NewApplication,
    )
    return &Application{}, nil
}
```

**Checklist**:
- [ ] Payment service modificado
- [ ] Dependency injection actualizado
- [ ] Tests de integración pagos → cash_flows
- [ ] Manejo de errores robusto
- [ ] Logs estructurados

---

### 🧪 TAREA 5: Testing (2 horas)

#### 5.1 Tests Unitarios del Repository

**Archivo**: `internal/infrastructure/postgres/cashflow_repository_test.go`

```go
package postgres_test

func TestCashFlowRepository_Create(t *testing.T) {
    repo := setupTestRepository(t)
    
    cf := &cashflow.CashFlow{
        OperationType: "GASTO_REPATRIACION",
        Amount:        -1500.00,
        Date:          time.Now(),
        Detail:        "Repatriación Test",
        MemberID:      ptr.Int64(1),
    }
    
    result, err := repo.Create(context.Background(), cf)
    
    assert.NoError(t, err)
    assert.NotNil(t, result)
    assert.Greater(t, result.ID, int64(0))
}

func TestCashFlowRepository_GetBalance(t *testing.T) {
    // [Implementar]
}

// ... más tests
```

#### 5.2 Tests Unitarios del Service

**Archivo**: `internal/application/cashflow/service_test.go`

```go
package cashflow_test

func TestService_Create_AdminOnly(t *testing.T) {
    // Test que solo admin puede crear
}

func TestService_Create_RepatriationRequiresMember(t *testing.T) {
    // Test validación de socio en repatriaciones
}

func TestService_CreateAutomatic_Idempotent(t *testing.T) {
    // Test que no se puede crear dos veces para mismo payment_id
}

// ... más tests
```

#### 5.3 Tests de Integración GraphQL

**Archivo**: `internal/graphql/resolvers/cashflow_test.go`

```go
package resolvers_test

func TestCashFlowQuery_AdminSeesAll(t *testing.T) {
    // Test que admin ve todos los movimientos
}

func TestCashFlowQuery_UserSeesOnlyHis(t *testing.T) {
    // Test que user solo ve sus movimientos
}

func TestCreateCashFlow_Mutation(t *testing.T) {
    // Test creación vía GraphQL
}

// ... más tests
```

**Checklist**:
- [ ] Tests unitarios repository (>80% cobertura)
- [ ] Tests unitarios service (>80% cobertura)
- [ ] Tests de integración GraphQL
- [ ] Tests de integración pagos → cash_flows
- [ ] Tests de regresión

---

## ✅ Criterios de Aceptación

### Funcionales

- [ ] **CF-1**: Admin puede crear ingresos manualmente
- [ ] **CF-2**: Admin puede crear gastos manualmente  
- [ ] **CF-3**: Admin puede crear repatriaciones con socio asociado
- [ ] **CF-4**: Repatriaciones tienen 1.500€ por defecto (editable)
- [ ] **CF-5**: Repatriaciones SIN socio son rechazadas
- [ ] **CF-6**: Fechas son obligatorias en todos los casos
- [ ] **CF-7**: User solo ve sus propios movimientos
- [ ] **CF-8**: Admin ve todos los movimientos sin filtrar
- [ ] **CF-9**: Pagos confirmados crean automáticamente ingresos
- [ ] **CF-10**: No se puede crear ingreso duplicado para un payment_id
- [ ] **CF-11**: No se pueden editar ingresos automáticos (con payment_id)
- [ ] **CF-12**: No se pueden eliminar ingresos automáticos
- [ ] **CF-13**: Balance se calcula correctamente (ingresos - gastos)
- [ ] **CF-14**: Balance admin = total, balance user = solo sus movimientos
- [ ] **CF-15**: Estadísticas se generan correctamente por categoría
- [ ] **CF-16**: Soft delete funciona correctamente

### Técnicos

- [ ] **CT-1**: Schema GraphQL completo y validado
- [ ] **CT-2**: Resolvers implementados con filtrado automático
- [ ] **CT-3**: Repository con queries optimizadas
- [ ] **CT-4**: Índices en BD creados correctamente
- [ ] **CT-5**: Constraint único en payment_id
- [ ] **CT-6**: Service con todas las validaciones
- [ ] **CT-7**: Integración con payments funcional
- [ ] **CT-8**: Dependency injection configurada
- [ ] **CT-9**: Tests con >75% cobertura
- [ ] **CT-10**: Logs estructurados en todas las operaciones
- [ ] **CT-11**: Manejo robusto de errores
- [ ] **CT-12**: Documentación API actualizada

### Performance

- [ ] **CP-1**: Query de listado con paginación
- [ ] **CP-2**: Query de balance < 100ms
- [ ] **CP-3**: Query de estadísticas < 500ms
- [ ] **CP-4**: Índices correctos en tabla cash_flows

---

## 🧪 Testing

### Plan de Testing

#### Tests Unitarios (2-3 días)

**Repository**:
```
✅ Create
✅ GetByID
✅ Update
✅ SoftDelete
✅ List con filtros
✅ GetBalance
✅ GetStats
✅ ExistsByPaymentID
```

**Service**:
```
✅ Create con validaciones
✅ CreateAutomatic idempotente
✅ Update solo para manuales
✅ Delete solo para manuales
✅ Validación repatriaciones
✅ Validación signos amount
✅ Control de acceso por rol
```

**GraphQL Resolvers**:
```
✅ cashFlows con filtrado por rol
✅ cashFlowBalance por rol
✅ cashFlowStats por rol
✅ createCashFlow solo admin
✅ updateCashFlow solo admin
✅ deleteCashFlow solo admin
```

#### Tests de Integración

**Flujo completo pagos → cash_flows**:
```go
func TestPaymentConfirmation_CreatesAutomaticIncome(t *testing.T) {
    // 1. Crear pago PENDING
    payment := createTestPayment(t, "PENDING")
    
    // 2. Confirmar pago
    confirmedPayment, err := paymentService.ConfirmPayment(ctx, payment.ID, input)
    assert.NoError(t, err)
    
    // 3. Verificar que se creó cash_flow automático
    cashFlow, err := cashFlowRepo.GetByPaymentID(ctx, payment.ID)
    assert.NoError(t, err)
    assert.NotNil(t, cashFlow)
    assert.Equal(t, "INGRESO_CUOTA", cashFlow.OperationType)
    assert.Equal(t, confirmedPayment.Amount, cashFlow.Amount)
    assert.NotNil(t, cashFlow.PaymentID)
}
```

### Testing en Entornos

```
1. Local (desarrollo):
   - Tests unitarios en cada commit
   - Tests de integración en cada PR

2. Staging:
   - Tests E2E con datos de prueba
   - Verificación de performance
   - Pruebas de carga ligera

3. Producción:
   - Smoke tests post-deploy
   - Monitoring activo de errores
   - Alertas configuradas
```

---

## 📚 Referencias

### Documentación

- [Roadmap completo](/docs/ROADMAP.md) - FASE 4
- [Guía estratégica PWA](/docs/Construyendo_para_la_Comunidad_y_la_Confianza__Una_Guía_Estratégica_para_el_Desarrollo_de_la_Aplicación_Web_Progresiva_de_Mutua_ASAM.md)
- [Schema GraphQL existente](/internal/graphql/schema/*.graphql)
- [Arquitectura del proyecto](/docs/ARCHITECTURE.md)

### Dependencias

```go
// go.mod
github.com/99designs/gqlgen v0.17.x
github.com/lib/pq v1.10.x
github.com/sirupsen/logrus v1.9.x
```

### SQL Inicial

```sql
-- Crear constraint único
ALTER TABLE cash_flows
ADD CONSTRAINT unique_payment_id_active
UNIQUE (payment_id) WHERE deleted_at IS NULL;

-- Verificar índices
CREATE INDEX IF NOT EXISTS idx_cashflows_member ON cash_flows(member_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_cashflows_date ON cash_flows(date) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_cashflows_type ON cash_flows(operation_type) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_cashflows_payment ON cash_flows(payment_id) WHERE deleted_at IS NULL;
```

---

## 📞 Contacto y Soporte

**Equipo Frontend**: Javier Fernández  
**Documentación**: `/Users/javierfernandezcabanas/repos/asam-frontend/docs/`  
**Repositorio**: `asam-backend`

**Próximos Pasos tras Completar**:
1. Actualizar documentación API
2. Generar cliente GraphQL para frontend
3. Notificar a equipo frontend para iniciar implementación
4. Deploy a staging para testing integrado

---

**Fecha de entrega estimada**: 4 de noviembre de 2025  
**Estado**: 🔴 PENDIENTE DE IMPLEMENTACIÓN  
**Aprobado por**: [Pendiente]

---

## 📝 Changelog

| Fecha | Versión | Cambios |
|-------|---------|---------|
| 2/11/2025 | 1.0 | Documento inicial creado |
