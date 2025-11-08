import { useState, useCallback } from 'react'
import type { PaymentFiltersState } from '../types'

/**
 * Custom hook to manage payment filters state
 * Provides centralized filter state management with reset functionality
 */
export function usePaymentFilters() {
  const [filters, setFilters] = useState<PaymentFiltersState>({
    status: 'ALL',
    paymentMethod: 'ALL',
    startDate: null,
    endDate: null,
    searchTerm: '',
    page: 1,
    pageSize: 25,
  })

  /**
   * Update one or more filter values
   * Automatically resets to page 1 when filters change (except pagination changes)
   */
  const updateFilters = useCallback((updates: Partial<PaymentFiltersState>) => {
    setFilters((prev) => ({
      ...prev,
      ...updates,
      // Reset to first page when filters change (except pagination changes)
      page: updates.page !== undefined ? updates.page : 1,
    }))
  }, [])

  /**
   * Update a single filter field
   */
  const updateFilter = useCallback(
    <K extends keyof PaymentFiltersState>(key: K, value: PaymentFiltersState[K]) => {
      updateFilters({ [key]: value })
    },
    [updateFilters]
  )

  /**
   * Reset all filters to initial state
   * Preserves page size preference
   */
  const resetFilters = useCallback(() => {
    setFilters({
      status: 'ALL',
      paymentMethod: 'ALL',
      startDate: null,
      endDate: null,
      searchTerm: '',
      page: 1,
      pageSize: filters.pageSize, // Preserve page size
    })
  }, [filters.pageSize])

  /**
   * Update page number
   */
  const setPage = useCallback((page: number) => {
    updateFilters({ page })
  }, [updateFilters])

  /**
   * Update page size and reset to first page
   */
  const setPageSize = useCallback((pageSize: number) => {
    updateFilters({ pageSize, page: 1 })
  }, [updateFilters])

  /**
   * Update sort field and direction
   */
  const setSort = useCallback((field: string, direction: 'ASC' | 'DESC' | null) => {
    if (!direction) {
      // Remove sorting
      setFilters((prev) => {
        const { sortField, sortDirection, ...rest } = prev
        return rest
      })
    } else {
      updateFilters({ sortField: field, sortDirection: direction })
    }
  }, [updateFilters])

  return {
    filters,
    updateFilters,
    updateFilter,
    resetFilters,
    setPage,
    setPageSize,
    setSort,
  }
}
