import { useQuery } from '@apollo/client'
import { 
  GetMemberPaymentsDocument,
  GetFamilyByOriginMemberDocument,
  GetFamilyPaymentsDocument,
} from '@/graphql/generated/operations'

export interface MemberPayment {
  id: string
  member?: {
    miembro_id: string
    numero_socio: string
    nombre: string
    apellidos: string
  }
  family?: {
    id: string
    numero_socio: string
    esposo_nombre: string
    esposa_nombre: string
  }
  amount: number
  payment_date: string | null  // Can be null or invalid for pending payments
  status: string
  payment_method: string | null  // Can be null for pending payments
  notes?: string | null
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
  } = useQuery(GetMemberPaymentsDocument, {
    variables: { memberId },
    skip: skip || !memberId || membershipType !== 'INDIVIDUAL',
    onCompleted: (data) => {
      console.log('✅ [useMemberPayments] Individual payments loaded:', data)
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
  } = useQuery(GetFamilyPaymentsDocument, {
    variables: { familyId: familyId || '' },
    skip: skip || !familyId || membershipType !== 'FAMILY',
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
