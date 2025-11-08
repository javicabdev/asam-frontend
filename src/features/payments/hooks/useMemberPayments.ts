import { useQuery } from '@apollo/client'
import { useEffect } from 'react'
import {
  GetMemberPaymentsDocument,
  GetFamilyByOriginMemberDocument,
  GetFamilyPaymentsDocument,
} from '@/graphql/generated/operations'

export interface MemberPayment {
  id: string
  member: {
    miembro_id: string
    numero_socio: string
    nombre: string
    apellidos: string
    tipo_membresia: string
  }
  amount: number
  payment_date: string | null  // Can be null or invalid for pending payments
  status: string
  payment_method: string | null  // Can be null for pending payments
  notes?: string | null
  membership_fee?: {
    id: string
    year: number
  } | null
}

interface UseMemberPaymentsResult {
  payments: MemberPayment[]
  loading: boolean
  error: Error | null
  totalPaid: number
  refetch: () => void
}

/**
 * Hook to fetch and manage payment history for both individual and family members
 * Automatically detects membership type and uses the appropriate query
 */
export function useMemberPayments(
  memberId: string,
  membershipType: 'INDIVIDUAL' | 'FAMILY',
  skip: boolean = false
): UseMemberPaymentsResult {
  console.log('🔬 [useMemberPayments] Init with:', { memberId, membershipType, skip })

  // For INDIVIDUAL members: fetch payments directly
  const {
    data: individualData,
    loading: individualLoading,
    error: individualError,
    refetch: refetchIndividual,
    stopPolling: stopIndividualPolling,
  } = useQuery(GetMemberPaymentsDocument, {
    variables: { memberId },
    skip: skip || !memberId || membershipType !== 'INDIVIDUAL',
    fetchPolicy: 'network-only', // Always fetch fresh data to avoid cache issues
    pollInterval: 1000, // Poll every 1 second to handle backend async payment creation
    onCompleted: (data) => {
      console.log('✅ [useMemberPayments] Individual payments loaded:', JSON.stringify(data, null, 2))
      console.log('   getMemberPayments array:', data?.getMemberPayments)
      console.log('   Array length:', data?.getMemberPayments?.length)
    },
    onError: (error) => {
      console.error('❌ [useMemberPayments] Error loading individual payments:', error)
    },
  })

  // For FAMILY members: first get the family ID
  const {
    data: familyData,
    loading: familyLoading,
    error: familyError,
  } = useQuery(GetFamilyByOriginMemberDocument, {
    variables: { memberId },
    skip: skip || !memberId || membershipType !== 'FAMILY',
    fetchPolicy: 'network-only', // Always fetch fresh data to avoid cache issues
    onCompleted: (data) => {
      console.log('✅ [useMemberPayments] Family data loaded:', data)
    },
    onError: (error) => {
      console.error('❌ [useMemberPayments] Error loading family data:', error)
    },
  })

  const familyId = familyData?.getFamilyByOriginMember?.id
  console.log('📍 [useMemberPayments] Family ID:', familyId)

  // Then fetch family payments
  const {
    data: familyPaymentsData,
    loading: familyPaymentsLoading,
    error: familyPaymentsError,
    refetch: refetchFamily,
    stopPolling: stopFamilyPolling,
  } = useQuery(GetFamilyPaymentsDocument, {
    variables: { familyId: familyId || '' },
    skip: skip || !familyId || membershipType !== 'FAMILY',
    fetchPolicy: 'network-only', // Always fetch fresh data to avoid cache issues
    pollInterval: 1000, // Poll every 1 second to handle backend async payment creation
    onCompleted: (data) => {
      console.log('✅ [useMemberPayments] Family payments loaded:', data)
    },
    onError: (error) => {
      console.error('❌ [useMemberPayments] Error loading family payments:', error)
    },
  })

  // Determine which data to use based on membership type
  const payments: MemberPayment[] =
    membershipType === 'INDIVIDUAL'
      ? individualData?.getMemberPayments || []
      : familyPaymentsData?.getFamilyPayments || []

  console.log('📊 [useMemberPayments] Final payments:', payments)

  // Stop polling once we have payments (handles race condition with backend async payment creation)
  useEffect(() => {
    if (payments.length > 0) {
      console.log('🛑 [useMemberPayments] Stopping polling - payments found')
      if (membershipType === 'INDIVIDUAL') {
        stopIndividualPolling?.()
      } else {
        stopFamilyPolling?.()
      }
    }
  }, [payments.length, membershipType, stopIndividualPolling, stopFamilyPolling])

  const loading =
    membershipType === 'INDIVIDUAL'
      ? individualLoading
      : familyLoading || familyPaymentsLoading

  const error =
    membershipType === 'INDIVIDUAL'
      ? individualError
      : familyError || familyPaymentsError

  const refetch = membershipType === 'INDIVIDUAL' ? refetchIndividual : refetchFamily

  // Calculate total paid (only confirmed payments)
  const totalPaid = payments
    .filter((payment) => payment.status.toUpperCase() === 'PAID')
    .reduce((sum, payment) => sum + payment.amount, 0)

  return {
    payments,
    loading,
    error: error || null,
    totalPaid,
    refetch,
  }
}
