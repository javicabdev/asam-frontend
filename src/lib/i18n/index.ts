import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Import translations
import commonEs from './locales/es/common.json'
import commonFr from './locales/fr/common.json'
import commonWo from './locales/wo/common.json'

import authEs from './locales/es/auth.json'
import authFr from './locales/fr/auth.json'
import authWo from './locales/wo/auth.json'

import dashboardEs from './locales/es/dashboard.json'
import dashboardFr from './locales/fr/dashboard.json'
import dashboardWo from './locales/wo/dashboard.json'

import membersEs from './locales/es/members.json'
import membersFr from './locales/fr/members.json'
import membersWo from './locales/wo/members.json'

import paymentsEs from './locales/es/payments.json'
import paymentsFr from './locales/fr/payments.json'
import paymentsWo from './locales/wo/payments.json'

import navigationEs from './locales/es/navigation.json'
import navigationFr from './locales/fr/navigation.json'
import navigationWo from './locales/wo/navigation.json'

import usersEs from './locales/es/users.json'
import usersFr from './locales/fr/users.json'
import usersWo from './locales/wo/users.json'

import cashflowEs from './locales/es/cashflow.json'
import cashflowFr from './locales/fr/cashflow.json'
import cashflowWo from './locales/wo/cashflow.json'

import reportsEs from './locales/es/reports.json'
import reportsFr from './locales/fr/reports.json'
import reportsWo from './locales/wo/reports.json'

import feesEs from './locales/es/fees.json'

export const defaultNS = 'common'
export const resources = {
  es: {
    common: commonEs,
    auth: authEs,
    dashboard: dashboardEs,
    members: membersEs,
    payments: paymentsEs,
    navigation: navigationEs,
    users: usersEs,
    cashflow: cashflowEs,
    reports: reportsEs,
    fees: feesEs,
  },
  fr: {
    common: commonFr,
    auth: authFr,
    dashboard: dashboardFr,
    members: membersFr,
    payments: paymentsFr,
    navigation: navigationFr,
    users: usersFr,
    cashflow: cashflowFr,
    reports: reportsFr,
  },
  wo: {
    common: commonWo,
    auth: authWo,
    dashboard: dashboardWo,
    members: membersWo,
    payments: paymentsWo,
    navigation: navigationWo,
    users: usersWo,
    cashflow: cashflowWo,
    reports: reportsWo,
  },
} as const

// Language configuration
export const languages = {
  es: {
    code: 'es',
    name: 'Español',
    flag: '🇪🇸',
    dir: 'ltr',
  },
  fr: {
    code: 'fr',
    name: 'Français',
    flag: '🇫🇷',
    dir: 'ltr',
  },
  wo: {
    code: 'wo',
    name: 'Wolof',
    flag: '🇸🇳',
    dir: 'ltr',
  },
} as const

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    defaultNS,
    lng: 'es', // Default language
    fallbackLng: 'es',
    ns: ['common', 'auth', 'dashboard', 'members', 'payments', 'navigation', 'users', 'cashflow', 'reports', 'fees'],

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'asam-language',
    },

    react: {
      useSuspense: false,
    },

    debug: process.env.NODE_ENV === 'development',
  })

export default i18n
