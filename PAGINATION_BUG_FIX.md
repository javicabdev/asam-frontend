# Bug de Paginación en MUI DataGrid - Documentación

## Problema Identificado

### Síntomas
Al hacer clic en "Página 2" (o cualquier navegación de paginación) en la tabla de miembros:
- La tabla mostraba brevemente la página correcta
- Inmediatamente "rebotaba" de vuelta a la página 1
- En los logs de GraphQL se observaban **dos queries consecutivas**:
  1. Query correcta: `{page: 2, pageSize: 10}` ✅
  2. Query incorrecta: `{page: 1, pageSize: 10}` ❌

### Causa Raíz

**Ciclo de actualización infinito** causado por el patrón de componente controlado de MUI DataGrid:

```
1. Usuario hace clic "Página 2"
   ↓
2. DataGrid dispara onPaginationModelChange({page: 1, pageSize: 10})
   ↓
3. handlePaginationModelChange llama onPageChange(2)
   ↓
4. Estado actualiza: filter.pagination = {page: 2, pageSize: 10}
   ↓
5. React re-renderiza componente con nuevos props
   ↓
6. DataGrid recibe paginationModel={{page: 1, pageSize: 10}} (convertido 2-1)
   ↓
7. DataGrid detecta cambio de prop y dispara onPaginationModelChange OTRA VEZ
   ↓
8. handlePaginationModelChange recibe {page: 0, pageSize: 10}
   ↓
9. Detecta pageChanged (targetPage=1 !== page=2)
   ↓
10. Llama onPageChange(1) ❌
    ↓
11. Vuelve a página 1
```

**El problema:** DataGrid en modo controlado dispara `onPaginationModelChange` no solo para acciones del usuario, sino también cuando recibe nuevos props, creando un "reflejo" de nuestro propio cambio.

## Solución Implementada

### Estrategia
Usar un `useRef` para rastrear cuando **nosotros** iniciamos un cambio de paginación, y así ignorar los eventos de "reflejo" del DataGrid.

### Código

```typescript
// En MembersTable.tsx

// Track if we initiated the change (to ignore reflection events)
const changingRef = useRef(false)

const handlePaginationModelChange = useCallback((model: GridPaginationModel) => {
  // Ignore events while we're changing props (reflection from our own updates)
  if (changingRef.current) {
    console.log('🔵 Ignoring event during prop update')
    return
  }

  const targetPage = model.page + 1 // Convert from 0-based to 1-based

  console.log('🔵 Processing pagination change:', { model, currentProps: { page, pageSize } })

  // Check what changed
  const sizeChanged = model.pageSize !== pageSize
  const pageChanged = targetPage !== page

  // Set flag before calling handlers
  changingRef.current = true

  try {
    // Priority 1: Handle pageSize change (resets to page 1)
    if (sizeChanged) {
      console.log('🔵 Size changed, calling onPageSizeChange')
      onPageSizeChange(model.pageSize)
      return
    }

    // Priority 2: Handle page change (only if size didn't change)
    if (pageChanged) {
      console.log('🔵 Page changed, calling onPageChange')
      onPageChange(targetPage)
    }
  } finally {
    // Reset flag after a tick (allow React to update)
    setTimeout(() => {
      changingRef.current = false
    }, 0)
  }
}, [page, pageSize, onPageChange, onPageSizeChange])
```

### Cómo Funciona

1. **Usuario hace clic** → `changingRef.current = false` → procesamos el cambio
2. **Seteamos** `changingRef.current = true` antes de llamar handlers
3. **Llamamos** `onPageChange(2)` o `onPageSizeChange(10)`
4. **React re-renderiza** → DataGrid recibe nuevos props
5. **DataGrid dispara** evento de reflejo → `changingRef.current === true` → **ignoramos**
6. **setTimeout(0)** resetea `changingRef.current = false` para el siguiente cambio

### Ventajas
- ✅ Rompe el ciclo infinito
- ✅ Solo 1 query GraphQL por cambio de paginación
- ✅ Mantiene DataGrid completamente controlado
- ✅ No afecta otras funcionalidades (sorting, filtering, selection)

## Otras Mejoras Implementadas

### 1. Single Source of Truth en useMembersTable.ts
```typescript
// Derivar page y pageSize del filter (única fuente de verdad)
const page = filter.pagination?.page || 1
const pageSize = filter.pagination?.pageSize || 25
```

### 2. Dependencias Correctas en Callbacks
```typescript
const handlePageChange = useCallback((newPage: number) => {
  setFilter((prev) => ({
    ...prev,
    pagination: { page: newPage, pageSize: prev.pagination?.pageSize || 25 },
  }))
}, [])  // Array vacío - usa función updater para acceder a prev state
```

### 3. Separación de Cambios de Page vs PageSize
```typescript
// Si cambia pageSize, solo actualizar pageSize (resetea a página 1)
if (sizeChanged) {
  onPageSizeChange(model.pageSize)
  return  // No procesar cambio de página
}

// Solo procesar cambio de página si size no cambió
if (pageChanged) {
  onPageChange(targetPage)
}
```

## Plan de Verificación para Otras Tablas

### Tablas Identificadas en la Aplicación

Buscar componentes que usen `<DataGrid>` con `paginationMode="server"`:

```bash
grep -r "DataGrid" src/ --include="*.tsx" | grep -v "node_modules"
grep -r "paginationMode=\"server\"" src/ --include="*.tsx"
```

### Checklist de Verificación por Tabla

Para cada tabla encontrada, verificar:

#### 1. **Identificación del Problema**
- [ ] Navegar a la tabla en el navegador
- [ ] Abrir DevTools → Console → Network tab
- [ ] Cambiar pageSize a un valor que permita múltiples páginas
- [ ] Hacer clic en "Página 2" o botón "siguiente"
- [ ] **Verificar:** ¿Se hacen 2 queries GraphQL consecutivas?
- [ ] **Verificar:** ¿La tabla rebota a página 1?

#### 2. **Análisis del Código**
- [ ] Ubicar el componente de tabla (ej: `UsersTable.tsx`, `PaymentsTable.tsx`)
- [ ] Verificar si tiene `paginationMode="server"`
- [ ] Verificar si usa patrón controlado: `paginationModel={{page, pageSize}}`
- [ ] Verificar si tiene `onPaginationModelChange` handler
- [ ] Revisar el hook personalizado (ej: `useUsersTable.ts`, `usePaymentsTable.ts`)

#### 3. **Implementación de la Solución**
Si el problema existe:

**En el componente de tabla (ej: UsersTable.tsx):**
```typescript
// 1. Agregar useRef al import
import React, { ..., useRef } from 'react'

// 2. Agregar ref en el componente
const changingRef = useRef(false)

// 3. Actualizar handlePaginationModelChange
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

**En el hook (ej: useUsersTable.ts):**
```typescript
// 1. Derivar page y pageSize del filter
const page = filter.pagination?.page || 1
const pageSize = filter.pagination?.pageSize || 25

// 2. Usar array de dependencias vacío
const handlePageChange = useCallback((newPage: number) => {
  setFilter((prev) => ({
    ...prev,
    pagination: { page: newPage, pageSize: prev.pagination?.pageSize || 25 },
  }))
}, [])  // Vacío, no [filter]
```

#### 4. **Testing**
- [ ] Recargar página en navegador
- [ ] Cambiar pageSize a 10
- [ ] Navegar a página 2
- [ ] Verificar en Network tab: solo 1 query GraphQL
- [ ] Verificar que la paginación funciona correctamente
- [ ] Probar cambio de pageSize
- [ ] Probar sorting combinado con paginación
- [ ] Probar filtering combinado con paginación

### Tablas Candidatas a Revisar

Basándose en la estructura del proyecto:

1. **UsersTable** (`src/features/users/components/UsersTable.tsx`)
   - Hook: `src/features/users/hooks/useUsersTable.ts`
   - Ruta: `/users`

2. **PaymentsTable** (`src/features/payments/components/PaymentsTable.tsx`)
   - Hook: `src/features/payments/hooks/usePaymentsTable.ts`
   - Ruta: `/payments`

3. **CashFlowTable** (si existe)
   - Ruta: `/cash-flow`

4. **AnnualFeesTable** (si existe)
   - Ruta: `/annual-fees`

5. **ReportsTable** (si existe)
   - Ruta: `/reports`

### Script de Búsqueda Automática

```bash
# Buscar todos los archivos que usan DataGrid con paginación server
find src -name "*.tsx" -type f -exec grep -l "paginationMode=\"server\"" {} \;

# Buscar hooks que manejan paginación
find src -name "use*Table*.ts" -type f

# Buscar componentes de tabla
find src -name "*Table.tsx" -type f
```

### Priorización

**Alta prioridad** (tablas públicas/muy usadas):
1. MembersTable ✅ (ya corregida)
2. PaymentsTable
3. UsersTable

**Media prioridad:**
4. AnnualFeesTable
5. CashFlowTable

**Baja prioridad:**
6. ReportsTable (si es de solo lectura)

## Notas Adicionales

### Alternativas Consideradas

1. **Debouncing:** Intentado con timestamp y 50ms window → No funcionó porque los eventos llegaban fuera del window
2. **Estado interno no controlado:** Causó desincronización entre UI y estado del padre
3. **Comparación de props:** `model.page === page - 1` → No funcionó por race conditions de React

### Lecciones Aprendidas

1. **MUI DataGrid controlado:** Dispara `onPaginationModelChange` tanto para acciones del usuario como para cambios de props
2. **Race conditions:** Las comparaciones de props en handlers pueden fallar durante el ciclo de actualización de React
3. **useRef es la solución:** Permite rastrear estado mutable sin triggear re-renders
4. **setTimeout(0):** Necesario para permitir que React complete el ciclo de actualización antes de resetear el flag

### Prevención Futura

Para nuevas tablas con DataGrid:

1. Siempre usar el patrón `changingRef` cuando se use `paginationMode="server"`
2. Agregar logs de depuración durante desarrollo para detectar queries duplicadas
3. Testear navegación de paginación manualmente antes de marcar como completo
4. Considerar crear un hook compartido `useServerPagination` que encapsule esta lógica

## Referencias

- Issue original: Paginación en tabla de miembros rebotaba a página 1
- Archivos modificados:
  - `src/features/members/components/MembersTable.tsx`
  - `src/features/members/hooks/useMembersTable.ts`
- MUI DataGrid docs: https://mui.com/x/react-data-grid/pagination/
- React useRef docs: https://react.dev/reference/react/useRef
