# Sistema de Gestión de Tokens JWT - Implementación de Estándares de la Industria

## 📋 Resumen

Este documento describe el sistema de gestión automática de tokens JWT implementado en el proyecto ASAM Frontend, siguiendo las mejores prácticas y estándares de la industria para proporcionar una experiencia de usuario óptima.

## 🎯 Problema Original

**Antes:** Cuando el access token expiraba, el usuario veía errores 401 crípticos sin ninguna explicación o manejo automático.

**Después:** El sistema renueva automáticamente los tokens antes de que expiren, notifica al usuario de manera discreta, y maneja elegantemente los casos de fallo.

## 🏗️ Arquitectura de la Solución

### **Capas de Defensa**

```
┌─────────────────────────────────────────────────────────────┐
│  Capa 1: Renovación Proactiva (useTokenRefresh hook)       │
│  ✓ Verifica cada 60s si el token expira en menos de 5min   │
│  ✓ Renueva automáticamente antes de la expiración          │
│  ✓ Notificación discreta: "Sesión renovada"                │
└─────────────────────────────────────────────────────────────┘
                              ↓ Si falla
┌─────────────────────────────────────────────────────────────┐
│  Capa 2: Interceptor de Errores (authRefreshLink)          │
│  ✓ Detecta errores 401 (HTTP y GraphQL)                    │
│  ✓ Intenta renovar el token automáticamente                │
│  ✓ Reintenta la operación original del usuario             │
└─────────────────────────────────────────────────────────────┘
                              ↓ Si falla
┌─────────────────────────────────────────────────────────────┐
│  Capa 3: Advertencia al Usuario (SessionExpirationWarning) │
│  ✓ Muestra alerta cuando quedan menos de 2min              │
│  ✓ Opciones: "Continuar" o "Cerrar Sesión"                │
└─────────────────────────────────────────────────────────────┘
                              ↓ Si expira completamente
┌─────────────────────────────────────────────────────────────┐
│  Capa 4: Logout Automático                                 │
│  ✓ Cierra sesión automáticamente                           │
│  ✓ Redirige al login con mensaje claro                     │
│  ✓ "Tu sesión ha expirado. Inicia sesión nuevamente."      │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Componentes Implementados

### **1. `authRefreshLink.ts` (Mejorado)**

**Ubicación:** `src/lib/apollo/links/authRefreshLink.ts`

**Qué hace:**
- Intercepta errores 401 de **HTTP** y **GraphQL**
- Intenta renovar el token usando el refresh token
- Reintenta automáticamente la operación original
- Evita loops infinitos con un sistema de tracking

**Mejora implementada:**
```typescript
// ANTES: Solo detectaba errores GraphQL
const hasAuthError = error.graphQLErrors?.some(isAuthenticationError)

// DESPUÉS: Detecta también errores HTTP 401 del middleware
const isNetworkAuthError = error.networkError && 
  'statusCode' in error.networkError && 
  error.networkError.statusCode === 401

if ((hasAuthError || isNetworkAuthError) && !didRefresh) {
  // Intentar renovar token...
}
```

### **2. `useTokenRefresh` Hook (Nuevo)**

**Ubicación:** `src/hooks/auth/useTokenRefresh.ts`

**Qué hace:**
- Verifica cada 60 segundos el estado del token
- Si el token expira en menos de 5 minutos, lo renueva proactivamente
- Muestra notificación discreta al usuario cuando renueva
- Si falla la renovación, hace logout automático con mensaje claro

**Configuración:**
```typescript
// En App.tsx
import { useTokenRefresh } from '@/hooks/auth'

function App() {
  // Se activa automáticamente para usuarios autenticados
  useTokenRefresh()
  // ...
}
```

**Timeline típico:**
```
Token creado: 00:00    Access Token válido por 15 minutos
              00:10    ✅ Sistema funcionando normalmente
              00:14    🔄 Hook detecta que expira en <5min
              00:14    🔄 Renueva automáticamente el token
              00:14    ✅ Nuevo token válido por 15 minutos más
              00:14    ℹ️  Usuario ve: "Sesión renovada automáticamente"
```

### **3. `SessionExpirationWarning` Component (Nuevo)**

**Ubicación:** `src/components/auth/SessionExpirationWarning.tsx`

**Qué hace:**
- Muestra alerta cuando quedan menos de 2 minutos de sesión
- Ofrece opciones al usuario: "Continuar" o "Cerrar Sesión"
- Si el token expira completamente, hace logout automático

**Cuándo se activa:**
- Solo si el hook `useTokenRefresh` falló al renovar
- Solo si el token está a menos de 2 minutos de expirar
- Es una red de seguridad para casos excepcionales

## 📊 Flujo de Renovación de Tokens

### **Caso 1: Renovación Exitosa (99% de los casos)**

```
Usuario trabajando → Token expira en 5min → useTokenRefresh detecta
                                          ↓
                              Llama a refreshToken mutation
                                          ↓
                              Backend valida refresh token
                                          ↓
                              Devuelve nuevos tokens
                                          ↓
                              authStore actualiza tokens
                                          ↓
                              Notificación: "Sesión renovada"
                                          ↓
                              Usuario continúa trabajando sin interrupción
```

### **Caso 2: Token Expira Durante una Operación**

```
Usuario crea socio → Envía mutation CreateMember
                                          ↓
                              Backend recibe request con token expirado
                                          ↓
                              Middleware devuelve 401 HTTP
                                          ↓
                              authRefreshLink intercepta el 401
                                          ↓
                              Intenta renovar token
                                          ↓
                              ✅ Renovación exitosa
                                          ↓
                              Reintenta CreateMember automáticamente
                                          ↓
                              Socio creado correctamente
                                          ↓
                              Usuario nunca notó el problema
```

### **Caso 3: Refresh Token También Expirado**

```
Usuario inactivo >7 días → Ambos tokens expirados
                                          ↓
                              Usuario intenta acción
                                          ↓
                              authRefreshLink intenta renovar
                                          ↓
                              ❌ Backend rechaza refresh token
                                          ↓
                              authRefreshLink llama a logout()
                                          ↓
                              Redirige a /login
                                          ↓
                              Mensaje: "Tu sesión ha expirado..."
```

## 🎨 Experiencia de Usuario

### **Notificaciones Implementadas**

1. **Renovación exitosa (discreta):**
   - Tipo: Info (azul)
   - Posición: Abajo-derecha
   - Duración: 2 segundos
   - Texto: "Sesión renovada automáticamente"

2. **Advertencia de expiración (visible):**
   - Tipo: Warning (amarillo)
   - Posición: Arriba-centro
   - Duración: Permanente hasta interacción
   - Texto: "Tu sesión está a punto de expirar. ¿Deseas continuar?"
   - Acciones: "Continuar" | "Cerrar Sesión"

3. **Sesión expirada (importante):**
   - Tipo: Warning (amarillo)
   - Posición: Arriba-centro
   - Duración: 5 segundos
   - Texto: "Tu sesión ha expirado. Por favor, inicia sesión nuevamente."
   - Acción: Redirección automática al login

## ⚙️ Configuración

### **Tiempos de Expiración**

```typescript
// En el backend (Go)
const (
    AccessTokenDuration  = 15 * time.Minute  // 15 minutos
    RefreshTokenDuration = 7 * 24 * time.Hour // 7 días
)

// En el frontend (TypeScript)
const FIVE_MINUTES = 5 * 60 * 1000      // Renovación proactiva
const TWO_MINUTES = 2 * 60 * 1000       // Advertencia al usuario
const CHECK_INTERVAL = 60 * 1000        // Verificación cada minuto
```

### **Personalización**

Puedes ajustar el comportamiento del hook:

```typescript
// Deshabilitar renovación automática (no recomendado)
useTokenRefresh(false)

// Habilitar renovación automática (por defecto)
useTokenRefresh()
useTokenRefresh(true)
```

## 🧪 Testing

### **Escenarios a Probar**

1. **Renovación proactiva:**
   - Iniciar sesión
   - Esperar ~10 minutos (token expira en <5min)
   - Verificar notificación "Sesión renovada"
   - Verificar que las operaciones funcionan sin interrupción

2. **Interceptor de errores:**
   - Modificar manualmente el token en localStorage para que sea inválido
   - Intentar crear un socio
   - Verificar que se renueva automáticamente
   - Verificar que el socio se crea correctamente

3. **Expiración completa:**
   - Borrar el refresh token de localStorage
   - Intentar una operación
   - Verificar logout automático
   - Verificar mensaje en página de login

4. **Advertencia de expiración:**
   - Modificar el expiresAt en localStorage para que expire en 1 minuto
   - Esperar a que aparezca la advertencia
   - Probar botones "Continuar" y "Cerrar Sesión"

## 📚 Referencias y Estándares

Este sistema sigue los siguientes estándares de la industria:

1. **OAuth 2.0 Best Practices (RFC 6749)**
   - Uso de access token de corta duración (15min)
   - Uso de refresh token de larga duración (7 días)
   - Renovación automática antes de expiración

2. **JWT Best Current Practice (RFC 8725)**
   - Validación estricta de tokens
   - Manejo seguro de tokens en el cliente
   - Expiración configurada con buffer de seguridad

3. **UX Best Practices de Auth0, Okta, AWS Cognito**
   - Silent refresh (renovación sin interrupción)
   - Notificaciones discretas vs. intrusivas
   - Logout automático con mensaje claro
   - Manejo de refresh token expirado

## 🔒 Consideraciones de Seguridad

1. **Tokens en localStorage:** Los tokens se almacenan en localStorage (persistidos por Zustand). Esto es seguro para la mayoría de aplicaciones web modernas, pero considera usar httpOnly cookies para aplicaciones de alta seguridad.

2. **Refresh Token Protection:** El refresh token solo se envía en la mutation `refreshToken` con el flag `skipAuthLink: true` para evitar exponerlo innecesariamente.

3. **Rate Limiting:** El hook previene múltiples intentos de renovación simultáneos con `isRefreshing.current` y `lastRefreshAttempt.current`.

4. **HTTPS Required:** El backend requiere HTTPS en producción para proteger los tokens en tránsito.

## 🚀 Deployment

No se requiere configuración adicional. El sistema se activa automáticamente cuando:

1. ✅ El usuario está autenticado
2. ✅ Existe un access token válido
3. ✅ Existe un refresh token válido

## 📝 Mantenimiento

### **Logs para Debugging**

Todos los logs del sistema de tokens incluyen el prefijo correspondiente:

```typescript
[TokenRefresh] Token expiring soon, refreshing proactively...
[TokenRefresh] Token refresh successful
[TokenRefresh] Token refresh failed: ...
[AuthRefreshLink] Auth error detected for CreateMember
[AuthRefreshLink] Attempting to refresh token
[AuthRefreshLink] Token refresh successful
```

### **Métricas Recomendadas**

Para monitoreo en producción, considera agregar:

1. **Tasa de renovación exitosa vs. fallida**
2. **Tiempo promedio entre renovaciones**
3. **Número de logouts automáticos por expiración**
4. **Errores 401 que NO se pudieron recuperar**

---

## ✅ Checklist de Implementación

- [x] Mejorado authRefreshLink para detectar errores HTTP 401
- [x] Creado hook useTokenRefresh para renovación proactiva
- [x] Creado componente SessionExpirationWarning
- [x] Integrado en App.tsx
- [x] Notificaciones configuradas con notistack
- [x] Documentación completa

---

**Fecha de implementación:** 19 de octubre de 2025  
**Versión:** 1.0.0  
**Autor:** Sistema de Gestión ASAM
