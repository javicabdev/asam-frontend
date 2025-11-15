import { useState, useMemo } from 'react'
import { useGetDelinquentReportQuery } from '@/graphql/generated/operations'
import type { DelinquentReportInput, SortBy, DelinquentSummary } from '../types'

/**
 * Recalcula el summary basándose en los deudores filtrados
 * Esto asegura que las estadísticas coincidan con lo que se muestra en la tabla
 */
function calculateSummaryFromDebtors(debtors: any[]): DelinquentSummary {
  const totalDebtors = debtors.length
  const individualDebtors = debtors.filter(d => d.type === 'INDIVIDUAL').length
  const familyDebtors = debtors.filter(d => d.type === 'FAMILY').length

  const totalDebtAmount = debtors.reduce((sum, d) => sum + d.totalDebt, 0)

  const averageDaysOverdue = totalDebtors > 0
    ? Math.round(debtors.reduce((sum, d) => sum + d.oldestDebtDays, 0) / totalDebtors)
    : 0

  const averageDebtPerDebtor = totalDebtors > 0
    ? totalDebtAmount / totalDebtors
    : 0

  return {
    totalDebtors,
    individualDebtors,
    familyDebtors,
    totalDebtAmount,
    averageDaysOverdue,
    averageDebtPerDebtor,
  }
}

/**
 * Hook principal para obtener el informe de morosos
 */
export function useDelinquentReport() {
  const [filters, setFilters] = useState<DelinquentReportInput>({
    sortBy: 'DAYS_DESC' as SortBy, // Más antiguos primero por defecto
    minAmount: 0,
    debtorType: null,
    // IMPORTANTE: Solicitar TODOS los deudores para el informe
    // El informe no está diseñado para paginación en el frontend
    pagination: {
      page: 1,
      pageSize: 1000, // Suficiente para todos los morosos
    },
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
      pagination: {
        page: 1,
        pageSize: 1000,
      },
    })
  }

  // Recalcular el summary basándose en los deudores filtrados actuales
  // y aplicar ordenamiento estable para evitar cambios aleatorios
  const recalculatedData = useMemo(() => {
    if (!data?.getDelinquentReport) return null

    // Ordenar deudores de forma estable
    // Primario: oldestDebtDays (ya viene del backend)
    // Secundario: ID del deudor (para consistencia)
    const sortedDebtors = [...(data.getDelinquentReport.debtors || [])].sort((a, b) => {
      // Ordenamiento primario por días de mora (descendente)
      const daysDiff = b.oldestDebtDays - a.oldestDebtDays
      if (daysDiff !== 0) return daysDiff

      // Ordenamiento secundario por ID para consistencia (ascendente)
      const idA = a.memberId || a.familyId || ''
      const idB = b.memberId || b.familyId || ''
      return idA.localeCompare(idB)
    })

    const recalculatedSummary = calculateSummaryFromDebtors(sortedDebtors)

    return {
      ...data.getDelinquentReport,
      debtors: sortedDebtors,
      summary: recalculatedSummary,
    }
  }, [data])

  return {
    data: recalculatedData,
    loading,
    error,
    filters,
    updateFilters,
    resetFilters,
    refetch,
  }
}
