# 🚀 Instrucciones de Configuración - ASAM Frontend

## 1. Crear el repositorio en GitHub

Ve a https://github.com/new y crea un nuevo repositorio:
- Nombre: `asam-frontend`
- Descripción: "Frontend web progresiva para el sistema de gestión ASAM - Asociación de miembros"
- Público o Privado según prefieras
- NO inicialices con README

## 2. Inicializar el repositorio Git

Abre una terminal en `C:\Work\babacar\asam\asam-frontend` y ejecuta:

### Opción A: PowerShell (Windows)
```powershell
.\init-repo.ps1
```

### Opción B: Git Bash o terminal Unix
```bash
chmod +x init-repo.sh
./init-repo.sh
```

### Opción C: Manualmente
```bash
git init
git add .
git commit -m "feat: initial project setup with React, Vite, TypeScript and PWA support"
git branch -M main
git remote add origin https://github.com/javicabdev/asam-frontend.git
git push -u origin main
```

## 3. Instalar dependencias

```bash
npm install
```

## 4. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita el archivo `.env` si necesitas cambiar la URL del backend.

## 5. Iniciar el servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en http://localhost:5173

## 📋 Estructura del proyecto

El proyecto está organizado de la siguiente manera:

```
src/
├── components/     # Componentes reutilizables
├── features/       # Módulos por funcionalidad (a desarrollar)
├── graphql/        # Queries y mutations de GraphQL
├── hooks/          # Custom hooks
├── layouts/        # Layouts de la aplicación
├── lib/            # Configuraciones (Apollo, tema)
├── pages/          # Páginas/Rutas
├── services/       # Servicios y utilidades
├── stores/         # Estado global (Zustand)
├── types/          # TypeScript types
└── utils/          # Utilidades
```

## 🎯 Próximos pasos

1. **Mejorar la página de Dashboard**
   - Añadir estadísticas de miembros activos
   - Mostrar balance actual
   - Gráficos de ingresos/gastos

2. **Implementar CRUD de Miembros**
   - Tabla con listado y búsqueda
   - Formulario de creación/edición
   - Cambio de estado

3. **Implementar gestión de Pagos**
   - Registro de pagos individuales
   - Cuotas masivas mensuales
   - Historial de pagos

4. **Implementar Flujo de Caja**
   - Registro de entradas y salidas
   - Visualización del balance

5. **Implementar Reportes**
   - Listado de morosos
   - Exportación a CSV/Excel

## 🛠️ Comandos disponibles

- `npm run dev` - Iniciar servidor de desarrollo
- `npm run build` - Construir para producción
- `npm run preview` - Previsualizar build de producción
- `npm run lint` - Ejecutar linter
- `npm run format` - Formatear código con Prettier

## 📱 PWA Features

La aplicación ya está configurada como PWA. Para probarla:

1. Ejecuta `npm run build` y luego `npm run preview`
2. Abre la aplicación en Chrome
3. Deberías ver un botón de "Instalar" en la barra de direcciones
4. La aplicación funcionará offline para consultas (las mutaciones requieren conexión)

## 🤝 Contribuir

1. Crea una rama para tu feature: `git checkout -b feature/nombre-feature`
2. Haz tus cambios y commits
3. Push a la rama: `git push origin feature/nombre-feature`
4. Crea un Pull Request

## ❓ Soporte

Si tienes alguna pregunta o problema:
- Revisa la documentación del backend en `/asam-backend/docs/frontend`
- Abre un issue en GitHub
- Contacta al equipo de desarrollo

¡Listo para empezar a desarrollar! 🚀
