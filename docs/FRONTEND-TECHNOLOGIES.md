# Tecnologías del Frontend - ASAM

Este documento detalla y justifica las tecnologías utilizadas en el desarrollo del frontend de la aplicación de gestión de la Asociación para la Solidaridad y Apoyo Mutuo (ASAM).

## Tabla de Contenidos

1. [Tecnologías Core](#tecnologías-core)
2. [Gestión de Estado y Datos](#gestión-de-estado-y-datos)
3. [Interfaz de Usuario](#interfaz-de-usuario)
4. [Formularios y Validación](#formularios-y-validación)
5. [Internacionalización](#internacionalización)
6. [Enrutamiento](#enrutamiento)
7. [Visualización de Datos](#visualización-de-datos)
8. [Generación de Documentos](#generación-de-documentos)
9. [Notificaciones](#notificaciones)
10. [Progressive Web App](#progressive-web-app)
11. [Herramientas de Desarrollo](#herramientas-de-desarrollo)
12. [Testing](#testing)
13. [Calidad de Código](#calidad-de-código)

---

## Tecnologías Core

### React 18.2
**Biblioteca principal para construcción de interfaces de usuario**

**¿Qué es?**
React es una biblioteca de JavaScript desarrollada por Meta (Facebook) para construir interfaces de usuario mediante componentes reutilizables. React utiliza un Virtual DOM para optimizar las actualizaciones de la interfaz.

**¿Por qué la usamos?**
- **Componentes reutilizables**: Permite crear componentes modulares que se pueden reutilizar en toda la aplicación
- **Ecosistema maduro**: Cuenta con una gran cantidad de bibliotecas y herramientas complementarias
- **Performance**: El Virtual DOM y el algoritmo de reconciliación optimizan las actualizaciones del DOM
- **React Hooks**: Permite gestionar estado y efectos secundarios de forma elegante sin clases
- **Comunidad activa**: Gran comunidad de desarrolladores, amplia documentación y recursos
- **Compatibilidad con TypeScript**: Excelente integración con TypeScript para tipado estático

**Características utilizadas:**
- Functional Components con Hooks
- React.memo para optimización de renderizado
- Suspense y Error Boundaries para gestión de errores
- Context API para estado global ligero

---

### TypeScript 5.9
**Lenguaje de programación con tipado estático**

**¿Qué es?**
TypeScript es un superconjunto de JavaScript desarrollado por Microsoft que añade tipado estático opcional. Se compila a JavaScript estándar compatible con cualquier navegador.

**¿Por qué lo usamos?**
- **Detección temprana de errores**: Los errores de tipo se detectan en tiempo de compilación, no en runtime
- **Mejor experiencia de desarrollo**: Autocompletado inteligente, refactoring seguro y navegación de código
- **Documentación implícita**: Los tipos sirven como documentación viva del código
- **Mantenibilidad**: Facilita la comprensión y modificación del código en proyectos grandes
- **Integración con GraphQL**: Generación automática de tipos desde el schema GraphQL
- **Reducción de bugs**: Elimina una categoría completa de errores comunes de JavaScript

**Configuración:**
- Modo estricto habilitado (`strict: true`)
- Resolución de módulos compatible con Vite
- Target ES2020 para compatibilidad moderna
- Decoradores y metadata habilitados

---

### Vite 7.1
**Build tool y servidor de desarrollo**

**¿Qué es?**
Vite es una herramienta de construcción moderna creada por Evan You (creador de Vue.js) que aprovecha las capacidades nativas de módulos ES del navegador para proporcionar un desarrollo ultrarrápido.

**¿Por qué lo usamos?**
- **Desarrollo instantáneo**: Hot Module Replacement (HMR) extremadamente rápido
- **Build optimizado**: Utiliza Rollup para generar bundles optimizados para producción
- **Configuración mínima**: Funciona out-of-the-box con configuración sensata por defecto
- **Compatibilidad nativa con TypeScript**: Transpilación automática sin configuración adicional
- **Plugins**: Ecosistema rico de plugins (React, PWA, etc.)
- **Mejor alternativa a Webpack**: Más rápido y simple para proyectos modernos
- **Code splitting automático**: Optimización de carga mediante división de código

**Plugins utilizados:**
- `@vitejs/plugin-react`: Soporte para React Fast Refresh
- `vite-plugin-pwa`: Generación automática de Service Worker

---

## Gestión de Estado y Datos

### Apollo Client 3.8
**Cliente GraphQL para gestión de datos**

**¿Qué es?**
Apollo Client es una biblioteca completa de gestión de estado para JavaScript que permite trabajar con GraphQL. Gestiona tanto el fetching de datos remotos como el estado local de la aplicación.

**¿Por qué lo usamos?**
- **Integración con GraphQL**: Cliente oficial y más completo para GraphQL
- **Cache inteligente**: Sistema de caché normalizado que evita peticiones redundantes
- **Optimistic UI**: Permite actualizar la UI antes de recibir respuesta del servidor
- **Manejo de errores**: Sistema robusto para gestionar errores de red y GraphQL
- **DevTools**: Herramientas de desarrollo para inspeccionar queries y cache
- **Type-safe con TypeScript**: Generación automática de tipos desde el schema
- **Polling y Subscriptions**: Soporte para actualización en tiempo real

**Características utilizadas:**
- Queries con cache automático
- Mutations con actualización optimista
- Error handling centralizado
- Cache persistence para offline-first
- Type generation con GraphQL Code Generator

---

### Zustand 4.4
**Gestión de estado global minimalista**

**¿Qué es?**
Zustand es una biblioteca de gestión de estado pequeña, rápida y escalable que utiliza hooks. Proporciona una API simple y no requiere providers ni reducers complejos.

**¿Por qué la usamos?**
- **Simplicidad**: API minimalista y fácil de aprender
- **No requiere providers**: Los stores son accesibles directamente sin Context providers
- **TypeScript first**: Excelente soporte para TypeScript
- **Tamaño mínimo**: ~1KB gzipped
- **Performance**: Renderiza solo los componentes que necesitan actualizarse
- **Complemento a Apollo**: Usado para estado UI que no viene del backend (sidebar abierto/cerrado, tema, etc.)
- **DevTools**: Integración con Redux DevTools para debugging

**Uso en la aplicación:**
- Estado de UI (sidebar, modals, theme)
- Preferencias de usuario
- Estado de autenticación
- Filtros y ordenación de tablas

---

### GraphQL 16.8 + GraphQL Code Generator
**Lenguaje de consulta y generación de tipos**

**¿Qué es?**
GraphQL es un lenguaje de consulta para APIs que permite a los clientes solicitar exactamente los datos que necesitan. GraphQL Code Generator genera automáticamente tipos TypeScript desde el schema GraphQL.

**¿Por qué lo usamos?**
- **Tipado end-to-end**: Los tipos se generan automáticamente desde el backend
- **Consultas precisas**: Solo se solicitan los campos necesarios
- **Documentación automática**: El schema sirve como contrato entre frontend y backend
- **Introspección**: El schema puede consultarse en tiempo de ejecución
- **Versionado implícito**: No necesita versiones de API, evoluciona con el schema
- **Herramientas de desarrollo**: Apollo Studio, GraphQL Playground

**Generadores configurados:**
- `@graphql-codegen/typescript`: Tipos base
- `@graphql-codegen/typescript-operations`: Tipos de queries y mutations
- `@graphql-codegen/typescript-react-apollo`: Hooks de React
- `@graphql-codegen/introspection`: Schema JSON para herramientas

---

## Interfaz de Usuario

### Material-UI (MUI) 5.15
**Biblioteca de componentes UI**

**¿Qué es?**
Material-UI es la implementación de React más popular de Material Design de Google. Proporciona componentes React preconstruidos, customizables y accesibles.

**¿Por qué la usamos?**
- **Componentes listos para producción**: Amplia colección de componentes bien testeados
- **Diseño consistente**: Sigue las guías de Material Design
- **Accesibilidad**: Componentes con ARIA labels y navegación por teclado
- **Theming robusto**: Sistema de temas potente y customizable
- **Responsive**: Grid system y breakpoints incluidos
- **TypeScript**: Tipado completo out-of-the-box
- **Documentación excelente**: Ejemplos detallados y API docs completas
- **Componentes complejos**: DataGrid, DatePickers, etc.

**Paquetes utilizados:**
- `@mui/material`: Componentes core
- `@mui/icons-material`: +2000 iconos Material
- `@mui/x-data-grid`: Tablas avanzadas con sorting, filtering, paginación
- `@mui/x-date-pickers`: Selectores de fecha con localización

---

### Emotion 11
**Biblioteca CSS-in-JS**

**¿Qué es?**
Emotion es una biblioteca performante y flexible de CSS-in-JS diseñada para escribir estilos con JavaScript. Es la solución de estilado por defecto de MUI v5.

**¿Por qué la usamos?**
- **Requerida por MUI**: MUI v5 utiliza Emotion como motor de estilos
- **Scoped styles**: Los estilos están automáticamente aislados por componente
- **Dynamic styles**: Estilos que cambian según props o estado
- **TypeScript**: Soporte completo para tipado de props de estilo
- **Performance**: SSR, critical CSS extraction, y minimal runtime
- **Developer experience**: Source maps, etiquetas legibles en DevTools

**Uso:**
- Sistema de theming de MUI
- Estilos dinámicos basados en props
- Media queries y responsive design
- Animaciones y transiciones

---

## Formularios y Validación

### React Hook Form 7.48
**Biblioteca de gestión de formularios**

**¿Qué es?**
React Hook Form es una biblioteca performante, flexible y extensible para gestionar formularios en React con validación fácil de integrar.

**¿Por qué la usamos?**
- **Performance**: Minimiza re-renders usando refs en lugar de estado
- **DX mejorada**: API simple basada en hooks
- **Tamaño pequeño**: Sin dependencias, ~9KB gzipped
- **Validación integrada**: Soporte nativo para HTML5 y bibliotecas de validación
- **TypeScript**: Tipado completo para formularios y validaciones
- **Menos código**: Reduce drásticamente la cantidad de código boilerplate
- **Integración con MUI**: Funciona perfectamente con componentes Material-UI

**Características utilizadas:**
- Controlled y uncontrolled components
- Validación con Yup
- Error handling
- Field arrays para listas dinámicas
- Custom validation rules

---

### Yup 1.6
**Schema validation**

**¿Qué es?**
Yup es una biblioteca de validación de schemas JavaScript para validar y transformar valores. Define un schema reutilizable para validación de objetos.

**¿Por qué lo usamos?**
- **Validaciones declarativas**: Los esquemas son claros y reutilizables
- **TypeScript**: Inferencia automática de tipos desde schemas
- **Integración con React Hook Form**: Funciona perfectamente vía `@hookform/resolvers`
- **Mensajes customizables**: Mensajes de error personalizados e internacionalizados
- **Validaciones complejas**: Validaciones condicionales, asíncronas, y cross-field
- **Transformaciones**: Permite limpiar y transformar datos antes de validar

**Uso en la aplicación:**
- Validación de formularios de creación de socios
- Validación de formularios de pagos
- Validación de formularios de cuotas anuales
- Validación de credenciales de login

---

## Internacionalización

### i18next 23.7 + react-i18next 14.0
**Framework de internacionalización**

**¿Qué es?**
i18next es un framework de internacionalización completo para JavaScript. react-i18next es el binding oficial para React.

**¿Por qué lo usamos?**
- **Multiidioma desde el inicio**: La aplicación soporta español, francés y wolof
- **Flexible**: Soporta namespaces, interpolación, plurales, contextos
- **Lazy loading**: Carga traducciones bajo demanda
- **Detección de idioma**: Detecta automáticamente el idioma del navegador
- **Fallbacks**: Sistema de fallback cuando falta una traducción
- **Pluralización**: Reglas de pluralización por idioma
- **Formato de fechas/números**: Integración con Intl API

**Paquetes utilizados:**
- `i18next`: Core del framework
- `react-i18next`: Hooks de React (useTranslation)
- `i18next-browser-languagedetector`: Detección automática de idioma
- `i18next-http-backend`: Carga de traducciones vía HTTP

**Idiomas soportados:**
- Español (es) - Idioma principal
- Francés (fr) - Para comunidad francófona
- Wolof (wo) - Idioma senegalés

---

## Enrutamiento

### React Router DOM 6.21
**Biblioteca de enrutamiento para React**

**¿Qué es?**
React Router es la biblioteca estándar de enrutamiento para React. Permite crear Single Page Applications con navegación declarativa.

**¿Por qué la usamos?**
- **Estándar de la industria**: Solución más popular y madura para routing en React
- **Declarativo**: Rutas definidas como componentes React
- **Nested routes**: Soporte para rutas anidadas y layouts compartidos
- **Code splitting**: Lazy loading de rutas para mejor performance
- **Navigation guards**: Protección de rutas según autenticación
- **TypeScript**: Tipado completo para params, location, navigate
- **Hooks**: useNavigate, useParams, useLocation para acceso programático

**Características utilizadas:**
- Rutas protegidas con autenticación
- Lazy loading de páginas
- Layouts compartidos (Dashboard, Public)
- Navegación programática
- Breadcrumbs dinámicos

---

## Visualización de Datos

### Recharts 2.10
**Biblioteca de gráficos para React**

**¿Qué es?**
Recharts es una biblioteca de gráficos composable construida sobre React y D3. Proporciona componentes de gráficos declarativos y customizables.

**¿Por qué la usamos?**
- **API declarativa**: Los gráficos se definen como componentes React
- **Responsive**: Gráficos que se adaptan al tamaño del contenedor
- **Customizable**: Fácil personalización de estilos y comportamientos
- **Interactivo**: Tooltips, clicks, hover effects out-of-the-box
- **TypeScript**: Tipado completo
- **Performance**: Optimizado para datasets medianos
- **SVG nativo**: Gráficos escalables y de alta calidad

**Tipos de gráficos utilizados:**
- Line charts para tendencias temporales
- Bar charts para comparaciones
- Pie charts para distribuciones
- Area charts para métricas acumuladas

**Uso en la aplicación:**
- Dashboard: Gráficos de evolución de socios
- Dashboard: Distribución de pagos
- Reportes: Visualización de estadísticas

---

## Generación de Documentos

### jsPDF 3.0 + jsPDF-AutoTable 5.0
**Generación de PDFs en el navegador**

**¿Qué es?**
jsPDF es una biblioteca para generar documentos PDF en el lado del cliente usando JavaScript. jsPDF-AutoTable es un plugin que añade soporte para tablas.

**¿Por qué lo usamos?**
- **Cliente-side**: Los PDFs se generan en el navegador sin backend
- **Sin dependencias del servidor**: Reduce carga en el backend
- **Customización completa**: Control total sobre el layout y estilo
- **Fuentes custom**: Soporte para fuentes personalizadas
- **Imágenes**: Inserción de logos e imágenes
- **Tablas automáticas**: jsPDF-AutoTable para tablas complejas

**Uso en la aplicación:**
- Generación de recibos de pago
- Informes de morosos
- Listados de socios
- Reportes financieros

---

### React-PDF/Renderer 3.4
**Renderizado de PDFs con React**

**¿Qué es?**
React-PDF/Renderer permite crear documentos PDF usando componentes React. Transforma JSX a PDF de forma declarativa.

**¿Por qué lo usamos?**
- **Declarativo**: PDFs definidos como componentes React
- **Reutilización de componentes**: Misma lógica para UI y PDFs
- **Styling familiar**: Usa subset de CSS
- **TypeScript**: Tipado completo
- **Layout automático**: Cálculo automático de páginas y overflow
- **Complemento a jsPDF**: Para documentos más complejos y estructurados

**Uso alternativo:**
- Recibos con diseño complejo
- Reportes multipágina
- Documentos con formato rico

---

## Notificaciones

### Notistack 3.0
**Sistema de notificaciones toast**

**¿Qué es?**
Notistack es una biblioteca de notificaciones (snackbars/toasts) altamente customizable construida sobre Material-UI.

**¿Por qué la usamos?**
- **Integración con MUI**: Diseño consistente con Material-UI
- **Stack de notificaciones**: Múltiples notificaciones simultáneas
- **Posicionamiento**: Control sobre posición en pantalla
- **Persistencia**: Notificaciones que permanecen hasta cerrarlas manualmente
- **Actions**: Botones de acción en notificaciones
- **Variants**: Success, error, warning, info out-of-the-box
- **Customizable**: Componentes de notificación personalizados

**Uso en la aplicación:**
- Confirmación de operaciones exitosas
- Errores de validación
- Mensajes de información
- Avisos importantes

---

## Progressive Web App

### Workbox 7.0 + Vite Plugin PWA 1.0
**Service Worker y PWA capabilities**

**¿Qué es?**
Workbox es un conjunto de bibliotecas de Google para añadir soporte offline y PWA a aplicaciones web. Vite Plugin PWA integra Workbox con Vite.

**¿Por qué lo usamos?**
- **Offline first**: La aplicación funciona sin conexión
- **Cache inteligente**: Estrategias de cache configurables
- **Instalable**: Puede instalarse en dispositivos móviles y escritorio
- **Updates automáticos**: Detecta y notifica nuevas versiones
- **Performance**: Precache de assets críticos
- **Manifesto**: Web App Manifest generado automáticamente

**Estrategias de cache:**
- Network First: Para datos dinámicos
- Cache First: Para assets estáticos
- Stale While Revalidate: Para datos que pueden ser stale

**Características PWA:**
- Instalable desde el navegador
- Splash screen
- Iconos adaptivos
- Notificaciones push (preparado)

---

## Herramientas de Desarrollo

### ESLint 8.56
**Linter para JavaScript/TypeScript**

**¿Qué es?**
ESLint es una herramienta de análisis estático de código que encuentra y reporta patrones problemáticos en JavaScript/TypeScript.

**¿Por qué lo usamos?**
- **Calidad de código**: Detecta errores antes de runtime
- **Consistencia**: Enforce code style consistente
- **Best practices**: Reglas para seguir mejores prácticas
- **Security**: Plugin de seguridad para detectar vulnerabilidades
- **Customizable**: Configuración adaptada al proyecto
- **Integración IDE**: Feedback en tiempo real mientras desarrollas

**Plugins configurados:**
- `@typescript-eslint`: Reglas específicas para TypeScript
- `eslint-plugin-react`: Reglas para React
- `eslint-plugin-react-hooks`: Validación de Hooks rules
- `eslint-plugin-security`: Detección de vulnerabilidades
- `eslint-plugin-react-refresh`: Reglas para React Fast Refresh

---

### Prettier 3.1
**Formateador de código**

**¿Qué es?**
Prettier es un formateador de código opinionado que enforce un estilo consistente automáticamente.

**¿Por qué lo usamos?**
- **Consistencia automática**: Formatea código sin discusiones
- **Integración IDE**: Formateo automático al guardar
- **Menos diffs**: Cambios de estilo no aparecen en PRs
- **Configuración mínima**: Funciona bien out-of-the-box
- **Multiplataform**: Mismo formato en todos los sistemas

---

### Concurrently 9.2
**Ejecutor de comandos paralelos**

**¿Qué es?**
Concurrently permite ejecutar múltiples comandos npm en paralelo desde un solo script.

**¿Por qué lo usamos?**
- **Desarrollo eficiente**: Ejecuta Vite y GraphQL Codegen simultáneamente
- **Single command**: Un solo comando para iniciar todo el entorno de desarrollo
- **Logs coloreados**: Output distinguible de cada proceso
- **Cross-platform**: Funciona en Windows, macOS y Linux

**Uso:**
```bash
npm run dev  # Ejecuta Vite + GraphQL Codegen watch mode
```

---

### Madge 8.0
**Detector de dependencias circulares**

**¿Qué es?**
Madge analiza las dependencias del proyecto y detecta dependencias circulares que pueden causar problemas.

**¿Por qué lo usamos?**
- **Prevención de bugs**: Las dependencias circulares causan comportamientos inesperados
- **Arquitectura limpia**: Ayuda a mantener una arquitectura de módulos clara
- **CI/CD**: Se ejecuta en el pipeline para bloquear merges problemáticos
- **Visualización**: Puede generar gráficos de dependencias

---

## Testing

### Vitest 3.2
**Framework de testing**

**¿Qué es?**
Vitest es un framework de testing ultrarrápido compatible con Vite. Compatible con la API de Jest pero mucho más rápido.

**¿Por qué lo usamos?**
- **Velocidad**: Aprovecha el sistema de módulos de Vite
- **Compatible con Vite**: Misma configuración que el build
- **API familiar**: Compatible con Jest
- **Watch mode inteligente**: Solo ejecuta tests afectados
- **UI mode**: Interfaz visual para ejecutar tests
- **Coverage**: Generación de reportes de cobertura con V8

**Paquetes relacionados:**
- `@vitest/ui`: Interfaz visual para tests
- `@vitest/coverage-v8`: Cobertura de código con V8

---

### Testing Library (React)
**Biblioteca de testing para React**

**¿Qué es?**
Testing Library es una familia de bibliotecas para testear interfaces de usuario de forma centrada en el usuario.

**¿Por qué la usamos?**
- **User-centric**: Los tests se escriben desde la perspectiva del usuario
- **Buenas prácticas**: Encourage tests mantenibles
- **Queries accesibles**: Prioriza queries que funcionan con screen readers
- **No testing implementation details**: Focus en comportamiento, no implementación

**Paquetes utilizados:**
- `@testing-library/react`: Testing de componentes React
- `@testing-library/user-event`: Simulación de interacciones de usuario
- `@testing-library/jest-dom`: Matchers adicionales para el DOM

---

### jsdom 23.0
**Implementación de DOM en JavaScript**

**¿Qué es?**
jsdom es una implementación pura en JavaScript de los estándares web, principalmente DOM y HTML, para uso en Node.js.

**¿Por qué lo usamos?**
- **Testing**: Necesario para testear componentes React en Node.js
- **No browser required**: Tests se ejecutan sin navegador
- **API completa**: Implementa gran parte de la especificación del DOM
- **Performance**: Más rápido que lanzar un navegador real

---

## Calidad de Código

### Utilidades de Manejo de Fechas

#### date-fns 2.30
**Biblioteca de utilidades para fechas**

**¿Qué es?**
date-fns es una biblioteca modular de utilidades para manipular fechas en JavaScript. Es la alternativa moderna a Moment.js.

**¿Por qué la usamos?**
- **Modular**: Solo importas las funciones que necesitas
- **Inmutable**: No muta las fechas originales
- **Tree-shakeable**: Webpack elimina código no usado
- **TypeScript**: Tipado completo
- **Localization**: Soporte para múltiples idiomas
- **Consistente**: API funcional y predecible
- **Requerido por MUI**: DatePickers de Material-UI lo requieren

**Uso en la aplicación:**
- Formateo de fechas para display
- Cálculo de diferencias entre fechas
- Validación de rangos de fechas
- Integración con date pickers

---

### Optimización y Build

#### Terser 5.43
**Minificador de JavaScript**

**¿Qué es?**
Terser es un minificador de JavaScript compatible con ES6+ que reduce el tamaño del código para producción.

**¿Por qué lo usamos?**
- **Tamaño reducido**: Elimina espacios, renombra variables, elimina código muerto
- **ES6+ support**: Compatible con sintaxis moderna
- **Source maps**: Mantiene source maps para debugging
- **Usado por Vite**: Motor de minificación por defecto de Vite

---

#### Sharp 0.33
**Procesamiento de imágenes**

**¿Qué es?**
Sharp es una biblioteca de procesamiento de imágenes de alto rendimiento para Node.js.

**¿Por qué lo usamos?**
- **Optimización de iconos**: Genera iconos PWA en múltiples tamaños
- **Rendimiento**: Muy rápida, basada en libvips
- **Formatos**: Convierte entre formatos (PNG, JPEG, WebP, etc.)
- **Resize**: Redimensiona imágenes manteniendo calidad

**Uso:**
- Scripts para generar iconos de la aplicación
- Optimización de favicon
- Generación de assets PWA

---

## Resumen y Justificación General

### Principios de Selección de Tecnologías

La selección de tecnologías para este proyecto se ha basado en los siguientes principios:

1. **Type Safety**: TypeScript end-to-end desde GraphQL hasta componentes
2. **Developer Experience**: Herramientas modernas que mejoran la productividad
3. **Performance**: Bibliotecas optimizadas y técnicas de lazy loading
4. **Mantenibilidad**: Código declarativo, consistente y bien estructurado
5. **Accesibilidad**: Componentes accesibles y soporte multiidioma
6. **Progressive Enhancement**: PWA capabilities para mejor UX
7. **Testing**: Framework de testing completo para garantizar calidad
8. **Comunidad**: Bibliotecas maduras con comunidades activas

### Stack Tecnológico en Resumen

```
┌─────────────────────────────────────────────┐
│         Aplicación React + TypeScript       │
├─────────────────────────────────────────────┤
│  UI: Material-UI + Emotion                  │
│  Forms: React Hook Form + Yup               │
│  Routing: React Router DOM                  │
│  i18n: i18next + react-i18next              │
│  Charts: Recharts                           │
│  PDF: jsPDF + React-PDF                     │
│  Notifications: Notistack                   │
├─────────────────────────────────────────────┤
│  State: Apollo Client + Zustand             │
│  API: GraphQL + Code Generator              │
├─────────────────────────────────────────────┤
│  Build: Vite                                │
│  PWA: Workbox + Vite Plugin PWA             │
├─────────────────────────────────────────────┤
│  Testing: Vitest + Testing Library          │
│  Quality: ESLint + Prettier + TypeScript    │
│  CI/CD: Madge + Scripts personalizados      │
└─────────────────────────────────────────────┘
```

### Ventajas de Este Stack

1. **Moderna**: Tecnologías actuales y bien mantenidas
2. **Performante**: Optimizaciones en desarrollo y producción
3. **Escalable**: Arquitectura que soporta crecimiento
4. **Mantenible**: Código limpio, tipado y testeado
5. **Accesible**: Soporte multiidioma y accesibilidad WCAG
6. **Productiva**: Excelente DX reduce tiempo de desarrollo
7. **Robusta**: Testing completo y type safety

---

## Versiones y Compatibilidad

### Compatibilidad de Navegadores

La aplicación está optimizada para navegadores modernos:

- Chrome/Edge: Últimas 2 versiones
- Firefox: Últimas 2 versiones
- Safari: Últimas 2 versiones
- Mobile: iOS Safari 12+, Chrome Android últimas 2 versiones

### Node.js

- Versión requerida: Node.js 18+
- Package manager: npm 9+

---

## Referencias y Documentación

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Material-UI](https://mui.com/)
- [Apollo Client](https://www.apollographql.com/docs/react/)
- [GraphQL](https://graphql.org/)
- [React Router](https://reactrouter.com/)
- [i18next](https://www.i18next.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Vitest](https://vitest.dev/)

---

**Última actualización**: Enero 2025
