import { useState, useCallback, useMemo } from 'react'
import { useQuery, ApolloQueryResult, ApolloError } from '@apollo/client'
import { useNavigate } from 'react-router-dom'

import { LIST_MEMBERS_QUERY } from '../api/queries'
import { Member, MemberFilter, SortDirection } from '../types'
import { ListMembersQueryResponse, MemberFilterInput } from '../api/types'

interface UseMembersTableResult {
  members: Member[]
  totalCount: number
  loading: boolean
  error: ApolloError | undefined
  page: number
  pageSize: number
  filter: MemberFilter
  handlePageChange: (page: number) => void
  handlePageSizeChange: (pageSize: number) => void
  handleSortChange: (field: string, direction: 'ASC' | 'DESC' | null) => void
  handleRowClick: (member: Member) => void
  handleFilterChange: (filter: Partial<MemberFilter>) => void
  handleSelectionChange: (selectedIds: string[]) => void
  selectedMembers: string[]
  refetch: () => Promise<ApolloQueryResult<ListMembersQueryResponse>>
}

export function useMembersTable(): UseMembersTableResult {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [filter, setFilter] = useState<MemberFilter>({
    pagination: { page: 1, pageSize: 25 },
  })

  // Convert internal filter to GraphQL input format
  // Only include fields that are actually in the GraphQL schema
  const graphqlFilter: MemberFilterInput = useMemo(() => ({
    pagination: filter.pagination,
    ...(filter.estado && { estado: filter.estado }),
    ...(filter.tipo_membresia && { tipo_membresia: filter.tipo_membresia }),
    ...(filter.search_term && { search_term: filter.search_term }),
    ...(filter.sort && { sort: filter.sort }),
  }), [filter])

  const { data, loading, error, refetch } = useQuery<ListMembersQueryResponse>(LIST_MEMBERS_QUERY, {
    variables: { filter: graphqlFilter },
    fetchPolicy: 'network-only', // Always fetch fresh data
  })

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage)
    setFilter((prev) => ({
      ...prev,
      pagination: { page: newPage, pageSize: prev.pagination?.pageSize || 25 },
    }))
  }, [])

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize)
    setPage(1)
    setFilter((prev) => ({
      ...prev,
      pagination: { page: 1, pageSize: newPageSize },
    }))
  }, [])

  const handleSortChange = useCallback((field: string, direction: 'ASC' | 'DESC' | null) => {
    if (!direction) {
      setFilter((prev) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { sort, ...rest } = prev
        return rest
      })
    } else {
      setFilter((prev) => ({
        ...prev,
        sort: { field, direction: direction as SortDirection },
      }))
    }
  }, [])

  const handleRowClick = useCallback(
    (member: Member) => {
      navigate(`/members/${member.miembro_id}`)
    },
    [navigate]
  )

  const handleFilterChange = useCallback(
    (newFilter: Partial<MemberFilter>) => {
      setPage(1)
      setSelectedMembers([]) // Clear selection on filter change

      // Always reset filter with only the provided values
      setFilter((prev) => {
        const baseFilter: MemberFilter = {
          pagination: { page: 1, pageSize },
        }

        // Only add fields that are explicitly provided
        if (newFilter.estado !== undefined) {
          baseFilter.estado = newFilter.estado
        }
        if (newFilter.tipo_membresia !== undefined) {
          baseFilter.tipo_membresia = newFilter.tipo_membresia
        }
        if (newFilter.search_term !== undefined) {
          baseFilter.search_term = newFilter.search_term
        }

        // Preserve sort if it exists
        if (prev.sort) {
          baseFilter.sort = prev.sort
        }

        return baseFilter
      })
    },
    [pageSize]
  )

  const handleSelectionChange = useCallback((selectedIds: string[]) => {
    setSelectedMembers(selectedIds)
  }, [])

  return {
    members: (data?.listMembers.nodes || []) as Member[],
    totalCount: data?.listMembers.pageInfo.totalCount || 0,
    loading,
    error,
    page,
    pageSize,
    filter,
    handlePageChange,
    handlePageSizeChange,
    handleSortChange,
    handleRowClick,
    handleFilterChange,
    handleSelectionChange,
    selectedMembers,
    refetch: refetch || (() => Promise.resolve({} as ApolloQueryResult<ListMembersQueryResponse>)),
  }
}
