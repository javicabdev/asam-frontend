# 🚀 Guía de Despliegue en Netlify

## 📋 Pre-requisitos

1. Cuenta en [Netlify](https://netlify.com)
2. Repositorio en GitHub/GitLab/Bitbucket
3. Backend desplegado y accesible

## 🔧 Configuración Paso a Paso

### 1️⃣ Preparar el Proyecto

```bash
# Asegurarse de que el build funciona localmente
npm install
npm run build:safe

# Commit de los archivos de configuración
git add netlify.toml .env.production.example public/_redirects
git commit -m "Add Netlify configuration"
git push
```

### 2️⃣ Importar en Netlify

#### Opción A: Desde la UI de Netlify

1. Ir a [app.netlify.com](https://app.netlify.com)
2. Click en "Add new site" → "Import an existing project"
3. Conectar tu repositorio de GitHub/GitLab/Bitbucket
4. Configurar el build:
   - **Branch to deploy**: `main`
   - **Build command**: `npm run build:safe`
   - **Publish directory**: `dist`
   - **Node version**: 18.x (en Environment → Environment variables)

#### Opción B: Usando Netlify CLI

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Inicializar el sitio
netlify init

# Deploy manual
netlify deploy --prod --dir=dist
```

### 3️⃣ Configurar Variables de Entorno

En el panel de Netlify → Site settings → Environment variables, añadir:

#### Variables Requeridas:

```env
# Backend API (CRÍTICO - cambiar a tu URL real)
VITE_GRAPHQL_URI=https://tu-backend.herokuapp.com/graphql

# Configuración básica
VITE_APP_NAME=ASAM
VITE_APP_VERSION=1.0.0

# Features
VITE_ENABLE_PWA=true
VITE_ENABLE_MOCK_DATA=false
```

#### Variables Opcionales:

```env
# Analytics
VITE_GA_TRACKING_ID=UA-XXXXXXXXX-X
VITE_SENTRY_DSN=https://xxxxx@sentry.io/xxxxx

# Debugging
VITE_ENABLE_DEBUG=false
```

### 4️⃣ Configurar Dominio Personalizado (Opcional)

1. En Netlify → Domain settings
2. Add custom domain → `asam.org` o `app.asam.org`
3. Configurar DNS:
   - **A Record**: `75.2.60.5` (IP de Netlify)
   - **CNAME**: `[tu-sitio].netlify.app`

### 5️⃣ Configurar HTTPS

Netlify proporciona HTTPS automáticamente con Let's Encrypt:

1. Domain settings → HTTPS
2. Verify DNS configuration
3. Provision certificate (automático)

## 🔄 Configuración de CI/CD

### Deploy Automático

Con la configuración actual, cada push a `main` desplegará automáticamente.

### Deploy Previews

Netlify crea automáticamente previews para Pull Requests:

```yaml
# netlify.toml ya está configurado para esto
[build]
  command = "npm run build:safe"
```

### Deploy Hooks

Para deploys programados o desde otros servicios:

1. Site settings → Build & deploy → Build hooks
2. Crear un hook
3. Usar con: `curl -X POST https://api.netlify.com/build_hooks/YOUR_HOOK_ID`

## 🎯 Configuraciones Importantes

### Proxy del Backend

El archivo `netlify.toml` incluye configuración de proxy:

```toml
[[redirects]]
  from = "/graphql"
  to = "https://tu-backend.com/graphql"
  status = 200
  force = true
```

**IMPORTANTE**: Cambiar `https://api.asam.org` por la URL real de tu backend.

### Headers de Seguridad

Ya configurados en `netlify.toml`:
- CSP (Content Security Policy)
- X-Frame-Options
- X-Content-Type-Options
- Permisos de características

### Service Worker para PWA

Configuración especial para el Service Worker:

```toml
[[headers]]
  for = "/sw.js"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"
```

## 🔍 Verificación Post-Deploy

### Checklist de Verificación:

- [ ] La aplicación carga en https://[tu-sitio].netlify.app
- [ ] El login funciona (conexión con backend)
- [ ] Las rutas de React Router funcionan
- [ ] El Service Worker se registra (ver en DevTools → Application)
- [ ] Los assets se cargan con HTTPS
- [ ] El GraphQL endpoint responde
- [ ] Las notificaciones PWA funcionan
- [ ] El modo offline funciona

### Comandos de Debug:

```bash
# Ver logs de build
netlify logs:function

# Ver estado del sitio
netlify status

# Abrir el sitio
netlify open
```

## 🚨 Solución de Problemas Comunes

### Error: "Page Not Found" en rutas

**Solución**: Verificar que `_redirects` o `netlify.toml` tiene:
```
/*    /index.html   200
```

### Error: "Failed to fetch" del GraphQL

**Solución**: 
1. Verificar variable `VITE_GRAPHQL_URI`
2. Verificar CORS en el backend
3. Añadir el dominio de Netlify a los orígenes permitidos

### Build falla en Netlify pero funciona local

**Solución**:
1. Verificar Node version en netlify.toml
2. Clear cache and deploy: Site settings → Build → Clear cache
3. Usar `npm run build:safe` que es más tolerante

### Service Worker no se actualiza

**Solución**: Los headers en `netlify.toml` ya manejan esto, pero si persiste:
```javascript
// En tu código
navigator.serviceWorker.register('/sw.js', {
  updateViaCache: 'none'
});
```

## 📊 Monitoreo

### Netlify Analytics (Pago)

En el panel de Netlify → Analytics

### Alternativas Gratuitas:

1. Google Analytics (configurar `VITE_GA_TRACKING_ID`)
2. Plausible Analytics
3. Umami Analytics

## 🔐 Seguridad

### Variables Sensibles

NUNCA incluir en el código:
- Tokens de API
- Claves privadas
- Credenciales de base de datos

Usar siempre variables de entorno en Netlify.

### Headers de Seguridad

Ya configurados, pero revisar CSP según necesidades:

```toml
Content-Security-Policy = "default-src 'self'; ..."
```

## 📱 PWA en Netlify

La configuración ya incluye:
- Service Worker con estrategia de caché
- Manifest.json
- Icons en múltiples tamaños
- Modo offline

Para verificar: Lighthouse en Chrome DevTools → Generate report

## 🎉 ¡Listo!

Tu aplicación debería estar funcionando en:

```
https://[tu-nombre-de-sitio].netlify.app
```

O en tu dominio personalizado si lo configuraste.

## 📚 Recursos

- [Documentación de Netlify](https://docs.netlify.com)
- [Netlify CLI](https://cli.netlify.com)
- [Deploy Previews](https://docs.netlify.com/site-deploys/deploy-previews/)
- [Environment Variables](https://docs.netlify.com/environment-variables/overview/)
- [Custom Headers](https://docs.netlify.com/routing/headers/)
- [Redirects and Rewrites](https://docs.netlify.com/routing/redirects/)
