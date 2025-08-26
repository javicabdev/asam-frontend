import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type Language = 'es' | 'fr' | 'wo'
export type ThemeMode = 'light' | 'dark' | 'system'

interface SettingsState {
  // Language settings
  language: Language
  setLanguage: (language: Language) => void

  // Theme settings
  themeMode: ThemeMode
  setThemeMode: (mode: ThemeMode) => void

  // Other preferences
  compactView: boolean
  setCompactView: (compact: boolean) => void

  // Notification preferences
  emailNotifications: boolean
  setEmailNotifications: (enabled: boolean) => void

  pushNotifications: boolean
  setPushNotifications: (enabled: boolean) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // Default values
      language: 'es',
      themeMode: 'system',
      compactView: false,
      emailNotifications: true,
      pushNotifications: false,

      // Actions
      setLanguage: (language) => set({ language }),
      setThemeMode: (themeMode) => set({ themeMode }),
      setCompactView: (compactView) => set({ compactView }),
      setEmailNotifications: (emailNotifications) => set({ emailNotifications }),
      setPushNotifications: (pushNotifications) => set({ pushNotifications }),
    }),
    {
      name: 'asam-settings',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
