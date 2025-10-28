# 🗺️ Hoja de Ruta - ASAM Frontend

**Fecha de creación**: 18 de octubre de 2025  
**Última actualización**: 28 de octubre de 2025  
**Versión actual**: 0.1.0  
**Estado**: En desarrollo activo

---

## 📊 Estado Actual del Proyecto

### 🎯 Visión General
PWA (Aplicación Web Progresiva) para la gestión de la Asociación ASAM, construida con:
- React 18 + TypeScript + Vite
- Apollo Client (GraphQL)
- Material-UI
- React Router + Zustand
- Workbox (PWA)

### Progreso Global: ~67% completado ⬇️

---

## ✅ Funcionalidades Implementadas (65%)

### 1. ✅ Infraestructura Base (100%)
- [x] Configuración del proyecto (React 18 + TypeScript + Vite)
- [x] Apollo Client con conexión GraphQL
- [x] Material-UI como sistema de diseño
- [x] React Router con rutas protegidas
- [x] Zustand para estado global
- [x] PWA configurada con Service Worker
- [x] GraphQL Code Generator para tipado automático
- [x] Scripts de CI/CD (build, lint, testing)

### 2. ✅ Sistema de Autenticación (100%) ⬆️
- [x] Login con credenciales
- [x] Logout
- [x] Refresh automático de tokens
- [x] Rutas protegidas (`ProtectedRoute`)
- [x] Control de roles (admin/user)
- [x] **Protección de rutas admin-only (`AdminRoute`)** 🆕
- [x] **Redirección basada en roles** 🆕
- [x] Páginas de verificación de email
- [x] Páginas de reset de contraseña

**Archivos clave:**
```
src/stores/authStore.ts
src/components/auth/ProtectedRoute.tsx
src/components/auth/AdminRoute.tsx (nuevo)
src/pages/auth/*
```

### 3. ⚠️ Módulo de Miembros (90%) ⬇️
- [x] Listado con DataGrid avanzado (paginación, ordenamiento, filtros)
- [x] Creación de socios individuales
- [x] Creación de socios familiares (con cónyuge y familiares dinámicos)
- [x] Validación de fechas RFC3339
- [x] Control de permisos (solo admin)
- [x] Exportación a CSV (todos/filtrados/seleccionados)
- [x] Vista de detalles de socio
- [x] **Edición de socios existentes** ✅
- [x] **Acciones en tabla (Ver, Editar, Dar de baja)** ✅
- [x] **Diálogo de confirmación para dar de baja** ✅
- [x] **Restricción de acciones por rol** ✅
- [ ] 🔴 **CRÍTICO: Visualización de miembros de familia en página de detalles** - Ver bug identificado
- [ ] 🔴 **CRÍTICO: Visualización de miembros de familia en página de edición** - Ver bug identificado
- [ ] Eliminación definitiva de socios (individual y masiva)
- [x] **Página de pago inicial tras alta** ✅
- [ ] Gestión completa de familias (CRUD)

**Archivos clave:**
```
src/features/members/*
src/pages/MembersPage.tsx
src/pages/members/NewMemberPage.tsx
src/pages/members/MemberDetailsPage.tsx
src/pages/members/EditMemberPage.tsx (nuevo)
src/features/members/components/MembersTable.tsx (actualizado)
src/features/members/components/ConfirmDeactivateDialog.tsx (nuevo)
```

**Cambios recientes (26/10/2025)**:
- ✅ Implementada página de edición de socios con validación completa
- ✅ Añadidas tres acciones en la tabla: Ver detalles, Editar, Dar de baja
- ✅ Creado diálogo de confirmación para cambio de estado a INACTIVE
- ✅ Botón "Dar de baja" se deshabilita automáticamente para socios inactivos
- ✅ Acciones de editar y dar de baja solo visibles para administradores

### 4. ✅ Sistema de Permisos y Navegación (100%) 🆕
- [x] **Navegación adaptada por roles** 🆕
- [x] **Filtrado de menú según permisos** 🆕
- [x] **Protección de rutas admin-only** 🆕
- [x] **Redirección inteligente según rol** 🆕

**Estructura de permisos**:

**Solo Admin:**
- Panel de control (Dashboard)
- Usuarios (Users)
- Informes (Reports)

**Todos los usuarios:**
- Socios (Members)
- Pagos (Payments)
- Flujo de Caja (Cash Flow)

**Archivos clave:**
```
src/layouts/MainLayout.tsx (actualizado)
src/routes.tsx (actualizado)
src/components/auth/AdminRoute.tsx (nuevo)
```

### 5. ⚠️ Módulo de Usuarios (30%)
- [x] Página básica creada (`UsersPage.tsx`)
- [x] Restricción solo para admin
- [ ] CRUD completo de usuarios
- [ ] Gestión de roles y permisos

### 6. ⚠️ Módulo de Pagos (40%) ⬆️
- [x] Página de pago inicial tras alta de socio
- [x] **Listado completo de pagos con filtros** ✅
- [x] **Confirmación de pagos pendientes (PENDING → PAID)** ✅
- [x] **Sistema de búsqueda unificado (socios/familias)** ✅
- [x] **Navegación a detalles de socio desde pagos individuales** ✅ 🆕
- [x] **Mensaje informativo para pagos de familia (página no implementada)** ✅ 🆕
- [ ] Generación de recibos PDF
- [ ] Cuotas masivas mensuales
- [ ] Historial de pagos por socio
- [ ] Navegación a detalles de familia desde pagos de familia

**Archivos clave:**
```
src/pages/PaymentsPage.tsx
src/features/payments/components/PaymentsTable.tsx
src/features/payments/components/PaymentFilters.tsx
src/features/payments/components/ConfirmPaymentDialog.tsx
src/features/payments/hooks/usePayments.ts
src/features/payments/hooks/useSearchMemberOrFamily.ts
```

### 7. ⚠️ Otros Módulos Pendientes (0-10%)
- [ ] **CashFlow**: Página creada pero sin funcionalidad
- [ ] **Reports**: Página creada pero sin funcionalidad
- [ ] **Dashboard**: Página básica, faltan métricas y estadísticas

---

## 🎯 Roadmap para Primera Versión Útil (MVP)

### 🔴 FASE 1: Completar Módulo de Socios (~2-3 días restantes) ⬆️

#### ✅ **Edición de Socios** - COMPLETADO 🎉
```
Estado: ✅ COMPLETADO (26/10/2025)
Tiempo real: 2 días
```

**Implementado**:
- ✅ Página `/members/:id/edit` con formulario completo
- ✅ Carga de datos existentes del socio
- ✅ Validación completa de campos
- ✅ Mutation GraphQL `UpdateMember`
- ✅ Manejo de errores detallado
- ✅ Breadcrumbs de navegación
- ✅ Feedback visual (success/error)

---

#### ✅ **Sistema de Acciones en Tabla** - COMPLETADO 🎉
```
Estado: ✅ COMPLETADO (26/10/2025)
Tiempo real: 1 día
```

**Implementado**:
- ✅ Tres acciones en columna "Acciones": Ver, Editar, Dar de baja
- ✅ Permisos por rol (editar y dar de baja solo para admin)
- ✅ Ancho de columna dinámico según rol
- ✅ Tooltips descriptivos en cada acción
- ✅ Navegación a página de edición funcional

---

#### ✅ **Diálogo de Confirmación para Baja** - COMPLETADO 🎉
```
Estado: ✅ COMPLETADO (26/10/2025)
Tiempo real: 1 día
```

**Implementado**:
- ✅ Componente `ConfirmDeactivateDialog`
- ✅ Muestra datos del socio (nombre, número)
- ✅ Mensaje de advertencia claro
- ✅ Mutation GraphQL `ChangeMemberStatus`
- ✅ Actualización automática de lista tras operación
- ✅ Notificaciones con notistack
- ✅ Prevención de cierre durante operación
- ✅ Botón deshabilitado para socios ya inactivos

---

#### ✅ **REQ-2.5: Página de Pago Inicial** - COMPLETADO 🎉
```
Estado: ✅ COMPLETADO (27/10/2025)
Tiempo real: 1 día
```

**Implementado**:
- ✅ Página `/payments/initial/:memberId` con flujo completo
- ✅ Formulario de registro de pago con validación
- ✅ Mutation GraphQL `RegisterPayment` integrada
- ✅ Estado inicial: PENDING (pendiente de confirmación)
- ✅ Redirección automática tras alta de socio
- ✅ Prevención de pagos duplicados (sessionStorage)
- ✅ Resumen visual tras registro exitoso
- ✅ Manejo robusto de errores con mensajes específicos
- ✅ Validación de monto máximo (€1000)
- ✅ Type safety con PaymentStatus enum
- ✅ Integración con datos de familia/socio individual

**Mejoras Críticas Implementadas (27/10/2025)** 🆕:
- ✅ Constante MAX_PAYMENT_AMOUNT centralizada
- ✅ Validación HTML5 + Yup Schema para monto máximo
- ✅ Error handling avanzado (network, auth, validation)
- ✅ Mensajes de error accionables en español
- ✅ Tipado estricto con PaymentStatus

**Archivos clave**:
```
src/pages/payments/InitialPaymentPage.tsx
src/features/payments/components/InitialPaymentForm.tsx
src/features/payments/components/PaymentSummary.tsx
src/features/payments/hooks/usePaymentForm.ts
src/features/payments/hooks/useMemberData.ts
src/features/payments/types.ts
src/features/payments/utils.ts
src/graphql/operations/payments.graphql
```

**Nota**: Confirmación manual por admin y generación de recibos PDF se implementarán en FASE 2 (Módulo de Pagos Completo) junto con el listado general de pagos.

---

#### **Eliminación Definitiva de Socios**
```
Prioridad: MEDIA-BAJA
Tiempo estimado: 1 día
Complejidad: Baja
Estado: 🟡 OPCIONAL (para post-MVP)
```

**Nota**: Con el sistema de dar de baja (cambiar a INACTIVE) implementado, la eliminación definitiva puede posponerse. Los socios inactivos quedan en el sistema para mantener historial.

**Tareas** (si se decide implementar):
- [ ] Botón de eliminar definitivamente en vista de detalles
- [ ] Diálogo de confirmación con múltiples advertencias
- [ ] Mutation GraphQL `DeleteMember`
- [ ] Eliminación masiva desde tabla (checkboxes)
- [ ] Verificación de dependencias (pagos, familias)

---

#### 🔴 **Visualización de Miembros de Familia** - BUG CRÍTICO IDENTIFICADO
```
Prioridad: CRÍTICA
Tiempo estimado: 1-2 días
Complejidad: Media-Alta
Estado: 🔴 PENDIENTE
Impacto: ALTO - Funcionalidad core no operativa
```

**Problema identificado (28/10/2025)**:
Cuando se accede desde la **Gestión de Socios** a las páginas de **Detalles del Socio** o **Editar Socio** de un miembro de tipo FAMILY:

**Lo que SÍ funciona:**
- ✅ Navegación desde la tabla de socios a detalles
- ✅ Navegación desde la tabla de socios a edición
- ✅ Se cargan los datos del titular (esposo/esposa)
- ✅ Los formularios funcionan correctamente

**Lo que NO funciona (BUG CRÍTICO):**
- ❌ **NO se muestran los miembros de la familia** (familiares adicionales) en página de detalles
- ❌ **NO se muestran los miembros de la familia** en página de edición
- ❌ No hay sección visible para los familiares vinculados
- ❌ Información crítica completamente invisible para el usuario
- ❌ Imposible verificar qué familiares están asociados a una familia
- ❌ Imposible editar datos de familiares desde la interfaz

**Impacto en el sistema:**
- Los usuarios no pueden ver la composición completa de las familias
- No pueden verificar si los datos de los familiares son correctos
- La funcionalidad de familias queda incompleta e inutilizable
- Bloquea casos de uso críticos del negocio

**Tareas de implementación**:
1. [ ] **Investigación Backend**
   - Revisar estructura de datos de Family en GraphQL schema
   - Verificar query para obtener familiares asociados
   - Confirmar relación entre Member, Family y FamilyMember

2. [ ] **Crear Componente de Visualización**
   - Crear `FamilyMembersList.tsx` para mostrar tabla de familiares
   - Diseño consistente con Material-UI DataGrid
   - Columnas: Nombre, Apellidos, Fecha Nacimiento, DNI/NIE, Email, Relación
   - Estado de carga y manejo de errores

3. [ ] **Integración en MemberDetailsPage**
   - Añadir sección "Miembros de la Familia" condicionalmente (solo FAMILY)
   - Query GraphQL para cargar familiares
   - Mostrar mensaje si no hay familiares asociados
   - Card separada con título claro

4. [ ] **Integración en EditMemberPage**
   - Añadir misma sección de visualización
   - Considerar funcionalidad de edición inline (futuro)
   - Por ahora solo visualización en modo lectura

5. [ ] **Testing**
   - Probar con familias con múltiples miembros
   - Probar con familias sin miembros adicionales
   - Verificar que no aparece para socios individuales
   - Testing de errores de red

**Archivos a crear/modificar**:
```
src/pages/members/MemberDetailsPage.tsx (modificar)
src/pages/members/EditMemberPage.tsx (modificar)
src/features/members/components/FamilyMembersList.tsx (NUEVO)
src/features/members/hooks/useFamilyMembers.ts (NUEVO - si es necesario)
src/graphql/operations/families.graphql (modificar/crear)
```

**Queries GraphQL necesarias**:
```graphql
query GetFamilyMembers($familyId: ID!) {
  family(id: $familyId) {
    id
    familyMembers {
      id
      firstName
      lastName
      dateOfBirth
      idNumber
      email
      relationship
    }
  }
}
```

**Criterios de aceptación**:
- [ ] En MemberDetailsPage de un socio FAMILY se ven todos los familiares asociados
- [ ] En EditMemberPage de un socio FAMILY se ven todos los familiares asociados
- [ ] La tabla de familiares es clara y fácil de leer
- [ ] Se muestra un mensaje apropiado si no hay familiares
- [ ] No aparece la sección para socios INDIVIDUAL
- [ ] Manejo correcto de estados de carga y error
- [ ] Diseño coherente con el resto de la aplicación

**Nota**: Este es un **BUG CRÍTICO** que impide el uso completo del módulo de familias, que es una funcionalidad core del sistema. Debe priorizarse inmediatamente después de completar el módulo de pagos básico.

---

### 🟡 FASE 2: Módulo de Pagos Completo (1 semana)

#### ✅ **SUB-FASE 2.1: Listado Básico de Pagos** - COMPLETADO 🎉
```
Estado: ✅ COMPLETADO (27/10/2025)
Tiempo real: 1 día
```

**Implementado**:
- ✅ DataGrid con pagos de todos los socios
- ✅ Filtros avanzados: estado, fecha, método de pago, socio
- ✅ Ordenamiento por columnas
- ✅ Paginación del lado del servidor
- ✅ Acciones por fila: ver detalle, confirmar
- ✅ Hook `usePayments` con integración GraphQL
- ✅ Hook `usePaymentFilters` para gestión de estado
- ✅ Componentes `PaymentsTable` y `PaymentFilters`
- ✅ Chips de estado con colores semánticos

**Archivos creados**:
```
src/features/payments/components/PaymentsTable.tsx
src/features/payments/components/PaymentFilters.tsx
src/features/payments/components/PaymentStatusChip.tsx
src/features/payments/hooks/usePayments.ts
src/features/payments/hooks/usePaymentFilters.ts
src/features/payments/types.ts
```

---

#### ✅ **SUB-FASE 2.2.5: Navegación desde Pagos** - COMPLETADO 🎉
```
Estado: ✅ COMPLETADO (28/10/2025)
Tiempo real: 0.5 día
```

**Implementado**:
- ✅ Botón "Ver detalles" funcional en tabla de pagos
- ✅ Navegación a `/members/{memberId}` para pagos individuales
- ✅ Snackbar informativo para pagos de familia (página no implementada)
- ✅ Añadidos `memberId` y `familyId` a `PaymentListItem`
- ✅ Actualizado hook `usePayments` para incluir IDs
- ✅ Manejo diferenciado de pagos individuales vs familiares

**Problema solucionado**:
El botón "Ver detalles" en la tabla de pagos no hacía nada visible. Ahora:
- Para **pagos individuales** → Navega correctamente a detalles del socio
- Para **pagos de familia** → Muestra mensaje: "La página de detalles de familias estará disponible próximamente"

**Archivos modificados**:
```
src/pages/PaymentsPage.tsx
src/features/payments/types.ts
src/features/payments/hooks/usePayments.ts
```

**Próximo paso**: Implementar página de detalles de familias para completar la navegación.

---

#### ✅ **SUB-FASE 2.2: Confirmación de Pagos Pendientes** - COMPLETADO 🎉
```
Estado: ✅ COMPLETADO (27/10/2025)
Tiempo real: 0.5 día
```

**Implementado**:
- ✅ Diálogo de confirmación con todos los detalles del pago
- ✅ Mutation GraphQL `ConfirmPayment`
- ✅ Hook `useConfirmPayment` con manejo de errores
- ✅ Integración completa en `PaymentsPage`
- ✅ Refetch automático tras confirmación exitosa
- ✅ Cambio de estado PENDING → PAID
- ✅ Notificaciones de éxito/error con notistack
- ✅ Prevención de múltiples clics durante confirmación
- ✅ Hook `useSearchMemberOrFamily` para búsqueda unificada

**Archivos creados**:
```
src/features/payments/components/ConfirmPaymentDialog.tsx
src/features/payments/hooks/useConfirmPayment.ts
src/features/payments/hooks/useSearchMemberOrFamily.ts
```

**Archivos modificados**:
```
src/pages/PaymentsPage.tsx (integración del diálogo)
src/graphql/operations/payments.graphql (mutation ConfirmPayment)
```

---

#### **SUB-FASE 2.3: Generación de Recibos PDF** 🔴 SIGUIENTE
```
Prioridad: ALTA
Tiempo estimado: 1 día
Complejidad: Media
Estado: 🔴 PENDIENTE
```

**Objetivo**: Generar recibos profesionales en PDF descargables.

**Tareas**:
- [ ] Librería de generación PDF (jsPDF o react-pdf)
- [ ] Componente `ReceiptGenerator`
- [ ] Template de recibo con logo ASAM
- [ ] Datos del socio/familia
- [ ] Detalles del pago (monto, fecha, método)
- [ ] Número de recibo único
- [ ] Botón "Descargar Recibo" en tabla
- [ ] Generación automática al confirmar pago (opcional)

---

#### **SUB-FASE 2.4: Cuotas Masivas Mensuales**
```
Prioridad: MEDIA-ALTA
Tiempo estimado: 1 día
Complejidad: Media
Estado: 🟡 PENDIENTE
```

**Tareas**:
- [ ] Botón "Generar Cuotas Mensuales" en PaymentsPage
- [ ] Diálogo de confirmación con preview
- [ ] Mutation GraphQL `GenerateMonthlyFees`
- [ ] Crear pagos PENDING para todos los socios activos
- [ ] Progreso visual durante generación
- [ ] Resumen de cuotas generadas
- [ ] Prevención de duplicados (verificar mes/año)

---

#### **SUB-FASE 2.5: Historial de Pagos por Socio**
```
Prioridad: MEDIA
Tiempo estimado: 0.5 día
Complejidad: Baja
Estado: 🟡 PENDIENTE
```

**Tareas**:
- [ ] Sección en MemberDetailsPage
- [ ] Tabla compacta con últimos pagos
- [ ] Total pagado acumulado
- [ ] Filtro de periodo (año, mes)
- [ ] Link a PaymentsPage con filtro pre-aplicado

---

### 🟢 FASE 3: Dashboard y Reportes (3-4 días)

#### **REQ-3.5: Dashboard con Métricas**
```
Prioridad: MEDIA-ALTA
Tiempo estimado: 2 días
Complejidad: Media
Estado: 🟡 PENDIENTE
```

**Métricas principales**:
- [ ] Total de socios (activos/inactivos)
- [ ] Balance actual (ingresos - gastos)
- [ ] Gráfico de evolución mensual
- [ ] Socios con pagos pendientes (alerta)
- [ ] Últimos movimientos de caja
- [ ] Próximos vencimientos

**Archivos a modificar**:
```
src/pages/DashboardPage.tsx
src/features/dashboard/
├── components/
│   ├── MetricsCards.tsx
│   ├── BalanceChart.tsx
│   ├── PendingPaymentsAlert.tsx
│   └── RecentTransactions.tsx
└── hooks/
    └── useDashboardData.ts
```

---

#### **REQ-3.4: Reportes Básicos**
```
Prioridad: MEDIA
Tiempo estimado: 2 días
Complejidad: Media
Estado: 🟡 PENDIENTE
```

**Reportes a implementar**:
1. **Listado de Morosos**
   - [ ] Socios con cuotas vencidas
   - [ ] Deuda total por socio
   - [ ] Meses de atraso
   - [ ] Exportar a CSV/PDF

2. **Reporte de Ingresos**
   - [ ] Filtro por periodo
   - [ ] Desglose por tipo de pago
   - [ ] Gráfico de tendencia
   - [ ] Total del periodo

3. **Reporte de Gastos**
   - [ ] Filtro por periodo
   - [ ] Desglose por categoría
   - [ ] Comparación con periodos anteriores

**Archivos a crear**:
```
src/pages/ReportsPage.tsx (rediseñar)
src/features/reports/
├── components/
│   ├── DelinquentMembersReport.tsx
│   ├── IncomeReport.tsx
│   ├── ExpensesReport.tsx
│   └── ExportReportButton.tsx
└── hooks/
    └── useReports.ts
```

---

### 🟢 FASE 4: Flujo de Caja (3-4 días)

#### **REQ-3.3: Módulo de Cash Flow**
```
Prioridad: MEDIA
Tiempo estimado: 3 días
Complejidad: Media
Estado: 🟡 PENDIENTE
```

**Funcionalidades**:
1. **Registro de Transacciones**
   - [ ] Formulario para ingresos
   - [ ] Formulario para gastos
   - [ ] Categorización (cuotas, donaciones, gastos operativos, etc)
   - [ ] Fecha y concepto
   - [ ] Adjuntar comprobante (opcional)

2. **Visualización de Balance**
   - [ ] Balance actual
   - [ ] Gráfico de evolución
   - [ ] Filtros por periodo y categoría
   - [ ] Exportar a CSV/PDF

3. **Listado de Transacciones**
   - [ ] Tabla con todas las transacciones
   - [ ] Filtros avanzados
   - [ ] Edición y eliminación
   - [ ] Búsqueda

**Archivos a crear**:
```
src/pages/CashFlowPage.tsx (rediseñar)
src/features/cashflow/
├── components/
│   ├── TransactionForm.tsx
│   ├── TransactionsList.tsx
│   ├── BalanceCard.tsx
│   └── BalanceChart.tsx
├── hooks/
│   └── useCashFlow.ts
└── api/
    ├── queries.ts
    └── mutations.ts
```

**Nota Importante**: El backend debe filtrar automáticamente por usuario cuando `role !== 'admin'`

---

### 🔵 FASE 5: Mejoras de PWA y UX (Post-MVP) 🆕

#### **REQ-5.1: Setup Básico de PWA**
```
Prioridad: MEDIA-ALTA
Tiempo estimado: 2-3 días
Complejidad: Media
Estado: 🟡 PENDIENTE
```

**Objetivo**: Convertir la app en una verdadera PWA con funcionalidad offline básica.

**Tareas**:
1. **Manifest.json Optimizado**
   - [ ] Configurar manifest con todos los campos requeridos
   - [ ] Generar iconos en todos los tamaños necesarios (192x192, 512x512)
   - [ ] Añadir iconos maskables para Android
   - [ ] Configurar colores de tema (theme_color, background_color)
   - [ ] Definir start_url optimizada según rol

2. **Service Worker con Workbox**
   - [ ] Configurar estrategia de caché para assets estáticos
   - [ ] Implementar App Shell caching
   - [ ] Página offline personalizada
   - [ ] Estrategia Stale-While-Revalidate para datos dinámicos

3. **Capacidad de Instalación**
   - [ ] Prompt de instalación personalizado
   - [ ] Detección de estado de instalación
   - [ ] Banner "Añadir a pantalla de inicio"

4. **Funcionalidad Offline Básica**
   - [ ] Caché de lista de socios (lectura)
   - [ ] Caché de detalles de socio
   - [ ] Indicador visual de modo offline
   - [ ] Mensajes informativos cuando offline

**Archivos a crear/modificar**:
```
public/manifest.json
public/icons/ (192x192, 512x512, maskable)
src/service-worker.ts
src/components/common/OfflineIndicator.tsx
src/components/common/InstallPrompt.tsx
vite.config.ts (configuración PWA)
```

---

#### **REQ-5.2: Accesibilidad (WCAG 2.1 AA)**
```
Prioridad: MEDIA
Tiempo estimado: 3-4 días
Complejidad: Media
Estado: 🟡 PENDIENTE
```

**Tareas**:
1. **Auditoría de Accesibilidad**
   - [ ] Ejecutar Lighthouse audit
   - [ ] Revisar con WAVE tool
   - [ ] Testing con lectores de pantalla (NVDA/JAWS)

2. **Correcciones Prioritarias**
   - [ ] Navegación completa por teclado
   - [ ] Focus indicators visibles
   - [ ] ARIA labels en componentes dinámicos
   - [ ] Contraste de colores AAA en textos importantes
   - [ ] Alternativas de texto para iconos

3. **Testing y Validación**
   - [ ] Tests automatizados con jest-axe
   - [ ] Manual testing con VoiceOver/NVDA
   - [ ] Verificación con usuarios reales

---

#### **REQ-5.3: Optimización de Rendimiento**
```
Prioridad: MEDIA
Tiempo estimado: 2-3 días
Complejidad: Media
Estado: 🟡 PENDIENTE
```

**Tareas**:
1. **Presupuesto de Rendimiento**
   - [ ] Definir métricas objetivo (TTI < 5s, FCP < 2s)
   - [ ] Setup de monitoreo continuo

2. **Code Splitting Avanzado**
   - [ ] División por rutas con React.lazy
   - [ ] División por componentes pesados
   - [ ] Lazy loading de componentes de tabla

3. **Optimización de Assets**
   - [ ] Compresión de imágenes (WebP/AVIF)
   - [ ] Minificación agresiva
   - [ ] Tree shaking optimizado

4. **Auditoría y Mejoras**
   - [ ] Análisis de bundle con Rollup visualizer
   - [ ] Identificar dependencias pesadas
   - [ ] Implementar mejoras incrementales

---

### 🔵 FASE 6: Funcionalidades Secundarias (Post-MVP)

#### **REQ-3.1: Gestión Completa de Familias**
```
Prioridad: MEDIA-BAJA
Tiempo estimado: 2 días
Estado: 🟡 PENDIENTE
```

- [ ] Vista independiente de familias
- [ ] CRUD completo de familias
- [ ] Añadir/quitar miembros dinámicamente
- [ ] Cambio de titular
- [ ] Historial de cambios

---

#### **Gestión de Usuarios Admin**
```
Prioridad: BAJA
Tiempo estimado: 2 días
Estado: 🟡 PENDIENTE
```

- [ ] CRUD de usuarios
- [ ] Asignación de roles
- [ ] Cambio de contraseña (admin reset)
- [ ] Log de actividad

---

#### **Sistema de Notificaciones**
```
Prioridad: MEDIA-BAJA
Tiempo estimado: 2-3 días
Estado: 🟡 PENDIENTE
```

- [ ] Notificaciones in-app para eventos importantes
- [ ] Push notifications (opcional, complejo)
- [ ] Sistema de alertas para admins
- [ ] Preferencias de notificaciones por usuario

---

#### **Testing Completo**
```
Prioridad: ALTA (para producción)
Tiempo estimado: 1 semana
Estado: 🟡 PENDIENTE
```

- [ ] Tests unitarios para componentes críticos
- [ ] Tests de integración para flujos clave
- [ ] Tests E2E con Playwright/Cypress
- [ ] Tests de accesibilidad automatizados
- [ ] Setup de CI/CD para tests

---

## 📅 Timeline Actualizado

### MVP Mínimo (1.5 semanas restantes) ⬆️
```
Sprint Actual (Semana en curso): Finalizar Módulo de Socios
├── ✅ Edición de socios - COMPLETADO
├── ✅ Sistema de acciones en tabla - COMPLETADO
├── ✅ Diálogo de confirmación baja - COMPLETADO
└── 🔴 Día 1-2: Página de pago inicial (REQ-2.5) - PENDIENTE

Sprint 2 (Semana siguiente): Módulo de Pagos Básico
├── Día 1-2: Listado y registro de pagos
├── Día 3: Confirmación y cuotas masivas
└── Día 4-5: Generación de recibos
```

### Versión Completa (3-4 semanas restantes)
```
Semana 3: Dashboard y Reportes
Semana 4: Flujo de Caja + PWA Setup Básico
Semana 5: Accesibilidad + Optimización
Semana 6: Testing + Pulido Final
```

---

## 🎯 Criterios de Éxito para MVP

### Funcional
- ✅ Alta completa de socios (individual y familiar)
- ✅ Edición de socios existentes
- ✅ Dar de baja socios (cambio a INACTIVE)
- ✅ Sistema de permisos por roles
- [ ] Registro de pago inicial
- [ ] Sistema básico de pagos (registro, confirmación, recibos)
- [ ] Dashboard con métricas principales

### Técnico
- ✅ Sin errores críticos en consola
- ✅ Tiempo de carga < 3 segundos
- ✅ Responsive en móvil y desktop
- [ ] PWA instalable y funcional offline (lectura)
- ✅ Sistema de permisos robusto

### Usuario
- ✅ Flujo completo sin interrupciones
- ✅ Interfaz intuitiva y consistente
- ✅ Feedback claro en cada acción
- ✅ Manejo de errores amigable
- ✅ Experiencia diferenciada por rol

---

## 📈 Métricas de Progreso

### Estado Actual (28/10/2025) ⬆️
```
Infraestructura:     ████████████████████ 100%
Autenticación:       ████████████████████ 100%
Permisos y Roles:    ████████████████████ 100%
Miembros:            ██████████████████░░  90% ⬇️
Pagos:               ████████░░░░░░░░░░░░  40% ⬆️
Dashboard:           ██░░░░░░░░░░░░░░░░░░  10%
Flujo de Caja:       ░░░░░░░░░░░░░░░░░░░░   0%
Reportes:            ░░░░░░░░░░░░░░░░░░░░   0%

TOTAL:               █████████████░░░░░░░  67% ⬇️
```

### Meta MVP (Estimado: 1.5 semanas)
```
Infraestructura:     ████████████████████ 100%
Autenticación:       ████████████████████ 100%
Permisos y Roles:    ████████████████████ 100%
Miembros:            ████████████████████ 100%
Pagos:               ████████████████░░░░  80%
Dashboard:           ████████████░░░░░░░░  60%
Flujo de Caja:       ░░░░░░░░░░░░░░░░░░░░   0%
Reportes:            ████░░░░░░░░░░░░░░░░  20%

TOTAL:               ██████████████░░░░░░  70%
```

---

## 🚀 Recomendación de Inicio Inmediato

### ⚡ Próximas Tareas Prioritarias

#### 1. **BUG CRÍTICO: Visualización de Miembros de Familia** 🔴
```
Prioridad: CRÍTICA (BLOQUEANTE)
Impacto: ALTO
Complejidad: MEDIA-ALTA
Tiempo estimado: 1-2 días
```

**¿Por qué es crítico?**
- Impide visualizar información completa de familias
- Bloquea casos de uso core del sistema
- Los usuarios no pueden verificar composición familiar
- Funcionalidad de familias incompleta e inutilizable

**¿Qué implica?**
- Investigar queries GraphQL de familias
- Crear componente `FamilyMembersList`
- Integrar en MemberDetailsPage
- Integrar en EditMemberPage
- Testing exhaustivo

**Ubicación en Roadmap**: Ver sección detallada en FASE 1

---

#### 2. **SUB-FASE 2.3: Generación de Recibos PDF** 🟡
```
Prioridad: ALTA
Impacto: ALTO
Complejidad: MEDIA
Tiempo estimado: 1 día
```

**¿Por qué es importante?**
- Completa el flujo de pagos básico
- Genera documentación oficial para socios
- Requisito legal/administrativo

**¿Qué implica?**
- Integrar librería de PDF (jsPDF/react-pdf)
- Crear template de recibo profesional
- Botón de descarga en tabla de pagos
- Generación automática opcional tras confirmación

**Nota**: Se puede avanzar con el listado de pagos en paralelo mientras se soluciona el bug de familias.

---

## 📝 Cambios Recientes (Log de Actualizaciones)

### 28 de Octubre de 2025 (Noche) 🆕

#### Bugs Críticos Identificados:
- 🔴 **BUG CRÍTICO DOCUMENTADO**: Visualización de miembros de familia
  - **Contexto**: Desde "Gestión de Socios" se puede acceder a "Detalles del Socio" y "Editar Socio"
  - **Problema 1**: En MemberDetailsPage NO se muestran los miembros de la familia
  - **Problema 2**: En EditMemberPage NO se muestran los miembros de la familia
  - **Impacto**: Imposible visualizar o gestionar la composición de las familias
  - **Estado**: Documentado detalladamente en FASE 1 del Roadmap
  - **Prioridad**: CRÍTICA - debe abordarse inmediatamente tras completar pagos básicos

#### Documentación Actualizada:
- ✅ Sección de "Visualización de Miembros de Familia" expandida con:
  - Descripción detallada del problema
  - Impacto en el sistema
  - Plan de implementación completo con 5 fases
  - Queries GraphQL necesarias
  - Criterios de aceptación claros
  - Lista de archivos a crear/modificar

#### Progreso:
- Módulo de Miembros: Se mantiene en 90% (bug no rompe funcionalidad existente, pero bloquea uso completo)
- **Nota**: La regresión es "técnica" - la funcionalidad implementada funciona, pero falta una pieza crítica

---

### 28 de Octubre de 2025 (Tarde)

#### Funcionalidades Añadidas:
- ✅ **Navegación desde Gestión de Pagos funcionando correctamente**
  - Botón "Ver detalles" navega a detalles del socio para pagos individuales
  - Snackbar informativo para pagos de familia
  - IDs de miembro/familia incluidos en tipos de Payment

#### Problemas Identificados:
- 🔴 **CRÍTICO**: Miembros de familia no visibles en página de detalles
- 🔴 **CRÍTICO**: Miembros de familia no visibles en página de edición
- Ambos problemas documentados extensamente en FASE 1

#### Progreso:
- Módulo de Pagos: 35% → 40% ⬆️
- Módulo de Miembros: 100% → 90% ⬇️ (regresión por bugs críticos identificados)
- **Total del Proyecto: 68% → 67%** ⬇️

---

### 28 de Octubre de 2025 (Mañana)

#### Commits Realizados:
1. `fix(payments): correct types in useSearchMemberOrFamily hook`
2. `feat(payments): integrate payment confirmation in PaymentsPage`

#### Funcionalidades Añadidas:
- ✅ Completada SUB-FASE 2.1: Listado Básico de Pagos
- ✅ Completada SUB-FASE 2.2: Confirmación de Pagos Pendientes
- ✅ Hook unificado de búsqueda socios/familias
- ✅ Sistema completo de filtros de pagos
- ✅ Tabla de pagos con acciones por fila
- ✅ Diálogo de confirmación totalmente funcional
- ✅ Tipado correcto con tipos generados de GraphQL

#### Progreso:
- Módulo de Pagos: 20% → 35% ⬆️
- **Total del Proyecto: 65% → 68%** ⬆️

---

### 27 de Octubre de 2025

#### Commits Realizados:
1. `feat(payments): improve type safety, validation and error handling`

#### Funcionalidades Añadidas:
- ✅ Completado REQ-2.5: Página de Pago Inicial
- ✅ Validación de monto máximo (€1000)
- ✅ Error handling robusto con mensajes específicos
- ✅ Type safety con PaymentStatus enum
- ✅ Prevención de pagos duplicados
- ✅ Integración completa con familias/individuales

#### Progreso:
- Módulo de Miembros: 95% → 100% ⬆️
- Módulo de Pagos: 10% → 20% ⬆️
- **Total del Proyecto: 60% → 65%** ⬆️

---

### 26 de Octubre de 2025

#### Commits Realizados:
1. `fix(users): corregir clave de traducción del botón cancelar`
2. `feat(members): add edit and deactivate actions to members table`
3. `feat(members): add confirmation dialog for member deactivation`
4. `feat(members): restrict edit and deactivate actions to admin users`
5. `feat(navigation): implement role-based navigation and redirection`
6. `feat(auth): add admin-only route protection for dashboard and admin pages`

#### Funcionalidades Añadidas:
- ✅ Página completa de edición de socios
- ✅ Tres acciones en tabla de socios (Ver, Editar, Dar de baja)
- ✅ Diálogo de confirmación para cambio de estado
- ✅ Sistema de permisos por rol en acciones
- ✅ Navegación filtrada por rol de usuario
- ✅ Protección de rutas admin-only
- ✅ Redirección inteligente según rol

#### Progreso:
- Módulo de Miembros: 75% → 95% ⬆️
- Sistema de Autenticación: 80% → 100% ⬆️
- Sistema de Permisos: 0% → 100% 🆕
- **Total del Proyecto: 45% → 60%** ⬆️

---

## 📝 Notas de Arquitectura

### Principios a Mantener
- ✅ Arquitectura Hexagonal (domain/application/infrastructure)
- ✅ Componentes desacoplados y reutilizables
- ✅ Hooks personalizados para lógica compleja
- ✅ Tipado estricto con TypeScript
- ✅ GraphQL types generados automáticamente
- ✅ Conventional Commits para control de versiones
- ✅ **Permisos basados en roles (RBAC)** 🆕
- ✅ **Separación clara de rutas públicas/privadas/admin** 🆕

### Mejoras Pendientes
- ⚠️ Implementar testing sistemático (cobertura < 10%)
- ⚠️ Añadir Storybook para componentes UI
- ⚠️ Mejorar estrategia offline (Service Worker avanzado)
- ⚠️ Optimizar bundle size (code splitting)
- ⚠️ Añadir logging estructurado
- ⚠️ **Implementar auditoría de acciones de usuario** 🆕

### Seguridad
- ✅ Autenticación JWT con refresh tokens
- ✅ Rutas protegidas en frontend
- ✅ Control de permisos por rol
- ⚠️ **PENDIENTE**: Backend debe validar permisos en todos los endpoints
- ⚠️ **PENDIENTE**: Backend debe filtrar datos por usuario en endpoints compartidos

---

## 📚 Referencias

### Documentación Relacionada
- [Informe de Inicio y Estrategia](./Informe%20de%20Inicio%20y%20Estrategia%20de%20Desarrollo.md)
- [Resumen de Fixes Implementados](./SUMMARY-All-Fixes-Implemented.md)
- [REQ-2.1: Exportación CSV](./REQ-2.1-CSV-Export-Implementation.md)
- [REQ-2.3: Lógica de Familias](./REQ-2.3-Family-Logic-Implementation.md)
- [Testing Guide](../TESTING_GUIDE.md)

### Backend API
- Documentación GraphQL: `/asam-backend/docs/frontend`
- Schema GraphQL: `http://localhost:8080/graphql`

---

**Última actualización**: 28 de octubre de 2025  
**Mantenido por**: Equipo de desarrollo ASAM Frontend
