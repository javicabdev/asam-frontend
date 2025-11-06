# 🔴 REQUISITOS FRONTEND - INFORME DE MOROSOS

**Fecha de creación**: 6 de noviembre de 2025  
**Prioridad**: ALTA  
**Tiempo estimado**: 1 - 1.5 días  
**Responsable**: Equipo Frontend  
**Prerequisito**: Backend debe completar query GraphQL `getDelinquentReport`

---

## 📋 CONTEXTO

Implementar una página de **Informe de Morosos** que permita a los administradores:
- Ver lista de socios/familias con pagos pendientes
- Filtrar por diferentes criterios
- Ordenar por importe, antigüedad o nombre
- Exportar a PDF y CSV
- Ver estadísticas generales de morosidad

**Importante**: 
- ✅ **Todos los textos deben estar internacionalizados** (i18n)
- ✅ Soportar 3 idiomas: Español, Francés, Wolof
- ✅ Solo accesible para usuarios con rol **admin**
- ✅ Todos los pagos son en EFECTIVO (no mostrar método de pago)

---

## 🎯 OBJETIVO

Crear una interfaz completa para el informe de morosos que consuma la query GraphQL del backend y presente la información de forma clara, con opciones de filtrado y exportación.

---

## 🏗️ ESTRUCTURA DE ARCHIVOS

```
src/
├── features/
│   └── reports/
│       ├── components/
│       │   ├── DelinquentTable.tsx          # Tabla principal con DataGrid
│       │   ├── DelinquentFilters.tsx        # Filtros laterales
│       │   ├── DelinquentSummaryCards.tsx   # Cards con estadísticas
│       │   ├── DelinquentExportButtons.tsx  # Botones PDF/CSV
│       │   ├── DebtorTypeChip.tsx           # Chip visual (Individual/Familia)
│       │   └── DebtDetailsDialog.tsx        # Modal con detalles de deuda
│       ├── hooks/
│       │   ├── useDelinquentReport.ts       # Query GraphQL principal
│       │   └── useExportDelinquent.ts       # Lógica exportación
│       ├── utils/
│       │   ├── delinquentExport.ts          # Generación PDF/CSV
│       │   └── delinquentFormatters.ts      # Formateo de datos
│       └── types.ts                          # Tipos TypeScript
├── pages/
│   └── ReportsPage.tsx                       # Página principal (rediseñar)
├── lib/
│   └── i18n/
│       └── locales/
│           ├── es/
│           │   └── reports.json             # Traducciones español
│           ├── fr/
│           │   └── reports.json             # Traducciones francés
│           └── wo/
│               └── reports.json             # Traducciones wolof
└── graphql/
    └── operations/
        └── reports.graphql                   # Queries GraphQL
```

---

## 📊 TIPOS TYPESCRIPT

**Archivo**: `src/features/reports/types.ts`

```typescript
/**
 * Tipos para el módulo de Informes de Morosos
 */

export enum DebtorType {
  INDIVIDUAL = 'INDIVIDUAL',
  FAMILY = 'FAMILY',
}

export enum SortBy {
  AMOUNT_DESC = 'AMOUNT_DESC',
  AMOUNT_ASC = 'AMOUNT_ASC',
  DAYS_DESC = 'DAYS_DESC',
  DAYS_ASC = 'DAYS_ASC',
  NAME_ASC = 'NAME_ASC',
}

export interface DelinquentReportInput {
  cutoffDate?: string // ISO 8601 date
  minAmount?: number
  debtorType?: DebtorType | null
  sortBy?: SortBy
}

export interface DebtorMemberInfo {
  id: string
  memberNumber: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  status: string
}

export interface DebtorFamilyInfo {
  id: string
  familyName: string
  primaryMember: DebtorMemberInfo
  totalMembers: number
}

export interface PendingPayment {
  id: string
  amount: number
  createdAt: string // ISO 8601 date
  daysOverdue: number
  notes?: string
}

export interface Debtor {
  memberId?: string
  familyId?: string
  type: DebtorType
  member?: DebtorMemberInfo
  family?: DebtorFamilyInfo
  pendingPayments: PendingPayment[]
  totalDebt: number
  oldestDebtDays: number
  oldestDebtDate: string // ISO 8601 date
  lastPaymentDate?: string // ISO 8601 date
  lastPaymentAmount?: number
}

export interface DelinquentSummary {
  totalDebtors: number
  individualDebtors: number
  familyDebtors: number
  totalDebtAmount: number
  averageDaysOverdue: number
  averageDebtPerDebtor: number
}

export interface DelinquentReportResponse {
  debtors: Debtor[]
  summary: DelinquentSummary
  generatedAt: string // ISO 8601 date
}
```

---

## 🔌 INTEGRACIÓN GRAPHQL

**Archivo**: `src/graphql/operations/reports.graphql`

```graphql
query GetDelinquentReport($input: DelinquentReportInput) {
  getDelinquentReport(input: $input) {
    debtors {
      memberId
      familyId
      type
      member {
        id
        memberNumber
        firstName
        lastName
        email
        phone
        status
      }
      family {
        id
        familyName
        primaryMember {
          id
          memberNumber
          firstName
          lastName
          email
          phone
        }
        totalMembers
      }
      pendingPayments {
        id
        amount
        createdAt
        daysOverdue
        notes
      }
      totalDebt
      oldestDebtDays
      oldestDebtDate
      lastPaymentDate
      lastPaymentAmount
    }
    summary {
      totalDebtors
      individualDebtors
      familyDebtors
      totalDebtAmount
      averageDaysOverdue
      averageDebtPerDebtor
    }
    generatedAt
  }
}
```

---

## 🎨 HOOK PRINCIPAL: useDelinquentReport

**Archivo**: `src/features/reports/hooks/useDelinquentReport.ts`

```typescript
import { useQuery } from '@apollo/client'
import { useState } from 'react'
import { GET_DELINQUENT_REPORT } from '@/graphql/operations/reports.graphql'
import type { 
  DelinquentReportInput, 
  DelinquentReportResponse 
} from '../types'

export function useDelinquentReport() {
  const [filters, setFilters] = useState<DelinquentReportInput>({
    sortBy: 'DAYS_DESC', // Más antiguos primero por defecto
    minAmount: 0,
    debtorType: null,
  })

  const { data, loading, error, refetch } = useQuery<{
    getDelinquentReport: DelinquentReportResponse
  }>(GET_DELINQUENT_REPORT, {
    variables: { input: filters },
    fetchPolicy: 'network-only', // Siempre traer datos frescos
  })

  const updateFilters = (newFilters: Partial<DelinquentReportInput>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const resetFilters = () => {
    setFilters({
      sortBy: 'DAYS_DESC',
      minAmount: 0,
      debtorType: null,
    })
  }

  return {
    data: data?.getDelinquentReport,
    loading,
    error,
    filters,
    updateFilters,
    resetFilters,
    refetch,
  }
}
```

---

## 🌐 INTERNACIONALIZACIÓN (i18n)

### Archivo: `src/lib/i18n/locales/es/reports.json`

```json
{
  "delinquent": {
    "title": "Informe de Morosos",
    "subtitle": "Lista de socios y familias con pagos pendientes",
    "generateReport": "Generar Informe",
    "exportPDF": "Exportar PDF",
    "exportCSV": "Exportar CSV",
    "generatedAt": "Generado el",
    "noData": "No hay socios morosos en este momento",
    "noDataDescription": "Todos los pagos están al día. ¡Excelente trabajo!",
    
    "filters": {
      "title": "Filtros",
      "cutoffDate": "Fecha de corte",
      "minAmount": "Importe mínimo",
      "debtorType": "Tipo de deudor",
      "sortBy": "Ordenar por",
      "reset": "Restablecer filtros",
      "all": "Todos",
      "individual": "Socios individuales",
      "family": "Familias"
    },
    
    "sortOptions": {
      "amountDesc": "Mayor deuda primero",
      "amountAsc": "Menor deuda primero",
      "daysDesc": "Más días de atraso",
      "daysAsc": "Menos días de atraso",
      "nameAsc": "Nombre (A-Z)"
    },
    
    "table": {
      "debtor": "Deudor",
      "type": "Tipo",
      "memberNumber": "Nº Socio",
      "contact": "Contacto",
      "totalDebt": "Deuda Total",
      "oldestDebt": "Atraso",
      "daysOverdue": "{{count}} días",
      "daysOverdue_one": "{{count}} día",
      "lastPayment": "Último Pago",
      "actions": "Acciones",
      "viewDetails": "Ver Detalles",
      "sendReminder": "Enviar Recordatorio",
      "noPendingPayments": "Sin pagos pendientes"
    },
    
    "debtorType": {
      "individual": "Individual",
      "family": "Familia"
    },
    
    "summary": {
      "title": "Resumen",
      "totalDebtors": "Total Morosos",
      "individualDebtors": "Socios Individuales",
      "familyDebtors": "Familias",
      "totalDebt": "Deuda Total",
      "avgDaysOverdue": "Promedio Días Atraso",
      "avgDebtPerDebtor": "Deuda Promedio"
    },
    
    "details": {
      "title": "Detalles de Deuda",
      "debtorInfo": "Información del Deudor",
      "memberNumber": "Número de Socio",
      "name": "Nombre",
      "email": "Email",
      "phone": "Teléfono",
      "familyMembers": "Miembros de Familia",
      "pendingPayments": "Pagos Pendientes",
      "paymentDate": "Fecha del Pago",
      "amount": "Importe",
      "daysOverdue": "Días de Atraso",
      "notes": "Notas",
      "lastPaymentInfo": "Información del Último Pago",
      "lastPaymentDate": "Fecha",
      "lastPaymentAmount": "Importe",
      "noLastPayment": "Sin pagos previos registrados",
      "close": "Cerrar"
    },
    
    "export": {
      "pdfFilename": "informe-morosos-{{date}}.pdf",
      "csvFilename": "morosos-{{date}}.csv",
      "success": "Informe exportado correctamente",
      "error": "Error al exportar el informe"
    },
    
    "errors": {
      "loadFailed": "Error al cargar el informe de morosos",
      "unauthorized": "No tienes permisos para ver este informe",
      "retry": "Reintentar"
    }
  }
}
```

### Archivo: `src/lib/i18n/locales/fr/reports.json`

```json
{
  "delinquent": {
    "title": "Rapport des Débiteurs",
    "subtitle": "Liste des membres et familles avec paiements en retard",
    "generateReport": "Générer le Rapport",
    "exportPDF": "Exporter PDF",
    "exportCSV": "Exporter CSV",
    "generatedAt": "Généré le",
    "noData": "Aucun débiteur actuellement",
    "noDataDescription": "Tous les paiements sont à jour. Excellent travail!",
    
    "filters": {
      "title": "Filtres",
      "cutoffDate": "Date de référence",
      "minAmount": "Montant minimum",
      "debtorType": "Type de débiteur",
      "sortBy": "Trier par",
      "reset": "Réinitialiser les filtres",
      "all": "Tous",
      "individual": "Membres individuels",
      "family": "Familles"
    },
    
    "sortOptions": {
      "amountDesc": "Plus grande dette d'abord",
      "amountAsc": "Plus petite dette d'abord",
      "daysDesc": "Plus de jours de retard",
      "daysAsc": "Moins de jours de retard",
      "nameAsc": "Nom (A-Z)"
    },
    
    "table": {
      "debtor": "Débiteur",
      "type": "Type",
      "memberNumber": "Nº Membre",
      "contact": "Contact",
      "totalDebt": "Dette Totale",
      "oldestDebt": "Retard",
      "daysOverdue": "{{count}} jours",
      "daysOverdue_one": "{{count}} jour",
      "lastPayment": "Dernier Paiement",
      "actions": "Actions",
      "viewDetails": "Voir Détails",
      "sendReminder": "Envoyer Rappel",
      "noPendingPayments": "Aucun paiement en attente"
    },
    
    "debtorType": {
      "individual": "Individuel",
      "family": "Famille"
    },
    
    "summary": {
      "title": "Résumé",
      "totalDebtors": "Total Débiteurs",
      "individualDebtors": "Membres Individuels",
      "familyDebtors": "Familles",
      "totalDebt": "Dette Totale",
      "avgDaysOverdue": "Moyenne Jours de Retard",
      "avgDebtPerDebtor": "Dette Moyenne"
    },
    
    "details": {
      "title": "Détails de la Dette",
      "debtorInfo": "Information du Débiteur",
      "memberNumber": "Numéro de Membre",
      "name": "Nom",
      "email": "Email",
      "phone": "Téléphone",
      "familyMembers": "Membres de la Famille",
      "pendingPayments": "Paiements en Attente",
      "paymentDate": "Date du Paiement",
      "amount": "Montant",
      "daysOverdue": "Jours de Retard",
      "notes": "Notes",
      "lastPaymentInfo": "Information du Dernier Paiement",
      "lastPaymentDate": "Date",
      "lastPaymentAmount": "Montant",
      "noLastPayment": "Aucun paiement antérieur enregistré",
      "close": "Fermer"
    },
    
    "export": {
      "pdfFilename": "rapport-debiteurs-{{date}}.pdf",
      "csvFilename": "debiteurs-{{date}}.csv",
      "success": "Rapport exporté avec succès",
      "error": "Erreur lors de l'exportation du rapport"
    },
    
    "errors": {
      "loadFailed": "Erreur lors du chargement du rapport des débiteurs",
      "unauthorized": "Vous n'avez pas les permissions pour voir ce rapport",
      "retry": "Réessayer"
    }
  }
}
```

### Archivo: `src/lib/i18n/locales/wo/reports.json`

```json
{
  "delinquent": {
    "title": "Rapport yu njëkk xaalis",
    "subtitle": "Limu mbokk yi ak mbootaay yi ànd na xaalis bu tùn",
    "generateReport": "Sos Rapport bi",
    "exportPDF": "Jox ci PDF",
    "exportCSV": "Jox ci CSV",
    "generatedAt": "Sosoon",
    "noData": "Amul njëkk xaalis ci wakhtoo wii",
    "noDataDescription": "Yépp fay xaalis yi. Liggéey bu baax!",
    
    "filters": {
      "title": "Filtre yi",
      "cutoffDate": "Bësu waxtu",
      "minAmount": "Xaalis bu ndaw",
      "debtorType": "Xeetu njëkk xaalis",
      "sortBy": "Reer ci",
      "reset": "Delloo filtre yi",
      "all": "Yépp",
      "individual": "Mbokk yi ñeneen",
      "family": "Mbootaay"
    },
    
    "sortOptions": {
      "amountDesc": "Xaalis bu bari bi ñàkk",
      "amountAsc": "Xaalis bu ndaw bi ñàkk",
      "daysDesc": "Fan bu bari ci wajur",
      "daysAsc": "Fan bu ndaw ci wajur",
      "nameAsc": "Tur (A-Z)"
    },
    
    "table": {
      "debtor": "Njëkk xaalis",
      "type": "Xeet",
      "memberNumber": "Limu mbokk",
      "contact": "Jokkale",
      "totalDebt": "Yépp ci xaalis",
      "oldestDebt": "Wajur",
      "daysOverdue": "{{count}} fan",
      "daysOverdue_one": "{{count}} fan",
      "lastPayment": "Fay xaalis bu mujj",
      "actions": "Jëf",
      "viewDetails": "Xool li ci ànd",
      "sendReminder": "Yónnee wakh",
      "noPendingPayments": "Amul fay xaalis bu tùn"
    },
    
    "debtorType": {
      "individual": "Kenn",
      "family": "Mbootaay"
    },
    
    "summary": {
      "title": "Résumé",
      "totalDebtors": "Yépp njëkk xaalis",
      "individualDebtors": "Mbokk yi ñeneen",
      "familyDebtors": "Mbootaay yi",
      "totalDebt": "Yépp ci xaalis",
      "avgDaysOverdue": "Njëkkaleen fan yu wajur",
      "avgDebtPerDebtor": "Xaalis wu njëkkaleen"
    },
    
    "details": {
      "title": "Li ci ànd ci xaalis",
      "debtorInfo": "Xëtu njëkk xaalis bi",
      "memberNumber": "Limu mbokk",
      "name": "Tur",
      "email": "Email",
      "phone": "Telefon",
      "familyMembers": "Mbootaay bi",
      "pendingPayments": "Fay xaalis yi tùn",
      "paymentDate": "Bësu fay xaalis",
      "amount": "Xaalis",
      "daysOverdue": "Fan yu wajur",
      "notes": "Bindu",
      "lastPaymentInfo": "Li ci ànd ci fay xaalis bu mujj",
      "lastPaymentDate": "Bës",
      "lastPaymentAmount": "Xaalis",
      "noLastPayment": "Amul fay xaalis bu jiitu",
      "close": "Téy"
    },
    
    "export": {
      "pdfFilename": "rapport-njekk-xaalis-{{date}}.pdf",
      "csvFilename": "njekk-xaalis-{{date}}.csv",
      "success": "Rapport bi joxe na",
      "error": "Njumte ci joxe rapport bi"
    },
    
    "errors": {
      "loadFailed": "Njumte ci yeb rapport bi",
      "unauthorized": "Amul seen ay baraama ngir xool rapport bii",
      "retry": "Jéema"
    }
  }
}
```

---

## 🎨 COMPONENTES PRINCIPALES

### 1. ReportsPage.tsx (Rediseñado)

**Archivo**: `src/pages/ReportsPage.tsx`

```typescript
import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  Container,
  Box,
  Typography,
  Alert,
  AlertTitle,
  CircularProgress,
  Paper,
  Grid,
} from '@mui/material'
import { Warning } from '@mui/icons-material'
import {
  DelinquentTable,
  DelinquentFilters,
  DelinquentSummaryCards,
  DelinquentExportButtons,
} from '../features/reports'
import { useDelinquentReport } from '../features/reports/hooks/useDelinquentReport'

export default function ReportsPage() {
  const { t } = useTranslation('reports')
  const { data, loading, error, filters, updateFilters, resetFilters, refetch } =
    useDelinquentReport()

  if (loading && !data) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">
          <AlertTitle>{t('delinquent.errors.loadFailed')}</AlertTitle>
          {error.message}
          <Box mt={2}>
            <Button variant="outlined" size="small" onClick={() => void refetch()}>
              {t('delinquent.errors.retry')}
            </Button>
          </Box>
        </Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('delinquent.title')}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {t('delinquent.subtitle')}
        </Typography>
        {data && (
          <Typography variant="caption" color="textSecondary" display="block" mt={1}>
            {t('delinquent.generatedAt')}: {new Date(data.generatedAt).toLocaleString()}
          </Typography>
        )}
      </Box>

      {/* Summary Cards */}
      {data && (
        <Box mb={4}>
          <DelinquentSummaryCards summary={data.summary} />
        </Box>
      )}

      {/* Export Buttons */}
      {data && data.debtors.length > 0 && (
        <Box mb={3} display="flex" justifyContent="flex-end" gap={2}>
          <DelinquentExportButtons data={data} />
        </Box>
      )}

      {/* Filters and Table */}
      <Grid container spacing={3}>
        {/* Filters */}
        <Grid item xs={12} md={3}>
          <DelinquentFilters
            filters={filters}
            onFilterChange={updateFilters}
            onReset={resetFilters}
          />
        </Grid>

        {/* Table */}
        <Grid item xs={12} md={9}>
          <Paper elevation={0}>
            {data && data.debtors.length > 0 ? (
              <DelinquentTable debtors={data.debtors} loading={loading} />
            ) : (
              <Box p={4} textAlign="center">
                <Warning sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  {t('delinquent.noData')}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {t('delinquent.noDataDescription')}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}
```

---

### 2. DelinquentTable.tsx

**Archivo**: `src/features/reports/components/DelinquentTable.tsx`

```typescript
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { Box, Chip, IconButton, Tooltip } from '@mui/material'
import { Info, Email } from '@mui/icons-material'
import type { Debtor } from '../types'
import { DebtorTypeChip } from './DebtorTypeChip'
import { DebtDetailsDialog } from './DebtDetailsDialog'
import { formatCurrency, formatDate } from '../utils/delinquentFormatters'

interface DelinquentTableProps {
  debtors: Debtor[]
  loading?: boolean
}

export function DelinquentTable({ debtors, loading = false }: DelinquentTableProps) {
  const { t } = useTranslation('reports')
  const [selectedDebtor, setSelectedDebtor] = useState<Debtor | null>(null)

  const getDebtorName = (debtor: Debtor): string => {
    if (debtor.type === 'INDIVIDUAL' && debtor.member) {
      return `${debtor.member.firstName} ${debtor.member.lastName}`
    } else if (debtor.type === 'FAMILY' && debtor.family) {
      return debtor.family.familyName
    }
    return '-'
  }

  const getDebtorContact = (debtor: Debtor): string => {
    if (debtor.type === 'INDIVIDUAL' && debtor.member) {
      return debtor.member.email || debtor.member.phone || '-'
    } else if (debtor.type === 'FAMILY' && debtor.family) {
      return debtor.family.primaryMember.email || debtor.family.primaryMember.phone || '-'
    }
    return '-'
  }

  const columns: GridColDef[] = [
    {
      field: 'type',
      headerName: t('delinquent.table.type'),
      width: 120,
      renderCell: (params: GridRenderCellParams<Debtor>) => (
        <DebtorTypeChip type={params.row.type} />
      ),
    },
    {
      field: 'debtor',
      headerName: t('delinquent.table.debtor'),
      flex: 1,
      minWidth: 200,
      valueGetter: (params) => getDebtorName(params.row),
    },
    {
      field: 'memberNumber',
      headerName: t('delinquent.table.memberNumber'),
      width: 120,
      valueGetter: (params) => {
        if (params.row.type === 'INDIVIDUAL' && params.row.member) {
          return params.row.member.memberNumber
        } else if (params.row.type === 'FAMILY' && params.row.family) {
          return params.row.family.primaryMember.memberNumber
        }
        return '-'
      },
    },
    {
      field: 'contact',
      headerName: t('delinquent.table.contact'),
      flex: 1,
      minWidth: 180,
      valueGetter: (params) => getDebtorContact(params.row),
    },
    {
      field: 'totalDebt',
      headerName: t('delinquent.table.totalDebt'),
      width: 130,
      type: 'number',
      valueGetter: (params) => params.row.totalDebt,
      renderCell: (params: GridRenderCellParams<Debtor>) => (
        <Box fontWeight="bold" color="error.main">
          {formatCurrency(params.row.totalDebt)}
        </Box>
      ),
    },
    {
      field: 'oldestDebtDays',
      headerName: t('delinquent.table.oldestDebt'),
      width: 120,
      type: 'number',
      renderCell: (params: GridRenderCellParams<Debtor>) => (
        <Chip
          label={t('delinquent.table.daysOverdue', { count: params.row.oldestDebtDays })}
          color={params.row.oldestDebtDays > 60 ? 'error' : 'warning'}
          size="small"
        />
      ),
    },
    {
      field: 'lastPaymentDate',
      headerName: t('delinquent.table.lastPayment'),
      width: 140,
      valueGetter: (params) =>
        params.row.lastPaymentDate ? formatDate(params.row.lastPaymentDate) : '-',
    },
    {
      field: 'actions',
      headerName: t('delinquent.table.actions'),
      width: 120,
      sortable: false,
      renderCell: (params: GridRenderCellParams<Debtor>) => (
        <Box display="flex" gap={1}>
          <Tooltip title={t('delinquent.table.viewDetails')}>
            <IconButton size="small" onClick={() => setSelectedDebtor(params.row)}>
              <Info fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('delinquent.table.sendReminder')}>
            <IconButton
              size="small"
              onClick={() => handleSendReminder(params.row)}
              disabled
            >
              <Email fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ]

  const handleSendReminder = (debtor: Debtor) => {
    // TODO: Implementar envío de recordatorio por email
    console.log('Send reminder to:', debtor)
  }

  return (
    <>
      <DataGrid
        rows={debtors}
        columns={columns}
        getRowId={(row) => row.memberId || row.familyId || Math.random().toString()}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 25 },
          },
        }}
        pageSizeOptions={[10, 25, 50, 100]}
        loading={loading}
        disableRowSelectionOnClick
        autoHeight
        sx={{
          '& .MuiDataGrid-row:hover': {
            backgroundColor: 'action.hover',
          },
        }}
      />

      {/* Modal de detalles */}
      {selectedDebtor && (
        <DebtDetailsDialog
          debtor={selectedDebtor}
          open={!!selectedDebtor}
          onClose={() => setSelectedDebtor(null)}
        />
      )}
    </>
  )
}
```

---

### 3. DelinquentSummaryCards.tsx

**Archivo**: `src/features/reports/components/DelinquentSummaryCards.tsx`

```typescript
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Grid, Paper, Box, Typography } from '@mui/material'
import {
  People,
  Person,
  Group,
  Euro,
  Schedule,
  TrendingDown,
} from '@mui/icons-material'
import type { DelinquentSummary } from '../types'
import { formatCurrency } from '../utils/delinquentFormatters'

interface DelinquentSummaryCardsProps {
  summary: DelinquentSummary
}

export function DelinquentSummaryCards({ summary }: DelinquentSummaryCardsProps) {
  const { t } = useTranslation('reports')

  const cards = [
    {
      label: t('delinquent.summary.totalDebtors'),
      value: summary.totalDebtors,
      icon: <People fontSize="large" />,
      color: '#f44336',
    },
    {
      label: t('delinquent.summary.individualDebtors'),
      value: summary.individualDebtors,
      icon: <Person fontSize="large" />,
      color: '#ff9800',
    },
    {
      label: t('delinquent.summary.familyDebtors'),
      value: summary.familyDebtors,
      icon: <Group fontSize="large" />,
      color: '#ff9800',
    },
    {
      label: t('delinquent.summary.totalDebt'),
      value: formatCurrency(summary.totalDebtAmount),
      icon: <Euro fontSize="large" />,
      color: '#d32f2f',
    },
    {
      label: t('delinquent.summary.avgDaysOverdue'),
      value: `${summary.averageDaysOverdue} ${t('delinquent.table.daysOverdue', { count: summary.averageDaysOverdue })}`,
      icon: <Schedule fontSize="large" />,
      color: '#e64a19',
    },
    {
      label: t('delinquent.summary.avgDebtPerDebtor'),
      value: formatCurrency(summary.averageDebtPerDebtor),
      icon: <TrendingDown fontSize="large" />,
      color: '#c62828',
    },
  ]

  return (
    <Grid container spacing={3}>
      {cards.map((card, index) => (
        <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              height: '100%',
              borderLeft: 4,
              borderColor: card.color,
            }}
          >
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  {card.label}
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {card.value}
                </Typography>
              </Box>
              <Box color={card.color} sx={{ opacity: 0.3 }}>
                {card.icon}
              </Box>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  )
}
```

---

### 4. DelinquentFilters.tsx

**Archivo**: `src/features/reports/components/DelinquentFilters.tsx`

```typescript
import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  Paper,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import { FilterList, Refresh } from '@mui/icons-material'
import type { DelinquentReportInput, DebtorType, SortBy } from '../types'

interface DelinquentFiltersProps {
  filters: DelinquentReportInput
  onFilterChange: (filters: Partial<DelinquentReportInput>) => void
  onReset: () => void
}

export function DelinquentFilters({
  filters,
  onFilterChange,
  onReset,
}: DelinquentFiltersProps) {
  const { t } = useTranslation('reports')

  return (
    <Paper elevation={0} sx={{ p: 2 }}>
      <Box display="flex" alignItems="center" gap={1} mb={3}>
        <FilterList />
        <Typography variant="h6">{t('delinquent.filters.title')}</Typography>
      </Box>

      <Box display="flex" flexDirection="column" gap={2}>
        {/* Fecha de corte */}
        <DatePicker
          label={t('delinquent.filters.cutoffDate')}
          value={filters.cutoffDate ? new Date(filters.cutoffDate) : null}
          onChange={(date) =>
            onFilterChange({ cutoffDate: date?.toISOString() || undefined })
          }
          slotProps={{
            textField: {
              size: 'small',
              fullWidth: true,
            },
          }}
        />

        {/* Importe mínimo */}
        <TextField
          label={t('delinquent.filters.minAmount')}
          type="number"
          value={filters.minAmount || 0}
          onChange={(e) => onFilterChange({ minAmount: Number(e.target.value) })}
          size="small"
          fullWidth
          InputProps={{
            endAdornment: '€',
          }}
        />

        {/* Tipo de deudor */}
        <FormControl size="small" fullWidth>
          <InputLabel>{t('delinquent.filters.debtorType')}</InputLabel>
          <Select
            value={filters.debtorType || 'all'}
            onChange={(e) =>
              onFilterChange({
                debtorType: e.target.value === 'all' ? null : (e.target.value as DebtorType),
              })
            }
            label={t('delinquent.filters.debtorType')}
          >
            <MenuItem value="all">{t('delinquent.filters.all')}</MenuItem>
            <MenuItem value="INDIVIDUAL">{t('delinquent.filters.individual')}</MenuItem>
            <MenuItem value="FAMILY">{t('delinquent.filters.family')}</MenuItem>
          </Select>
        </FormControl>

        {/* Ordenar por */}
        <FormControl size="small" fullWidth>
          <InputLabel>{t('delinquent.filters.sortBy')}</InputLabel>
          <Select
            value={filters.sortBy || 'DAYS_DESC'}
            onChange={(e) => onFilterChange({ sortBy: e.target.value as SortBy })}
            label={t('delinquent.filters.sortBy')}
          >
            <MenuItem value="DAYS_DESC">{t('delinquent.sortOptions.daysDesc')}</MenuItem>
            <MenuItem value="DAYS_ASC">{t('delinquent.sortOptions.daysAsc')}</MenuItem>
            <MenuItem value="AMOUNT_DESC">{t('delinquent.sortOptions.amountDesc')}</MenuItem>
            <MenuItem value="AMOUNT_ASC">{t('delinquent.sortOptions.amountAsc')}</MenuItem>
            <MenuItem value="NAME_ASC">{t('delinquent.sortOptions.nameAsc')}</MenuItem>
          </Select>
        </FormControl>

        {/* Botón resetear */}
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={onReset}
          size="small"
          fullWidth
        >
          {t('delinquent.filters.reset')}
        </Button>
      </Box>
    </Paper>
  )
}
```

---

## 📤 EXPORTACIÓN (PDF/CSV)

### Archivo: `src/features/reports/utils/delinquentExport.ts`

```typescript
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { DelinquentReportResponse, Debtor } from '../types'
import { formatCurrency, formatDate } from './delinquentFormatters'

/**
 * Exporta el informe a PDF
 */
export function exportToPDF(data: DelinquentReportResponse, t: any) {
  const doc = new jsPDF()

  // Título
  doc.setFontSize(18)
  doc.text(t('delinquent.title'), 14, 20)

  // Fecha de generación
  doc.setFontSize(10)
  doc.text(
    `${t('delinquent.generatedAt')}: ${formatDate(data.generatedAt)}`,
    14,
    28
  )

  // Resumen
  doc.setFontSize(12)
  doc.text(t('delinquent.summary.title'), 14, 38)
  doc.setFontSize(10)
  doc.text(`${t('delinquent.summary.totalDebtors')}: ${data.summary.totalDebtors}`, 14, 45)
  doc.text(
    `${t('delinquent.summary.totalDebt')}: ${formatCurrency(data.summary.totalDebtAmount)}`,
    14,
    52
  )
  doc.text(
    `${t('delinquent.summary.avgDaysOverdue')}: ${data.summary.averageDaysOverdue} ${t('delinquent.table.daysOverdue', { count: data.summary.averageDaysOverdue })}`,
    14,
    59
  )

  // Tabla de deudores
  const tableData = data.debtors.map((debtor) => [
    getDebtorName(debtor, t),
    t(`delinquent.debtorType.${debtor.type.toLowerCase()}`),
    formatCurrency(debtor.totalDebt),
    `${debtor.oldestDebtDays} ${t('delinquent.table.daysOverdue', { count: debtor.oldestDebtDays })}`,
    getDebtorContact(debtor),
  ])

  autoTable(doc, {
    startY: 70,
    head: [
      [
        t('delinquent.table.debtor'),
        t('delinquent.table.type'),
        t('delinquent.table.totalDebt'),
        t('delinquent.table.oldestDebt'),
        t('delinquent.table.contact'),
      ],
    ],
    body: tableData,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [244, 67, 54] },
  })

  // Guardar
  const filename = t('delinquent.export.pdfFilename', {
    date: new Date().toISOString().split('T')[0],
  })
  doc.save(filename)
}

/**
 * Exporta el informe a CSV
 */
export function exportToCSV(data: DelinquentReportResponse, t: any) {
  const headers = [
    t('delinquent.table.debtor'),
    t('delinquent.table.type'),
    t('delinquent.table.memberNumber'),
    t('delinquent.table.contact'),
    t('delinquent.table.totalDebt'),
    t('delinquent.table.oldestDebt'),
    t('delinquent.table.lastPayment'),
  ]

  const rows = data.debtors.map((debtor) => [
    getDebtorName(debtor, t),
    t(`delinquent.debtorType.${debtor.type.toLowerCase()}`),
    getDebtorMemberNumber(debtor),
    getDebtorContact(debtor),
    formatCurrency(debtor.totalDebt),
    `${debtor.oldestDebtDays}`,
    debtor.lastPaymentDate ? formatDate(debtor.lastPaymentDate) : '-',
  ])

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(','))
    .join('\n')

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  const filename = t('delinquent.export.csvFilename', {
    date: new Date().toISOString().split('T')[0],
  })

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Funciones auxiliares
function getDebtorName(debtor: Debtor, t: any): string {
  if (debtor.type === 'INDIVIDUAL' && debtor.member) {
    return `${debtor.member.firstName} ${debtor.member.lastName}`
  } else if (debtor.type === 'FAMILY' && debtor.family) {
    return debtor.family.familyName
  }
  return '-'
}

function getDebtorMemberNumber(debtor: Debtor): string {
  if (debtor.type === 'INDIVIDUAL' && debtor.member) {
    return debtor.member.memberNumber
  } else if (debtor.type === 'FAMILY' && debtor.family) {
    return debtor.family.primaryMember.memberNumber
  }
  return '-'
}

function getDebtorContact(debtor: Debtor): string {
  if (debtor.type === 'INDIVIDUAL' && debtor.member) {
    return debtor.member.email || debtor.member.phone || '-'
  } else if (debtor.type === 'FAMILY' && debtor.family) {
    return debtor.family.primaryMember.email || debtor.family.primaryMember.phone || '-'
  }
  return '-'
}
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### Configuración Inicial
- [ ] Instalar dependencias: `jspdf`, `jspdf-autotable`
- [ ] Crear estructura de carpetas en `src/features/reports/`
- [ ] Añadir traducciones en los 3 idiomas (es, fr, wo)
- [ ] Registrar namespace `reports` en i18n

### GraphQL
- [ ] Crear archivo `src/graphql/operations/reports.graphql`
- [ ] Ejecutar codegen para generar tipos TypeScript
- [ ] Verificar tipos generados en `src/graphql/__generated__/`

### Tipos y Utilidades
- [ ] Crear `src/features/reports/types.ts`
- [ ] Crear `src/features/reports/utils/delinquentFormatters.ts`
- [ ] Crear `src/features/reports/utils/delinquentExport.ts`

### Hooks
- [ ] Implementar `useDelinquentReport.ts`
- [ ] Implementar `useExportDelinquent.ts`

### Componentes
- [ ] Implementar `DelinquentTable.tsx`
- [ ] Implementar `DelinquentSummaryCards.tsx`
- [ ] Implementar `DelinquentFilters.tsx`
- [ ] Implementar `DelinquentExportButtons.tsx`
- [ ] Implementar `DebtorTypeChip.tsx`
- [ ] Implementar `DebtDetailsDialog.tsx`

### Página Principal
- [ ] Rediseñar `ReportsPage.tsx`
- [ ] Añadir ruta en `routes.tsx` (ya existe)
- [ ] Verificar que solo admin pueda acceder

### Exportación
- [ ] Implementar exportación a PDF
- [ ] Implementar exportación a CSV
- [ ] Verificar formato de archivos exportados

### Testing
- [ ] Probar con datos reales del backend
- [ ] Probar filtros (cutoffDate, minAmount, debtorType, sortBy)
- [ ] Probar exportación PDF
- [ ] Probar exportación CSV
- [ ] Probar en los 3 idiomas
- [ ] Probar permisos (admin vs user)

### Responsividad
- [ ] Probar en móvil (320px)
- [ ] Probar en tablet (768px)
- [ ] Probar en desktop (1920px)

---

## 🎯 CRITERIOS DE ACEPTACIÓN

1. **Funcionalidad:**
   - ✅ Query GraphQL consume correctamente el backend
   - ✅ Tabla muestra lista de morosos
   - ✅ Filtros funcionan correctamente
   - ✅ Cards de resumen muestran estadísticas correctas
   - ✅ Exportación PDF genera archivo correcto
   - ✅ Exportación CSV genera archivo correcto

2. **Internacionalización:**
   - ✅ Todos los textos están traducidos (es, fr, wo)
   - ✅ Cambiar idioma actualiza toda la interfaz
   - ✅ Fechas formateadas según idioma
   - ✅ Archivos exportados usan idioma activo

3. **UX/UI:**
   - ✅ Interfaz intuitiva y clara
   - ✅ Loading states mientras carga
   - ✅ Error handling con mensajes claros
   - ✅ Responsive en todos los dispositivos
   - ✅ Colores semánticos (rojo para deudas)

4. **Permisos:**
   - ✅ Solo admin puede acceder
   - ✅ User recibe mensaje de error apropiado

5. **Rendimiento:**
   - ✅ Tabla responde rápido con 100+ filas
   - ✅ Filtros no causan re-renders innecesarios
   - ✅ Exportación no bloquea UI

---

## 📚 RECURSOS Y REFERENCIAS

- **i18n existente**: `src/lib/i18n/`
- **Componentes similares**: `src/features/payments/` y `src/features/members/`
- **DataGrid docs**: https://mui.com/x/react-data-grid/
- **jsPDF docs**: https://github.com/parallax/jsPDF

---

## 🚀 DEPENDENCIAS A INSTALAR

```bash
npm install jspdf jspdf-autotable
npm install --save-dev @types/jspdf
```

---

## 💡 NOTAS IMPORTANTES

1. **Reutilización**: Muchos componentes (ej. formatters, chips) pueden reutilizarse de `src/features/payments/`

2. **Permisos**: Verificar que la ruta `/reports` ya está protegida en `routes.tsx` con `AdminRoute`

3. **Testing**: Probar primero con pocos datos, luego con datos reales masivos

4. **Performance**: Si hay muchos deudores (>500), considerar añadir paginación del lado del servidor

5. **Envío de recordatorios**: La funcionalidad "Enviar Recordatorio" está marcada como `disabled`. Implementarla requiere backend adicional (envío de emails)

---

**Fecha de entrega estimada**: 1 - 1.5 días  
**Revisor**: Tech Lead Frontend  
**Aprobación**: Product Owner

---

**Estado**: 🔴 LISTO PARA IMPLEMENTAR (tras completar backend)
