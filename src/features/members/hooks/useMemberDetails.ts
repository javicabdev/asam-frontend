import { useQuery, ApolloError, ApolloQueryResult } from '@apollo/client'
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { GET_MEMBER_QUERY } from '../api/queries'
import { GetMemberQuery, GetMemberQueryVariables } from '@/graphql/generated/operations'
import { Member } from '../types'

interface UseMemberDetailsResult {
  member: Member | null
  loading: boolean
  error: ApolloError | undefined
  refetch: () => Promise<ApolloQueryResult<GetMemberQuery>>
  memberId: string | undefined
}

export function useMemberDetails(): UseMemberDetailsResult {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data, loading, error, refetch } = useQuery<GetMemberQuery, GetMemberQueryVariables>(
    GET_MEMBER_QUERY,
    {
      variables: { id: id || '' },
      skip: !id,
      fetchPolicy: 'cache-and-network',
    }
  )

  // Handle NOT_FOUND errors
  useEffect(() => {
    if (error?.graphQLErrors.some((e) => e.extensions?.code === 'NOT_FOUND')) {
      navigate('/members', { replace: true })
    }
  }, [error, navigate])

  return {
    member: (data?.getMember as Member) || null,
    loading,
    error,
    refetch,
    memberId: id,
  }
}
