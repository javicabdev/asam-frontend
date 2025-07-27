# 🌍 Internacionalización (i18n) y Tema en ASAM Frontend

## ✅ Implementación Completada

Se ha implementado un sistema completo de internacionalización con soporte para tres idiomas:
- 🇪🇸 **Español** (es)
- 🇫🇷 **Francés** (fr)
- 🇸🇳 **Wolof** (wo)

También se ha mejorado el tema con soporte para modo claro/oscuro y colores inspirados en las banderas de Senegal y España.

## 📦 Instalación de Dependencias

Ejecuta el siguiente comando para instalar las nuevas dependencias:

```bash
npm install
```

## 🚀 Características Implementadas

### 1. **Internacionalización (i18n)**
- Sistema completo de traducciones con react-i18next
- Tres idiomas: Español, Francés y Wolof
- Detección automática del idioma del navegador
- Selector de idioma persistente en localStorage
- Traducciones organizadas por namespaces:
  - `common`: Términos generales
  - `auth`: Autenticación y perfil
  - `navigation`: Menú y navegación
  - `members`: Gestión de miembros
  - `payments`: Gestión de pagos

### 2. **Tema Mejorado**
- Modo claro y oscuro
- Opción de seguir preferencia del sistema
- Colores inspirados en:
  - 🇸🇳 Bandera de Senegal (verde, amarillo, rojo)
  - 🇪🇸 Bandera de España (rojo, amarillo)
- Paleta de colores WCAG AA compatible
- Sombras y bordes redondeados modernos
- Tipografía mejorada con Inter

### 3. **Componentes Nuevos**
- **LanguageSelector**: Selector de idioma en el AppBar
- **ThemeToggle**: Toggle para cambiar entre modo claro/oscuro
- **settingsStore**: Store de Zustand para persistir preferencias

## 📁 Estructura de Archivos

```
src/
  ├── lib/
  │   ├── i18n/
  │   │   ├── index.ts          # Configuración de i18next
  │   │   └── locales/
  │   │       ├── es/           # Traducciones en español
  │   │       ├── fr/           # Traducciones en francés
  │   │       └── wo/           # Traducciones en wolof
  │   └── theme/
  │       └── index.ts          # Tema mejorado con soporte dark/light
  ├── components/
  │   └── common/
  │       ├── LanguageSelector.tsx
  │       └── ThemeToggle.tsx
  └── stores/
      └── settingsStore.ts     # Store para preferencias del usuario
```

## 🎨 Uso del Sistema

### Cambiar Idioma
1. Click en el icono de idioma en el AppBar
2. Selecciona el idioma deseado
3. La aplicación se actualizará automáticamente

### Cambiar Tema
1. Click en el icono de sol/luna en el AppBar
2. El tema cambiará entre claro y oscuro
3. La preferencia se guardará automáticamente

### Usar Traducciones en Componentes

```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation('common'); // namespace
  
  return (
    <div>
      <h1>{t('app.title')}</h1>
      <button>{t('common.save')}</button>
    </div>
  );
}
```

### Agregar Nuevas Traducciones

1. Abre el archivo JSON correspondiente en `src/lib/i18n/locales/{idioma}/{namespace}.json`
2. Agrega la nueva clave y su traducción
3. Repite para todos los idiomas

Ejemplo:
```json
// es/common.json
{
  "newFeature": {
    "title": "Nueva Funcionalidad",
    "description": "Descripción de la funcionalidad"
  }
}
```

## 🌐 Traducciones Wolof

Las traducciones en Wolof han sido creadas con términos comunes de la lengua. Si necesitas ajustar alguna traducción:

1. Consulta con hablantes nativos de Wolof
2. Actualiza los archivos en `src/lib/i18n/locales/wo/`
3. Mantén consistencia en la terminología

## 🎯 Próximos Pasos

1. **Revisar traducciones**: Especialmente las de Wolof con hablantes nativos
2. **Completar traducciones**: Agregar las páginas que faltan
3. **Modo RTL**: Si se agregan idiomas con escritura de derecha a izquierda
4. **Formatos localizados**: Fechas, números y monedas según el idioma

## 🐛 Solución de Problemas

### El idioma no cambia
- Verifica que las dependencias estén instaladas
- Limpia el localStorage: `localStorage.removeItem('asam-language')`
- Recarga la página

### El tema no se aplica
- Verifica que `useSettingsStore` esté importado correctamente
- Revisa la consola del navegador por errores

### Traducciones faltantes
- Si ves claves como `common.save` en lugar del texto:
  - Verifica que el namespace esté correcto
  - Asegúrate de que la clave existe en el archivo JSON

## 📝 Notas Importantes

- El idioma y tema se guardan en localStorage
- El idioma por defecto es Español
- El tema por defecto es el del sistema
- Las traducciones usan namespaces para mejor organización
- Los colores del tema están inspirados en las culturas senegalesa y española
