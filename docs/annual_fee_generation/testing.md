# Testing Strategy - Annual Fee Generation

## 📋 Tabla de Contenidos

1. [Estrategia General](#estrategia-general)
2. [Tests Unitarios Backend](#tests-unitarios-backend)
3. [Tests de Integración Backend](#tests-de-integración-backend)
4. [Tests Unitarios Frontend](#tests-unitarios-frontend)
5. [Tests de Integración Frontend](#tests-de-integración-frontend)
6. [Tests End-to-End](#tests-end-to-end)
7. [Métricas de Cobertura](#métricas-de-cobertura)

---

## 🎯 Estrategia General

### Pirámide de Testing

```
           /\
          /  \     E2E Tests (5%)
         /    \    - Happy path principal
        /------\   - Casos críticos de negocio
       /        \  
      /  Integration Tests (25%)
     /    - Flujos completos
    /     - Interacción entre capas
   /-----------------------------\
  /                               \
 /     Unit Tests (70%)            \
/  - Servicios, Hooks, Componentes \
-----------------------------------
```

### Objetivos de Cobertura

| Capa | Cobertura Mínima | Cobertura Ideal |
|------|------------------|-----------------|
| Backend Services | 85% | 95% |
| Backend Repositories | 80% | 90% |
| Frontend Hooks | 80% | 90% |
| Frontend Components | 70% | 85% |
| Frontend Pages | 60% | 80% |
| **Global** | **75%** | **85%** |

---

## 🔧 Tests Unitarios Backend

### 1. Servicio de Generación de Cuotas

**Ubicación**: `test/unit/services/fee_generation_service_test.go`

```go
package services_test

import (
	"context"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/require"

	"github.com/javicabdev/asam-backend/internal/domain/models"
	"github.com/javicabdev/asam-backend/internal/domain/services"
	"github.com/javicabdev/asam-backend/internal/ports/input"
	"github.com/javicabdev/asam-backend/test/testutils"
)

func TestFeeGenerationService_GenerateAnnualFees(t *testing.T) {
	ctx := context.Background()

	t.Run("Success - Generate fees for new year", func(t *testing.T) {
		// Arrange
		feeRepo := testutils.NewMockFeeRepository()
		memberRepo := testutils.NewMockMemberRepository()
		paymentRepo := testutils.NewMockPaymentRepository()
		logger := testutils.NewMockLogger()

		currentYear := time.Now().Year()
		members := []*models.Member{
			testutils.NewMemberBuilder().
				WithID(1).
				WithType(models.MembershipTypeIndividual).
				WithState(models.MemberStateActive).
				Build(),
			testutils.NewMemberBuilder().
				WithID(2).
				WithType(models.MembershipTypeFamily).
				WithState(models.MemberStateActive).
				Build(),
		}

		feeRepo.On("ExistsByYear", ctx, currentYear).Return(false, nil)
		feeRepo.On("Create", ctx, mock.AnythingOfType("*models.MembershipFee")).
			Return(nil).
			Run(func(args mock.Arguments) {
				fee := args.Get(1).(*models.MembershipFee)
				fee.ID = 1 // Simular ID asignado por BD
			})

		memberRepo.On("FindActiveMembers", ctx).Return(members, nil)
		
		paymentRepo.On("HasPaymentForFee", ctx, uint(1), uint(1)).Return(false, nil)
		paymentRepo.On("HasPaymentForFee", ctx, uint(2), uint(1)).Return(false, nil)
		
		paymentRepo.On("Create", ctx, mock.MatchedBy(func(p *models.Payment) bool {
			return p.MemberID == 1 && p.Amount == 100.0
		})).Return(nil)
		
		paymentRepo.On("Create", ctx, mock.MatchedBy(func(p *models.Payment) bool {
			return p.MemberID == 2 && p.Amount == 150.0
		})).Return(nil)

		service := services.NewFeeGenerationService(feeRepo, memberRepo, paymentRepo, logger)

		// Act
		result, err := service.GenerateAnnualFees(ctx, input.FeeGenerationInput{
			Year:           currentYear,
			BaseFeeAmount:  100.0,
			FamilyFeeExtra: 50.0,
		})

		// Assert
		require.NoError(t, err)
		assert.NotNil(t, result)
		assert.Equal(t, 2, result.TotalMembers)
		assert.Equal(t, 1, result.IndividualMembers)
		assert.Equal(t, 1, result.FamilyMembers)
		assert.Equal(t, 2, result.PaymentsCreated)
		assert.Equal(t, 250.0, result.TotalExpectedAmount)
		assert.False(t, result.AlreadyExisted)

		feeRepo.AssertExpectations(t)
		memberRepo.AssertExpectations(t)
		paymentRepo.AssertExpectations(t)
	})

	t.Run("Error - Future year not allowed", func(t *testing.T) {
		// Arrange
		feeRepo := testutils.NewMockFeeRepository()
		memberRepo := testutils.NewMockMemberRepository()
		paymentRepo := testutils.NewMockPaymentRepository()
		logger := testutils.NewMockLogger()

		service := services.NewFeeGenerationService(feeRepo, memberRepo, paymentRepo, logger)
		
		futureYear := time.Now().Year() + 1

		// Act
		_, err := service.GenerateAnnualFees(ctx, input.FeeGenerationInput{
			Year:          futureYear,
			BaseFeeAmount: 100.0,
		})

		// Assert
		require.Error(t, err)
		assert.Contains(t, err.Error(), "cannot generate fees for future years")
	})

	t.Run("Error - Negative base fee amount", func(t *testing.T) {
		// Arrange
		service := createServiceWithMocks()

		// Act
		_, err := service.GenerateAnnualFees(ctx, input.FeeGenerationInput{
			Year:          2024,
			BaseFeeAmount: -50.0,
		})

		// Assert
		require.Error(t, err)
		assert.Contains(t, err.Error(), "base fee amount must be positive")
	})

	t.Run("Success - Fee already exists, no payments created", func(t *testing.T) {
		// Arrange
		feeRepo := testutils.NewMockFeeRepository()
		memberRepo := testutils.NewMockMemberRepository()
		paymentRepo := testutils.NewMockPaymentRepository()
		logger := testutils.NewMockLogger()

		existingFee := &models.MembershipFee{
			Model:          gorm.Model{ID: 1},
			Year:           2024,
			BaseFeeAmount:  100.0,
			FamilyFeeExtra: 50.0,
		}

		members := []*models.Member{
			testutils.NewMemberBuilder().WithID(1).Build(),
		}

		feeRepo.On("ExistsByYear", ctx, 2024).Return(true, nil)
		feeRepo.On("GetByYear", ctx, 2024).Return(existingFee, nil)
		memberRepo.On("FindActiveMembers", ctx).Return(members, nil)
		paymentRepo.On("HasPaymentForFee", ctx, uint(1), uint(1)).Return(true, nil)

		service := services.NewFeeGenerationService(feeRepo, memberRepo, paymentRepo, logger)

		// Act
		result, err := service.GenerateAnnualFees(ctx, input.FeeGenerationInput{
			Year:           2024,
			BaseFeeAmount:  100.0,
			FamilyFeeExtra: 50.0,
		})

		// Assert
		require.NoError(t, err)
		assert.True(t, result.AlreadyExisted)
		assert.Equal(t, 0, result.PaymentsCreated)
	})

	t.Run("Edge Case - No active members", func(t *testing.T) {
		// Arrange
		feeRepo := testutils.NewMockFeeRepository()
		memberRepo := testutils.NewMockMemberRepository()
		paymentRepo := testutils.NewMockPaymentRepository()
		logger := testutils.NewMockLogger()

		feeRepo.On("ExistsByYear", ctx, 2024).Return(false, nil)
		feeRepo.On("Create", ctx, mock.Anything).Return(nil)
		memberRepo.On("FindActiveMembers", ctx).Return([]*models.Member{}, nil)

		service := services.NewFeeGenerationService(feeRepo, memberRepo, paymentRepo, logger)

		// Act
		result, err := service.GenerateAnnualFees(ctx, input.FeeGenerationInput{
			Year:          2024,
			BaseFeeAmount: 100.0,
		})

		// Assert
		require.NoError(t, err)
		assert.Equal(t, 0, result.TotalMembers)
		assert.Equal(t, 0, result.PaymentsCreated)
	})

	t.Run("Partial Success - Continue on individual payment errors", func(t *testing.T) {
		// Test que algunos pagos fallen pero se continúe con el resto
		// ...
	})
}

func TestFeeGenerationService_GetMembershipFee(t *testing.T) {
	ctx := context.Background()

	t.Run("Success - Get existing fee", func(t *testing.T) {
		// Arrange
		feeRepo := testutils.NewMockFeeRepository()
		service := createServiceWithMocks()

		expectedFee := &models.MembershipFee{
			Model:          gorm.Model{ID: 1},
			Year:           2024,
			BaseFeeAmount:  100.0,
			FamilyFeeExtra: 50.0,
		}

		feeRepo.On("GetByYear", ctx, 2024).Return(expectedFee, nil)

		// Act
		fee, err := service.GetMembershipFee(ctx, 2024)

		// Assert
		require.NoError(t, err)
		assert.Equal(t, expectedFee, fee)
	})

	t.Run("Error - Fee not found", func(t *testing.T) {
		// Test para cuota no encontrada
		// ...
	})
}
```

### 2. Repositorio de Cuotas

**Ubicación**: `test/unit/adapters/db/fee_repository_test.go`

```go
package db_test

import (
	"context"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"github.com/javicabdev/asam-backend/internal/adapters/db"
	"github.com/javicabdev/asam-backend/internal/domain/models"
	"github.com/javicabdev/asam-backend/test/testutils"
)

func TestFeeRepository_Create(t *testing.T) {
	testDB := testutils.SetupTestDB(t)
	defer testDB.Teardown()

	ctx := context.Background()
	repo := db.NewFeeRepository(testDB.DB)

	t.Run("Success - Create new fee", func(t *testing.T) {
		// Arrange
		fee := models.NewMembershipFee(2024, 100.0, 50.0)

		// Act
		err := repo.Create(ctx, fee)

		// Assert
		require.NoError(t, err)
		assert.NotZero(t, fee.ID)
		assert.Equal(t, 2024, fee.Year)
	})

	t.Run("Error - Duplicate year", func(t *testing.T) {
		// Arrange
		fee1 := models.NewMembershipFee(2025, 100.0, 50.0)
		require.NoError(t, repo.Create(ctx, fee1))

		fee2 := models.NewMembershipFee(2025, 120.0, 60.0)

		// Act
		err := repo.Create(ctx, fee2)

		// Assert
		require.Error(t, err)
		assert.Contains(t, err.Error(), "duplicate")
	})
}

func TestFeeRepository_GetByYear(t *testing.T) {
	testDB := testutils.SetupTestDB(t)
	defer testDB.Teardown()

	ctx := context.Background()
	repo := db.NewFeeRepository(testDB.DB)

	t.Run("Success - Get existing fee", func(t *testing.T) {
		// Arrange
		originalFee := models.NewMembershipFee(2024, 100.0, 50.0)
		require.NoError(t, repo.Create(ctx, originalFee))

		// Act
		fee, err := repo.GetByYear(ctx, 2024)

		// Assert
		require.NoError(t, err)
		assert.Equal(t, originalFee.ID, fee.ID)
		assert.Equal(t, 2024, fee.Year)
	})

	t.Run("Error - Fee not found", func(t *testing.T) {
		// Act
		_, err := repo.GetByYear(ctx, 2999)

		// Assert
		require.Error(t, err)
		assert.Contains(t, err.Error(), "not found")
	})
}
```

### 3. Test de Validaciones

**Ubicación**: `test/unit/services/fee_validation_test.go`

```go
package services_test

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"

	"github.com/javicabdev/asam-backend/internal/ports/input"
	"github.com/javicabdev/asam-backend/internal/domain/services"
)

func TestValidateFeeInput(t *testing.T) {
	currentYear := time.Now().Year()

	testCases := []struct {
		name        string
		input       input.FeeGenerationInput
		shouldError bool
		errorMsg    string
	}{
		{
			name: "Valid input - current year",
			input: input.FeeGenerationInput{
				Year:           currentYear,
				BaseFeeAmount:  100.0,
				FamilyFeeExtra: 50.0,
			},
			shouldError: false,
		},
		{
			name: "Valid input - past year",
			input: input.FeeGenerationInput{
				Year:           currentYear - 1,
				BaseFeeAmount:  100.0,
				FamilyFeeExtra: 0,
			},
			shouldError: false,
		},
		{
			name: "Invalid - future year",
			input: input.FeeGenerationInput{
				Year:          currentYear + 1,
				BaseFeeAmount: 100.0,
			},
			shouldError: true,
			errorMsg:    "cannot generate fees for future years",
		},
		{
			name: "Invalid - zero base fee",
			input: input.FeeGenerationInput{
				Year:          currentYear,
				BaseFeeAmount: 0,
			},
			shouldError: true,
			errorMsg:    "base fee amount must be positive",
		},
		{
			name: "Invalid - negative family extra",
			input: input.FeeGenerationInput{
				Year:           currentYear,
				BaseFeeAmount:  100.0,
				FamilyFeeExtra: -10.0,
			},
			shouldError: true,
			errorMsg:    "family fee extra cannot be negative",
		},
		{
			name: "Invalid - year too old",
			input: input.FeeGenerationInput{
				Year:          1999,
				BaseFeeAmount: 100.0,
			},
			shouldError: true,
			errorMsg:    "year is too old",
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			service := createServiceWithMocks()

			err := service.validateInput(tc.input)

			if tc.shouldError {
				assert.Error(t, err)
				assert.Contains(t, err.Error(), tc.errorMsg)
			} else {
				assert.NoError(t, err)
			}
		})
	}
}
```

---

## 🔗 Tests de Integración Backend

### 1. Flujo Completo de Generación

**Ubicación**: `test/integration/fee_generation_flow_test.go`

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

func TestFeeGenerationFlow_Complete(t *testing.T) {
	if testing.Short() {
		t.Skip("Skipping integration test")
	}

	// Setup
	testContainer := setupIntegrationTest(t)
	defer testContainer.Cleanup()

	ctx := context.Background()
	currentYear := time.Now().Year()

	t.Run("Complete fee generation flow", func(t *testing.T) {
		// 1. Crear miembros de prueba
		member1 := createTestMember(t, testContainer.DB, &models.Member{
			Nombre:          "Juan",
			Apellidos:       "Pérez",
			TipoMembresia:   models.MembershipTypeIndividual,
			Estado:          models.MemberStateActive,
		})

		member2 := createTestMember(t, testContainer.DB, &models.Member{
			Nombre:          "María",
			Apellidos:       "García",
			TipoMembresia:   models.MembershipTypeFamily,
			Estado:          models.MemberStateActive,
		})

		// 2. Verificar que no existe cuota para el año
		exists, err := testContainer.Services.FeeService.CheckFeeExists(ctx, currentYear)
		require.NoError(t, err)
		assert.False(t, exists)

		// 3. Generar cuotas
		result, err := testContainer.Services.FeeService.GenerateAnnualFees(ctx, input.FeeGenerationInput{
			Year:           currentYear,
			BaseFeeAmount:  100.0,
			FamilyFeeExtra: 50.0,
		})

		require.NoError(t, err)
		assert.NotNil(t, result)
		assert.Equal(t, 2, result.TotalMembers)
		assert.Equal(t, 2, result.PaymentsCreated)
		assert.Equal(t, 250.0, result.TotalExpectedAmount)

		// 4. Verificar que se creó la cuota
		fee, err := testContainer.Services.FeeService.GetMembershipFee(ctx, currentYear)
		require.NoError(t, err)
		assert.Equal(t, currentYear, fee.Year)

		// 5. Verificar que se crearon los pagos
		payments := getAllPaymentsForYear(t, testContainer.DB, currentYear)
		assert.Len(t, payments, 2)

		// 6. Verificar montos correctos
		for _, payment := range payments {
			assert.Equal(t, models.PaymentStatusPending, payment.Status)
			assert.Equal(t, fee.ID, *payment.MembershipFeeID)

			if payment.MemberID == member1.MiembroID {
				assert.Equal(t, 100.0, payment.Amount)
			} else if payment.MemberID == member2.MiembroID {
				assert.Equal(t, 150.0, payment.Amount)
			}
		}

		// 7. Intentar generar de nuevo (debe usar cuota existente)
		result2, err := testContainer.Services.FeeService.GenerateAnnualFees(ctx, input.FeeGenerationInput{
			Year:           currentYear,
			BaseFeeAmount:  100.0,
			FamilyFeeExtra: 50.0,
		})

		require.NoError(t, err)
		assert.True(t, result2.AlreadyExisted)
		assert.Equal(t, 0, result2.PaymentsCreated) // No se crean pagos duplicados

		// 8. Verificar que no hay pagos duplicados
		paymentsAfter := getAllPaymentsForYear(t, testContainer.DB, currentYear)
		assert.Len(t, paymentsAfter, 2) // Sigue siendo 2
	})

	t.Run("Generate for multiple years", func(t *testing.T) {
		member := createTestMember(t, testContainer.DB, &models.Member{
			Nombre:        "Pedro",
			Apellidos:     "López",
			TipoMembresia: models.MembershipTypeIndividual,
			Estado:        models.MemberStateActive,
		})

		// Generar cuotas para 3 años diferentes
		years := []int{2022, 2023, 2024}
		for _, year := range years {
			result, err := testContainer.Services.FeeService.GenerateAnnualFees(ctx, input.FeeGenerationInput{
				Year:          year,
				BaseFeeAmount: 100.0,
			})

			require.NoError(t, err)
			assert.NotNil(t, result)
		}

		// Verificar cuotas pendientes del miembro
		pendingFees, err := testContainer.Services.FeeService.GetPendingFeesForMember(ctx, member.MiembroID)
		require.NoError(t, err)
		assert.Len(t, pendingFees, 3)
	})
}

func TestFeeGenerationFlow_EdgeCases(t *testing.T) {
	if testing.Short() {
		t.Skip("Skipping integration test")
	}

	testContainer := setupIntegrationTest(t)
	defer testContainer.Cleanup()

	ctx := context.Background()

	t.Run("No active members", func(t *testing.T) {
		// Crear solo miembros inactivos
		createTestMember(t, testContainer.DB, &models.Member{
			Nombre:        "Inactivo",
			Apellidos:     "Test",
			TipoMembresia: models.MembershipTypeIndividual,
			Estado:        models.MemberStateInactive,
		})

		result, err := testContainer.Services.FeeService.GenerateAnnualFees(ctx, input.FeeGenerationInput{
			Year:          2024,
			BaseFeeAmount: 100.0,
		})

		require.NoError(t, err)
		assert.Equal(t, 0, result.PaymentsCreated)
	})

	t.Run("Member payment already exists", func(t *testing.T) {
		member := createTestMember(t, testContainer.DB, &models.Member{
			Nombre:        "Test",
			Apellidos:     "User",
			TipoMembresia: models.MembershipTypeIndividual,
			Estado:        models.MemberStateActive,
		})

		// Crear cuota
		fee := &models.MembershipFee{
			Year:           2024,
			BaseFeeAmount:  100.0,
			FamilyFeeExtra: 0,
		}
		require.NoError(t, testContainer.Repos.FeeRepo.Create(ctx, fee))

		// Crear pago manual
		payment := &models.Payment{
			MemberID:        member.MiembroID,
			Amount:          100.0,
			Status:          models.PaymentStatusPaid,
			MembershipFeeID: &fee.ID,
		}
		require.NoError(t, testContainer.Repos.PaymentRepo.Create(ctx, payment))

		// Intentar generar cuotas
		result, err := testContainer.Services.FeeService.GenerateAnnualFees(ctx, input.FeeGenerationInput{
			Year:          2024,
			BaseFeeAmount: 100.0,
		})

		require.NoError(t, err)
		assert.Equal(t, 0, result.PaymentsCreated) // No se crea pago duplicado
	})
}
```

---

## ⚛️ Tests Unitarios Frontend

### 1. Tests de Hooks

**Ubicación**: `src/features/fees/hooks/__tests__/useFeeGeneration.test.tsx`

```typescript
import { renderHook, act, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { useFeeGeneration } from '../useFeeGeneration';
import { 
  GENERATE_ANNUAL_FEES, 
  CHECK_FEE_EXISTS 
} from '../../api/mutations';

describe('useFeeGeneration', () => {
  const createWrapper = (mocks: any[]) => {
    return ({ children }: { children: React.ReactNode }) => (
      <MockedProvider mocks={mocks} addTypename={false}>
        {children}
      </MockedProvider>
    );
  };

  it('should initialize with form step', () => {
    const { result } = renderHook(() => useFeeGeneration(), {
      wrapper: createWrapper([]),
    });

    expect(result.current.state.step).toBe('form');
    expect(result.current.state.formData).toBeNull();
  });

  it('should validate and show preview successfully', async () => {
    const mocks = [
      {
        request: {
          query: CHECK_FEE_EXISTS,
          variables: { year: 2024 },
        },
        result: {
          data: {
            checkFeeExists: false,
          },
        },
      },
    ];

    const { result } = renderHook(() => useFeeGeneration(), {
      wrapper: createWrapper(mocks),
    });

    await act(async () => {
      await result.current.validateAndPreview({
        year: 2024,
        baseFeeAmount: 100,
        familyFeeExtra: 50,
      });
    });

    await waitFor(() => {
      expect(result.current.state.step).toBe('preview');
      expect(result.current.state.preview).toBeDefined();
      expect(result.current.state.preview?.feeExists).toBe(false);
    });
  });

  it('should generate fees successfully', async () => {
    const mocks = [
      {
        request: {
          query: CHECK_FEE_EXISTS,
          variables: { year: 2024 },
        },
        result: {
          data: { checkFeeExists: false },
        },
      },
      {
        request: {
          query: GENERATE_ANNUAL_FEES,
          variables: {
            input: {
              year: 2024,
              baseFeeAmount: 100,
              familyFeeExtra: 50,
            },
          },
        },
        result: {
          data: {
            generateAnnualFees: {
              membershipFee: {
                id: '1',
                year: 2024,
                baseFeeAmount: 100,
                familyFeeExtra: 50,
                dueDate: '2024-12-31T23:59:59Z',
              },
              totalMembers: 150,
              individualMembers: 100,
              familyMembers: 50,
              paymentsCreated: 150,
              totalExpectedAmount: 17500,
              alreadyExisted: false,
            },
          },
        },
      },
    ];

    const { result } = renderHook(() => useFeeGeneration(), {
      wrapper: createWrapper(mocks),
    });

    // Validate
    await act(async () => {
      await result.current.validateAndPreview({
        year: 2024,
        baseFeeAmount: 100,
        familyFeeExtra: 50,
      });
    });

    await waitFor(() => {
      expect(result.current.state.step).toBe('preview');
    });

    // Generate
    await act(async () => {
      await result.current.confirmGeneration();
    });

    await waitFor(() => {
      expect(result.current.state.step).toBe('result');
      expect(result.current.state.result?.paymentsCreated).toBe(150);
    });
  });

  it('should handle errors gracefully', async () => {
    const mocks = [
      {
        request: {
          query: CHECK_FEE_EXISTS,
          variables: { year: 2024 },
        },
        error: new Error('Network error'),
      },
    ];

    const { result } = renderHook(() => useFeeGeneration(), {
      wrapper: createWrapper(mocks),
    });

    await act(async () => {
      await result.current.validateAndPreview({
        year: 2024,
        baseFeeAmount: 100,
        familyFeeExtra: 50,
      });
    });

    await waitFor(() => {
      expect(result.current.state.step).toBe('error');
      expect(result.current.state.error).toContain('Network error');
    });
  });

  it('should reset state correctly', () => {
    const { result } = renderHook(() => useFeeGeneration(), {
      wrapper: createWrapper([]),
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.state.step).toBe('form');
    expect(result.current.state.formData).toBeNull();
    expect(result.current.state.error).toBeNull();
  });
});
```

### 2. Tests de Componentes

**Ubicación**: `src/features/fees/components/__tests__/FeeGenerationForm.test.tsx`

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FeeGenerationForm } from '../FeeGenerationForm';

describe('FeeGenerationForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('should render all form fields', () => {
    render(<FeeGenerationForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/año/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cuota base/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/extra familiar/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continuar/i })).toBeInTheDocument();
  });

  it('should initialize with current year', () => {
    render(<FeeGenerationForm onSubmit={mockOnSubmit} />);

    const yearInput = screen.getByLabelText(/año/i) as HTMLInputElement;
    const currentYear = new Date().getFullYear();
    
    expect(yearInput.value).toBe(currentYear.toString());
  });

  it('should validate year is not in the future', async () => {
    const user = userEvent.setup();
    render(<FeeGenerationForm onSubmit={mockOnSubmit} />);

    const yearInput = screen.getByLabelText(/año/i);
    const submitButton = screen.getByRole('button', { name: /continuar/i });
    const futureYear = new Date().getFullYear() + 1;

    await user.clear(yearInput);
    await user.type(yearInput, futureYear.toString());
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/no puede ser mayor/i)).toBeInTheDocument();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  it('should validate base fee amount is positive', async () => {
    const user = userEvent.setup();
    render(<FeeGenerationForm onSubmit={mockOnSubmit} />);

    const baseFeeInput = screen.getByLabelText(/cuota base/i);
    const submitButton = screen.getByRole('button', { name: /continuar/i });

    await user.clear(baseFeeInput);
    await user.type(baseFeeInput, '0');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/debe ser mayor a 0/i)).toBeInTheDocument();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  it('should submit valid form data', async () => {
    const user = userEvent.setup();
    render(<FeeGenerationForm onSubmit={mockOnSubmit} />);

    const yearInput = screen.getByLabelText(/año/i);
    const baseFeeInput = screen.getByLabelText(/cuota base/i);
    const familyExtraInput = screen.getByLabelText(/extra familiar/i);
    const submitButton = screen.getByRole('button', { name: /continuar/i });

    await user.clear(yearInput);
    await user.type(yearInput, '2024');
    
    await user.clear(baseFeeInput);
    await user.type(baseFeeInput, '100');
    
    await user.clear(familyExtraInput);
    await user.type(familyExtraInput, '50');
    
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        year: 2024,
        baseFeeAmount: 100,
        familyFeeExtra: 50,
      });
    });
  });

  it('should clear field errors on change', async () => {
    const user = userEvent.setup();
    render(<FeeGenerationForm onSubmit={mockOnSubmit} />);

    const yearInput = screen.getByLabelText(/año/i);
    const submitButton = screen.getByRole('button', { name: /continuar/i });
    const futureYear = new Date().getFullYear() + 1;

    // Provocar error
    await user.clear(yearInput);
    await user.type(yearInput, futureYear.toString());
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/no puede ser mayor/i)).toBeInTheDocument();
    });

    // Corregir el valor
    await user.clear(yearInput);
    await user.type(yearInput, '2024');

    // El error debe desaparecer
    await waitFor(() => {
      expect(screen.queryByText(/no puede ser mayor/i)).not.toBeInTheDocument();
    });
  });
});
```

---

## 🧩 Tests de Integración Frontend

### Ubicación: `src/features/fees/__tests__/integration/fee-generation-flow.test.tsx`

```typescript
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import { AnnualFeesPage } from '@/pages/fees/AnnualFeesPage';
import { 
  GENERATE_ANNUAL_FEES,
  CHECK_FEE_EXISTS,
  LIST_MEMBERSHIP_FEES 
} from '@/features/fees/api';

describe('Fee Generation Flow - Integration', () => {
  const setupMocks = () => [
    {
      request: {
        query: LIST_MEMBERSHIP_FEES,
        variables: { page: 1, pageSize: 10 },
      },
      result: {
        data: {
          listMembershipFees: {
            nodes: [],
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: false,
              totalCount: 0,
            },
          },
        },
      },
    },
    {
      request: {
        query: CHECK_FEE_EXISTS,
        variables: { year: 2024 },
      },
      result: {
        data: {
          checkFeeExists: false,
        },
      },
    },
    {
      request: {
        query: GENERATE_ANNUAL_FEES,
        variables: {
          input: {
            year: 2024,
            baseFeeAmount: 100,
            familyFeeExtra: 50,
          },
        },
      },
      result: {
        data: {
          generateAnnualFees: {
            membershipFee: {
              id: '1',
              year: 2024,
              baseFeeAmount: 100,
              familyFeeExtra: 50,
              dueDate: '2024-12-31T23:59:59Z',
            },
            totalMembers: 150,
            individualMembers: 100,
            familyMembers: 50,
            paymentsCreated: 150,
            totalExpectedAmount: 17500,
            alreadyExisted: false,
          },
        },
      },
    },
  ];

  it('should complete full fee generation flow', async () => {
    const user = userEvent.setup();
    const mocks = setupMocks();

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AnnualFeesPage />
      </MockedProvider>
    );

    // 1. Abrir diálogo
    const generateButton = screen.getByRole('button', { name: /generar cuotas/i });
    await user.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText(/generar cuotas anuales/i)).toBeInTheDocument();
    });

    // 2. Completar formulario
    const yearInput = screen.getByLabelText(/año/i);
    const baseFeeInput = screen.getByLabelText(/cuota base/i);
    const familyExtraInput = screen.getByLabelText(/extra familiar/i);

    await user.clear(yearInput);
    await user.type(yearInput, '2024');
    
    await user.clear(baseFeeInput);
    await user.type(baseFeeInput, '100');
    
    await user.clear(familyExtraInput);
    await user.type(familyExtraInput, '50');

    // 3. Continuar a preview
    const continueButton = screen.getByRole('button', { name: /continuar/i });
    await user.click(continueButton);

    // 4. Verificar preview
    await waitFor(() => {
      expect(screen.getByText(/resumen para el año 2024/i)).toBeInTheDocument();
      expect(screen.getByText(/100/)).toBeInTheDocument(); // Base fee
      expect(screen.getByText(/50/)).toBeInTheDocument(); // Family extra
    });

    // 5. Confirmar generación
    const confirmButton = screen.getByRole('button', { name: /confirmar/i });
    await user.click(confirmButton);

    // 6. Verificar resultado
    await waitFor(() => {
      expect(screen.getByText(/cuotas generadas exitosamente/i)).toBeInTheDocument();
      expect(screen.getByText(/150/)).toBeInTheDocument(); // Payments created
    }, { timeout: 3000 });

    // 7. Cerrar diálogo
    const closeButton = screen.getByRole('button', { name: /cerrar/i });
    await user.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText(/generar cuotas anuales/i)).not.toBeInTheDocument();
    });
  });

  it('should handle existing fee warning', async () => {
    const user = userEvent.setup();
    const mocksWithExistingFee = [
      ...setupMocks(),
      {
        request: {
          query: CHECK_FEE_EXISTS,
          variables: { year: 2024 },
        },
        result: {
          data: {
            checkFeeExists: true,
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocksWithExistingFee} addTypename={false}>
        <AnnualFeesPage />
      </MockedProvider>
    );

    const generateButton = screen.getByRole('button', { name: /generar cuotas/i });
    await user.click(generateButton);

    // Completar formulario
    const continueButton = await screen.findByRole('button', { name: /continuar/i });
    await user.click(continueButton);

    // Verificar warning
    await waitFor(() => {
      expect(screen.getByText(/ya existen cuotas para este año/i)).toBeInTheDocument();
    });
  });
});
```

---

## 🌐 Tests End-to-End

### Ubicación: `e2e/fees/fee-generation.spec.ts` (Playwright/Cypress)

```typescript
import { test, expect } from '@playwright/test';

test.describe('Annual Fee Generation E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Login como admin
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@asam.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await page.waitForURL('/dashboard');
    
    // Navegar a cuotas
    await page.click('a[href="/fees"]');
    await page.waitForURL('/fees');
  });

  test('should generate annual fees successfully', async ({ page }) => {
    // Abrir diálogo
    await page.click('button:has-text("Generar Cuotas")');
    
    await expect(page.locator('h2:has-text("Generar Cuotas Anuales")')).toBeVisible();

    // Completar formulario
    const currentYear = new Date().getFullYear();
    await page.fill('input[name="year"]', currentYear.toString());
    await page.fill('input[name="baseFeeAmount"]', '100');
    await page.fill('input[name="familyFeeExtra"]', '50');

    // Continuar
    await page.click('button:has-text("Continuar")');

    // Esperar preview
    await expect(page.locator('text=Resumen para el año')).toBeVisible();
    
    // Verificar preview data
    await expect(page.locator('text=€100')).toBeVisible();
    await expect(page.locator('text=€50')).toBeVisible();

    // Confirmar
    await page.click('button:has-text("Confirmar")');

    // Esperar resultado
    await expect(page.locator('text=Cuotas generadas exitosamente')).toBeVisible({ timeout: 5000 });
    
    // Verificar que aparecen pagos creados
    await expect(page.locator('text=Pagos Creados')).toBeVisible();

    // Cerrar
    await page.click('button:has-text("Cerrar")');

    // Verificar que volvemos a la lista
    await expect(page.locator('h4:has-text("Cuotas Anuales")')).toBeVisible();
  });

  test('should not allow future years', async ({ page }) => {
    await page.click('button:has-text("Generar Cuotas")');
    
    const futureYear = new Date().getFullYear() + 1;
    await page.fill('input[name="year"]', futureYear.toString());
    await page.fill('input[name="baseFeeAmount"]', '100');
    
    await page.click('button:has-text("Continuar")');

    // Verificar error
    await expect(page.locator('text=no puede ser mayor')).toBeVisible();
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Simular error de red
    await page.route('**/graphql', route => route.abort());

    await page.click('button:has-text("Generar Cuotas")');
    await page.click('button:has-text("Continuar")');

    // Verificar mensaje de error
    await expect(page.locator('text=Error')).toBeVisible({ timeout: 5000 });
  });

  test('should navigate back from preview', async ({ page }) => {
    await page.click('button:has-text("Generar Cuotas")');
    
    const currentYear = new Date().getFullYear();
    await page.fill('input[name="year"]', currentYear.toString());
    await page.fill('input[name="baseFeeAmount"]', '100');
    
    await page.click('button:has-text("Continuar")');
    await expect(page.locator('text=Resumen')).toBeVisible();
    
    // Volver atrás
    await page.click('button:has-text("Atrás")');
    
    // Verificar que volvemos al formulario
    await expect(page.locator('input[name="year"]')).toBeVisible();
    await expect(page.locator('input[name="year"]')).toHaveValue(currentYear.toString());
  });
});
```

---

## 📊 Métricas de Cobertura

### Comandos de Testing

**Backend:**
```bash
# Tests unitarios
go test ./internal/... -v -cover

# Tests con cobertura detallada
go test ./internal/... -v -coverprofile=coverage.out
go tool cover -html=coverage.out -o coverage.html

# Tests de integración
go test ./test/integration/... -v

# Todos los tests
go test ./... -v -cover
```

**Frontend:**
```bash
# Tests unitarios
npm run test

# Tests con cobertura
npm run test:coverage

# Tests en modo watch
npm run test:watch

# Tests E2E
npm run test:e2e

# Todos los tests
npm run test:all
```

### Reporte de Cobertura

**Backend - Objetivo:**
```
Coverage Summary:
  internal/domain/services/fee_generation_service.go: 92%
  internal/adapters/db/fee_repository.go: 88%
  internal/adapters/gql/resolvers/fee_resolver.go: 85%
  internal/ports/input/fee_generation_service.go: 100%
  internal/ports/output/fee_repository.go: 100%
  
  Overall: 87%
```

**Frontend - Objetivo:**
```
Coverage Summary:
  src/features/fees/hooks/: 85%
  src/features/fees/components/: 78%
  src/features/fees/api/: 90%
  src/pages/fees/: 72%
  
  Overall: 81%
```

### Checklist de Testing

#### Backend
- [ ] Tests unitarios de servicio (todos los casos)
- [ ] Tests unitarios de repositorio
- [ ] Tests de validaciones
- [ ] Tests de integración (flujo completo)
- [ ] Tests de casos edge
- [ ] Cobertura >= 85%

#### Frontend
- [ ] Tests de hooks personalizados
- [ ] Tests de componentes UI
- [ ] Tests de validaciones de formulario
- [ ] Tests de integración (flujo completo)
- [ ] Tests E2E (happy path)
- [ ] Tests E2E (errores)
- [ ] Cobertura >= 80%

#### General
- [ ] CI ejecuta todos los tests
- [ ] Tests no son flaky
- [ ] Tests se ejecutan en <5 min
- [ ] Documentación de tests actualizada
- [ ] Snapshots actualizados si aplica

---

## 🔍 Debugging de Tests

### Técnicas Útiles

**Backend:**
```go
// Activar logs detallados en tests
func TestWithLogs(t *testing.T) {
    logger := testutils.NewVerboseLogger(t)
    // Los logs se imprimirán durante el test
}

// Debugging de queries SQL
func TestWithSQLLogging(t *testing.T) {
    db := setupTestDB(t)
    db.LogMode(true) // GORM loggeará todas las queries
}
```

**Frontend:**
```typescript
// Activar debugging de Apollo Client
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: from([
    new DebugLink(), // Log todas las operations
    httpLink,
  ]),
});

// Ver rendered HTML en tests
import { debug } from '@testing-library/react';
debug(); // Imprime el HTML actual
```

---

**Última actualización**: 7 de noviembre de 2025  
**Estado**: 📋 Documentación Completa
