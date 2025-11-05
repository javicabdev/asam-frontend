import { CashFlowTransaction } from '../types'
import { formatTransactionDate, formatCurrency } from './formatters'
import { getOperationTypeConfig } from './operationTypes'

export const exportToCSV = (
  transactions: CashFlowTransaction[],
  filename: string = 'flujo_caja'
) => {
  // Cabeceras CSV
  const headers = ['Fecha', 'Tipo', 'Categoría', 'Concepto', 'Socio', 'Importe', 'Saldo']

  // Convertir transacciones a filas
  const rows = transactions.map((transaction) => {
    const config = getOperationTypeConfig(transaction.operationType)
    const memberName = transaction.member
      ? `${transaction.member.firstName} ${transaction.member.lastName}`
      : '-'

    return [
      formatTransactionDate(transaction.date),
      transaction.amount >= 0 ? 'INGRESO' : 'GASTO',
      config.label,
      transaction.detail,
      memberName,
      formatCurrency(transaction.amount),
      formatCurrency(transaction.runningBalance),
    ]
  })

  // Construir CSV
  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n')

  // Crear blob y descargar
  const blob = new Blob(['\ufeff' + csvContent], {
    type: 'text/csv;charset=utf-8;',
  })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
