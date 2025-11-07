# Deployment Guide - Annual Fee Generation

## 📋 Tabla de Contenidos

1. [Pre-requisitos](#pre-requisitos)
2. [Preparación del Entorno](#preparación-del-entorno)
3. [Migraciones de Base de Datos](#migraciones-de-base-de-datos)
4. [Despliegue Backend](#despliegue-backend)
5. [Despliegue Frontend](#despliegue-frontend)
6. [Verificación Post-Deploy](#verificación-post-deploy)
7. [Rollback Plan](#rollback-plan)
8. [Monitorización](#monitorización)

---

## ✅ Pre-requisitos

### Checklist Pre-Deploy

- [ ] Todos los tests (unitarios + integración + E2E) pasan
- [ ] Cobertura de tests >= 80%
- [ ] Code review aprobado por al menos 2 revisores
- [ ] Documentación actualizada
- [ ] Changelog actualizado
- [ ] Feature flags configurados (si aplica)
- [ ] Backup de base de datos creado
- [ ] Plan de rollback documentado
- [ ] Comunicación al equipo sobre el deploy

### Versiones y Dependencias

**Backend:**
```
Go: >= 1.21
PostgreSQL: >= 14
GORM: v2
gqlgen: latest
```

**Frontend:**
```
Node.js: >= 18.x
React: >= 18
Apollo Client: >= 3.8
Material-UI: >= 5
```

---

## 🔧 Preparación del Entorno

### 1. Variables de Entorno

#### Backend (.env)

```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=asam_user
DB_PASSWORD=secure_password
DB_NAME=asam_db
DB_SSL_MODE=require

# Server
PORT=8080
GIN_MODE=release
LOG_LEVEL=info

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRATION=24h

# Email (MailerSend)
MAILERSEND_API_KEY=your-mailersend-api-key
MAILERSEND_FROM_EMAIL=noreply@asam.com
MAILERSEND_FROM_NAME=ASAM

# Feature Flags
ENABLE_FEE_GENERATION=true
```

#### Frontend (.env.production)

```bash
# API
VITE_API_URL=https://api.asam.com/graphql
VITE_WS_URL=wss://api.asam.com/graphql

# Feature Flags
VITE_ENABLE_FEE_GENERATION=true

# Sentry (opcional)
VITE_SENTRY_DSN=your-sentry-dsn
VITE_SENTRY_ENVIRONMENT=production
```

### 2. Configuración de Infrastructure as Code

#### Docker Compose (Local/Staging)

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_USER: asam_user
      POSTGRES_PASSWORD: secure_password
      POSTGRES_DB: asam_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      - DB_HOST=postgres
      - PORT=8080
    ports:
      - "8080:8080"
    depends_on:
      - postgres

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

#### Google Cloud Run (Production)

**backend.yaml:**
```yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: asam-backend
spec:
  template:
    metadata:
      annotations:
        autoscaling.knative.dev/minScale: "1"
        autoscaling.knative.dev/maxScale: "10"
    spec:
      containers:
        - image: gcr.io/asam-project/backend:latest
          ports:
            - containerPort: 8080
          env:
            - name: DB_HOST
              value: "aiven-postgresql-host"
            - name: DB_PORT
              value: "5432"
            - name: DB_USER
              valueFrom:
                secretKeyRef:
                  name: db-credentials
                  key: username
            - name: DB_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: db-credentials
                  key: password
          resources:
            limits:
              memory: 512Mi
              cpu: 1000m
```

**frontend.yaml:**
```yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: asam-frontend
spec:
  template:
    spec:
      containers:
        - image: gcr.io/asam-project/frontend:latest
          ports:
            - containerPort: 80
          resources:
            limits:
              memory: 256Mi
              cpu: 500m
```

---

## 🗄️ Migraciones de Base de Datos

### 1. Crear Backup

**Antes de cualquier migración:**

```bash
# Backup completo de la base de datos
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME -F c -b -v -f backup_$(date +%Y%m%d_%H%M%S).dump

# Verificar el backup
pg_restore --list backup_*.dump
```

### 2. Migración: Añadir `membership_fee_id` a Payments

**Archivo**: `migrations/000002_add_membership_fee_to_payments.up.sql`

```sql
-- ============================================
-- MIGRATION: Add membership_fee_id to payments
-- Date: 2025-11-07
-- Description: Links payments with annual fees
-- ============================================

BEGIN;

-- 1. Añadir columna membership_fee_id (nullable al principio)
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS membership_fee_id BIGINT UNSIGNED;

-- 2. Crear índice para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_payments_membership_fee_id 
ON payments(membership_fee_id);

-- 3. Añadir foreign key constraint
ALTER TABLE payments 
ADD CONSTRAINT fk_payments_membership_fee 
FOREIGN KEY (membership_fee_id) 
REFERENCES membership_fees(id) 
ON DELETE SET NULL
ON UPDATE CASCADE;

-- 4. Comentarios para documentación
COMMENT ON COLUMN payments.membership_fee_id IS 'References the annual membership fee this payment is for';

COMMIT;
```

**Rollback**: `migrations/000002_add_membership_fee_to_payments.down.sql`

```sql
BEGIN;

-- Eliminar constraint
ALTER TABLE payments 
DROP CONSTRAINT IF EXISTS fk_payments_membership_fee;

-- Eliminar índice
DROP INDEX IF EXISTS idx_payments_membership_fee_id;

-- Eliminar columna
ALTER TABLE payments 
DROP COLUMN IF EXISTS membership_fee_id;

COMMIT;
```

### 3. Ejecutar Migraciones

**Opción A: Usando golang-migrate CLI**

```bash
# Instalar golang-migrate
go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest

# Verificar estado actual
migrate -database "$DATABASE_URL" -path ./migrations version

# Ejecutar migraciones pendientes
migrate -database "$DATABASE_URL" -path ./migrations up

# Verificar que se aplicó correctamente
migrate -database "$DATABASE_URL" -path ./migrations version
```

**Opción B: Usando script personalizado**

```bash
# En el proyecto backend
cd cmd/migrate
go run main.go up
```

### 4. Verificación de Migraciones

```sql
-- Verificar que la columna existe
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'payments' AND column_name = 'membership_fee_id';

-- Verificar que el índice existe
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'payments' AND indexname = 'idx_payments_membership_fee_id';

-- Verificar constraint
SELECT conname, contype, confdeltype
FROM pg_constraint
WHERE conname = 'fk_payments_membership_fee';
```

---

## 🚀 Despliegue Backend

### Estrategia: Blue-Green Deployment

```
┌─────────────┐          ┌─────────────┐
│   Blue      │          │   Green     │
│  (Current)  │◄────────►│    (New)    │
│   v1.0.0    │          │   v1.1.0    │
└─────────────┘          └─────────────┘
       ▲                        ▲
       │                        │
       └────────────┬───────────┘
                    │
             ┌──────▼──────┐
             │Load Balancer│
             └─────────────┘
```

### Paso 1: Build y Push de Imagen

```bash
# Navegar al directorio backend
cd asam-backend

# Build de la imagen Docker
docker build -t gcr.io/asam-project/backend:v1.1.0 .
docker tag gcr.io/asam-project/backend:v1.1.0 gcr.io/asam-project/backend:latest

# Push a Google Container Registry
docker push gcr.io/asam-project/backend:v1.1.0
docker push gcr.io/asam-project/backend:latest
```

### Paso 2: Deploy a Cloud Run (Green)

```bash
# Deploy nueva versión sin enviar tráfico
gcloud run deploy asam-backend \
  --image gcr.io/asam-project/backend:v1.1.0 \
  --platform managed \
  --region europe-west1 \
  --no-traffic \
  --tag green

# Obtener URL de la versión green
GREEN_URL=$(gcloud run services describe asam-backend \
  --platform managed \
  --region europe-west1 \
  --format 'value(status.address.url)')

echo "Green deployment available at: $GREEN_URL"
```

### Paso 3: Smoke Tests en Green

```bash
# Health check
curl -f $GREEN_URL/health || exit 1

# Test básico de GraphQL
curl -X POST $GREEN_URL/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "query { __typename }"}'

# Test específico de fee generation (con token de admin)
curl -X POST $GREEN_URL/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "query": "query { checkFeeExists(year: 2024) }"
  }'
```

### Paso 4: Migrar Tráfico Gradualmente

```bash
# Enviar 10% del tráfico a green
gcloud run services update-traffic asam-backend \
  --to-revisions green=10,blue=90

# Esperar 10 minutos y monitorear métricas
sleep 600

# Si todo OK, aumentar a 50%
gcloud run services update-traffic asam-backend \
  --to-revisions green=50,blue=50

# Esperar otros 10 minutos
sleep 600

# Si todo sigue OK, migrar 100% del tráfico
gcloud run services update-traffic asam-backend \
  --to-revisions green=100
```

### Paso 5: Cleanup

```bash
# Mantener blue por 24h por si necesitamos rollback
# Después de 24h sin problemas:
gcloud run revisions delete <blue-revision-name> --quiet
```

---

## 🎨 Despliegue Frontend

### Estrategia: Static Site con CDN

### Paso 1: Build de Producción

```bash
cd asam-frontend

# Instalar dependencias
npm ci --production

# Build optimizado
npm run build

# Verificar build
ls -lh dist/
```

### Paso 2: Deploy a Cloud Storage + CDN

```bash
# Subir archivos a Cloud Storage
gsutil -m rsync -r -d dist/ gs://asam-frontend-prod/

# Configurar caché headers
gsutil -m setmeta -h "Cache-Control:public, max-age=31536000, immutable" \
  gs://asam-frontend-prod/assets/**

gsutil -m setmeta -h "Cache-Control:public, max-age=0, must-revalidate" \
  gs://asam-frontend-prod/index.html

# Invalidar CDN cache
gcloud compute url-maps invalidate-cdn-cache asam-frontend-lb \
  --path "/*"
```

### Opción Alternativa: Cloud Run con Nginx

```dockerfile
# frontend/Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
# Build y deploy
docker build -t gcr.io/asam-project/frontend:v1.1.0 .
docker push gcr.io/asam-project/frontend:v1.1.0

gcloud run deploy asam-frontend \
  --image gcr.io/asam-project/frontend:v1.1.0 \
  --platform managed \
  --region europe-west1
```

---

## ✅ Verificación Post-Deploy

### Checklist de Verificación

#### Backend
- [ ] Health check endpoint responde
- [ ] GraphQL playground accesible
- [ ] Autenticación JWT funciona
- [ ] Query de prueba: `checkFeeExists` funciona
- [ ] Mutation de prueba: logs muestran requests correctos
- [ ] Métricas de performance normales
- [ ] Logs no muestran errores críticos

#### Frontend
- [ ] Aplicación carga correctamente
- [ ] Login funciona
- [ ] Navegación a página de Cuotas funciona
- [ ] Diálogo de generación se abre correctamente
- [ ] Formulario valida correctamente
- [ ] No hay errores en console del navegador
- [ ] Assets se cargan desde CDN

### Scripts de Verificación

**Backend:**
```bash
#!/bin/bash
# verify-backend.sh

API_URL="https://api.asam.com"

echo "🔍 Verificando backend..."

# Health check
echo "1. Health check..."
curl -f $API_URL/health || exit 1

# GraphQL introspection
echo "2. GraphQL introspection..."
RESPONSE=$(curl -s -X POST $API_URL/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ __schema { types { name } } }"}')

if echo "$RESPONSE" | grep -q "MembershipFee"; then
  echo "✅ MembershipFee type found"
else
  echo "❌ MembershipFee type NOT found"
  exit 1
fi

# Fee generation available
echo "3. Fee generation queries..."
RESPONSE=$(curl -s -X POST $API_URL/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"query": "query { checkFeeExists(year: 2024) }"}')

if echo "$RESPONSE" | grep -q "data"; then
  echo "✅ Fee queries working"
else
  echo "❌ Fee queries failing"
  exit 1
fi

echo "✅ Backend verification complete"
```

**Frontend:**
```bash
#!/bin/bash
# verify-frontend.sh

FRONTEND_URL="https://asam.com"

echo "🔍 Verificando frontend..."

# Check main page loads
echo "1. Checking main page..."
STATUS=$(curl -o /dev/null -s -w "%{http_code}\n" $FRONTEND_URL)
if [ "$STATUS" -eq 200 ]; then
  echo "✅ Main page loads"
else
  echo "❌ Main page returns $STATUS"
  exit 1
fi

# Check fees page
echo "2. Checking fees page..."
STATUS=$(curl -o /dev/null -s -w "%{http_code}\n" $FRONTEND_URL/fees)
if [ "$STATUS" -eq 200 ]; then
  echo "✅ Fees page loads"
else
  echo "❌ Fees page returns $STATUS"
  exit 1
fi

echo "✅ Frontend verification complete"
```

---

## ⏮️ Rollback Plan

### Escenarios de Rollback

#### Nivel 1: Error Menor (Frontend)
**Síntomas:** Bugs visuales, traducciones incorrectas
**Solución:** Hotfix y deploy rápido

```bash
# Revertir último commit
git revert HEAD
git push origin main

# Rebuild y redeploy
npm run build
gsutil -m rsync -r dist/ gs://asam-frontend-prod/
```

#### Nivel 2: Error Medio (Backend - Bug en nueva feature)
**Síntomas:** Fee generation falla, pero resto del sistema funciona
**Solución:** Desactivar feature flag

```bash
# Actualizar variable de entorno
gcloud run services update asam-backend \
  --set-env-vars ENABLE_FEE_GENERATION=false
```

#### Nivel 3: Error Crítico (Backend - Sistema inestable)
**Síntomas:** API caída, errores 500, timeout
**Solución:** Rollback completo a versión anterior

```bash
# Opción A: Si aún existe blue deployment
gcloud run services update-traffic asam-backend \
  --to-revisions blue=100

# Opción B: Deploy versión anterior
gcloud run deploy asam-backend \
  --image gcr.io/asam-project/backend:v1.0.0

# Rollback de migraciones si es necesario
migrate -database "$DATABASE_URL" -path ./migrations down 1
```

#### Nivel 4: Desastre (Base de Datos Corrupta)
**Síntomas:** Data integrity issues, constraints violated
**Solución:** Restaurar backup

```bash
# Detener backend
gcloud run services update asam-backend \
  --set-env-vars MAINTENANCE_MODE=true

# Restaurar desde backup
pg_restore -h $DB_HOST -U $DB_USER -d $DB_NAME -c backup_YYYYMMDD_HHMMSS.dump

# Verificar integridad
psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "SELECT COUNT(*) FROM payments;"
psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "SELECT COUNT(*) FROM membership_fees;"

# Reiniciar backend
gcloud run services update asam-backend \
  --set-env-vars MAINTENANCE_MODE=false
```

### Tiempos de Rollback Estimados

| Nivel | Tiempo Estimado | Downtime |
|-------|-----------------|----------|
| Nivel 1 (Frontend) | 5-10 min | 0 min |
| Nivel 2 (Feature Flag) | 2-5 min | 0 min |
| Nivel 3 (Deploy Anterior) | 10-15 min | 2-5 min |
| Nivel 4 (DB Restore) | 30-60 min | 15-30 min |

---

## 📊 Monitorización

### Métricas Clave

#### Backend (Cloud Run)

```yaml
# Alerts en Google Cloud Monitoring

- name: High Error Rate
  condition: error_rate > 5%
  duration: 5 minutes
  notification: pagerduty

- name: High Latency
  condition: p95_latency > 2000ms
  duration: 5 minutes
  notification: slack

- name: Memory Usage
  condition: memory_usage > 90%
  duration: 10 minutes
  notification: email

- name: Fee Generation Failures
  condition: fee_generation_errors > 10/hour
  duration: 1 hour
  notification: slack
```

#### Queries de Monitoreo

```sql
-- Cuotas generadas por día
SELECT 
  DATE(created_at) as date,
  COUNT(*) as fees_generated,
  SUM(base_fee_amount) as total_expected
FROM membership_fees
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Pagos creados por generación de cuotas
SELECT 
  mf.year,
  COUNT(p.id) as payments_created,
  SUM(p.amount) as total_amount
FROM membership_fees mf
LEFT JOIN payments p ON p.membership_fee_id = mf.id
WHERE mf.created_at >= NOW() - INTERVAL '30 days'
GROUP BY mf.year
ORDER BY mf.year DESC;

-- Tasa de errores en generación
SELECT 
  DATE(timestamp) as date,
  COUNT(*) FILTER (WHERE level = 'ERROR' AND message LIKE '%fee generation%') as errors,
  COUNT(*) as total_logs
FROM logs
WHERE timestamp >= NOW() - INTERVAL '7 days'
GROUP BY DATE(timestamp);
```

#### Frontend (Google Analytics / Sentry)

```javascript
// Tracking de eventos clave
analytics.track('Fee Generation Started', {
  year: 2024,
  baseFeeAmount: 100,
});

analytics.track('Fee Generation Completed', {
  year: 2024,
  paymentsCreated: 150,
  duration: 2.5, // seconds
});

analytics.track('Fee Generation Failed', {
  year: 2024,
  error: 'Network timeout',
});
```

### Dashboard Sugerido (Grafana/Datadog)

**Panel 1: Fee Generation Overview**
- Total cuotas generadas (hoy/semana/mes)
- Promedio de pagos creados por generación
- Tasa de éxito vs fallos
- Tiempo promedio de generación

**Panel 2: Performance**
- Latencia p50/p95/p99 de mutation `generateAnnualFees`
- Throughput (requests/second)
- Error rate
- Memory/CPU usage

**Panel 3: Business Metrics**
- Recaudación esperada por año
- Número de miembros con cuotas pendientes
- Años con mayor morosidad
- Evolución de cuotas activas vs pagadas

---

## 📞 Comunicación del Deploy

### Template de Anuncio

```markdown
# 🚀 Deploy: Annual Fee Generation Feature

**Fecha**: 7 de noviembre de 2025  
**Versión**: v1.1.0  
**Responsable**: [Nombre del Tech Lead]

## 🎯 Qué se despliega

Nueva funcionalidad que permite generar automáticamente las cuotas anuales de membresía para todos los socios activos.

## ✨ Nuevas Características

- Generación masiva de cuotas por año
- Prevención de duplicados
- Cálculo automático de montos (individual vs familiar)
- Asociación de pagos a cuotas específicas
- Vista de cuotas pendientes por socio

## 🕐 Horario de Deploy

- **Inicio**: 08:00 AM CET
- **Ventana de mantenimiento**: 08:00 - 09:00 AM
- **Downtime esperado**: ~5 minutos

## 📋 Impacto en Usuarios

- **Durante el deploy**: Posible lentitud temporal (~5 min)
- **Después del deploy**: Nueva opción "Generar Cuotas" en el menú

## 🆘 Soporte

En caso de problemas:
- Canal Slack: #asam-support
- Email: tech@asam.com
- On-call: [Nombre] - [Teléfono]

## 📚 Documentación

- [User Guide](./USER_GUIDE.md)
- [API Documentation](./API_DOCS.md)
- [Troubleshooting](./TROUBLESHOOTING.md)
```

---

## 🎓 Guía de Deploy Paso a Paso (Checklist)

### Pre-Deploy (T-24h)

- [ ] Revisar y aprobar PR
- [ ] Ejecutar suite completa de tests
- [ ] Crear backup de base de datos
- [ ] Revisar plan de rollback
- [ ] Notificar al equipo sobre el deploy
- [ ] Preparar scripts de verificación

### Deploy Day (T-0)

#### Fase 1: Preparación (30 min antes)

- [ ] Verificar que no hay despliegues activos
- [ ] Confirmar que el backup está completo
- [ ] Poner sistema en modo de bajo mantenimiento (opcional)

#### Fase 2: Migraciones (T-0 + 0min)

- [ ] Ejecutar migraciones de base de datos
- [ ] Verificar que las migraciones fueron exitosas
- [ ] Hacer smoke test de queries SQL

#### Fase 3: Backend Deploy (T-0 + 10min)

- [ ] Build y push de imagen Docker
- [ ] Deploy a green environment
- [ ] Smoke tests en green
- [ ] Migrar 10% del tráfico
- [ ] Esperar 10 min y monitorear
- [ ] Migrar 50% del tráfico
- [ ] Esperar 10 min y monitorear
- [ ] Migrar 100% del tráfico

#### Fase 4: Frontend Deploy (T-0 + 40min)

- [ ] Build de producción
- [ ] Upload a CDN/Cloud Storage
- [ ] Invalidar caché
- [ ] Verificar que assets se cargan correctamente

#### Fase 5: Verificación (T-0 + 50min)

- [ ] Ejecutar script de verificación backend
- [ ] Ejecutar script de verificación frontend
- [ ] Prueba manual del flujo completo
- [ ] Verificar métricas en dashboard
- [ ] Revisar logs para errores

### Post-Deploy (T+1h)

- [ ] Monitorear métricas por 1 hora
- [ ] Confirmar que no hay errores críticos
- [ ] Actualizar documentación si es necesario
- [ ] Notificar al equipo que deploy fue exitoso
- [ ] Programar cleanup de recursos antiguos para +24h

### Post-Deploy (T+24h)

- [ ] Revisar métricas de las últimas 24h
- [ ] Limpiar revisions antiguas
- [ ] Cerrar tickets relacionados
- [ ] Post-mortem si hubo problemas

---

## 🔐 Seguridad

### Secrets Management

```bash
# Crear secret en Google Secret Manager
echo -n "super-secret-jwt-key" | gcloud secrets create jwt-secret --data-file=-

# Dar acceso al servicio de Cloud Run
gcloud secrets add-iam-policy-binding jwt-secret \
  --member="serviceAccount:asam-backend@asam-project.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# Referenciar en Cloud Run
gcloud run services update asam-backend \
  --update-secrets=JWT_SECRET=jwt-secret:latest
```

### Rate Limiting

```nginx
# nginx.conf para frontend
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

location /graphql {
    limit_req zone=api burst=20 nodelay;
    proxy_pass http://backend:8080;
}
```

---

**Última actualización**: 7 de noviembre de 2025  
**Estado**: 📦 Lista para Deploy
