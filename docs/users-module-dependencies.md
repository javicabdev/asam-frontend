# Dependencias Requeridas para el Módulo de Usuarios

## Instalación

Para que el módulo de usuarios funcione correctamente, necesitas instalar las siguientes dependencias:

```bash
# Instalar lodash y sus tipos
npm install lodash
npm install --save-dev @types/lodash
```

## Alternativa: Implementación sin Lodash

Si prefieres no añadir lodash como dependencia, aquí está la implementación del debounce sin lodash:

```typescript
// En MemberAutocomplete.tsx
// Reemplazar la importación de lodash:
// import debounce from 'lodash/debounce'

// Por esta implementación personalizada:
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T & { cancel: () => void } {
  let timeoutId: NodeJS.Timeout | null = null

  const debounced = (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    
    timeoutId = setTimeout(() => {
      func(...args)
      timeoutId = null
    }, wait)
  }

  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  return debounced as T & { cancel: () => void }
}
```

## Scripts para Instalar

```json
// Añadir a package.json en la sección de scripts:
"install:users": "npm install lodash @types/lodash"
```

## Verificación

Después de instalar, verifica que no hay errores de TypeScript:

```bash
npm run type-check
```
