import { useState } from 'react'
import { useGetDelinquentReportQuery } from '@/graphql/generated/operations'
import type { DelinquentReportInput, SortBy } from '../types'

/**
 * Hook principal para obtener el informe de morosos
 */
export function useDelinquentReport() {
  const [filters, setFilters] = useState<DelinquentReportInput>({
    sortBy: 'DAYS_DESC' as SortBy, // Más antiguos primero por defecto
    minAmount: 0,
    debtorType: null,
  })

  const { data, loading, error, refetch } = useGetDelinquentReportQuery({
    variables: { input: filters },
    fetchPolicy: 'network-only', // Siempre traer datos frescos
    notifyOnNetworkStatusChange: true,
  })

  const updateFilters = (newFilters: Partial<DelinquentReportInput>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  const resetFilters = () => {
    setFilters({
      sortBy: 'DAYS_DESC' as SortBy,
      minAmount: 0,
      debtorType: null,
    })
  }

  return {
    data: data?.getDelinquentReport,
    loading,
    error,
    filters,
    updateFilters,
    resetFilters,
    refetch,
  }
}
