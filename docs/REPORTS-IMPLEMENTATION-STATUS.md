# 📊 Estado de Implementación - Informe de Morosos

**Fecha**: 6 de noviembre de 2025
**Documento base**: `REPORTS-DELINQUENT-FRONTEND-REQUIREMENTS.md`
**Estado**: 🟡 EN PROGRESO (15% completado)

---

## ✅ COMPLETADO

### 1. Dependencias Instaladas
```bash
✅ jspdf v2.5.2
✅ jspdf-autotable v3.8.4
✅ @types/jspdf v2.0.0
```

### 2. Estructura de Carpetas Creada
```
src/features/reports/
├── components/     ✅ Creado
├── hooks/          ✅ Creado
├── utils/          ✅ Creado
└── types.ts        ✅ Implementado
```

### 3. Tipos TypeScript
✅ **Archivo**: `src/features/reports/types.ts`
- DebtorType enum
- SortBy enum
- DelinquentReportInput interface
- DebtorMemberInfo interface
- DebtorFamilyInfo interface
- PendingPayment interface
- Debtor interface
- DelinquentSummary interface
- DelinquentReportResponse interface

---

## 🔴 PENDIENTE DE IMPLEMENTAR

### 4. Archivos de Traducción (i18n)
**Prioridad**: ALTA

Crear 3 archivos con traducciones completas (referencia en documento de requisitos):

- `src/lib/i18n/locales/es/reports.json` - Español (372 líneas en doc)
- `src/lib/i18n/locales/fr/reports.json` - Francés (372 líneas en doc)
- `src/lib/i18n/locales/wo/reports.json` - Wolof (372 líneas en doc)

**Secciones necesarias**:
- delinquent.title, subtitle, generateReport, exportPDF, exportCSV
- delinquent.filters.* (cutoffDate, minAmount, debtorType, sortBy, reset)
- delinquent.sortOptions.* (amountDesc, amountAsc, daysDesc, daysAsc, nameAsc)
- delinquent.table.* (debtor, type, memberNumber, contact, totalDebt, oldestDebt, actions)
- delinquent.debtorType.* (individual, family)
- delinquent.summary.* (totalDebtors, individualDebtors, familyDebtors, totalDebt, etc.)
- delinquent.details.* (modal de detalles)
- delinquent.export.* (pdfFilename, csvFilename, success, error)
- delinquent.errors.* (loadFailed, unauthorized, retry)

**Acción**: Copiar contenido JSON desde líneas 274-575 del documento de requisitos.

---

### 5. Query GraphQL
**Prioridad**: ALTA
**Archivo**: `src/graphql/operations/reports.graphql`

```graphql
query GetDelinquentReport($input: DelinquentReportInput) {
  getDelinquentReport(input: $input) {
    debtors {
      memberId
      familyId
      type
      member { id, memberNumber, firstName, lastName, email, phone, status }
      family {
        id
        familyName
        primaryMember { id, memberNumber, firstName, lastName, email, phone }
        totalMembers
      }
      pendingPayments { id, amount, createdAt, daysOverdue, notes }
      totalDebt
      oldestDebtDays
      oldestDebtDate
      lastPaymentDate
      lastPaymentAmount
    }
    summary {
      totalDebtors
      individualDebtors
      familyDebtors
      totalDebtAmount
      averageDaysOverdue
      averageDebtPerDebtor
    }
    generatedAt
  }
}
```

**Después de crear**: Ejecutar `npm run codegen` para generar tipos TypeScript.

---

### 6. Utilidades
**Prioridad**: ALTA

#### 6.1 `src/features/reports/utils/delinquentFormatters.ts`
```typescript
// Formateo de moneda
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

// Formateo de fecha
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('es-ES')
}
```

#### 6.2 `src/features/reports/utils/delinquentExport.ts`
Implementar funciones (referencia: líneas 1108-1253 del documento):
- `exportToPDF(data, t)` - Genera PDF con jsPDF y autoTable
- `exportToCSV(data, t)` - Genera CSV con BOM UTF-8
- Funciones auxiliares: `getDebtorName`, `getDebtorMemberNumber`, `getDebtorContact`

---

### 7. Hooks

#### 7.1 `src/features/reports/hooks/useDelinquentReport.ts`
**Referencia**: Líneas 219-268 del documento

Hook principal que:
- Ejecuta query GraphQL `GET_DELINQUENT_REPORT`
- Gestiona filtros (cutoffDate, minAmount, debtorType, sortBy)
- Proporciona funciones `updateFilters` y `resetFilters`
- Usa `fetchPolicy: 'network-only'` para datos frescos

#### 7.2 `src/features/reports/hooks/useExportDelinquent.ts`
Hook para manejar exportación:
- `exportPDF()` - Llama a `exportToPDF` de utils
- `exportCSV()` - Llama a `exportToCSV` de utils
- Maneja estados de loading y errores
- Muestra snackbar de éxito/error

---

### 8. Componentes

#### 8.1 `DelinquentTable.tsx` (Líneas 704-878)
- Tabla DataGrid con columnas: Tipo, Deudor, Nº Socio, Contacto, Deuda Total, Atraso, Último Pago, Acciones
- Botón "Ver Detalles" abre `DebtDetailsDialog`
- Botón "Enviar Recordatorio" (disabled por ahora)
- Paginación, ordenamiento

#### 8.2 `DelinquentSummaryCards.tsx` (Líneas 883-979)
- 6 cards con estadísticas:
  - Total Morosos (People icon, rojo)
  - Socios Individuales (Person icon, naranja)
  - Familias (Group icon, naranja)
  - Deuda Total (Euro icon, rojo oscuro)
  - Promedio Días Atraso (Schedule icon)
  - Deuda Promedio (TrendingDown icon)

#### 8.3 `DelinquentFilters.tsx` (Líneas 984-1102)
- Panel lateral con filtros:
  - DatePicker para fecha de corte
  - TextField para importe mínimo
  - Select para tipo de deudor (Todos/Individual/Familia)
  - Select para ordenamiento (5 opciones)
  - Botón "Restablecer filtros"

#### 8.4 `DelinquentExportButtons.tsx`
```typescript
// Botones de exportación
<Button startIcon={<PictureAsPdf />} onClick={() => exportPDF(data)}>
  {t('delinquent.exportPDF')}
</Button>
<Button startIcon={<TableChart />} onClick={() => exportCSV(data)}>
  {t('delinquent.exportCSV')}
</Button>
```

#### 8.5 `DebtorTypeChip.tsx`
```typescript
// Chip visual para tipo de deudor
<Chip
  label={t(`delinquent.debtorType.${type.toLowerCase()}`)}
  color={type === 'INDIVIDUAL' ? 'primary' : 'secondary'}
  size="small"
/>
```

#### 8.6 `DebtDetailsDialog.tsx`
Modal con:
- Información del deudor (nombre, email, teléfono, familia)
- Lista de pagos pendientes (tabla)
- Información del último pago
- Botón cerrar

---

### 9. Página Principal

#### `src/pages/ReportsPage.tsx` (Líneas 586-700)
Rediseñar página completa con:
- Header (título + subtitle + fecha de generación)
- DelinquentSummaryCards
- DelinquentExportButtons (arriba derecha)
- Grid layout:
  - Columna izquierda (3/12): DelinquentFilters
  - Columna derecha (9/12): DelinquentTable o mensaje "No hay morosos"
- Loading state
- Error handling con retry button

---

### 10. Index de Exportación
**Archivo**: `src/features/reports/index.ts`

```typescript
// Componentes
export { DelinquentTable } from './components/DelinquentTable'
export { DelinquentFilters } from './components/DelinquentFilters'
export { DelinquentSummaryCards } from './components/DelinquentSummaryCards'
export { DelinquentExportButtons } from './components/DelinquentExportButtons'
export { DebtorTypeChip } from './components/DebtorTypeChip'
export { DebtDetailsDialog } from './components/DebtDetailsDialog'

// Hooks
export { useDelinquentReport } from './hooks/useDelinquentReport'
export { useExportDelinquent } from './hooks/useExportDelinquent'

// Types
export * from './types'
```

---

## 🧪 TESTING CHECKLIST

Después de implementar:

### Funcionalidad
- [ ] Query GraphQL devuelve datos correctamente
- [ ] Filtros funcionan (cutoffDate, minAmount, debtorType, sortBy)
- [ ] Cards de resumen calculan estadísticas correctas
- [ ] Tabla muestra todos los deudores
- [ ] Modal de detalles abre con información completa
- [ ] Exportación PDF genera archivo correcto
- [ ] Exportación CSV genera archivo correcto con BOM UTF-8

### i18n
- [ ] Cambiar a Español - todo traducido
- [ ] Cambiar a Francés - todo traducido
- [ ] Cambiar a Wolof - todo traducido
- [ ] Archivos exportados usan idioma activo
- [ ] Fechas formateadas según idioma

### Permisos
- [ ] Admin puede acceder a /reports
- [ ] User recibe error 403 o redirect

### Responsividad
- [ ] Móvil (320px) - filtros colapsables
- [ ] Tablet (768px) - layout adaptado
- [ ] Desktop (1920px) - uso completo del espacio

---

## 📋 ORDEN DE IMPLEMENTACIÓN RECOMENDADO

1. **Traducciones** (30 min) - Copiar JSON del documento
2. **GraphQL Query** (10 min) - Copiar query y ejecutar codegen
3. **Formatters** (15 min) - Funciones simples de formateo
4. **Hook principal** (30 min) - useDelinquentReport
5. **Exportación** (45 min) - delinquentExport.ts con jsPDF
6. **Componentes pequeños** (1 hora):
   - DebtorTypeChip
   - DelinquentExportButtons
   - DelinquentSummaryCards
7. **Componentes complejos** (2 horas):
   - DelinquentFilters
   - DelinquentTable
   - DebtDetailsDialog
8. **Página principal** (1 hora) - ReportsPage con layout completo
9. **Testing** (1 hora) - Probar todo el flujo en 3 idiomas

**Tiempo total estimado**: 6-8 horas (1 día)

---

## ⚠️ IMPORTANTE

### Dependencias del Backend
Esta implementación **REQUIERE** que el backend tenga:
- ✅ Query GraphQL `getDelinquentReport` implementada
- ✅ Tipos GraphQL coincidentes con `types.ts`
- ✅ Lógica de cálculo de días de atraso
- ✅ Permisos solo para admin

### Registro de namespace i18n
Después de crear las traducciones, registrar en `src/lib/i18n/index.ts`:
```typescript
import reportsEs from './locales/es/reports.json'
import reportsFr from './locales/fr/reports.json'
import reportsWo from './locales/wo/reports.json'

// Agregar al objeto resources
reports: {
  es: reportsEs,
  fr: reportsFr,
  wo: reportsWo,
}
```

---

## 📚 REFERENCIAS

- **Documento completo**: `docs/REPORTS-DELINQUENT-FRONTEND-REQUIREMENTS.md`
- **Requisitos backend**: `docs/backend-requirements/REPORTS-DELINQUENT-BACKEND-REQUIREMENTS.md`
- **Componentes similares**:
  - `src/features/payments/` (estructura similar)
  - `src/features/members/` (DataGrid reference)
- **jsPDF docs**: https://github.com/parallax/jsPDF
- **jsPDF AutoTable**: https://github.com/simonbengtsson/jsPDF-AutoTable

---

**Próximo paso**: Crear archivos de traducción (3 archivos JSON) copiando desde el documento de requisitos.
