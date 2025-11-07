# 📋 Petición al Equipo de Backend - Informe de Morosos

**Fecha**: 7 de noviembre de 2025
**Solicitante**: Equipo Frontend
**Prioridad**: ALTA
**Módulo**: Informes / Reports

---

## 🎯 Resumen Ejecutivo

El equipo de Frontend ha completado la implementación del módulo de **Informe de Morosos** al 100%. Necesitamos que el equipo de Backend implemente la query GraphQL correspondiente para poder integrar y probar la funcionalidad completa.

**Estado actual**:
- ✅ Frontend: 100% completado (UI, hooks, utilidades, traducciones)
- ❌ Backend: Pendiente de implementación
- ⚠️ Bloqueante: No podemos probar ni usar el módulo sin la query del backend

---

## 📊 Query GraphQL Requerida

### Nombre de la Query
```graphql
getDelinquentReport(input: DelinquentReportInput): DelinquentReportResponse!
```

### Input Type
```graphql
input DelinquentReportInput {
  cutoffDate: String          # ISO 8601 date (opcional, default: hoy)
  minAmount: Float            # Filtrar deudas >= este monto (opcional)
  debtorType: DebtorType      # INDIVIDUAL | FAMILY | null (todos)
  sortBy: SortBy              # Criterio de ordenación (opcional)
}

enum DebtorType {
  INDIVIDUAL
  FAMILY
}

enum SortBy {
  AMOUNT_DESC    # Mayor deuda primero
  AMOUNT_ASC     # Menor deuda primero
  DAYS_DESC      # Más días de atraso primero (default)
  DAYS_ASC       # Menos días de atraso primero
  NAME_ASC       # Orden alfabético por nombre
}
```

### Response Type
```graphql
type DelinquentReportResponse {
  debtors: [Debtor!]!
  summary: DelinquentSummary!
  generatedAt: String!        # ISO 8601 timestamp
}

type Debtor {
  memberId: ID
  familyId: ID
  type: DebtorType!
  member: DebtorMemberInfo
  family: DebtorFamilyInfo
  pendingPayments: [PendingPayment!]!
  totalDebt: Float!
  oldestDebtDays: Int!
  oldestDebtDate: String!     # ISO 8601 date
  lastPaymentDate: String     # ISO 8601 date (nullable)
  lastPaymentAmount: Float    # (nullable)
}

type DebtorMemberInfo {
  id: ID!
  memberNumber: String!
  firstName: String!
  lastName: String!
  email: String
  phone: String
  status: String
}

type DebtorFamilyInfo {
  id: ID!
  familyName: String!
  primaryMember: DebtorMemberInfo!
  totalMembers: Int!
}

type PendingPayment {
  id: ID!
  amount: Float!
  createdAt: String!          # ISO 8601 date
  daysOverdue: Int!
  notes: String
}

type DelinquentSummary {
  totalDebtors: Int!
  individualDebtors: Int!
  familyDebtors: Int!
  totalDebtAmount: Float!
  averageDaysOverdue: Int!
  averageDebtPerDebtor: Float!
}
```

---

## 🔐 Requisitos de Seguridad

### Permisos
- ⚠️ **CRÍTICO**: Solo usuarios con rol `ADMIN` pueden ejecutar esta query
- Debe validarse en el resolver del backend
- Retornar error `403 Forbidden` si el usuario no es admin

### Ejemplo de validación
```typescript
// Pseudocódigo
if (context.user.role !== 'ADMIN') {
  throw new ForbiddenError('Solo administradores pueden acceder a este informe')
}
```

---

## 💡 Lógica de Negocio

### Criterios para considerar un pago "moroso"
1. El pago está en estado `PENDING` o `OVERDUE`
2. La fecha de vencimiento (`dueDate`) es anterior a la fecha de corte (`cutoffDate`)
3. El pago NO ha sido cancelado ni marcado como pagado

### Cálculo de días de atraso
```
daysOverdue = cutoffDate - dueDate
```

### Agrupación por deudor
- Si el pago pertenece a un **socio individual**: agrupar por `memberId`
- Si el pago pertenece a una **familia**: agrupar por `familyId`

### Filtros a aplicar
1. **cutoffDate**: Considerar solo pagos vencidos antes de esta fecha (default: hoy)
2. **minAmount**: Incluir solo deudores con deuda total >= este monto
3. **debtorType**: Filtrar por tipo de deudor (INDIVIDUAL, FAMILY, o todos)
4. **sortBy**: Ordenar resultados según criterio especificado

### Cálculos del resumen (summary)
```typescript
totalDebtors = debtors.length
individualDebtors = debtors.filter(d => d.type === 'INDIVIDUAL').length
familyDebtors = debtors.filter(d => d.type === 'FAMILY').length
totalDebtAmount = sum(debtors.map(d => d.totalDebt))
averageDaysOverdue = avg(debtors.map(d => d.oldestDebtDays))
averageDebtPerDebtor = totalDebtAmount / totalDebtors
```

---

## 📝 Ejemplo de Datos de Respuesta

```json
{
  "data": {
    "getDelinquentReport": {
      "debtors": [
        {
          "memberId": "member-123",
          "familyId": null,
          "type": "INDIVIDUAL",
          "member": {
            "id": "member-123",
            "memberNumber": "SOCIO001",
            "firstName": "Juan",
            "lastName": "García",
            "email": "juan.garcia@example.com",
            "phone": "+34 600 123 456",
            "status": "ACTIVE"
          },
          "family": null,
          "pendingPayments": [
            {
              "id": "payment-456",
              "amount": 50.00,
              "createdAt": "2025-08-01T00:00:00Z",
              "daysOverdue": 98,
              "notes": "Cuota mensual agosto"
            },
            {
              "id": "payment-457",
              "amount": 50.00,
              "createdAt": "2025-09-01T00:00:00Z",
              "daysOverdue": 67,
              "notes": "Cuota mensual septiembre"
            }
          ],
          "totalDebt": 100.00,
          "oldestDebtDays": 98,
          "oldestDebtDate": "2025-08-01T00:00:00Z",
          "lastPaymentDate": "2025-07-15T10:30:00Z",
          "lastPaymentAmount": 50.00
        },
        {
          "memberId": null,
          "familyId": "family-789",
          "type": "FAMILY",
          "member": null,
          "family": {
            "id": "family-789",
            "familyName": "Familia Rodríguez",
            "primaryMember": {
              "id": "member-789",
              "memberNumber": "SOCIO005",
              "firstName": "María",
              "lastName": "Rodríguez",
              "email": "maria.rodriguez@example.com",
              "phone": "+34 600 789 012"
            },
            "totalMembers": 4
          },
          "pendingPayments": [
            {
              "id": "payment-890",
              "amount": 120.00,
              "createdAt": "2025-10-01T00:00:00Z",
              "daysOverdue": 37,
              "notes": "Cuota familiar octubre"
            }
          ],
          "totalDebt": 120.00,
          "oldestDebtDays": 37,
          "oldestDebtDate": "2025-10-01T00:00:00Z",
          "lastPaymentDate": null,
          "lastPaymentAmount": null
        }
      ],
      "summary": {
        "totalDebtors": 2,
        "individualDebtors": 1,
        "familyDebtors": 1,
        "totalDebtAmount": 220.00,
        "averageDaysOverdue": 67,
        "averageDebtPerDebtor": 110.00
      },
      "generatedAt": "2025-11-07T12:30:45Z"
    }
  }
}
```

---

## 🧪 Casos de Prueba Requeridos

### Caso 1: Sin filtros (todos los morosos)
```graphql
query {
  getDelinquentReport {
    debtors { memberId familyId totalDebt }
    summary { totalDebtors totalDebtAmount }
  }
}
```
**Esperado**: Devolver todos los morosos hasta hoy

### Caso 2: Filtro por tipo (solo individuales)
```graphql
query {
  getDelinquentReport(input: { debtorType: INDIVIDUAL }) {
    debtors { type }
    summary { individualDebtors familyDebtors }
  }
}
```
**Esperado**: Solo deudores individuales, familyDebtors = 0

### Caso 3: Filtro por monto mínimo
```graphql
query {
  getDelinquentReport(input: { minAmount: 100 }) {
    debtors { totalDebt }
  }
}
```
**Esperado**: Solo deudores con deuda >= 100€

### Caso 4: Ordenación por deuda descendente
```graphql
query {
  getDelinquentReport(input: { sortBy: AMOUNT_DESC }) {
    debtors { totalDebt }
  }
}
```
**Esperado**: Lista ordenada de mayor a menor deuda

### Caso 5: Sin morosos
```graphql
query {
  getDelinquentReport(input: { minAmount: 999999 }) {
    debtors { id }
    summary { totalDebtors }
  }
}
```
**Esperado**: debtors = [], totalDebtors = 0

### Caso 6: Usuario no admin intenta acceder
```graphql
query {
  getDelinquentReport {
    debtors { id }
  }
}
```
**Esperado**: Error 403 Forbidden

---

## 📚 Referencias de Implementación

### Documentos disponibles
1. **Requisitos Backend**: `docs/backend-requirements/REPORTS-DELINQUENT-BACKEND-REQUIREMENTS.md`
2. **Requisitos Frontend**: `docs/REPORTS-DELINQUENT-FRONTEND-REQUIREMENTS.md`
3. **Estado Implementación**: `docs/REPORTS-IMPLEMENTATION-STATUS.md`

### Query GraphQL frontend
El frontend ya tiene el archivo de query creado:
```
src/graphql/operations/reports.graphql
```

Y el codegen configurado para generar los tipos TypeScript automáticamente al ejecutar:
```bash
npm run codegen
```

---

## ✅ Checklist de Implementación Backend

Para que podamos considerar la implementación completa, por favor verificar:

### Funcionalidad:
- [ ] Query `getDelinquentReport` implementada
- [ ] Resolver retorna datos según schema GraphQL
- [ ] Filtros `cutoffDate`, `minAmount`, `debtorType`, `sortBy` funcionan
- [ ] Cálculos del summary son correctos
- [ ] Manejo de casos edge (sin morosos, sin pagos previos)

### Seguridad:
- [ ] Validación de permisos (solo ADMIN)
- [ ] Error 403 para usuarios sin permiso
- [ ] No exponer información sensible en errores

### Datos:
- [ ] Devuelve información completa del socio/familia
- [ ] Lista de pagos pendientes ordenada por fecha
- [ ] Último pago registrado (si existe)
- [ ] Todos los campos son del tipo correcto (String vs Int vs Float)

### Testing:
- [ ] Tests unitarios del resolver
- [ ] Tests de integración de la query
- [ ] Tests de permisos (admin vs user)
- [ ] Tests con diferentes combinaciones de filtros

---

## 🚀 Timeline Esperado

**Prioridad**: ALTA
**Tiempo estimado**: 4-6 horas de desarrollo + testing
**Bloqueador para**: Testing del módulo de Informes en frontend

**Entregables esperados**:
1. Resolver GraphQL implementado
2. Tests pasando
3. Documentación de la query (si aplica)
4. Notificación al equipo frontend cuando esté listo

---

## 💬 Contacto

Si tienen dudas sobre la especificación o necesitan aclaraciones:
- Revisar documentos de requisitos mencionados arriba
- Consultar con el equipo frontend
- Verificar tipos GraphQL generados en `src/graphql/generated/`

---

## 🎯 Próximos Pasos (Frontend)

Una vez implementada la query, el equipo frontend:
1. Ejecutará `npm run codegen` para regenerar tipos
2. Probará la integración en los 3 idiomas (es, fr, wo)
3. Validará exportación PDF/CSV
4. Verificará comportamiento de filtros
5. Reportará cualquier inconsistencia encontrada

---

**Gracias por su colaboración! 🙏**
El módulo de Informes será una herramienta muy valiosa para la gestión de la asociación.
