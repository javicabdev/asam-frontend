// Re-export payment queries from generated operations
export {
  useGetPaymentQuery,
  useGetMemberPaymentsQuery,
  useGetFamilyPaymentsQuery,
  useGetPaymentStatusQuery,
} from '@/graphql/generated/operations'

// Export query documents for direct use if needed
export {
  GetPaymentDocument,
  GetMemberPaymentsDocument,
  GetFamilyPaymentsDocument,
  GetPaymentStatusDocument,
} from '@/graphql/generated/operations'
