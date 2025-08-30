/* eslint-disable react-refresh/only-export-components */
import React, { createContext, ReactNode } from 'react'
import { useAuth } from '@/hooks/useAuth'

type AuthContextType = ReturnType<typeof useAuth>

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuth()

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}
