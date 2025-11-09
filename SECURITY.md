# Guía de Seguridad SAST/DAST - ASAM Frontend

Esta guía documenta las medidas de seguridad implementadas y pendientes en el frontend de ASAM.

## 🛡️ SAST (Static Application Security Testing)

### ✅ Implementado

1. **TypeScript Strict Mode**
   - Configuración estricta en `tsconfig.json`
   - Reglas de tipo seguro en ESLint (`@typescript-eslint/no-unsafe-*`)

2. **ESLint con TypeScript**
   - Configuración en `.eslintrc.json`
   - Reglas estrictas de tipo y async/await
   - Prevención de `any` explícito

### 📋 Pendiente de Implementación

#### 1. Plugins de Seguridad para ESLint

Instalar y configurar los siguientes plugins:

```bash
npm install --save-dev eslint-plugin-react eslint-plugin-security
```

Luego actualizar `.eslintrc.json`:

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:react-hooks/recommended",
    "plugin:react/recommended",
    "plugin:security/recommended"
  ],
  "plugins": ["react-refresh", "react", "security"],
  "rules": {
    // Reglas de seguridad React (SAST)
    "react/no-danger": "error",
    "react/no-danger-with-children": "error",
    "react/jsx-no-script-url": "error",
    "react/jsx-no-target-blank": "error",

    // Reglas de seguridad general (SAST)
    "security/detect-eval-with-expression": "error",
    "security/detect-non-literal-regexp": "warn",
    "security/detect-unsafe-regex": "error",
    "security/detect-buffer-noassert": "error",
    "security/detect-child-process": "warn",
    "security/detect-disable-mustache-escape": "error",
    "security/detect-no-csrf-before-method-override": "error",
    "security/detect-non-literal-fs-filename": "warn",
    "security/detect-non-literal-require": "warn",
    "security/detect-object-injection": "warn",
    "security/detect-possible-timing-attacks": "warn",
    "security/detect-pseudoRandomBytes": "error"
  }
}
```

**Vulnerabilidades críticas que detecta:**
- ✅ `dangerouslySetInnerHTML` (XSS)
- ✅ `javascript:` URLs en JSX (XSS)
- ✅ `eval()` y `Function()` (Code Injection)
- ✅ RegExp inseguros (ReDoS)

#### 2. Análisis de Dependencias (SCA)

**Herramientas recomendadas:**

1. **npm audit (Básico - KISS)**
   ```bash
   npm audit
   npm audit fix
   ```

2. **Snyk (Recomendado)**

   a. Instalar CLI:
   ```bash
   npm install -g snyk
   snyk auth
   ```

   b. Escanear proyecto:
   ```bash
   snyk test                    # Dependencias
   snyk code test               # Código fuente (SAST)
   ```

   c. Integrar en GitHub:
   - Ir a https://app.snyk.io
   - Conectar repositorio
   - Habilitar checks en PRs

3. **GitHub Dependabot** (Gratuito)
   - Crear `.github/dependabot.yml`:
   ```yaml
   version: 2
   updates:
     - package-ecosystem: "npm"
       directory: "/"
       schedule:
         interval: "weekly"
       open-pull-requests-limit: 10
   ```

#### 3. Scripts de Seguridad en package.json

Agregar al `package.json`:

```json
{
  "scripts": {
    "security:audit": "npm audit --audit-level=moderate",
    "security:check": "npm run security:audit && npm run lint:strict",
    "security:snyk": "snyk test && snyk code test",
    "precommit": "npm run type-check && npm run security:check"
  }
}
```

---

## 🤖 DAST (Dynamic Application Security Testing)

### ✅ Implementado en `netlify.toml`

1. **HSTS (HTTP Strict Transport Security)**
   ```
   Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
   ```
   - Fuerza HTTPS por 1 año
   - Protege subdominios
   - Elegible para HSTS Preload List

2. **Content Security Policy (CSP)**
   - Configurado en `netlify.toml`
   - ⚠️ **ADVERTENCIA**: Actualmente usa `unsafe-inline` y `unsafe-eval` (necesario para Vite/MUI)

3. **Cabeceras de Seguridad Básicas**
   - ✅ `X-Frame-Options: DENY` (Anti-clickjacking)
   - ✅ `X-Content-Type-Options: nosniff` (Anti-MIME sniffing)
   - ✅ `X-XSS-Protection: 1; mode=block`
   - ✅ `Referrer-Policy: strict-origin-when-cross-origin`

4. **Permissions Policy**
   - Deshabilitados: cámara, micrófono, geolocalización, etc.

### 📋 Pendiente de Implementación

#### 1. OWASP ZAP Scanning

**Setup local (KISS):**

```bash
# Instalar ZAP (macOS)
brew install --cask owasp-zap

# Ejecutar app localmente
npm run dev

# En ZAP:
# 1. Automated Scan → http://localhost:5173
# 2. Revisar alertas en el reporte
```

**Alertas críticas a buscar:**
- XSS (Reflected/Stored)
- Ausencia de cabeceras de seguridad
- Cookies sin flags `Secure` o `HttpOnly`
- CORS mal configurado

#### 2. CI/CD Integration

Agregar al pipeline de GitHub Actions (`.github/workflows/security.yml`):

```yaml
name: Security Scan

on:
  pull_request:
  push:
    branches: [main]

jobs:
  sast:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - name: Run npm audit
        run: npm audit --audit-level=moderate
      - name: Run Snyk
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

  dast:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: ZAP Baseline Scan
        uses: zaproxy/action-baseline@v0.7.0
        with:
          target: 'https://your-staging-url.netlify.app'
```

#### 3. Mejorar CSP (Eliminar unsafe-inline/unsafe-eval)

**Problema actual:**
Vite en modo desarrollo inyecta scripts inline, y Material-UI usa estilos inline.

**Solución a largo plazo:**
1. Usar nonces en producción
2. Configurar Vite para generar hashes de scripts
3. Migrar estilos MUI a emotion con CSP-safe config

**Archivo de configuración sugerido** (`vite.config.ts`):

```typescript
export default defineConfig({
  plugins: [
    react(),
    // Plugin para generar CSP hashes
    viteCspPlugin({
      policy: {
        'script-src': ['self'],
        'style-src': ['self', 'https://fonts.googleapis.com']
      }
    })
  ]
})
```

#### 4. Seguridad en Cookies

Si usas cookies para autenticación, asegúrate de:

```typescript
// Backend debe configurar:
Set-Cookie: token=...;
  Secure;           // Solo HTTPS
  HttpOnly;         // No accesible desde JS (previene XSS)
  SameSite=Strict;  // Previene CSRF
  Path=/;
  Max-Age=3600
```

En el frontend (Apollo Client):

```typescript
const client = new ApolloClient({
  uri: '/graphql',
  credentials: 'include', // Envía cookies
  // ...
})
```

---

## 🔍 Checklist de Auditoría

### SAST
- [ ] ESLint con `eslint-plugin-react` y `eslint-plugin-security`
- [ ] `npm audit` pasa sin vulnerabilidades críticas
- [ ] Snyk integrado en GitHub
- [ ] No se usa `dangerouslySetInnerHTML` sin sanitización
- [ ] No hay `eval()` o `Function()` en el código

### DAST
- [ ] HSTS configurado (✅ Implementado)
- [ ] CSP sin `unsafe-*` (⚠️ Pendiente)
- [ ] Todas las cabeceras de seguridad presentes (✅ Implementado)
- [ ] ZAP scan pasa sin alertas críticas
- [ ] Cookies con flags `Secure` y `HttpOnly`

### DevSecOps
- [ ] Pipeline de CI falla con vulnerabilidades críticas
- [ ] Dependabot habilitado
- [ ] DAST ejecutado en staging antes de producción

---

## 🚨 Vulnerabilidades Comunes en React a Evitar

### 1. XSS via dangerouslySetInnerHTML

```tsx
// ❌ PELIGROSO
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ SEGURO (si es absolutamente necesario)
import DOMPurify from 'dompurify'
<div dangerouslySetInnerHTML={{
  __html: DOMPurify.sanitize(userInput)
}} />

// ✅ MEJOR: Deja que React lo maneje
<div>{userInput}</div>
```

### 2. XSS via href con javascript:

```tsx
// ❌ PELIGROSO
<a href={`javascript:${userInput}`}>Click</a>

// ✅ SEGURO
<a href={sanitizeUrl(userInput)}>Click</a>
```

### 3. Open Redirect

```tsx
// ❌ PELIGROSO
const redirect = new URLSearchParams(location.search).get('returnUrl')
navigate(redirect) // Puede ser https://evil.com

// ✅ SEGURO
const allowedDomains = ['/dashboard', '/profile']
if (redirect && allowedDomains.some(d => redirect.startsWith(d))) {
  navigate(redirect)
}
```

### 4. Injection en GraphQL

```tsx
// ❌ PELIGROSO (aunque GraphQL ayuda)
const query = gql`
  query {
    user(id: "${userId}") { name }
  }
`

// ✅ SEGURO
const query = gql`
  query GetUser($userId: ID!) {
    user(id: $userId) { name }
  }
`
useQuery(query, { variables: { userId } })
```

---

## 📚 Recursos

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [React Security Best Practices](https://react.dev/learn/security)
- [Snyk Learning](https://learn.snyk.io/)
- [Content Security Policy Reference](https://content-security-policy.com/)
- [Security Headers Check](https://securityheaders.com/)

---

## 🔄 Próximos Pasos

1. **Inmediato (Esta semana)**
   - [ ] Instalar `eslint-plugin-react` y `eslint-plugin-security`
   - [ ] Ejecutar `npm audit` y corregir vulnerabilidades críticas
   - [ ] Crear cuenta en Snyk y escanear el proyecto

2. **Corto plazo (Este mes)**
   - [ ] Configurar Dependabot
   - [ ] Ejecutar OWASP ZAP localmente
   - [ ] Revisar código en busca de `dangerouslySetInnerHTML`

3. **Largo plazo (Este trimestre)**
   - [ ] Integrar Snyk en CI/CD
   - [ ] Mejorar CSP para eliminar `unsafe-*`
   - [ ] Configurar ZAP baseline scan en staging
