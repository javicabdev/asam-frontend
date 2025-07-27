# Ejemplo de Uso: MainLayout y ProtectedRoute

## Configuración Básica

Los componentes MainLayout y ProtectedRoute ya están integrados en el sistema de rutas de la aplicación. No necesitas configuración adicional para usarlos.

## Añadir una Nueva Página Protegida

### 1. Crear el componente de la página

```tsx
// src/pages/configuracion/ConfiguracionPage.tsx
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

export const ConfiguracionPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Configuración
      </Typography>
      
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography>
          Contenido de la página de configuración...
        </Typography>
      </Paper>
    </Box>
  );
};
```

### 2. Añadir la ruta

```tsx
// src/routes.tsx
const ConfiguracionPage = lazy(() => import('@/pages/configuracion/ConfiguracionPage'));

// Dentro de las rutas protegidas con MainLayout
<Route path="/configuracion" element={<ConfiguracionPage />} />
```

### 3. Añadir al menú de navegación

```tsx
// src/layouts/MainLayout.tsx
import { Settings as SettingsIcon } from '@mui/icons-material';

const navigationItems: NavItem[] = [
  // ... otros items
  {
    text: 'Configuración',
    icon: <SettingsIcon />,
    path: '/configuracion',
  },
];
```

## Rutas con Diferentes Niveles de Protección

### Ruta pública (sin protección)

```tsx
<Route path="/about" element={<AboutPage />} />
```

### Ruta protegida sin layout

```tsx
<Route element={<ProtectedRoute />}>
  <Route path="/wizard" element={<SetupWizard />} />
</Route>
```

### Ruta protegida con layout

```tsx
<Route element={<ProtectedRoute />}>
  <Route element={<MainLayout />}>
    <Route path="/dashboard" element={<DashboardPage />} />
  </Route>
</Route>
```

### Ruta que requiere email verificado

```tsx
<Route element={<ProtectedRoute requireEmailVerification />}>
  <Route path="/sensitive-action" element={<SensitiveActionPage />} />
</Route>
```

## Personalización del MainLayout

### Añadir un badge al menú

```tsx
// En MainLayout.tsx
<ListItemText
  primary={
    <Box display="flex" alignItems="center" gap={1}>
      {item.text}
      {item.path === '/payments' && pendingPayments > 0 && (
        <Chip label={pendingPayments} size="small" color="error" />
      )}
    </Box>
  }
/>
```

### Condicionar items por rol

```tsx
const navigationItems: NavItem[] = [
  {
    text: 'Administración',
    icon: <AdminIcon />,
    path: '/admin',
    roles: ['ADMIN'], // Solo visible para admins
  },
];

// En el render del drawer
{navigationItems
  .filter(item => !item.roles || item.roles.includes(user?.role || ''))
  .map((item) => (
    // ... render del item
  ))}
```

### Añadir acciones en el AppBar

```tsx
// En el AppBar, antes del menú de usuario
<IconButton color="inherit" onClick={handleNotifications}>
  <Badge badgeContent={4} color="error">
    <NotificationsIcon />
  </Badge>
</IconButton>
```

## Manejo de Estados Especiales

### Mostrar mensaje cuando el email no está verificado

El MainLayout ya incluye un indicador visual cuando el email no está verificado. Para acciones adicionales:

```tsx
// En cualquier página
const { user, sendVerificationEmail } = useAuth();

if (user && !user.emailVerified) {
  return (
    <Alert 
      severity="warning" 
      action={
        <Button size="small" onClick={sendVerificationEmail}>
          Reenviar Email
        </Button>
      }
    >
      Tu email no está verificado. Algunas funciones pueden estar limitadas.
    </Alert>
  );
}
```

### Redirección después del login

```tsx
// En LoginPage
const location = useLocation();
const from = location.state?.from?.pathname || '/dashboard';

// Después del login exitoso
navigate(from, { replace: true });
```

## Mejores Prácticas

1. **Usa lazy loading**: Todas las páginas deben cargarse con `React.lazy()` para mejorar el rendimiento.

2. **Mantén el layout limpio**: No añadas demasiados items al menú principal. Considera sub-menús para secciones complejas.

3. **Feedback visual**: Siempre muestra loading states y mensajes de error apropiados.

4. **Responsive first**: Prueba siempre en móvil y desktop.

5. **Accesibilidad**: Usa aria-labels apropiados y asegura navegación por teclado.

## Troubleshooting Común

### "Cannot read property 'username' of null"
- Asegúrate de que el componente esté dentro de ProtectedRoute
- Verifica que el token no haya expirado

### El menú no se actualiza con nuevos items
- Verifica que el path coincida exactamente
- Revisa que no haya errores de importación

### La página se recarga al navegar
- Usa `navigate()` de React Router, no `window.location`
- Verifica que todos los links usen el componente Link o navigate
