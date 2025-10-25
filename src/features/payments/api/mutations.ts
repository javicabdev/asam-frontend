// Re-export payment mutations from generated operations
export {
  useRegisterPaymentMutation,
  useUpdatePaymentMutation,
  useCancelPaymentMutation,
  useRegisterFeeMutation,
} from '@/graphql/generated/operations'

// Export mutation documents for direct use if needed
export {
  RegisterPaymentDocument,
  UpdatePaymentDocument,
  CancelPaymentDocument,
  RegisterFeeDocument,
} from '@/graphql/generated/operations'

// Export types
export type {
  RegisterPaymentMutation,
  RegisterPaymentMutationVariables,
  UpdatePaymentMutation,
  UpdatePaymentMutationVariables,
  PaymentInput,
} from '@/graphql/generated/operations'
