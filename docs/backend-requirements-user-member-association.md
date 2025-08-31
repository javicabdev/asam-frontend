# Requisitos del Backend: Asociación Usuario-Socio

## Funcionalidad Actual

El frontend ya tiene implementada la funcionalidad completa para asociar socios a usuarios:

- ✅ **UserFormDialog**: Formulario de creación/edición de usuarios con campo opcional de socio asociado
- ✅ **MemberAutocomplete**: Componente de búsqueda inteligente de socios
- ✅ **Mutations GraphQL**: Las mutations `createUser` y `updateUser` ya aceptan `memberId`

## Mejora Propuesta para el Backend

### Nueva Query GraphQL Necesaria

Para evitar que un socio pueda ser asociado a múltiples usuarios, necesitamos una nueva query que filtre solo los socios sin usuario asociado:

```graphql
query SearchMembersWithoutUser($criteria: String!) {
  searchMembersWithoutUser(criteria: $criteria) {
    miembro_id
    nombre
    apellidos
    numero_socio
    documento_identidad
    correo_electronico
    estado
  }
}
```

### Implementación Sugerida

```go
// En el resolver de GraphQL
func (r *queryResolver) SearchMembersWithoutUser(ctx context.Context, criteria string) ([]*model.Member, error) {
    // 1. Buscar miembros que coincidan con el criterio
    members, err := r.MemberService.SearchMembers(ctx, criteria)
    if err != nil {
        return nil, err
    }
    
    // 2. Filtrar solo aquellos que NO tienen usuario asociado
    var membersWithoutUser []*model.Member
    for _, member := range members {
        hasUser, err := r.UserService.MemberHasUser(ctx, member.ID)
        if err != nil {
            return nil, err
        }
        if !hasUser {
            membersWithoutUser = append(membersWithoutUser, member)
        }
    }
    
    return membersWithoutUser, nil
}
```

### Beneficios

1. **Prevención de duplicados**: Un socio no podrá ser asociado a múltiples usuarios
2. **Mejor UX**: Los usuarios solo verán opciones válidas en el autocomplete
3. **Reducción de errores**: Evita errores de validación en el backend

### Comportamiento del Frontend

El frontend ya está preparado con un sistema de fallback:

1. **Intenta primero** usar `searchMembersWithoutUser` (query optimizada)
2. **Si falla**, usa `searchMembers` (query estándar)

Esto significa que la aplicación funcionará correctamente incluso antes de implementar la nueva query en el backend.

## Estado Actual

- ✅ Frontend completamente implementado y funcional
- ⏳ Backend necesita implementar `searchMembersWithoutUser`
- ✅ Sistema de fallback garantiza funcionamiento mientras tanto
