// Re-export payment mutations from generated operations
export {
  useRegisterPaymentMutation,
  useUpdatePaymentMutation,
  useConfirmPaymentMutation,
  useCancelPaymentMutation,
  useRegisterFeeMutation,
} from '@/graphql/generated/operations'

// Export mutation documents for direct use if needed
export {
  RegisterPaymentDocument,
  UpdatePaymentDocument,
  ConfirmPaymentDocument,
  CancelPaymentDocument,
  RegisterFeeDocument,
} from '@/graphql/generated/operations'

// Export types
export type {
  RegisterPaymentMutation,
  RegisterPaymentMutationVariables,
  UpdatePaymentMutation,
  UpdatePaymentMutationVariables,
  ConfirmPaymentMutation,
  ConfirmPaymentMutationVariables,
  PaymentInput,
} from '@/graphql/generated/operations'
