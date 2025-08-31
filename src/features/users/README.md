# Módulo de Gestión de Usuarios

## Descripción

Este módulo gestiona los usuarios del sistema ASAM, permitiendo crear administradores y usuarios regulares. Los usuarios regulares pueden estar asociados opcionalmente a un socio existente.

## Componentes Principales

### `UsersTable`
Tabla principal que muestra todos los usuarios del sistema con:
- Filtrado por rol (Administrador/Usuario)
- Búsqueda por nombre, email o número de socio
- Acciones de edición y eliminación
- Visualización del socio asociado para usuarios regulares

### `UserFormDialog`
Diálogo modal para crear o editar usuarios con:
- Validación completa con React Hook Form y Yup
- Campos: username, email, password, rol
- Asociación opcional con socio (solo para rol "user")
- Switch de estado activo/inactivo

### `MemberAutocomplete`
Componente de búsqueda inteligente de socios:
- Búsqueda con debounce (300ms)
- Requiere mínimo 2 caracteres
- Muestra nombre, apellidos y número de socio
- Sistema de fallback: intenta primero `searchMembersWithoutUser`, luego `searchMembers`

## Flujo de Trabajo

### Creación de Usuario

1. **Administrador sin socio**:
   ```
   Username: admin1
   Email: admin@asam.org
   Password: ********
   Rol: Administrador
   ```

2. **Usuario con socio asociado**:
   ```
   Username: jsanchez
   Email: juan.sanchez@email.com
   Password: ********
   Rol: Usuario
   Socio: Juan Sánchez - N° A00123
   ```

### Asociación Usuario-Socio

El sistema permite asociar opcionalmente un socio existente a un usuario con rol "user":

```typescript
// En la mutation CreateUser
{
  username: "jsanchez",
  email: "juan@example.com",
  password: "secure123",
  role: "user",
  memberId: "123" // ID del socio asociado
}
```

## Queries GraphQL

### Búsqueda de socios sin usuario (optimizada)
```graphql
query SearchMembersForUserAssociation($criteria: String!) {
  searchMembersWithoutUser(criteria: $criteria) {
    miembro_id
    nombre
    apellidos
    numero_socio
    estado
  }
}
```

### Búsqueda de socios (fallback)
```graphql
query SearchMembers($criteria: String!) {
  searchMembers(criteria: $criteria) {
    miembro_id
    nombre
    apellidos
    numero_socio
    estado
  }
}
```

## Configuración i18n

El módulo está completamente internacionalizado con soporte para:
- Español (es)
- Francés (fr)
- Wolof (wo)

Archivos de traducción en: `src/lib/i18n/locales/*/users.json`

## Testing

```bash
# Ejecutar tests del módulo
npm test -- MemberAutocomplete

# Ejecutar todos los tests de usuarios
npm test -- features/users
```

## Mejoras Pendientes

1. **Backend**: Implementar `searchMembersWithoutUser` para filtrar socios que ya tienen usuario
2. **Validación**: Prevenir asociación de un socio a múltiples usuarios
3. **UI**: Mostrar indicador visual cuando un socio ya tiene usuario

## Notas de Implementación

- El sistema tiene un fallback automático si la query optimizada no está disponible
- Los usuarios admin no requieren socio asociado
- Los usuarios con rol "user" pueden tener opcionalmente un socio asociado
- El usuario "javi" (admin) está protegido contra eliminación
