import { useGetMemberQuery, useGetFamilyByOriginMemberQuery } from '@/graphql/generated/operations'

export const useMemberData = (memberId: string) => {
  const { data: memberData, loading: memberLoading, error: memberError } = useGetMemberQuery({
    variables: { id: memberId },
    skip: !memberId,
  })

  const member = memberData?.getMember
  const isFamily = member?.tipo_membresia === 'FAMILY'

  // If it's a family membership, get the family data using the new query
  // This query finds the family by the origin member ID
  const { data: familyData, loading: familyLoading } = useGetFamilyByOriginMemberQuery({
    variables: { memberId: member?.miembro_id || '' },
    skip: !member || !isFamily,
  })

  return {
    member,
    family: familyData?.getFamilyByOriginMember,
    isFamily,
    loading: memberLoading || familyLoading,
    error: memberError,
  }
}
