// Formatear monto con signo y color
export const formatAmount = (amount: number): string => {
  const formatted = new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount))
  return amount >= 0 ? `+${formatted} €` : `-${formatted} €`
}

// Formatear monto sin signo
export const formatCurrency = (amount: number): string => {
  const formatted = new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount))
  return `${formatted} €`
}

// Determinar color según monto
export const getAmountColor = (amount: number): string => {
  return amount >= 0 ? '#4caf50' : '#f44336'
}

// Formatear fecha para mostrar
export const formatTransactionDate = (date: string): string => {
  return new Date(date).toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Formatear fecha para input
export const formatDateForInput = (date: Date): string => {
  return date.toISOString().split('T')[0]
}

// Parsear fecha de input a ISO
export const parseDateFromInput = (dateString: string): string => {
  return new Date(dateString).toISOString()
}
