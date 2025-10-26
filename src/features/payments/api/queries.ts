// Re-export payment queries from generated operations
export {
  useGetPaymentQuery,
  useGetMemberPaymentsQuery,
  useGetFamilyPaymentsQuery,
  useGetPaymentStatusQuery,
  useListPaymentsQuery,
} from '@/graphql/generated/operations'

// Export query documents for direct use if needed
export {
  GetPaymentDocument,
  GetMemberPaymentsDocument,
  GetFamilyPaymentsDocument,
  GetPaymentStatusDocument,
  ListPaymentsDocument,
} from '@/graphql/generated/operations'
