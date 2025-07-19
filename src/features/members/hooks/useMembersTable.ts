import { useState, useCallback, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';

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
  filter: MemberFilter;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (pageSize: number) => void;
  handleSortChange: (field: string, direction: 'ASC' | 'DESC' | null) => void;
  handleRowClick: (member: Member) => void;
  handleFilterChange: (filter: Partial<MemberFilter>) => void;
  handleSelectionChange: (selectedIds: string[]) => void;
  selectedMembers: string[];
  refetch: () => void;
}

export function useMembersTable(): UseMembersTableResult {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [filter, setFilter] = useState<MemberFilter>({
    pagination: { page: 1, pageSize: 25 },
  });

  // Convert internal filter to GraphQL input format
  const graphqlFilter: MemberFilterInput = {
    estado: filter.estado,
    tipo_membresia: filter.tipo_membresia,
    search_term: filter.search_term,
    poblacion: filter.poblacion,
    provincia: filter.provincia,
    fecha_alta_desde: filter.fecha_alta_desde,
    fecha_alta_hasta: filter.fecha_alta_hasta,
    fecha_baja_desde: filter.fecha_baja_desde,
    fecha_baja_hasta: filter.fecha_baja_hasta,
    correo_electronico: filter.correo_electronico,
    documento_identidad: filter.documento_identidad,
    pagination: filter.pagination,
    sort: filter.sort,
  };

  const { data, loading, error, refetch, fetchMore } = useQuery<ListMembersQueryResponse>(
    LIST_MEMBERS_QUERY,
    {
      variables: { filter: graphqlFilter },
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'cache-and-network',
    }
  );

  // Debounced refetch for search term changes
  const debouncedRefetch = useCallback(
    debounce(() => {
      refetch();
    }, 300),
    [refetch]
  );

  // Effect to trigger refetch when filter changes
  useEffect(() => {
    if (filter.search_term !== undefined) {
      debouncedRefetch();
    }
  }, [filter.search_term, debouncedRefetch]);

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
    setSelectedMembers([]); // Clear selection on filter change
  }, []);

  const handleSelectionChange = useCallback((selectedIds: string[]) => {
    setSelectedMembers(selectedIds);
  }, []);

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
    refetch,
  };
}
