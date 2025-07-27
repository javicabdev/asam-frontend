import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type UserFieldsFragment = { __typename?: 'User', id: string, username: string, email: string, role: UserRole, isActive: boolean, lastLogin?: string | null, emailVerified: boolean, emailVerifiedAt?: string | null };

export type AuthTokensFragment = { __typename?: 'AuthResponse', accessToken: string, refreshToken: string, expiresAt: string };

export type GetCurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentUserQuery = { __typename?: 'Query', getCurrentUser: { __typename?: 'User', id: string, username: string, email: string, role: UserRole, isActive: boolean, lastLogin?: string | null, emailVerified: boolean, emailVerifiedAt?: string | null } };

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AuthResponse', accessToken: string, refreshToken: string, expiresAt: string, user: { __typename?: 'User', id: string, username: string, email: string, role: UserRole, isActive: boolean, lastLogin?: string | null, emailVerified: boolean, emailVerifiedAt?: string | null } } };

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

export type RequestPasswordResetMutationVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type RequestPasswordResetMutation = { __typename?: 'Mutation', requestPasswordReset: { __typename?: 'MutationResponse', success: boolean, message?: string | null, error?: string | null } };

export type ResetPasswordWithTokenMutationVariables = Exact<{
  token: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
}>;


export type ResetPasswordWithTokenMutation = { __typename?: 'Mutation', resetPasswordWithToken: { __typename?: 'MutationResponse', success: boolean, message?: string | null, error?: string | null } };

export type ResendVerificationEmailMutationVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type ResendVerificationEmailMutation = { __typename?: 'Mutation', resendVerificationEmail: { __typename?: 'MutationResponse', success: boolean, message?: string | null, error?: string | null } };

export type CreateFamilyMutationVariables = Exact<{
  input: CreateFamilyInput;
}>;


export type CreateFamilyMutation = { __typename?: 'Mutation', createFamily: { __typename?: 'Family', id: string, numero_socio: string, esposo_nombre: string, esposo_apellidos: string, esposa_nombre: string, esposa_apellidos: string, miembro_origen?: { __typename?: 'Member', miembro_id: string, nombre: string, apellidos: string } | null } };

export type AddFamilyMemberMutationVariables = Exact<{
  family_id: Scalars['ID']['input'];
  familiar: FamiliarInput;
}>;


export type AddFamilyMemberMutation = { __typename?: 'Mutation', addFamilyMember: { __typename?: 'Family', id: string, familiares?: Array<{ __typename?: 'Familiar', id: string, nombre: string, apellidos: string, fecha_nacimiento?: string | null, dni_nie?: string | null, correo_electronico?: string | null }> | null } };

export type GetFamilyQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetFamilyQuery = { __typename?: 'Query', getFamily?: { __typename?: 'Family', id: string, numero_socio: string, esposo_nombre: string, esposo_apellidos: string, esposa_nombre: string, esposa_apellidos: string, miembro_origen?: { __typename?: 'Member', miembro_id: string, nombre: string, apellidos: string } | null, familiares?: Array<{ __typename?: 'Familiar', id: string, nombre: string, apellidos: string, fecha_nacimiento?: string | null, dni_nie?: string | null, correo_electronico?: string | null }> | null } | null };

export type MemberBasicFieldsFragment = { __typename?: 'Member', miembro_id: string, numero_socio: string, tipo_membresia: MembershipType, nombre: string, apellidos: string, estado: MemberStatus, fecha_alta: string, fecha_baja?: string | null, correo_electronico?: string | null, poblacion: string, provincia: string, documento_identidad?: string | null };

export type MemberFullFieldsFragment = { __typename?: 'Member', calle_numero_piso: string, codigo_postal: string, pais: string, fecha_nacimiento?: string | null, profesion?: string | null, nacionalidad?: string | null, observaciones?: string | null, miembro_id: string, numero_socio: string, tipo_membresia: MembershipType, nombre: string, apellidos: string, estado: MemberStatus, fecha_alta: string, fecha_baja?: string | null, correo_electronico?: string | null, poblacion: string, provincia: string, documento_identidad?: string | null };

export type GetMemberQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetMemberQuery = { __typename?: 'Query', getMember?: { __typename?: 'Member', calle_numero_piso: string, codigo_postal: string, pais: string, fecha_nacimiento?: string | null, profesion?: string | null, nacionalidad?: string | null, observaciones?: string | null, miembro_id: string, numero_socio: string, tipo_membresia: MembershipType, nombre: string, apellidos: string, estado: MemberStatus, fecha_alta: string, fecha_baja?: string | null, correo_electronico?: string | null, poblacion: string, provincia: string, documento_identidad?: string | null } | null };

export type ListMembersQueryVariables = Exact<{
  filter?: InputMaybe<MemberFilter>;
}>;


export type ListMembersQuery = { __typename?: 'Query', listMembers: { __typename?: 'MemberConnection', nodes: Array<{ __typename?: 'Member', miembro_id: string, numero_socio: string, tipo_membresia: MembershipType, nombre: string, apellidos: string, estado: MemberStatus, fecha_alta: string, fecha_baja?: string | null, correo_electronico?: string | null, poblacion: string, provincia: string, documento_identidad?: string | null }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, totalCount: number } } };

export type SearchMembersQueryVariables = Exact<{
  criteria: Scalars['String']['input'];
}>;


export type SearchMembersQuery = { __typename?: 'Query', searchMembers: Array<{ __typename?: 'Member', miembro_id: string, numero_socio: string, tipo_membresia: MembershipType, nombre: string, apellidos: string, estado: MemberStatus, fecha_alta: string, fecha_baja?: string | null, correo_electronico?: string | null, poblacion: string, provincia: string, documento_identidad?: string | null }> };

export type GetNextMemberNumberQueryVariables = Exact<{
  isFamily: Scalars['Boolean']['input'];
}>;


export type GetNextMemberNumberQuery = { __typename?: 'Query', getNextMemberNumber: string };

export type CheckMemberNumberExistsQueryVariables = Exact<{
  memberNumber: Scalars['String']['input'];
}>;


export type CheckMemberNumberExistsQuery = { __typename?: 'Query', checkMemberNumberExists: boolean };

export type ValidateDocumentQueryVariables = Exact<{
  documentNumber: Scalars['String']['input'];
}>;


export type ValidateDocumentQuery = { __typename?: 'Query', checkDocumentValidity: { __typename?: 'DocumentValidationResult', isValid: boolean, normalizedValue?: string | null, errorMessage?: string | null } };

export type CreateMemberMutationVariables = Exact<{
  input: CreateMemberInput;
}>;


export type CreateMemberMutation = { __typename?: 'Mutation', createMember: { __typename?: 'Member', calle_numero_piso: string, codigo_postal: string, pais: string, fecha_nacimiento?: string | null, profesion?: string | null, nacionalidad?: string | null, observaciones?: string | null, miembro_id: string, numero_socio: string, tipo_membresia: MembershipType, nombre: string, apellidos: string, estado: MemberStatus, fecha_alta: string, fecha_baja?: string | null, correo_electronico?: string | null, poblacion: string, provincia: string, documento_identidad?: string | null } };

export type UpdateMemberMutationVariables = Exact<{
  input: UpdateMemberInput;
}>;


export type UpdateMemberMutation = { __typename?: 'Mutation', updateMember: { __typename?: 'Member', calle_numero_piso: string, codigo_postal: string, pais: string, fecha_nacimiento?: string | null, profesion?: string | null, nacionalidad?: string | null, observaciones?: string | null, miembro_id: string, numero_socio: string, tipo_membresia: MembershipType, nombre: string, apellidos: string, estado: MemberStatus, fecha_alta: string, fecha_baja?: string | null, correo_electronico?: string | null, poblacion: string, provincia: string, documento_identidad?: string | null } };

export type DeleteMemberMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteMemberMutation = { __typename?: 'Mutation', deleteMember: { __typename?: 'MutationResponse', success: boolean, message?: string | null, error?: string | null } };

export type ChangeMemberStatusMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  status: MemberStatus;
}>;


export type ChangeMemberStatusMutation = { __typename?: 'Mutation', changeMemberStatus: { __typename?: 'Member', miembro_id: string, numero_socio: string, tipo_membresia: MembershipType, nombre: string, apellidos: string, estado: MemberStatus, fecha_alta: string, fecha_baja?: string | null, correo_electronico?: string | null, poblacion: string, provincia: string, documento_identidad?: string | null } };

export type PaymentFieldsFragment = { __typename?: 'Payment', id: string, amount: number, payment_date: string, status: PaymentStatus, payment_method: string, notes?: string | null };

export type CashFlowFieldsFragment = { __typename?: 'CashFlow', id: string, amount: number, date: string, operation_type: OperationType, detail: string };

export type GetPaymentQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetPaymentQuery = { __typename?: 'Query', getPayment?: { __typename?: 'Payment', id: string, amount: number, payment_date: string, status: PaymentStatus, payment_method: string, notes?: string | null, member?: { __typename?: 'Member', miembro_id: string, numero_socio: string, nombre: string, apellidos: string } | null, family?: { __typename?: 'Family', id: string, numero_socio: string } | null } | null };

export type GetMemberPaymentsQueryVariables = Exact<{
  memberId: Scalars['ID']['input'];
}>;


export type GetMemberPaymentsQuery = { __typename?: 'Query', getMemberPayments: Array<{ __typename?: 'Payment', id: string, amount: number, payment_date: string, status: PaymentStatus, payment_method: string, notes?: string | null }> };

export type GetFamilyPaymentsQueryVariables = Exact<{
  familyId: Scalars['ID']['input'];
}>;


export type GetFamilyPaymentsQuery = { __typename?: 'Query', getFamilyPayments: Array<{ __typename?: 'Payment', id: string, amount: number, payment_date: string, status: PaymentStatus, payment_method: string, notes?: string | null }> };

export type GetBalanceQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBalanceQuery = { __typename?: 'Query', getBalance: number };

export type GetTransactionsQueryVariables = Exact<{
  filter?: InputMaybe<TransactionFilter>;
}>;


export type GetTransactionsQuery = { __typename?: 'Query', getTransactions: { __typename?: 'TransactionConnection', nodes: Array<{ __typename?: 'CashFlow', id: string, amount: number, date: string, operation_type: OperationType, detail: string, member?: { __typename?: 'Member', miembro_id: string, numero_socio: string, nombre: string, apellidos: string } | null, family?: { __typename?: 'Family', id: string, numero_socio: string } | null, payment?: { __typename?: 'Payment', id: string, amount: number, payment_method: string } | null }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, totalCount: number } } };

export type GetPaymentStatusQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetPaymentStatusQuery = { __typename?: 'Query', getPaymentStatus: PaymentStatus };

export type GetCashFlowQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetCashFlowQuery = { __typename?: 'Query', getCashFlow?: { __typename?: 'CashFlow', id: string, amount: number, date: string, operation_type: OperationType, detail: string, member?: { __typename?: 'Member', miembro_id: string, numero_socio: string, nombre: string, apellidos: string } | null, family?: { __typename?: 'Family', id: string, numero_socio: string } | null, payment?: { __typename?: 'Payment', id: string, amount: number, payment_method: string, status: PaymentStatus } | null } | null };

export type RegisterPaymentMutationVariables = Exact<{
  input: PaymentInput;
}>;


export type RegisterPaymentMutation = { __typename?: 'Mutation', registerPayment: { __typename?: 'Payment', id: string, amount: number, payment_date: string, status: PaymentStatus, payment_method: string, notes?: string | null } };

export type UpdatePaymentMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: PaymentInput;
}>;


export type UpdatePaymentMutation = { __typename?: 'Mutation', updatePayment: { __typename?: 'Payment', id: string, amount: number, payment_date: string, status: PaymentStatus, payment_method: string, notes?: string | null } };

export type CancelPaymentMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  reason: Scalars['String']['input'];
}>;


export type CancelPaymentMutation = { __typename?: 'Mutation', cancelPayment: { __typename?: 'MutationResponse', success: boolean, message?: string | null, error?: string | null } };

export type RegisterFeeMutationVariables = Exact<{
  year: Scalars['Int']['input'];
  month: Scalars['Int']['input'];
  baseAmount: Scalars['Float']['input'];
}>;


export type RegisterFeeMutation = { __typename?: 'Mutation', registerFee: { __typename?: 'MutationResponse', success: boolean, message?: string | null, error?: string | null } };

export type RegisterTransactionMutationVariables = Exact<{
  input: TransactionInput;
}>;


export type RegisterTransactionMutation = { __typename?: 'Mutation', registerTransaction: { __typename?: 'CashFlow', id: string, amount: number, date: string, operation_type: OperationType, detail: string } };

export type UpdateTransactionMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: TransactionInput;
}>;


export type UpdateTransactionMutation = { __typename?: 'Mutation', updateTransaction: { __typename?: 'CashFlow', id: string, amount: number, date: string, operation_type: OperationType, detail: string } };

export type AdjustBalanceMutationVariables = Exact<{
  amount: Scalars['Float']['input'];
  reason: Scalars['String']['input'];
}>;


export type AdjustBalanceMutation = { __typename?: 'Mutation', adjustBalance: { __typename?: 'MutationResponse', success: boolean, message?: string | null, error?: string | null } };

export type HealthCheckQueryVariables = Exact<{ [key: string]: never; }>;


export type HealthCheckQuery = { __typename?: 'Query', health: string };

export type PingQueryVariables = Exact<{ [key: string]: never; }>;


export type PingQuery = { __typename?: 'Query', ping: string };

export type GetUserQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetUserQuery = { __typename?: 'Query', getUser?: { __typename?: 'User', id: string, username: string, role: UserRole, isActive: boolean, lastLogin?: string | null, emailVerified: boolean, emailVerifiedAt?: string | null } | null };

export type ListUsersQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
}>;


export type ListUsersQuery = { __typename?: 'Query', listUsers: Array<{ __typename?: 'User', id: string, username: string, role: UserRole, isActive: boolean, lastLogin?: string | null, emailVerified: boolean, emailVerifiedAt?: string | null }> };

export type CreateUserMutationVariables = Exact<{
  input: CreateUserInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'User', id: string, username: string, role: UserRole, isActive: boolean } };

export type UpdateUserMutationVariables = Exact<{
  input: UpdateUserInput;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'User', id: string, username: string, role: UserRole, isActive: boolean, emailVerified: boolean } };

export type DeleteUserMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteUserMutation = { __typename?: 'Mutation', deleteUser: { __typename?: 'MutationResponse', success: boolean, message?: string | null, error?: string | null } };

export type ResetUserPasswordMutationVariables = Exact<{
  userId: Scalars['ID']['input'];
  newPassword: Scalars['String']['input'];
}>;


export type ResetUserPasswordMutation = { __typename?: 'Mutation', resetUserPassword: { __typename?: 'MutationResponse', success: boolean, message?: string | null, error?: string | null } };

export const UserFieldsFragmentDoc = gql`
    fragment UserFields on User {
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
export const AuthTokensFragmentDoc = gql`
    fragment AuthTokens on AuthResponse {
  accessToken
  refreshToken
  expiresAt
}
    `;
export const MemberBasicFieldsFragmentDoc = gql`
    fragment MemberBasicFields on Member {
  miembro_id
  numero_socio
  tipo_membresia
  nombre
  apellidos
  estado
  fecha_alta
  fecha_baja
  correo_electronico
  poblacion
  provincia
  documento_identidad
}
    `;
export const MemberFullFieldsFragmentDoc = gql`
    fragment MemberFullFields on Member {
  ...MemberBasicFields
  calle_numero_piso
  codigo_postal
  pais
  fecha_nacimiento
  profesion
  nacionalidad
  observaciones
}
    ${MemberBasicFieldsFragmentDoc}`;
export const PaymentFieldsFragmentDoc = gql`
    fragment PaymentFields on Payment {
  id
  amount
  payment_date
  status
  payment_method
  notes
}
    `;
export const CashFlowFieldsFragmentDoc = gql`
    fragment CashFlowFields on CashFlow {
  id
  amount
  date
  operation_type
  detail
}
    `;
export const GetCurrentUserDocument = gql`
    query GetCurrentUser {
  getCurrentUser {
    ...UserFields
  }
}
    ${UserFieldsFragmentDoc}`;

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
      ...UserFields
    }
    ...AuthTokens
  }
}
    ${UserFieldsFragmentDoc}
${AuthTokensFragmentDoc}`;
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
export const CreateFamilyDocument = gql`
    mutation CreateFamily($input: CreateFamilyInput!) {
  createFamily(input: $input) {
    id
    numero_socio
    esposo_nombre
    esposo_apellidos
    esposa_nombre
    esposa_apellidos
    miembro_origen {
      miembro_id
      nombre
      apellidos
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
export const AddFamilyMemberDocument = gql`
    mutation AddFamilyMember($family_id: ID!, $familiar: FamiliarInput!) {
  addFamilyMember(family_id: $family_id, familiar: $familiar) {
    id
    familiares {
      id
      nombre
      apellidos
      fecha_nacimiento
      dni_nie
      correo_electronico
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
export const GetFamilyDocument = gql`
    query GetFamily($id: ID!) {
  getFamily(id: $id) {
    id
    numero_socio
    esposo_nombre
    esposo_apellidos
    esposa_nombre
    esposa_apellidos
    miembro_origen {
      miembro_id
      nombre
      apellidos
    }
    familiares {
      id
      nombre
      apellidos
      fecha_nacimiento
      dni_nie
      correo_electronico
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
export const GetMemberDocument = gql`
    query GetMember($id: ID!) {
  getMember(id: $id) {
    ...MemberFullFields
  }
}
    ${MemberFullFieldsFragmentDoc}`;

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
      ...MemberBasicFields
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      totalCount
    }
  }
}
    ${MemberBasicFieldsFragmentDoc}`;

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
    ...MemberBasicFields
  }
}
    ${MemberBasicFieldsFragmentDoc}`;

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
export const CreateMemberDocument = gql`
    mutation CreateMember($input: CreateMemberInput!) {
  createMember(input: $input) {
    ...MemberFullFields
  }
}
    ${MemberFullFieldsFragmentDoc}`;
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
    ...MemberFullFields
  }
}
    ${MemberFullFieldsFragmentDoc}`;
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
    ...MemberBasicFields
  }
}
    ${MemberBasicFieldsFragmentDoc}`;
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
    ...PaymentFields
    member {
      miembro_id
      numero_socio
      nombre
      apellidos
    }
    family {
      id
      numero_socio
    }
  }
}
    ${PaymentFieldsFragmentDoc}`;

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
    ...PaymentFields
  }
}
    ${PaymentFieldsFragmentDoc}`;

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
    ...PaymentFields
  }
}
    ${PaymentFieldsFragmentDoc}`;

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
export const GetBalanceDocument = gql`
    query GetBalance {
  getBalance
}
    `;

/**
 * __useGetBalanceQuery__
 *
 * To run a query within a React component, call `useGetBalanceQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBalanceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBalanceQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetBalanceQuery(baseOptions?: Apollo.QueryHookOptions<GetBalanceQuery, GetBalanceQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBalanceQuery, GetBalanceQueryVariables>(GetBalanceDocument, options);
      }
export function useGetBalanceLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBalanceQuery, GetBalanceQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBalanceQuery, GetBalanceQueryVariables>(GetBalanceDocument, options);
        }
export function useGetBalanceSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetBalanceQuery, GetBalanceQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetBalanceQuery, GetBalanceQueryVariables>(GetBalanceDocument, options);
        }
export type GetBalanceQueryHookResult = ReturnType<typeof useGetBalanceQuery>;
export type GetBalanceLazyQueryHookResult = ReturnType<typeof useGetBalanceLazyQuery>;
export type GetBalanceSuspenseQueryHookResult = ReturnType<typeof useGetBalanceSuspenseQuery>;
export type GetBalanceQueryResult = Apollo.QueryResult<GetBalanceQuery, GetBalanceQueryVariables>;
export const GetTransactionsDocument = gql`
    query GetTransactions($filter: TransactionFilter) {
  getTransactions(filter: $filter) {
    nodes {
      ...CashFlowFields
      member {
        miembro_id
        numero_socio
        nombre
        apellidos
      }
      family {
        id
        numero_socio
      }
      payment {
        id
        amount
        payment_method
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      totalCount
    }
  }
}
    ${CashFlowFieldsFragmentDoc}`;

/**
 * __useGetTransactionsQuery__
 *
 * To run a query within a React component, call `useGetTransactionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTransactionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTransactionsQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useGetTransactionsQuery(baseOptions?: Apollo.QueryHookOptions<GetTransactionsQuery, GetTransactionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTransactionsQuery, GetTransactionsQueryVariables>(GetTransactionsDocument, options);
      }
export function useGetTransactionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTransactionsQuery, GetTransactionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTransactionsQuery, GetTransactionsQueryVariables>(GetTransactionsDocument, options);
        }
export function useGetTransactionsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTransactionsQuery, GetTransactionsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTransactionsQuery, GetTransactionsQueryVariables>(GetTransactionsDocument, options);
        }
export type GetTransactionsQueryHookResult = ReturnType<typeof useGetTransactionsQuery>;
export type GetTransactionsLazyQueryHookResult = ReturnType<typeof useGetTransactionsLazyQuery>;
export type GetTransactionsSuspenseQueryHookResult = ReturnType<typeof useGetTransactionsSuspenseQuery>;
export type GetTransactionsQueryResult = Apollo.QueryResult<GetTransactionsQuery, GetTransactionsQueryVariables>;
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
export const GetCashFlowDocument = gql`
    query GetCashFlow($id: ID!) {
  getCashFlow(id: $id) {
    ...CashFlowFields
    member {
      miembro_id
      numero_socio
      nombre
      apellidos
    }
    family {
      id
      numero_socio
    }
    payment {
      id
      amount
      payment_method
      status
    }
  }
}
    ${CashFlowFieldsFragmentDoc}`;

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
export const RegisterPaymentDocument = gql`
    mutation RegisterPayment($input: PaymentInput!) {
  registerPayment(input: $input) {
    ...PaymentFields
  }
}
    ${PaymentFieldsFragmentDoc}`;
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
    ...PaymentFields
  }
}
    ${PaymentFieldsFragmentDoc}`;
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
export const RegisterFeeDocument = gql`
    mutation RegisterFee($year: Int!, $month: Int!, $baseAmount: Float!) {
  registerFee(year: $year, month: $month, base_amount: $baseAmount) {
    success
    message
    error
  }
}
    `;
export type RegisterFeeMutationFn = Apollo.MutationFunction<RegisterFeeMutation, RegisterFeeMutationVariables>;

/**
 * __useRegisterFeeMutation__
 *
 * To run a mutation, you first call `useRegisterFeeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterFeeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerFeeMutation, { data, loading, error }] = useRegisterFeeMutation({
 *   variables: {
 *      year: // value for 'year'
 *      month: // value for 'month'
 *      baseAmount: // value for 'baseAmount'
 *   },
 * });
 */
export function useRegisterFeeMutation(baseOptions?: Apollo.MutationHookOptions<RegisterFeeMutation, RegisterFeeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterFeeMutation, RegisterFeeMutationVariables>(RegisterFeeDocument, options);
      }
export type RegisterFeeMutationHookResult = ReturnType<typeof useRegisterFeeMutation>;
export type RegisterFeeMutationResult = Apollo.MutationResult<RegisterFeeMutation>;
export type RegisterFeeMutationOptions = Apollo.BaseMutationOptions<RegisterFeeMutation, RegisterFeeMutationVariables>;
export const RegisterTransactionDocument = gql`
    mutation RegisterTransaction($input: TransactionInput!) {
  registerTransaction(input: $input) {
    ...CashFlowFields
  }
}
    ${CashFlowFieldsFragmentDoc}`;
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
    ...CashFlowFields
  }
}
    ${CashFlowFieldsFragmentDoc}`;
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
export const GetUserDocument = gql`
    query GetUser($id: ID!) {
  getUser(id: $id) {
    id
    username
    role
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
    query ListUsers($page: Int = 1, $pageSize: Int = 10) {
  listUsers(page: $page, pageSize: $pageSize) {
    id
    username
    role
    isActive
    lastLogin
    emailVerified
    emailVerifiedAt
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
    role
    isActive
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
    role
    isActive
    emailVerified
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