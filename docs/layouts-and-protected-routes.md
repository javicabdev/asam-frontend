# Sistema de Layouts y Rutas Protegidas

## Descripción General

El sistema de layouts y rutas protegidas proporciona una estructura consistente para la aplicación y gestiona el acceso basado en autenticación.

## Componentes Principales

### ProtectedRoute

Ubicación: `src/components/auth/ProtectedRoute.tsx`

**Funcionalidad:**
- Verifica el estado de autenticación del usuario
- Muestra un spinner mientras se carga el estado
- Redirige a `/login` si el usuario no está autenticado
- Opcionalmente requiere verificación de email
- Guarda la ubicación intentada para redirigir después del login

**Props:**
- `children` (opcional): Componentes hijos a renderizar
- `redirectTo` (opcional): Ruta de redirección (default: `/login`)
- `requireEmailVerification` (opcional): Si requiere email verificado

**Uso:**
```tsx
// Proteger una ruta individual
<Route path="/dashboard" element={
  <ProtectedRoute>
    <DashboardPage />
  </ProtectedRoute>
} />

// Proteger un grupo de rutas con Outlet
<Route element={<ProtectedRoute />}>
  <Route path="/members" element={<MembersPage />} />
  <Route path="/families" element={<FamiliesPage />} />
</Route>
```

### MainLayout

Ubicación: `src/layouts/MainLayout.tsx`

**Características:**
- Navegación lateral responsive
- Menú de usuario con información y opciones
- Indicador de email no verificado
- Navegación colapsable en móvil
- Indicador visual de ruta activa

**Estructura:**
```
┌─────────────────────────────────────┐
│           AppBar (Header)           │
├─────────┬───────────────────────────┤
│         │                           │
│ Drawer  │     Content Area          │
│  (Nav)  │      (Outlet)             │
│         │                           │
│         │                           │
└─────────┴───────────────────────────┘
```

**Navegación incluida:**
- Dashboard
- Miembros
- Familias
- Pagos
- Flujo de Caja
- Informes

**Menú de usuario:**
- Información del usuario (nombre, rol)
- Verificar email (si no está verificado)
- Mi Perfil
- Cerrar Sesión

## Integración con React Router

### Estructura de rutas:

```tsx
<Routes>
  {/* Rutas públicas con AuthLayout */}
  <Route element={<AuthLayout />}>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
  </Route>

  {/* Rutas protegidas con MainLayout */}
  <Route element={<ProtectedRoute />}>
    <Route element={<MainLayout />}>
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/members" element={<MembersPage />} />
      {/* ... más rutas */}
    </Route>
  </Route>
</Routes>
```

## Estados de Carga

### Durante verificación de autenticación:
- Se muestra un spinner centrado en pantalla completa
- Previene el parpadeo de contenido no autorizado

### Redirección después del login:
- Si el usuario intentó acceder a una ruta protegida, se guarda la ubicación
- Después del login exitoso, se redirige a la ubicación guardada
- Si no hay ubicación guardada, se redirige a `/dashboard`

## Responsive Design

### Desktop (≥ md):
- Drawer permanente de 240px de ancho
- AppBar ocupa el resto del ancho
- Navegación siempre visible

### Mobile (< md):
- Drawer temporal que se superpone
- Botón hamburguesa en el AppBar
- Navegación se cierra al seleccionar una opción

## Personalización

### Añadir nuevas rutas de navegación:

```tsx
const navigationItems: NavItem[] = [
  // ... items existentes
  {
    text: 'Nueva Sección',
    icon: <NuevoIcon />,
    path: '/nueva-seccion',
    roles: ['ADMIN'], // Opcional: restringir por rol
  },
];
```

### Cambiar el ancho del drawer:

```tsx
const drawerWidth = 280; // Default: 240
```

## Consideraciones de Seguridad

1. **Verificación en el servidor**: ProtectedRoute es solo una medida de UX. La seguridad real debe estar en el backend.

2. **Tokens expirados**: El sistema de renovación automática de tokens maneja las expiraciones transparentemente.

3. **Roles y permisos**: Actualmente no hay restricción por roles en el frontend. Esto debe implementarse según necesidad.

## Troubleshooting

### El layout no aparece:
- Verificar que la ruta esté dentro de `<ProtectedRoute>` y `<MainLayout>`
- Verificar que el usuario esté autenticado

### La navegación no resalta la ruta activa:
- Asegurarse de que el path en navigationItems coincida exactamente con la ruta

### El menú móvil no se cierra:
- Verificar que `handleNavigate` se esté llamando en lugar de `navigate` directamente
