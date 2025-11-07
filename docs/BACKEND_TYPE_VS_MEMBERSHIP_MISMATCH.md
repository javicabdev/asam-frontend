# 🚨 URGENTE: Inconsistencia entre `type` y `membership` en la Respuesta

**Fecha**: 7 de noviembre de 2025
**Prioridad**: ~~CRÍTICA~~ **✅ RESUELTO**
**Problema**: ~~El campo `membership` se está enviando pero NO se está usando para calcular el `type`~~ **SOLUCIONADO**

---

## 🎯 Problema Detectado

**Ejemplo real**: Pedro López Fernández
- En la lista de miembros: Aparece como **socio familiar** ✓
- En el informe de morosos: Aparece como **Individual** ❌

**Causa**: El backend está enviando:
```json
{
  "type": "INDIVIDUAL",      // ❌ INCORRECTO
  "member": {
    "firstName": "Pedro",
    "lastName": "López Fernández",
    "membership": "FAMILY"    // ✓ CORRECTO
  }
}
```

**Lo que DEBERÍA enviar**:
```json
{
  "type": "FAMILY",           // ✓ Basado en membership
  "familyId": "family-123",
  "family": {
    "familyName": "Familia López",
    "primaryMember": {
      "firstName": "Pedro",
      "lastName": "López Fernández",
      "membership": "FAMILY"
    }
  },
  "member": null              // No enviar member si es FAMILY
}
```

---

## 📊 Diagnóstico

El backend:
1. ✅ **SÍ** está enviando el campo `membership` (progreso!)
2. ❌ **NO** está usando ese campo para determinar el `type`
3. ❌ **NO** está agrupando correctamente family vs individual

**Resultado**:
- Todos los morosos aparecen como `type: "INDIVIDUAL"`
- Aunque tengan `membership: "FAMILY"`
- Los contadores están incorrectos:
  - `individualDebtors`: cuenta a TODOS (incluyendo familiares)
  - `familyDebtors`: siempre 0

---

## 🔧 Solución Requerida en el Backend

### 1. Leer el campo `membership` de la base de datos

```typescript
// Obtener morosos con su membership
const delinquentMembers = await db.query(`
  SELECT
    m.id,
    m.member_number,
    m.first_name,
    m.last_name,
    m.email,
    m.phone,
    m.status,
    m.membership,    -- ← IMPORTANTE: incluir este campo
    ...
  FROM members m
  INNER JOIN payments p ON ...
  WHERE p.status = 'PENDING'
`)
```

### 2. Usar `membership` para determinar el `type`

```typescript
const debtors = delinquentMembers.map(member => {
  // Determinar tipo basado en membership
  const isFamilyMember = member.membership === 'FAMILY'

  if (isFamilyMember) {
    // Si es familiar, debe aparecer como FAMILY
    return {
      memberId: null,
      familyId: member.family_id,  // Obtener del campo family_id
      type: 'FAMILY',
      member: null,
      family: {
        id: member.family_id,
        familyName: member.family_name || `Familia ${member.last_name}`,
        primaryMember: {
          id: member.id,
          memberNumber: member.member_number,
          firstName: member.first_name,
          lastName: member.last_name,
          email: member.email,
          phone: member.phone,
          membership: member.membership,
        },
        totalMembers: member.family_size || 1,
      },
      pendingPayments: member.pending_payments,
      totalDebt: member.total_debt,
      oldestDebtDays: member.oldest_debt_days,
      oldestDebtDate: member.oldest_debt_date,
      lastPaymentDate: member.last_payment_date,
      lastPaymentAmount: member.last_payment_amount,
    }
  } else {
    // Si es individual
    return {
      memberId: member.id,
      familyId: null,
      type: 'INDIVIDUAL',
      member: {
        id: member.id,
        memberNumber: member.member_number,
        firstName: member.first_name,
        lastName: member.last_name,
        email: member.email,
        phone: member.phone,
        status: member.status,
        membership: member.membership,
      },
      family: null,
      pendingPayments: member.pending_payments,
      totalDebt: member.total_debt,
      oldestDebtDays: member.oldest_debt_days,
      oldestDebtDate: member.old est_debt_date,
      lastPaymentDate: member.last_payment_date,
      lastPaymentAmount: member.last_payment_amount,
    }
  }
})
```

### 3. Recalcular el resumen correctamente

```typescript
const summary = {
  totalDebtors: debtors.length,

  // Contar usando el campo type (que ahora está correcto)
  individualDebtors: debtors.filter(d => d.type === 'INDIVIDUAL').length,
  familyDebtors: debtors.filter(d => d.type === 'FAMILY').length,

  totalDebtAmount: debtors.reduce((sum, d) => sum + d.totalDebt, 0),
  averageDaysOverdue: Math.round(
    debtors.reduce((sum, d) => sum + d.oldestDebtDays, 0) / debtors.length
  ),
  averageDebtPerDebtor: totalDebtAmount / debtors.length,
}
```

---

## 🧪 Casos de Prueba

### Caso 1: Pedro López Fernández (Familiar)

**Entrada (BD)**:
- `membership`: "FAMILY"
- `member_number`: "A001" (empieza con A)

**Salida esperada**:
```json
{
  "memberId": null,
  "familyId": "family-123",
  "type": "FAMILY",
  "member": null,
  "family": {
    "id": "family-123",
    "familyName": "Familia López",
    "primaryMember": {
      "memberNumber": "A001",
      "firstName": "Pedro",
      "lastName": "López Fernández",
      "membership": "FAMILY"
    },
    "totalMembers": 3
  }
}
```

### Caso 2: Juan García (Individual)

**Entrada (BD)**:
- `membership`: "INDIVIDUAL"
- `member_number`: "SOCIO001"

**Salida esperada**:
```json
{
  "memberId": "member-456",
  "familyId": null,
  "type": "INDIVIDUAL",
  "member": {
    "memberNumber": "SOCIO001",
    "firstName": "Juan",
    "lastName": "García",
    "membership": "INDIVIDUAL"
  },
  "family": null
}
```

### Caso 3: Summary con mix

**Datos**: 3 familiares + 5 individuales = 8 total

**Summary esperado**:
```json
{
  "totalDebtors": 8,
  "individualDebtors": 5,  // ← No 8
  "familyDebtors": 3,      // ← No 0
  "totalDebtAmount": 600.00,
  "averageDaysOverdue": 45,
  "averageDebtPerDebtor": 75.00
}
```

---

## ✅ Verificación

Para confirmar que está corregido, el frontend debe mostrar:

**En la consola del navegador**:
```javascript
🔍 Debug - Datos del backend: {
  debtors: [
    {
      name: "Pedro López Fernández",
      type: "FAMILY",           // ← Debe ser FAMILY, no INDIVIDUAL
      membership: "FAMILY",
      memberNumber: "A001"
    },
    {
      name: "Juan García",
      type: "INDIVIDUAL",
      membership: "INDIVIDUAL",
      memberNumber: "SOCIO001"
    }
  ],
  summary: {
    totalDebtors: 8,
    individualDebtors: 5,       // ← No debe ser 8
    familyDebtors: 3            // ← No debe ser 0
  }
}
```

**En la UI**:
- Pedro López Fernández → Chip "Familia" 👥 (azul)
- Juan García → Chip "Individual" 👤 (púrpura)
- Tarjeta "Socios Individuales" → 5 (no 8)
- Tarjeta "Familias" → 3 (no 0)

---

## 📋 Checklist para el Backend

- [ ] Leer campo `membership` de la tabla `members`
- [ ] Usar `membership` para asignar el `type` correctamente
- [ ] Si `membership === 'FAMILY'`:
  - [ ] `type` = "FAMILY"
  - [ ] `member` = null
  - [ ] `family` = objeto con datos
  - [ ] `familyId` = ID de la familia
  - [ ] `memberId` = null
- [ ] Si `membership === 'INDIVIDUAL'`:
  - [ ] `type` = "INDIVIDUAL"
  - [ ] `member` = objeto con datos
  - [ ] `family` = null
  - [ ] `memberId` = ID del socio
  - [ ] `familyId` = null
- [ ] Recalcular `individualDebtors` contando solo type="INDIVIDUAL"
- [ ] Recalcular `familyDebtors` contando solo type="FAMILY"
- [ ] Probar con datos reales mixtos
- [ ] Verificar en frontend que los chips muestren el tipo correcto

---

## 🚨 Nota Importante

**El campo `membership` ya está siendo enviado**, lo cual es excelente progreso. Pero necesita ser **usado** para determinar el `type` y estructurar la respuesta correctamente.

Sin esta corrección, el módulo de informes mostrará información incorrecta a los usuarios.

---

**Creado**: 7 de noviembre de 2025
**Reportado por**: Usuario final (Pedro López Fernández aparece como Individual)
**Estado**: ✅ **RESUELTO** - Fix implementado en backend

---

## ✅ Solución Implementada

**Fecha de resolución**: 7 de noviembre de 2025

El backend implementó correctamente la comparación del campo `membership_type` de la base de datos:
- Ahora compara con `"familiar"` (minúsculas) en lugar de `"FAMILY"` (mayúsculas)
- El campo `type` en la respuesta GraphQL ahora refleja correctamente si es `"INDIVIDUAL"` o `"FAMILY"`

**Resultado**:
- ✅ Pedro López Fernández y otros socios familiares ahora aparecen con `type: "FAMILY"`
- ✅ Los contadores del summary son correctos:
  - `individualDebtors`: Solo cuenta socios individuales
  - `familyDebtors`: Solo cuenta familias
- ✅ Los chips en la UI muestran el tipo correcto ("Familia" vs "Individual")

**Frontend**: El campo `type` es ahora la fuente de verdad única. El campo `membership` en el objeto `member` era redundante y ha sido removido del schema GraphQL.
