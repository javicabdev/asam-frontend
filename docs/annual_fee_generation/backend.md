# Backend Implementation - Annual Fee Generation

## 📋 Tabla de Contenidos

1. [Arquitectura General](#arquitectura-general)
2. [Modificaciones en Modelos](#modificaciones-en-modelos)
3. [Servicios de Dominio](#servicios-de-dominio)
4. [Repositorios](#repositorios)
5. [GraphQL Schema](#graphql-schema)
6. [Resolvers](#resolvers)
7. [Validaciones](#validaciones)
8. [Tests](#tests)

---

## 🏗️ Arquitectura General

### Clean Architecture Layers

```
cmd/
  └── api/main.go                    # Inicialización

internal/
  ├── domain/
  │   ├── models/
  │   │   └── payment.go             # ✨ MODIFICAR: MembershipFee
  │   └── services/
  │       └── fee_generation_service.go  # ✨ NUEVO
  │
  ├── ports/
  │   ├── input/
  │   │   └── fee_generation_service.go  # ✨ NUEVO
  │   └── output/
  │       └── fee_repository.go           # ✨ NUEVO
  │
  └── adapters/
      ├── db/
      │   └── fee_repository.go           # ✨ NUEVO
      └── gql/
          ├── schema/schema.graphql       # ✨ MODIFICAR
          └── resolvers/
              └── fee_resolver.go          # ✨ NUEVO
```

---

## 📦 Modificaciones en Modelos

### 1. Actualizar `internal/domain/models/payment.go`

El modelo `MembershipFee` ya existe, pero necesitamos asegurar que tenga todos los métodos necesarios:

```go
package models

import (
	"time"
	"gorm.io/gorm"
)

// MembershipFee representa una cuota de membresía anual
type MembershipFee struct {
	gorm.Model
	Year           int       `gorm:"uniqueIndex;not null"`
	BaseFeeAmount  float64   `gorm:"not null"`
	FamilyFeeExtra float64   `gorm:"default:0"`
	DueDate        time.Time `gorm:"not null"`
}

// TableName especifica el nombre de la tabla
func (MembershipFee) TableName() string {
	return "membership_fees"
}

// NewMembershipFee crea una nueva cuota anual
func NewMembershipFee(year int, baseAmount float64, familyExtra float64) *MembershipFee {
	return &MembershipFee{
		Year:           year,
		BaseFeeAmount:  baseAmount,
		FamilyFeeExtra: familyExtra,
		DueDate:        time.Date(year, 12, 31, 23, 59, 59, 0, time.UTC),
	}
}

// CalculateAmount calcula el monto según el tipo de membresía
func (mf *MembershipFee) CalculateAmount(isFamily bool) float64 {
	amount := mf.BaseFeeAmount
	if isFamily {
		amount += mf.FamilyFeeExtra
	}
	return amount
}

// IsOverdue verifica si la cuota está vencida
func (mf *MembershipFee) IsOverdue() bool {
	return time.Now().After(mf.DueDate)
}

// DaysOverdue retorna los días de atraso (0 si no está vencida)
func (mf *MembershipFee) DaysOverdue() int {
	if !mf.IsOverdue() {
		return 0
	}
	return int(time.Since(mf.DueDate).Hours() / 24)
}
```

---

## 🎯 Servicios de Dominio

### 1. Port de Entrada: `internal/ports/input/fee_generation_service.go`

```go
package input

import (
	"context"
	"github.com/javicabdev/asam-backend/internal/domain/models"
)

// FeeGenerationInput representa los datos para generar cuotas
type FeeGenerationInput struct {
	Year           int
	BaseFeeAmount  float64
	FamilyFeeExtra float64
}

// FeeGenerationResult resultado de la generación
type FeeGenerationResult struct {
	MembershipFee      *models.MembershipFee
	TotalMembers       int
	IndividualMembers  int
	FamilyMembers      int
	PaymentsCreated    int
	TotalExpectedAmount float64
	AlreadyExisted     bool
}

// FeeGenerationService interfaz del servicio
type FeeGenerationService interface {
	// GenerateAnnualFees genera las cuotas anuales para todos los miembros activos
	GenerateAnnualFees(ctx context.Context, input FeeGenerationInput) (*FeeGenerationResult, error)
	
	// GetMembershipFee obtiene la cuota de un año específico
	GetMembershipFee(ctx context.Context, year int) (*models.MembershipFee, error)
	
	// ListMembershipFees lista todas las cuotas con paginación
	ListMembershipFees(ctx context.Context, page, pageSize int) ([]*models.MembershipFee, int, error)
	
	// CheckFeeExists verifica si ya existe una cuota para un año
	CheckFeeExists(ctx context.Context, year int) (bool, error)
	
	// GetPendingFeesForMember obtiene cuotas pendientes de un miembro
	GetPendingFeesForMember(ctx context.Context, memberID uint) ([]*models.MembershipFee, error)
}
```

### 2. Implementación: `internal/domain/services/fee_generation_service.go`

```go
package services

import (
	"context"
	"fmt"
	"time"

	"github.com/javicabdev/asam-backend/internal/domain/models"
	"github.com/javicabdev/asam-backend/internal/ports/input"
	"github.com/javicabdev/asam-backend/internal/ports/output"
	appErrors "github.com/javicabdev/asam-backend/pkg/errors"
	"github.com/javicabdev/asam-backend/pkg/logger"
)

type feeGenerationService struct {
	feeRepo    output.FeeRepository
	memberRepo output.MemberRepository
	paymentRepo output.PaymentRepository
	logger     logger.Logger
}

// NewFeeGenerationService crea una nueva instancia del servicio
func NewFeeGenerationService(
	feeRepo output.FeeRepository,
	memberRepo output.MemberRepository,
	paymentRepo output.PaymentRepository,
	logger logger.Logger,
) input.FeeGenerationService {
	return &feeGenerationService{
		feeRepo:     feeRepo,
		memberRepo:  memberRepo,
		paymentRepo: paymentRepo,
		logger:      logger,
	}
}

// GenerateAnnualFees genera las cuotas anuales
func (s *feeGenerationService) GenerateAnnualFees(
	ctx context.Context,
	in input.FeeGenerationInput,
) (*input.FeeGenerationResult, error) {
	// 1. Validar entrada
	if err := s.validateInput(in); err != nil {
		return nil, err
	}

	// 2. Verificar si ya existe cuota para el año
	exists, err := s.feeRepo.ExistsByYear(ctx, in.Year)
	if err != nil {
		s.logger.Error("Error checking fee existence", map[string]interface{}{
			"year":  in.Year,
			"error": err.Error(),
		})
		return nil, appErrors.NewInternalError("failed to check fee existence", err)
	}

	var membershipFee *models.MembershipFee
	alreadyExisted := false

	if exists {
		// Si ya existe, la obtenemos
		membershipFee, err = s.feeRepo.GetByYear(ctx, in.Year)
		if err != nil {
			return nil, err
		}
		alreadyExisted = true
		s.logger.Info("Membership fee already exists for year", map[string]interface{}{
			"year": in.Year,
			"fee_id": membershipFee.ID,
		})
	} else {
		// Si no existe, la creamos
		membershipFee = models.NewMembershipFee(in.Year, in.BaseFeeAmount, in.FamilyFeeExtra)
		if err := s.feeRepo.Create(ctx, membershipFee); err != nil {
			s.logger.Error("Error creating membership fee", map[string]interface{}{
				"year":  in.Year,
				"error": err.Error(),
			})
			return nil, appErrors.NewInternalError("failed to create membership fee", err)
		}
		s.logger.Info("Created membership fee", map[string]interface{}{
			"year":   in.Year,
			"fee_id": membershipFee.ID,
		})
	}

	// 3. Obtener todos los miembros activos
	activeMembers, err := s.memberRepo.FindActiveMembers(ctx)
	if err != nil {
		s.logger.Error("Error getting active members", map[string]interface{}{
			"error": err.Error(),
		})
		return nil, appErrors.NewInternalError("failed to get active members", err)
	}

	// 4. Crear pagos pendientes para cada miembro
	result := &input.FeeGenerationResult{
		MembershipFee:      membershipFee,
		TotalMembers:       len(activeMembers),
		IndividualMembers:  0,
		FamilyMembers:      0,
		PaymentsCreated:    0,
		TotalExpectedAmount: 0,
		AlreadyExisted:     alreadyExisted,
	}

	for _, member := range activeMembers {
		// Verificar si ya existe un pago para este miembro y año
		hasPayment, err := s.paymentRepo.HasPaymentForFee(ctx, member.MiembroID, membershipFee.ID)
		if err != nil {
			s.logger.Error("Error checking existing payment", map[string]interface{}{
				"member_id": member.MiembroID,
				"fee_id":    membershipFee.ID,
				"error":     err.Error(),
			})
			continue // Continuar con el siguiente miembro
		}

		if hasPayment {
			s.logger.Debug("Payment already exists for member", map[string]interface{}{
				"member_id": member.MiembroID,
				"fee_id":    membershipFee.ID,
			})
			continue
		}

		// Calcular monto según tipo de membresía
		isFamily := member.TipoMembresia == models.MembershipTypeFamily
		amount := membershipFee.CalculateAmount(isFamily)

		// Crear pago pendiente
		payment := &models.Payment{
			MemberID:        member.MiembroID,
			Amount:          amount,
			Status:          models.PaymentStatusPending,
			PaymentMethod:   "pending",
			Notes:           fmt.Sprintf("Cuota anual %d", in.Year),
			MembershipFeeID: &membershipFee.ID,
		}

		if err := s.paymentRepo.Create(ctx, payment); err != nil {
			s.logger.Error("Error creating payment", map[string]interface{}{
				"member_id": member.MiembroID,
				"amount":    amount,
				"error":     err.Error(),
			})
			continue // Continuar con el siguiente miembro
		}

		// Actualizar estadísticas
		result.PaymentsCreated++
		result.TotalExpectedAmount += amount
		if isFamily {
			result.FamilyMembers++
		} else {
			result.IndividualMembers++
		}
	}

	s.logger.Info("Annual fee generation completed", map[string]interface{}{
		"year":              in.Year,
		"total_members":     result.TotalMembers,
		"payments_created":  result.PaymentsCreated,
		"total_expected":    result.TotalExpectedAmount,
	})

	return result, nil
}

// validateInput valida los datos de entrada
func (s *feeGenerationService) validateInput(in input.FeeGenerationInput) error {
	currentYear := time.Now().Year()

	if in.Year > currentYear {
		return appErrors.NewValidationError(
			"cannot generate fees for future years",
			map[string]string{
				"year": fmt.Sprintf("must be <= %d", currentYear),
			},
		)
	}

	if in.Year < 2000 {
		return appErrors.NewValidationError(
			"year is too old",
			map[string]string{
				"year": "must be >= 2000",
			},
		)
	}

	if in.BaseFeeAmount <= 0 {
		return appErrors.NewValidationError(
			"base fee amount must be positive",
			map[string]string{
				"base_fee_amount": "must be > 0",
			},
		)
	}

	if in.FamilyFeeExtra < 0 {
		return appErrors.NewValidationError(
			"family fee extra cannot be negative",
			map[string]string{
				"family_fee_extra": "must be >= 0",
			},
		)
	}

	return nil
}

// GetMembershipFee obtiene la cuota de un año
func (s *feeGenerationService) GetMembershipFee(ctx context.Context, year int) (*models.MembershipFee, error) {
	fee, err := s.feeRepo.GetByYear(ctx, year)
	if err != nil {
		return nil, appErrors.NewNotFoundError("membership fee", fmt.Sprintf("year=%d", year))
	}
	return fee, nil
}

// ListMembershipFees lista todas las cuotas
func (s *feeGenerationService) ListMembershipFees(
	ctx context.Context,
	page, pageSize int,
) ([]*models.MembershipFee, int, error) {
	return s.feeRepo.List(ctx, page, pageSize)
}

// CheckFeeExists verifica si existe cuota para un año
func (s *feeGenerationService) CheckFeeExists(ctx context.Context, year int) (bool, error) {
	return s.feeRepo.ExistsByYear(ctx, year)
}

// GetPendingFeesForMember obtiene cuotas pendientes de un miembro
func (s *feeGenerationService) GetPendingFeesForMember(
	ctx context.Context,
	memberID uint,
) ([]*models.MembershipFee, error) {
	return s.feeRepo.GetPendingFeesForMember(ctx, memberID)
}
```

---

## 💾 Repositorios

### 1. Port de Salida: `internal/ports/output/fee_repository.go`

```go
package output

import (
	"context"
	"github.com/javicabdev/asam-backend/internal/domain/models"
)

// FeeRepository define las operaciones de persistencia para MembershipFee
type FeeRepository interface {
	// Create crea una nueva cuota
	Create(ctx context.Context, fee *models.MembershipFee) error
	
	// GetByID obtiene una cuota por ID
	GetByID(ctx context.Context, id uint) (*models.MembershipFee, error)
	
	// GetByYear obtiene la cuota de un año específico
	GetByYear(ctx context.Context, year int) (*models.MembershipFee, error)
	
	// ExistsByYear verifica si existe cuota para un año
	ExistsByYear(ctx context.Context, year int) (bool, error)
	
	// List lista todas las cuotas con paginación
	List(ctx context.Context, page, pageSize int) ([]*models.MembershipFee, int, error)
	
	// GetPendingFeesForMember obtiene cuotas pendientes de un miembro
	GetPendingFeesForMember(ctx context.Context, memberID uint) ([]*models.MembershipFee, error)
	
	// Update actualiza una cuota existente
	Update(ctx context.Context, fee *models.MembershipFee) error
	
	// Delete elimina una cuota (soft delete)
	Delete(ctx context.Context, id uint) error
}
```

### 2. Implementación: `internal/adapters/db/fee_repository.go`

```go
package db

import (
	"context"
	"fmt"

	"gorm.io/gorm"
	"github.com/javicabdev/asam-backend/internal/domain/models"
	"github.com/javicabdev/asam-backend/internal/ports/output"
	appErrors "github.com/javicabdev/asam-backend/pkg/errors"
)

type feeRepository struct {
	db *gorm.DB
}

// NewFeeRepository crea una nueva instancia del repositorio
func NewFeeRepository(db *gorm.DB) output.FeeRepository {
	return &feeRepository{db: db}
}

// Create crea una nueva cuota
func (r *feeRepository) Create(ctx context.Context, fee *models.MembershipFee) error {
	if err := r.db.WithContext(ctx).Create(fee).Error; err != nil {
		if isDuplicateError(err) {
			return appErrors.NewDuplicateError("membership fee", fmt.Sprintf("year=%d", fee.Year))
		}
		return handleDBError(err, "creating membership fee")
	}
	return nil
}

// GetByID obtiene una cuota por ID
func (r *feeRepository) GetByID(ctx context.Context, id uint) (*models.MembershipFee, error) {
	var fee models.MembershipFee
	if err := r.db.WithContext(ctx).First(&fee, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, appErrors.NewNotFoundError("membership fee", fmt.Sprintf("id=%d", id))
		}
		return nil, handleDBError(err, "getting membership fee")
	}
	return &fee, nil
}

// GetByYear obtiene la cuota de un año
func (r *feeRepository) GetByYear(ctx context.Context, year int) (*models.MembershipFee, error) {
	var fee models.MembershipFee
	if err := r.db.WithContext(ctx).Where("year = ?", year).First(&fee).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, appErrors.NewNotFoundError("membership fee", fmt.Sprintf("year=%d", year))
		}
		return nil, handleDBError(err, "getting membership fee by year")
	}
	return &fee, nil
}

// ExistsByYear verifica si existe cuota para un año
func (r *feeRepository) ExistsByYear(ctx context.Context, year int) (bool, error) {
	var count int64
	if err := r.db.WithContext(ctx).
		Model(&models.MembershipFee{}).
		Where("year = ?", year).
		Count(&count).Error; err != nil {
		return false, handleDBError(err, "checking membership fee existence")
	}
	return count > 0, nil
}

// List lista todas las cuotas con paginación
func (r *feeRepository) List(
	ctx context.Context,
	page, pageSize int,
) ([]*models.MembershipFee, int, error) {
	var fees []*models.MembershipFee
	var total int64

	// Contar total
	if err := r.db.WithContext(ctx).Model(&models.MembershipFee{}).Count(&total).Error; err != nil {
		return nil, 0, handleDBError(err, "counting membership fees")
	}

	// Obtener página
	offset := (page - 1) * pageSize
	if err := r.db.WithContext(ctx).
		Order("year DESC").
		Offset(offset).
		Limit(pageSize).
		Find(&fees).Error; err != nil {
		return nil, 0, handleDBError(err, "listing membership fees")
	}

	return fees, int(total), nil
}

// GetPendingFeesForMember obtiene cuotas pendientes de un miembro
func (r *feeRepository) GetPendingFeesForMember(
	ctx context.Context,
	memberID uint,
) ([]*models.MembershipFee, error) {
	var fees []*models.MembershipFee
	
	// Subconsulta para obtener IDs de cuotas ya pagadas
	subQuery := r.db.WithContext(ctx).
		Model(&models.Payment{}).
		Select("membership_fee_id").
		Where("member_id = ? AND status = ?", memberID, models.PaymentStatusPaid)

	// Obtener cuotas que NO están en la subconsulta
	if err := r.db.WithContext(ctx).
		Where("id NOT IN (?)", subQuery).
		Order("year DESC").
		Find(&fees).Error; err != nil {
		return nil, handleDBError(err, "getting pending fees for member")
	}

	return fees, nil
}

// Update actualiza una cuota
func (r *feeRepository) Update(ctx context.Context, fee *models.MembershipFee) error {
	if err := r.db.WithContext(ctx).Save(fee).Error; err != nil {
		return handleDBError(err, "updating membership fee")
	}
	return nil
}

// Delete elimina una cuota (soft delete)
func (r *feeRepository) Delete(ctx context.Context, id uint) error {
	if err := r.db.WithContext(ctx).Delete(&models.MembershipFee{}, id).Error; err != nil {
		return handleDBError(err, "deleting membership fee")
	}
	return nil
}
```

### 3. Actualizar `internal/adapters/db/payment_repository.go`

Añadir el método para verificar pagos existentes:

```go
// HasPaymentForFee verifica si un miembro ya tiene un pago para una cuota específica
func (r *paymentRepository) HasPaymentForFee(
	ctx context.Context,
	memberID uint,
	feeID uint,
) (bool, error) {
	var count int64
	if err := r.db.WithContext(ctx).
		Model(&models.Payment{}).
		Where("member_id = ? AND membership_fee_id = ?", memberID, feeID).
		Count(&count).Error; err != nil {
		return false, handleDBError(err, "checking payment for fee")
	}
	return count > 0, nil
}
```

Y actualizar la interfaz en `internal/ports/output/payment_repository.go`:

```go
type PaymentRepository interface {
	// ... métodos existentes ...
	
	// HasPaymentForFee verifica si existe pago para una cuota
	HasPaymentForFee(ctx context.Context, memberID uint, feeID uint) (bool, error)
}
```

---

## 📡 GraphQL Schema

### Modificar `internal/adapters/gql/schema/schema.graphql`

Añadir tipos, inputs y operations:

```graphql
# ============================================
# INPUTS PARA FEE GENERATION
# ============================================

"""
Input para generar cuotas anuales
"""
input GenerateAnnualFeesInput {
    """
    Año para el que se generan las cuotas
    Debe ser <= año actual
    """
    year: Int!
    
    """
    Monto base de la cuota
    """
    baseFeeAmount: Float!
    
    """
    Monto extra para familias (opcional, default: 0)
    """
    familyFeeExtra: Float
}

# ============================================
# TIPOS DE RESPUESTA
# ============================================

"""
Resultado de la generación de cuotas anuales
"""
type FeeGenerationResult {
    """
    La cuota de membresía creada o existente
    """
    membershipFee: MembershipFee!
    
    """
    Total de miembros activos procesados
    """
    totalMembers: Int!
    
    """
    Número de miembros individuales
    """
    individualMembers: Int!
    
    """
    Número de familias
    """
    familyMembers: Int!
    
    """
    Número de pagos creados
    """
    paymentsCreated: Int!
    
    """
    Monto total esperado de recaudación
    """
    totalExpectedAmount: Float!
    
    """
    Indica si la cuota ya existía previamente
    """
    alreadyExisted: Boolean!
}

"""
Conexión paginada de cuotas de membresía
"""
type MembershipFeeConnection {
    nodes: [MembershipFee!]!
    pageInfo: PageInfo!
}

# ============================================
# QUERIES
# ============================================

extend type Query {
    """
    Obtiene la cuota de membresía de un año específico
    """
    getMembershipFee(year: Int!): MembershipFee
    
    """
    Lista todas las cuotas de membresía con paginación
    """
    listMembershipFees(page: Int = 1, pageSize: Int = 10): MembershipFeeConnection!
    
    """
    Verifica si ya existe una cuota para un año
    """
    checkFeeExists(year: Int!): Boolean!
    
    """
    Obtiene las cuotas pendientes de pago para un miembro
    """
    getPendingFeesForMember(memberId: ID!): [MembershipFee!]!
}

# ============================================
# MUTATIONS
# ============================================

extend type Mutation {
    """
    Genera las cuotas anuales para todos los miembros activos
    Requiere rol ADMIN
    """
    generateAnnualFees(input: GenerateAnnualFeesInput!): FeeGenerationResult!
    
    """
    Actualiza el monto de una cuota existente
    Requiere rol ADMIN
    """
    updateMembershipFee(
        id: ID!
        baseFeeAmount: Float
        familyFeeExtra: Float
    ): MembershipFee!
    
    """
    Elimina una cuota y todos sus pagos asociados
    Requiere rol ADMIN
    USAR CON PRECAUCIÓN
    """
    deleteMembershipFee(id: ID!): MutationResponse!
}
```

---

## 🔌 Resolvers

### Crear `internal/adapters/gql/resolvers/fee_resolver.go`

```go
package resolvers

import (
	"context"

	"github.com/javicabdev/asam-backend/internal/adapters/gql/model"
	"github.com/javicabdev/asam-backend/internal/domain/models"
	"github.com/javicabdev/asam-backend/internal/ports/input"
	"github.com/javicabdev/asam-backend/pkg/constants"
)

// Query Resolvers

// GetMembershipFee obtiene una cuota por año
func (r *queryResolver) GetMembershipFee(ctx context.Context, year int) (*model.MembershipFee, error) {
	fee, err := r.services.FeeGenerationService.GetMembershipFee(ctx, year)
	if err != nil {
		return nil, err
	}
	return mapMembershipFeeToGQL(fee), nil
}

// ListMembershipFees lista todas las cuotas
func (r *queryResolver) ListMembershipFees(
	ctx context.Context,
	page *int,
	pageSize *int,
) (*model.MembershipFeeConnection, error) {
	p := getOrDefault(page, 1)
	ps := getOrDefault(pageSize, 10)

	fees, total, err := r.services.FeeGenerationService.ListMembershipFees(ctx, p, ps)
	if err != nil {
		return nil, err
	}

	nodes := make([]*model.MembershipFee, len(fees))
	for i, fee := range fees {
		nodes[i] = mapMembershipFeeToGQL(fee)
	}

	return &model.MembershipFeeConnection{
		Nodes: nodes,
		PageInfo: &model.PageInfo{
			HasNextPage:     (p * ps) < total,
			HasPreviousPage: p > 1,
			TotalCount:      total,
		},
	}, nil
}

// CheckFeeExists verifica si existe cuota para un año
func (r *queryResolver) CheckFeeExists(ctx context.Context, year int) (bool, error) {
	return r.services.FeeGenerationService.CheckFeeExists(ctx, year)
}

// GetPendingFeesForMember obtiene cuotas pendientes de un miembro
func (r *queryResolver) GetPendingFeesForMember(
	ctx context.Context,
	memberID string,
) ([]*model.MembershipFee, error) {
	id, err := parseID(memberID)
	if err != nil {
		return nil, err
	}

	fees, err := r.services.FeeGenerationService.GetPendingFeesForMember(ctx, id)
	if err != nil {
		return nil, err
	}

	result := make([]*model.MembershipFee, len(fees))
	for i, fee := range fees {
		result[i] = mapMembershipFeeToGQL(fee)
	}

	return result, nil
}

// Mutation Resolvers

// GenerateAnnualFees genera las cuotas anuales
func (r *mutationResolver) GenerateAnnualFees(
	ctx context.Context,
	input model.GenerateAnnualFeesInput,
) (*model.FeeGenerationResult, error) {
	// Verificar autorización
	user := ctx.Value(constants.ContextKeyUser).(*models.User)
	if user.Role != models.UserRoleAdmin {
		return nil, ErrUnauthorized
	}

	// Preparar input
	serviceInput := input.FeeGenerationInput{
		Year:           input.Year,
		BaseFeeAmount:  input.BaseFeeAmount,
		FamilyFeeExtra: getOrDefaultFloat(input.FamilyFeeExtra, 0),
	}

	// Ejecutar generación
	result, err := r.services.FeeGenerationService.GenerateAnnualFees(ctx, serviceInput)
	if err != nil {
		return nil, err
	}

	// Mapear resultado
	return &model.FeeGenerationResult{
		MembershipFee:       mapMembershipFeeToGQL(result.MembershipFee),
		TotalMembers:        result.TotalMembers,
		IndividualMembers:   result.IndividualMembers,
		FamilyMembers:       result.FamilyMembers,
		PaymentsCreated:     result.PaymentsCreated,
		TotalExpectedAmount: result.TotalExpectedAmount,
		AlreadyExisted:      result.AlreadyExisted,
	}, nil
}

// Helper functions

func mapMembershipFeeToGQL(fee *models.MembershipFee) *model.MembershipFee {
	return &model.MembershipFee{
		ID:             fmt.Sprintf("%d", fee.ID),
		Year:           fee.Year,
		BaseFeeAmount:  fee.BaseFeeAmount,
		FamilyFeeExtra: fee.FamilyFeeExtra,
		DueDate:        fee.DueDate,
	}
}

func getOrDefaultFloat(val *float64, def float64) float64 {
	if val == nil {
		return def
	}
	return *val
}
```

---

## ✅ Validaciones

### Validaciones de Negocio

1. **Año Válido**:
   - Debe ser <= año actual
   - Debe ser >= 2000 (límite razonable)

2. **Montos**:
   - `baseFeeAmount` debe ser > 0
   - `familyFeeExtra` debe ser >= 0

3. **Duplicación**:
   - No se puede crear cuota duplicada para el mismo año
   - No se crean pagos duplicados para mismo miembro/cuota

4. **Miembros Activos**:
   - Solo se generan pagos para miembros con `estado = ACTIVE`

5. **Integridad Transaccional**:
   - Si falla la creación de algún pago, se continúa con los demás
   - Se registra el error en los logs

---

## 🧪 Tests

### 1. Tests Unitarios del Servicio

Crear `internal/domain/services/fee_generation_service_test.go`:

```go
package services_test

import (
	"context"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	
	"github.com/javicabdev/asam-backend/internal/domain/models"
	"github.com/javicabdev/asam-backend/internal/domain/services"
	"github.com/javicabdev/asam-backend/internal/ports/input"
	"github.com/javicabdev/asam-backend/test/unit/testutils"
)

func TestFeeGenerationService_GenerateAnnualFees(t *testing.T) {
	ctx := context.Background()

	t.Run("Success - Generate fees for new year", func(t *testing.T) {
		// Setup mocks
		feeRepo := new(testutils.MockFeeRepository)
		memberRepo := new(testutils.MockMemberRepository)
		paymentRepo := new(testutils.MockPaymentRepository)
		logger := testutils.NewMockLogger()

		// Mock data
		currentYear := time.Now().Year()
		members := []*models.Member{
			testutils.NewMemberBuilder().WithID(1).WithType(models.MembershipTypeIndividual).Build(),
			testutils.NewMemberBuilder().WithID(2).WithType(models.MembershipTypeFamily).Build(),
		}

		// Expectations
		feeRepo.On("ExistsByYear", ctx, currentYear).Return(false, nil)
		feeRepo.On("Create", ctx, mock.AnythingOfType("*models.MembershipFee")).Return(nil)
		memberRepo.On("FindActiveMembers", ctx).Return(members, nil)
		paymentRepo.On("HasPaymentForFee", ctx, mock.Anything, mock.Anything).Return(false, nil)
		paymentRepo.On("Create", ctx, mock.AnythingOfType("*models.Payment")).Return(nil)

		// Execute
		service := services.NewFeeGenerationService(feeRepo, memberRepo, paymentRepo, logger)
		result, err := service.GenerateAnnualFees(ctx, input.FeeGenerationInput{
			Year:           currentYear,
			BaseFeeAmount:  100.0,
			FamilyFeeExtra: 50.0,
		})

		// Assert
		assert.NoError(t, err)
		assert.NotNil(t, result)
		assert.Equal(t, 2, result.TotalMembers)
		assert.Equal(t, 1, result.IndividualMembers)
		assert.Equal(t, 1, result.FamilyMembers)
		assert.Equal(t, 2, result.PaymentsCreated)
		assert.Equal(t, 250.0, result.TotalExpectedAmount) // 100 + 150
		assert.False(t, result.AlreadyExisted)

		feeRepo.AssertExpectations(t)
		memberRepo.AssertExpectations(t)
		paymentRepo.AssertExpectations(t)
	})

	t.Run("Error - Future year", func(t *testing.T) {
		feeRepo := new(testutils.MockFeeRepository)
		memberRepo := new(testutils.MockMemberRepository)
		paymentRepo := new(testutils.MockPaymentRepository)
		logger := testutils.NewMockLogger()

		service := services.NewFeeGenerationService(feeRepo, memberRepo, paymentRepo, logger)
		
		futureYear := time.Now().Year() + 1
		_, err := service.GenerateAnnualFees(ctx, input.FeeGenerationInput{
			Year:          futureYear,
			BaseFeeAmount: 100.0,
		})

		assert.Error(t, err)
		assert.Contains(t, err.Error(), "cannot generate fees for future years")
	})

	t.Run("Success - Fee already exists", func(t *testing.T) {
		// Test que la cuota ya existe y se usa la existente
		// ...
	})
}
```

### 2. Tests de Integración

Crear `test/integration/fee_generation_test.go`:

```go
package integration_test

import (
	"context"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	
	"github.com/javicabdev/asam-backend/internal/domain/models"
	"github.com/javicabdev/asam-backend/internal/ports/input"
)

func TestFeeGeneration_Integration(t *testing.T) {
	// Setup test database
	db := setupTestDB(t)
	defer db.Close()

	ctx := context.Background()

	t.Run("Complete flow - Generate and verify", func(t *testing.T) {
		// 1. Crear miembros de prueba
		member1 := createTestMember(t, db, models.MembershipTypeIndividual)
		member2 := createTestMember(t, db, models.MembershipTypeFamily)

		// 2. Generar cuotas
		service := createFeeService(t, db)
		currentYear := time.Now().Year()
		
		result, err := service.GenerateAnnualFees(ctx, input.FeeGenerationInput{
			Year:           currentYear,
			BaseFeeAmount:  100.0,
			FamilyFeeExtra: 50.0,
		})

		require.NoError(t, err)
		assert.Equal(t, 2, result.PaymentsCreated)

		// 3. Verificar que se crearon los pagos
		payments := getPaymentsForYear(t, db, currentYear)
		assert.Len(t, payments, 2)

		// 4. Verificar montos correctos
		for _, payment := range payments {
			if payment.MemberID == member1.MiembroID {
				assert.Equal(t, 100.0, payment.Amount)
			} else {
				assert.Equal(t, 150.0, payment.Amount)
			}
			assert.Equal(t, models.PaymentStatusPending, payment.Status)
		}

		// 5. Verificar que no se puede duplicar
		result2, err := service.GenerateAnnualFees(ctx, input.FeeGenerationInput{
			Year:           currentYear,
			BaseFeeAmount:  100.0,
			FamilyFeeExtra: 50.0,
		})
		require.NoError(t, err)
		assert.Equal(t, 0, result2.PaymentsCreated) // No se crean nuevos
		assert.True(t, result2.AlreadyExisted)
	})
}
```

---

## 📊 Métricas y Monitoring

### Puntos de Instrumentación

```go
// En el servicio, añadir métricas:
func (s *feeGenerationService) GenerateAnnualFees(...) (*input.FeeGenerationResult, error) {
	start := time.Now()
	defer func() {
		duration := time.Since(start)
		s.logger.Info("Fee generation completed", map[string]interface{}{
			"year":     in.Year,
			"duration": duration.Milliseconds(),
		})
	}()
	
	// ... resto del código
}
```

### Logs Importantes

1. Inicio de generación
2. Cuotas ya existentes
3. Errores en creación de pagos individuales
4. Resumen final con estadísticas
5. Duración total del proceso

---

## 🔄 Migraciones

### Script de Migración

Crear `migrations/000002_add_membership_fee_to_payments.up.sql`:

```sql
-- Añadir columna membership_fee_id a payments si no existe
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS membership_fee_id BIGINT UNSIGNED;

-- Crear índice para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_payments_membership_fee_id 
ON payments(membership_fee_id);

-- Añadir foreign key constraint
ALTER TABLE payments 
ADD CONSTRAINT fk_payments_membership_fee 
FOREIGN KEY (membership_fee_id) 
REFERENCES membership_fees(id) 
ON DELETE SET NULL;
```

### Rollback Migration

Crear `migrations/000002_add_membership_fee_to_payments.down.sql`:

```sql
-- Eliminar foreign key
ALTER TABLE payments 
DROP FOREIGN KEY IF EXISTS fk_payments_membership_fee;

-- Eliminar índice
DROP INDEX IF EXISTS idx_payments_membership_fee_id ON payments;

-- Eliminar columna
ALTER TABLE payments 
DROP COLUMN IF EXISTS membership_fee_id;
```

---

## ✅ Checklist de Implementación

### Fase 1: Modelos y Migraciones
- [ ] Verificar modelo `MembershipFee` en `payment.go`
- [ ] Crear migraciones para `membership_fee_id` en payments
- [ ] Ejecutar migraciones en desarrollo
- [ ] Validar estructura de tablas

### Fase 2: Repositorios
- [ ] Crear `internal/ports/output/fee_repository.go`
- [ ] Implementar `internal/adapters/db/fee_repository.go`
- [ ] Actualizar `payment_repository.go` con `HasPaymentForFee`
- [ ] Tests unitarios de repositorios

### Fase 3: Servicios
- [ ] Crear `internal/ports/input/fee_generation_service.go`
- [ ] Implementar `internal/domain/services/fee_generation_service.go`
- [ ] Añadir validaciones de negocio
- [ ] Tests unitarios del servicio

### Fase 4: GraphQL
- [ ] Actualizar `schema.graphql` con nuevos tipos
- [ ] Crear `fee_resolver.go`
- [ ] Actualizar `resolver.go` para incluir nuevo servicio
- [ ] Regenerar tipos GraphQL: `make generate`

### Fase 5: Tests
- [ ] Tests unitarios completos
- [ ] Tests de integración
- [ ] Tests de validación
- [ ] Cobertura >= 80%

### Fase 6: Documentación
- [ ] Documentar API en schema GraphQL
- [ ] Añadir ejemplos de uso
- [ ] Actualizar README si es necesario

---

## 🎓 Guía de Ejemplo Completo

### Escenario: Generar cuotas para 2024

```graphql
# 1. Verificar si ya existe la cuota
query CheckFee2024 {
  checkFeeExists(year: 2024)
}

# Response: false

# 2. Generar cuotas
mutation GenerateFees2024 {
  generateAnnualFees(input: {
    year: 2024
    baseFeeAmount: 100.0
    familyFeeExtra: 50.0
  }) {
    membershipFee {
      id
      year
      baseFeeAmount
      familyFeeExtra
    }
    totalMembers
    individualMembers
    familyMembers
    paymentsCreated
    totalExpectedAmount
    alreadyExisted
  }
}

# Response:
{
  "data": {
    "generateAnnualFees": {
      "membershipFee": {
        "id": "1",
        "year": 2024,
        "baseFeeAmount": 100.0,
        "familyFeeExtra": 50.0
      },
      "totalMembers": 150,
      "individualMembers": 100,
      "familyMembers": 50,
      "paymentsCreated": 150,
      "totalExpectedAmount": 17500.0,
      "alreadyExisted": false
    }
  }
}

# 3. Listar todas las cuotas creadas
query ListAllFees {
  listMembershipFees(page: 1, pageSize: 10) {
    nodes {
      id
      year
      baseFeeAmount
      familyFeeExtra
      dueDate
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      totalCount
    }
  }
}

# 4. Ver cuotas pendientes de un miembro específico
query GetPendingFees {
  getPendingFeesForMember(memberId: "123") {
    id
    year
    baseFeeAmount
  }
}
```

---

**Próximo Paso**: Continuar con [Frontend Implementation](./frontend.md)
