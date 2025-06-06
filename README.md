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

## 🚀 Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# El frontend estará disponible en http://localhost:5173
```

## 🏗️ Build

```bash
# Construir para producción
npm run build

# Previsualizar build
npm run preview
```

## 📁 Estructura del Proyecto

```
asam-frontend/
├── public/           # Assets estáticos
├── src/
│   ├── components/   # Componentes reutilizables
│   ├── features/     # Módulos por funcionalidad
│   ├── hooks/        # Custom hooks
│   ├── layouts/      # Layouts de la aplicación
│   ├── lib/          # Configuraciones (Apollo, etc)
│   ├── pages/        # Páginas/Rutas
│   ├── services/     # Servicios y utilidades
│   ├── stores/       # Estado global (Zustand)
│   ├── types/        # TypeScript types
│   └── utils/        # Utilidades
├── .env.example      # Variables de entorno ejemplo
├── index.html        # Entry point HTML
├── package.json      # Dependencias
├── tsconfig.json     # Configuración TypeScript
└── vite.config.ts    # Configuración Vite
```

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
