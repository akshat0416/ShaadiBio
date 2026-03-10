/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import toast from 'react-hot-toast'
import { http } from '@/app/api/http'
import type { AuthContextValue, AuthUser } from '@/app/auth/types'

type LoginResponse = { token: string; user: AuthUser }

const AuthContext = createContext<AuthContextValue | null>(null)

function decodeJwtPayload(token: string): unknown {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const json = atob(normalized)
    return JSON.parse(json)
  } catch {
    return null
  }
}

function readStoredAuth() {
  const t = localStorage.getItem('shaadibio_token')
  const u = localStorage.getItem('shaadibio_user')
  if (!t || !u) return { token: null, user: null }

  const payload = decodeJwtPayload(t) as { exp?: number } | null
  if (payload?.exp && Date.now() > payload.exp * 1000) {
    localStorage.removeItem('shaadibio_token')
    localStorage.removeItem('shaadibio_user')
    return { token: null, user: null }
  }

  try {
    return { token: t, user: JSON.parse(u) as AuthUser }
  } catch {
    return { token: null, user: null }
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const stored = readStoredAuth()
  const [token, setToken] = useState<string | null>(stored.token)
  const [user, setUser] = useState<AuthUser | null>(stored.user)

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isLoading: false,
      setUser,
      login: async ({ email, password }) => {
        const res = await http.post<LoginResponse>('/login', { email, password })
        localStorage.setItem('shaadibio_token', res.data.token)
        localStorage.setItem('shaadibio_user', JSON.stringify(res.data.user))
        setToken(res.data.token)
        setUser(res.data.user)
        toast.success('Welcome back!')
      },
      register: async ({ name, email, password }) => {
        const res = await http.post<LoginResponse>('/register', { name, email, password })
        localStorage.setItem('shaadibio_token', res.data.token)
        localStorage.setItem('shaadibio_user', JSON.stringify(res.data.user))
        setToken(res.data.token)
        setUser(res.data.user)
        toast.success('Account created!')
      },
      logout: () => {
        localStorage.removeItem('shaadibio_token')
        localStorage.removeItem('shaadibio_user')
        setToken(null)
        setUser(null)
        toast.success('Logged out')
      },
    }),
    [token, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

