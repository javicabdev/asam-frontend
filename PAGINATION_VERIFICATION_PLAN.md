# Plan de Verificación de Paginación - Tablas con Server-Side Pagination

## Resumen

Se identificó un bug de paginación en `MembersTable` causado por ciclos de actualización en DataGrid controlado. Este documento detalla el plan para verificar si el mismo problema existe en otras tablas.

## Tablas Identificadas con Server-Side Pagination

```bash
grep -l "paginationMode=\"server\"" src/features/*/components/*Table.tsx
```

Resultado:
1. ✅ **MembersTable** - `src/features/members/components/MembersTable.tsx` - **CORREGIDA**
2. ⚠️ **PaymentsTable** - `src/features/payments/components/PaymentsTable.tsx` - **PENDIENTE VERIFICACIÓN**
3. ⚠️ **CashFlowTable** - `src/features/cashflow/components/CashFlowTable.tsx` - **PENDIENTE VERIFICACIÓN**

## Checklist de Verificación

### 1. PaymentsTable ⚠️

**Archivos:**
- Componente: `src/features/payments/components/PaymentsTable.tsx`
- Hook: `src/features/payments/hooks/usePaymentsTable.ts` (si existe)
- Página: `src/pages/PaymentsPage.tsx` (o similar)

**Pasos de Verificación:**

#### Paso 1: Prueba Manual
- [ ] Navegar a `/payments` en el navegador
- [ ] Abrir DevTools → Console y Network tab (filtrar por GraphQL)
- [ ] Verificar que hay suficientes registros para múltiples páginas
- [ ] Cambiar pageSize a 10 (o un valor que genere múltiples páginas)
- [ ] Hacer clic en "Página 2" o botón "siguiente >"
- [ ] **Observar:**
  - [ ] ¿Se hacen 2 queries GraphQL consecutivas?
  - [ ] ¿La tabla rebota a página 1?
  - [ ] ¿Se ve algún parpadeo o "flash" de contenido?

**Resultado:** ___________________

#### Paso 2: Análisis de Código
- [ ] Abrir `src/features/payments/components/PaymentsTable.tsx`
- [ ] Verificar patrón de paginación:
  - [ ] ¿Tiene `paginationMode="server"`?
  - [ ] ¿Tiene `paginationModel={{page: ..., pageSize: ...}}`?
  - [ ] ¿Tiene `onPaginationModelChange` handler?
- [ ] Verificar el handler `handlePaginationModelChange`:
  - [ ] ¿Usa `useRef` con flag `changingRef`?
  - [ ] ¿Ignora eventos cuando `changingRef.current === true`?
  - [ ] ¿Resetea el flag con `setTimeout`?

**Código actual:**
```typescript
// Copiar aquí el handlePaginationModelChange actual
```

**Necesita corrección:** [ ] Sí  [ ] No

#### Paso 3: Implementación (si es necesario)

Si el problema existe, aplicar el mismo patrón que en MembersTable:

**En PaymentsTable.tsx:**
```typescript
// 1. Agregar import
import React, { ..., useRef } from 'react'

// 2. Agregar ref
const changingRef = useRef(false)

// 3. Actualizar handler
const handlePaginationModelChange = useCallback((model: GridPaginationModel) => {
  if (changingRef.current) {
    return
  }

  const targetPage = model.page + 1
  const sizeChanged = model.pageSize !== pageSize
  const pageChanged = targetPage !== page

  changingRef.current = true

  try {
    if (sizeChanged) {
      onPageSizeChange(model.pageSize)
      return
    }
    if (pageChanged) {
      onPageChange(targetPage)
    }
  } finally {
    setTimeout(() => {
      changingRef.current = false
    }, 0)
  }
}, [page, pageSize, onPageChange, onPageSizeChange])
```

**En usePaymentsTable.ts (si existe):**
```typescript
// Derivar page y pageSize del filter
const page = filter.pagination?.page || 1
const pageSize = filter.pagination?.pageSize || 25

// Usar array vacío en dependencias
const handlePageChange = useCallback((newPage: number) => {
  setFilter((prev) => ({
    ...prev,
    pagination: { page: newPage, pageSize: prev.pagination?.pageSize || 25 },
  }))
}, [])
```

#### Paso 4: Testing
- [ ] Recargar página
- [ ] Cambiar pageSize a 10
- [ ] Navegar entre páginas (1 → 2 → 3 → 1)
- [ ] Verificar en Network: solo 1 query por cambio
- [ ] Probar cambio de pageSize (10 → 25 → 50)
- [ ] Probar sorting + paginación
- [ ] Probar filtering + paginación

**Resultado:** ___________________

---

### 2. CashFlowTable ⚠️

**Archivos:**
- Componente: `src/features/cashflow/components/CashFlowTable.tsx`
- Hook: `src/features/cashflow/hooks/useCashFlowTable.ts` (si existe)
- Página: `src/pages/CashFlowPage.tsx` (o similar)

**Pasos de Verificación:**

#### Paso 1: Prueba Manual
- [ ] Navegar a `/cash-flow` en el navegador
- [ ] Abrir DevTools → Console y Network tab (filtrar por GraphQL)
- [ ] Verificar que hay suficientes registros para múltiples páginas
- [ ] Cambiar pageSize a 10
- [ ] Hacer clic en "Página 2" o botón "siguiente >"
- [ ] **Observar:**
  - [ ] ¿Se hacen 2 queries GraphQL consecutivas?
  - [ ] ¿La tabla rebota a página 1?
  - [ ] ¿Se ve algún parpadeo o "flash" de contenido?

**Resultado:** ___________________

#### Paso 2: Análisis de Código
- [ ] Abrir `src/features/cashflow/components/CashFlowTable.tsx`
- [ ] Verificar patrón de paginación:
  - [ ] ¿Tiene `paginationMode="server"`?
  - [ ] ¿Tiene `paginationModel={{page: ..., pageSize: ...}}`?
  - [ ] ¿Tiene `onPaginationModelChange` handler?
- [ ] Verificar el handler `handlePaginationModelChange`:
  - [ ] ¿Usa `useRef` con flag `changingRef`?
  - [ ] ¿Ignora eventos cuando `changingRef.current === true`?
  - [ ] ¿Resetea el flag con `setTimeout`?

**Código actual:**
```typescript
// Copiar aquí el handlePaginationModelChange actual
```

**Necesita corrección:** [ ] Sí  [ ] No

#### Paso 3: Implementación (si es necesario)

Aplicar el mismo patrón que en MembersTable (ver sección de PaymentsTable arriba).

#### Paso 4: Testing
- [ ] Recargar página
- [ ] Cambiar pageSize a 10
- [ ] Navegar entre páginas
- [ ] Verificar en Network: solo 1 query por cambio
- [ ] Probar cambio de pageSize
- [ ] Probar sorting + paginación
- [ ] Probar filtering + paginación

**Resultado:** ___________________

---

## Otras Tablas (sin server-side pagination)

Estas tablas NO usan `paginationMode="server"`, por lo que probablemente no tienen el mismo problema:

- `src/features/users/components/UsersTable.tsx`
- `src/features/reports/components/DelinquentTable.tsx`

**Acción:** Verificación de bajo prioridad (solo si hay tiempo)

---

## Script de Verificación Rápida

Para verificar rápidamente el patrón en cada tabla:

```bash
# Para PaymentsTable
echo "=== PaymentsTable ==="
grep -A 30 "handlePaginationModelChange" src/features/payments/components/PaymentsTable.tsx | grep -E "(useRef|changingRef|setTimeout)"

# Para CashFlowTable
echo "=== CashFlowTable ==="
grep -A 30 "handlePaginationModelChange" src/features/cashflow/components/CashFlowTable.tsx | grep -E "(useRef|changingRef|setTimeout)"
```

Si estos comandos no retornan nada, significa que la tabla necesita ser corregida.

---

## Resumen de Resultados

| Tabla | Estado | Problema Detectado | Corrección Aplicada | Testing Completo |
|-------|--------|-------------------|---------------------|------------------|
| MembersTable | ✅ Corregida | Sí | Sí | Sí |
| PaymentsTable | ⚠️ Pendiente | - | - | - |
| CashFlowTable | ⚠️ Pendiente | - | - | - |

---

## Notas

- **Prioridad:** PaymentsTable > CashFlowTable (por orden de uso frecuente)
- **Tiempo estimado:** 30-45 minutos por tabla (análisis + implementación + testing)
- **Testing crítico:** Siempre verificar en Network tab que solo hay 1 query GraphQL por cambio

---

## Próximos Pasos

1. [ ] Ejecutar verificación manual en PaymentsTable
2. [ ] Ejecutar verificación manual en CashFlowTable
3. [ ] Aplicar correcciones necesarias
4. [ ] Crear commits separados por tabla
5. [ ] Actualizar esta documentación con resultados
6. [ ] Considerar crear hook compartido `useServerPagination` para evitar duplicación

---

## Referencias

- Documentación completa del problema: `PAGINATION_BUG_FIX.md`
- Implementación de referencia: `src/features/members/components/MembersTable.tsx`
- Commit de corrección: (agregar hash después del commit)
