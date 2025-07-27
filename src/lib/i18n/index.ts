import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import commonEs from './locales/es/common.json';
import commonFr from './locales/fr/common.json';
import commonWo from './locales/wo/common.json';

import authEs from './locales/es/auth.json';
import authFr from './locales/fr/auth.json';
import authWo from './locales/wo/auth.json';

import membersEs from './locales/es/members.json';
import membersFr from './locales/fr/members.json';
import membersWo from './locales/wo/members.json';

import paymentsEs from './locales/es/payments.json';
import paymentsFr from './locales/fr/payments.json';
import paymentsWo from './locales/wo/payments.json';

import navigationEs from './locales/es/navigation.json';
import navigationFr from './locales/fr/navigation.json';
import navigationWo from './locales/wo/navigation.json';

export const defaultNS = 'common';
export const resources = {
  es: {
    common: commonEs,
    auth: authEs,
    members: membersEs,
    payments: paymentsEs,
    navigation: navigationEs,
  },
  fr: {
    common: commonFr,
    auth: authFr,
    members: membersFr,
    payments: paymentsFr,
    navigation: navigationFr,
  },
  wo: {
    common: commonWo,
    auth: authWo,
    members: membersWo,
    payments: paymentsWo,
    navigation: navigationWo,
  },
} as const;

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
} as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    defaultNS,
    lng: 'es', // Default language
    fallbackLng: 'es',
    ns: ['common', 'auth', 'members', 'payments', 'navigation'],
    
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
  });

export default i18n;
