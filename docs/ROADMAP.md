# 🗺️ Hoja de Ruta - ASAM Frontend

**Fecha de creación**: 18 de octubre de 2024
**Última actualización**: 11 de enero de 2025 (Actualización de estado y reorganización)
**Versión actual**: 0.4.0
**Estado**: En desarrollo activo - Fases 1-4 completadas ✅

---

## 📊 Estado Actual del Proyecto

### 🎯 Visión General
PWA (Aplicación Web Progresiva) para la gestión de la Asociación ASAM, construida con:
- React 18 + TypeScript + Vite
- Apollo Client (GraphQL)
- Material-UI
- React Router + Zustand
- Workbox (PWA)
- i18next (Internacionalización)

### Progreso Global: ~87% completado ⬆️

---

## ✅ FASES COMPLETADAS (1-4)

### ✅ FASE 1: Infraestructura Base (100%) - COMPLETADA

**Objetivo**: Establecer las bases técnicas del proyecto

**Implementaciones**:
- ✅ Configuración del proyecto (React 18 + TypeScript + Vite)
- ✅ Apollo Client con conexión GraphQL
- ✅ Material-UI como sistema de diseño
- ✅ React Router con rutas protegidas
- ✅ Zustand para estado global
- ✅ PWA configurada con Service Worker
- ✅ GraphQL Code Generator para tipado automático
- ✅ Scripts de CI/CD (build, lint, testing)
- ✅ Configuración de ESLint y Prettier
- ✅ Sistema de gestión de tokens (refresh automático)

**Archivos clave**:
```
vite.config.ts
src/lib/apollo-client.ts
src/routes.tsx
src/stores/authStore.ts
package.json
```

**Fecha de completado**: Octubre 2024

---

### ✅ FASE 2: Sistema de Autenticación y Permisos (100%) - COMPLETADA

**Objetivo**: Implementar sistema robusto de autenticación con control de roles

**Implementaciones**:
- ✅ Login con credenciales
- ✅ Logout
- ✅ Refresh automático de tokens JWT
- ✅ Rutas protegidas (`ProtectedRoute`)
- ✅ Control de roles (admin/user)
- ✅ Protección de rutas admin-only (`AdminRoute`)
- ✅ Redirección basada en roles
- ✅ Páginas de verificación de email
- ✅ Páginas de reset de contraseña
- ✅ Navegación adaptada por roles
- ✅ Filtrado de menú según permisos
- ✅ Redirección inteligente según rol

**Estructura de permisos**:

**Solo Admin:**
- Panel de control (Dashboard)
- Usuarios (Users)
- Informes (Reports)
- Gestión de Flujo de Caja

**Todos los usuarios:**
- Socios (Members)
- Pagos (Payments)
- Visualización de Flujo de Caja (filtrado)

**Archivos clave**:
```
src/stores/authStore.ts
src/components/auth/ProtectedRoute.tsx
src/components/auth/AdminRoute.tsx
src/pages/auth/*
src/layouts/MainLayout.tsx
```

**Fecha de completado**: Octubre 2024

---

### ✅ FASE 3: Módulo de Socios (100%) - COMPLETADA

**Objetivo**: Gestión completa de socios individuales y familiares

**Implementaciones**:
- ✅ Listado con DataGrid avanzado (paginación, ordenamiento, filtros)
- ✅ Creación de socios individuales
- ✅ Creación de socios familiares (con cónyuge y familiares dinámicos)
- ✅ Validación de fechas RFC3339
- ✅ Control de permisos (solo admin puede crear/editar)
- ✅ Exportación a CSV (todos/filtrados/seleccionados)
- ✅ Vista de detalles de socio completa
- ✅ Visualización completa de miembros de familia
- ✅ Edición de socios existentes
- ✅ Edición de familiares (modal funcional)
- ✅ Acciones en tabla (Ver, Editar, Dar de baja)
- ✅ Diálogo de confirmación para dar de baja
- ✅ Restricción de acciones por rol
- ✅ Validación de email unificada (frontend-backend)
- ✅ Página de pago inicial tras alta

**Componentes de Familias Implementados:**
- ✅ Sección "Miembros de la Familia" en MemberDetailsPage
- ✅ Visualización de cónyuges con chips
- ✅ Tabla de familiares adicionales con todos los datos
- ✅ Modal "Editar Familiar" funcional en EditMemberPage
- ✅ Botones de editar/eliminar por familiar
- ✅ Botón "+ Añadir Familiar"

**Archivos clave**:
```
src/features/members/*
src/pages/MembersPage.tsx
src/pages/members/NewMemberPage.tsx
src/pages/members/MemberDetailsPage.tsx
src/pages/members/EditMemberPage.tsx
src/features/members/components/MembersTable.tsx
src/features/members/components/FamilyMembersList.tsx
```

**Fecha de completado**: Octubre 2024

---

### ✅ FASE 4: Módulo de Pagos e Internacionalización (100%) - COMPLETADA

**Objetivo**: Sistema completo de gestión de pagos con soporte multiidioma

#### Módulo de Pagos (100%)

**Implementaciones**:
- ✅ Página de pago inicial tras alta de socio
- ✅ Listado completo de pagos con filtros avanzados
- ✅ Confirmación de pagos pendientes (PENDING → PAID)
- ✅ Confirmación con fecha, notas y **monto editable**
- ✅ **Monto editable en pago inicial de cuota de alta**
- ✅ **Fecha de pago inteligente** (fecha de alta si es anterior, hora actual si es hoy)
- ✅ Polling para pagos creados asincrónicamente
- ✅ Sistema de búsqueda unificado (socios/familias)
- ✅ Navegación a detalles de socio desde pagos individuales
- ✅ Navegación a detalles de familia desde pagos de familia
- ✅ Generación de recibos PDF profesionales
- ✅ Historial de pagos por socio

**Funcionalidades de Recibos PDF:**
- ✅ Template profesional con logo ASAM
- ✅ Número de recibo único (formato: ASAM-YYYY-N)
- ✅ Datos completos del socio/familia
- ✅ Detalles del pago (fecha, método, importe)
- ✅ Pie de página con firma digital
- ✅ Botón "Recibo" en tabla de pagos
- ✅ Descarga automática del PDF
- ✅ Multiidioma completo

**Archivos clave**:
```
src/pages/PaymentsPage.tsx
src/pages/payments/InitialPaymentPage.tsx
src/features/payments/components/PaymentsTable.tsx
src/features/payments/components/ConfirmPaymentDialog.tsx
src/features/payments/components/InitialPaymentForm.tsx
src/features/payments/components/ReceiptGenerator.tsx
src/features/payments/hooks/usePaymentForm.ts
```

#### Sistema de Internacionalización (100%)

**Implementaciones**:
- ✅ Configuración de i18next con react-i18next
- ✅ Soporte de 3 idiomas: **Español**, **Francés**, **Wolof**
- ✅ Selector de idioma en la interfaz
- ✅ Persistencia de preferencia de idioma
- ✅ Módulo de Miembros 100% internacionalizado
- ✅ Módulo de Pagos 100% internacionalizado
- ✅ Internacionalización de componentes de navegación
- ✅ Internacionalización de mensajes de error y validación
- ✅ Formateo de fechas según idioma (date-fns)
- ✅ Traducción de estados y métodos de pago
- ✅ Recibos PDF multiidioma
- ✅ Nombres de archivo PDF contextuales

**Traducciones Completas:**
```
src/lib/i18n/locales/
├── es/ (Español)
│   ├── common.json
│   ├── navigation.json
│   ├── auth.json
│   ├── members.json (245+ claves)
│   ├── payments.json (256+ claves)
│   ├── users.json
│   ├── dashboard.json
│   └── cashflow.json
├── fr/ (Francés) - estructura idéntica
└── wo/ (Wolof) - estructura idéntica
```

**Archivos clave**:
```
src/lib/i18n/
├── index.ts
├── locales/
└── LanguageSelector.tsx
```

**Fecha de completado**: Noviembre 2024 - Enero 2025

---

## 🔄 FASES EN PROGRESO Y PENDIENTES

### 🟡 FASE 5: Flujo de Caja (PRIORIDAD ALTA)

**Estado**: 📋 REQUISITOS DEFINIDOS - Listo para implementar
**Tiempo estimado**: 4 días
**Complejidad**: Media

**Objetivo**: Sistema completo de gestión de ingresos y gastos con integración automática de pagos

#### Requisitos Confirmados del Negocio

**Basado en análisis del Excel actual de la asociación**:

**Sistema Actual (Excel)**:
```
GASTOS
├── FECHA (vacía en algunos casos)
├── CONCEPTO (texto libre)
└── CANTIDAD (importe en euros)
```

**Categorías Identificadas**:
1. **Repatriaciones**: 1.500€ (PAPA NDAO, AS MANIJAK SBD, etc.)
2. **Gastos Administrativos**: Tasas Generalitat, Sellos, Copistería, Tarjetas
3. **Gastos Bancarios**: LA CAIXA ANUAL (48€)
4. **Ayudas Sociales**: MANDIAYE DIAW AJUDA (300€)

#### Estructura de Base de Datos Existente

```sql
cash_flows
├── id (PK)
├── member_id (FK, nullable)
├── family_id (FK, nullable)
├── payment_id (FK, nullable)
├── operation_type (varchar)
├── amount (numeric)
├── date (timestamp NOT NULL)
├── detail (varchar)
├── created_at
├── updated_at
└── deleted_at (soft delete)
```

#### Reglas de Negocio

1. **Repatriaciones**:
   - ✓ Importe por defecto: **1.500€** (editable)
   - ✓ **Obligatorio asociar a socio** (member_id)
   - 🔮 Comprobantes: Nice to have (futuro)

2. **Integración con Pagos**:
   - ✓ **Automática**: Pagos confirmados → Ingresos automáticos
   - ✓ Campo `payment_id` vincula con tabla payments

3. **Fechas**: Obligatorias (NOT NULL en BD)

4. **Permisos**:
   - 👨‍💼 **Admin**: Registra gastos/ingresos y ve todo
   - 👤 **User**: Solo ve sus movimientos (filtrado por member_id)

5. **Tipo de Movimiento**:
   - ➕ **Ingresos**: `amount` positivo
   - ➖ **Gastos**: `amount` negativo

#### Categorías de operation_type

```typescript
export enum OperationType {
  // INGRESOS (amount > 0)
  INGRESO_CUOTA = 'INGRESO_CUOTA',       // Automático
  INGRESO_DONACION = 'INGRESO_DONACION',
  INGRESO_OTRO = 'INGRESO_OTRO',

  // GASTOS (amount < 0)
  GASTO_REPATRIACION = 'GASTO_REPATRIACION',
  GASTO_ADMINISTRATIVO = 'GASTO_ADMINISTRATIVO',
  GASTO_BANCARIO = 'GASTO_BANCARIO',
  GASTO_AYUDA = 'GASTO_AYUDA',
  GASTO_OTRO = 'GASTO_OTRO',
}
```

#### Plan de Implementación

**SUB-FASE 5.1: Backend - GraphQL Schema y Resolvers** (1 día)
- Queries: GetCashFlows, GetBalance, GetCashFlowStats
- Mutations: CreateCashFlow, UpdateCashFlow, DeleteCashFlow
- Filtrado automático por rol en backend

**SUB-FASE 5.2: Frontend - Tipos y Utilidades** (0.5 día)
- Definición de tipos TypeScript
- Constantes de operationTypes
- Utilidades de formateo y validación

**SUB-FASE 5.3: Frontend - Componentes Core** (1 día)
- CashFlowTable con DataGrid
- BalanceCard con métricas
- TransactionForm (ingreso/gasto)
- RepatriationForm especializado

**SUB-FASE 5.4: Frontend - Vista Principal** (1 día)
- CashFlowPage completa
- Hooks (useCashFlows, useBalance, mutations)
- Filtros y acciones por rol

**SUB-FASE 5.5: Integración con Pagos** (0.5 día)
- Trigger automático en confirmPayment
- Creación de ingreso en cash_flows

**SUB-FASE 5.6: Exportación y Gráficos** (0.5 día)
- Exportación a CSV
- Gráfico de evolución (Recharts)

#### Estructura de Archivos

```
src/features/cashflow/
├── components/
│   ├── CashFlowTable.tsx
│   ├── CashFlowFilters.tsx
│   ├── BalanceCard.tsx
│   ├── BalanceChart.tsx
│   ├── TransactionForm.tsx
│   ├── RepatriationForm.tsx
│   └── ConfirmDeleteDialog.tsx
├── hooks/
│   ├── useCashFlows.ts
│   ├── useBalance.ts
│   ├── useCreateCashFlow.ts
│   ├── useUpdateCashFlow.ts
│   └── useDeleteCashFlow.ts
├── utils/
│   ├── operationTypes.ts
│   ├── formatters.ts
│   └── validation.ts
└── types.ts

src/pages/
└── CashFlowPage.tsx

src/graphql/operations/
└── cashflow.graphql
```

#### Criterios de Aceptación

**Funcionalidad**:
- [ ] Admin puede registrar ingresos/gastos manualmente
- [ ] Admin puede registrar repatriaciones con socio
- [ ] Repatriaciones tienen 1.500€ por defecto (editable)
- [ ] Fechas obligatorias en todos los formularios
- [ ] User solo ve sus propios movimientos
- [ ] Admin ve todos los movimientos
- [ ] Pagos confirmados se registran automáticamente
- [ ] Balance calculado correctamente
- [ ] Exportación a CSV funcional

**UX**:
- [ ] Tabla con colores semánticos (verde/rojo)
- [ ] Formularios con validación en tiempo real
- [ ] Mensajes de éxito/error claros
- [ ] Confirmación antes de eliminar

---

### 🟡 FASE 6: Dashboard y Reportes (PRIORIDAD MEDIA-ALTA)

**Estado**: 🔜 SIGUIENTE TRAS FLUJO DE CAJA
**Tiempo estimado**: 3-4 días

#### REQ-6.1: Dashboard con Métricas (2 días)

**Métricas principales**:
- [ ] Total de socios (activos/inactivos)
- [ ] Balance actual (ingresos - gastos)
- [ ] Gráfico de evolución mensual
- [ ] Socios con pagos pendientes (alerta)
- [ ] Últimos movimientos de caja
- [ ] Próximos vencimientos

**Componentes**:
```
src/features/dashboard/
├── components/
│   ├── MetricsCards.tsx
│   ├── BalanceChart.tsx
│   ├── PendingPaymentsAlert.tsx
│   └── RecentTransactions.tsx
└── hooks/
    └── useDashboardData.ts
```

#### REQ-6.2: Reportes Básicos (2 días)

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

---

### 🔵 FASE 7: PWA y Mejoras de UX (POST-MVP)

**Estado**: 📝 PLANIFICADO
**Prioridad**: MEDIA

Esta fase se subdivide en mejoras incrementales factibles:

#### 7.1: Setup Básico de PWA (FACTIBLE - 2 días)

**Objetivo**: PWA instalable con funcionalidad offline básica

**Tareas FACTIBLES**:
- [ ] Manifest.json optimizado
  - ✅ Configuración básica ya existe
  - [ ] Añadir campos faltantes (description, categories)
  - [ ] Verificar iconos en todos los tamaños requeridos
  - [ ] Configurar theme_color y background_color

- [ ] Service Worker mejorado
  - ✅ Workbox ya configurado con Vite
  - [ ] Verificar estrategias de caché actuales
  - [ ] Implementar página offline personalizada
  - [ ] Mejorar precache de assets críticos

- [ ] Prompt de instalación
  - [ ] Componente InstallPrompt.tsx
  - [ ] Detección de instalación previa
  - [ ] Banner discreto en header

**Archivos a crear/modificar**:
```
public/manifest.json (actualizar)
src/components/common/InstallPrompt.tsx (nuevo)
src/components/common/OfflineIndicator.tsx (nuevo)
vite.config.ts (revisar configuración PWA)
```

**Esfuerzo**: BAJO-MEDIO (2 días)
**Impacto**: ALTO (mejora significativa de UX)
**Factibilidad**: ✅ ALTA

---

#### 7.2: Funcionalidad Offline Básica (FACTIBLE - 1-2 días)

**Objetivo**: Lectura offline de datos críticos

**Tareas FACTIBLES**:
- [ ] Caché de lista de socios
  - [ ] Estrategia Cache-First para listado
  - [ ] Timeout para actualización

- [ ] Caché de detalles de socio
  - [ ] Guardar últimos 10-20 socios visitados
  - [ ] Stale-While-Revalidate

- [ ] Indicador visual de modo offline
  - [ ] Banner superior cuando offline
  - [ ] Deshabilitar acciones de escritura

**Esfuerzo**: MEDIO (1-2 días)
**Impacto**: MEDIO-ALTO
**Factibilidad**: ✅ ALTA

---

#### 7.3: Accesibilidad Básica (FACTIBLE - 2 días)

**Objetivo**: Mejoras de accesibilidad incrementales

**Tareas FACTIBLES (Prioridad AAA)**:

1. **Auditoría rápida** (0.5 día)
   - [ ] Ejecutar Lighthouse audit
   - [ ] Identificar problemas críticos
   - [ ] Priorizar correcciones

2. **Correcciones rápidas** (1 día)
   - [ ] Verificar contraste de colores (usar herramienta automática)
   - [ ] Añadir alt text faltante en imágenes
   - [ ] Verificar labels en formularios
   - [ ] Mejorar focus indicators

3. **Testing básico** (0.5 día)
   - [ ] Navegación completa por teclado
   - [ ] Test rápido con screen reader
   - [ ] Verificar orden de lectura

**Esfuerzo**: BAJO (2 días)
**Impacto**: MEDIO
**Factibilidad**: ✅ MUY ALTA

---

#### 7.4: Optimización de Rendimiento (FACTIBLE - 2 días)

**Objetivo**: Mejoras de rendimiento de alto impacto

**Tareas FACTIBLES**:

1. **Análisis de bundle** (0.5 día)
   - [ ] Ejecutar `npm run build:analyze`
   - [ ] Identificar dependencias pesadas
   - [ ] Documentar oportunidades

2. **Code splitting básico** (1 día)
   - [ ] Lazy loading de rutas principales
   - [ ] React.lazy en componentes pesados (PDF, Charts)
   - [ ] Preload de rutas críticas

3. **Optimizaciones rápidas** (0.5 día)
   - [ ] Verificar images (usar WebP si es posible)
   - [ ] Revisar bundle de producción
   - [ ] Implementar React.memo en componentes costosos

**Esfuerzo**: BAJO-MEDIO (2 días)
**Impacto**: MEDIO
**Factibilidad**: ✅ ALTA

---

### 🔵 FASE 8: Funcionalidades Secundarias (OPCIONAL)

**Estado**: 📝 FUTURO
**Prioridad**: BAJA

Estas funcionalidades son deseables pero no críticas:

#### 8.1: Gestión de Usuarios Admin (2 días)
- [ ] CRUD de usuarios
- [ ] Asignación de roles
- [ ] Cambio de contraseña (admin reset)
- [ ] Log de actividad

#### 8.2: Gestión Completa de Familias (2 días)
- [ ] Vista independiente de familias
- [ ] CRUD completo de familias
- [ ] Cambio de titular
- [ ] Historial de cambios

#### 8.3: Sistema de Notificaciones (2-3 días)
- [ ] Notificaciones in-app
- [ ] Sistema de alertas para admins
- [ ] Preferencias por usuario

#### 8.4: Testing Completo (1 semana)
- [ ] Tests unitarios
- [ ] Tests de integración
- [ ] Tests E2E
- [ ] CI/CD para tests

#### 8.5: Mejoras Futuras en Flujo de Caja
- [ ] Adjuntar comprobantes
- [ ] Sistema de aprobación de gastos
- [ ] Presupuestos por categoría
- [ ] Alertas de saldo bajo

---

## 📅 Timeline Actualizado

### Estado Actual (11 de Enero de 2025)

```
✅ FASE 1: Infraestructura Base - COMPLETADO 100%
✅ FASE 2: Autenticación y Permisos - COMPLETADO 100%
✅ FASE 3: Módulo de Socios - COMPLETADO 100%
✅ FASE 4: Pagos e i18n - COMPLETADO 100%

🔴 FASE 5: Flujo de Caja - REQUISITOS DEFINIDOS (4 días)
🟡 FASE 6: Dashboard y Reportes - PLANIFICADO (3-4 días)
🔵 FASE 7: PWA y Mejoras - PLANIFICADO (7-8 días)
⚪ FASE 8: Funcionalidades Secundarias - OPCIONAL
```

### Plan de Desarrollo Propuesto

```
📅 Semana 1 (4 días laborables)
└── 🔴 FLUJO DE CAJA
    ├── Día 1: Backend (GraphQL)
    ├── Día 2: Frontend (Tipos, componentes)
    ├── Día 3: Frontend (Vista principal)
    └── Día 4: Integración + Exportación

📅 Semana 2 (3-4 días)
└── 🟡 DASHBOARD Y REPORTES
    ├── Día 1-2: Dashboard con métricas
    └── Día 3-4: Reportes básicos

📅 Semanas 3-4 (7-8 días)
└── 🔵 PWA Y MEJORAS (incrementales)
    ├── Día 1-2: Setup PWA básico
    ├── Día 3-4: Offline básico
    ├── Día 5-6: Accesibilidad
    └── Día 7-8: Optimización
```

---

## 🎯 Criterios de Éxito para MVP

### Funcional ✅
- ✅ Alta completa de socios (individual y familiar)
- ✅ Edición de socios existentes
- ✅ Dar de baja socios
- ✅ Sistema de permisos por roles
- ✅ Registro y confirmación de pagos
- ✅ Generación de recibos PDF
- ✅ Historial de pagos por socio
- ✅ Internacionalización completa (3 idiomas)
- ✅ Monto editable en confirmación de pagos
- [ ] Sistema de flujo de caja ⬅️ SIGUIENTE
- [ ] Dashboard con métricas principales

### Técnico
- ✅ Sin errores críticos en consola
- ✅ Tiempo de carga < 3 segundos
- ✅ Responsive en móvil y desktop
- ✅ Sistema de permisos robusto
- ✅ Tipado completo con TypeScript
- [ ] PWA instalable (básico)
- [ ] Tests básicos implementados

### Usuario
- ✅ Flujo completo sin interrupciones
- ✅ Interfaz intuitiva y consistente
- ✅ Feedback claro en cada acción
- ✅ Manejo de errores amigable
- ✅ Experiencia diferenciada por rol
- ✅ Soporte multiidioma fluido

---

## 📈 Métricas de Progreso

### Estado Actual (11/01/2025) ⬆️

```
Infraestructura:     ████████████████████ 100%
Autenticación:       ████████████████████ 100%
Permisos y Roles:    ████████████████████ 100%
Miembros:            ████████████████████ 100%
Pagos:               ████████████████████ 100%
i18n (3 idiomas):    ████████████████████ 100%
Dashboard:           ██░░░░░░░░░░░░░░░░░░  10%
Flujo de Caja:       ░░░░░░░░░░░░░░░░░░░░   0% (requisitos ✅)
Reportes:            ░░░░░░░░░░░░░░░░░░░░   0%
PWA Avanzado:        ████░░░░░░░░░░░░░░░░  20%

TOTAL:               █████████████████░░░  87% ⬆️
```

### Meta MVP Completo (Estimado: 2-3 semanas)

```
Infraestructura:     ████████████████████ 100%
Autenticación:       ████████████████████ 100%
Permisos y Roles:    ████████████████████ 100%
Miembros:            ████████████████████ 100%
Pagos:               ████████████████████ 100%
i18n (3 idiomas):    ████████████████████ 100%
Dashboard:           ████████████░░░░░░░░  60%
Flujo de Caja:       ████████████████████ 100%
Reportes:            ████████░░░░░░░░░░░░  40%
PWA Avanzado:        ████████████░░░░░░░░  60%

TOTAL:               ███████████████████░  95%
```

---

## 📝 Análisis de Factibilidad - Fase 7 (PWA y Mejoras)

### ✅ ALTA FACTIBILIDAD (Recomendado)

#### 7.1: Setup Básico de PWA
- **Esfuerzo**: 2 días
- **Beneficio**: Alto (instalable, mejor UX)
- **Riesgo**: Bajo (tecnología ya implementada parcialmente)
- **Recomendación**: ✅ IMPLEMENTAR

#### 7.2: Offline Básico
- **Esfuerzo**: 1-2 días
- **Beneficio**: Medio-Alto (uso sin conexión)
- **Riesgo**: Bajo-Medio (requiere testing)
- **Recomendación**: ✅ IMPLEMENTAR

#### 7.3: Accesibilidad Básica
- **Esfuerzo**: 2 días
- **Beneficio**: Medio (inclusividad)
- **Riesgo**: Bajo (mejoras incrementales)
- **Recomendación**: ✅ IMPLEMENTAR

#### 7.4: Optimización Básica
- **Esfuerzo**: 2 días
- **Beneficio**: Medio (mejor rendimiento)
- **Riesgo**: Bajo (mejoras puntuales)
- **Recomendación**: ✅ IMPLEMENTAR

### ⚠️ MEDIA-BAJA FACTIBILIDAD (Opcional)

Las siguientes tareas de la Fase 7 requieren más esfuerzo:

- **Accesibilidad WCAG 2.1 AA completa**: 3-4 días (puede posponerse)
- **Optimización exhaustiva**: 2-3 días (rendimiento ya aceptable)
- **Testing completo de PWA**: 2 días (puede ser incremental)

**Recomendación**: Implementar solo lo básico de cada categoría.

---

## 📚 Referencias

### Documentación del Proyecto
- [Tecnologías Frontend](./FRONTEND-TECHNOLOGIES.md) ⬅️ NUEVO
- [Guía Estratégica PWA](./Construyendo_para_la_Comunidad_y_la_Confianza__Una_Guía_Estratégica_para_el_Desarrollo_de_la_Aplicación_Web_Progresiva_de_Mutua_ASAM.md)
- [REQ-2.1: Exportación CSV](./REQ-2.1-CSV-Export-Implementation.md)
- [REQ-2.3: Lógica de Familias](./REQ-2.3-Family-Logic-Implementation.md)
- [Token Management](./TOKEN_MANAGEMENT.md)

### Backend API
- Documentación GraphQL: `/asam-backend/docs/frontend`
- Schema GraphQL: `http://localhost:8080/graphql`

---

## 📝 Notas de Arquitectura

### Principios Mantenidos
- ✅ Arquitectura por features (domain-driven)
- ✅ Componentes desacoplados y reutilizables
- ✅ Hooks personalizados para lógica compleja
- ✅ Tipado estricto con TypeScript
- ✅ GraphQL types generados automáticamente
- ✅ Conventional Commits
- ✅ Permisos basados en roles (RBAC)
- ✅ Separación clara de rutas públicas/privadas/admin
- ✅ Internacionalización desde el diseño

### Mejoras Pendientes
- ⚠️ Implementar testing sistemático (cobertura < 10%)
- ⚠️ Añadir Storybook para componentes UI
- ⚠️ Mejorar estrategia offline (Service Worker avanzado)
- ⚠️ Optimizar bundle size (code splitting)
- ⚠️ Añadir logging estructurado
- ⚠️ Implementar auditoría de acciones de usuario

### Seguridad
- ✅ Autenticación JWT con refresh tokens
- ✅ Rutas protegidas en frontend
- ✅ Control de permisos por rol
- ✅ Validación de datos en frontend
- ⚠️ PENDIENTE: Auditoría de seguridad completa
- ⚠️ PENDIENTE: Rate limiting en backend

---

## 🔄 Cambios Recientes

### 11 de Enero de 2025 - REORGANIZACIÓN DEL ROADMAP

**Cambios principales**:
- ✅ Reorganización de fases de manera lógica y secuencial
- ✅ Fases 1-4 marcadas como completadas (100%)
- ✅ Actualización de progreso global: 85% → 87%
- ✅ Análisis de factibilidad de Fase 7 (PWA y Mejoras)
- ✅ Subdivisión de Fase 7 en tareas factibles
- ✅ Actualización de timeline y estimaciones
- ✅ Inclusión de últimas mejoras en Fase 4 (montos editables, fechas inteligentes)
- ✅ Reorganización de contenido para mejor legibilidad
- ✅ Referencia a nuevo documento de tecnologías

**Mejoras en Fase 4 documentadas**:
- ✅ Monto editable en confirmación de pagos
- ✅ Monto editable en pago inicial
- ✅ Fecha de pago inteligente (usa fecha de alta si es anterior)
- ✅ Hora actual por defecto si fecha de alta es hoy

---

### 6 de Noviembre de 2024 - INTERNACIONALIZACIÓN COMPLETA

- ✅ Sistema multiidioma completado (Español, Francés, Wolof)
- ✅ 100% de componentes internacionalizados
- ✅ Recibos PDF multiidioma
- ✅ Formateo de fechas localizado
- ✅ Versión actualizada: 0.2.0 → 0.3.0

---

### 2 de Noviembre de 2024 - DEFINICIÓN FLUJO DE CAJA

- ✅ Análisis completo del sistema actual (Excel)
- ✅ Requisitos de negocio confirmados
- ✅ Plan de implementación detallado
- ✅ Estructura de BD validada

---

**Última actualización**: 11 de enero de 2025
**Próxima revisión**: Tras completar Flujo de Caja
**Mantenido por**: Equipo de desarrollo ASAM Frontend
