# 🧪 Guía de Testing para ASAM Frontend

## 📋 Instalación de Dependencias

Primero, instala las dependencias de testing:

```bash
npm install
```

## 🚀 Ejecutar Tests

### Ejecutar todos los tests
```bash
npm run test
```

### Ejecutar tests en modo watch (recomendado para desarrollo)
```bash
npm run test -- --watch
```

### Ejecutar tests con interfaz gráfica
```bash
npm run test:ui
```

### Ejecutar tests con cobertura
```bash
npm run test:coverage
```

## 📁 Estructura de Tests

Los tests deben ubicarse junto a los componentes que prueban:

```
src/
  components/
    auth/
      ProtectedRoute.tsx
      __tests__/
        ProtectedRoute.test.tsx
```

## ✅ Tests Implementados

### 1. **ProtectedRoute Component** (`src/components/auth/__tests__/ProtectedRoute.test.tsx`)
   - ✅ Loading state muestra spinner
   - ✅ Redirección cuando no está autenticado
   - ✅ Renderizado correcto cuando está autenticado
   - ✅ Verificación de email cuando es requerida
   - ✅ Manejo de casos edge (usuario null, cambios de estado)

## 🎯 Próximos Tests a Implementar

### Milestone 1 - Autenticación
- [ ] `LoginPage` - Formulario de login, validación, errores
- [ ] `useAuth` hook - Login, logout, manejo de tokens
- [ ] `AuthStore` - Persistencia, actualización de estado

### Milestone 2 - Gestión de Miembros
- [ ] `MembersListPage` - Listado, paginación, búsqueda
- [ ] `NewMemberPage` - Formulario, validación, tipos de miembro
- [ ] `MemberDetailsPage` - Visualización, edición, eliminación

## 📝 Ejemplo de Test

```typescript
import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { render } from '@/test/test-utils'
import { MyComponent } from '../MyComponent'

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

## 🛠️ Utilidades de Testing

### `render` personalizado
Incluye todos los providers necesarios (Router, Theme, etc.):

```typescript
import { render } from '@/test/test-utils'

render(<Component />, {
  routerProps: {
    initialEntries: ['/custom-route']
  }
})
```

### User Events
Para simular interacciones del usuario:

```typescript
import { render, screen, userEvent } from '@/test/test-utils'

const user = userEvent.setup()
await user.click(screen.getByRole('button'))
await user.type(screen.getByRole('textbox'), 'Hello')
```

## 🐛 Debugging

### Ver el DOM renderizado
```typescript
import { screen } from '@/test/test-utils'

screen.debug() // Imprime todo el DOM
screen.debug(element) // Imprime un elemento específico
```

### Queries útiles
```typescript
// Por rol
screen.getByRole('button', { name: /submit/i })

// Por texto
screen.getByText(/hello world/i)

// Por test ID
screen.getByTestId('my-element')

// Queries async
await screen.findByText(/loaded/i)
```

## 📊 Cobertura de Código

Después de ejecutar `npm run test:coverage`, abre el reporte:

```bash
open coverage/index.html
```

Meta de cobertura:
- Statements: > 80%
- Branches: > 75%
- Functions: > 80%
- Lines: > 80%

## 🔧 Configuración

La configuración de Vitest está en `vitest.config.ts`:
- Environment: jsdom
- Globals: habilitado
- Coverage: v8
- Setup: `src/test/setup.ts`

## 💡 Tips

1. **Usa `data-testid` con moderación** - Prefiere queries semánticas (role, label)
2. **No pruebes detalles de implementación** - Prueba comportamiento
3. **Mantén los tests simples y enfocados** - Un test, una funcionalidad
4. **Usa mocks cuando sea necesario** - Pero prefiere tests de integración
5. **Asegúrate de limpiar después de cada test** - Ya está configurado automáticamente
