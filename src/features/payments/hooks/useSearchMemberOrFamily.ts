import { useState, useEffect } from 'react'
import { useSearchMembersQuery, useListFamiliesQuery } from '@/graphql/generated/operations'
import type { 
  SearchMembersQuery,
  ListFamiliesQuery 
} from '@/graphql/generated/operations'

// Extract exact types from query responses
type MemberSearchResult = NonNullable<SearchMembersQuery['searchMembers']>[number]
type FamilySearchResult = NonNullable<ListFamiliesQuery['listFamilies']>['nodes'][number]

export interface SearchResult {
  id: string
  type: 'INDIVIDUAL' | 'FAMILY'
  displayName: string
  memberNumber: string
  subtitle?: string
  rawData: MemberSearchResult | FamilySearchResult
}

interface UseSearchMemberOrFamilyResult {
  results: SearchResult[]
  loading: boolean
  error: string | null
}

/**
 * Custom hook to search both members and families with a unified interface
 * 
 * Searches for:
 * - Individual members by name, surname, or member number
 * - Families by spouse names or member number
 * 
 * Results are debounced (300ms) to avoid excessive API calls
 * 
 * @param searchTerm - The search term to filter members and families
 * @returns Object with unified search results, loading and error states
 * 
 * @example
 * ```tsx
 * const { results, loading, error } = useSearchMemberOrFamily('García')
 * 
 * results.forEach(result => {
 *   console.log(result.displayName) // "Juan García (#12345)" or "Familia García (#F001)"
 *   console.log(result.type)        // "INDIVIDUAL" or "FAMILY"
 * })
 * ```
 */
export function useSearchMemberOrFamily(searchTerm: string): UseSearchMemberOrFamilyResult {
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [error, setError] = useState<string | null>(null)

  // Debounce search term (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim())
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Search members
  const {
    data: membersData,
    loading: membersLoading,
    error: membersError,
  } = useSearchMembersQuery({
    variables: { criteria: debouncedSearch },
    skip: !debouncedSearch || debouncedSearch.length < 2,
  })

  // Search families
  const {
    data: familiesData,
    loading: familiesLoading,
    error: familiesError,
  } = useListFamiliesQuery({
    variables: {
      filter: {
        search_term: debouncedSearch,
        pagination: { page: 1, pageSize: 20 },
      },
    },
    skip: !debouncedSearch || debouncedSearch.length < 2,
  })

  // Combine and format results
  useEffect(() => {
    if (!debouncedSearch || debouncedSearch.length < 2) {
      setResults([])
      setError(null)
      return
    }

    const memberResults: SearchResult[] =
      membersData?.searchMembers?.map((member) => ({
        id: member.miembro_id,
        type: 'INDIVIDUAL' as const,
        displayName: `${member.nombre} ${member.apellidos}`,
        memberNumber: member.numero_socio,
        subtitle: `Socio Individual #${member.numero_socio}`,
        rawData: member,
      })) || []

    const familyResults: SearchResult[] =
      familiesData?.listFamilies?.nodes?.map((family) => ({
        id: family.id,
        type: 'FAMILY' as const,
        displayName: `Familia ${family.esposo_apellidos}`,
        memberNumber: family.numero_socio,
        subtitle: `${family.esposo_nombre} y ${family.esposa_nombre} (#${family.numero_socio})`,
        rawData: family,
      })) || []

    // Combine results: members first, then families
    const combined = [...memberResults, ...familyResults]
    setResults(combined)

    // Handle errors
    if (membersError || familiesError) {
      setError('Error al buscar socios o familias')
    } else {
      setError(null)
    }
  }, [membersData, familiesData, membersError, familiesError, debouncedSearch])

  const loading = membersLoading || familiesLoading

  return {
    results,
    loading,
    error,
  }
}
