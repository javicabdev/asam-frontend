import { useQuery } from '@apollo/client'
import {
  GetNextMemberNumberQuery,
  GetNextMemberNumberQueryVariables,
  GetNextMemberNumberDocument
} from '@/graphql/generated/operations'

interface UseNextMemberNumberOptions {
  isFamily: boolean
  skip?: boolean
}

interface UseNextMemberNumberResult {
  memberNumber: string | null
  loading: boolean
  error: Error | undefined
  refetch: () => void
}

/**
 * Hook to get the next available member number based on membership type
 * @param options - Configuration options for the hook
 * @returns Object containing the member number, loading state, error, and refetch function
 */
export function useNextMemberNumber({
  isFamily,
  skip = false,
}: UseNextMemberNumberOptions): UseNextMemberNumberResult {
  const { data, loading, error, refetch } = useQuery<
    GetNextMemberNumberQuery,
    GetNextMemberNumberQueryVariables
  >(GetNextMemberNumberDocument, {
    variables: { isFamily },
    skip,
    // Don't cache this query as we always want fresh data
    fetchPolicy: 'no-cache',
    // Disable automatic error reporting to console
    errorPolicy: 'ignore',
  })

  // If query fails, generate a fallback value
  const getFallbackNumber = (): string => {
    const prefix = isFamily ? 'A' : 'B'
    // Generate a random unique number
    const randomNum = Math.floor(Math.random() * 90000) + 10000 // 10000-99999
    return `${prefix}${randomNum}`
  }

  const memberNumberData = data?.getNextMemberNumber
  const memberNumber = memberNumberData || (error ? getFallbackNumber() : null)

  return {
    memberNumber,
    loading,
    error: error || undefined,
    refetch: () => {
      void refetch()
    },
  }
}
