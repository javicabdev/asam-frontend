import { useQuery, ApolloError } from '@apollo/client'
import { GetFamilyByOriginMemberDocument } from '@/graphql/generated/operations'
import type {
  GetFamilyByOriginMemberQuery,
  GetFamilyByOriginMemberQueryVariables,
} from '@/graphql/generated/operations'
import { MembershipType } from '../types'

type FamilyData = NonNullable<GetFamilyByOriginMemberQuery['getFamilyByOriginMember']>
type Familiar = NonNullable<FamilyData['familiares']>[number]

interface UseFamilyDataResult {
  family: FamilyData | null
  familiares: Familiar[]
  loading: boolean
  error: ApolloError | undefined
}

/**
 * Hook to fetch family data including additional family members (familiares)
 * Only executes the query if the member is of type FAMILY
 *
 * @param memberId - The ID of the member who is the origin of the family
 * @param membershipType - The type of membership (INDIVIDUAL or FAMILY)
 * @returns Family data, array of familiares, loading state, and error
 */
export function useFamilyData(
  memberId: string,
  membershipType: MembershipType
): UseFamilyDataResult {
  const { data, loading, error } = useQuery<
    GetFamilyByOriginMemberQuery,
    GetFamilyByOriginMemberQueryVariables
  >(GetFamilyByOriginMemberDocument, {
    variables: { memberId },
    skip: membershipType !== MembershipType.FAMILY || !memberId,
    fetchPolicy: 'cache-and-network',
  })

  const familyData = data?.getFamilyByOriginMember

  return {
    family: familyData || null,
    familiares: familyData?.familiares || [],
    loading,
    error,
  }
}
