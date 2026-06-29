import { createContext, use, useEffect, useState, type ReactNode } from 'react'
import * as authApi from './auth.api'
import { getToken, setToken, clearToken } from '@/lib/token'
import type { LoginInput, RegisterInput, User } from './auth.types'

type Status = 'loading' | 'authenticated' | 'unauthenticated'

interface AuthContextValue {
  user: User | null
  status: Status
  login: (input: LoginInput) => Promise<void>
  register: (input: RegisterInput) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<Status>('loading')

  useEffect(() => {
    if (!getToken()) {
      setStatus('unauthenticated')
      return
    }
    authApi
      .getMe()
      .then((me) => {
        setUser(me)
        setStatus('authenticated')
      })
      .catch(() => {
        clearToken()
        setStatus('unauthenticated')
      })
  }, [])

  const apply = (result: { user: User; token: string }) => {
    setToken(result.token)
    setUser(result.user)
    setStatus('authenticated')
  }

  const login = async (input: LoginInput) => apply(await authApi.login(input))
  const register = async (input: RegisterInput) => apply(await authApi.register(input))

  const logout = () => {
    clearToken()
    setUser(null)
    setStatus('unauthenticated')
  }

  return (
    <AuthContext value={{ user, status, login, register, logout }}>{children}</AuthContext>
  )
}

export function useAuth() {
  const ctx = use(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
