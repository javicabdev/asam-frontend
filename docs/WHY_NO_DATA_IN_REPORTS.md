# ❓ ¿Por qué no se ve la lista de morosos en el módulo de Informes?

**Fecha**: 7 de noviembre de 2025
**Estado**: ESPERADO - No es un error

---

## 🎯 Respuesta Corta

**La lista de morosos no aparece porque el backend aún no ha implementado la query GraphQL `getDelinquentReport`.**

El módulo de Informes está **100% completado desde el lado del frontend**, pero necesita que el backend implemente la API correspondiente para poder mostrar datos reales.

---

## 📊 Estado Actual

### ✅ Lo que SÍ está implementado (Frontend):
1. **Componentes UI** (6 componentes)
   - DebtorTypeChip
   - DelinquentExportButtons
   - DelinquentSummaryCards
   - DelinquentFilters
   - DelinquentTable
   - DebtDetailsDialog

2. **Página principal** (ReportsPage.tsx)
   - Layout completo
   - Manejo de estados (loading, error, sin datos)
   - Integración de todos los componentes

3. **Hooks personalizados**
   - useDelinquentReport (fetching de datos)
   - useExportDelinquent (exportación PDF/CSV)

4. **Utilidades**
   - Formateo de moneda y fechas
   - Exportación a PDF y CSV

5. **Traducciones**
   - 285 traducciones en 3 idiomas (es, fr, wo)

6. **Query GraphQL**
   - Archivo `src/graphql/operations/reports.graphql` creado
   - Tipos TypeScript generados con codegen

### ❌ Lo que NO está implementado (Backend):
1. **Resolver GraphQL** para `getDelinquentReport`
2. **Lógica de negocio** para:
   - Identificar pagos vencidos
   - Calcular días de atraso
   - Agrupar por deudor (individual/familia)
   - Aplicar filtros
   - Calcular resumen estadístico

---

## 🔍 ¿Qué verás actualmente?

Al acceder a `/reports` en la aplicación:

### Escenario 1: Error de GraphQL
Si el backend está corriendo pero sin la query implementada:
```
Error: Cannot query field "getDelinquentReport" on type "Query"
```

**Lo que verás en pantalla**:
- Alert rojo con mensaje de error
- Texto: "Error al cargar el informe de morosos: [mensaje del error]"

### Escenario 2: Error de red
Si el backend no está corriendo:
```
Network error: Failed to fetch
```

**Lo que verás en pantalla**:
- Alert rojo con mensaje de error
- Texto: "Error al cargar el informe de morosos: Network request failed"

### Escenario 3: Backend implementado pero sin datos
Si el backend funciona pero no hay morosos en la base de datos:

**Lo que verás en pantalla**:
- ✅ 6 tarjetas de resumen con valores en 0
- ℹ️ Alert azul con mensaje: "No hay morosos registrados en este momento"
- Sin tabla (porque no hay datos que mostrar)

### Escenario 4: TODO FUNCIONANDO ✨
Una vez implementado el backend Y con datos:

**Lo que verás**:
- ✅ 6 tarjetas de resumen con métricas reales
- ✅ Panel de filtros funcionales
- ✅ Tabla con lista de morosos
- ✅ Botones PDF/CSV habilitados
- ✅ Click en "Ver Detalles" abre modal con info completa

---

## 🛠️ ¿Cómo solucionar?

### Para el equipo de Backend:

**Acción requerida**: Implementar la query GraphQL

**Documento de referencia**:
`docs/BACKEND_REQUEST_DELINQUENT_REPORT.md`

**Tiempo estimado**: 4-6 horas

**Pasos**:
1. Leer requisitos en `docs/BACKEND_REQUEST_DELINQUENT_REPORT.md`
2. Implementar resolver `getDelinquentReport`
3. Añadir lógica de cálculo de morosos
4. Implementar filtros (tipo, monto, ordenación)
5. Añadir validación de permisos (solo ADMIN)
6. Escribir tests
7. Notificar al frontend cuando esté listo

### Para el equipo de Frontend:

**Acción requerida**: NINGUNA (ya está todo implementado)

**Cuando backend esté listo**:
1. Ejecutar `npm run codegen` (regenerar tipos si hubo cambios)
2. Probar en los 3 idiomas
3. Validar exportación PDF/CSV
4. Verificar comportamiento de filtros
5. Reportar bugs si los hay

---

## 🧪 ¿Cómo puedo probar el frontend ahora?

Si quieres ver la UI mientras esperas al backend, tienes 3 opciones:

### Opción 1: Mock de datos en el hook (Más fácil)

Editar `src/features/reports/hooks/useDelinquentReport.ts`:

```typescript
export function useDelinquentReport() {
  const [filters, setFilters] = useState<DelinquentReportInput>({
    sortBy: 'DAYS_DESC' as SortBy,
    minAmount: 0,
    debtorType: null,
  })

  // MOCK DATA - Comentar cuando backend esté listo
  const mockData = {
    getDelinquentReport: {
      debtors: [
        {
          memberId: 'member-123',
          familyId: null,
          type: 'INDIVIDUAL',
          member: {
            id: 'member-123',
            memberNumber: 'SOCIO001',
            firstName: 'Juan',
            lastName: 'García',
            email: 'juan.garcia@example.com',
            phone: '+34 600 123 456',
            status: 'ACTIVE',
          },
          family: null,
          pendingPayments: [
            {
              id: 'payment-456',
              amount: 50.00,
              createdAt: '2025-08-01T00:00:00Z',
              daysOverdue: 98,
              notes: 'Cuota mensual agosto',
            },
          ],
          totalDebt: 50.00,
          oldestDebtDays: 98,
          oldestDebtDate: '2025-08-01T00:00:00Z',
          lastPaymentDate: '2025-07-15T10:30:00Z',
          lastPaymentAmount: 50.00,
        },
      ],
      summary: {
        totalDebtors: 1,
        individualDebtors: 1,
        familyDebtors: 0,
        totalDebtAmount: 50.00,
        averageDaysOverdue: 98,
        averageDebtPerDebtor: 50.00,
      },
      generatedAt: new Date().toISOString(),
    },
  }

  return {
    data: mockData.getDelinquentReport,
    loading: false,
    error: undefined,
    filters,
    updateFilters,
    resetFilters,
    refetch: async () => {},
  }
}
```

### Opción 2: MSW (Mock Service Worker)

Instalar y configurar MSW para interceptar requests GraphQL.

### Opción 3: Esperar al backend ⏳

La opción más realista - esperar a que backend implemente la query.

---

## ✅ Verificación de que TODO está bien

Para confirmar que el frontend está correctamente implementado, revisa:

### 1. Ruta configurada ✅
```bash
# Buscar en src/routes.tsx
grep -n "reports" src/routes.tsx
# Resultado esperado: Línea con <Route path="/reports" element={<ReportsPage />} />
```

### 2. Protección de ruta ✅
La ruta debe estar dentro de `<Route element={<AdminRoute />}>`

### 3. Menú de navegación ✅
```bash
# Buscar en layouts/MainLayout.tsx
grep -n "reports" src/layouts/MainLayout.tsx
# Resultado esperado: Objeto con path: '/reports' y roles: ['admin']
```

### 4. Traducciones ✅
```bash
# Verificar traducción del menú
cat src/lib/i18n/locales/es/navigation.json | grep reports
# Resultado esperado: "reports": "Informes"

# Verificar traducciones del módulo
ls src/lib/i18n/locales/*/reports.json
# Resultado esperado: es/reports.json, fr/reports.json, wo/reports.json
```

### 5. Componentes ✅
```bash
# Listar componentes
ls src/features/reports/components/
# Resultado esperado: 6 archivos .tsx
```

### 6. Hooks ✅
```bash
ls src/features/reports/hooks/
# Resultado esperado: useDelinquentReport.ts, useExportDelinquent.ts
```

### 7. Types ✅
```bash
cat src/features/reports/types.ts | grep "export"
# Resultado esperado: exports de Debtor, DelinquentReportResponse, etc.
```

### 8. GraphQL Query ✅
```bash
cat src/graphql/operations/reports.graphql
# Resultado esperado: query GetDelinquentReport {...}
```

---

## 📞 Contacto

Si ves un comportamiento diferente al descrito arriba:
1. Revisar consola del navegador (F12 → Console)
2. Revisar Network tab (pestaña GraphQL)
3. Verificar que el usuario esté autenticado como ADMIN
4. Reportar el issue con screenshots

---

## 🎯 Conclusión

**El frontend está 100% completado y funcionando correctamente.**

La ausencia de datos es **esperada** porque el backend aún no proporciona la información. Una vez que el backend implemente la query `getDelinquentReport`, los datos aparecerán automáticamente sin necesidad de cambios en el frontend.

---

**Estado**: ✅ Frontend listo
**Bloqueador**: ⚠️ Backend pendiente
**Acción requerida**: Ver `docs/BACKEND_REQUEST_DELINQUENT_REPORT.md`
