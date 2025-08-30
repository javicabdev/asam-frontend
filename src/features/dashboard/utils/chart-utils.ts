import { TFunction } from 'i18next'

/**
 * Month formatting utilities for dashboard charts
 */

interface MonthNames {
  '01': string
  '02': string
  '03': string
  '04': string
  '05': string
  '06': string
  '07': string
  '08': string
  '09': string
  '10': string
  '11': string
  '12': string
}

/**
 * Format month string (YYYY-MM) to localized month name
 * @param month - Month string in YYYY-MM format
 * @param t - Translation function
 * @param language - Current language code
 * @returns Formatted month name (abbreviated except for 'wo' language)
 */
export const formatMonth = (month: string, t: TFunction, language: string): string => {
  const monthNumber = month.split('-')[1] as keyof MonthNames
  
  const monthNames: MonthNames = {
    '01': t('months.january'),
    '02': t('months.february'),
    '03': t('months.march'),
    '04': t('months.april'),
    '05': t('months.may'),
    '06': t('months.june'),
    '07': t('months.july'),
    '08': t('months.august'),
    '09': t('months.september'),
    '10': t('months.october'),
    '11': t('months.november'),
    '12': t('months.december'),
  }
  
  // Para abreviaciones, tomar las primeras 3 letras
  const fullName = monthNames[monthNumber] || month
  return language === 'wo' ? fullName : fullName.substring(0, 3)
}

/**
 * Format currency value to localized string
 * @param value - Numeric value to format
 * @param language - Current language code
 * @returns Formatted currency string
 */
export const formatCurrency = (value: number, language: string): string => {
  // Mapear idioma i18n a locale
  const localeMap: Record<string, string> = {
    es: 'es-ES',
    fr: 'fr-FR',
    wo: 'fr-SN', // Usar formato francés para wolof en Senegal
  }
  const locale = localeMap[language] || 'es-ES'
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
  }).format(value)
}
