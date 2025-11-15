import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  JWT: { input: string; output: string; }
  Time: { input: string; output: string; }
};

export type ActivityType =
  | 'FAMILY_CREATED'
  | 'MEMBER_DEACTIVATED'
  | 'MEMBER_REGISTERED'
  | 'PAYMENT_RECEIVED'
  | 'TRANSACTION_RECORDED';

export type AuthResponse = {
  __typename?: 'AuthResponse';
  accessToken: Scalars['JWT']['output'];
  expiresAt: Scalars['Time']['output'];
  refreshToken: Scalars['JWT']['output'];
  user: User;
};

export type CashFlow = {
  __typename?: 'CashFlow';
  amount: Scalars['Float']['output'];
  created_at: Scalars['Time']['output'];
  date: Scalars['Time']['output'];
  detail: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  member?: Maybe<Member>;
  operation_type: OperationType;
  payment?: Maybe<Payment>;
  running_balance: Scalars['Float']['output'];
  updated_at: Scalars['Time']['output'];
};

export type CashFlowBalance = {
  __typename?: 'CashFlowBalance';
  currentBalance: Scalars['Float']['output'];
  totalExpenses: Scalars['Float']['output'];
  totalIncome: Scalars['Float']['output'];
};

export type CashFlowStats = {
  __typename?: 'CashFlowStats';
  expensesByCategory: Array<CategoryAmount>;
  incomeByCategory: Array<CategoryAmount>;
  monthlyTrend: Array<MonthlyAmount>;
};

export type CategoryAmount = {
  __typename?: 'CategoryAmount';
  amount: Scalars['Float']['output'];
  category: OperationType;
  count: Scalars['Int']['output'];
};

export type ChangePasswordInput = {
  currentPassword: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
};

export type CreateCashFlowInput = {
  amount: Scalars['Float']['input'];
  date: Scalars['Time']['input'];
  detail: Scalars['String']['input'];
  member_id?: InputMaybe<Scalars['ID']['input']>;
  operation_type: OperationType;
};

export type CreateFamilyInput = {
  codigo_postal?: InputMaybe<Scalars['String']['input']>;
  direccion?: InputMaybe<Scalars['String']['input']>;
  esposa_apellidos?: InputMaybe<Scalars['String']['input']>;
  esposa_correo_electronico?: InputMaybe<Scalars['String']['input']>;
  esposa_documento_identidad?: InputMaybe<Scalars['String']['input']>;
  esposa_fecha_nacimiento?: InputMaybe<Scalars['Time']['input']>;
  esposa_nombre?: InputMaybe<Scalars['String']['input']>;
  esposo_apellidos: Scalars['String']['input'];
  esposo_correo_electronico?: InputMaybe<Scalars['String']['input']>;
  esposo_documento_identidad?: InputMaybe<Scalars['String']['input']>;
  esposo_fecha_nacimiento?: InputMaybe<Scalars['Time']['input']>;
  esposo_nombre: Scalars['String']['input'];
  familiares?: InputMaybe<Array<FamiliarInput>>;
  miembro_origen_id?: InputMaybe<Scalars['ID']['input']>;
  numero_socio: Scalars['String']['input'];
  pais?: InputMaybe<Scalars['String']['input']>;
  poblacion?: InputMaybe<Scalars['String']['input']>;
  provincia?: InputMaybe<Scalars['String']['input']>;
  telefonos?: InputMaybe<Array<TelephoneInput>>;
};

export type CreateMemberInput = {
  apellidos: Scalars['String']['input'];
  calle_numero_piso: Scalars['String']['input'];
  codigo_postal: Scalars['String']['input'];
  correo_electronico?: InputMaybe<Scalars['String']['input']>;
  documento_identidad?: InputMaybe<Scalars['String']['input']>;
  fecha_alta?: InputMaybe<Scalars['Time']['input']>;
  fecha_nacimiento?: InputMaybe<Scalars['Time']['input']>;
  nacionalidad?: InputMaybe<Scalars['String']['input']>;
  nombre: Scalars['String']['input'];
  numero_socio: Scalars['String']['input'];
  observaciones?: InputMaybe<Scalars['String']['input']>;
  pais?: InputMaybe<Scalars['String']['input']>;
  poblacion: Scalars['String']['input'];
  profesion?: InputMaybe<Scalars['String']['input']>;
  provincia?: InputMaybe<Scalars['String']['input']>;
  telefonos?: InputMaybe<Array<TelephoneInput>>;
  tipo_membresia: MembershipType;
};

export type CreateUserInput = {
  email: Scalars['String']['input'];
  memberId?: InputMaybe<Scalars['ID']['input']>;
  password: Scalars['String']['input'];
  role: UserRole;
  username: Scalars['String']['input'];
};

export type DashboardStats = {
  __typename?: 'DashboardStats';
  activeMembers: Scalars['Int']['output'];
  averagePayment: Scalars['Float']['output'];
  currentBalance: Scalars['Float']['output'];
  familyMembers: Scalars['Int']['output'];
  inactiveMembers: Scalars['Int']['output'];
  individualMembers: Scalars['Int']['output'];
  memberGrowthPercentage: Scalars['Float']['output'];
  membershipTrend: Array<MembershipTrendData>;
  monthlyExpenses: Scalars['Float']['output'];
  monthlyRevenue: Scalars['Float']['output'];
  newMembersLastMonth: Scalars['Int']['output'];
  newMembersThisMonth: Scalars['Int']['output'];
  paymentCompletionRate: Scalars['Float']['output'];
  pendingPayments: Scalars['Float']['output'];
  recentPaymentsCount: Scalars['Int']['output'];
  revenueGrowthPercentage: Scalars['Float']['output'];
  revenueTrend: Array<RevenueTrendData>;
  totalMembers: Scalars['Int']['output'];
  totalRevenue: Scalars['Float']['output'];
  totalTransactions: Scalars['Int']['output'];
};

/** Representa un deudor (socio o familia) */
export type Debtor = {
  __typename?: 'Debtor';
  /** Información de la familia (si es familiar) */
  family?: Maybe<DebtorFamilyInfo>;
  /** ID de la familia (si es deuda familiar) */
  familyId?: Maybe<Scalars['ID']['output']>;
  /** Importe del último pago realizado */
  lastPaymentAmount?: Maybe<Scalars['Float']['output']>;
  /** Última fecha en que este socio/familia realizó un pago exitoso */
  lastPaymentDate?: Maybe<Scalars['Time']['output']>;
  /** Información del socio (si es individual) */
  member?: Maybe<DebtorMemberInfo>;
  /** ID del socio (si es deuda individual) */
  memberId?: Maybe<Scalars['ID']['output']>;
  /** Fecha del pago pendiente más antiguo */
  oldestDebtDate: Scalars['Time']['output'];
  /** Días de atraso del pago más antiguo */
  oldestDebtDays: Scalars['Int']['output'];
  /** Lista de pagos pendientes */
  pendingPayments: Array<PendingPayment>;
  /** Importe total pendiente (suma de todos los pagos pendientes) */
  totalDebt: Scalars['Float']['output'];
  /** Tipo de deudor: "INDIVIDUAL" o "FAMILY" */
  type: Scalars['String']['output'];
};

/** Información básica de la familia para el informe */
export type DebtorFamilyInfo = {
  __typename?: 'DebtorFamilyInfo';
  familyName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  primaryMember: DebtorMemberInfo;
  totalMembers: Scalars['Int']['output'];
};

/** Información básica del socio para el informe */
export type DebtorMemberInfo = {
  __typename?: 'DebtorMemberInfo';
  email?: Maybe<Scalars['String']['output']>;
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  memberNumber: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
};

/** Parámetros de entrada para el informe de morosos */
export type DelinquentReportInput = {
  /**
   * Fecha de corte para calcular la antigüedad de la deuda.
   * Si no se proporciona, se usa la fecha actual.
   */
  cutoffDate?: InputMaybe<Scalars['Time']['input']>;
  /**
   * Filtrar solo por socios individuales o familias
   * Valores: "INDIVIDUAL" | "FAMILY" | null (ambos)
   */
  debtorType?: InputMaybe<Scalars['String']['input']>;
  /**
   * Importe mínimo de deuda para incluir en el informe.
   * Útil para filtrar deudas pequeñas.
   * Default: 0
   */
  minAmount?: InputMaybe<Scalars['Float']['input']>;
  /** Paginación */
  pagination?: InputMaybe<PaginationInput>;
  /**
   * Ordenamiento de resultados
   * Valores: "AMOUNT_DESC" | "AMOUNT_ASC" | "DAYS_DESC" | "DAYS_ASC" | "NAME_ASC"
   * Default: "DAYS_DESC" (más antiguas primero)
   */
  sortBy?: InputMaybe<Scalars['String']['input']>;
};

/** Respuesta del informe de morosos con paginación */
export type DelinquentReportResponse = {
  __typename?: 'DelinquentReportResponse';
  /** Lista de deudores (socios o familias) paginados */
  debtors: Array<Debtor>;
  /** Fecha en que se generó el informe */
  generatedAt: Scalars['Time']['output'];
  /** Información de paginación */
  pageInfo: PageInfo;
  /** Estadísticas generales del informe (basadas en TODOS los deudores, no solo la página actual) */
  summary: DelinquentSummary;
};

/** Resumen estadístico del informe */
export type DelinquentSummary = {
  __typename?: 'DelinquentSummary';
  /** Promedio de días de atraso */
  averageDaysOverdue: Scalars['Int']['output'];
  /** Deuda promedio por deudor */
  averageDebtPerDebtor: Scalars['Float']['output'];
  /** Número de familias con deuda */
  familyDebtors: Scalars['Int']['output'];
  /** Número de socios individuales con deuda */
  individualDebtors: Scalars['Int']['output'];
  /** Importe total de todas las deudas */
  totalDebtAmount: Scalars['Float']['output'];
  /** Número total de deudores */
  totalDebtors: Scalars['Int']['output'];
};

export type DocumentValidationResult = {
  __typename?: 'DocumentValidationResult';
  errorMessage?: Maybe<Scalars['String']['output']>;
  isValid: Scalars['Boolean']['output'];
  normalizedValue?: Maybe<Scalars['String']['output']>;
};

export type Familiar = {
  __typename?: 'Familiar';
  apellidos: Scalars['String']['output'];
  correo_electronico?: Maybe<Scalars['String']['output']>;
  dni_nie?: Maybe<Scalars['String']['output']>;
  fecha_nacimiento?: Maybe<Scalars['Time']['output']>;
  id: Scalars['ID']['output'];
  nombre: Scalars['String']['output'];
  parentesco: Scalars['String']['output'];
  telefonos?: Maybe<Array<Telephone>>;
};

export type FamiliarInput = {
  apellidos: Scalars['String']['input'];
  correo_electronico?: InputMaybe<Scalars['String']['input']>;
  dni_nie?: InputMaybe<Scalars['String']['input']>;
  fecha_nacimiento?: InputMaybe<Scalars['Time']['input']>;
  nombre: Scalars['String']['input'];
  parentesco: Scalars['String']['input'];
  telefonos?: InputMaybe<Array<TelephoneInput>>;
};

export type Family = {
  __typename?: 'Family';
  esposa_apellidos: Scalars['String']['output'];
  esposa_correo_electronico?: Maybe<Scalars['String']['output']>;
  esposa_documento_identidad?: Maybe<Scalars['String']['output']>;
  esposa_fecha_nacimiento?: Maybe<Scalars['Time']['output']>;
  esposa_nombre: Scalars['String']['output'];
  esposo_apellidos: Scalars['String']['output'];
  esposo_correo_electronico?: Maybe<Scalars['String']['output']>;
  esposo_documento_identidad?: Maybe<Scalars['String']['output']>;
  esposo_fecha_nacimiento?: Maybe<Scalars['Time']['output']>;
  esposo_nombre: Scalars['String']['output'];
  familiares?: Maybe<Array<Familiar>>;
  id: Scalars['ID']['output'];
  miembro_origen?: Maybe<Member>;
  numero_socio: Scalars['String']['output'];
  telefonos?: Maybe<Array<Telephone>>;
};

export type FamilyConnection = {
  __typename?: 'FamilyConnection';
  nodes: Array<Family>;
  pageInfo: PageInfo;
};

export type FamilyFilter = {
  pagination?: InputMaybe<PaginationInput>;
  search_term?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<SortInput>;
};

export type FamilySortField =
  | 'ESPOSA_NOMBRE'
  | 'ESPOSO_NOMBRE'
  | 'NUMERO_SOCIO';

export type GenerateAnnualFeesInput = {
  base_fee_amount: Scalars['Float']['input'];
  family_fee_extra: Scalars['Float']['input'];
  year: Scalars['Int']['input'];
};

export type GenerateAnnualFeesResponse = {
  __typename?: 'GenerateAnnualFeesResponse';
  details: Array<PaymentGenerationDetail>;
  membership_fee_id: Scalars['ID']['output'];
  payments_existing: Scalars['Int']['output'];
  payments_generated: Scalars['Int']['output'];
  total_expected_amount: Scalars['Float']['output'];
  total_members: Scalars['Int']['output'];
  year: Scalars['Int']['output'];
};

export type LoginInput = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type Member = {
  __typename?: 'Member';
  apellidos: Scalars['String']['output'];
  calle_numero_piso: Scalars['String']['output'];
  codigo_postal: Scalars['String']['output'];
  correo_electronico?: Maybe<Scalars['String']['output']>;
  documento_identidad?: Maybe<Scalars['String']['output']>;
  estado: MemberStatus;
  fecha_alta: Scalars['Time']['output'];
  fecha_baja?: Maybe<Scalars['Time']['output']>;
  fecha_nacimiento?: Maybe<Scalars['Time']['output']>;
  miembro_id: Scalars['ID']['output'];
  nacionalidad?: Maybe<Scalars['String']['output']>;
  nombre: Scalars['String']['output'];
  numero_socio: Scalars['String']['output'];
  observaciones?: Maybe<Scalars['String']['output']>;
  pais: Scalars['String']['output'];
  poblacion: Scalars['String']['output'];
  profesion?: Maybe<Scalars['String']['output']>;
  provincia: Scalars['String']['output'];
  telefonos?: Maybe<Array<Telephone>>;
  tipo_membresia: MembershipType;
};

export type MemberConnection = {
  __typename?: 'MemberConnection';
  nodes: Array<Member>;
  pageInfo: PageInfo;
};

export type MemberFilter = {
  estado?: InputMaybe<MemberStatus>;
  pagination?: InputMaybe<PaginationInput>;
  search_term?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<SortInput>;
  tipo_membresia?: InputMaybe<MembershipType>;
};

export type MemberSortField =
  | 'APELLIDOS'
  | 'ESTADO'
  | 'FECHA_ALTA'
  | 'NOMBRE'
  | 'NUMERO_SOCIO';

export type MemberStatus =
  | 'ACTIVE'
  | 'INACTIVE';

export type MembershipFee = {
  __typename?: 'MembershipFee';
  base_fee_amount: Scalars['Float']['output'];
  due_date: Scalars['Time']['output'];
  family_fee_extra: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  year: Scalars['Int']['output'];
};

export type MembershipTrendData = {
  __typename?: 'MembershipTrendData';
  month: Scalars['String']['output'];
  newMembers: Scalars['Int']['output'];
  totalMembers: Scalars['Int']['output'];
};

export type MembershipType =
  | 'FAMILY'
  | 'INDIVIDUAL';

export type MonthlyAmount = {
  __typename?: 'MonthlyAmount';
  balance: Scalars['Float']['output'];
  expenses: Scalars['Float']['output'];
  income: Scalars['Float']['output'];
  month: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addFamilyMember: Family;
  adjustBalance: MutationResponse;
  cancelPayment: MutationResponse;
  changeMemberStatus: Member;
  changePassword: MutationResponse;
  confirmPayment: Payment;
  createCashFlow: CashFlow;
  createFamily: Family;
  createMember: Member;
  createUser: User;
  deleteCashFlow: MutationResponse;
  deleteMember: MutationResponse;
  deleteUser: MutationResponse;
  generateAnnualFees: GenerateAnnualFeesResponse;
  login: AuthResponse;
  logout: MutationResponse;
  refreshToken: TokenResponse;
  registerPayment: Payment;
  registerTransaction: CashFlow;
  removeFamilyMember: MutationResponse;
  requestPasswordReset: MutationResponse;
  resendVerificationEmail: MutationResponse;
  resetPasswordWithToken: MutationResponse;
  resetUserPassword: MutationResponse;
  sendVerificationEmail: MutationResponse;
  updateCashFlow: CashFlow;
  updateFamily: Family;
  updateMember: Member;
  updatePayment: Payment;
  updateTransaction: CashFlow;
  updateUser: User;
  verifyEmail: MutationResponse;
};


export type MutationAddFamilyMemberArgs = {
  familiar: FamiliarInput;
  family_id: Scalars['ID']['input'];
};


export type MutationAdjustBalanceArgs = {
  amount: Scalars['Float']['input'];
  reason: Scalars['String']['input'];
};


export type MutationCancelPaymentArgs = {
  id: Scalars['ID']['input'];
  reason: Scalars['String']['input'];
};


export type MutationChangeMemberStatusArgs = {
  id: Scalars['ID']['input'];
  status: MemberStatus;
};


export type MutationChangePasswordArgs = {
  input: ChangePasswordInput;
};


export type MutationConfirmPaymentArgs = {
  amount?: InputMaybe<Scalars['Float']['input']>;
  id: Scalars['ID']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  paymentDate?: InputMaybe<Scalars['Time']['input']>;
  paymentMethod: Scalars['String']['input'];
};


export type MutationCreateCashFlowArgs = {
  input: CreateCashFlowInput;
};


export type MutationCreateFamilyArgs = {
  input: CreateFamilyInput;
};


export type MutationCreateMemberArgs = {
  input: CreateMemberInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationDeleteCashFlowArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteMemberArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationGenerateAnnualFeesArgs = {
  input: GenerateAnnualFeesInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationRefreshTokenArgs = {
  input: RefreshTokenInput;
};


export type MutationRegisterPaymentArgs = {
  input: PaymentInput;
};


export type MutationRegisterTransactionArgs = {
  input: TransactionInput;
};


export type MutationRemoveFamilyMemberArgs = {
  familiar_id: Scalars['ID']['input'];
};


export type MutationRequestPasswordResetArgs = {
  email: Scalars['String']['input'];
};


export type MutationResendVerificationEmailArgs = {
  email: Scalars['String']['input'];
};


export type MutationResetPasswordWithTokenArgs = {
  newPassword: Scalars['String']['input'];
  token: Scalars['String']['input'];
};


export type MutationResetUserPasswordArgs = {
  newPassword: Scalars['String']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationUpdateCashFlowArgs = {
  id: Scalars['ID']['input'];
  input: UpdateCashFlowInput;
};


export type MutationUpdateFamilyArgs = {
  input: UpdateFamilyInput;
};


export type MutationUpdateMemberArgs = {
  input: UpdateMemberInput;
};


export type MutationUpdatePaymentArgs = {
  id: Scalars['ID']['input'];
  input: PaymentInput;
};


export type MutationUpdateTransactionArgs = {
  id: Scalars['ID']['input'];
  input: TransactionInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};


export type MutationVerifyEmailArgs = {
  token: Scalars['String']['input'];
};

export type MutationResponse = {
  __typename?: 'MutationResponse';
  error?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type OperationType =
  | 'GASTO_ADMINISTRATIVO'
  | 'GASTO_AYUDA'
  | 'GASTO_BANCARIO'
  | 'GASTO_OTRO'
  | 'GASTO_REPATRIACION'
  | 'INGRESO_CUOTA'
  | 'INGRESO_DONACION'
  | 'INGRESO_OTRO';

export type PageInfo = {
  __typename?: 'PageInfo';
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  totalCount: Scalars['Int']['output'];
};

export type PaginationInput = {
  page?: Scalars['Int']['input'];
  pageSize?: Scalars['Int']['input'];
};

export type Payment = {
  __typename?: 'Payment';
  amount: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  member: Member;
  membership_fee?: Maybe<MembershipFee>;
  notes?: Maybe<Scalars['String']['output']>;
  payment_date?: Maybe<Scalars['Time']['output']>;
  payment_method: Scalars['String']['output'];
  status: PaymentStatus;
};

export type PaymentConnection = {
  __typename?: 'PaymentConnection';
  nodes: Array<Payment>;
  pageInfo: PageInfo;
};

export type PaymentFilter = {
  end_date?: InputMaybe<Scalars['Time']['input']>;
  max_amount?: InputMaybe<Scalars['Float']['input']>;
  member_id?: InputMaybe<Scalars['ID']['input']>;
  min_amount?: InputMaybe<Scalars['Float']['input']>;
  pagination?: InputMaybe<PaginationInput>;
  payment_method?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<SortInput>;
  start_date?: InputMaybe<Scalars['Time']['input']>;
  status?: InputMaybe<PaymentStatus>;
};

export type PaymentGenerationDetail = {
  __typename?: 'PaymentGenerationDetail';
  amount: Scalars['Float']['output'];
  error?: Maybe<Scalars['String']['output']>;
  member_id: Scalars['ID']['output'];
  member_name: Scalars['String']['output'];
  member_number: Scalars['String']['output'];
  was_created: Scalars['Boolean']['output'];
};

export type PaymentInput = {
  amount: Scalars['Float']['input'];
  member_id: Scalars['ID']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  payment_method: Scalars['String']['input'];
};

export type PaymentStatus =
  | 'CANCELLED'
  | 'PAID'
  | 'PENDING';

/** Información de un pago pendiente */
export type PendingPayment = {
  __typename?: 'PendingPayment';
  amount: Scalars['Float']['output'];
  createdAt: Scalars['Time']['output'];
  daysOverdue: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  notes?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  cashFlowBalance: CashFlowBalance;
  cashFlowStats: CashFlowStats;
  checkDocumentValidity: DocumentValidationResult;
  checkMemberNumberExists: Scalars['Boolean']['output'];
  getBalance: Scalars['Float']['output'];
  getCashFlow?: Maybe<CashFlow>;
  getCurrentUser: User;
  getDashboardStats: DashboardStats;
  getDelinquentReport: DelinquentReportResponse;
  getFamily?: Maybe<Family>;
  getFamilyByOriginMember?: Maybe<Family>;
  getFamilyMembers: Array<Familiar>;
  getFamilyPayments: Array<Payment>;
  getMember?: Maybe<Member>;
  getMemberPayments: Array<Payment>;
  getMembershipFee?: Maybe<MembershipFee>;
  getNextMemberNumber: Scalars['String']['output'];
  getPayment?: Maybe<Payment>;
  getPaymentStatus: PaymentStatus;
  getPendingFees: Array<MembershipFee>;
  getRecentActivity: Array<RecentActivity>;
  getTransactions: TransactionConnection;
  getUser?: Maybe<User>;
  health: Scalars['String']['output'];
  listAnnualFees: Array<MembershipFee>;
  listFamilies: FamilyConnection;
  listMembers: MemberConnection;
  listMembershipFees: Array<MembershipFee>;
  listPayments: PaymentConnection;
  listUsers: UserConnection;
  ping: Scalars['String']['output'];
  searchMembers: Array<Member>;
  searchMembersWithoutUser: Array<Member>;
};


export type QueryCashFlowStatsArgs = {
  end_date: Scalars['Time']['input'];
  start_date: Scalars['Time']['input'];
};


export type QueryCheckDocumentValidityArgs = {
  documentNumber: Scalars['String']['input'];
};


export type QueryCheckMemberNumberExistsArgs = {
  memberNumber: Scalars['String']['input'];
};


export type QueryGetCashFlowArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetDelinquentReportArgs = {
  input?: InputMaybe<DelinquentReportInput>;
};


export type QueryGetFamilyArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetFamilyByOriginMemberArgs = {
  memberId: Scalars['ID']['input'];
};


export type QueryGetFamilyMembersArgs = {
  familyId: Scalars['ID']['input'];
};


export type QueryGetFamilyPaymentsArgs = {
  familyId: Scalars['ID']['input'];
};


export type QueryGetMemberArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetMemberPaymentsArgs = {
  memberId: Scalars['ID']['input'];
};


export type QueryGetMembershipFeeArgs = {
  year: Scalars['Int']['input'];
};


export type QueryGetNextMemberNumberArgs = {
  isFamily: Scalars['Boolean']['input'];
};


export type QueryGetPaymentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetPaymentStatusArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetRecentActivityArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetTransactionsArgs = {
  filter?: InputMaybe<TransactionFilter>;
};


export type QueryGetUserArgs = {
  id: Scalars['ID']['input'];
};


export type QueryListFamiliesArgs = {
  filter?: InputMaybe<FamilyFilter>;
};


export type QueryListMembersArgs = {
  filter?: InputMaybe<MemberFilter>;
};


export type QueryListMembershipFeesArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryListPaymentsArgs = {
  filter?: InputMaybe<PaymentFilter>;
};


export type QueryListUsersArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerySearchMembersArgs = {
  criteria: Scalars['String']['input'];
};


export type QuerySearchMembersWithoutUserArgs = {
  criteria: Scalars['String']['input'];
};

export type RecentActivity = {
  __typename?: 'RecentActivity';
  amount?: Maybe<Scalars['Float']['output']>;
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  relatedFamily?: Maybe<Family>;
  relatedMember?: Maybe<Member>;
  timestamp: Scalars['Time']['output'];
  type: ActivityType;
};

export type RefreshTokenInput = {
  refreshToken: Scalars['JWT']['input'];
};

export type RevenueTrendData = {
  __typename?: 'RevenueTrendData';
  expenses: Scalars['Float']['output'];
  month: Scalars['String']['output'];
  revenue: Scalars['Float']['output'];
};

export type SortDirection =
  | 'ASC'
  | 'DESC';

export type SortInput = {
  direction: SortDirection;
  field: Scalars['String']['input'];
};

export type Telephone = {
  __typename?: 'Telephone';
  id: Scalars['ID']['output'];
  numero_telefono: Scalars['String']['output'];
};

export type TelephoneInput = {
  numero_telefono: Scalars['String']['input'];
};

export type TokenResponse = {
  __typename?: 'TokenResponse';
  accessToken: Scalars['JWT']['output'];
  expiresAt: Scalars['Time']['output'];
  refreshToken: Scalars['JWT']['output'];
};

export type TransactionConnection = {
  __typename?: 'TransactionConnection';
  nodes: Array<CashFlow>;
  pageInfo: PageInfo;
};

export type TransactionFilter = {
  category?: InputMaybe<Scalars['String']['input']>;
  end_date?: InputMaybe<Scalars['Time']['input']>;
  member_id?: InputMaybe<Scalars['ID']['input']>;
  operation_type?: InputMaybe<OperationType>;
  pagination?: InputMaybe<PaginationInput>;
  sort?: InputMaybe<SortInput>;
  start_date?: InputMaybe<Scalars['Time']['input']>;
};

export type TransactionInput = {
  amount: Scalars['Float']['input'];
  date: Scalars['Time']['input'];
  detail: Scalars['String']['input'];
  member_id?: InputMaybe<Scalars['ID']['input']>;
  operation_type: OperationType;
};

export type TransactionSortField =
  | 'AMOUNT'
  | 'DATE'
  | 'OPERATION_TYPE';

export type UpdateCashFlowInput = {
  amount?: InputMaybe<Scalars['Float']['input']>;
  date?: InputMaybe<Scalars['Time']['input']>;
  detail?: InputMaybe<Scalars['String']['input']>;
  member_id?: InputMaybe<Scalars['ID']['input']>;
  operation_type?: InputMaybe<OperationType>;
};

export type UpdateFamilyInput = {
  esposa_apellidos?: InputMaybe<Scalars['String']['input']>;
  esposa_correo_electronico?: InputMaybe<Scalars['String']['input']>;
  esposa_documento_identidad?: InputMaybe<Scalars['String']['input']>;
  esposa_nombre?: InputMaybe<Scalars['String']['input']>;
  esposo_apellidos?: InputMaybe<Scalars['String']['input']>;
  esposo_correo_electronico?: InputMaybe<Scalars['String']['input']>;
  esposo_documento_identidad?: InputMaybe<Scalars['String']['input']>;
  esposo_nombre?: InputMaybe<Scalars['String']['input']>;
  familia_id: Scalars['ID']['input'];
  telefonos?: InputMaybe<Array<TelephoneInput>>;
};

export type UpdateMemberInput = {
  apellidos?: InputMaybe<Scalars['String']['input']>;
  calle_numero_piso?: InputMaybe<Scalars['String']['input']>;
  codigo_postal?: InputMaybe<Scalars['String']['input']>;
  correo_electronico?: InputMaybe<Scalars['String']['input']>;
  documento_identidad?: InputMaybe<Scalars['String']['input']>;
  fecha_nacimiento?: InputMaybe<Scalars['Time']['input']>;
  miembro_id: Scalars['ID']['input'];
  nacionalidad?: InputMaybe<Scalars['String']['input']>;
  nombre?: InputMaybe<Scalars['String']['input']>;
  observaciones?: InputMaybe<Scalars['String']['input']>;
  pais?: InputMaybe<Scalars['String']['input']>;
  poblacion?: InputMaybe<Scalars['String']['input']>;
  profesion?: InputMaybe<Scalars['String']['input']>;
  provincia?: InputMaybe<Scalars['String']['input']>;
  telefonos?: InputMaybe<Array<TelephoneInput>>;
};

export type UpdateUserInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  memberId?: InputMaybe<Scalars['ID']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<UserRole>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  emailVerified: Scalars['Boolean']['output'];
  emailVerifiedAt?: Maybe<Scalars['Time']['output']>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  lastLogin?: Maybe<Scalars['Time']['output']>;
  member?: Maybe<Member>;
  role: UserRole;
  username: Scalars['String']['output'];
};

export type UserConnection = {
  __typename?: 'UserConnection';
  nodes: Array<User>;
  pageInfo: PageInfo;
};

export type UserRole =
  | 'admin'
  | 'user';

export type MemberBasicInfoFragment = { __typename?: 'Member', miembro_id: string, numero_socio: string, nombre: string, apellidos: string, tipo_membresia: MembershipType, estado: MemberStatus };

export type MemberFullInfoFragment = { __typename?: 'Member', miembro_id: string, numero_socio: string, tipo_membresia: MembershipType, nombre: string, apellidos: string, calle_numero_piso: string, codigo_postal: string, poblacion: string, provincia: string, pais: string, estado: MemberStatus, fecha_alta: string, fecha_baja?: string | null, fecha_nacimiento?: string | null, documento_identidad?: string | null, correo_electronico?: string | null, profesion?: string | null, nacionalidad?: string | null, observaciones?: string | null };

export type FamilyBasicInfoFragment = { __typename?: 'Family', id: string, numero_socio: string, esposo_nombre: string, esposo_apellidos: string, esposa_nombre: string, esposa_apellidos: string };

export type FamiliarInfoFragment = { __typename?: 'Familiar', id: string, nombre: string, apellidos: string, fecha_nacimiento?: string | null, dni_nie?: string | null, correo_electronico?: string | null };

export type UserInfoFragment = { __typename?: 'User', id: string, username: string, email: string, role: UserRole, isActive: boolean, lastLogin?: string | null, emailVerified: boolean, emailVerifiedAt?: string | null };

export type PaymentInfoFragment = { __typename?: 'Payment', id: string, amount: number, payment_date?: string | null, status: PaymentStatus, payment_method: string, notes?: string | null };

export type CashFlowInfoFragment = { __typename?: 'CashFlow', id: string, amount: number, date: string, operation_type: OperationType, detail: string };

export type PageInfoFragmentFragment = { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, totalCount: number };

export type MutationResultFragment = { __typename?: 'MutationResponse', success: boolean, message?: string | null, error?: string | null };

export type GetCurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentUserQuery = { __typename?: 'Query', getCurrentUser: { __typename?: 'User', id: string, username: string, email: string, role: UserRole, isActive: boolean, lastLogin?: string | null, emailVerified: boolean, emailVerifiedAt?: string | null, member?: { __typename?: 'Member', miembro_id: string, numero_socio: string, nombre: string, apellidos: string, correo_electronico?: string | null } | null } };

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AuthResponse', accessToken: string, refreshToken: string, expiresAt: string, user: { __typename?: 'User', id: string, username: string, email: string, role: UserRole, isActive: boolean, lastLogin?: string | null, emailVerified: boolean, emailVerifiedAt?: string | null, member?: { __typename?: 'Member', miembro_id: string, numero_socio: string, nombre: string, apellidos: string, correo_electronico?: string | null } | null } } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: { __typename?: 'MutationResponse', success: boolean, message?: string | null, error?: string | null } };

export type RefreshTokenMutationVariables = Exact<{
  input: RefreshTokenInput;
}>;


export type RefreshTokenMutation = { __typename?: 'Mutation', refreshToken: { __typename?: 'TokenResponse', accessToken: string, refreshToken: string, expiresAt: string } };

export type ChangePasswordMutationVariables = Exact<{
  input: ChangePasswordInput;
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword: { __typename?: 'MutationResponse', success: boolean, message?: string | null, error?: string | null } };

export type SendVerificationEmailMutationVariables = Exact<{ [key: string]: never; }>;


export type SendVerificationEmailMutation = { __typename?: 'Mutation', sendVerificationEmail: { __typename?: 'MutationResponse', success: boolean, message?: string | null, error?: string | null } };

export type VerifyEmailMutationVariables = Exact<{
  token: Scalars['String']['input'];
}>;


export type VerifyEmailMutation = { __typename?: 'Mutation', verifyEmail: { __typename?: 'MutationResponse', success: boolean, message?: string | null, error?: string | null } };

export type ResendVerificationEmailMutationVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type ResendVerificationEmailMutation = { __typename?: 'Mutation', resendVerificationEmail: { __typename?: 'MutationResponse', success: boolean, message?: string | null, error?: string | null } };

export type RequestPasswordResetMutationVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type RequestPasswordResetMutation = { __typename?: 'Mutation', requestPasswordReset: { __typename?: 'MutationResponse', success: boolean, message?: string | null, error?: string | null } };

export type ResetPasswordWithTokenMutationVariables = Exact<{
  token: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
}>;


export type ResetPasswordWithTokenMutation = { __typename?: 'Mutation', resetPasswordWithToken: { __typename?: 'MutationResponse', success: boolean, message?: string | null, error?: string | null } };

export type CashFlowTransactionFieldsFragment = { __typename?: 'CashFlow', id: string, date: string, operation_type: OperationType, amount: number, detail: string, running_balance: number, created_at: string, member?: { __typename?: 'Member', miembro_id: string, numero_socio: string, nombre: string, apellidos: string } | null, payment?: { __typename?: 'Payment', id: string } | null };

export type GetCashFlowsQueryVariables = Exact<{
  filter?: InputMaybe<TransactionFilter>;
}>;


export type GetCashFlowsQuery = { __typename?: 'Query', getTransactions: { __typename?: 'TransactionConnection', nodes: Array<{ __typename?: 'CashFlow', id: string, date: string, operation_type: OperationType, amount: number, detail: string, running_balance: number, created_at: string, member?: { __typename?: 'Member', miembro_id: string, numero_socio: string, nombre: string, apellidos: string } | null, payment?: { __typename?: 'Payment', id: string } | null }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, totalCount: number } } };

export type GetCashFlowBalanceQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCashFlowBalanceQuery = { __typename?: 'Query', cashFlowBalance: { __typename?: 'CashFlowBalance', totalIncome: number, totalExpenses: number, currentBalance: number } };

export type GetCashFlowQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetCashFlowQuery = { __typename?: 'Query', getCashFlow?: { __typename?: 'CashFlow', id: string, date: string, operation_type: OperationType, amount: number, detail: string, running_balance: number, created_at: string, member?: { __typename?: 'Member', miembro_id: string, numero_socio: string, nombre: string, apellidos: string } | null, payment?: { __typename?: 'Payment', id: string } | null } | null };

export type CreateCashFlowMutationVariables = Exact<{
  input: CreateCashFlowInput;
}>;


export type CreateCashFlowMutation = { __typename?: 'Mutation', createCashFlow: { __typename?: 'CashFlow', id: string, date: string, operation_type: OperationType, amount: number, detail: string, running_balance: number, created_at: string, member?: { __typename?: 'Member', miembro_id: string, numero_socio: string, nombre: string, apellidos: string } | null, payment?: { __typename?: 'Payment', id: string } | null } };

export type UpdateCashFlowMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateCashFlowInput;
}>;


export type UpdateCashFlowMutation = { __typename?: 'Mutation', updateCashFlow: { __typename?: 'CashFlow', id: string, date: string, operation_type: OperationType, amount: number, detail: string, running_balance: number, created_at: string, member?: { __typename?: 'Member', miembro_id: string, numero_socio: string, nombre: string, apellidos: string } | null, payment?: { __typename?: 'Payment', id: string } | null } };

export type DeleteCashFlowMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteCashFlowMutation = { __typename?: 'Mutation', deleteCashFlow: { __typename?: 'MutationResponse', success: boolean, message?: string | null } };

export type RegisterTransactionMutationVariables = Exact<{
  input: TransactionInput;
}>;


export type RegisterTransactionMutation = { __typename?: 'Mutation', registerTransaction: { __typename?: 'CashFlow', id: string, amount: number, date: string, operation_type: OperationType, detail: string, member?: { __typename?: 'Member', miembro_id: string, numero_socio: string, nombre: string, apellidos: string, tipo_membresia: MembershipType } | null, payment?: { __typename?: 'Payment', id: string, amount: number, payment_date?: string | null, status: PaymentStatus, payment_method: string } | null } };

export type UpdateTransactionMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: TransactionInput;
}>;


export type UpdateTransactionMutation = { __typename?: 'Mutation', updateTransaction: { __typename?: 'CashFlow', id: string, amount: number, date: string, operation_type: OperationType, detail: string, member?: { __typename?: 'Member', miembro_id: string, numero_socio: string, nombre: string, apellidos: string, tipo_membresia: MembershipType } | null, payment?: { __typename?: 'Payment', id: string, amount: number, payment_date?: string | null, status: PaymentStatus, payment_method: string } | null } };

export type AdjustBalanceMutationVariables = Exact<{
  amount: Scalars['Float']['input'];
  reason: Scalars['String']['input'];
}>;


export type AdjustBalanceMutation = { __typename?: 'Mutation', adjustBalance: { __typename?: 'MutationResponse', success: boolean, message?: string | null, error?: string | null } };

export type GetDashboardStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetDashboardStatsQuery = { __typename?: 'Query', getDashboardStats: { __typename?: 'DashboardStats', totalMembers: number, activeMembers: number, inactiveMembers: number, individualMembers: number, familyMembers: number, newMembersThisMonth: number, newMembersLastMonth: number, memberGrowthPercentage: number, totalRevenue: number, monthlyRevenue: number, pendingPayments: number, averagePayment: number, paymentCompletionRate: number, revenueGrowthPercentage: number, currentBalance: number, monthlyExpenses: number, totalTransactions: number, recentPaymentsCount: number, membershipTrend: Array<{ __typename?: 'MembershipTrendData', month: string, newMembers: number, totalMembers: number }>, revenueTrend: Array<{ __typename?: 'RevenueTrendData', month: string, revenue: number, expenses: number }> } };

export type GetRecentActivityQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetRecentActivityQuery = { __typename?: 'Query', getRecentActivity: Array<{ __typename?: 'RecentActivity', id: string, type: ActivityType, description: string, timestamp: string, amount?: number | null, relatedMember?: { __typename?: 'Member', miembro_id: string, nombre: string, apellidos: string } | null, relatedFamily?: { __typename?: 'Family', id: string, esposo_nombre: string, esposa_nombre: string } | null }> };

export type GetFamilyQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetFamilyQuery = { __typename?: 'Query', getFamily?: { __typename?: 'Family', id: string, numero_socio: string, esposo_nombre: string, esposo_apellidos: string, esposa_nombre: string, esposa_apellidos: string, miembro_origen?: { __typename?: 'Member', miembro_id: string, numero_socio: string, nombre: string, apellidos: string } | null, telefonos?: Array<{ __typename?: 'Telephone', numero_telefono: string }> | null, familiares?: Array<{ __typename?: 'Familiar', id: string, nombre: string, apellidos: string, fecha_nacimiento?: string | null, dni_nie?: string | null, correo_electronico?: string | null, telefonos?: Array<{ __typename?: 'Telephone', numero_telefono: string }> | null }> | null } | null };

export type GetFamilyByOriginMemberQueryVariables = Exact<{
  memberId: Scalars['ID']['input'];
}>;


export type GetFamilyByOriginMemberQuery = { __typename?: 'Query', getFamilyByOriginMember?: { __typename?: 'Family', id: string, numero_socio: string, esposo_nombre: string, esposo_apellidos: string, esposa_nombre: string, esposa_apellidos: string, esposa_fecha_nacimiento?: string | null, esposa_documento_identidad?: string | null, esposa_correo_electronico?: string | null, miembro_origen?: { __typename?: 'Member', miembro_id: string, numero_socio: string, nombre: string, apellidos: string } | null, telefonos?: Array<{ __typename?: 'Telephone', numero_telefono: string }> | null, familiares?: Array<{ __typename?: 'Familiar', id: string, nombre: string, apellidos: string, fecha_nacimiento?: string | null, dni_nie?: string | null, correo_electronico?: string | null, telefonos?: Array<{ __typename?: 'Telephone', numero_telefono: string }> | null }> | null } | null };

export type ListFamiliesQueryVariables = Exact<{
  filter?: InputMaybe<FamilyFilter>;
}>;


export type ListFamiliesQuery = { __typename?: 'Query', listFamilies: { __typename?: 'FamilyConnection', nodes: Array<{ __typename?: 'Family', id: string, numero_socio: string, esposo_nombre: string, esposo_apellidos: string, esposa_nombre: string, esposa_apellidos: string, miembro_origen?: { __typename?: 'Member', miembro_id: string, numero_socio: string, nombre: string, apellidos: string } | null, telefonos?: Array<{ __typename?: 'Telephone', numero_telefono: string }> | null, familiares?: Array<{ __typename?: 'Familiar', id: string, nombre: string, apellidos: string, fecha_nacimiento?: string | null, dni_nie?: string | null, correo_electronico?: string | null, telefonos?: Array<{ __typename?: 'Telephone', numero_telefono: string }> | null }> | null }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, totalCount: number } } };

export type GetFamilyMembersQueryVariables = Exact<{
  familyId: Scalars['ID']['input'];
}>;


export type GetFamilyMembersQuery = { __typename?: 'Query', getFamilyMembers: Array<{ __typename?: 'Familiar', id: string, nombre: string, apellidos: string, fecha_nacimiento?: string | null, dni_nie?: string | null, correo_electronico?: string | null, telefonos?: Array<{ __typename?: 'Telephone', numero_telefono: string }> | null }> };

export type CreateFamilyMutationVariables = Exact<{
  input: CreateFamilyInput;
}>;


export type CreateFamilyMutation = { __typename?: 'Mutation', createFamily: { __typename?: 'Family', id: string, numero_socio: string, esposo_nombre: string, esposo_apellidos: string, esposa_nombre: string, esposa_apellidos: string, miembro_origen?: { __typename?: 'Member', miembro_id: string, numero_socio: string, nombre: string, apellidos: string } | null, telefonos?: Array<{ __typename?: 'Telephone', numero_telefono: string }> | null, familiares?: Array<{ __typename?: 'Familiar', id: string, nombre: string, apellidos: string, fecha_nacimiento?: string | null, dni_nie?: string | null, correo_electronico?: string | null, telefonos?: Array<{ __typename?: 'Telephone', numero_telefono: string }> | null }> | null } };

export type UpdateFamilyMutationVariables = Exact<{
  input: UpdateFamilyInput;
}>;


export type UpdateFamilyMutation = { __typename?: 'Mutation', updateFamily: { __typename?: 'Family', id: string, numero_socio: string, esposo_nombre: string, esposo_apellidos: string, esposa_nombre: string, esposa_apellidos: string, miembro_origen?: { __typename?: 'Member', miembro_id: string, numero_socio: string, nombre: string, apellidos: string } | null, telefonos?: Array<{ __typename?: 'Telephone', numero_telefono: string }> | null, familiares?: Array<{ __typename?: 'Familiar', id: string, nombre: string, apellidos: string, fecha_nacimiento?: string | null, dni_nie?: string | null, correo_electronico?: string | null, telefonos?: Array<{ __typename?: 'Telephone', numero_telefono: string }> | null }> | null } };

export type AddFamilyMemberMutationVariables = Exact<{
  family_id: Scalars['ID']['input'];
  familiar: FamiliarInput;
}>;


export type AddFamilyMemberMutation = { __typename?: 'Mutation', addFamilyMember: { __typename?: 'Family', id: string, numero_socio: string, esposo_nombre: string, esposo_apellidos: string, esposa_nombre: string, esposa_apellidos: string, miembro_origen?: { __typename?: 'Member', miembro_id: string, numero_socio: string, nombre: string, apellidos: string } | null, telefonos?: Array<{ __typename?: 'Telephone', numero_telefono: string }> | null, familiares?: Array<{ __typename?: 'Familiar', id: string, nombre: string, apellidos: string, fecha_nacimiento?: string | null, dni_nie?: string | null, correo_electronico?: string | null, telefonos?: Array<{ __typename?: 'Telephone', numero_telefono: string }> | null }> | null } };

export type RemoveFamilyMemberMutationVariables = Exact<{
  familiar_id: Scalars['ID']['input'];
}>;


export type RemoveFamilyMemberMutation = { __typename?: 'Mutation', removeFamilyMember: { __typename?: 'MutationResponse', success: boolean, message?: string | null, error?: string | null } };

export type ListAnnualFeesQueryVariables = Exact<{ [key: string]: never; }>;


export type ListAnnualFeesQuery = { __typename?: 'Query', listAnnualFees: Array<{ __typename?: 'MembershipFee', id: string, year: number, base_fee_amount: number, family_fee_extra: number, due_date: string }> };

export type GenerateAnnualFeesMutationVariables = Exact<{
  input: GenerateAnnualFeesInput;
}>;


export type GenerateAnnualFeesMutation = { __typename?: 'Mutation', generateAnnualFees: { __typename?: 'GenerateAnnualFeesResponse', year: number, membership_fee_id: string, payments_generated: number, payments_existing: number, total_members: number, total_expected_amount: number, details: Array<{ __typename?: 'PaymentGenerationDetail', member_id: string, member_number: string, member_name: string, amount: number, was_created: boolean, error?: string | null }> } };

export type HealthQueryVariables = Exact<{ [key: string]: never; }>;


export type HealthQuery = { __typename?: 'Query', health: string };

export type PingQueryVariables = Exact<{ [key: string]: never; }>;


export type PingQuery = { __typename?: 'Query', ping: string };

export type ValidateDocumentQueryVariables = Exact<{
  documentNumber: Scalars['String']['input'];
}>;


export type ValidateDocumentQuery = { __typename?: 'Query', checkDocumentValidity: { __typename?: 'DocumentValidationResult', isValid: boolean, normalizedValue?: string | null, errorMessage?: string | null } };

export type CheckMemberNumberExistsQueryVariables = Exact<{
  memberNumber: Scalars['String']['input'];
}>;


export type CheckMemberNumberExistsQuery = { __typename?: 'Query', checkMemberNumberExists: boolean };

export type GetNextMemberNumberQueryVariables = Exact<{
  isFamily: Scalars['Boolean']['input'];
}>;


export type GetNextMemberNumberQuery = { __typename?: 'Query', getNextMemberNumber: string };

export type GetMemberQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetMemberQuery = { __typename?: 'Query', getMember?: { __typename?: 'Member', miembro_id: string, numero_socio: string, tipo_membresia: MembershipType, nombre: string, apellidos: string, calle_numero_piso: string, codigo_postal: string, poblacion: string, provincia: string, pais: string, estado: MemberStatus, fecha_alta: string, fecha_baja?: string | null, fecha_nacimiento?: string | null, documento_identidad?: string | null, correo_electronico?: string | null, profesion?: string | null, nacionalidad?: string | null, observaciones?: string | null, telefonos?: Array<{ __typename?: 'Telephone', numero_telefono: string }> | null } | null };

export type ListMembersQueryVariables = Exact<{
  filter?: InputMaybe<MemberFilter>;
}>;


export type ListMembersQuery = { __typename?: 'Query', listMembers: { __typename?: 'MemberConnection', nodes: Array<{ __typename?: 'Member', miembro_id: string, numero_socio: string, tipo_membresia: MembershipType, nombre: string, apellidos: string, calle_numero_piso: string, codigo_postal: string, poblacion: string, provincia: string, pais: string, estado: MemberStatus, fecha_alta: string, fecha_baja?: string | null, fecha_nacimiento?: string | null, documento_identidad?: string | null, correo_electronico?: string | null, profesion?: string | null, nacionalidad?: string | null, observaciones?: string | null, telefonos?: Array<{ __typename?: 'Telephone', numero_telefono: string }> | null }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, totalCount: number } } };

export type SearchMembersQueryVariables = Exact<{
  criteria: Scalars['String']['input'];
}>;


export type SearchMembersQuery = { __typename?: 'Query', searchMembers: Array<{ __typename?: 'Member', miembro_id: string, numero_socio: string, tipo_membresia: MembershipType, nombre: string, apellidos: string, calle_numero_piso: string, codigo_postal: string, poblacion: string, provincia: string, pais: string, estado: MemberStatus, fecha_alta: string, fecha_baja?: string | null, fecha_nacimiento?: string | null, documento_identidad?: string | null, correo_electronico?: string | null, profesion?: string | null, nacionalidad?: string | null, observaciones?: string | null, telefonos?: Array<{ __typename?: 'Telephone', numero_telefono: string }> | null }> };

export type SearchMembersWithoutUserQueryVariables = Exact<{
  criteria: Scalars['String']['input'];
}>;


export type SearchMembersWithoutUserQuery = { __typename?: 'Query', searchMembersWithoutUser: Array<{ __typename?: 'Member', miembro_id: string, numero_socio: string, tipo_membresia: MembershipType, nombre: string, apellidos: string, estado: MemberStatus, documento_identidad?: string | null, correo_electronico?: string | null }> };

export type CreateMemberMutationVariables = Exact<{
  input: CreateMemberInput;
}>;


export type CreateMemberMutation = { __typename?: 'Mutation', createMember: { __typename?: 'Member', miembro_id: string, numero_socio: string, tipo_membresia: MembershipType, nombre: string, apellidos: string, calle_numero_piso: string, codigo_postal: string, poblacion: string, provincia: string, pais: string, estado: MemberStatus, fecha_alta: string, fecha_baja?: string | null, fecha_nacimiento?: string | null, documento_identidad?: string | null, correo_electronico?: string | null, profesion?: string | null, nacionalidad?: string | null, observaciones?: string | null, telefonos?: Array<{ __typename?: 'Telephone', numero_telefono: string }> | null } };

export type UpdateMemberMutationVariables = Exact<{
  input: UpdateMemberInput;
}>;


export type UpdateMemberMutation = { __typename?: 'Mutation', updateMember: { __typename?: 'Member', miembro_id: string, numero_socio: string, tipo_membresia: MembershipType, nombre: string, apellidos: string, calle_numero_piso: string, codigo_postal: string, poblacion: string, provincia: string, pais: string, estado: MemberStatus, fecha_alta: string, fecha_baja?: string | null, fecha_nacimiento?: string | null, documento_identidad?: string | null, correo_electronico?: string | null, profesion?: string | null, nacionalidad?: string | null, observaciones?: string | null, telefonos?: Array<{ __typename?: 'Telephone', numero_telefono: string }> | null } };

export type DeleteMemberMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteMemberMutation = { __typename?: 'Mutation', deleteMember: { __typename?: 'MutationResponse', success: boolean, message?: string | null, error?: string | null } };

export type ChangeMemberStatusMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  status: MemberStatus;
}>;


export type ChangeMemberStatusMutation = { __typename?: 'Mutation', changeMemberStatus: { __typename?: 'Member', miembro_id: string, numero_socio: string, tipo_membresia: MembershipType, nombre: string, apellidos: string, calle_numero_piso: string, codigo_postal: string, poblacion: string, provincia: string, pais: string, estado: MemberStatus, fecha_alta: string, fecha_baja?: string | null, fecha_nacimiento?: string | null, documento_identidad?: string | null, correo_electronico?: string | null, profesion?: string | null, nacionalidad?: string | null, observaciones?: string | null, telefonos?: Array<{ __typename?: 'Telephone', numero_telefono: string }> | null } };

export type GetPaymentQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetPaymentQuery = { __typename?: 'Query', getPayment?: { __typename?: 'Payment', id: string, amount: number, payment_date?: string | null, status: PaymentStatus, payment_method: string, notes?: string | null, member: { __typename?: 'Member', miembro_id: string, numero_socio: string, nombre: string, apellidos: string, tipo_membresia: MembershipType }, membership_fee?: { __typename?: 'MembershipFee', id: string, year: number } | null } | null };

export type GetMemberPaymentsQueryVariables = Exact<{
  memberId: Scalars['ID']['input'];
}>;


export type GetMemberPaymentsQuery = { __typename?: 'Query', getMemberPayments: Array<{ __typename?: 'Payment', id: string, amount: number, payment_date?: string | null, status: PaymentStatus, payment_method: string, notes?: string | null, member: { __typename?: 'Member', miembro_id: string, numero_socio: string, nombre: string, apellidos: string, tipo_membresia: MembershipType }, membership_fee?: { __typename?: 'MembershipFee', id: string, year: number } | null }> };

export type GetFamilyPaymentsQueryVariables = Exact<{
  familyId: Scalars['ID']['input'];
}>;


export type GetFamilyPaymentsQuery = { __typename?: 'Query', getFamilyPayments: Array<{ __typename?: 'Payment', id: string, amount: number, payment_date?: string | null, status: PaymentStatus, payment_method: string, notes?: string | null, member: { __typename?: 'Member', miembro_id: string, numero_socio: string, nombre: string, apellidos: string, tipo_membresia: MembershipType }, membership_fee?: { __typename?: 'MembershipFee', id: string, year: number } | null }> };

export type GetPaymentStatusQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetPaymentStatusQuery = { __typename?: 'Query', getPaymentStatus: PaymentStatus };

export type ListPaymentsQueryVariables = Exact<{
  filter?: InputMaybe<PaymentFilter>;
}>;


export type ListPaymentsQuery = { __typename?: 'Query', listPayments: { __typename?: 'PaymentConnection', nodes: Array<{ __typename?: 'Payment', id: string, amount: number, payment_date?: string | null, status: PaymentStatus, payment_method: string, notes?: string | null, member: { __typename?: 'Member', miembro_id: string, numero_socio: string, nombre: string, apellidos: string, tipo_membresia: MembershipType }, membership_fee?: { __typename?: 'MembershipFee', id: string, year: number } | null }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, totalCount: number } } };

export type RegisterPaymentMutationVariables = Exact<{
  input: PaymentInput;
}>;


export type RegisterPaymentMutation = { __typename?: 'Mutation', registerPayment: { __typename?: 'Payment', id: string, amount: number, payment_date?: string | null, status: PaymentStatus, payment_method: string, notes?: string | null, member: { __typename?: 'Member', miembro_id: string, numero_socio: string, nombre: string, apellidos: string, tipo_membresia: MembershipType } } };

export type UpdatePaymentMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: PaymentInput;
}>;


export type UpdatePaymentMutation = { __typename?: 'Mutation', updatePayment: { __typename?: 'Payment', id: string, amount: number, payment_date?: string | null, status: PaymentStatus, payment_method: string, notes?: string | null, member: { __typename?: 'Member', miembro_id: string, numero_socio: string, nombre: string, apellidos: string, tipo_membresia: MembershipType } } };

export type ConfirmPaymentMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  paymentMethod: Scalars['String']['input'];
  paymentDate?: InputMaybe<Scalars['Time']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  amount?: InputMaybe<Scalars['Float']['input']>;
}>;


export type ConfirmPaymentMutation = { __typename?: 'Mutation', confirmPayment: { __typename?: 'Payment', id: string, amount: number, payment_date?: string | null, status: PaymentStatus, payment_method: string, notes?: string | null, member: { __typename?: 'Member', miembro_id: string, numero_socio: string, nombre: string, apellidos: string, tipo_membresia: MembershipType } } };

export type CancelPaymentMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  reason: Scalars['String']['input'];
}>;


export type CancelPaymentMutation = { __typename?: 'Mutation', cancelPayment: { __typename?: 'MutationResponse', success: boolean, message?: string | null, error?: string | null } };

export type GetDelinquentReportQueryVariables = Exact<{
  input?: InputMaybe<DelinquentReportInput>;
}>;


export type GetDelinquentReportQuery = { __typename?: 'Query', getDelinquentReport: { __typename?: 'DelinquentReportResponse', generatedAt: string, debtors: Array<{ __typename?: 'Debtor', memberId?: string | null, familyId?: string | null, type: string, totalDebt: number, oldestDebtDays: number, oldestDebtDate: string, lastPaymentDate?: string | null, lastPaymentAmount?: number | null, member?: { __typename?: 'DebtorMemberInfo', id: string, memberNumber: string, firstName: string, lastName: string, email?: string | null, phone?: string | null, status: string } | null, family?: { __typename?: 'DebtorFamilyInfo', id: string, familyName: string, totalMembers: number, primaryMember: { __typename?: 'DebtorMemberInfo', id: string, memberNumber: string, firstName: string, lastName: string, email?: string | null, phone?: string | null } } | null, pendingPayments: Array<{ __typename?: 'PendingPayment', id: string, amount: number, createdAt: string, daysOverdue: number, notes?: string | null }> }>, pageInfo: { __typename?: 'PageInfo', totalCount: number, hasNextPage: boolean, hasPreviousPage: boolean }, summary: { __typename?: 'DelinquentSummary', totalDebtors: number, individualDebtors: number, familyDebtors: number, totalDebtAmount: number, averageDaysOverdue: number, averageDebtPerDebtor: number } } };

export type HealthCheckQueryVariables = Exact<{ [key: string]: never; }>;


export type HealthCheckQuery = { __typename?: 'Query', health: string };

export type GetUserQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetUserQuery = { __typename?: 'Query', getUser?: { __typename?: 'User', id: string, username: string, email: string, role: UserRole, isActive: boolean, lastLogin?: string | null, emailVerified: boolean, emailVerifiedAt?: string | null, member?: { __typename?: 'Member', miembro_id: string, numero_socio: string, nombre: string, apellidos: string, correo_electronico?: string | null } | null } | null };

export type ListUsersQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
}>;


export type ListUsersQuery = { __typename?: 'Query', listUsers: { __typename?: 'UserConnection', nodes: Array<{ __typename?: 'User', id: string, username: string, email: string, role: UserRole, isActive: boolean, lastLogin?: string | null, emailVerified: boolean, emailVerifiedAt?: string | null, member?: { __typename?: 'Member', miembro_id: string, numero_socio: string, nombre: string, apellidos: string, correo_electronico?: string | null } | null }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, totalCount: number } } };

export type CreateUserMutationVariables = Exact<{
  input: CreateUserInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'User', id: string, username: string, email: string, role: UserRole, isActive: boolean, lastLogin?: string | null, emailVerified: boolean, emailVerifiedAt?: string | null, member?: { __typename?: 'Member', miembro_id: string, numero_socio: string, nombre: string, apellidos: string, correo_electronico?: string | null } | null } };

export type UpdateUserMutationVariables = Exact<{
  input: UpdateUserInput;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'User', id: string, username: string, email: string, role: UserRole, isActive: boolean, lastLogin?: string | null, emailVerified: boolean, emailVerifiedAt?: string | null, member?: { __typename?: 'Member', miembro_id: string, numero_socio: string, nombre: string, apellidos: string, correo_electronico?: string | null } | null } };

export type DeleteUserMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteUserMutation = { __typename?: 'Mutation', deleteUser: { __typename?: 'MutationResponse', success: boolean, message?: string | null, error?: string | null } };

export type ResetUserPasswordMutationVariables = Exact<{
  userId: Scalars['ID']['input'];
  newPassword: Scalars['String']['input'];
}>;


export type ResetUserPasswordMutation = { __typename?: 'Mutation', resetUserPassword: { __typename?: 'MutationResponse', success: boolean, message?: string | null, error?: string | null } };

export const MemberBasicInfoFragmentDoc = gql`
    fragment MemberBasicInfo on Member {
  miembro_id
  numero_socio
  nombre
  apellidos
  tipo_membresia
  estado
}
    `;
export const MemberFullInfoFragmentDoc = gql`
    fragment MemberFullInfo on Member {
  miembro_id
  numero_socio
  tipo_membresia
  nombre
  apellidos
  calle_numero_piso
  codigo_postal
  poblacion
  provincia
  pais
  estado
  fecha_alta
  fecha_baja
  fecha_nacimiento
  documento_identidad
  correo_electronico
  profesion
  nacionalidad
  observaciones
}
    `;
export const FamilyBasicInfoFragmentDoc = gql`
    fragment FamilyBasicInfo on Family {
  id
  numero_socio
  esposo_nombre
  esposo_apellidos
  esposa_nombre
  esposa_apellidos
}
    `;
export const FamiliarInfoFragmentDoc = gql`
    fragment FamiliarInfo on Familiar {
  id
  nombre
  apellidos
  fecha_nacimiento
  dni_nie
  correo_electronico
}
    `;
export const UserInfoFragmentDoc = gql`
    fragment UserInfo on User {
  id
  username
  email
  role
  isActive
  lastLogin
  emailVerified
  emailVerifiedAt
}
    `;
export const PaymentInfoFragmentDoc = gql`
    fragment PaymentInfo on Payment {
  id
  amount
  payment_date
  status
  payment_method
  notes
}
    `;
export const CashFlowInfoFragmentDoc = gql`
    fragment CashFlowInfo on CashFlow {
  id
  amount
  date
  operation_type
  detail
}
    `;
export const PageInfoFragmentFragmentDoc = gql`
    fragment PageInfoFragment on PageInfo {
  hasNextPage
  hasPreviousPage
  totalCount
}
    `;
export const MutationResultFragmentDoc = gql`
    fragment MutationResult on MutationResponse {
  success
  message
  error
}
    `;
export const CashFlowTransactionFieldsFragmentDoc = gql`
    fragment CashFlowTransactionFields on CashFlow {
  id
  date
  operation_type
  amount
  detail
  running_balance
  created_at
  member {
    miembro_id
    numero_socio
    nombre
    apellidos
  }
  payment {
    id
  }
}
    `;
export const GetCurrentUserDocument = gql`
    query GetCurrentUser {
  getCurrentUser {
    id
    username
    email
    role
    member {
      miembro_id
      numero_socio
      nombre
      apellidos
      correo_electronico
    }
    isActive
    lastLogin
    emailVerified
    emailVerifiedAt
  }
}
    `;

/**
 * __useGetCurrentUserQuery__
 *
 * To run a query within a React component, call `useGetCurrentUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCurrentUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCurrentUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCurrentUserQuery(baseOptions?: Apollo.QueryHookOptions<GetCurrentUserQuery, GetCurrentUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCurrentUserQuery, GetCurrentUserQueryVariables>(GetCurrentUserDocument, options);
      }
export function useGetCurrentUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCurrentUserQuery, GetCurrentUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCurrentUserQuery, GetCurrentUserQueryVariables>(GetCurrentUserDocument, options);
        }
export function useGetCurrentUserSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCurrentUserQuery, GetCurrentUserQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCurrentUserQuery, GetCurrentUserQueryVariables>(GetCurrentUserDocument, options);
        }
export type GetCurrentUserQueryHookResult = ReturnType<typeof useGetCurrentUserQuery>;
export type GetCurrentUserLazyQueryHookResult = ReturnType<typeof useGetCurrentUserLazyQuery>;
export type GetCurrentUserSuspenseQueryHookResult = ReturnType<typeof useGetCurrentUserSuspenseQuery>;
export type GetCurrentUserQueryResult = Apollo.QueryResult<GetCurrentUserQuery, GetCurrentUserQueryVariables>;
export const LoginDocument = gql`
    mutation Login($input: LoginInput!) {
  login(input: $input) {
    user {
      id
      username
      email
      role
      member {
        miembro_id
        numero_socio
        nombre
        apellidos
        correo_electronico
      }
      isActive
      lastLogin
      emailVerified
      emailVerifiedAt
    }
    accessToken
    refreshToken
    expiresAt
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout {
    success
    message
    error
  }
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const RefreshTokenDocument = gql`
    mutation RefreshToken($input: RefreshTokenInput!) {
  refreshToken(input: $input) {
    accessToken
    refreshToken
    expiresAt
  }
}
    `;
export type RefreshTokenMutationFn = Apollo.MutationFunction<RefreshTokenMutation, RefreshTokenMutationVariables>;

/**
 * __useRefreshTokenMutation__
 *
 * To run a mutation, you first call `useRefreshTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRefreshTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [refreshTokenMutation, { data, loading, error }] = useRefreshTokenMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRefreshTokenMutation(baseOptions?: Apollo.MutationHookOptions<RefreshTokenMutation, RefreshTokenMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RefreshTokenMutation, RefreshTokenMutationVariables>(RefreshTokenDocument, options);
      }
export type RefreshTokenMutationHookResult = ReturnType<typeof useRefreshTokenMutation>;
export type RefreshTokenMutationResult = Apollo.MutationResult<RefreshTokenMutation>;
export type RefreshTokenMutationOptions = Apollo.BaseMutationOptions<RefreshTokenMutation, RefreshTokenMutationVariables>;
export const ChangePasswordDocument = gql`
    mutation ChangePassword($input: ChangePasswordInput!) {
  changePassword(input: $input) {
    success
    message
    error
  }
}
    `;
export type ChangePasswordMutationFn = Apollo.MutationFunction<ChangePasswordMutation, ChangePasswordMutationVariables>;

/**
 * __useChangePasswordMutation__
 *
 * To run a mutation, you first call `useChangePasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangePasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changePasswordMutation, { data, loading, error }] = useChangePasswordMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useChangePasswordMutation(baseOptions?: Apollo.MutationHookOptions<ChangePasswordMutation, ChangePasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument, options);
      }
export type ChangePasswordMutationHookResult = ReturnType<typeof useChangePasswordMutation>;
export type ChangePasswordMutationResult = Apollo.MutationResult<ChangePasswordMutation>;
export type ChangePasswordMutationOptions = Apollo.BaseMutationOptions<ChangePasswordMutation, ChangePasswordMutationVariables>;
export const SendVerificationEmailDocument = gql`
    mutation SendVerificationEmail {
  sendVerificationEmail {
    success
    message
    error
  }
}
    `;
export type SendVerificationEmailMutationFn = Apollo.MutationFunction<SendVerificationEmailMutation, SendVerificationEmailMutationVariables>;

/**
 * __useSendVerificationEmailMutation__
 *
 * To run a mutation, you first call `useSendVerificationEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendVerificationEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendVerificationEmailMutation, { data, loading, error }] = useSendVerificationEmailMutation({
 *   variables: {
 *   },
 * });
 */
export function useSendVerificationEmailMutation(baseOptions?: Apollo.MutationHookOptions<SendVerificationEmailMutation, SendVerificationEmailMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendVerificationEmailMutation, SendVerificationEmailMutationVariables>(SendVerificationEmailDocument, options);
      }
export type SendVerificationEmailMutationHookResult = ReturnType<typeof useSendVerificationEmailMutation>;
export type SendVerificationEmailMutationResult = Apollo.MutationResult<SendVerificationEmailMutation>;
export type SendVerificationEmailMutationOptions = Apollo.BaseMutationOptions<SendVerificationEmailMutation, SendVerificationEmailMutationVariables>;
export const VerifyEmailDocument = gql`
    mutation VerifyEmail($token: String!) {
  verifyEmail(token: $token) {
    success
    message
    error
  }
}
    `;
export type VerifyEmailMutationFn = Apollo.MutationFunction<VerifyEmailMutation, VerifyEmailMutationVariables>;

/**
 * __useVerifyEmailMutation__
 *
 * To run a mutation, you first call `useVerifyEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVerifyEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [verifyEmailMutation, { data, loading, error }] = useVerifyEmailMutation({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useVerifyEmailMutation(baseOptions?: Apollo.MutationHookOptions<VerifyEmailMutation, VerifyEmailMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<VerifyEmailMutation, VerifyEmailMutationVariables>(VerifyEmailDocument, options);
      }
export type VerifyEmailMutationHookResult = ReturnType<typeof useVerifyEmailMutation>;
export type VerifyEmailMutationResult = Apollo.MutationResult<VerifyEmailMutation>;
export type VerifyEmailMutationOptions = Apollo.BaseMutationOptions<VerifyEmailMutation, VerifyEmailMutationVariables>;
export const ResendVerificationEmailDocument = gql`
    mutation ResendVerificationEmail($email: String!) {
  resendVerificationEmail(email: $email) {
    success
    message
    error
  }
}
    `;
export type ResendVerificationEmailMutationFn = Apollo.MutationFunction<ResendVerificationEmailMutation, ResendVerificationEmailMutationVariables>;

/**
 * __useResendVerificationEmailMutation__
 *
 * To run a mutation, you first call `useResendVerificationEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResendVerificationEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resendVerificationEmailMutation, { data, loading, error }] = useResendVerificationEmailMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useResendVerificationEmailMutation(baseOptions?: Apollo.MutationHookOptions<ResendVerificationEmailMutation, ResendVerificationEmailMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ResendVerificationEmailMutation, ResendVerificationEmailMutationVariables>(ResendVerificationEmailDocument, options);
      }
export type ResendVerificationEmailMutationHookResult = ReturnType<typeof useResendVerificationEmailMutation>;
export type ResendVerificationEmailMutationResult = Apollo.MutationResult<ResendVerificationEmailMutation>;
export type ResendVerificationEmailMutationOptions = Apollo.BaseMutationOptions<ResendVerificationEmailMutation, ResendVerificationEmailMutationVariables>;
export const RequestPasswordResetDocument = gql`
    mutation RequestPasswordReset($email: String!) {
  requestPasswordReset(email: $email) {
    success
    message
    error
  }
}
    `;
export type RequestPasswordResetMutationFn = Apollo.MutationFunction<RequestPasswordResetMutation, RequestPasswordResetMutationVariables>;

/**
 * __useRequestPasswordResetMutation__
 *
 * To run a mutation, you first call `useRequestPasswordResetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRequestPasswordResetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [requestPasswordResetMutation, { data, loading, error }] = useRequestPasswordResetMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useRequestPasswordResetMutation(baseOptions?: Apollo.MutationHookOptions<RequestPasswordResetMutation, RequestPasswordResetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RequestPasswordResetMutation, RequestPasswordResetMutationVariables>(RequestPasswordResetDocument, options);
      }
export type RequestPasswordResetMutationHookResult = ReturnType<typeof useRequestPasswordResetMutation>;
export type RequestPasswordResetMutationResult = Apollo.MutationResult<RequestPasswordResetMutation>;
export type RequestPasswordResetMutationOptions = Apollo.BaseMutationOptions<RequestPasswordResetMutation, RequestPasswordResetMutationVariables>;
export const ResetPasswordWithTokenDocument = gql`
    mutation ResetPasswordWithToken($token: String!, $newPassword: String!) {
  resetPasswordWithToken(token: $token, newPassword: $newPassword) {
    success
    message
    error
  }
}
    `;
export type ResetPasswordWithTokenMutationFn = Apollo.MutationFunction<ResetPasswordWithTokenMutation, ResetPasswordWithTokenMutationVariables>;

/**
 * __useResetPasswordWithTokenMutation__
 *
 * To run a mutation, you first call `useResetPasswordWithTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResetPasswordWithTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resetPasswordWithTokenMutation, { data, loading, error }] = useResetPasswordWithTokenMutation({
 *   variables: {
 *      token: // value for 'token'
 *      newPassword: // value for 'newPassword'
 *   },
 * });
 */
export function useResetPasswordWithTokenMutation(baseOptions?: Apollo.MutationHookOptions<ResetPasswordWithTokenMutation, ResetPasswordWithTokenMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ResetPasswordWithTokenMutation, ResetPasswordWithTokenMutationVariables>(ResetPasswordWithTokenDocument, options);
      }
export type ResetPasswordWithTokenMutationHookResult = ReturnType<typeof useResetPasswordWithTokenMutation>;
export type ResetPasswordWithTokenMutationResult = Apollo.MutationResult<ResetPasswordWithTokenMutation>;
export type ResetPasswordWithTokenMutationOptions = Apollo.BaseMutationOptions<ResetPasswordWithTokenMutation, ResetPasswordWithTokenMutationVariables>;
export const GetCashFlowsDocument = gql`
    query GetCashFlows($filter: TransactionFilter) {
  getTransactions(filter: $filter) {
    nodes {
      ...CashFlowTransactionFields
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      totalCount
    }
  }
}
    ${CashFlowTransactionFieldsFragmentDoc}`;

/**
 * __useGetCashFlowsQuery__
 *
 * To run a query within a React component, call `useGetCashFlowsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCashFlowsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCashFlowsQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useGetCashFlowsQuery(baseOptions?: Apollo.QueryHookOptions<GetCashFlowsQuery, GetCashFlowsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCashFlowsQuery, GetCashFlowsQueryVariables>(GetCashFlowsDocument, options);
      }
export function useGetCashFlowsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCashFlowsQuery, GetCashFlowsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCashFlowsQuery, GetCashFlowsQueryVariables>(GetCashFlowsDocument, options);
        }
export function useGetCashFlowsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCashFlowsQuery, GetCashFlowsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCashFlowsQuery, GetCashFlowsQueryVariables>(GetCashFlowsDocument, options);
        }
export type GetCashFlowsQueryHookResult = ReturnType<typeof useGetCashFlowsQuery>;
export type GetCashFlowsLazyQueryHookResult = ReturnType<typeof useGetCashFlowsLazyQuery>;
export type GetCashFlowsSuspenseQueryHookResult = ReturnType<typeof useGetCashFlowsSuspenseQuery>;
export type GetCashFlowsQueryResult = Apollo.QueryResult<GetCashFlowsQuery, GetCashFlowsQueryVariables>;
export const GetCashFlowBalanceDocument = gql`
    query GetCashFlowBalance {
  cashFlowBalance {
    totalIncome
    totalExpenses
    currentBalance
  }
}
    `;

/**
 * __useGetCashFlowBalanceQuery__
 *
 * To run a query within a React component, call `useGetCashFlowBalanceQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCashFlowBalanceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCashFlowBalanceQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCashFlowBalanceQuery(baseOptions?: Apollo.QueryHookOptions<GetCashFlowBalanceQuery, GetCashFlowBalanceQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCashFlowBalanceQuery, GetCashFlowBalanceQueryVariables>(GetCashFlowBalanceDocument, options);
      }
export function useGetCashFlowBalanceLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCashFlowBalanceQuery, GetCashFlowBalanceQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCashFlowBalanceQuery, GetCashFlowBalanceQueryVariables>(GetCashFlowBalanceDocument, options);
        }
export function useGetCashFlowBalanceSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCashFlowBalanceQuery, GetCashFlowBalanceQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCashFlowBalanceQuery, GetCashFlowBalanceQueryVariables>(GetCashFlowBalanceDocument, options);
        }
export type GetCashFlowBalanceQueryHookResult = ReturnType<typeof useGetCashFlowBalanceQuery>;
export type GetCashFlowBalanceLazyQueryHookResult = ReturnType<typeof useGetCashFlowBalanceLazyQuery>;
export type GetCashFlowBalanceSuspenseQueryHookResult = ReturnType<typeof useGetCashFlowBalanceSuspenseQuery>;
export type GetCashFlowBalanceQueryResult = Apollo.QueryResult<GetCashFlowBalanceQuery, GetCashFlowBalanceQueryVariables>;
export const GetCashFlowDocument = gql`
    query GetCashFlow($id: ID!) {
  getCashFlow(id: $id) {
    ...CashFlowTransactionFields
  }
}
    ${CashFlowTransactionFieldsFragmentDoc}`;

/**
 * __useGetCashFlowQuery__
 *
 * To run a query within a React component, call `useGetCashFlowQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCashFlowQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCashFlowQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetCashFlowQuery(baseOptions: Apollo.QueryHookOptions<GetCashFlowQuery, GetCashFlowQueryVariables> & ({ variables: GetCashFlowQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCashFlowQuery, GetCashFlowQueryVariables>(GetCashFlowDocument, options);
      }
export function useGetCashFlowLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCashFlowQuery, GetCashFlowQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCashFlowQuery, GetCashFlowQueryVariables>(GetCashFlowDocument, options);
        }
export function useGetCashFlowSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCashFlowQuery, GetCashFlowQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCashFlowQuery, GetCashFlowQueryVariables>(GetCashFlowDocument, options);
        }
export type GetCashFlowQueryHookResult = ReturnType<typeof useGetCashFlowQuery>;
export type GetCashFlowLazyQueryHookResult = ReturnType<typeof useGetCashFlowLazyQuery>;
export type GetCashFlowSuspenseQueryHookResult = ReturnType<typeof useGetCashFlowSuspenseQuery>;
export type GetCashFlowQueryResult = Apollo.QueryResult<GetCashFlowQuery, GetCashFlowQueryVariables>;
export const CreateCashFlowDocument = gql`
    mutation CreateCashFlow($input: CreateCashFlowInput!) {
  createCashFlow(input: $input) {
    ...CashFlowTransactionFields
  }
}
    ${CashFlowTransactionFieldsFragmentDoc}`;
export type CreateCashFlowMutationFn = Apollo.MutationFunction<CreateCashFlowMutation, CreateCashFlowMutationVariables>;

/**
 * __useCreateCashFlowMutation__
 *
 * To run a mutation, you first call `useCreateCashFlowMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCashFlowMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCashFlowMutation, { data, loading, error }] = useCreateCashFlowMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateCashFlowMutation(baseOptions?: Apollo.MutationHookOptions<CreateCashFlowMutation, CreateCashFlowMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCashFlowMutation, CreateCashFlowMutationVariables>(CreateCashFlowDocument, options);
      }
export type CreateCashFlowMutationHookResult = ReturnType<typeof useCreateCashFlowMutation>;
export type CreateCashFlowMutationResult = Apollo.MutationResult<CreateCashFlowMutation>;
export type CreateCashFlowMutationOptions = Apollo.BaseMutationOptions<CreateCashFlowMutation, CreateCashFlowMutationVariables>;
export const UpdateCashFlowDocument = gql`
    mutation UpdateCashFlow($id: ID!, $input: UpdateCashFlowInput!) {
  updateCashFlow(id: $id, input: $input) {
    ...CashFlowTransactionFields
  }
}
    ${CashFlowTransactionFieldsFragmentDoc}`;
export type UpdateCashFlowMutationFn = Apollo.MutationFunction<UpdateCashFlowMutation, UpdateCashFlowMutationVariables>;

/**
 * __useUpdateCashFlowMutation__
 *
 * To run a mutation, you first call `useUpdateCashFlowMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCashFlowMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCashFlowMutation, { data, loading, error }] = useUpdateCashFlowMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateCashFlowMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCashFlowMutation, UpdateCashFlowMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCashFlowMutation, UpdateCashFlowMutationVariables>(UpdateCashFlowDocument, options);
      }
export type UpdateCashFlowMutationHookResult = ReturnType<typeof useUpdateCashFlowMutation>;
export type UpdateCashFlowMutationResult = Apollo.MutationResult<UpdateCashFlowMutation>;
export type UpdateCashFlowMutationOptions = Apollo.BaseMutationOptions<UpdateCashFlowMutation, UpdateCashFlowMutationVariables>;
export const DeleteCashFlowDocument = gql`
    mutation DeleteCashFlow($id: ID!) {
  deleteCashFlow(id: $id) {
    success
    message
  }
}
    `;
export type DeleteCashFlowMutationFn = Apollo.MutationFunction<DeleteCashFlowMutation, DeleteCashFlowMutationVariables>;

/**
 * __useDeleteCashFlowMutation__
 *
 * To run a mutation, you first call `useDeleteCashFlowMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCashFlowMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCashFlowMutation, { data, loading, error }] = useDeleteCashFlowMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteCashFlowMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCashFlowMutation, DeleteCashFlowMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteCashFlowMutation, DeleteCashFlowMutationVariables>(DeleteCashFlowDocument, options);
      }
export type DeleteCashFlowMutationHookResult = ReturnType<typeof useDeleteCashFlowMutation>;
export type DeleteCashFlowMutationResult = Apollo.MutationResult<DeleteCashFlowMutation>;
export type DeleteCashFlowMutationOptions = Apollo.BaseMutationOptions<DeleteCashFlowMutation, DeleteCashFlowMutationVariables>;
export const RegisterTransactionDocument = gql`
    mutation RegisterTransaction($input: TransactionInput!) {
  registerTransaction(input: $input) {
    id
    amount
    date
    operation_type
    detail
    member {
      miembro_id
      numero_socio
      nombre
      apellidos
      tipo_membresia
    }
    payment {
      id
      amount
      payment_date
      status
      payment_method
    }
  }
}
    `;
export type RegisterTransactionMutationFn = Apollo.MutationFunction<RegisterTransactionMutation, RegisterTransactionMutationVariables>;

/**
 * __useRegisterTransactionMutation__
 *
 * To run a mutation, you first call `useRegisterTransactionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterTransactionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerTransactionMutation, { data, loading, error }] = useRegisterTransactionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRegisterTransactionMutation(baseOptions?: Apollo.MutationHookOptions<RegisterTransactionMutation, RegisterTransactionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterTransactionMutation, RegisterTransactionMutationVariables>(RegisterTransactionDocument, options);
      }
export type RegisterTransactionMutationHookResult = ReturnType<typeof useRegisterTransactionMutation>;
export type RegisterTransactionMutationResult = Apollo.MutationResult<RegisterTransactionMutation>;
export type RegisterTransactionMutationOptions = Apollo.BaseMutationOptions<RegisterTransactionMutation, RegisterTransactionMutationVariables>;
export const UpdateTransactionDocument = gql`
    mutation UpdateTransaction($id: ID!, $input: TransactionInput!) {
  updateTransaction(id: $id, input: $input) {
    id
    amount
    date
    operation_type
    detail
    member {
      miembro_id
      numero_socio
      nombre
      apellidos
      tipo_membresia
    }
    payment {
      id
      amount
      payment_date
      status
      payment_method
    }
  }
}
    `;
export type UpdateTransactionMutationFn = Apollo.MutationFunction<UpdateTransactionMutation, UpdateTransactionMutationVariables>;

/**
 * __useUpdateTransactionMutation__
 *
 * To run a mutation, you first call `useUpdateTransactionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTransactionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTransactionMutation, { data, loading, error }] = useUpdateTransactionMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateTransactionMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTransactionMutation, UpdateTransactionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTransactionMutation, UpdateTransactionMutationVariables>(UpdateTransactionDocument, options);
      }
export type UpdateTransactionMutationHookResult = ReturnType<typeof useUpdateTransactionMutation>;
export type UpdateTransactionMutationResult = Apollo.MutationResult<UpdateTransactionMutation>;
export type UpdateTransactionMutationOptions = Apollo.BaseMutationOptions<UpdateTransactionMutation, UpdateTransactionMutationVariables>;
export const AdjustBalanceDocument = gql`
    mutation AdjustBalance($amount: Float!, $reason: String!) {
  adjustBalance(amount: $amount, reason: $reason) {
    success
    message
    error
  }
}
    `;
export type AdjustBalanceMutationFn = Apollo.MutationFunction<AdjustBalanceMutation, AdjustBalanceMutationVariables>;

/**
 * __useAdjustBalanceMutation__
 *
 * To run a mutation, you first call `useAdjustBalanceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdjustBalanceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adjustBalanceMutation, { data, loading, error }] = useAdjustBalanceMutation({
 *   variables: {
 *      amount: // value for 'amount'
 *      reason: // value for 'reason'
 *   },
 * });
 */
export function useAdjustBalanceMutation(baseOptions?: Apollo.MutationHookOptions<AdjustBalanceMutation, AdjustBalanceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AdjustBalanceMutation, AdjustBalanceMutationVariables>(AdjustBalanceDocument, options);
      }
export type AdjustBalanceMutationHookResult = ReturnType<typeof useAdjustBalanceMutation>;
export type AdjustBalanceMutationResult = Apollo.MutationResult<AdjustBalanceMutation>;
export type AdjustBalanceMutationOptions = Apollo.BaseMutationOptions<AdjustBalanceMutation, AdjustBalanceMutationVariables>;
export const GetDashboardStatsDocument = gql`
    query GetDashboardStats {
  getDashboardStats {
    totalMembers
    activeMembers
    inactiveMembers
    individualMembers
    familyMembers
    newMembersThisMonth
    newMembersLastMonth
    memberGrowthPercentage
    totalRevenue
    monthlyRevenue
    pendingPayments
    averagePayment
    paymentCompletionRate
    revenueGrowthPercentage
    currentBalance
    monthlyExpenses
    totalTransactions
    recentPaymentsCount
    membershipTrend {
      month
      newMembers
      totalMembers
    }
    revenueTrend {
      month
      revenue
      expenses
    }
  }
}
    `;

/**
 * __useGetDashboardStatsQuery__
 *
 * To run a query within a React component, call `useGetDashboardStatsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDashboardStatsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDashboardStatsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetDashboardStatsQuery(baseOptions?: Apollo.QueryHookOptions<GetDashboardStatsQuery, GetDashboardStatsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDashboardStatsQuery, GetDashboardStatsQueryVariables>(GetDashboardStatsDocument, options);
      }
export function useGetDashboardStatsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDashboardStatsQuery, GetDashboardStatsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDashboardStatsQuery, GetDashboardStatsQueryVariables>(GetDashboardStatsDocument, options);
        }
export function useGetDashboardStatsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetDashboardStatsQuery, GetDashboardStatsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetDashboardStatsQuery, GetDashboardStatsQueryVariables>(GetDashboardStatsDocument, options);
        }
export type GetDashboardStatsQueryHookResult = ReturnType<typeof useGetDashboardStatsQuery>;
export type GetDashboardStatsLazyQueryHookResult = ReturnType<typeof useGetDashboardStatsLazyQuery>;
export type GetDashboardStatsSuspenseQueryHookResult = ReturnType<typeof useGetDashboardStatsSuspenseQuery>;
export type GetDashboardStatsQueryResult = Apollo.QueryResult<GetDashboardStatsQuery, GetDashboardStatsQueryVariables>;
export const GetRecentActivityDocument = gql`
    query GetRecentActivity($limit: Int) {
  getRecentActivity(limit: $limit) {
    id
    type
    description
    timestamp
    amount
    relatedMember {
      miembro_id
      nombre
      apellidos
    }
    relatedFamily {
      id
      esposo_nombre
      esposa_nombre
    }
  }
}
    `;

/**
 * __useGetRecentActivityQuery__
 *
 * To run a query within a React component, call `useGetRecentActivityQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRecentActivityQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRecentActivityQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetRecentActivityQuery(baseOptions?: Apollo.QueryHookOptions<GetRecentActivityQuery, GetRecentActivityQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRecentActivityQuery, GetRecentActivityQueryVariables>(GetRecentActivityDocument, options);
      }
export function useGetRecentActivityLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRecentActivityQuery, GetRecentActivityQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRecentActivityQuery, GetRecentActivityQueryVariables>(GetRecentActivityDocument, options);
        }
export function useGetRecentActivitySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetRecentActivityQuery, GetRecentActivityQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetRecentActivityQuery, GetRecentActivityQueryVariables>(GetRecentActivityDocument, options);
        }
export type GetRecentActivityQueryHookResult = ReturnType<typeof useGetRecentActivityQuery>;
export type GetRecentActivityLazyQueryHookResult = ReturnType<typeof useGetRecentActivityLazyQuery>;
export type GetRecentActivitySuspenseQueryHookResult = ReturnType<typeof useGetRecentActivitySuspenseQuery>;
export type GetRecentActivityQueryResult = Apollo.QueryResult<GetRecentActivityQuery, GetRecentActivityQueryVariables>;
export const GetFamilyDocument = gql`
    query GetFamily($id: ID!) {
  getFamily(id: $id) {
    id
    numero_socio
    miembro_origen {
      miembro_id
      numero_socio
      nombre
      apellidos
    }
    esposo_nombre
    esposo_apellidos
    esposa_nombre
    esposa_apellidos
    telefonos {
      numero_telefono
    }
    familiares {
      id
      nombre
      apellidos
      fecha_nacimiento
      dni_nie
      correo_electronico
      telefonos {
        numero_telefono
      }
    }
  }
}
    `;

/**
 * __useGetFamilyQuery__
 *
 * To run a query within a React component, call `useGetFamilyQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFamilyQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFamilyQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetFamilyQuery(baseOptions: Apollo.QueryHookOptions<GetFamilyQuery, GetFamilyQueryVariables> & ({ variables: GetFamilyQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFamilyQuery, GetFamilyQueryVariables>(GetFamilyDocument, options);
      }
export function useGetFamilyLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFamilyQuery, GetFamilyQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFamilyQuery, GetFamilyQueryVariables>(GetFamilyDocument, options);
        }
export function useGetFamilySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetFamilyQuery, GetFamilyQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetFamilyQuery, GetFamilyQueryVariables>(GetFamilyDocument, options);
        }
export type GetFamilyQueryHookResult = ReturnType<typeof useGetFamilyQuery>;
export type GetFamilyLazyQueryHookResult = ReturnType<typeof useGetFamilyLazyQuery>;
export type GetFamilySuspenseQueryHookResult = ReturnType<typeof useGetFamilySuspenseQuery>;
export type GetFamilyQueryResult = Apollo.QueryResult<GetFamilyQuery, GetFamilyQueryVariables>;
export const GetFamilyByOriginMemberDocument = gql`
    query GetFamilyByOriginMember($memberId: ID!) {
  getFamilyByOriginMember(memberId: $memberId) {
    id
    numero_socio
    miembro_origen {
      miembro_id
      numero_socio
      nombre
      apellidos
    }
    esposo_nombre
    esposo_apellidos
    esposa_nombre
    esposa_apellidos
    esposa_fecha_nacimiento
    esposa_documento_identidad
    esposa_correo_electronico
    telefonos {
      numero_telefono
    }
    familiares {
      id
      nombre
      apellidos
      fecha_nacimiento
      dni_nie
      correo_electronico
      telefonos {
        numero_telefono
      }
    }
  }
}
    `;

/**
 * __useGetFamilyByOriginMemberQuery__
 *
 * To run a query within a React component, call `useGetFamilyByOriginMemberQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFamilyByOriginMemberQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFamilyByOriginMemberQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useGetFamilyByOriginMemberQuery(baseOptions: Apollo.QueryHookOptions<GetFamilyByOriginMemberQuery, GetFamilyByOriginMemberQueryVariables> & ({ variables: GetFamilyByOriginMemberQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFamilyByOriginMemberQuery, GetFamilyByOriginMemberQueryVariables>(GetFamilyByOriginMemberDocument, options);
      }
export function useGetFamilyByOriginMemberLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFamilyByOriginMemberQuery, GetFamilyByOriginMemberQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFamilyByOriginMemberQuery, GetFamilyByOriginMemberQueryVariables>(GetFamilyByOriginMemberDocument, options);
        }
export function useGetFamilyByOriginMemberSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetFamilyByOriginMemberQuery, GetFamilyByOriginMemberQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetFamilyByOriginMemberQuery, GetFamilyByOriginMemberQueryVariables>(GetFamilyByOriginMemberDocument, options);
        }
export type GetFamilyByOriginMemberQueryHookResult = ReturnType<typeof useGetFamilyByOriginMemberQuery>;
export type GetFamilyByOriginMemberLazyQueryHookResult = ReturnType<typeof useGetFamilyByOriginMemberLazyQuery>;
export type GetFamilyByOriginMemberSuspenseQueryHookResult = ReturnType<typeof useGetFamilyByOriginMemberSuspenseQuery>;
export type GetFamilyByOriginMemberQueryResult = Apollo.QueryResult<GetFamilyByOriginMemberQuery, GetFamilyByOriginMemberQueryVariables>;
export const ListFamiliesDocument = gql`
    query ListFamilies($filter: FamilyFilter) {
  listFamilies(filter: $filter) {
    nodes {
      id
      numero_socio
      miembro_origen {
        miembro_id
        numero_socio
        nombre
        apellidos
      }
      esposo_nombre
      esposo_apellidos
      esposa_nombre
      esposa_apellidos
      telefonos {
        numero_telefono
      }
      familiares {
        id
        nombre
        apellidos
        fecha_nacimiento
        dni_nie
        correo_electronico
        telefonos {
          numero_telefono
        }
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      totalCount
    }
  }
}
    `;

/**
 * __useListFamiliesQuery__
 *
 * To run a query within a React component, call `useListFamiliesQuery` and pass it any options that fit your needs.
 * When your component renders, `useListFamiliesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListFamiliesQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useListFamiliesQuery(baseOptions?: Apollo.QueryHookOptions<ListFamiliesQuery, ListFamiliesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListFamiliesQuery, ListFamiliesQueryVariables>(ListFamiliesDocument, options);
      }
export function useListFamiliesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListFamiliesQuery, ListFamiliesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListFamiliesQuery, ListFamiliesQueryVariables>(ListFamiliesDocument, options);
        }
export function useListFamiliesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ListFamiliesQuery, ListFamiliesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ListFamiliesQuery, ListFamiliesQueryVariables>(ListFamiliesDocument, options);
        }
export type ListFamiliesQueryHookResult = ReturnType<typeof useListFamiliesQuery>;
export type ListFamiliesLazyQueryHookResult = ReturnType<typeof useListFamiliesLazyQuery>;
export type ListFamiliesSuspenseQueryHookResult = ReturnType<typeof useListFamiliesSuspenseQuery>;
export type ListFamiliesQueryResult = Apollo.QueryResult<ListFamiliesQuery, ListFamiliesQueryVariables>;
export const GetFamilyMembersDocument = gql`
    query GetFamilyMembers($familyId: ID!) {
  getFamilyMembers(familyId: $familyId) {
    id
    nombre
    apellidos
    fecha_nacimiento
    dni_nie
    correo_electronico
    telefonos {
      numero_telefono
    }
  }
}
    `;

/**
 * __useGetFamilyMembersQuery__
 *
 * To run a query within a React component, call `useGetFamilyMembersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFamilyMembersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFamilyMembersQuery({
 *   variables: {
 *      familyId: // value for 'familyId'
 *   },
 * });
 */
export function useGetFamilyMembersQuery(baseOptions: Apollo.QueryHookOptions<GetFamilyMembersQuery, GetFamilyMembersQueryVariables> & ({ variables: GetFamilyMembersQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFamilyMembersQuery, GetFamilyMembersQueryVariables>(GetFamilyMembersDocument, options);
      }
export function useGetFamilyMembersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFamilyMembersQuery, GetFamilyMembersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFamilyMembersQuery, GetFamilyMembersQueryVariables>(GetFamilyMembersDocument, options);
        }
export function useGetFamilyMembersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetFamilyMembersQuery, GetFamilyMembersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetFamilyMembersQuery, GetFamilyMembersQueryVariables>(GetFamilyMembersDocument, options);
        }
export type GetFamilyMembersQueryHookResult = ReturnType<typeof useGetFamilyMembersQuery>;
export type GetFamilyMembersLazyQueryHookResult = ReturnType<typeof useGetFamilyMembersLazyQuery>;
export type GetFamilyMembersSuspenseQueryHookResult = ReturnType<typeof useGetFamilyMembersSuspenseQuery>;
export type GetFamilyMembersQueryResult = Apollo.QueryResult<GetFamilyMembersQuery, GetFamilyMembersQueryVariables>;
export const CreateFamilyDocument = gql`
    mutation CreateFamily($input: CreateFamilyInput!) {
  createFamily(input: $input) {
    id
    numero_socio
    miembro_origen {
      miembro_id
      numero_socio
      nombre
      apellidos
    }
    esposo_nombre
    esposo_apellidos
    esposa_nombre
    esposa_apellidos
    telefonos {
      numero_telefono
    }
    familiares {
      id
      nombre
      apellidos
      fecha_nacimiento
      dni_nie
      correo_electronico
      telefonos {
        numero_telefono
      }
    }
  }
}
    `;
export type CreateFamilyMutationFn = Apollo.MutationFunction<CreateFamilyMutation, CreateFamilyMutationVariables>;

/**
 * __useCreateFamilyMutation__
 *
 * To run a mutation, you first call `useCreateFamilyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateFamilyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createFamilyMutation, { data, loading, error }] = useCreateFamilyMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateFamilyMutation(baseOptions?: Apollo.MutationHookOptions<CreateFamilyMutation, CreateFamilyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateFamilyMutation, CreateFamilyMutationVariables>(CreateFamilyDocument, options);
      }
export type CreateFamilyMutationHookResult = ReturnType<typeof useCreateFamilyMutation>;
export type CreateFamilyMutationResult = Apollo.MutationResult<CreateFamilyMutation>;
export type CreateFamilyMutationOptions = Apollo.BaseMutationOptions<CreateFamilyMutation, CreateFamilyMutationVariables>;
export const UpdateFamilyDocument = gql`
    mutation UpdateFamily($input: UpdateFamilyInput!) {
  updateFamily(input: $input) {
    id
    numero_socio
    miembro_origen {
      miembro_id
      numero_socio
      nombre
      apellidos
    }
    esposo_nombre
    esposo_apellidos
    esposa_nombre
    esposa_apellidos
    telefonos {
      numero_telefono
    }
    familiares {
      id
      nombre
      apellidos
      fecha_nacimiento
      dni_nie
      correo_electronico
      telefonos {
        numero_telefono
      }
    }
  }
}
    `;
export type UpdateFamilyMutationFn = Apollo.MutationFunction<UpdateFamilyMutation, UpdateFamilyMutationVariables>;

/**
 * __useUpdateFamilyMutation__
 *
 * To run a mutation, you first call `useUpdateFamilyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateFamilyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateFamilyMutation, { data, loading, error }] = useUpdateFamilyMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateFamilyMutation(baseOptions?: Apollo.MutationHookOptions<UpdateFamilyMutation, UpdateFamilyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateFamilyMutation, UpdateFamilyMutationVariables>(UpdateFamilyDocument, options);
      }
export type UpdateFamilyMutationHookResult = ReturnType<typeof useUpdateFamilyMutation>;
export type UpdateFamilyMutationResult = Apollo.MutationResult<UpdateFamilyMutation>;
export type UpdateFamilyMutationOptions = Apollo.BaseMutationOptions<UpdateFamilyMutation, UpdateFamilyMutationVariables>;
export const AddFamilyMemberDocument = gql`
    mutation AddFamilyMember($family_id: ID!, $familiar: FamiliarInput!) {
  addFamilyMember(family_id: $family_id, familiar: $familiar) {
    id
    numero_socio
    miembro_origen {
      miembro_id
      numero_socio
      nombre
      apellidos
    }
    esposo_nombre
    esposo_apellidos
    esposa_nombre
    esposa_apellidos
    telefonos {
      numero_telefono
    }
    familiares {
      id
      nombre
      apellidos
      fecha_nacimiento
      dni_nie
      correo_electronico
      telefonos {
        numero_telefono
      }
    }
  }
}
    `;
export type AddFamilyMemberMutationFn = Apollo.MutationFunction<AddFamilyMemberMutation, AddFamilyMemberMutationVariables>;

/**
 * __useAddFamilyMemberMutation__
 *
 * To run a mutation, you first call `useAddFamilyMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddFamilyMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addFamilyMemberMutation, { data, loading, error }] = useAddFamilyMemberMutation({
 *   variables: {
 *      family_id: // value for 'family_id'
 *      familiar: // value for 'familiar'
 *   },
 * });
 */
export function useAddFamilyMemberMutation(baseOptions?: Apollo.MutationHookOptions<AddFamilyMemberMutation, AddFamilyMemberMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddFamilyMemberMutation, AddFamilyMemberMutationVariables>(AddFamilyMemberDocument, options);
      }
export type AddFamilyMemberMutationHookResult = ReturnType<typeof useAddFamilyMemberMutation>;
export type AddFamilyMemberMutationResult = Apollo.MutationResult<AddFamilyMemberMutation>;
export type AddFamilyMemberMutationOptions = Apollo.BaseMutationOptions<AddFamilyMemberMutation, AddFamilyMemberMutationVariables>;
export const RemoveFamilyMemberDocument = gql`
    mutation RemoveFamilyMember($familiar_id: ID!) {
  removeFamilyMember(familiar_id: $familiar_id) {
    success
    message
    error
  }
}
    `;
export type RemoveFamilyMemberMutationFn = Apollo.MutationFunction<RemoveFamilyMemberMutation, RemoveFamilyMemberMutationVariables>;

/**
 * __useRemoveFamilyMemberMutation__
 *
 * To run a mutation, you first call `useRemoveFamilyMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveFamilyMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeFamilyMemberMutation, { data, loading, error }] = useRemoveFamilyMemberMutation({
 *   variables: {
 *      familiar_id: // value for 'familiar_id'
 *   },
 * });
 */
export function useRemoveFamilyMemberMutation(baseOptions?: Apollo.MutationHookOptions<RemoveFamilyMemberMutation, RemoveFamilyMemberMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveFamilyMemberMutation, RemoveFamilyMemberMutationVariables>(RemoveFamilyMemberDocument, options);
      }
export type RemoveFamilyMemberMutationHookResult = ReturnType<typeof useRemoveFamilyMemberMutation>;
export type RemoveFamilyMemberMutationResult = Apollo.MutationResult<RemoveFamilyMemberMutation>;
export type RemoveFamilyMemberMutationOptions = Apollo.BaseMutationOptions<RemoveFamilyMemberMutation, RemoveFamilyMemberMutationVariables>;
export const ListAnnualFeesDocument = gql`
    query ListAnnualFees {
  listAnnualFees {
    id
    year
    base_fee_amount
    family_fee_extra
    due_date
  }
}
    `;

/**
 * __useListAnnualFeesQuery__
 *
 * To run a query within a React component, call `useListAnnualFeesQuery` and pass it any options that fit your needs.
 * When your component renders, `useListAnnualFeesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListAnnualFeesQuery({
 *   variables: {
 *   },
 * });
 */
export function useListAnnualFeesQuery(baseOptions?: Apollo.QueryHookOptions<ListAnnualFeesQuery, ListAnnualFeesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListAnnualFeesQuery, ListAnnualFeesQueryVariables>(ListAnnualFeesDocument, options);
      }
export function useListAnnualFeesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListAnnualFeesQuery, ListAnnualFeesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListAnnualFeesQuery, ListAnnualFeesQueryVariables>(ListAnnualFeesDocument, options);
        }
export function useListAnnualFeesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ListAnnualFeesQuery, ListAnnualFeesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ListAnnualFeesQuery, ListAnnualFeesQueryVariables>(ListAnnualFeesDocument, options);
        }
export type ListAnnualFeesQueryHookResult = ReturnType<typeof useListAnnualFeesQuery>;
export type ListAnnualFeesLazyQueryHookResult = ReturnType<typeof useListAnnualFeesLazyQuery>;
export type ListAnnualFeesSuspenseQueryHookResult = ReturnType<typeof useListAnnualFeesSuspenseQuery>;
export type ListAnnualFeesQueryResult = Apollo.QueryResult<ListAnnualFeesQuery, ListAnnualFeesQueryVariables>;
export const GenerateAnnualFeesDocument = gql`
    mutation GenerateAnnualFees($input: GenerateAnnualFeesInput!) {
  generateAnnualFees(input: $input) {
    year
    membership_fee_id
    payments_generated
    payments_existing
    total_members
    total_expected_amount
    details {
      member_id
      member_number
      member_name
      amount
      was_created
      error
    }
  }
}
    `;
export type GenerateAnnualFeesMutationFn = Apollo.MutationFunction<GenerateAnnualFeesMutation, GenerateAnnualFeesMutationVariables>;

/**
 * __useGenerateAnnualFeesMutation__
 *
 * To run a mutation, you first call `useGenerateAnnualFeesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGenerateAnnualFeesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [generateAnnualFeesMutation, { data, loading, error }] = useGenerateAnnualFeesMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGenerateAnnualFeesMutation(baseOptions?: Apollo.MutationHookOptions<GenerateAnnualFeesMutation, GenerateAnnualFeesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GenerateAnnualFeesMutation, GenerateAnnualFeesMutationVariables>(GenerateAnnualFeesDocument, options);
      }
export type GenerateAnnualFeesMutationHookResult = ReturnType<typeof useGenerateAnnualFeesMutation>;
export type GenerateAnnualFeesMutationResult = Apollo.MutationResult<GenerateAnnualFeesMutation>;
export type GenerateAnnualFeesMutationOptions = Apollo.BaseMutationOptions<GenerateAnnualFeesMutation, GenerateAnnualFeesMutationVariables>;
export const HealthDocument = gql`
    query Health {
  health
}
    `;

/**
 * __useHealthQuery__
 *
 * To run a query within a React component, call `useHealthQuery` and pass it any options that fit your needs.
 * When your component renders, `useHealthQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHealthQuery({
 *   variables: {
 *   },
 * });
 */
export function useHealthQuery(baseOptions?: Apollo.QueryHookOptions<HealthQuery, HealthQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<HealthQuery, HealthQueryVariables>(HealthDocument, options);
      }
export function useHealthLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HealthQuery, HealthQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<HealthQuery, HealthQueryVariables>(HealthDocument, options);
        }
export function useHealthSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<HealthQuery, HealthQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<HealthQuery, HealthQueryVariables>(HealthDocument, options);
        }
export type HealthQueryHookResult = ReturnType<typeof useHealthQuery>;
export type HealthLazyQueryHookResult = ReturnType<typeof useHealthLazyQuery>;
export type HealthSuspenseQueryHookResult = ReturnType<typeof useHealthSuspenseQuery>;
export type HealthQueryResult = Apollo.QueryResult<HealthQuery, HealthQueryVariables>;
export const PingDocument = gql`
    query Ping {
  ping
}
    `;

/**
 * __usePingQuery__
 *
 * To run a query within a React component, call `usePingQuery` and pass it any options that fit your needs.
 * When your component renders, `usePingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePingQuery({
 *   variables: {
 *   },
 * });
 */
export function usePingQuery(baseOptions?: Apollo.QueryHookOptions<PingQuery, PingQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PingQuery, PingQueryVariables>(PingDocument, options);
      }
export function usePingLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PingQuery, PingQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PingQuery, PingQueryVariables>(PingDocument, options);
        }
export function usePingSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<PingQuery, PingQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<PingQuery, PingQueryVariables>(PingDocument, options);
        }
export type PingQueryHookResult = ReturnType<typeof usePingQuery>;
export type PingLazyQueryHookResult = ReturnType<typeof usePingLazyQuery>;
export type PingSuspenseQueryHookResult = ReturnType<typeof usePingSuspenseQuery>;
export type PingQueryResult = Apollo.QueryResult<PingQuery, PingQueryVariables>;
export const ValidateDocumentDocument = gql`
    query ValidateDocument($documentNumber: String!) {
  checkDocumentValidity(documentNumber: $documentNumber) {
    isValid
    normalizedValue
    errorMessage
  }
}
    `;

/**
 * __useValidateDocumentQuery__
 *
 * To run a query within a React component, call `useValidateDocumentQuery` and pass it any options that fit your needs.
 * When your component renders, `useValidateDocumentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useValidateDocumentQuery({
 *   variables: {
 *      documentNumber: // value for 'documentNumber'
 *   },
 * });
 */
export function useValidateDocumentQuery(baseOptions: Apollo.QueryHookOptions<ValidateDocumentQuery, ValidateDocumentQueryVariables> & ({ variables: ValidateDocumentQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ValidateDocumentQuery, ValidateDocumentQueryVariables>(ValidateDocumentDocument, options);
      }
export function useValidateDocumentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ValidateDocumentQuery, ValidateDocumentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ValidateDocumentQuery, ValidateDocumentQueryVariables>(ValidateDocumentDocument, options);
        }
export function useValidateDocumentSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ValidateDocumentQuery, ValidateDocumentQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ValidateDocumentQuery, ValidateDocumentQueryVariables>(ValidateDocumentDocument, options);
        }
export type ValidateDocumentQueryHookResult = ReturnType<typeof useValidateDocumentQuery>;
export type ValidateDocumentLazyQueryHookResult = ReturnType<typeof useValidateDocumentLazyQuery>;
export type ValidateDocumentSuspenseQueryHookResult = ReturnType<typeof useValidateDocumentSuspenseQuery>;
export type ValidateDocumentQueryResult = Apollo.QueryResult<ValidateDocumentQuery, ValidateDocumentQueryVariables>;
export const CheckMemberNumberExistsDocument = gql`
    query CheckMemberNumberExists($memberNumber: String!) {
  checkMemberNumberExists(memberNumber: $memberNumber)
}
    `;

/**
 * __useCheckMemberNumberExistsQuery__
 *
 * To run a query within a React component, call `useCheckMemberNumberExistsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCheckMemberNumberExistsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCheckMemberNumberExistsQuery({
 *   variables: {
 *      memberNumber: // value for 'memberNumber'
 *   },
 * });
 */
export function useCheckMemberNumberExistsQuery(baseOptions: Apollo.QueryHookOptions<CheckMemberNumberExistsQuery, CheckMemberNumberExistsQueryVariables> & ({ variables: CheckMemberNumberExistsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CheckMemberNumberExistsQuery, CheckMemberNumberExistsQueryVariables>(CheckMemberNumberExistsDocument, options);
      }
export function useCheckMemberNumberExistsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CheckMemberNumberExistsQuery, CheckMemberNumberExistsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CheckMemberNumberExistsQuery, CheckMemberNumberExistsQueryVariables>(CheckMemberNumberExistsDocument, options);
        }
export function useCheckMemberNumberExistsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CheckMemberNumberExistsQuery, CheckMemberNumberExistsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CheckMemberNumberExistsQuery, CheckMemberNumberExistsQueryVariables>(CheckMemberNumberExistsDocument, options);
        }
export type CheckMemberNumberExistsQueryHookResult = ReturnType<typeof useCheckMemberNumberExistsQuery>;
export type CheckMemberNumberExistsLazyQueryHookResult = ReturnType<typeof useCheckMemberNumberExistsLazyQuery>;
export type CheckMemberNumberExistsSuspenseQueryHookResult = ReturnType<typeof useCheckMemberNumberExistsSuspenseQuery>;
export type CheckMemberNumberExistsQueryResult = Apollo.QueryResult<CheckMemberNumberExistsQuery, CheckMemberNumberExistsQueryVariables>;
export const GetNextMemberNumberDocument = gql`
    query GetNextMemberNumber($isFamily: Boolean!) {
  getNextMemberNumber(isFamily: $isFamily)
}
    `;

/**
 * __useGetNextMemberNumberQuery__
 *
 * To run a query within a React component, call `useGetNextMemberNumberQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNextMemberNumberQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNextMemberNumberQuery({
 *   variables: {
 *      isFamily: // value for 'isFamily'
 *   },
 * });
 */
export function useGetNextMemberNumberQuery(baseOptions: Apollo.QueryHookOptions<GetNextMemberNumberQuery, GetNextMemberNumberQueryVariables> & ({ variables: GetNextMemberNumberQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetNextMemberNumberQuery, GetNextMemberNumberQueryVariables>(GetNextMemberNumberDocument, options);
      }
export function useGetNextMemberNumberLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetNextMemberNumberQuery, GetNextMemberNumberQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetNextMemberNumberQuery, GetNextMemberNumberQueryVariables>(GetNextMemberNumberDocument, options);
        }
export function useGetNextMemberNumberSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetNextMemberNumberQuery, GetNextMemberNumberQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetNextMemberNumberQuery, GetNextMemberNumberQueryVariables>(GetNextMemberNumberDocument, options);
        }
export type GetNextMemberNumberQueryHookResult = ReturnType<typeof useGetNextMemberNumberQuery>;
export type GetNextMemberNumberLazyQueryHookResult = ReturnType<typeof useGetNextMemberNumberLazyQuery>;
export type GetNextMemberNumberSuspenseQueryHookResult = ReturnType<typeof useGetNextMemberNumberSuspenseQuery>;
export type GetNextMemberNumberQueryResult = Apollo.QueryResult<GetNextMemberNumberQuery, GetNextMemberNumberQueryVariables>;
export const GetMemberDocument = gql`
    query GetMember($id: ID!) {
  getMember(id: $id) {
    miembro_id
    numero_socio
    tipo_membresia
    nombre
    apellidos
    calle_numero_piso
    codigo_postal
    poblacion
    provincia
    pais
    estado
    fecha_alta
    fecha_baja
    fecha_nacimiento
    documento_identidad
    correo_electronico
    profesion
    nacionalidad
    observaciones
    telefonos {
      numero_telefono
    }
  }
}
    `;

/**
 * __useGetMemberQuery__
 *
 * To run a query within a React component, call `useGetMemberQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMemberQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMemberQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetMemberQuery(baseOptions: Apollo.QueryHookOptions<GetMemberQuery, GetMemberQueryVariables> & ({ variables: GetMemberQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMemberQuery, GetMemberQueryVariables>(GetMemberDocument, options);
      }
export function useGetMemberLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMemberQuery, GetMemberQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMemberQuery, GetMemberQueryVariables>(GetMemberDocument, options);
        }
export function useGetMemberSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMemberQuery, GetMemberQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMemberQuery, GetMemberQueryVariables>(GetMemberDocument, options);
        }
export type GetMemberQueryHookResult = ReturnType<typeof useGetMemberQuery>;
export type GetMemberLazyQueryHookResult = ReturnType<typeof useGetMemberLazyQuery>;
export type GetMemberSuspenseQueryHookResult = ReturnType<typeof useGetMemberSuspenseQuery>;
export type GetMemberQueryResult = Apollo.QueryResult<GetMemberQuery, GetMemberQueryVariables>;
export const ListMembersDocument = gql`
    query ListMembers($filter: MemberFilter) {
  listMembers(filter: $filter) {
    nodes {
      miembro_id
      numero_socio
      tipo_membresia
      nombre
      apellidos
      calle_numero_piso
      codigo_postal
      poblacion
      provincia
      pais
      estado
      fecha_alta
      fecha_baja
      fecha_nacimiento
      documento_identidad
      correo_electronico
      profesion
      nacionalidad
      observaciones
      telefonos {
        numero_telefono
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      totalCount
    }
  }
}
    `;

/**
 * __useListMembersQuery__
 *
 * To run a query within a React component, call `useListMembersQuery` and pass it any options that fit your needs.
 * When your component renders, `useListMembersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListMembersQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useListMembersQuery(baseOptions?: Apollo.QueryHookOptions<ListMembersQuery, ListMembersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListMembersQuery, ListMembersQueryVariables>(ListMembersDocument, options);
      }
export function useListMembersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListMembersQuery, ListMembersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListMembersQuery, ListMembersQueryVariables>(ListMembersDocument, options);
        }
export function useListMembersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ListMembersQuery, ListMembersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ListMembersQuery, ListMembersQueryVariables>(ListMembersDocument, options);
        }
export type ListMembersQueryHookResult = ReturnType<typeof useListMembersQuery>;
export type ListMembersLazyQueryHookResult = ReturnType<typeof useListMembersLazyQuery>;
export type ListMembersSuspenseQueryHookResult = ReturnType<typeof useListMembersSuspenseQuery>;
export type ListMembersQueryResult = Apollo.QueryResult<ListMembersQuery, ListMembersQueryVariables>;
export const SearchMembersDocument = gql`
    query SearchMembers($criteria: String!) {
  searchMembers(criteria: $criteria) {
    miembro_id
    numero_socio
    tipo_membresia
    nombre
    apellidos
    calle_numero_piso
    codigo_postal
    poblacion
    provincia
    pais
    estado
    fecha_alta
    fecha_baja
    fecha_nacimiento
    documento_identidad
    correo_electronico
    profesion
    nacionalidad
    observaciones
    telefonos {
      numero_telefono
    }
  }
}
    `;

/**
 * __useSearchMembersQuery__
 *
 * To run a query within a React component, call `useSearchMembersQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchMembersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchMembersQuery({
 *   variables: {
 *      criteria: // value for 'criteria'
 *   },
 * });
 */
export function useSearchMembersQuery(baseOptions: Apollo.QueryHookOptions<SearchMembersQuery, SearchMembersQueryVariables> & ({ variables: SearchMembersQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchMembersQuery, SearchMembersQueryVariables>(SearchMembersDocument, options);
      }
export function useSearchMembersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchMembersQuery, SearchMembersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchMembersQuery, SearchMembersQueryVariables>(SearchMembersDocument, options);
        }
export function useSearchMembersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SearchMembersQuery, SearchMembersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SearchMembersQuery, SearchMembersQueryVariables>(SearchMembersDocument, options);
        }
export type SearchMembersQueryHookResult = ReturnType<typeof useSearchMembersQuery>;
export type SearchMembersLazyQueryHookResult = ReturnType<typeof useSearchMembersLazyQuery>;
export type SearchMembersSuspenseQueryHookResult = ReturnType<typeof useSearchMembersSuspenseQuery>;
export type SearchMembersQueryResult = Apollo.QueryResult<SearchMembersQuery, SearchMembersQueryVariables>;
export const SearchMembersWithoutUserDocument = gql`
    query SearchMembersWithoutUser($criteria: String!) {
  searchMembersWithoutUser(criteria: $criteria) {
    miembro_id
    numero_socio
    tipo_membresia
    nombre
    apellidos
    estado
    documento_identidad
    correo_electronico
  }
}
    `;

/**
 * __useSearchMembersWithoutUserQuery__
 *
 * To run a query within a React component, call `useSearchMembersWithoutUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchMembersWithoutUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchMembersWithoutUserQuery({
 *   variables: {
 *      criteria: // value for 'criteria'
 *   },
 * });
 */
export function useSearchMembersWithoutUserQuery(baseOptions: Apollo.QueryHookOptions<SearchMembersWithoutUserQuery, SearchMembersWithoutUserQueryVariables> & ({ variables: SearchMembersWithoutUserQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchMembersWithoutUserQuery, SearchMembersWithoutUserQueryVariables>(SearchMembersWithoutUserDocument, options);
      }
export function useSearchMembersWithoutUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchMembersWithoutUserQuery, SearchMembersWithoutUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchMembersWithoutUserQuery, SearchMembersWithoutUserQueryVariables>(SearchMembersWithoutUserDocument, options);
        }
export function useSearchMembersWithoutUserSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SearchMembersWithoutUserQuery, SearchMembersWithoutUserQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SearchMembersWithoutUserQuery, SearchMembersWithoutUserQueryVariables>(SearchMembersWithoutUserDocument, options);
        }
export type SearchMembersWithoutUserQueryHookResult = ReturnType<typeof useSearchMembersWithoutUserQuery>;
export type SearchMembersWithoutUserLazyQueryHookResult = ReturnType<typeof useSearchMembersWithoutUserLazyQuery>;
export type SearchMembersWithoutUserSuspenseQueryHookResult = ReturnType<typeof useSearchMembersWithoutUserSuspenseQuery>;
export type SearchMembersWithoutUserQueryResult = Apollo.QueryResult<SearchMembersWithoutUserQuery, SearchMembersWithoutUserQueryVariables>;
export const CreateMemberDocument = gql`
    mutation CreateMember($input: CreateMemberInput!) {
  createMember(input: $input) {
    miembro_id
    numero_socio
    tipo_membresia
    nombre
    apellidos
    calle_numero_piso
    codigo_postal
    poblacion
    provincia
    pais
    estado
    fecha_alta
    fecha_baja
    fecha_nacimiento
    documento_identidad
    correo_electronico
    profesion
    nacionalidad
    observaciones
    telefonos {
      numero_telefono
    }
  }
}
    `;
export type CreateMemberMutationFn = Apollo.MutationFunction<CreateMemberMutation, CreateMemberMutationVariables>;

/**
 * __useCreateMemberMutation__
 *
 * To run a mutation, you first call `useCreateMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMemberMutation, { data, loading, error }] = useCreateMemberMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateMemberMutation(baseOptions?: Apollo.MutationHookOptions<CreateMemberMutation, CreateMemberMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateMemberMutation, CreateMemberMutationVariables>(CreateMemberDocument, options);
      }
export type CreateMemberMutationHookResult = ReturnType<typeof useCreateMemberMutation>;
export type CreateMemberMutationResult = Apollo.MutationResult<CreateMemberMutation>;
export type CreateMemberMutationOptions = Apollo.BaseMutationOptions<CreateMemberMutation, CreateMemberMutationVariables>;
export const UpdateMemberDocument = gql`
    mutation UpdateMember($input: UpdateMemberInput!) {
  updateMember(input: $input) {
    miembro_id
    numero_socio
    tipo_membresia
    nombre
    apellidos
    calle_numero_piso
    codigo_postal
    poblacion
    provincia
    pais
    estado
    fecha_alta
    fecha_baja
    fecha_nacimiento
    documento_identidad
    correo_electronico
    profesion
    nacionalidad
    observaciones
    telefonos {
      numero_telefono
    }
  }
}
    `;
export type UpdateMemberMutationFn = Apollo.MutationFunction<UpdateMemberMutation, UpdateMemberMutationVariables>;

/**
 * __useUpdateMemberMutation__
 *
 * To run a mutation, you first call `useUpdateMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateMemberMutation, { data, loading, error }] = useUpdateMemberMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateMemberMutation(baseOptions?: Apollo.MutationHookOptions<UpdateMemberMutation, UpdateMemberMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateMemberMutation, UpdateMemberMutationVariables>(UpdateMemberDocument, options);
      }
export type UpdateMemberMutationHookResult = ReturnType<typeof useUpdateMemberMutation>;
export type UpdateMemberMutationResult = Apollo.MutationResult<UpdateMemberMutation>;
export type UpdateMemberMutationOptions = Apollo.BaseMutationOptions<UpdateMemberMutation, UpdateMemberMutationVariables>;
export const DeleteMemberDocument = gql`
    mutation DeleteMember($id: ID!) {
  deleteMember(id: $id) {
    success
    message
    error
  }
}
    `;
export type DeleteMemberMutationFn = Apollo.MutationFunction<DeleteMemberMutation, DeleteMemberMutationVariables>;

/**
 * __useDeleteMemberMutation__
 *
 * To run a mutation, you first call `useDeleteMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteMemberMutation, { data, loading, error }] = useDeleteMemberMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteMemberMutation(baseOptions?: Apollo.MutationHookOptions<DeleteMemberMutation, DeleteMemberMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteMemberMutation, DeleteMemberMutationVariables>(DeleteMemberDocument, options);
      }
export type DeleteMemberMutationHookResult = ReturnType<typeof useDeleteMemberMutation>;
export type DeleteMemberMutationResult = Apollo.MutationResult<DeleteMemberMutation>;
export type DeleteMemberMutationOptions = Apollo.BaseMutationOptions<DeleteMemberMutation, DeleteMemberMutationVariables>;
export const ChangeMemberStatusDocument = gql`
    mutation ChangeMemberStatus($id: ID!, $status: MemberStatus!) {
  changeMemberStatus(id: $id, status: $status) {
    miembro_id
    numero_socio
    tipo_membresia
    nombre
    apellidos
    calle_numero_piso
    codigo_postal
    poblacion
    provincia
    pais
    estado
    fecha_alta
    fecha_baja
    fecha_nacimiento
    documento_identidad
    correo_electronico
    profesion
    nacionalidad
    observaciones
    telefonos {
      numero_telefono
    }
  }
}
    `;
export type ChangeMemberStatusMutationFn = Apollo.MutationFunction<ChangeMemberStatusMutation, ChangeMemberStatusMutationVariables>;

/**
 * __useChangeMemberStatusMutation__
 *
 * To run a mutation, you first call `useChangeMemberStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeMemberStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeMemberStatusMutation, { data, loading, error }] = useChangeMemberStatusMutation({
 *   variables: {
 *      id: // value for 'id'
 *      status: // value for 'status'
 *   },
 * });
 */
export function useChangeMemberStatusMutation(baseOptions?: Apollo.MutationHookOptions<ChangeMemberStatusMutation, ChangeMemberStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChangeMemberStatusMutation, ChangeMemberStatusMutationVariables>(ChangeMemberStatusDocument, options);
      }
export type ChangeMemberStatusMutationHookResult = ReturnType<typeof useChangeMemberStatusMutation>;
export type ChangeMemberStatusMutationResult = Apollo.MutationResult<ChangeMemberStatusMutation>;
export type ChangeMemberStatusMutationOptions = Apollo.BaseMutationOptions<ChangeMemberStatusMutation, ChangeMemberStatusMutationVariables>;
export const GetPaymentDocument = gql`
    query GetPayment($id: ID!) {
  getPayment(id: $id) {
    id
    member {
      miembro_id
      numero_socio
      nombre
      apellidos
      tipo_membresia
    }
    amount
    payment_date
    status
    payment_method
    notes
    membership_fee {
      id
      year
    }
  }
}
    `;

/**
 * __useGetPaymentQuery__
 *
 * To run a query within a React component, call `useGetPaymentQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPaymentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPaymentQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetPaymentQuery(baseOptions: Apollo.QueryHookOptions<GetPaymentQuery, GetPaymentQueryVariables> & ({ variables: GetPaymentQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPaymentQuery, GetPaymentQueryVariables>(GetPaymentDocument, options);
      }
export function useGetPaymentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPaymentQuery, GetPaymentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPaymentQuery, GetPaymentQueryVariables>(GetPaymentDocument, options);
        }
export function useGetPaymentSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPaymentQuery, GetPaymentQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPaymentQuery, GetPaymentQueryVariables>(GetPaymentDocument, options);
        }
export type GetPaymentQueryHookResult = ReturnType<typeof useGetPaymentQuery>;
export type GetPaymentLazyQueryHookResult = ReturnType<typeof useGetPaymentLazyQuery>;
export type GetPaymentSuspenseQueryHookResult = ReturnType<typeof useGetPaymentSuspenseQuery>;
export type GetPaymentQueryResult = Apollo.QueryResult<GetPaymentQuery, GetPaymentQueryVariables>;
export const GetMemberPaymentsDocument = gql`
    query GetMemberPayments($memberId: ID!) {
  getMemberPayments(memberId: $memberId) {
    id
    member {
      miembro_id
      numero_socio
      nombre
      apellidos
      tipo_membresia
    }
    amount
    payment_date
    status
    payment_method
    notes
    membership_fee {
      id
      year
    }
  }
}
    `;

/**
 * __useGetMemberPaymentsQuery__
 *
 * To run a query within a React component, call `useGetMemberPaymentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMemberPaymentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMemberPaymentsQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useGetMemberPaymentsQuery(baseOptions: Apollo.QueryHookOptions<GetMemberPaymentsQuery, GetMemberPaymentsQueryVariables> & ({ variables: GetMemberPaymentsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMemberPaymentsQuery, GetMemberPaymentsQueryVariables>(GetMemberPaymentsDocument, options);
      }
export function useGetMemberPaymentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMemberPaymentsQuery, GetMemberPaymentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMemberPaymentsQuery, GetMemberPaymentsQueryVariables>(GetMemberPaymentsDocument, options);
        }
export function useGetMemberPaymentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMemberPaymentsQuery, GetMemberPaymentsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMemberPaymentsQuery, GetMemberPaymentsQueryVariables>(GetMemberPaymentsDocument, options);
        }
export type GetMemberPaymentsQueryHookResult = ReturnType<typeof useGetMemberPaymentsQuery>;
export type GetMemberPaymentsLazyQueryHookResult = ReturnType<typeof useGetMemberPaymentsLazyQuery>;
export type GetMemberPaymentsSuspenseQueryHookResult = ReturnType<typeof useGetMemberPaymentsSuspenseQuery>;
export type GetMemberPaymentsQueryResult = Apollo.QueryResult<GetMemberPaymentsQuery, GetMemberPaymentsQueryVariables>;
export const GetFamilyPaymentsDocument = gql`
    query GetFamilyPayments($familyId: ID!) {
  getFamilyPayments(familyId: $familyId) {
    id
    member {
      miembro_id
      numero_socio
      nombre
      apellidos
      tipo_membresia
    }
    amount
    payment_date
    status
    payment_method
    notes
    membership_fee {
      id
      year
    }
  }
}
    `;

/**
 * __useGetFamilyPaymentsQuery__
 *
 * To run a query within a React component, call `useGetFamilyPaymentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFamilyPaymentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFamilyPaymentsQuery({
 *   variables: {
 *      familyId: // value for 'familyId'
 *   },
 * });
 */
export function useGetFamilyPaymentsQuery(baseOptions: Apollo.QueryHookOptions<GetFamilyPaymentsQuery, GetFamilyPaymentsQueryVariables> & ({ variables: GetFamilyPaymentsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFamilyPaymentsQuery, GetFamilyPaymentsQueryVariables>(GetFamilyPaymentsDocument, options);
      }
export function useGetFamilyPaymentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFamilyPaymentsQuery, GetFamilyPaymentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFamilyPaymentsQuery, GetFamilyPaymentsQueryVariables>(GetFamilyPaymentsDocument, options);
        }
export function useGetFamilyPaymentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetFamilyPaymentsQuery, GetFamilyPaymentsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetFamilyPaymentsQuery, GetFamilyPaymentsQueryVariables>(GetFamilyPaymentsDocument, options);
        }
export type GetFamilyPaymentsQueryHookResult = ReturnType<typeof useGetFamilyPaymentsQuery>;
export type GetFamilyPaymentsLazyQueryHookResult = ReturnType<typeof useGetFamilyPaymentsLazyQuery>;
export type GetFamilyPaymentsSuspenseQueryHookResult = ReturnType<typeof useGetFamilyPaymentsSuspenseQuery>;
export type GetFamilyPaymentsQueryResult = Apollo.QueryResult<GetFamilyPaymentsQuery, GetFamilyPaymentsQueryVariables>;
export const GetPaymentStatusDocument = gql`
    query GetPaymentStatus($id: ID!) {
  getPaymentStatus(id: $id)
}
    `;

/**
 * __useGetPaymentStatusQuery__
 *
 * To run a query within a React component, call `useGetPaymentStatusQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPaymentStatusQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPaymentStatusQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetPaymentStatusQuery(baseOptions: Apollo.QueryHookOptions<GetPaymentStatusQuery, GetPaymentStatusQueryVariables> & ({ variables: GetPaymentStatusQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPaymentStatusQuery, GetPaymentStatusQueryVariables>(GetPaymentStatusDocument, options);
      }
export function useGetPaymentStatusLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPaymentStatusQuery, GetPaymentStatusQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPaymentStatusQuery, GetPaymentStatusQueryVariables>(GetPaymentStatusDocument, options);
        }
export function useGetPaymentStatusSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPaymentStatusQuery, GetPaymentStatusQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPaymentStatusQuery, GetPaymentStatusQueryVariables>(GetPaymentStatusDocument, options);
        }
export type GetPaymentStatusQueryHookResult = ReturnType<typeof useGetPaymentStatusQuery>;
export type GetPaymentStatusLazyQueryHookResult = ReturnType<typeof useGetPaymentStatusLazyQuery>;
export type GetPaymentStatusSuspenseQueryHookResult = ReturnType<typeof useGetPaymentStatusSuspenseQuery>;
export type GetPaymentStatusQueryResult = Apollo.QueryResult<GetPaymentStatusQuery, GetPaymentStatusQueryVariables>;
export const ListPaymentsDocument = gql`
    query ListPayments($filter: PaymentFilter) {
  listPayments(filter: $filter) {
    nodes {
      id
      member {
        miembro_id
        numero_socio
        nombre
        apellidos
        tipo_membresia
      }
      amount
      payment_date
      status
      payment_method
      notes
      membership_fee {
        id
        year
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      totalCount
    }
  }
}
    `;

/**
 * __useListPaymentsQuery__
 *
 * To run a query within a React component, call `useListPaymentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useListPaymentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListPaymentsQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useListPaymentsQuery(baseOptions?: Apollo.QueryHookOptions<ListPaymentsQuery, ListPaymentsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListPaymentsQuery, ListPaymentsQueryVariables>(ListPaymentsDocument, options);
      }
export function useListPaymentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListPaymentsQuery, ListPaymentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListPaymentsQuery, ListPaymentsQueryVariables>(ListPaymentsDocument, options);
        }
export function useListPaymentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ListPaymentsQuery, ListPaymentsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ListPaymentsQuery, ListPaymentsQueryVariables>(ListPaymentsDocument, options);
        }
export type ListPaymentsQueryHookResult = ReturnType<typeof useListPaymentsQuery>;
export type ListPaymentsLazyQueryHookResult = ReturnType<typeof useListPaymentsLazyQuery>;
export type ListPaymentsSuspenseQueryHookResult = ReturnType<typeof useListPaymentsSuspenseQuery>;
export type ListPaymentsQueryResult = Apollo.QueryResult<ListPaymentsQuery, ListPaymentsQueryVariables>;
export const RegisterPaymentDocument = gql`
    mutation RegisterPayment($input: PaymentInput!) {
  registerPayment(input: $input) {
    id
    member {
      miembro_id
      numero_socio
      nombre
      apellidos
      tipo_membresia
    }
    amount
    payment_date
    status
    payment_method
    notes
  }
}
    `;
export type RegisterPaymentMutationFn = Apollo.MutationFunction<RegisterPaymentMutation, RegisterPaymentMutationVariables>;

/**
 * __useRegisterPaymentMutation__
 *
 * To run a mutation, you first call `useRegisterPaymentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterPaymentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerPaymentMutation, { data, loading, error }] = useRegisterPaymentMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRegisterPaymentMutation(baseOptions?: Apollo.MutationHookOptions<RegisterPaymentMutation, RegisterPaymentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterPaymentMutation, RegisterPaymentMutationVariables>(RegisterPaymentDocument, options);
      }
export type RegisterPaymentMutationHookResult = ReturnType<typeof useRegisterPaymentMutation>;
export type RegisterPaymentMutationResult = Apollo.MutationResult<RegisterPaymentMutation>;
export type RegisterPaymentMutationOptions = Apollo.BaseMutationOptions<RegisterPaymentMutation, RegisterPaymentMutationVariables>;
export const UpdatePaymentDocument = gql`
    mutation UpdatePayment($id: ID!, $input: PaymentInput!) {
  updatePayment(id: $id, input: $input) {
    id
    member {
      miembro_id
      numero_socio
      nombre
      apellidos
      tipo_membresia
    }
    amount
    payment_date
    status
    payment_method
    notes
  }
}
    `;
export type UpdatePaymentMutationFn = Apollo.MutationFunction<UpdatePaymentMutation, UpdatePaymentMutationVariables>;

/**
 * __useUpdatePaymentMutation__
 *
 * To run a mutation, you first call `useUpdatePaymentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePaymentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePaymentMutation, { data, loading, error }] = useUpdatePaymentMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdatePaymentMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePaymentMutation, UpdatePaymentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdatePaymentMutation, UpdatePaymentMutationVariables>(UpdatePaymentDocument, options);
      }
export type UpdatePaymentMutationHookResult = ReturnType<typeof useUpdatePaymentMutation>;
export type UpdatePaymentMutationResult = Apollo.MutationResult<UpdatePaymentMutation>;
export type UpdatePaymentMutationOptions = Apollo.BaseMutationOptions<UpdatePaymentMutation, UpdatePaymentMutationVariables>;
export const ConfirmPaymentDocument = gql`
    mutation ConfirmPayment($id: ID!, $paymentMethod: String!, $paymentDate: Time, $notes: String, $amount: Float) {
  confirmPayment(
    id: $id
    paymentMethod: $paymentMethod
    paymentDate: $paymentDate
    notes: $notes
    amount: $amount
  ) {
    id
    member {
      miembro_id
      numero_socio
      nombre
      apellidos
      tipo_membresia
    }
    amount
    payment_date
    status
    payment_method
    notes
  }
}
    `;
export type ConfirmPaymentMutationFn = Apollo.MutationFunction<ConfirmPaymentMutation, ConfirmPaymentMutationVariables>;

/**
 * __useConfirmPaymentMutation__
 *
 * To run a mutation, you first call `useConfirmPaymentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useConfirmPaymentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [confirmPaymentMutation, { data, loading, error }] = useConfirmPaymentMutation({
 *   variables: {
 *      id: // value for 'id'
 *      paymentMethod: // value for 'paymentMethod'
 *      paymentDate: // value for 'paymentDate'
 *      notes: // value for 'notes'
 *      amount: // value for 'amount'
 *   },
 * });
 */
export function useConfirmPaymentMutation(baseOptions?: Apollo.MutationHookOptions<ConfirmPaymentMutation, ConfirmPaymentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ConfirmPaymentMutation, ConfirmPaymentMutationVariables>(ConfirmPaymentDocument, options);
      }
export type ConfirmPaymentMutationHookResult = ReturnType<typeof useConfirmPaymentMutation>;
export type ConfirmPaymentMutationResult = Apollo.MutationResult<ConfirmPaymentMutation>;
export type ConfirmPaymentMutationOptions = Apollo.BaseMutationOptions<ConfirmPaymentMutation, ConfirmPaymentMutationVariables>;
export const CancelPaymentDocument = gql`
    mutation CancelPayment($id: ID!, $reason: String!) {
  cancelPayment(id: $id, reason: $reason) {
    success
    message
    error
  }
}
    `;
export type CancelPaymentMutationFn = Apollo.MutationFunction<CancelPaymentMutation, CancelPaymentMutationVariables>;

/**
 * __useCancelPaymentMutation__
 *
 * To run a mutation, you first call `useCancelPaymentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCancelPaymentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cancelPaymentMutation, { data, loading, error }] = useCancelPaymentMutation({
 *   variables: {
 *      id: // value for 'id'
 *      reason: // value for 'reason'
 *   },
 * });
 */
export function useCancelPaymentMutation(baseOptions?: Apollo.MutationHookOptions<CancelPaymentMutation, CancelPaymentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CancelPaymentMutation, CancelPaymentMutationVariables>(CancelPaymentDocument, options);
      }
export type CancelPaymentMutationHookResult = ReturnType<typeof useCancelPaymentMutation>;
export type CancelPaymentMutationResult = Apollo.MutationResult<CancelPaymentMutation>;
export type CancelPaymentMutationOptions = Apollo.BaseMutationOptions<CancelPaymentMutation, CancelPaymentMutationVariables>;
export const GetDelinquentReportDocument = gql`
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
    pageInfo {
      totalCount
      hasNextPage
      hasPreviousPage
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
    `;

/**
 * __useGetDelinquentReportQuery__
 *
 * To run a query within a React component, call `useGetDelinquentReportQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDelinquentReportQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDelinquentReportQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetDelinquentReportQuery(baseOptions?: Apollo.QueryHookOptions<GetDelinquentReportQuery, GetDelinquentReportQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDelinquentReportQuery, GetDelinquentReportQueryVariables>(GetDelinquentReportDocument, options);
      }
export function useGetDelinquentReportLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDelinquentReportQuery, GetDelinquentReportQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDelinquentReportQuery, GetDelinquentReportQueryVariables>(GetDelinquentReportDocument, options);
        }
export function useGetDelinquentReportSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetDelinquentReportQuery, GetDelinquentReportQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetDelinquentReportQuery, GetDelinquentReportQueryVariables>(GetDelinquentReportDocument, options);
        }
export type GetDelinquentReportQueryHookResult = ReturnType<typeof useGetDelinquentReportQuery>;
export type GetDelinquentReportLazyQueryHookResult = ReturnType<typeof useGetDelinquentReportLazyQuery>;
export type GetDelinquentReportSuspenseQueryHookResult = ReturnType<typeof useGetDelinquentReportSuspenseQuery>;
export type GetDelinquentReportQueryResult = Apollo.QueryResult<GetDelinquentReportQuery, GetDelinquentReportQueryVariables>;
export const HealthCheckDocument = gql`
    query HealthCheck {
  health
}
    `;

/**
 * __useHealthCheckQuery__
 *
 * To run a query within a React component, call `useHealthCheckQuery` and pass it any options that fit your needs.
 * When your component renders, `useHealthCheckQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHealthCheckQuery({
 *   variables: {
 *   },
 * });
 */
export function useHealthCheckQuery(baseOptions?: Apollo.QueryHookOptions<HealthCheckQuery, HealthCheckQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<HealthCheckQuery, HealthCheckQueryVariables>(HealthCheckDocument, options);
      }
export function useHealthCheckLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HealthCheckQuery, HealthCheckQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<HealthCheckQuery, HealthCheckQueryVariables>(HealthCheckDocument, options);
        }
export function useHealthCheckSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<HealthCheckQuery, HealthCheckQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<HealthCheckQuery, HealthCheckQueryVariables>(HealthCheckDocument, options);
        }
export type HealthCheckQueryHookResult = ReturnType<typeof useHealthCheckQuery>;
export type HealthCheckLazyQueryHookResult = ReturnType<typeof useHealthCheckLazyQuery>;
export type HealthCheckSuspenseQueryHookResult = ReturnType<typeof useHealthCheckSuspenseQuery>;
export type HealthCheckQueryResult = Apollo.QueryResult<HealthCheckQuery, HealthCheckQueryVariables>;
export const GetUserDocument = gql`
    query GetUser($id: ID!) {
  getUser(id: $id) {
    id
    username
    email
    role
    member {
      miembro_id
      numero_socio
      nombre
      apellidos
      correo_electronico
    }
    isActive
    lastLogin
    emailVerified
    emailVerifiedAt
  }
}
    `;

/**
 * __useGetUserQuery__
 *
 * To run a query within a React component, call `useGetUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetUserQuery(baseOptions: Apollo.QueryHookOptions<GetUserQuery, GetUserQueryVariables> & ({ variables: GetUserQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
      }
export function useGetUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
        }
export function useGetUserSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
        }
export type GetUserQueryHookResult = ReturnType<typeof useGetUserQuery>;
export type GetUserLazyQueryHookResult = ReturnType<typeof useGetUserLazyQuery>;
export type GetUserSuspenseQueryHookResult = ReturnType<typeof useGetUserSuspenseQuery>;
export type GetUserQueryResult = Apollo.QueryResult<GetUserQuery, GetUserQueryVariables>;
export const ListUsersDocument = gql`
    query ListUsers($page: Int, $pageSize: Int) {
  listUsers(page: $page, pageSize: $pageSize) {
    nodes {
      id
      username
      email
      role
      member {
        miembro_id
        numero_socio
        nombre
        apellidos
        correo_electronico
      }
      isActive
      lastLogin
      emailVerified
      emailVerifiedAt
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      totalCount
    }
  }
}
    `;

/**
 * __useListUsersQuery__
 *
 * To run a query within a React component, call `useListUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useListUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListUsersQuery({
 *   variables: {
 *      page: // value for 'page'
 *      pageSize: // value for 'pageSize'
 *   },
 * });
 */
export function useListUsersQuery(baseOptions?: Apollo.QueryHookOptions<ListUsersQuery, ListUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListUsersQuery, ListUsersQueryVariables>(ListUsersDocument, options);
      }
export function useListUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListUsersQuery, ListUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListUsersQuery, ListUsersQueryVariables>(ListUsersDocument, options);
        }
export function useListUsersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ListUsersQuery, ListUsersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ListUsersQuery, ListUsersQueryVariables>(ListUsersDocument, options);
        }
export type ListUsersQueryHookResult = ReturnType<typeof useListUsersQuery>;
export type ListUsersLazyQueryHookResult = ReturnType<typeof useListUsersLazyQuery>;
export type ListUsersSuspenseQueryHookResult = ReturnType<typeof useListUsersSuspenseQuery>;
export type ListUsersQueryResult = Apollo.QueryResult<ListUsersQuery, ListUsersQueryVariables>;
export const CreateUserDocument = gql`
    mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id
    username
    email
    role
    member {
      miembro_id
      numero_socio
      nombre
      apellidos
      correo_electronico
    }
    isActive
    lastLogin
    emailVerified
    emailVerifiedAt
  }
}
    `;
export type CreateUserMutationFn = Apollo.MutationFunction<CreateUserMutation, CreateUserMutationVariables>;

/**
 * __useCreateUserMutation__
 *
 * To run a mutation, you first call `useCreateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserMutation, { data, loading, error }] = useCreateUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateUserMutation(baseOptions?: Apollo.MutationHookOptions<CreateUserMutation, CreateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, options);
      }
export type CreateUserMutationHookResult = ReturnType<typeof useCreateUserMutation>;
export type CreateUserMutationResult = Apollo.MutationResult<CreateUserMutation>;
export type CreateUserMutationOptions = Apollo.BaseMutationOptions<CreateUserMutation, CreateUserMutationVariables>;
export const UpdateUserDocument = gql`
    mutation UpdateUser($input: UpdateUserInput!) {
  updateUser(input: $input) {
    id
    username
    email
    role
    member {
      miembro_id
      numero_socio
      nombre
      apellidos
      correo_electronico
    }
    isActive
    lastLogin
    emailVerified
    emailVerifiedAt
  }
}
    `;
export type UpdateUserMutationFn = Apollo.MutationFunction<UpdateUserMutation, UpdateUserMutationVariables>;

/**
 * __useUpdateUserMutation__
 *
 * To run a mutation, you first call `useUpdateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserMutation, { data, loading, error }] = useUpdateUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateUserMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserMutation, UpdateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument, options);
      }
export type UpdateUserMutationHookResult = ReturnType<typeof useUpdateUserMutation>;
export type UpdateUserMutationResult = Apollo.MutationResult<UpdateUserMutation>;
export type UpdateUserMutationOptions = Apollo.BaseMutationOptions<UpdateUserMutation, UpdateUserMutationVariables>;
export const DeleteUserDocument = gql`
    mutation DeleteUser($id: ID!) {
  deleteUser(id: $id) {
    success
    message
    error
  }
}
    `;
export type DeleteUserMutationFn = Apollo.MutationFunction<DeleteUserMutation, DeleteUserMutationVariables>;

/**
 * __useDeleteUserMutation__
 *
 * To run a mutation, you first call `useDeleteUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteUserMutation, { data, loading, error }] = useDeleteUserMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteUserMutation(baseOptions?: Apollo.MutationHookOptions<DeleteUserMutation, DeleteUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteUserMutation, DeleteUserMutationVariables>(DeleteUserDocument, options);
      }
export type DeleteUserMutationHookResult = ReturnType<typeof useDeleteUserMutation>;
export type DeleteUserMutationResult = Apollo.MutationResult<DeleteUserMutation>;
export type DeleteUserMutationOptions = Apollo.BaseMutationOptions<DeleteUserMutation, DeleteUserMutationVariables>;
export const ResetUserPasswordDocument = gql`
    mutation ResetUserPassword($userId: ID!, $newPassword: String!) {
  resetUserPassword(userId: $userId, newPassword: $newPassword) {
    success
    message
    error
  }
}
    `;
export type ResetUserPasswordMutationFn = Apollo.MutationFunction<ResetUserPasswordMutation, ResetUserPasswordMutationVariables>;

/**
 * __useResetUserPasswordMutation__
 *
 * To run a mutation, you first call `useResetUserPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResetUserPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resetUserPasswordMutation, { data, loading, error }] = useResetUserPasswordMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      newPassword: // value for 'newPassword'
 *   },
 * });
 */
export function useResetUserPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ResetUserPasswordMutation, ResetUserPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ResetUserPasswordMutation, ResetUserPasswordMutationVariables>(ResetUserPasswordDocument, options);
      }
export type ResetUserPasswordMutationHookResult = ReturnType<typeof useResetUserPasswordMutation>;
export type ResetUserPasswordMutationResult = Apollo.MutationResult<ResetUserPasswordMutation>;
export type ResetUserPasswordMutationOptions = Apollo.BaseMutationOptions<ResetUserPasswordMutation, ResetUserPasswordMutationVariables>;