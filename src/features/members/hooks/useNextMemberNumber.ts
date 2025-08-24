import { useQuery } from '@apollo/client';
import { GetNextMemberNumberDocument } from '@/graphql/generated/operations';

interface UseNextMemberNumberOptions {
  isFamily: boolean;
  skip?: boolean;
}

interface UseNextMemberNumberResult {
  memberNumber: string | null;
  loading: boolean;
  error: Error | undefined;
  refetch: () => void;
}

/**
 * Hook to get the next available member number based on membership type
 * @param options - Configuration options for the hook
 * @returns Object containing the member number, loading state, error, and refetch function
 */
export function useNextMemberNumber({ 
  isFamily, 
  skip = false 
}: UseNextMemberNumberOptions): UseNextMemberNumberResult {
  const { data, loading, error, refetch } = useQuery(GetNextMemberNumberDocument, {
    variables: { isFamily },
    skip,
    // Don't cache this query as we always want fresh data
    fetchPolicy: 'no-cache',
    // Disable automatic error reporting to console
    errorPolicy: 'ignore',
  });

  // If query fails, generate a fallback value
  const getFallbackNumber = (): string => {
    const prefix = isFamily ? 'A' : 'B';
    // In production, this should be more sophisticated
    // For now, we'll use a timestamp-based approach as fallback
    // TODO: The backend getNextMemberNumber query should return the next available number
    // by checking existing numbers in the database
    const timestamp = new Date().getTime();
    const suffix = String(timestamp).slice(-5).padStart(5, '0');
    return `${prefix}${suffix}`;
  };

  const memberNumber = data?.getNextMemberNumber || (error ? getFallbackNumber() : null);

  return {
    memberNumber,
    loading,
    error: error || undefined,
    refetch: () => {
      refetch();
    },
  };
}
