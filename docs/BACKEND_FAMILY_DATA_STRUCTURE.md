# 🚨 URGENTE: Estructura Incorrecta de Datos para Familias

**Fecha**: 7 de noviembre de 2025
**Prioridad**: ALTA
**Problema**: El `type` es correcto ("FAMILY") pero los datos están en `member` en lugar de `family`

---

## 🎯 Problema Detectado

**Caso real**: Pedro López Fernández (A99001)

**Lo que el backend está enviando** ❌:
```json
{
  "type": "FAMILY",          // ✅ CORRECTO
  "familyId": null,          // ❌ INCORRECTO (debería tener valor)
  "memberId": "5",           // ❌ INCORRECTO (debería ser null)
  "member": {                // ❌ INCORRECTO (debería ser null)
    "memberNumber": "A99001",
    "firstName": "Pedro",
    "lastName": "López Fernández"
  },
  "family": null             // ❌ INCORRECTO (debería tener datos)
}
```

**Lo que DEBE enviar** ✅:
```json
{
  "type": "FAMILY",          // ✅ Correcto
  "familyId": "family-123",  // ✅ ID de la familia
  "memberId": null,          // ✅ Null para familias
  "member": null,            // ✅ Null para familias
  "family": {                // ✅ Datos aquí
    "id": "family-123",
    "familyName": "Familia López",
    "primaryMember": {
      "id": "5",
      "memberNumber": "A99001",
      "firstName": "Pedro",
      "lastName": "López Fernández",
      "email": "pedro@example.com",
      "phone": "123456789"
    },
    "totalMembers": 3
  },
  "pendingPayments": [...],
  "totalDebt": 150.00,
  "oldestDebtDays": 30,
  ...
}
```

---

## 📊 Diagnóstico

El backend está:
1. ✅ Clasificando correctamente el `type` como "FAMILY"
2. ❌ NO está construyendo el objeto `family`
3. ❌ Está dejando los datos en el objeto `member`
4. ❌ NO está asignando `familyId`
5. ❌ NO está poniendo `memberId` a null

**Resultado**:
- El frontend no puede mostrar el nombre de la familia
- El frontend no puede mostrar el número de socio
- El frontend no puede mostrar el contacto
- Solo se muestra la deuda (que está en el nivel raíz)

---

## 🔧 Solución Requerida en el Backend

### Cambios Necesarios

Cuando `membership_type === 'familiar'`:

```typescript
// 1. Obtener los datos de la familia del socio
const familyData = await getFamilyForMember(member.id)

// 2. Construir la respuesta correctamente
return {
  // IDs
  memberId: null,                    // ← NULL para familias
  familyId: familyData.family_id,    // ← ID de la familia

  // Type
  type: 'FAMILY',                    // ← Ya está correcto ✅

  // Objetos
  member: null,                      // ← NULL para familias
  family: {                          // ← Construir este objeto
    id: familyData.family_id,
    familyName: familyData.family_name || `Familia ${member.last_name}`,
    primaryMember: {
      id: member.id,
      memberNumber: member.member_number,
      firstName: member.first_name,
      lastName: member.last_name,
      email: member.email,
      phone: member.phone,
    },
    totalMembers: familyData.total_members || 1,
  },

  // Datos de deuda (ya están correctos)
  pendingPayments: [...],
  totalDebt: member.total_debt,
  oldestDebtDays: member.oldest_debt_days,
  oldestDebtDate: member.oldest_debt_date,
  lastPaymentDate: member.last_payment_date,
  lastPaymentAmount: member.last_payment_amount,
}
```

### Consulta SQL Necesaria

Para obtener los datos de la familia:

```sql
-- Obtener información de la familia para un socio familiar
SELECT
  m.id,
  m.member_number,
  m.first_name,
  m.last_name,
  m.email,
  m.phone,
  m.family_id,
  f.name as family_name,
  f.total_members
FROM members m
LEFT JOIN families f ON m.family_id = f.id
WHERE m.id = ? AND m.membership_type = 'familiar'
```

---

## 🧪 Casos de Prueba

### Caso 1: Pedro López Fernández (Familiar)

**Entrada (BD)**:
```
members:
  id: 5
  member_number: A99001
  first_name: Pedro
  last_name: López Fernández
  email: pedro@example.com
  phone: 123456789
  membership_type: familiar
  family_id: 123

families:
  id: 123
  name: Familia López
  total_members: 3
```

**Salida esperada**:
```json
{
  "memberId": null,
  "familyId": "123",
  "type": "FAMILY",
  "member": null,
  "family": {
    "id": "123",
    "familyName": "Familia López",
    "primaryMember": {
      "id": "5",
      "memberNumber": "A99001",
      "firstName": "Pedro",
      "lastName": "López Fernández",
      "email": "pedro@example.com",
      "phone": "123456789"
    },
    "totalMembers": 3
  },
  "pendingPayments": [...],
  "totalDebt": 150.00,
  "oldestDebtDays": 30
}
```

### Caso 2: Juan García (Individual)

**Entrada (BD)**:
```
members:
  id: 10
  member_number: SOCIO001
  first_name: Juan
  last_name: García
  email: juan@example.com
  membership_type: individual
  family_id: null
```

**Salida esperada**:
```json
{
  "memberId": "10",
  "familyId": null,
  "type": "INDIVIDUAL",
  "member": {
    "id": "10",
    "memberNumber": "SOCIO001",
    "firstName": "Juan",
    "lastName": "García",
    "email": "juan@example.com",
    "phone": null,
    "status": "ACTIVE"
  },
  "family": null,
  "pendingPayments": [...],
  "totalDebt": 100.00,
  "oldestDebtDays": 15
}
```

---

## ✅ Verificación

Para confirmar que está corregido, el frontend debe mostrar:

**En la consola del navegador**:
```javascript
🔍 Debug - Datos de familias: {
  count: 3,
  sample: [
    {
      type: "FAMILY",
      familyId: "123",           // ← NO debe ser null
      memberId: null,            // ← Debe ser null
      hasFamily: true,           // ← Debe ser true
      hasMember: false,          // ← Debe ser false
      familyData: {
        id: "123",
        familyName: "Familia López",
        primaryMember: {
          memberNumber: "A99001",
          firstName: "Pedro",
          lastName: "López Fernández"
        }
      },
      memberData: null           // ← Debe ser null
    }
  ]
}
```

**En la UI**:
- Columna "Deudor": "Familia López" (no vacío)
- Columna "Nº Socio": "A99001" (no vacío)
- Columna "Contacto": "pedro@example.com" o "123456789" (no vacío)
- Columna "Tipo": Chip "Familia" 👥 (azul)

---

## 📋 Checklist para el Backend

- [ ] Obtener `family_id` del socio cuando `membership_type === 'familiar'`
- [ ] Consultar tabla `families` para obtener `family_name` y `total_members`
- [ ] Construir objeto `family` con:
  - [ ] `id` = family_id
  - [ ] `familyName` = nombre de la familia
  - [ ] `primaryMember` = datos del socio (firstName, lastName, memberNumber, email, phone)
  - [ ] `totalMembers` = número de miembros de la familia
- [ ] Asignar `familyId` = family_id (no null)
- [ ] Asignar `memberId` = null (no el ID del socio)
- [ ] Asignar `member` = null (no el objeto con datos)
- [ ] Asignar `family` = objeto construido (no null)
- [ ] Verificar que `type` = "FAMILY" (ya funciona ✅)
- [ ] Probar con Pedro López Fernández y verificar en frontend

---

## 🚨 Nota Importante

**El campo `type` ya está correcto** ✅, pero los datos están en el lugar equivocado.

La regla es simple:
- Si `type === "FAMILY"` → usar objeto `family`, `member` debe ser `null`
- Si `type === "INDIVIDUAL"` → usar objeto `member`, `family` debe ser `null`

Sin esta corrección, los socios familiares aparecerán sin nombre ni datos de contacto en el informe.

---

**Creado**: 7 de noviembre de 2025
**Reportado por**: Usuario final (socios familiares sin datos visibles)
**Estado**: Pendiente de corrección en backend
