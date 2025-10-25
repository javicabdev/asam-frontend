# 🗺️ Hoja de Ruta - ASAM Frontend

**Fecha de creación**: 18 de octubre de 2025  
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

### Progreso Global: ~45% completado

---

## ✅ Funcionalidades Implementadas (45%)

### 1. ✅ Infraestructura Base (100%)
- [x] Configuración del proyecto (React 18 + TypeScript + Vite)
- [x] Apollo Client con conexión GraphQL
- [x] Material-UI como sistema de diseño
- [x] React Router con rutas protegidas
- [x] Zustand para estado global
- [x] PWA configurada con Service Worker
- [x] GraphQL Code Generator para tipado automático
- [x] Scripts de CI/CD (build, lint, testing)

### 2. ✅ Sistema de Autenticación (80%)
- [x] Login con credenciales
- [x] Logout
- [x] Refresh automático de tokens
- [x] Rutas protegidas (`ProtectedRoute`)
- [x] Control de roles (admin/user)
- [x] Páginas de verificación de email
- [x] Páginas de reset de contraseña
- [ ] Testing completo del flujo de auth

**Archivos clave:**
```
src/stores/authStore.ts
src/components/auth/ProtectedRoute.tsx
src/pages/auth/*
```

### 3. ✅ Módulo de Miembros (75%)
- [x] Listado con DataGrid avanzado (paginación, ordenamiento, filtros)
- [x] Creación de socios individuales
- [x] Creación de socios familiares (con cónyuge y familiares dinámicos)
- [x] Validación de fechas RFC3339
- [x] Control de permisos (solo admin)
- [x] Exportación a CSV (todos/filtrados/seleccionados)
- [x] Vista de detalles de socio
- [ ] **Edición de socios existentes**
- [ ] **Eliminación de socios (individual y masiva)**
- [ ] **Página de pago inicial tras alta**
- [ ] Gestión completa de familias (CRUD)

**Archivos clave:**
```
src/features/members/*
src/pages/MembersPage.tsx
src/pages/members/NewMemberPage.tsx
src/pages/members/MemberDetailsPage.tsx
```

### 4. ⚠️ Módulo de Usuarios (30%)
- [x] Página básica creada (`UsersPage.tsx`)
- [ ] CRUD completo de usuarios
- [ ] Gestión de roles y permisos

### 5. ⚠️ Otros Módulos Pendientes (0-10%)
- [ ] **Payments**: Página creada pero sin funcionalidad
- [ ] **CashFlow**: Página creada pero sin funcionalidad
- [ ] **Reports**: Página creada pero sin funcionalidad
- [ ] **Dashboard**: Página básica, faltan métricas y estadísticas

---

## 🎯 Roadmap para Primera Versión Útil (MVP)

### 🔴 FASE 1: Completar Módulo de Socios (1 semana)

#### **REQ-2.5: Página de Pago Inicial** 🔴 CRÍTICO
```
Prioridad: ALTA
Tiempo estimado: 2-3 días
Complejidad: Media
```

**Objetivo**: Permitir registrar el pago inicial tras el alta de un socio.

**Tareas**:
- [ ] Crear página `/payments/initial/:memberId`
- [ ] Diseñar formulario de registro de pago en efectivo
- [ ] Implementar mutation GraphQL `CreatePayment`
- [ ] Estado inicial: "Pendiente"
- [ ] Permitir confirmación manual por admin
- [ ] Generar recibo en PDF tras confirmación
- [ ] Redirección automática tras alta de socio

**Archivos a crear/modificar**:
```
src/pages/payments/InitialPaymentPage.tsx (nuevo)
src/features/payments/components/PaymentForm.tsx (nuevo)
src/features/payments/api/mutations.ts (nuevo)
src/graphql/operations/payments.graphql (actualizar)
```

**Criterios de aceptación**:
- ✅ Tras crear un socio, se redirige automáticamente a pago inicial
- ✅ Admin puede registrar pago como "pendiente"
- ✅ Admin puede confirmar pago pendiente
- ✅ Se genera recibo PDF tras confirmación

---

#### **Edición de Socios**
```
Prioridad: ALTA
Tiempo estimado: 2 días
Complejidad: Media
```

**Objetivo**: Permitir corregir datos de socios existentes.

**Tareas**:
- [ ] Reutilizar componentes de `NewMemberPage`
- [ ] Implementar mutation GraphQL `UpdateMember`
- [ ] Cargar datos existentes en formulario
- [ ] Validación de cambios
- [ ] Actualizar familia si tipo cambia
- [ ] Manejo de errores y confirmación

**Archivos a crear/modificar**:
```
src/pages/members/EditMemberPage.tsx (nuevo)
src/features/members/api/mutations.ts (actualizar)
src/routes.tsx (añadir ruta)
```

**Criterios de aceptación**:
- ✅ Botón "Editar" en vista de detalles
- ✅ Formulario prellenado con datos actuales
- ✅ Validación completa de campos
- ✅ Actualización exitosa en base de datos

---

#### **Eliminación de Socios**
```
Prioridad: ALTA
Tiempo estimado: 1 día
Complejidad: Baja
```

**Tareas**:
- [ ] Botón de eliminar en vista de detalles
- [ ] Diálogo de confirmación con advertencias
- [ ] Mutation GraphQL `DeleteMember`
- [ ] Eliminación masiva desde tabla (checkboxes)
- [ ] Actualizar lista tras eliminación

**Archivos a modificar**:
```
src/pages/members/MemberDetailsPage.tsx
src/features/members/components/MembersTable.tsx
src/features/members/api/mutations.ts
```

**Criterios de aceptación**:
- ✅ Confirmación obligatoria antes de eliminar
- ✅ Eliminación individual funcional
- ✅ Eliminación masiva funcional
- ✅ Lista actualizada automáticamente

---

### 🟡 FASE 2: Módulo de Pagos Completo (1 semana)

#### **REQ-3.2: Sistema de Pagos** 🔴 CRÍTICO
```
Prioridad: ALTA
Tiempo estimado: 3-4 días
Complejidad: Alta
```

**Objetivo**: Sistema completo de gestión de pagos y cuotas.

**Componentes principales**:

1. **Listado de Pagos**
   - [ ] DataGrid con pagos de todos los socios
   - [ ] Filtros: estado, fecha, socio, tipo
   - [ ] Ordenamiento por columnas
   - [ ] Paginación
   - [ ] Acciones: ver detalle, confirmar, eliminar

2. **Registro de Pagos Individuales**
   - [ ] Formulario para registrar pago individual
   - [ ] Selección de socio
   - [ ] Tipo de pago (cuota mensual, inicial, extraordinaria)
   - [ ] Método de pago (efectivo, transferencia)
   - [ ] Monto y concepto
   - [ ] Estado inicial: "Pendiente"

3. **Cuotas Masivas Mensuales**
   - [ ] Botón "Generar cuotas del mes"
   - [ ] Crear pagos pendientes para todos los socios activos
   - [ ] Confirmación antes de generar
   - [ ] Progreso visual durante generación

4. **Historial de Pagos por Socio**
   - [ ] Tabla de pagos en vista de detalles del socio
   - [ ] Filtros y búsqueda
   - [ ] Total pagado

5. **Confirmación de Pagos**
   - [ ] Cambiar estado de "Pendiente" a "Confirmado"
   - [ ] Registro de fecha de confirmación
   - [ ] Generación automática de recibo

6. **Generación de Recibos**
   - [ ] PDF con datos del socio
   - [ ] Detalles del pago
   - [ ] Número de recibo único
   - [ ] Logo de la asociación
   - [ ] Descargar o enviar por email

**Archivos a crear**:
```
src/pages/PaymentsPage.tsx (rediseñar)
src/features/payments/
├── components/
│   ├── PaymentsList.tsx
│   ├── PaymentForm.tsx
│   ├── MassQuotasDialog.tsx
│   ├── ConfirmPaymentDialog.tsx
│   └── ReceiptGenerator.tsx
├── hooks/
│   ├── usePayments.ts
│   └── usePaymentMutations.ts
├── api/
│   ├── queries.ts
│   └── mutations.ts
└── types.ts
```

**Criterios de aceptación**:
- ✅ Registro de pagos individuales funcional
- ✅ Generación masiva de cuotas funcional
- ✅ Confirmación de pagos pendientes
- ✅ Generación de recibos en PDF
- ✅ Historial completo por socio

---

### 🟢 FASE 3: Dashboard y Reportes (3-4 días)

#### **REQ-3.5: Dashboard con Métricas**
```
Prioridad: MEDIA-ALTA
Tiempo estimado: 2 días
Complejidad: Media
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

---

### 🔵 FASE 5: Funcionalidades Secundarias (Post-MVP)

#### **REQ-3.1: Gestión Completa de Familias**
```
Prioridad: MEDIA-BAJA
Tiempo estimado: 2 días
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
```

- [ ] CRUD de usuarios
- [ ] Asignación de roles
- [ ] Cambio de contraseña (admin reset)
- [ ] Log de actividad

---

## 📅 Timeline Estimado

### MVP Mínimo (2 semanas)
```
Sprint 1 (Semana 1): Completar Módulo de Socios
├── Día 1-2: Página de pago inicial (REQ-2.5)
├── Día 3-4: Edición de socios
└── Día 5: Eliminación de socios

Sprint 2 (Semana 2): Módulo de Pagos Básico
├── Día 1-2: Listado y registro de pagos
├── Día 3: Confirmación y cuotas masivas
└── Día 4-5: Generación de recibos
```

### Versión Completa (4-5 semanas)
```
Semana 3: Dashboard y Reportes
Semana 4: Flujo de Caja
Semana 5: Pulido, Testing y Optimización
```

---

## 🎯 Criterios de Éxito para MVP

### Funcional
- ✅ Alta completa de socios (individual y familiar)
- ✅ Registro de pago inicial
- ✅ Edición y eliminación de socios
- ✅ Sistema básico de pagos (registro, confirmación, recibos)
- ✅ Dashboard con métricas principales

### Técnico
- ✅ Sin errores críticos en consola
- ✅ Tiempo de carga < 3 segundos
- ✅ Responsive en móvil y desktop
- ✅ PWA instalable y funcional offline (lectura)

### Usuario
- ✅ Flujo completo sin interrupciones
- ✅ Interfaz intuitiva y consistente
- ✅ Feedback claro en cada acción
- ✅ Manejo de errores amigable

---

## 📈 Métricas de Progreso

### Estado Actual (18/10/2025)
```
Infraestructura:     ████████████████████ 100%
Autenticación:       ████████████████░░░░  80%
Miembros:            ███████████████░░░░░  75%
Pagos:               ██░░░░░░░░░░░░░░░░░░  10%
Dashboard:           ██░░░░░░░░░░░░░░░░░░  10%
Flujo de Caja:       ░░░░░░░░░░░░░░░░░░░░   0%
Reportes:            ░░░░░░░░░░░░░░░░░░░░   0%

TOTAL:               ████████░░░░░░░░░░░░  45%
```

### Meta MVP (Estimado: 2 semanas)
```
Infraestructura:     ████████████████████ 100%
Autenticación:       ████████████████████ 100%
Miembros:            ████████████████████ 100%
Pagos:               ████████████████░░░░  80%
Dashboard:           ████████████░░░░░░░░  60%
Flujo de Caja:       ░░░░░░░░░░░░░░░░░░░░   0%
Reportes:            ████░░░░░░░░░░░░░░░░  20%

TOTAL:               ██████████████░░░░░░  70%
```

---

## 🚀 Recomendación de Inicio

### Orden de Implementación Sugerido

1. **Comenzar HOY**: REQ-2.5 - Página de Pago Inicial
   - Es crítico para completar el flujo de alta
   - Bloquea el resto del módulo de pagos
   - Tiempo: 2-3 días

2. **Siguiente**: Edición y Eliminación de Socios
   - Completa el CRUD básico
   - Permite corregir errores
   - Tiempo: 2-3 días

3. **Después**: Módulo de Pagos Completo
   - Core del negocio de la asociación
   - Tiempo: 3-4 días

4. **Finalmente**: Dashboard y Reportes Básicos
   - Da visibilidad al estado de la asociación
   - Tiempo: 3-4 días

---

## 📝 Notas de Arquitectura

### Principios a Mantener
- ✅ Arquitectura Hexagonal (domain/application/infrastructure)
- ✅ Componentes desacoplados y reutilizables
- ✅ Hooks personalizados para lógica compleja
- ✅ Tipado estricto con TypeScript
- ✅ GraphQL types generados automáticamente
- ✅ Conventional Commits para control de versiones

### Mejoras Pendientes
- ⚠️ Implementar testing sistemático (cobertura < 10%)
- ⚠️ Añadir Storybook para componentes UI
- ⚠️ Mejorar estrategia offline (Service Worker avanzado)
- ⚠️ Optimizar bundle size (code splitting)
- ⚠️ Añadir logging estructurado

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

**Última actualización**: 18 de octubre de 2025  
**Mantenido por**: Equipo de desarrollo ASAM Frontend
