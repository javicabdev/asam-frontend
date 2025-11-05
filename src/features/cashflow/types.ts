// Enum de tipos de operación (8 categorías)
export enum OperationType {
  // Ingresos
  INGRESO_CUOTA = 'INGRESO_CUOTA',
  INGRESO_DONACION = 'INGRESO_DONACION',
  INGRESO_OTRO = 'INGRESO_OTRO',
  // Gastos
  GASTO_REPATRIACION = 'GASTO_REPATRIACION',
  GASTO_ADMINISTRATIVO = 'GASTO_ADMINISTRATIVO',
  GASTO_BANCARIO = 'GASTO_BANCARIO',
  GASTO_AYUDA = 'GASTO_AYUDA',
  GASTO_OTRO = 'GASTO_OTRO',
}

// Categorías principales
export type OperationCategory = 'INGRESO' | 'GASTO'

// Referencia a socio (simplificada)
export interface MemberRef {
  id: string
  firstName: string
  lastName: string
  memberNumber: string
}

// Referencia a pago
export interface PaymentRef {
  id: string
  receiptNumber: string
}

// Transacción de caja completa
export interface CashFlowTransaction {
  id: string
  date: string // ISO8601
  operationType: OperationType
  amount: number // + ingreso, - gasto
  detail: string
  runningBalance: number // Saldo acumulado después de esta transacción
  member?: MemberRef | null
  payment?: PaymentRef | null
  createdAt: string
}

// Filtros para listado
export interface CashFlowFilters {
  startDate?: string | null
  endDate?: string | null
  operationType?: OperationType | null
  memberId?: string | null
}

// Balance/resumen
export interface CashFlowBalance {
  totalIncome: number
  totalExpenses: number
  currentBalance: number
}

// Input para crear/actualizar
export interface CreateCashFlowInput {
  date: string
  operationType: OperationType
  amount: number
  detail: string
  memberId?: string | null
}

export interface UpdateCashFlowInput extends CreateCashFlowInput {
  id: string
}
