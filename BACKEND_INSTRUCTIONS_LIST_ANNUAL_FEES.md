# Instrucciones para Backend: Implementar Query `listAnnualFees`

## 📋 Contexto

El frontend necesita listar todas las cuotas anuales existentes en la página de "Cuotas Anuales" en modo solo lectura. Actualmente, al intentar usar la query `listAnnualFees`, el backend devuelve un error 422, lo que indica que esta query no está implementada.

---

## 🎯 Objetivo

Implementar una query GraphQL para listar todas las cuotas anuales (MembershipFee) registradas en el sistema.

---

## 📝 Especificación de la Query

### Schema GraphQL

```graphql
type Query {
  """
  Lista todas las cuotas anuales registradas en el sistema
  Retorna un array de MembershipFee ordenados por año descendente
  """
  listAnnualFees: [MembershipFee!]!
}

type MembershipFee {
  id: ID!
  year: Int!
  individual_amount: Float!
  family_amount: Float!
  created_at: Time!
  updated_at: Time!
}
```

### Comportamiento Esperado

1. **Sin parámetros**: La query no requiere parámetros de entrada
2. **Retorno**: Array de todas las cuotas anuales existentes
3. **Ordenamiento**: Por año descendente (más reciente primero)
4. **Permisos**: Accesible para usuarios autenticados (admin y tesorero)

---

## 🔧 Implementación Sugerida (Go/gqlgen)

### 1. Actualizar el Schema GraphQL

```graphql
# En tu archivo schema.graphql, agregar a la sección Query:

extend type Query {
  listAnnualFees: [MembershipFee!]!
}
```

### 2. Implementar el Resolver

```go
// En tu archivo resolver (ej: membership_fee_resolver.go)

func (r *queryResolver) ListAnnualFees(ctx context.Context) ([]*model.MembershipFee, error) {
	// 1. Verificar autenticación
	user, err := middleware.GetUserFromContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("no autenticado")
	}

	// 2. Verificar permisos (opcional: solo admin/tesorero)
	if user.Role != "admin" && user.Role != "tesorero" {
		return nil, fmt.Errorf("sin permisos para ver cuotas anuales")
	}

	// 3. Obtener todas las cuotas de la base de datos
	var membershipFees []*model.MembershipFee

	err = r.DB.Order("year DESC").Find(&membershipFees).Error
	if err != nil {
		return nil, fmt.Errorf("error al obtener cuotas anuales: %w", err)
	}

	return membershipFees, nil
}
```

### 3. Modelo de Datos

Asegúrate de que tu modelo `MembershipFee` tiene los campos necesarios:

```go
type MembershipFee struct {
	ID              string    `gorm:"primaryKey;type:uuid;default:gen_random_uuid()" json:"id"`
	Year            int       `gorm:"uniqueIndex;not null" json:"year"`
	IndividualAmount float64   `gorm:"type:decimal(10,2);not null" json:"individual_amount"`
	FamilyAmount    float64   `gorm:"type:decimal(10,2);not null" json:"family_amount"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}
```

---

## ✅ Casos de Prueba

### Test 1: Query Exitosa
```graphql
query {
  listAnnualFees {
    id
    year
    individual_amount
    family_amount
    created_at
    updated_at
  }
}
```

**Resultado Esperado:**
```json
{
  "data": {
    "listAnnualFees": [
      {
        "id": "uuid-1",
        "year": 2025,
        "individual_amount": 100.00,
        "family_amount": 150.00,
        "created_at": "2025-01-15T10:00:00Z",
        "updated_at": "2025-01-15T10:00:00Z"
      },
      {
        "id": "uuid-2",
        "year": 2024,
        "individual_amount": 90.00,
        "family_amount": 140.00,
        "created_at": "2024-01-10T10:00:00Z",
        "updated_at": "2024-01-10T10:00:00Z"
      }
    ]
  }
}
```

### Test 2: Sin Cuotas Registradas
```json
{
  "data": {
    "listAnnualFees": []
  }
}
```

### Test 3: Usuario No Autenticado
```json
{
  "errors": [
    {
      "message": "no autenticado",
      "path": ["listAnnualFees"]
    }
  ],
  "data": null
}
```

---

## 🔐 Consideraciones de Seguridad

1. **Autenticación Requerida**: Solo usuarios autenticados
2. **Autorización**: Opcionalmente restringir a admin/tesorero
3. **No exponer datos sensibles**: Los montos son públicos, no hay problema
4. **Rate Limiting**: Considerar límite de peticiones si es necesario

---

## 📊 Orden de Prioridad

Esta query es **ALTA PRIORIDAD** porque:
- El frontend ya está implementado y esperando esta funcionalidad
- Es necesaria para la visualización básica de cuotas anuales
- No tiene dependencias complejas
- Implementación simple (query de solo lectura)

---

## 🧪 Cómo Probar

1. **Regenerar código GraphQL** (si usas gqlgen):
   ```bash
   go run github.com/99designs/gqlgen generate
   ```

2. **Probar en GraphQL Playground**:
   - Navegar a `http://localhost:8080/graphql` (o tu puerto)
   - Ejecutar la query de prueba
   - Verificar que retorna las cuotas correctamente

3. **Verificar ordenamiento**:
   - Insertar varias cuotas con diferentes años
   - Confirmar que se ordenan de más reciente a más antiguo

4. **Probar sin autenticación**:
   - Ejecutar sin token
   - Debe retornar error de autenticación

---

## 📞 Contacto

Si hay dudas o necesitas aclarar algo sobre esta funcionalidad, por favor contacta al equipo de frontend.

**Fecha de creación**: 10/11/2025
**Estado**: Pendiente de implementación
**Impacto**: Alto - Bloquea visualización de cuotas anuales en frontend

---

## ✨ Mejoras Futuras (Opcional)

Una vez implementada la query básica, se podrían agregar:
- Filtro por año: `listAnnualFees(year: Int)`
- Paginación: `listAnnualFees(page: Int, pageSize: Int)`
- Ordenamiento configurable: `listAnnualFees(orderBy: String, orderDir: String)`

Por ahora, la query simple sin parámetros es suficiente.
