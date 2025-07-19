# Guía de Pruebas: Flujo de Creación de Socios

## Preparación

### 1. Iniciar el Backend
```powershell
cd C:\Work\babacar\asam\asam-backend
go run cmd/api/main.go
```

### 2. Iniciar el Frontend
```powershell
cd C:\Work\babacar\asam\asam-frontend
npm run dev
```

### 3. Abrir la aplicación
- Navegar a: http://localhost:5173
- Abrir las herramientas de desarrollo del navegador (F12)
- Ir a la pestaña "Console" para ver los logs

## Escenarios de Prueba

### Escenario 1: Usuario No Autenticado

1. **Cerrar sesión** (si estás autenticado)
2. **Ir a la página de socios**: `/members`
3. **Verificar**:
   - El botón "Nuevo Socio" debe estar deshabilitado
   - Al pasar el mouse sobre el botón, debe aparecer el tooltip: "Solo los administradores pueden crear nuevos socios"
4. **Intentar acceder directamente** a `/members/new`
   - Debe mostrar el mensaje: "Debes iniciar sesión para acceder a esta página"

### Escenario 2: Usuario con Rol USER

1. **Iniciar sesión** con un usuario que tenga rol USER
2. **Ir a la página de socios**: `/members`
3. **Verificar**:
   - El botón "Nuevo Socio" debe estar deshabilitado
   - El tooltip debe mostrar: "Solo los administradores pueden crear nuevos socios"
   - Debug info (en modo desarrollo): `Es admin: NO`
4. **Ir directamente a** `/members/new`
   - Debe mostrar chips informativos en la parte superior (en modo desarrollo):
     - Estado: "Autenticado" (verde)
     - Usuario: [tu usuario]
     - Rol: "user" (amarillo)
     - Token: "Token presente" (verde)
   - Debe mostrar el mensaje: "No tienes permisos de administrador para crear socios. Contacta con un administrador si necesitas crear un nuevo socio."

### Escenario 3: Usuario con Rol admin - Crear Socio Individual

1. **Iniciar sesión** con un usuario admin
2. **Ir a la página de socios**: `/members`
3. **Verificar**:
   - El botón "Nuevo Socio" debe estar habilitado
   - No debe mostrar tooltip al pasar el mouse
   - Debug info (en modo desarrollo): `Es admin: SÍ`
4. **Hacer clic en "Nuevo Socio"**
5. **En la página de creación** (`/members/new`):
   - Verificar chips informativos:
     - Estado: "Autenticado" (verde)
     - Usuario: [tu usuario]
     - Rol: "admin" (verde)
     - Token: "Token presente" (verde)
6. **Completar el formulario**:
   - Tipo de membresía: **Individual**
   - Nombre: Juan
   - Apellidos: Pérez García
   - Dirección: Calle Mayor 123
   - Código Postal: 08001
   - Población: Barcelona
   - Provincia: Barcelona
   - País: España
   - Email: juan.perez@example.com (opcional)
   - DNI/NIE: 12345678A (opcional)
7. **Revisar la consola** antes de enviar:
   - Debe estar limpia de errores
8. **Hacer clic en "Guardar"**
9. **Verificar en la consola**:
   - Log: "Creating member with input:" seguido del objeto con los datos
   - Log: "Member creation result:" con la respuesta
   - Log: "Member created successfully, navigating to payment page"
10. **Resultado esperado**:
    - Redirección a `/payments/initial/[ID_DEL_SOCIO]`

### Escenario 4: Usuario con Rol admin - Crear Socio Familiar

1. **Repetir pasos 1-5 del Escenario 3**
2. **Completar el formulario**:
   - Tipo de membresía: **Familiar**
   - Al seleccionar "Familiar", deben aparecer campos adicionales
3. **Completar datos del socio principal** (igual que el escenario 3)
4. **Completar datos del cónyuge**:
   - Nombre del esposo: Pedro
   - Apellidos del esposo: López
   - Nombre de la esposa: María
   - Apellidos de la esposa: González
5. **Agregar familiares**:
   - Hacer clic en "Añadir Familiar"
   - En el modal:
     - Nombre: Carlos
     - Apellidos: López González
     - Parentesco: Hijo/a
     - Fecha de nacimiento: 01/01/2010
   - Hacer clic en "Guardar"
   - El familiar debe aparecer en la lista
6. **Hacer clic en "Guardar"**
7. **Verificar en la consola**:
   - Log: "Creating member with input:"
   - Log: "Member creation result:"
   - Log: "Creating family with input:"
   - Log: "Family creation result:"
   - Log: "Adding family member:" (por cada familiar)
   - Log: "Member created successfully, navigating to payment page"
8. **Resultado esperado**:
   - Redirección a `/payments/initial/[ID_DEL_SOCIO]`

### Escenario 5: Manejo de Errores

1. **Probar con campos vacíos**:
   - Dejar campos obligatorios vacíos
   - El formulario debe mostrar errores de validación
   - No debe enviarse la petición

2. **Simular error de red** (opcional):
   - Detener el backend
   - Intentar crear un socio
   - Debe mostrar: "Error de conexión. Por favor verifica tu conexión a internet."

3. **Token expirado** (si aplica):
   - Si el token expira durante la sesión
   - Debe redirigir al login o mostrar error de autenticación

## Verificación en el Backend

### Consultas SQL útiles para verificar los datos:

```sql
-- Ver últimos socios creados
SELECT * FROM miembros ORDER BY fecha_alta DESC LIMIT 5;

-- Ver últimas familias creadas
SELECT * FROM familias ORDER BY id DESC LIMIT 5;

-- Ver familiares asociados a una familia
SELECT * FROM familiares WHERE familia_id = [ID_FAMILIA];

-- Verificar el estado completo de un socio
SELECT 
    m.*,
    f.id as familia_id,
    f.numero_socio as familia_numero
FROM miembros m
LEFT JOIN familias f ON f.miembro_origen_id = m.id
WHERE m.id = [ID_SOCIO];
```

## Checklist de Validación

- [ ] Botón deshabilitado para usuarios no admin (rol: 'user')
- [ ] Botón habilitado para usuarios admin (rol: 'admin')
- [ ] Tooltip explicativo funciona correctamente
- [ ] Página de creación muestra permisos insuficientes para no admin
- [ ] Formulario valida campos obligatorios
- [ ] Creación de socio individual funciona
- [ ] Creación de socio familiar funciona
- [ ] Logs de depuración aparecen en consola
- [ ] Redirección a página de pago tras crear socio
- [ ] Datos se guardan correctamente en base de datos
- [ ] Manejo de errores funciona correctamente

## Solución de Problemas Comunes

### "Cannot read properties of null"
- Verificar que el usuario tenga rol 'admin' (en minúsculas)
- Revisar los logs de la consola para más detalles
- Verificar que el backend esté ejecutándose

### Botón de crear socio no aparece
- Verificar que estés en la página `/members`
- Recargar la página (F5)

### Formulario no se envía
- Verificar que todos los campos obligatorios estén completos
- Revisar la consola para errores de validación

### Error de conexión
- Verificar que el backend esté ejecutándose en puerto 8080
- Verificar CORS en el backend
- Revisar la configuración de VITE_GRAPHQL_URL

## Notas Adicionales

- Los logs de depuración solo aparecen en modo desarrollo
- Los chips de estado (autenticado, usuario, rol, token) solo se muestran en desarrollo
- Los números de socio se generan temporalmente en el frontend con formato: `YYYY-XXXXXX`
- Los números de familia se generan con formato: `YYYY-FXXXXXX`
