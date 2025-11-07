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
  email?: string | null
  phone?: string | null
  status?: string
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
  notes?: string | null
}

export interface Debtor {
  memberId?: string | null
  familyId?: string | null
  type: DebtorType | string // GraphQL returns string
  member?: DebtorMemberInfo | null
  family?: DebtorFamilyInfo | null
  pendingPayments: PendingPayment[]
  totalDebt: number
  oldestDebtDays: number
  oldestDebtDate: string // ISO 8601 date
  lastPaymentDate?: string | null // ISO 8601 date
  lastPaymentAmount?: number | null
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
