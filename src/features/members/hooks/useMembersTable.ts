import { useState, useCallback } from 'react';
import { useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

import { LIST_MEMBERS_QUERY } from '../api/queries';
import { Member, MemberFilter, SortDirection } from '../types';
import { ListMembersQueryResponse, MemberFilterInput } from '../api/types';

interface UseMembersTableResult {
  members: Member[];
  totalCount: number;
  loading: boolean;
  error: any;
  page: number;
  pageSize: number;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (pageSize: number) => void;
  handleSortChange: (field: string, direction: 'ASC' | 'DESC' | null) => void;
  handleRowClick: (member: Member) => void;
  handleFilterChange: (filter: Partial<MemberFilter>) => void;
  refetch: () => void;
}

export function useMembersTable(): UseMembersTableResult {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filter, setFilter] = useState<MemberFilter>({
    pagination: { page: 1, pageSize: 10 },
  });

  // Convert internal filter to GraphQL input format
  const graphqlFilter: MemberFilterInput = {
    estado: filter.estado,
    tipo_membresia: filter.tipo_membresia,
    search_term: filter.search_term,
    pagination: filter.pagination,
    sort: filter.sort,
  };

  const { data, loading, error, refetch } = useQuery<ListMembersQueryResponse>(
    LIST_MEMBERS_QUERY,
    {
      variables: { filter: graphqlFilter },
      notifyOnNetworkStatusChange: true,
    }
  );

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    setFilter((prev) => ({
      ...prev,
      pagination: { ...prev.pagination!, page: newPage },
    }));
  }, []);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
    setFilter((prev) => ({
      ...prev,
      pagination: { page: 1, pageSize: newPageSize },
    }));
  }, []);

  const handleSortChange = useCallback(
    (field: string, direction: 'ASC' | 'DESC' | null) => {
      if (!direction) {
        setFilter((prev) => {
          const { sort, ...rest } = prev;
          return rest;
        });
      } else {
        setFilter((prev) => ({
          ...prev,
          sort: { field, direction: direction as SortDirection },
        }));
      }
    },
    []
  );

  const handleRowClick = useCallback(
    (member: Member) => {
      navigate(`/members/${member.miembro_id}`);
    },
    [navigate]
  );

  const handleFilterChange = useCallback((newFilter: Partial<MemberFilter>) => {
    setPage(1);
    setFilter((prev) => ({
      ...prev,
      ...newFilter,
      pagination: { ...prev.pagination!, page: 1 },
    }));
  }, []);

  return {
    members: (data?.listMembers.nodes || []) as Member[],
    totalCount: data?.listMembers.pageInfo.totalCount || 0,
    loading,
    error,
    page,
    pageSize,
    handlePageChange,
    handlePageSizeChange,
    handleSortChange,
    handleRowClick,
    handleFilterChange,
    refetch,
  };
}
