import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { Debtor, DelinquentReportResponse } from '../types'
import { formatCurrency, formatDate } from './delinquentFormatters'

/**
 * Obtiene el nombre del deudor
 */
function getDebtorName(debtor: Debtor): string {
  if (debtor.type === 'INDIVIDUAL' && debtor.member) {
    return `${debtor.member.firstName} ${debtor.member.lastName}`
  } else if (debtor.type === 'FAMILY' && debtor.family) {
    return debtor.family.familyName
  }
  return '-'
}

/**
 * Obtiene el número de socio del deudor
 */
function getDebtorMemberNumber(debtor: Debtor): string {
  if (debtor.type === 'INDIVIDUAL' && debtor.member) {
    return debtor.member.memberNumber
  } else if (debtor.type === 'FAMILY' && debtor.family) {
    return debtor.family.primaryMember.memberNumber
  }
  return '-'
}

/**
 * Obtiene la información de contacto del deudor
 */
function getDebtorContact(debtor: Debtor): string {
  if (debtor.type === 'INDIVIDUAL' && debtor.member) {
    return debtor.member.email || debtor.member.phone || '-'
  } else if (debtor.type === 'FAMILY' && debtor.family) {
    return (
      debtor.family.primaryMember.email ||
      debtor.family.primaryMember.phone ||
      '-'
    )
  }
  return '-'
}

/**
 * Exporta el informe a PDF
 */
export function exportToPDF(
  data: DelinquentReportResponse,
  t: (key: string, options?: { count?: number }) => string
) {
  const doc = new jsPDF()

  // Título
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text(t('delinquent.title'), 14, 20)

  // Fecha de generación
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(
    `${t('delinquent.generatedAt')}: ${formatDate(data.generatedAt)}`,
    14,
    28
  )

  // Resumen
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text(t('delinquent.summary.title'), 14, 38)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(
    `${t('delinquent.summary.totalDebtors')}: ${data.summary.totalDebtors}`,
    14,
    45
  )
  doc.text(
    `${t('delinquent.summary.totalDebt')}: ${formatCurrency(data.summary.totalDebtAmount)}`,
    14,
    52
  )
  doc.text(
    `${t('delinquent.summary.avgDaysOverdue')}: ${data.summary.averageDaysOverdue} ${t('delinquent.table.daysOverdue', { count: data.summary.averageDaysOverdue })}`,
    14,
    59
  )

  // Tabla de deudores
  const tableData = data.debtors.map((debtor) => [
    getDebtorName(debtor),
    t(`delinquent.debtorType.${debtor.type.toLowerCase()}`),
    formatCurrency(debtor.totalDebt),
    `${debtor.oldestDebtDays} ${t('delinquent.table.daysOverdue', { count: debtor.oldestDebtDays })}`,
    getDebtorContact(debtor),
  ])

  autoTable(doc, {
    startY: 70,
    head: [
      [
        t('delinquent.table.debtor'),
        t('delinquent.table.type'),
        t('delinquent.table.totalDebt'),
        t('delinquent.table.oldestDebt'),
        t('delinquent.table.contact'),
      ],
    ],
    body: tableData,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [244, 67, 54] },
  })

  // Guardar
  const dateStr = new Date().toISOString().split('T')[0]
  const filename = t('delinquent.export.pdfFilename').replace('{{date}}', dateStr)

  doc.save(filename)
}

/**
 * Exporta el informe a CSV
 */
export function exportToCSV(
  data: DelinquentReportResponse,
  t: (key: string, options?: { count?: number }) => string
) {
  const headers = [
    t('delinquent.table.debtor'),
    t('delinquent.table.type'),
    t('delinquent.table.memberNumber'),
    t('delinquent.table.contact'),
    t('delinquent.table.totalDebt'),
    t('delinquent.table.oldestDebt'),
    t('delinquent.table.lastPayment'),
  ]

  const rows = data.debtors.map((debtor) => [
    getDebtorName(debtor),
    t(`delinquent.debtorType.${debtor.type.toLowerCase()}`),
    getDebtorMemberNumber(debtor),
    getDebtorContact(debtor),
    formatCurrency(debtor.totalDebt),
    `${debtor.oldestDebtDays}`,
    debtor.lastPaymentDate ? formatDate(debtor.lastPaymentDate) : '-',
  ])

  const csvContent = [headers, ...rows]
    .map((row) =>
      row
        .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
        .join(',')
    )
    .join('\n')

  const blob = new Blob(['\ufeff' + csvContent], {
    type: 'text/csv;charset=utf-8;',
  })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  const dateStr = new Date().toISOString().split('T')[0]
  const filename = t('delinquent.export.csvFilename').replace('{{date}}', dateStr)

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
