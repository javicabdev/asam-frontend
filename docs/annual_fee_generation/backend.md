# Backend - Generación de Cuotas Anuales

## Índice

1. [Arquitectura](#arquitectura)
2. [Implementación Paso a Paso](#implementación-paso-a-paso)
3. [Código Completo](#código-completo)
4. [Testing](#testing)

---

## Arquitectura

### Componentes a Modificar/Crear

```
internal/
├── domain/
│   └── services/
│       └── payment_service.go          [MODIFICAR]
├── ports/
│   ├── input/
│   │   └── payment_service.go          [MODIFICAR]
│   └── output/
│       ├── member_repository.go        [VERIFICAR]
│       └── payment_repository.go       [VERIFICAR]
└── adapters/
    └── gql/
        ├── schema/
        │   └── payment.graphqls          [MODIFICAR]
        └── resolvers/
            └── schema.resolvers.go       [MODIFICAR]
```

---

## Implementación Paso a Paso

### PASO 1: Añadir Método en el Repositorio (si no existe)

**Archivo**: `internal/ports/output/member_repository.go`

**Verificar que existe** el método:

```go
// GetAllActive obtiene todos los miembros activos
GetAllActive(ctx context.Context) ([]*models.Member, error)
```

**Si NO existe, añadir en** `internal/adapters/db/member_repository.go`:

```go
func (r *memberRepository) GetAllActive(ctx context.Context) ([]*models.Member, error) {
    var members []*models.Member

    result := r.db.WithContext(ctx).
        Where("state = ?", models.EstadoActivo).
        Order("membership_number ASC").
        Find(&members)

    if result.Error != nil {
        return nil, appErrors.DB(result.Error, "error getting active members")
    }

    return members, nil
}
```

**Añadir firma en la interfaz** `internal/ports/output/member_repository.go`:

```go
type MemberRepository interface {
    // ... métodos existentes ...

    // GetAllActive obtiene todos los miembros activos
    GetAllActive(ctx context.Context) ([]*models.Member, error)
}
```

---

### PASO 2: Añadir DTOs de Request/Response

**Archivo**: `internal/ports/input/payment_service.go`

**Añadir al final del archivo**:

```go
// GenerateAnnualFeesRequest contiene los datos para generar cuotas anuales
type GenerateAnnualFeesRequest struct {
    Year              int     // Año para el cual generar cuotas
    BaseFeeAmount     float64 // Monto base (para socios individuales)
    FamilyFeeExtra    float64 // Monto adicional para socios familiares
}

// GenerateAnnualFeesResponse contiene el