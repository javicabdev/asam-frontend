# Guía de Pruebas - Sistema de Renovación de Tokens

## Pruebas Manuales

### 1. Prueba de Renovación Automática

1. Inicia sesión en la aplicación
2. Abre las DevTools (F12) y ve a la pestaña Network
3. Espera a que el token expire (o modifica manualmente la expiración en el localStorage)
4. Realiza cualquier acción que requiera autenticación
5. Deberías ver:
   - Una petición fallida con error 401
   - Una petición a `refreshToken` 
   - La petición original reintentada con éxito

### 2. Prueba de Refresh Token Expirado

1. Inicia sesión en la aplicación
2. Modifica manualmente el refresh token en localStorage para que sea inválido
3. Espera a que el access token expire
4. Realiza una acción autenticada
5. Deberías ver:
   - Intento de renovación fallido
   - Logout automático
   - Redirección a /login

### 3. Prueba de Operaciones Simultáneas

1. Inicia sesión y espera cerca de la expiración del token
2. Ejecuta múltiples operaciones al mismo tiempo (ej: cargar varias páginas)
3. Deberías ver:
   - Solo UNA petición de refreshToken
   - Todas las operaciones esperan y se reintentan después

## Comandos Útiles para Testing

### Forzar Expiración del Token (en la consola del navegador)
```javascript
// Obtener el estado actual
const authState = JSON.parse(localStorage.getItem('auth-storage')).state;

// Modificar la expiración para que sea hace 1 hora
authState.expiresAt = new Date(Date.now() - 3600000).toISOString();

// Guardar de vuelta
localStorage.setItem('auth-storage', JSON.stringify({
  state: authState,
  version: 0
}));
```

### Simular Token Inválido
```javascript
// Corromper el access token
const authState = JSON.parse(localStorage.getItem('auth-storage')).state;
authState.accessToken = 'invalid-token';
localStorage.setItem('auth-storage', JSON.stringify({
  state: authState,
  version: 0
}));
```

### Monitorear Logs de Renovación
```javascript
// En la consola, filtrar por logs de renovación
console.log('%c Monitoring token refresh...', 'color: blue; font-weight: bold');
```

## Verificación en DevTools

### Network Tab
- Filtrar por "graphql" para ver todas las peticiones
- Buscar peticiones con status 401 seguidas de "refreshToken"
- Verificar que las peticiones se reintentan después del refresh

### Console Tab
- Buscar logs que empiecen con "AuthRefreshLink:"
- Verificar la secuencia: detección → refresh → reintento

### Application Tab
- Monitorear cambios en localStorage → auth-storage
- Verificar que los tokens se actualizan después del refresh

## Casos Edge a Probar

1. **Logout durante refresh**: Hacer logout mientras se está renovando un token
2. **Navegación durante refresh**: Cambiar de página durante la renovación
3. **Pérdida de red durante refresh**: Desconectar internet durante el proceso
4. **Tokens corruptos**: Usar tokens mal formados (no JWT válidos)

## Reporte de Problemas

Si encuentras algún problema:

1. Captura los logs de la consola
2. Exporta el HAR file de la pestaña Network
3. Nota la secuencia exacta de acciones
4. Verifica el estado del localStorage antes y después
