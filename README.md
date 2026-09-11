# ASAM Frontend

Frontend web progresiva para el sistema de gestión ASAM - Asociación de miembros.

## 🚀 Características

- ✅ **Aplicación Web Progresiva (PWA)** - Instalable en móviles y desktop
- ✅ **Gestión de miembros** - Individuales y familiares completa
- ✅ **Control de pagos y cuotas** - Con filtrado por usuario
- ✅ **Flujo de caja** - Entradas y salidas (solo administradores)
- ✅ **Reportes y morosos** - Análisis detallado (solo administradores)
- ✅ **Sistema de permisos** - Basado en roles (admin/user)
- ✅ **Interfaz responsive** - Diseño moderno con Material-UI
- ✅ **Funcionalidad offline** - Assets estáticos disponibles sin conexión
- ✅ **Autenticación segura** - JWT con refresh automático
- ✅ **Verificación de email** - Proceso completo implementado
- ✅ **Cuotas anuales** - Generación automática masiva
- ✅ **Recibos PDF** - Generación profesional multiidioma
- ✅ **Internacionalización** - 3 idiomas (Español, Francés, Wolof)
- ✅ **Accesibilidad WCAG 2.1** - Level A compliant

## 🛠️ Tecnologías

- **React 18** con TypeScript
- **Vite** como build tool
- **Apollo Client** para GraphQL
- **Material-UI** para componentes
- **React Router** para navegación
- **Zustand** para estado global
- **Workbox** para PWA
- **jsPDF** para generación de recibos

## ⚡ Funcionalidades Principales

### Gestión de Socios
- **Registro de socios**: Individuales y familiares
- **Edición de información**: Datos personales, tipo de membresía
- **Baja de socios**: Validación de pagos pendientes antes de dar de baja
- **Búsqueda y filtrado**: Por nombre, número de socio, tipo de membresía

### Sistema de Pagos
- **Visualización de pagos**: Tabla completa con filtros avanzados
- **Filtrado automático por usuario**: Los usuarios regulares solo ven sus propios pagos
- **Confirmación de pagos**: Solo administradores pueden confirmar pagos pendientes
- **Generación de recibos**: Descarga de recibos en PDF para pagos confirmados
- **Filtros disponibles**:
  - Estado (pendiente/pagado)
  - Método de pago (efectivo/transferencia/tarjeta)
  - Rango de fechas

### Generación de Cuotas Anuales
La aplicación permite a los administradores generar las cuotas anuales para todos los socios activos:

- **Generación masiva**: Un solo clic para crear cuotas de todos los socios
- **Configuración flexible**: Definir montos base y extras para familias
- **Validaciones**: Prevención de errores (años futuros, montos negativos)
- **Estadísticas detalladas**: Reporte completo de la operación
- **Idempotencia**: Ejecutar múltiples veces sin crear duplicados

### Flujo de Caja (Solo Admin)
- **Registro de transacciones**: Ingresos y egresos
- **Categorización**: Organizar por categorías personalizadas
- **Resumen financiero**: Balance actual, ingresos y egresos del período
- **Filtrado avanzado**: Por fecha, categoría, tipo de operación

### Sistema de Autenticación
- **Login seguro**: JWT tokens con refresh automático
- **Verificación de email**: Proceso completo de verificación
- **Recuperación de contraseña**: Flujo seguro de reset
- **Gestión de perfil**: Cambio de contraseña y datos personales

### Reportes (Solo Admin)
- **Dashboard ejecutivo**: Métricas clave del sistema
- **Listado de morosos**: Identificación automática
- **Estadísticas de pagos**: Visualización de tendencias
- **Exportación**: Datos listos para análisis

## 📋 Requisitos Previos

- Node.js 24 LTS (minimum 22.12)
- npm o yarn
- Backend ASAM ejecutándose en http://localhost:8080

## 🔧 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/javicabdev/asam-frontend.git
cd asam-frontend

# Instalar dependencias
npm install

# Copiar archivo de configuración
cp .env.example .env
```

## 🚀 Inicio Rápido

```bash
# Menú interactivo (recomendado)
menu.bat

# Verificar estado del proyecto
verify.bat

# Iniciar desarrollo directo
start.bat
# o
npm run dev
```

## 📁 Estructura del Proyecto

```
asam-frontend/
├── docs/             # 📚 Documentación del proyecto
├── scripts/          # 🛠️ Scripts de utilidad
├── public/           # Assets estáticos
├── src/
│   ├── components/   # Componentes reutilizables
│   ├── features/     # Módulos por funcionalidad
│   │   └── members/  # Feature de gestión de socios
│   ├── hooks/        # Custom hooks
│   ├── layouts/      # Layouts de la aplicación
│   ├── lib/          # Configuraciones (Apollo, etc)
│   ├── pages/        # Páginas/Rutas
│   ├── services/     # Servicios y utilidades
│   ├── stores/       # Estado global (Zustand)
│   ├── types/        # TypeScript types
│   └── utils/        # Utilidades
├── menu.bat          # 🎯 Menú principal interactivo
├── verify.bat        # ✅ Verificación rápida
├── start.bat         # 🚀 Iniciar frontend
├── .env.example      # Variables de entorno ejemplo
├── index.html        # Entry point HTML
├── package.json      # Dependencias
├── tsconfig.json     # Configuración TypeScript
└── vite.config.ts    # Configuración Vite
```

## 🏗️ Scripts Disponibles

### Scripts de Acceso Rápido (Raíz)
- `menu.bat` - Menú interactivo principal
- `verify.bat` - Verificar estado del proyecto
- `start.bat` - Iniciar frontend

### Scripts NPM
```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run preview  # Preview del build
npm run lint     # Linter
npm run format   # Formatear código
```

### Scripts de Utilidad (carpeta scripts/)
- `verify-all.bat` - Verificación completa
- `check-typescript.bat` - Solo verificar TypeScript
- `start-frontend.bat` - Iniciar con mensajes
- Y muchos más...

## 📚 Documentación

Ver la documentación completa en la carpeta `docs/`:
- [Índice de Documentación](docs/DOCS_INDEX.md)
- [Estado del Proyecto](docs/PROJECT_STATUS.md)
- [Estado Final](docs/FINAL_STATUS.md)

## 🔒 Sistema de Permisos

La aplicación implementa un sistema de permisos basado en roles que controla el acceso a diferentes secciones:

### Roles Disponibles

#### 👤 Usuario Regular (`user`)
- ✅ Ver y gestionar información de socios
- ✅ Ver **solo sus propios pagos** (pendientes y pagados)
- ✅ Gestionar su perfil
- ❌ No puede acceder a Flujo de Caja
- ❌ No puede acceder a Reportes
- ❌ No puede gestionar usuarios del sistema
- ❌ No puede generar cuotas anuales

#### 👑 Administrador (`admin`)
- ✅ Acceso completo a todas las funcionalidades
- ✅ Ver **todos los pagos** de todos los socios
- ✅ Gestionar flujo de caja (ingresos y egresos)
- ✅ Generar reportes y ver morosos
- ✅ Gestionar usuarios del sistema
- ✅ Generar cuotas anuales para todos los socios
- ✅ Confirmar pagos pendientes

### Protección de Rutas

El sistema implementa múltiples capas de seguridad:

1. **Nivel de Navegación**: Los items del menú se filtran según el rol del usuario
2. **Nivel de Ruta**: Las rutas protegidas redirigen automáticamente si no se tienen permisos
3. **Nivel de Datos**: Los usuarios regulares solo reciben sus propios datos desde el backend

### Filtrado Automático de Pagos

Los pagos se filtran automáticamente según el usuario:
- **Admin**: Ve todos los pagos del sistema
- **User**: Solo ve pagos asociados a su cuenta de socio (membresía)

Esta funcionalidad se implementa en el hook `usePayments` que automáticamente aplica el filtro `member_id` para usuarios no administradores.

## 🔐 Variables de Entorno

```env
VITE_GRAPHQL_URL=http://localhost:8080/graphql
VITE_APP_NAME=ASAM
VITE_APP_VERSION=0.1.0
```

## 📱 PWA Features

### ✅ Implementado
- **Instalable** en dispositivos móviles y desktop
- **Manifest completo** con iconos, screenshots y shortcuts
- **Service Worker** con Workbox para caché de assets
- **Offline mode** para assets estáticos (imágenes, fuentes, CSS/JS)
- **Indicador de conectividad** con banner cuando estás offline
- **Prompt de instalación** discreto y personalizable
- **Accesibilidad WCAG 2.1 Level A** con skip links y focus indicators
- **Internacionalización** completa en 3 idiomas (ES/FR/WO)

### 📋 Características de la PWA

#### Instalación
- Prompt automático de instalación en navegadores compatibles
- Opción "No mostrar de nuevo" que se recuerda
- Iconos optimizados para todos los tamaños de pantalla
- Splash screens para iOS

#### Funcionamiento Offline
- **Assets estáticos**: Siempre disponibles offline (CSS, JS, imágenes)
- **Fuentes**: Google Fonts cacheadas durante 1 año
- **Imágenes**: Cacheadas durante 30 días
- **GraphQL**: Requiere conexión (NetworkOnly para evitar problemas de auth)

#### Shortcuts de la App
Al instalar la PWA, dispondrás de accesos rápidos a:
- **Nuevo Pago**: Registrar un pago directamente
- **Nuevo Miembro**: Alta de socio directa

#### Accesibilidad
- Skip links para navegación por teclado
- Focus indicators visibles (WCAG 2.1)
- Soporte de preferencias de color del sistema
- Navegación completa por teclado

### 🚫 Limitaciones Actuales
- Datos de GraphQL no disponibles offline (requiere conexión)
- Operaciones de escritura (crear/editar/eliminar) requieren conexión
- Notificaciones push pendientes de implementación

### 🔮 Próximas Mejoras
- Caching inteligente de queries GraphQL
- Sincronización en background
- Notificaciones push
- Optimización de rendimiento con code splitting

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la Branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🙏 Agradecimientos

- Backend ASAM por [@javicabdev](https://github.com/javicabdev)
- Comunidad de React y Material-UI
