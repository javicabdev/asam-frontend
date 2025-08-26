import { Member } from '@/graphql/generated/operations'

export interface CsvExportOptions {
  filename?: string
  includeHeaders?: boolean
  delimiter?: string
  dateFormat?: 'ISO' | 'ES'
}

const defaultOptions: CsvExportOptions = {
  filename: 'socios_export',
  includeHeaders: true,
  delimiter: ',',
  dateFormat: 'ES',
}

/**
 * Formats a date for CSV export
 */
const formatDate = (date: string | null | undefined, format: 'ISO' | 'ES' = 'ES'): string => {
  if (!date) return ''

  const dateObj = new Date(date)
  if (isNaN(dateObj.getTime())) return ''

  if (format === 'ISO') {
    return dateObj.toISOString().split('T')[0]
  }

  // Spanish format dd/mm/yyyy
  const day = dateObj.getDate().toString().padStart(2, '0')
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0')
  const year = dateObj.getFullYear()

  return `${day}/${month}/${year}`
}

/**
 * Escapes a string value for CSV
 */
const escapeCSVValue = (value: any): string => {
  if (value === null || value === undefined) return ''

  const stringValue = String(value)

  // If contains delimiter, quotes or newlines, wrap in quotes
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }

  return stringValue
}

/**
 * Export members data to CSV
 */
export const exportMembersToCSV = (
  members: Partial<Member>[],
  options: CsvExportOptions = {}
): void => {
  const opts = { ...defaultOptions, ...options }

  // Define CSV headers
  const headers = [
    'Nº Socio',
    'Nombre',
    'Apellido 1',
    'Apellido 2',
    'Documento',
    'Email',
    'Teléfono',
    'Población',
    'Provincia',
    'Código Postal',
    'Tipo',
    'Estado',
    'Fecha Alta',
    'Fecha Baja',
  ]

  // Build CSV content
  const rows: string[] = []

  // Add headers if requested
  if (opts.includeHeaders) {
    rows.push(headers.map(escapeCSVValue).join(opts.delimiter))
  }

  // Add data rows
  members.forEach((member) => {
    const row = [
      member.numero_socio || '',
      member.nombre || '',
      member.apellidos || '',
      '', // apellido2 no existe en el modelo
      member.documento_identidad || '',
      member.correo_electronico || '',
      '', // telefono no existe en el modelo
      member.poblacion || '',
      member.provincia || '',
      member.codigo_postal || '',
      member.tipo_membresia === 'INDIVIDUAL' ? 'Individual' : 'Familiar',
      member.estado === 'ACTIVE' ? 'Activo' : 'Inactivo',
      formatDate(member.fecha_alta, opts.dateFormat),
      formatDate(member.fecha_baja, opts.dateFormat),
    ]

    rows.push(row.map(escapeCSVValue).join(opts.delimiter))
  })

  // Create CSV content
  const csvContent = rows.join('\n')

  // Create blob with UTF-8 BOM for Excel compatibility
  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })

  // Create download link
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', `${opts.filename}_${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  // Clean up
  setTimeout(() => URL.revokeObjectURL(url), 100)
}

/**
 * Export members to Excel-compatible CSV with additional formatting
 */
export const exportMembersToExcel = (
  members: Partial<Member>[],
  options: Omit<CsvExportOptions, 'delimiter'> = {}
): void => {
  // Excel prefers semicolon as delimiter in some locales
  exportMembersToCSV(members, {
    ...options,
    delimiter: ';',
    filename: options.filename || 'socios_excel',
  })
}
