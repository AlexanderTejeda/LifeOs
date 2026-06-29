import { api } from '@/lib/api-client'
import type { AuthResult, LoginInput, RegisterInput, User } from './auth.types'

export const login = async (input: LoginInput) => {
  const { data } = await api.post<{ data: AuthResult }>('/auth/login', input)
  return data.data
}

export const register = async (input: RegisterInput) => {
  const { data } = await api.post<{ data: AuthResult }>('/auth/register', input)
  return data.data
}

export const getMe = async () => {
  const { data } = await api.get<{ data: User }>('/auth/me')
  return data.data
}
