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

  // Debug temporal: verificar estructura de datos para familias
  if (data?.getDelinquentReport?.debtors) {
    const familyDebtors = data.getDelinquentReport.debtors.filter(d => d.type === 'FAMILY')
    if (familyDebtors.length > 0) {
      console.log('🔍 Debug - Datos de familias:', {
        count: familyDebtors.length,
        sample: familyDebtors.slice(0, 2).map(d => ({
          type: d.type,
          familyId: d.familyId,
          memberId: d.memberId,
          hasFamily: !!d.family,
          hasMember: !!d.member,
          familyData: d.family ? {
            id: d.family.id,
            familyName: d.family.familyName,
            primaryMember: d.family.primaryMember ? {
              memberNumber: d.family.primaryMember.memberNumber,
              firstName: d.family.primaryMember.firstName,
              lastName: d.family.primaryMember.lastName,
            } : null
          } : null,
          memberData: d.member ? {
            memberNumber: d.member.memberNumber,
            firstName: d.member.firstName,
            lastName: d.member.lastName,
          } : null,
        }))
      })
    }
  }

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
