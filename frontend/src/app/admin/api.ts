import { http } from '@/app/api/http'

export type AdminStats = {
  userCount: number
  biodataCount: number
}

export type AdminUser = {
  _id: string
  name: string
  email: string
  role: 'user' | 'admin'
  createdAt: string
}

export type AdminBiodataSummary = {
  id: string
  userName: string
  userEmail: string
  template: string
  createdAt: string
}

export type TemplateConfig = {
  _id: string
  templateId: 'classic' | 'modern'
  enabled: boolean
  defaultTheme?: {
    primaryColor?: string
    accentColor?: string
    fontFamily?: 'sans' | 'serif' | 'mono'
  }
}

export async function fetchAdminStats() {
  const res = await http.get<AdminStats>('/admin/stats')
  return res.data
}

export async function fetchAdminUsers() {
  const res = await http.get<AdminUser[]>('/admin/users')
  return res.data
}

export async function fetchAdminBiodata() {
  const res = await http.get<AdminBiodataSummary[]>('/admin/biodata')
  return res.data
}

export async function fetchTemplateConfigs() {
  const res = await http.get<TemplateConfig[]>('/admin/templates')
  return res.data
}

export async function updateTemplateConfig(id: string, patch: Partial<TemplateConfig>) {
  const res = await http.put<TemplateConfig>(`/admin/templates/${id}`, patch)
  return res.data
}

