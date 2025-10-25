export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
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
  date: Scalars['Time']['output'];
  detail: Scalars['String']['output'];
  family?: Maybe<Family>;
  id: Scalars['ID']['output'];
  member?: Maybe<Member>;
  operation_type: OperationType;
  payment?: Maybe<Payment>;
};

export type ChangePasswordInput = {
  currentPassword: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
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
};

export type CreateMemberInput = {
  apellidos: Scalars['String']['input'];
  calle_numero_piso: Scalars['String']['input'];
  codigo_postal: Scalars['String']['input'];
  correo_electronico?: InputMaybe<Scalars['String']['input']>;
  documento_identidad?: InputMaybe<Scalars['String']['input']>;
  fecha_nacimiento?: InputMaybe<Scalars['Time']['input']>;
  nacionalidad?: InputMaybe<Scalars['String']['input']>;
  nombre: Scalars['String']['input'];
  numero_socio: Scalars['String']['input'];
  observaciones?: InputMaybe<Scalars['String']['input']>;
  pais?: InputMaybe<Scalars['String']['input']>;
  poblacion: Scalars['String']['input'];
  profesion?: InputMaybe<Scalars['String']['input']>;
  provincia?: InputMaybe<Scalars['String']['input']>;
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
};

export type FamiliarInput = {
  apellidos: Scalars['String']['input'];
  correo_electronico?: InputMaybe<Scalars['String']['input']>;
  dni_nie?: InputMaybe<Scalars['String']['input']>;
  fecha_nacimiento?: InputMaybe<Scalars['Time']['input']>;
  nombre: Scalars['String']['input'];
  parentesco: Scalars['String']['input'];
};

export type Family = {
  __typename?: 'Family';
  esposa_apellidos: Scalars['String']['output'];
  esposa_nombre: Scalars['String']['output'];
  esposo_apellidos: Scalars['String']['output'];
  esposo_nombre: Scalars['String']['output'];
  familiares?: Maybe<Array<Familiar>>;
  id: Scalars['ID']['output'];
  miembro_origen?: Maybe<Member>;
  numero_socio: Scalars['String']['output'];
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
  payment?: Maybe<Payment>;
  status: PaymentStatus;
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

export type Mutation = {
  __typename?: 'Mutation';
  addFamilyMember: Family;
  adjustBalance: MutationResponse;
  cancelPayment: MutationResponse;
  changeMemberStatus: Member;
  changePassword: MutationResponse;
  createFamily: Family;
  createMember: Member;
  createUser: User;
  deleteMember: MutationResponse;
  deleteUser: MutationResponse;
  login: AuthResponse;
  logout: MutationResponse;
  refreshToken: TokenResponse;
  registerFee: MutationResponse;
  registerPayment: Payment;
  registerTransaction: CashFlow;
  removeFamilyMember: MutationResponse;
  requestPasswordReset: MutationResponse;
  resendVerificationEmail: MutationResponse;
  resetPasswordWithToken: MutationResponse;
  resetUserPassword: MutationResponse;
  sendVerificationEmail: MutationResponse;
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


export type MutationCreateFamilyArgs = {
  input: CreateFamilyInput;
};


export type MutationCreateMemberArgs = {
  input: CreateMemberInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationDeleteMemberArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationRefreshTokenArgs = {
  input: RefreshTokenInput;
};


export type MutationRegisterFeeArgs = {
  base_amount: Scalars['Float']['input'];
  year: Scalars['Int']['input'];
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
  | 'CURRENT_EXPENSE'
  | 'FUND_DELIVERY'
  | 'MEMBERSHIP_FEE'
  | 'OTHER_INCOME';

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
  family?: Maybe<Family>;
  id: Scalars['ID']['output'];
  member?: Maybe<Member>;
  membership_fee?: Maybe<MembershipFee>;
  notes?: Maybe<Scalars['String']['output']>;
  payment_date: Scalars['Time']['output'];
  payment_method: Scalars['String']['output'];
  status: PaymentStatus;
};

export type PaymentInput = {
  amount: Scalars['Float']['input'];
  family_id?: InputMaybe<Scalars['ID']['input']>;
  member_id?: InputMaybe<Scalars['ID']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  payment_method: Scalars['String']['input'];
};

export type PaymentStatus =
  | 'CANCELLED'
  | 'PAID'
  | 'PENDING';

export type Query = {
  __typename?: 'Query';
  checkDocumentValidity: DocumentValidationResult;
  checkMemberNumberExists: Scalars['Boolean']['output'];
  getBalance: Scalars['Float']['output'];
  getCashFlow?: Maybe<CashFlow>;
  getCurrentUser: User;
  getDashboardStats: DashboardStats;
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
  listFamilies: FamilyConnection;
  listMembers: MemberConnection;
  listMembershipFees: Array<MembershipFee>;
  listUsers: Array<User>;
  ping: Scalars['String']['output'];
  searchMembers: Array<Member>;
  searchMembersWithoutUser: Array<Member>;
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
  end_date?: InputMaybe<Scalars['Time']['input']>;
  operation_type?: InputMaybe<OperationType>;
  pagination?: InputMaybe<PaginationInput>;
  sort?: InputMaybe<SortInput>;
  start_date?: InputMaybe<Scalars['Time']['input']>;
};

export type TransactionInput = {
  amount: Scalars['Float']['input'];
  date: Scalars['Time']['input'];
  detail: Scalars['String']['input'];
  family_id?: InputMaybe<Scalars['ID']['input']>;
  member_id?: InputMaybe<Scalars['ID']['input']>;
  operation_type: OperationType;
};

export type TransactionSortField =
  | 'AMOUNT'
  | 'DATE'
  | 'OPERATION_TYPE';

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
};

export type UpdateMemberInput = {
  calle_numero_piso?: InputMaybe<Scalars['String']['input']>;
  codigo_postal?: InputMaybe<Scalars['String']['input']>;
  correo_electronico?: InputMaybe<Scalars['String']['input']>;
  documento_identidad?: InputMaybe<Scalars['String']['input']>;
  miembro_id: Scalars['ID']['input'];
  observaciones?: InputMaybe<Scalars['String']['input']>;
  pais?: InputMaybe<Scalars['String']['input']>;
  poblacion?: InputMaybe<Scalars['String']['input']>;
  profesion?: InputMaybe<Scalars['String']['input']>;
  provincia?: InputMaybe<Scalars['String']['input']>;
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

export type UserRole =
  | 'admin'
  | 'user';
