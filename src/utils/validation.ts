/**
 * Validation utilities
 *
 * These validators match the backend validation rules to ensure consistency
 * between frontend and backend validation.
 */

/**
 * Email validation regex
 * Matches the backend regex in pkg/validation/validation.go
 *
 * Pattern: ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$
 *
 * Requirements:
 * - Local part: alphanumeric, dots, underscores, percent, plus, hyphens
 * - @ symbol
 * - Domain: alphanumeric, dots, hyphens
 * - Dot followed by TLD of at least 2 characters
 *
 * Examples:
 * - ✅ ejemplo@gmail.com
 * - ✅ usuario.nombre@my-domain.com
 * - ✅ test+tag@example.co.uk
 * - ❌ ejemplo@gmail-com (missing dot before TLD)
 * - ❌ ejemplo@domain (missing TLD)
 * - ❌ @domain.com (missing local part)
 */
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

/**
 * Validates an email address
 * @param email - The email address to validate
 * @returns true if valid, false otherwise
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false
  }
  return EMAIL_REGEX.test(email)
}

/**
 * Returns an error message if the email is invalid
 * @param email - The email address to validate
 * @returns error message if invalid, undefined if valid
 */
export function validateEmail(email: string): string | undefined {
  if (!email) {
    return undefined // Let required validation handle empty values
  }

  if (!isValidEmail(email)) {
    return 'Email inválido. Formato esperado: usuario@dominio.com'
  }

  return undefined
}

/**
 * Document validation utilities
 */

/**
 * Normalizes a document number (converts to uppercase, trims, removes spaces and hyphens)
 *
 * @param document - The document number to normalize
 * @returns Normalized document number
 */
export function normalizeDocument(document: string): string {
  if (!document || typeof document !== 'string') {
    return ''
  }
  // Remove spaces and hyphens, convert to uppercase, and trim
  return document.replace(/[\s-]/g, '').toUpperCase().trim()
}
