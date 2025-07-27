# Sistema de Renovación Automática de Tokens

## Descripción General

El sistema implementa renovación automática de tokens JWT cuando expiran, proporcionando una experiencia fluida al usuario sin necesidad de volver a autenticarse constantemente.

## Arquitectura

### Cadena de Apollo Links

La cadena de links de Apollo Client está configurada en el siguiente orden:

1. **Debug Link** (solo desarrollo) - Registra todas las operaciones GraphQL
2. **Auth Refresh Link** - Intercepta errores de autenticación y renueva tokens
3. **Custom HTTP Link** - Añade headers de autenticación y ejecuta las peticiones

### Flujo de Renovación

```
Usuario hace request → Debug Link → Auth Refresh Link → Custom HTTP Link → Backend
                                            ↓
                                    ¿Error 401/UNAUTHENTICATED?
                                            ↓
                                         Sí → Ejecutar RefreshToken mutation
                                            ↓
                                    ¿Renovación exitosa?
                                            ↓
                                  Sí → Reintentar request original
                                   ↓
                                  No → Logout y redirigir a /login
```

## Componentes Clave

### AuthRefreshLink (`src/lib/apollo/links/authRefreshLink.ts`)

- Intercepta errores de autenticación (401, UNAUTHENTICATED)
- Ejecuta la mutation RefreshToken usando el refresh token almacenado
- Actualiza los tokens en el store de Zustand
- Reintenta automáticamente la operación fallida con el nuevo token
- Previene loops infinitos y refreshes múltiples simultáneos

### Operaciones Excluidas

Las siguientes operaciones NO activan renovación automática:
- Login
- Register
- RefreshToken (para evitar loops)
- RequestPasswordReset
- ResetPasswordWithToken
- VerifyEmail
- ResendVerificationEmail

### Manejo de Errores

1. **Token Refresh Exitoso**: La operación original se reintenta automáticamente
2. **Token Refresh Fallido**: 
   - Se ejecuta logout automático
   - Se limpia el store de autenticación
   - El usuario es redirigido a /login
3. **Sin Refresh Token**: Se procede con el error original

## Configuración

No requiere configuración adicional. El sistema funciona automáticamente una vez integrado en la cadena de Apollo Links.

## Debugging

En modo desarrollo, el sistema registra:
- Detección de errores de autenticación
- Intentos de renovación de token
- Éxito/fallo de renovación
- Reintentos de operaciones

## Consideraciones de Seguridad

- Los refresh tokens se almacenan de forma segura en el store persistente
- Solo se permite un intento de renovación por operación
- Se previenen renovaciones simultáneas múltiples
- Los tokens expirados se limpian automáticamente
