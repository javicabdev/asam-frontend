# 🔴 REQUISITOS BACKEND - INFORME DE MOROSOS

**Fecha de creación**: 6 de noviembre de 2025  
**Prioridad**: ALTA  
**Tiempo estimado**: 0.5 - 1 día  
**Responsable**: Equipo Backend

---

## 📋 CONTEXTO

El frontend necesita implementar un **Informe de Morosos** que muestre:
- Socios con pagos pendientes (estado `PENDING`)
- Antigüedad de la deuda (días desde que se generó el pago)
- Importe total pendiente por socio
- Última fecha de pago realizado (estado `PAID`)
- Datos del socio para contacto

**Modelo de Negocio Confirmado**:
- ✅ **Todos los pagos son en EFECTIVO** (campo `payment_method` siempre es `CASH`)
- ✅ Los pagos tienen **solo dos estados relevantes**: `PENDING` (pendiente) y `PAID` (pagado)
- ✅ Los pagos están asociados a **socios individuales** (`member_id`) o a **familias** (`family_id`)

---

## 🎯 OBJETIVO

Crear una **Query GraphQL** que devuelva la lista de socios morosos con toda la información necesaria para que el frontend pueda:
1. Mostrar una tabla con los morosos
2. Filtrar por diferentes criterios
3. Exportar a PDF/CSV
4. Calcular totales y estadísticas

---

## 📊 ESTRUCTURA DE DATOS EXISTENTE

### Tabla `payments`
```sql
payments
├── id (PK)
├── member_id (FK, nullable)
├── family_id (FK, nullable)
├── amount (numeric)
├── payment_method (varchar) → Siempre "CASH"
├── status (varchar) → "PENDING" | "PAID" | "CANCELLED"
├── payment_date (timestamp, nullable)
├── receipt_number (varchar, nullable)
├── notes (text, nullable)
├── created_at (timestamp)
├── updated_at (timestamp)
└── deleted_at (timestamp, soft delete)
```

### Tabla `members`
```sql
members
├── id (PK)
├── member_number (varchar, unique)
├── first_name (varchar)
├── last_name (varchar)
├── email (varchar)
├── phone (varchar)
├── status (varchar) → "ACTIVE" | "INACTIVE"
├── family_id (FK, nullable)
├── created_at (timestamp)
└── ...
```

### Tabla `families`
```sql
families
├── id (PK)
├── family_name (varchar)
├── primary_member_id (FK)
├── created_at (timestamp)
└── ...
```

---

## 🔧 REQUISITOS TÉCNICOS

### 1. Query GraphQL: `getDelinquentReport`

**Ubicación sugerida**: `internal/graphql/schema/reports.graphql`

```graphql
"""
Query para obtener el informe de socios morosos.
Retorna socios con pagos pendientes y estadísticas de morosidad.
"""
type Query {
  getDelinquentReport(
    input: DelinquentReportInput
  ): DelinquentReportResponse!
}

"""
Parámetros de entrada para el informe de morosos
"""
input DelinquentReportInput {
  """
  Fecha de corte para calcular la antigüedad de la deuda.
  Si no se proporciona, se usa la fecha actual.
  """
  cutoffDate: Time
  
  """
  Importe mínimo de deuda para incluir en el informe.
  Útil para filtrar deudas pequeñas.
  Default: 0
  """
  minAmount: Float
  
  """
  Filtrar solo por socios individuales o familias
  Valores: "INDIVIDUAL" | "FAMILY" | null (ambos)
  """
  debtorType: String
  
  """
  Ordenamiento de resultados
  Valores: "AMOUNT_DESC" | "AMOUNT_ASC" | "DAYS_DESC" | "DAYS_ASC" | "NAME_ASC"
  Default: "DAYS_DESC" (más antiguas primero)
  """
  sortBy: String
}

"""
Respuesta del informe de morosos
"""
type DelinquentReportResponse {
  """
  Lista de deudores (socios o familias)
  """
  debtors: [Debtor!]!
  
  """
  Estadísticas generales del informe
  """
  summary: DelinquentSummary!
  
  """
  Fecha en que se generó el informe
  """
  generatedAt: Time!
}

"""
Representa un deudor (socio o familia)
"""
type Debtor {
  """
  ID del socio (si es deuda individual)
  """
  memberId: ID
  
  """
  ID de la familia (si es deuda familiar)
  """
  familyId: ID
  
  """
  Tipo de deudor: "INDIVIDUAL" o "FAMILY"
  """
  type: String!
  
  """
  Información del socio (si es individual)
  """
  member: DebtorMemberInfo
  
  """
  Información de la familia (si es familiar)
  """
  family: DebtorFamilyInfo
  
  """
  Lista de pagos pendientes
  """
  pendingPayments: [PendingPayment!]!
  
  """
  Importe total pendiente (suma de todos los pagos pendientes)
  """
  totalDebt: Float!
  
  """
  Días de atraso del pago más antiguo
  """
  oldestDebtDays: Int!
  
  """
  Fecha del pago pendiente más antiguo
  """
  oldestDebtDate: Time!
  
  """
  Última fecha en que este socio/familia realizó un pago exitoso
  """
  lastPaymentDate: Time
  
  """
  Importe del último pago realizado
  """
  lastPaymentAmount: Float
}

"""
Información básica del socio para el informe
"""
type DebtorMemberInfo {
  id: ID!
  memberNumber: String!
  firstName: String!
  lastName: String!
  email: String
  phone: String
  status: String!
}

"""
Información básica de la familia para el informe
"""
type DebtorFamilyInfo {
  id: ID!
  familyName: String!
  primaryMember: DebtorMemberInfo!
  totalMembers: Int!
}

"""
Información de un pago pendiente
"""
type PendingPayment {
  id: ID!
  amount: Float!
  createdAt: Time!
  daysOverdue: Int!
  notes: String
}

"""
Resumen estadístico del informe
"""
type DelinquentSummary {
  """
  Número total de deudores
  """
  totalDebtors: Int!
  
  """
  Número de socios individuales con deuda
  """
  individualDebtors: Int!
  
  """
  Número de familias con deuda
  """
  familyDebtors: Int!
  
  """
  Importe total de todas las deudas
  """
  totalDebtAmount: Float!
  
  """
  Promedio de días de atraso
  """
  averageDaysOverdue: Int!
  
  """
  Deuda promedio por deudor
  """
  averageDebtPerDebtor: Float!
}
```

---

### 2. Lógica de Negocio

**Archivo sugerido**: `internal/services/reports/delinquent_service.go`

#### 2.1 Algoritmo de Cálculo

```go
// Pseudocódigo del algoritmo principal

func GetDelinquentReport(ctx context.Context, input DelinquentReportInput) (*DelinquentReportResponse, error) {
    // 1. Establecer fecha de corte (default: hoy)
    cutoffDate := input.CutoffDate
    if cutoffDate.IsZero() {
        cutoffDate = time.Now()
    }
    
    // 2. Obtener todos los pagos PENDIENTES
    pendingPayments := repo.GetPaymentsByStatus(ctx, "PENDING")
    
    // 3. Agrupar pagos por deudor (member_id o family_id)
    debtorMap := make(map[string]*Debtor)
    
    for _, payment := range pendingPayments {
        // Determinar el tipo de deudor
        var debtorKey string
        var debtorType string
        
        if payment.MemberID != nil {
            debtorKey = fmt.Sprintf("member_%d", *payment.MemberID)
            debtorType = "INDIVIDUAL"
        } else if payment.FamilyID != nil {
            debtorKey = fmt.Sprintf("family_%d", *payment.FamilyID)
            debtorType = "FAMILY"
        } else {
            // Skip pagos sin member_id ni family_id (datos inconsistentes)
            continue
        }
        
        // Si el deudor no existe en el map, crearlo
        if _, exists := debtorMap[debtorKey]; !exists {
            debtor := &Debtor{
                Type: debtorType,
                PendingPayments: []PendingPayment{},
                TotalDebt: 0,
            }
            
            // Cargar información del socio o familia
            if debtorType == "INDIVIDUAL" {
                member := repo.GetMemberByID(ctx, *payment.MemberID)
                debtor.MemberID = &member.ID
                debtor.Member = &DebtorMemberInfo{
                    ID: member.ID,
                    MemberNumber: member.MemberNumber,
                    FirstName: member.FirstName,
                    LastName: member.LastName,
                    Email: member.Email,
                    Phone: member.Phone,
                    Status: member.Status,
                }
                
                // Obtener último pago PAID de este socio
                lastPaid := repo.GetLastPaidPaymentForMember(ctx, *payment.MemberID)
                if lastPaid != nil {
                    debtor.LastPaymentDate = &lastPaid.PaymentDate
                    debtor.LastPaymentAmount = &lastPaid.Amount
                }
            } else {
                family := repo.GetFamilyByID(ctx, *payment.FamilyID)
                debtor.FamilyID = &family.ID
                debtor.Family = &DebtorFamilyInfo{
                    ID: family.ID,
                    FamilyName: family.FamilyName,
                    PrimaryMember: getPrimaryMemberInfo(ctx, family.PrimaryMemberID),
                    TotalMembers: len(family.Members),
                }
                
                // Obtener último pago PAID de esta familia
                lastPaid := repo.GetLastPaidPaymentForFamily(ctx, *payment.FamilyID)
                if lastPaid != nil {
                    debtor.LastPaymentDate = &lastPaid.PaymentDate
                    debtor.LastPaymentAmount = &lastPaid.Amount
                }
            }
            
            debtorMap[debtorKey] = debtor
        }
        
        // Añadir el pago pendiente al deudor
        daysOverdue := int(cutoffDate.Sub(payment.CreatedAt).Hours() / 24)
        
        debtorMap[debtorKey].PendingPayments = append(
            debtorMap[debtorKey].PendingPayments,
            PendingPayment{
                ID: payment.ID,
                Amount: payment.Amount,
                CreatedAt: payment.CreatedAt,
                DaysOverdue: daysOverdue,
                Notes: payment.Notes,
            },
        )
        
        debtorMap[debtorKey].TotalDebt += payment.Amount
        
        // Actualizar el pago más antiguo
        if debtorMap[debtorKey].OldestDebtDate.IsZero() || 
           payment.CreatedAt.Before(debtorMap[debtorKey].OldestDebtDate) {
            debtorMap[debtorKey].OldestDebtDate = payment.CreatedAt
            debtorMap[debtorKey].OldestDebtDays = daysOverdue
        }
    }
    
    // 4. Convertir map a slice
    debtors := make([]*Debtor, 0, len(debtorMap))
    for _, debtor := range debtorMap {
        debtors = append(debtors, debtor)
    }
    
    // 5. Aplicar filtros
    debtors = applyFilters(debtors, input)
    
    // 6. Ordenar según input.SortBy
    debtors = sortDebtors(debtors, input.SortBy)
    
    // 7. Calcular resumen estadístico
    summary := calculateSummary(debtors)
    
    // 8. Retornar respuesta
    return &DelinquentReportResponse{
        Debtors: debtors,
        Summary: summary,
        GeneratedAt: time.Now(),
    }, nil
}
```

#### 2.2 Funciones Auxiliares

```go
// Aplicar filtros según input
func applyFilters(debtors []*Debtor, input DelinquentReportInput) []*Debtor {
    filtered := make([]*Debtor, 0)
    
    for _, debtor := range debtors {
        // Filtro por importe mínimo
        if input.MinAmount > 0 && debtor.TotalDebt < input.MinAmount {
            continue
        }
        
        // Filtro por tipo de deudor
        if input.DebtorType != "" && debtor.Type != input.DebtorType {
            continue
        }
        
        filtered = append(filtered, debtor)
    }
    
    return filtered
}

// Ordenar deudores según criterio
func sortDebtors(debtors []*Debtor, sortBy string) []*Debtor {
    switch sortBy {
    case "AMOUNT_DESC":
        sort.Slice(debtors, func(i, j int) bool {
            return debtors[i].TotalDebt > debtors[j].TotalDebt
        })
    case "AMOUNT_ASC":
        sort.Slice(debtors, func(i, j int) bool {
            return debtors[i].TotalDebt < debtors[j].TotalDebt
        })
    case "DAYS_ASC":
        sort.Slice(debtors, func(i, j int) bool {
            return debtors[i].OldestDebtDays < debtors[j].OldestDebtDays
        })
    case "NAME_ASC":
        sort.Slice(debtors, func(i, j int) bool {
            name1 := getDebtorName(debtors[i])
            name2 := getDebtorName(debtors[j])
            return name1 < name2
        })
    default: // "DAYS_DESC" (default)
        sort.Slice(debtors, func(i, j int) bool {
            return debtors[i].OldestDebtDays > debtors[j].OldestDebtDays
        })
    }
    
    return debtors
}

// Calcular resumen estadístico
func calculateSummary(debtors []*Debtor) DelinquentSummary {
    summary := DelinquentSummary{
        TotalDebtors: len(debtors),
        TotalDebtAmount: 0,
        IndividualDebtors: 0,
        FamilyDebtors: 0,
        AverageDaysOverdue: 0,
    }
    
    totalDays := 0
    
    for _, debtor := range debtors {
        summary.TotalDebtAmount += debtor.TotalDebt
        totalDays += debtor.OldestDebtDays
        
        if debtor.Type == "INDIVIDUAL" {
            summary.IndividualDebtors++
        } else {
            summary.FamilyDebtors++
        }
    }
    
    if len(debtors) > 0 {
        summary.AverageDaysOverdue = totalDays / len(debtors)
        summary.AverageDebtPerDebtor = summary.TotalDebtAmount / float64(len(debtors))
    }
    
    return summary
}

func getDebtorName(debtor *Debtor) string {
    if debtor.Type == "INDIVIDUAL" && debtor.Member != nil {
        return fmt.Sprintf("%s %s", debtor.Member.FirstName, debtor.Member.LastName)
    } else if debtor.Type == "FAMILY" && debtor.Family != nil {
        return debtor.Family.FamilyName
    }
    return ""
}
```

---

### 3. Queries SQL Necesarias

**Archivo sugerido**: `internal/repositories/reports/queries.go`

```go
// GetPendingPayments retorna todos los pagos con estado PENDING
const getPendingPaymentsQuery = `
    SELECT 
        id, member_id, family_id, amount, 
        payment_method, status, payment_date, 
        receipt_number, notes, created_at, updated_at
    FROM payments
    WHERE status = 'PENDING'
      AND deleted_at IS NULL
    ORDER BY created_at ASC
`

// GetLastPaidPaymentForMember retorna el último pago PAID de un socio
const getLastPaidPaymentForMemberQuery = `
    SELECT 
        id, amount, payment_date, created_at
    FROM payments
    WHERE member_id = $1
      AND status = 'PAID'
      AND deleted_at IS NULL
    ORDER BY payment_date DESC
    LIMIT 1
`

// GetLastPaidPaymentForFamily retorna el último pago PAID de una familia
const getLastPaidPaymentForFamilyQuery = `
    SELECT 
        id, amount, payment_date, created_at
    FROM payments
    WHERE family_id = $1
      AND status = 'PAID'
      AND deleted_at IS NULL
    ORDER BY payment_date DESC
    LIMIT 1
`

// GetMemberByID retorna información completa de un socio
const getMemberByIDQuery = `
    SELECT 
        id, member_number, first_name, last_name,
        email, phone, status, family_id, created_at
    FROM members
    WHERE id = $1
      AND deleted_at IS NULL
`

// GetFamilyByID retorna información completa de una familia
const getFamilyByIDQuery = `
    SELECT 
        f.id, f.family_name, f.primary_member_id, f.created_at,
        COUNT(m.id) as total_members
    FROM families f
    LEFT JOIN members m ON m.family_id = f.id AND m.deleted_at IS NULL
    WHERE f.id = $1
      AND f.deleted_at IS NULL
    GROUP BY f.id, f.family_name, f.primary_member_id, f.created_at
`
```

---

### 4. Permisos y Seguridad

**Reglas de Autorización:**

```go
// En el resolver de getDelinquentReport:

func (r *queryResolver) GetDelinquentReport(
    ctx context.Context, 
    input *DelinquentReportInput,
) (*DelinquentReportResponse, error) {
    user := middleware.GetUserFromContext(ctx)
    
    // SOLO ADMIN puede acceder a este informe
    if user.Role != "admin" {
        return nil, errors.New("unauthorized: only admin can access delinquent report")
    }
    
    // Proceder con la lógica...
    return r.reportService.GetDelinquentReport(ctx, input)
}
```

**Justificación:**
- Este informe contiene información sensible (deudas de socios)
- Solo los administradores deben tener acceso a esta información
- Los usuarios normales no necesitan ver quién está en mora

---

## 🧪 CASOS DE PRUEBA

### Caso 1: Socio con un único pago pendiente

**Input:**
```
Payments:
  - ID: 1, member_id: 10, amount: 40.00, status: PENDING, created_at: 2025-10-01
```

**Output esperado:**
```json
{
  "debtors": [
    {
      "memberId": "10",
      "type": "INDIVIDUAL",
      "member": {
        "id": "10",
        "memberNumber": "A00010",
        "firstName": "Papa",
        "lastName": "Diop"
      },
      "pendingPayments": [
        {
          "id": "1",
          "amount": 40.00,
          "daysOverdue": 36
        }
      ],
      "totalDebt": 40.00,
      "oldestDebtDays": 36,
      "lastPaymentDate": null
    }
  ],
  "summary": {
    "totalDebtors": 1,
    "totalDebtAmount": 40.00,
    "averageDaysOverdue": 36
  }
}
```

---

### Caso 2: Socio con múltiples pagos pendientes

**Input:**
```
Payments:
  - ID: 1, member_id: 10, amount: 40.00, status: PENDING, created_at: 2025-09-01
  - ID: 2, member_id: 10, amount: 40.00, status: PENDING, created_at: 2025-10-01
  - ID: 3, member_id: 10, amount: 80.00, status: PAID, payment_date: 2025-08-15
```

**Output esperado:**
```json
{
  "debtors": [
    {
      "memberId": "10",
      "totalDebt": 80.00,
      "oldestDebtDays": 66,
      "lastPaymentDate": "2025-08-15",
      "lastPaymentAmount": 80.00,
      "pendingPayments": [
        {
          "id": "1",
          "amount": 40.00,
          "daysOverdue": 66
        },
        {
          "id": "2",
          "amount": 40.00,
          "daysOverdue": 36
        }
      ]
    }
  ]
}
```

---

### Caso 3: Familia con pago pendiente

**Input:**
```
Payments:
  - ID: 5, family_id: 3, amount: 120.00, status: PENDING, created_at: 2025-10-15

Families:
  - ID: 3, family_name: "Familia Diallo", primary_member_id: 15, total_members: 4
```

**Output esperado:**
```json
{
  "debtors": [
    {
      "familyId": "3",
      "type": "FAMILY",
      "family": {
        "id": "3",
        "familyName": "Familia Diallo",
        "primaryMember": {
          "id": "15",
          "firstName": "Amadou",
          "lastName": "Diallo"
        },
        "totalMembers": 4
      },
      "totalDebt": 120.00,
      "oldestDebtDays": 22
    }
  ]
}
```

---

### Caso 4: Filtro por importe mínimo

**Input:**
```
minAmount: 50.00

Debtors:
  - member_id: 10, totalDebt: 40.00
  - member_id: 11, totalDebt: 80.00
  - member_id: 12, totalDebt: 120.00
```

**Output esperado:**
```
Solo deben retornarse los socios 11 y 12 (deuda >= 50€)
```

---

### Caso 5: Ordenamiento por días de atraso (descendente)

**Input:**
```
sortBy: "DAYS_DESC"

Debtors:
  - member_id: 10, oldestDebtDays: 30
  - member_id: 11, oldestDebtDays: 60
  - member_id: 12, oldestDebtDays: 45
```

**Output esperado:**
```
Orden: member_id 11 (60 días), member_id 12 (45 días), member_id 10 (30 días)
```

---

## 📝 CHECKLIST DE IMPLEMENTACIÓN

### Backend GraphQL
- [ ] Crear archivo `internal/graphql/schema/reports.graphql`
- [ ] Definir tipos `DelinquentReportInput`, `DelinquentReportResponse`, `Debtor`, etc.
- [ ] Añadir query `getDelinquentReport` al schema principal

### Backend Service Layer
- [ ] Crear archivo `internal/services/reports/delinquent_service.go`
- [ ] Implementar función `GetDelinquentReport()`
- [ ] Implementar funciones auxiliares: `applyFilters()`, `sortDebtors()`, `calculateSummary()`

### Backend Repository Layer
- [ ] Crear archivo `internal/repositories/reports/queries.go`
- [ ] Implementar query `GetPendingPayments()`
- [ ] Implementar query `GetLastPaidPaymentForMember()`
- [ ] Implementar query `GetLastPaidPaymentForFamily()`

### Backend Resolver
- [ ] Crear archivo `internal/graphql/resolvers/reports.resolvers.go`
- [ ] Implementar resolver `GetDelinquentReport()`
- [ ] Añadir validación de permisos (solo admin)

### Testing
- [ ] Tests unitarios para `delinquent_service.go`
- [ ] Tests de los 5 casos de prueba descritos
- [ ] Tests de permisos (admin vs user)

### Documentación
- [ ] Actualizar GraphQL Playground con query de ejemplo
- [ ] Documentar respuestas de error posibles
- [ ] Añadir ejemplos de uso en README

---

## 🚀 CRITERIOS DE ACEPTACIÓN

1. **Funcionalidad:**
   - ✅ Query GraphQL retorna lista de deudores correctamente
   - ✅ Calcula días de atraso desde `created_at` del pago
   - ✅ Agrupa múltiples pagos pendientes por socio/familia
   - ✅ Incluye información de último pago realizado
   - ✅ Estadísticas generales son correctas

2. **Filtros:**
   - ✅ Filtro por `minAmount` funciona
   - ✅ Filtro por `debtorType` funciona
   - ✅ Fecha de corte es configurable

3. **Ordenamiento:**
   - ✅ Ordenar por importe (ASC/DESC)
   - ✅ Ordenar por días (ASC/DESC)
   - ✅ Ordenar por nombre (ASC)

4. **Seguridad:**
   - ✅ Solo admin puede acceder
   - ✅ User recibe error 403/Unauthorized

5. **Rendimiento:**
   - ✅ Query responde en < 1 segundo con 1000 pagos pendientes
   - ✅ No hay N+1 queries

---

## 📚 REFERENCIAS

- Modelo de datos: `/asam-backend/docs/database/schema.sql`
- GraphQL existente: `/asam-backend/internal/graphql/schema/`
- Servicios existentes: `/asam-backend/internal/services/`

---

**Próximo paso**: Una vez implementado este backend, el equipo de frontend podrá consumir la query `getDelinquentReport` para construir la interfaz de usuario.

---

**Fecha de entrega estimada**: 1 día (0.5 días si se prioriza)  
**Revisor**: Tech Lead Backend  
**Aprobación**: Product Owner
