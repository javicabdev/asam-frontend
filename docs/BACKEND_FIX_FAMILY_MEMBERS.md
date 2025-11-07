# 🔧 Corrección Requerida - Identificación de Socios Familiares

**Fecha**: 7 de noviembre de 2025
**Prioridad**: ALTA
**Afecta a**: Informe de Morosos
**Módulo**: Backend GraphQL

---

## 🎯 Problema Identificado

**Los socios familiares NO se están contabilizando correctamente** en el informe de morosos.

### Estado Actual (Incorrecto):
- Los socios individuales se cuentan correctamente
- Los socios familiares NO se están identificando como tal
- El tipo de deudor se muestra incorrectamente

### Comportamiento Esperado:
- Socio familiar → `type: "FAMILY"`
- Socio individual → `type: "INDIVIDUAL"`

---

## 🔍 Causa Raíz

El backend necesita **diferenciar correctamente entre socios individuales y familiares** al generar el informe.

### Métodos de Identificación:

#### Método 1: Campo `membership` (RECOMENDADO)
La tabla `members` tiene un campo `membership` que indica el tipo de membresía:
- `membership = 'FAMILY'` → Socio familiar
- `membership = 'INDIVIDUAL'` → Socio individual

#### Método 2: Prefijo del número de socio (Temporal)
Como alternativa temporal:
- Número de socio empieza por `'A'` → Socio familiar
- Otros prefijos → Socio individual

**⚠️ Advertencia**: El Método 2 es menos robusto y puede fallar si la convención cambia.

---

## 📝 Cambios Requeridos en el Backend

### 1. Añadir campo `membership` al schema GraphQL

**Modificar el tipo `DebtorMemberInfo`**:

```graphql
type DebtorMemberInfo {
  id: ID!
  memberNumber: String!
  firstName: String!
  lastName: String!
  email: String
  phone: String
  status: String!
  membership: MembershipType!  # ← AÑADIR ESTE CAMPO
}

enum MembershipType {
  INDIVIDUAL
  FAMILY
}
```

### 2. Actualizar el resolver `getDelinquentReport`

**Lógica actual (incorrecta)**:
```typescript
// Todos los socios se marcan como INDIVIDUAL
debtors.map(debtor => ({
  ...debtor,
  type: 'INDIVIDUAL',  // ❌ Siempre individual
}))
```

**Lógica corregida**:
```typescript
// Usar el campo membership de la base de datos
const debtors = await this.getDelinquentMembers()

return debtors.map(debtor => {
  // Verificar si es socio familiar
  const isFamilyMember = debtor.member?.membership === 'FAMILY'

  // O usar el prefijo como alternativa temporal:
  // const isFamilyMember = debtor.member?.memberNumber.startsWith('A')

  return {
    ...debtor,
    type: isFamilyMember ? 'FAMILY' : 'INDIVIDUAL',

    // Si es familiar, incluir info de familia
    family: isFamilyMember ? {
      id: debtor.familyId,
      familyName: debtor.familyName,
      primaryMember: debtor.member,
      totalMembers: debtor.familySize || 1,
    } : null,

    // Si es individual, member ya está incluido
    member: !isFamilyMember ? debtor.member : null,
  }
})
```

### 3. Recalcular el resumen (summary)

El `summary` también debe corregirse:

```typescript
const summary = {
  totalDebtors: debtors.length,

  // Contar correctamente familiares vs individuales
  familyDebtors: debtors.filter(d => d.type === 'FAMILY').length,
  individualDebtors: debtors.filter(d => d.type === 'INDIVIDUAL').length,

  totalDebtAmount: debtors.reduce((sum, d) => sum + d.totalDebt, 0),
  averageDaysOverdue: Math.round(
    debtors.reduce((sum, d) => sum + d.oldestDebtDays, 0) / debtors.length
  ),
  averageDebtPerDebtor: totalDebtAmount / debtors.length,
}
```

---

## 🧪 Casos de Prueba

### Caso 1: Socio Familiar
**Número de socio**: `A001`
**Campo membership**: `'FAMILY'`

**Respuesta esperada**:
```json
{
  "memberId": null,
  "familyId": "family-123",
  "type": "FAMILY",
  "member": null,
  "family": {
    "id": "family-123",
    "familyName": "Familia García",
    "primaryMember": {
      "id": "member-456",
      "memberNumber": "A001",
      "firstName": "Juan",
      "lastName": "García",
      "membership": "FAMILY"
    },
    "totalMembers": 4
  },
  "totalDebt": 150.00,
  ...
}
```

### Caso 2: Socio Individual
**Número de socio**: `SOCIO001`
**Campo membership**: `'INDIVIDUAL'`

**Respuesta esperada**:
```json
{
  "memberId": "member-789",
  "familyId": null,
  "type": "INDIVIDUAL",
  "member": {
    "id": "member-789",
    "memberNumber": "SOCIO001",
    "firstName": "María",
    "lastName": "López",
    "membership": "INDIVIDUAL"
  },
  "family": null,
  "totalDebt": 50.00,
  ...
}
```

### Caso 3: Summary con mix
**Datos**: 3 familiares + 5 individuales = 8 total

**Summary esperado**:
```json
{
  "totalDebtors": 8,
  "familyDebtors": 3,
  "individualDebtors": 5,
  "totalDebtAmount": 600.00,
  "averageDaysOverdue": 45,
  "averageDebtPerDebtor": 75.00
}
```

---

## ✅ Checklist de Implementación

### Backend:
- [ ] Añadir campo `membership` a tipo `DebtorMemberInfo` en schema
- [ ] Crear enum `MembershipType` si no existe
- [ ] Actualizar resolver para leer campo `membership` de la BD
- [ ] Corregir lógica de asignación de `type` (FAMILY vs INDIVIDUAL)
- [ ] Asignar correctamente `family` cuando type = FAMILY
- [ ] Asignar correctamente `member` cuando type = INDIVIDUAL
- [ ] Recalcular `familyDebtors` e `individualDebtors` en summary
- [ ] Ejecutar tests con datos mixtos
- [ ] Verificar que el summary suma correctamente

### Frontend (después del fix):
- [ ] Ejecutar `npm run codegen` para regenerar tipos
- [ ] Verificar que los tipos TypeScript se actualizan
- [ ] Probar con datos reales (familiares + individuales)
- [ ] Verificar que los chips muestran el tipo correcto
- [ ] Verificar que las tarjetas de resumen suman bien
- [ ] Verificar exportación PDF/CSV con tipos correctos

---

## 📊 Impacto

### Sin corrección:
- ❌ Todos los morosos aparecen como "Individual"
- ❌ El contador de familias siempre muestra 0
- ❌ No se puede filtrar por tipo correctamente
- ❌ Las estadísticas son incorrectas

### Con corrección:
- ✅ Diferenciación clara entre socios individuales y familiares
- ✅ Contadores correctos en las tarjetas de resumen
- ✅ Filtros funcionan correctamente
- ✅ Exportaciones PDF/CSV muestran el tipo correcto
- ✅ Estadísticas precisas

---

## 🔗 Archivos Relacionados

### Backend:
- Schema GraphQL: Añadir campo `membership`
- Resolver: `getDelinquentReport`
- Modelo: `members` tabla (campo `membership`)

### Frontend (no requiere cambios):
- `src/graphql/operations/reports.graphql` - Query ya lista
- `src/features/reports/components/DebtorTypeChip.tsx` - Ya maneja ambos tipos
- `src/features/reports/types.ts` - Tipos compatibles

---

## 📞 Coordinación

**Timeline esperado**: 1-2 horas
**Bloqueante**: No, pero afecta precisión de datos

**Notificar al frontend cuando**:
1. Se añada el campo `membership` al schema
2. Se corrija la lógica del resolver
3. Esté listo para probar

**Frontend hará**:
1. Regenerar tipos con `npm run codegen`
2. Probar con datos mixtos
3. Validar contadores y filtros
4. Reportar si hay inconsistencias

---

## 🎯 Resultado Esperado

Después del fix, al acceder a `/reports`:

**Tarjetas de resumen**:
```
Total Morosos: 8
Socios Individuales: 5  ← Correcto (antes mostraba 8)
Familias: 3             ← Correcto (antes mostraba 0)
```

**Tabla**:
- Socios con número A001, A002, A003 → Chip "Familia" 👥
- Socios con número SOCIO001, SOCIO002, etc. → Chip "Individual" 👤

**Filtros**:
- Tipo "Familia" → Muestra solo los 3 familiares
- Tipo "Individual" → Muestra solo los 5 individuales
- Tipo "Todos" → Muestra los 8

---

**Creado**: 7 de noviembre de 2025
**Estado**: Pendiente de implementación en backend
