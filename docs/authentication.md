# Sistema de Autenticación con Renovación Automática de Tokens

## Visión General

El sistema de autenticación implementa un mecanismo robusto de renovación automática de tokens que garantiza sesiones persistentes sin intervención del usuario.

## Componentes Principales

### 1. TokenManager (`src/lib/apollo/tokenManager.ts`)
Centraliza toda la lógica de gestión de tokens:
- Verifica la expiración de tokens
- Maneja la renovación automática
- Previene múltiples renovaciones simultáneas
- Limpia tokens al fallar la renovación

### 2. Apollo Links
- **AuthLink**: Añade automáticamente el token de autenticación a cada petición
- **ErrorLink**: Intercepta errores 401 y renueva el token automáticamente

### 3. AuthStore (Zustand)
Store persistente que mantiene:
- Información del usuario
- Tokens de acceso y refresh
- Estado de autenticación
- Persistencia automática en localStorage

### 4. Hook useAuth
Proporciona una interfaz unificada para:
- Login/Logout
- Verificación de email
- Recuperación de contraseña
- Cambio de contraseña

## Uso Básico

### En Componentes
```tsx
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  const handleLogin = async () => {
    const result = await login('username', 'password');
    if (result.success) {
      // Usuario autenticado exitosamente
    } else {
      // Mostrar error: result.error
    }
  };
  
  return (
    <div>
      {isAuthenticated ? (
        <p>Bienvenido, {user?.username}</p>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

### Rutas Protegidas
```tsx
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      {/* Rutas protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      
      {/* Rutas solo para admin */}
      <Route element={<ProtectedRoute requireAdmin />}>
        <Route path="/admin" element={<AdminPanel />} />
      </Route>
    </Routes>
  );
}
```

### En el App Principal
```tsx
import { AuthProvider } from '@/contexts/AuthContext';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '@/lib/apollo-client';

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <Router>
          {/* Tu aplicación */}
        </Router>
      </AuthProvider>
    </ApolloProvider>
  );
}
```

## Flujo de Renovación de Tokens

1. **Petición Normal**: 
   - AuthLink añade el token actual
   - Si el token está próximo a expirar (< 1 min), se renueva preventivamente

2. **Error 401**:
   - ErrorLink intercepta el error
   - TokenManager intenta renovar el token
   - La petición original se reintenta con el nuevo token
   - Si falla la renovación, se hace logout

3. **Renovaciones Concurrentes**:
   - Solo se ejecuta una renovación a la vez
   - Otras peticiones esperan a que termine la renovación en curso
   - Todas las peticiones pendientes usan el nuevo token

## Características de Seguridad

- Tokens almacenados de forma segura con Zustand persist
- Renovación automática antes de la expiración
- Limpieza de tokens al cerrar sesión
- Redirección automática a login al expirar la sesión
- Verificación de tokens al recargar la página

## Debugging

Para depurar el sistema de autenticación:

```tsx
// Ver el estado actual
import { useAuthStore } from '@/stores/authStore';

const state = useAuthStore.getState();
console.log('Auth state:', state);

// Ver si un token está expirado
console.log('Token expired:', state.isTokenExpired());
```
