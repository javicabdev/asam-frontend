# 🔍 Guía de Diagnóstico - Informe de Morosos Sin Datos

**Fecha**: 7 de noviembre de 2025
**Estado**: Backend implementado, Frontend completo
**Situación**: No se muestran morosos en el informe

---

## 🎯 Pasos de Diagnóstico

He añadido logs de debug temporales para diagnosticar el problema. Sigue estos pasos:

### 1. Abrir la Consola del Navegador

1. Abre tu navegador (Chrome, Firefox, Safari, etc.)
2. Ve a la URL del frontend: http://localhost:5174/
3. Inicia sesión como **administrador**
4. Presiona **F12** (o Cmd+Option+I en Mac) para abrir DevTools
5. Ve a la pestaña **Console**

### 2. Navegar a Informes

1. En el menú lateral, haz clic en **"Informes"**
2. La página de informes se cargará
3. Observa la consola del navegador

### 3. Revisar los Logs de Debug

En la consola deberías ver un log como este:

```javascript
useDelinquentReport - Debug: {
  loading: false,
  error: undefined,
  hasData: true,
  debtorsCount: 5,
  summary: { totalDebtors: 5, totalDebtAmount: 350, ... },
  filters: { sortBy: 'DAYS_DESC', minAmount: 0, debtorType: null }
}
```

### 4. Interpretar los Resultados

#### Escenario A: Error en la Query ❌
```javascript
{
  loading: false,
  error: "Cannot query field 'getDelinquentReport' on type 'Query'",
  hasData: false,
  debtorsCount: 0
}
```

**Problema**: El backend NO tiene implementada la query
**Solución**: Verificar que el schema GraphQL del backend incluya `getDelinquentReport`

---

#### Escenario B: Error de Permisos 🔒
```javascript
{
  loading: false,
  error: "Forbidden: Only admins can access this report",
  hasData: false,
  debtorsCount: 0
}
```

**Problema**: El usuario actual no tiene permisos de administrador
**Solución**:
1. Verifica que estás logueado como admin
2. Revisa el rol del usuario en la base de datos
3. Verifica que el backend valide correctamente los permisos

---

#### Escenario C: Sin Datos (Normal) ✅
```javascript
{
  loading: false,
  error: undefined,
  hasData: true,
  debtorsCount: 0,
  summary: {
    totalDebtors: 0,
    individualDebtors: 0,
    familyDebtors: 0,
    totalDebtAmount: 0,
    averageDaysOverdue: 0,
    averageDebtPerDebtor: 0
  }
}
```

**Problema**: No hay morosos en la base de datos
**Situación**: NORMAL - simplemente no hay nadie con deudas
**En pantalla verás**:
- 6 tarjetas de resumen con valores en 0
- Alert azul: "No hay morosos registrados en este momento"
- Sin tabla de datos

**Solución**: Crear datos de prueba en el backend
Ver sección "Crear Datos de Prueba" más abajo

---

#### Escenario D: Con Datos ✨
```javascript
{
  loading: false,
  error: undefined,
  hasData: true,
  debtorsCount: 5,
  summary: {
    totalDebtors: 5,
    totalDebtAmount: 350.00,
    averageDaysOverdue: 45
  }
}
```

**Estado**: TODO FUNCIONANDO PERFECTAMENTE
**En pantalla verás**:
- 6 tarjetas de resumen con valores reales
- Tabla con 5 filas de morosos
- Botones PDF/CSV habilitados
- Filtros funcionales

---

## 🗂️ Revisar también el Alert de Debug en la Página

En la parte superior de la página de Informes verás un Alert azul con información:

```
Debug - Estado: loading=false, hasData=true, hasError=false, debtorsCount=0
```

Esto te ayudará a identificar rápidamente el estado sin tener que abrir la consola.

---

## 🔧 Crear Datos de Prueba

Si el problema es **Escenario C (Sin Datos)**, necesitas crear datos de prueba en el backend.

### Opción 1: SQL Directo (Postgres)

Ejecuta este script en tu base de datos para crear un socio moroso de prueba:

```sql
-- 1. Crear un socio de prueba (si no existe)
INSERT INTO members (member_number, first_name, last_name, email, phone, status)
VALUES ('TEST001', 'Juan', 'Moroso', 'juan.test@example.com', '+34600000001', 'ACTIVE')
ON CONFLICT DO NOTHING;

-- 2. Obtener el ID del socio
WITH test_member AS (
  SELECT id FROM members WHERE member_number = 'TEST001'
)

-- 3. Crear un pago pendiente con 90 días de atraso
INSERT INTO payments (member_id, amount, due_date, status, created_at, notes)
SELECT
  id,
  50.00,
  NOW() - INTERVAL '90 days',  -- Vencido hace 90 días
  'PENDING',
  NOW() - INTERVAL '120 days', -- Creado hace 120 días
  'Cuota de prueba - moroso'
FROM test_member;

-- 4. Crear otro pago pendiente con 30 días de atraso
INSERT INTO payments (member_id, amount, due_date, status, created_at, notes)
SELECT
  id,
  50.00,
  NOW() - INTERVAL '30 days',  -- Vencido hace 30 días
  'PENDING',
  NOW() - INTERVAL '60 days',  -- Creado hace 60 días
  'Cuota de prueba - moroso 2'
FROM test_member;
```

Luego **recarga la página de Informes** (F5) y deberías ver al menos 1 moroso.

### Opción 2: GraphQL Mutation (si existe)

Si el backend tiene una mutation para crear pagos:

```graphql
mutation {
  createPayment(input: {
    memberId: "MEMBER_ID_AQUI",
    amount: 50.00,
    dueDate: "2025-08-01",  # Fecha pasada
    status: PENDING,
    notes: "Pago de prueba"
  }) {
    id
    status
  }
}
```

### Opción 3: Interfaz de Pagos

1. Ve a la sección **Pagos** en la aplicación
2. Crea un nuevo pago para un socio
3. Asigna una **fecha de vencimiento en el pasado**
4. Marca el estado como **PENDING** o **OVERDUE**
5. Guarda el pago
6. Regresa a **Informes** y recarga

---

## 🌐 Verificar Network Tab

Además de la consola, revisa la pestaña **Network** en DevTools:

1. Ve a la pestaña **Network** (Red)
2. Filtra por **GraphQL** o **XHR**
3. Busca la request `getDelinquentReport`
4. Haz clic en ella
5. Ve a la pestaña **Response**

Deberías ver algo como:

```json
{
  "data": {
    "getDelinquentReport": {
      "debtors": [],
      "summary": {
        "totalDebtors": 0,
        "totalDebtAmount": 0,
        ...
      },
      "generatedAt": "2025-11-07T12:00:00Z"
    }
  }
}
```

Si ves un **error en lugar de data**, ese es el problema a resolver.

---

## 📋 Checklist de Verificación

Marca los items conforme los verificas:

### Backend:
- [ ] El servidor de backend está corriendo
- [ ] El schema GraphQL incluye `getDelinquentReport`
- [ ] El resolver está implementado y responde
- [ ] La base de datos tiene la estructura correcta
- [ ] Existe al menos un pago vencido en la BD

### Frontend:
- [ ] El servidor de desarrollo está corriendo (http://localhost:5174)
- [ ] Estás logueado como usuario ADMIN
- [ ] La página /reports carga sin errores 500
- [ ] La consola del navegador muestra los logs de debug
- [ ] No hay errores de TypeScript en la consola

### Conectividad:
- [ ] El frontend puede conectarse al backend
- [ ] La URL del backend en `.env` es correcta
- [ ] No hay errores de CORS
- [ ] Apollo Client está configurado correctamente

---

## 🚨 Errores Comunes y Soluciones

### 1. "Network request failed"
**Causa**: El backend no está corriendo o la URL es incorrecta
**Solución**:
```bash
# Verificar que el backend está corriendo
curl http://localhost:4000/graphql

# Verificar .env del frontend
cat .env | grep VITE_GRAPHQL_URL
```

### 2. "Cannot query field 'getDelinquentReport'"
**Causa**: El schema del backend no tiene la query
**Solución**: Verificar con el equipo de backend que implementaron la query completa

### 3. "Forbidden" o "Unauthorized"
**Causa**: Permisos insuficientes
**Solución**:
- Verificar rol del usuario en la BD
- Verificar que el resolver valida permisos correctamente

### 4. "undefined is not an object"
**Causa**: Error en el componente al acceder a propiedades
**Solución**: Revisar la consola para el stack trace completo

---

## 📊 Información de los Logs

Los logs de debug muestran:

| Campo | Descripción |
|-------|-------------|
| `loading` | `true` si está cargando, `false` cuando terminó |
| `error` | Mensaje de error si hubo alguno, `undefined` si todo OK |
| `hasData` | `true` si la query devolvió datos, `false` si no |
| `debtorsCount` | Número de morosos encontrados |
| `summary` | Objeto con estadísticas (totalDebtors, totalDebtAmount, etc.) |
| `filters` | Filtros aplicados (sortBy, minAmount, debtorType) |

---

## 🔄 Limpiar Logs de Debug

Una vez diagnosticado el problema, recuerda:

1. Eliminar el Alert de debug en `ReportsPage.tsx` (líneas 69-76)
2. Eliminar el `console.log` en `useDelinquentReport.ts` (líneas 21-29)
3. Hacer commit de los cambios

---

## 📞 Siguiente Paso

Después de revisar los logs, reporta:

1. **Qué escenario tienes** (A, B, C o D)
2. **El contenido exacto de los logs**
3. **El mensaje que ves en pantalla**
4. **Screenshot** si es posible

Con esa información podremos identificar exactamente qué está pasando y solucionarlo.

---

**Creado**: 7 de noviembre de 2025
**Modificado**: Tras añadir logs de debug
