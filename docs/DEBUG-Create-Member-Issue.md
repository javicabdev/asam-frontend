# Debug: Problema al Crear Socio

## Problema Identificado

El error "Cannot read properties of null (reading 'createMember')" ocurre porque el backend requiere permisos de administrador para crear un socio.

## Validaciones del Backend

Según el código del resolver en `member_resolver.go`:

```go
// Verify that user is admin
if user.Role != models.RoleAdmin {
    return nil, errors.NewBusinessError(errors.ErrForbidden, "Insufficient permissions")
}
```

## Soluciones Implementadas

1. **Mejorado el manejo de errores** en `NewMemberPage.tsx`:
   - Validación de respuesta null
   - Mejor formato de mensajes de error
   - Logs de depuración

2. **Agregado indicadores visuales** (solo en desarrollo):
   - Estado de autenticación
   - Usuario actual
   - Rol del usuario
   - Presencia del token

3. **Validación de permisos**:
   - Verificación al cargar la página
   - Mensaje claro si no tiene permisos de admin
   - Formulario oculto si no es admin

## Pasos para Resolver

1. **Verificar el usuario actual**:
   - Ir a la página de crear socio
   - Verificar los chips de estado (en modo desarrollo)
   - El rol debe ser "ADMIN"

2. **Si no eres admin**:
   - Contactar con un administrador para que te asigne el rol
   - O usar un usuario con rol de administrador

3. **Verificar autenticación**:
   - Asegurarse de haber iniciado sesión
   - Verificar que el token esté presente

## Campos Requeridos para Crear Socio

Según `validateCreateInput` en el backend:

- `numero_socio` (string) - Requerido
- `tipo_membresia` (INDIVIDUAL | FAMILY) - Requerido
- `nombre` (string) - Requerido
- `apellidos` (string) - Requerido
- `calle_numero_piso` (string) - Requerido
- `codigo_postal` (string) - Requerido
- `poblacion` (string) - Requerido
- `provincia` (string) - Default: "Barcelona"
- `pais` (string) - Default: "España"
- `nacionalidad` (string) - Default: "Senegal"

## Logs de Depuración

Los logs en la consola mostrarán:
- Input enviado al crear miembro
- Resultado de la creación
- Errores específicos de GraphQL

## Formato de Fechas

El backend espera las fechas en formato RFC3339 con zona horaria:
- Frontend envía: `"1970-10-10"` (desde el date picker)
- Se convierte a: `"1970-10-10T00:00:00Z"` (formato RFC3339)
- Esto aplica a todas las fechas: fecha_nacimiento, esposo_fecha_nacimiento, etc.

## Testing

Para probar la creación de un socio:

1. Iniciar sesión con un usuario admin
2. Ir a `/members/new`
3. Verificar que aparezca el formulario (no el mensaje de error)
4. Completar todos los campos requeridos
5. Enviar el formulario
6. Revisar los logs en la consola para más detalles
