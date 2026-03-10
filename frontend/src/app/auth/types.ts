export type AuthUser = {
  id: string
  name: string
  email: string
  role: 'user' | 'admin'
  isPremium?: boolean
}

export type AuthContextValue = {
  user: AuthUser | null
  token: string | null
  isLoading: boolean
  login: (args: { email: string; password: string }) => Promise<void>
  register: (args: { name: string; email: string; password: string }) => Promise<void>
  logout: () => void
  setUser: (user: AuthUser | null) => void
}

