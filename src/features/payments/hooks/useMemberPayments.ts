import { useQuery } from '@apollo/client'
import { gql } from '@apollo/client'

const GET_MEMBER_PAYMENTS = gql`
  query GetMemberPayments($memberId: ID!) {
    getMemberPayments(memberId: $memberId) {
      id
      member {
        miembro_id
        numero_socio
        nombre
        apellidos
      }
      amount
      payment_date
      status
      payment_method
      notes
    }
  }
`

const GET_FAMILY_BY_ORIGIN_MEMBER = gql`
  query GetFamilyByOriginMember($memberId: ID!) {
    getFamilyByOriginMember(memberId: $memberId) {
      id
      numero_socio
    }
  }
`

const GET_FAMILY_PAYMENTS = gql`
  query GetFamilyPayments($familyId: ID!) {
    getFamilyPayments(familyId: $familyId) {
      id
      family {
        id
        numero_socio
        esposo_nombre
        esposa_nombre
      }
      amount
      payment_date
      status
      payment_method
      notes
    }
  }
`

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
  payment_date: string
  status: string
  payment_method: string
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
  membershipType: 'INDIVIDUAL' | 'FAMILY'
): UseMemberPaymentsResult {
  console.log('🔬 [useMemberPayments] Init with:', { memberId, membershipType })
  
  // For INDIVIDUAL members: fetch payments directly
  const {
    data: individualData,
    loading: individualLoading,
    error: individualError,
    refetch: refetchIndividual,
  } = useQuery(GET_MEMBER_PAYMENTS, {
    variables: { memberId },
    skip: !memberId || membershipType !== 'INDIVIDUAL',
    onCompleted: (data) => {
      console.log('✅ [useMemberPayments] Individual payments loaded:', data)
    },
  })

  // For FAMILY members: first get the family ID
  const {
    data: familyData,
    loading: familyLoading,
    error: familyError,
  } = useQuery(GET_FAMILY_BY_ORIGIN_MEMBER, {
    variables: { memberId },
    skip: !memberId || membershipType !== 'FAMILY',
    onCompleted: (data) => {
      console.log('✅ [useMemberPayments] Family data loaded:', data)
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
  } = useQuery(GET_FAMILY_PAYMENTS, {
    variables: { familyId },
    skip: !familyId || membershipType !== 'FAMILY',
    onCompleted: (data) => {
      console.log('✅ [useMemberPayments] Family payments loaded:', data)
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
