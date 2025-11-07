import type { Debtor } from '../types'

/**
 * Genera un ID único y determinístico para cada deudor
 * Esto evita que el DataGrid genere IDs aleatorios que causan duplicados
 */
export function getDebtorId(debtor: Debtor, index?: number): string {
  // Para socios individuales: usar memberId
  if (debtor.type === 'INDIVIDUAL' && debtor.memberId) {
    return `individual-${debtor.memberId}`
  }

  // Para familias: usar familyId
  if (debtor.type === 'FAMILY' && debtor.familyId) {
    return `family-${debtor.familyId}`
  }

  // Fallback: usar index si está disponible
  if (index !== undefined) {
    console.warn('⚠️ Debtor sin ID válido, usando index como fallback:', {
      type: debtor.type,
      memberId: debtor.memberId,
      familyId: debtor.familyId,
      index,
    })
    return `unknown-${index}`
  }

  // Último recurso: generar basado en datos del deudor
  const name = debtor.member
    ? `${debtor.member.firstName}-${debtor.member.lastName}`
    : debtor.family
      ? debtor.family.familyName
      : 'unknown'

  return `fallback-${debtor.type}-${name}-${debtor.totalDebt}`
}
