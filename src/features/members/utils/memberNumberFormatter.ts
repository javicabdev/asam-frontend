/**
 * Formats a member number input to the standard format (A##### or B#####)
 * @param input - The user input (can be a number, partial member number, or full member number)
 * @param isFamily - Whether this is for a family membership
 * @returns The formatted member number
 */
export function formatMemberNumber(input: string, isFamily: boolean): string {
  if (!input) return ''

  // Remove any whitespace
  const trimmed = input.trim()

  // If input is empty after trimming, return empty
  if (!trimmed) return ''

  // Check if input already has a valid format
  const validFormatRegex = /^[AB]\d{5}$/
  if (validFormatRegex.test(trimmed)) {
    return trimmed
  }

  // Extract the numeric part
  let numericPart = ''
  let hasPrefix = false

  // Check if it starts with A or B
  if (trimmed.toUpperCase().startsWith('A') || trimmed.toUpperCase().startsWith('B')) {
    hasPrefix = true
    numericPart = trimmed.substring(1)
  } else {
    numericPart = trimmed
  }

  // Remove any non-numeric characters from the numeric part
  numericPart = numericPart.replace(/\D/g, '')

  // If no numeric part, return the input as is (let validation handle it)
  if (!numericPart) {
    return trimmed
  }

  // Convert to number and back to remove leading zeros
  const num = parseInt(numericPart, 10)

  // If number is too large, return as is (let validation handle it)
  if (num > 99999) {
    return trimmed
  }

  // Determine the prefix
  let prefix: string
  if (hasPrefix) {
    // Keep the original prefix if it was provided
    prefix = trimmed.charAt(0).toUpperCase()
  } else {
    // Use the prefix based on membership type
    prefix = isFamily ? 'A' : 'B'
  }

  // Format with leading zeros
  const formattedNumber = num.toString().padStart(5, '0')

  return `${prefix}${formattedNumber}`
}

/**
 * Extracts the numeric part from a member number
 * @param memberNumber - The member number (e.g., "B00002")
 * @returns The numeric part as a number (e.g., 2)
 */
export function extractNumericPart(memberNumber: string): number | null {
  const match = memberNumber.match(/^[AB](\d{5})$/)
  if (match) {
    return parseInt(match[1], 10)
  }
  return null
}

/**
 * Validates if a member number has the correct format
 * @param memberNumber - The member number to validate
 * @returns True if valid format, false otherwise
 */
export function isValidMemberNumberFormat(memberNumber: string): boolean {
  return /^[AB]\d{5}$/.test(memberNumber)
}
