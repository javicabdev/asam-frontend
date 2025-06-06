// Common types used throughout the application

export type MemberStatus = 'ACTIVE' | 'INACTIVE'
export type MembershipType = 'INDIVIDUAL' | 'FAMILY'
export type PaymentStatus = 'PENDING' | 'PAID' | 'CANCELLED'
export type UserRole = 'ADMIN' | 'USER'
export type OperationType = 'MEMBERSHIP_FEE' | 'CURRENT_EXPENSE' | 'FUND_DELIVERY' | 'OTHER_INCOME'

export interface User {
  id: string
  username: string
  role: UserRole
  isActive: boolean
  lastLogin?: string
}

export interface Member {
  miembro_id: string
  numero_socio: string
  tipo_membresia: MembershipType
  nombre: string
  apellidos: string
  calle_numero_piso?: string
  codigo_postal?: string
  poblacion?: string
  provincia?: string
  pais?: string
  estado: MemberStatus
  fecha_alta: string
  fecha_baja?: string
  fecha_nacimiento?: string
  documento_identidad?: string
  correo_electronico?: string
  profesion?: string
  nacionalidad?: string
  observaciones?: string
}

export interface Family {
  id: string
  numero_socio: string
  esposo_nombre: string
  esposo_apellidos: string
  esposo_fecha_nacimiento?: string
  esposo_documento_identidad?: string
  esposo_correo_electronico?: string
  esposa_nombre: string
  esposa_apellidos: string
  esposa_fecha_nacimiento?: string
  esposa_documento_identidad?: string
  esposa_correo_electronico?: string
  miembro_origen?: Member
  familiares?: FamilyMember[]
}

export interface FamilyMember {
  id: string
  nombre: string
  apellidos: string
  fecha_nacimiento?: string
  dni_nie?: string
  correo_electronico?: string
  parentesco?: string
}

export interface Payment {
  id: string
  member?: Member
  family?: Family
  amount: number
  payment_date: string
  status: PaymentStatus
  payment_method?: string
  notes?: string
}

export interface Transaction {
  id: string
  amount: number
  date: string
  operation_type: OperationType
  detail: string
  member?: Member
  family?: Family
  payment?: Payment
}

export interface PageInfo {
  hasNextPage: boolean
  hasPreviousPage: boolean
  totalCount: number
}

export interface PaginatedResponse<T> {
  nodes: T[]
  pageInfo: PageInfo
}

export interface ApiResponse {
  success: boolean
  message?: string
  error?: string
}

// Filter types
export interface PaginationInput {
  page?: number
  pageSize?: number
}

export interface SortInput {
  field: string
  direction: 'ASC' | 'DESC'
}

export interface MemberFilter {
  estado?: MemberStatus
  tipo_membresia?: MembershipType
  search_term?: string
  pagination?: PaginationInput
  sort?: SortInput
}

export interface TransactionFilter {
  start_date?: string
  end_date?: string
  operation_type?: OperationType
  pagination?: PaginationInput
  sort?: SortInput
}

// Form input types
export interface LoginInput {
  username: string
  password: string
}

export interface CreateMemberInput {
  numero_socio: string
  tipo_membresia: MembershipType
  nombre: string
  apellidos: string
  calle_numero_piso?: string
  codigo_postal?: string
  poblacion?: string
  provincia?: string
  pais?: string
  fecha_nacimiento?: string
  documento_identidad?: string
  correo_electronico?: string
  profesion?: string
  nacionalidad?: string
  observaciones?: string
}

export interface UpdateMemberInput {
  miembro_id: string
  nombre?: string
  apellidos?: string
  correo_electronico?: string
  calle_numero_piso?: string
  codigo_postal?: string
  poblacion?: string
  provincia?: string
  pais?: string
  documento_identidad?: string
  profesion?: string
  observaciones?: string
}

export interface PaymentInput {
  member_id?: string
  family_id?: string
  amount: number
  payment_method?: string
  notes?: string
}

export interface TransactionInput {
  amount: number
  date?: string
  operation_type: OperationType
  detail: string
  member_id?: string
  family_id?: string
  payment_id?: string
}
