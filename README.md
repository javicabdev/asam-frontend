# ASAM Frontend

Frontend web progresiva para el sistema de gestión ASAM - Asociación de miembros.

## 🚀 Características

- ✅ Aplicación Web Progresiva (PWA)
- ✅ Gestión de miembros individuales y familiares
- ✅ Control de pagos y cuotas
- ✅ Flujo de caja (entradas y salidas)
- ✅ Reportes y listado de morosos
- ✅ Interfaz responsive y moderna
- ✅ Funcionalidad offline

## 🛠️ Tecnologías

- **React 18** con TypeScript
- **Vite** como build tool
- **Apollo Client** para GraphQL
- **Material-UI** para componentes
- **React Router** para navegación
- **Zustand** para estado global
- **Workbox** para PWA

## 📋 Requisitos Previos

- Node.js 18+
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

## 🔐 Variables de Entorno

```env
VITE_GRAPHQL_URL=http://localhost:8080/graphql
VITE_APP_NAME=ASAM
VITE_APP_VERSION=0.1.0
```

## 📱 PWA Features

- Instalable en dispositivos móviles y desktop
- Funciona offline (modo lectura)
- Sincronización automática cuando vuelve la conexión
- Notificaciones push (próximamente)

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
