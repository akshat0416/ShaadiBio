import { useEffect, useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import {
  fetchAdminBiodata,
  fetchAdminStats,
  fetchAdminUsers,
  fetchTemplateConfigs,
  updateTemplateConfig,
  type AdminBiodataSummary,
  type AdminStats,
  type AdminUser,
  type TemplateConfig,
} from '@/app/admin/api'
import { getErrorMessage } from '@/lib/error'
import toast from 'react-hot-toast'

export function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [users, setUsers] = useState<AdminUser[]>([])
  const [biodatas, setBiodatas] = useState<AdminBiodataSummary[]>([])
  const [templates, setTemplates] = useState<TemplateConfig[]>([])

  useEffect(() => {
    ;(async () => {
      try {
        const [s, u, b, t] = await Promise.all([
          fetchAdminStats(),
          fetchAdminUsers(),
          fetchAdminBiodata(),
          fetchTemplateConfigs(),
        ])
        setStats(s)
        setUsers(u)
        setBiodatas(b)
        setTemplates(t)
      } catch (e: unknown) {
        toast.error(getErrorMessage(e, 'Failed to load admin data'))
      }
    })()
  }, [])

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-slate-600">Overview of users, biodata and templates.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-5">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Users</div>
            <div className="mt-3 text-2xl font-semibold text-slate-900">
              {stats ? stats.userCount : '—'}
            </div>
          </Card>
          <Card className="p-5">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Biodata</div>
            <div className="mt-3 text-2xl font-semibold text-slate-900">
              {stats ? stats.biodataCount : '—'}
            </div>
          </Card>
          <Card className="p-5">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Templates</div>
            <div className="mt-3 text-2xl font-semibold text-slate-900">{templates.length}</div>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-slate-900">Recent Users</div>
              <div className="text-xs text-slate-500">Latest signups</div>
            </div>
            <div className="mt-3 space-y-2 text-xs text-slate-700">
              {users.slice(0, 6).map((u) => (
                <div key={u._id} className="flex items-center justify-between gap-2">
                  <div>
                    <div className="font-medium">{u.name}</div>
                    <div className="text-slate-500">{u.email}</div>
                  </div>
                  <div className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-600">
                    {u.role}
                  </div>
                </div>
              ))}
              {users.length === 0 && <div>No users yet.</div>}
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-slate-900">Recent Biodata</div>
              <div className="text-xs text-slate-500">Last 6 created</div>
            </div>
            <div className="mt-3 space-y-2 text-xs text-slate-700">
              {biodatas.slice(0, 6).map((b) => (
                <div key={b.id} className="flex items-center justify-between gap-2">
                  <div>
                    <div className="font-medium">{b.userName}</div>
                    <div className="text-slate-500">{b.userEmail}</div>
                  </div>
                  <div className="text-[11px] text-slate-500 capitalize">{b.template}</div>
                </div>
              ))}
              {biodatas.length === 0 && <div>No biodata yet.</div>}
            </div>
          </Card>
        </div>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-900">Template Settings</div>
            <div className="text-xs text-slate-500">Enable/disable and tweak defaults</div>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {templates.map((tpl) => (
              <div
                key={tpl._id}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3 text-xs"
              >
                <div>
                  <div className="font-semibold capitalize">{tpl.templateId} template</div>
                  <div className="mt-1 text-slate-500">
                    Primary: {tpl.defaultTheme?.primaryColor || '—'} • Accent:{' '}
                    {tpl.defaultTheme?.accentColor || '—'} • Font:{' '}
                    {tpl.defaultTheme?.fontFamily || 'sans'}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <label className="inline-flex items-center gap-1">
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={tpl.enabled}
                      onChange={async (e) => {
                        try {
                          const updated = await updateTemplateConfig(tpl._id, { enabled: e.target.checked })
                          setTemplates((prev) =>
                            prev.map((t) => (t._id === updated._id ? updated : t)),
                          )
                        } catch (err) {
                          toast.error(getErrorMessage(err, 'Failed to update template'))
                        }
                      }}
                    />
                    <span>Enabled</span>
                  </label>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={async () => {
                      try {
                        const updated = await updateTemplateConfig(tpl._id, {
                          defaultTheme: {
                            primaryColor: '#7c3aed',
                            accentColor: '#0f172a',
                          },
                        })
                        setTemplates((prev) =>
                          prev.map((t) => (t._id === updated._id ? updated : t)),
                        )
                        toast.success('Template theme reset')
                      } catch (err) {
                        toast.error(getErrorMessage(err, 'Failed to reset theme'))
                      }
                    }}
                  >
                    Reset Theme
                  </Button>
                </div>
              </div>
            ))}
            {templates.length === 0 && <div className="text-xs text-slate-600">No templates found.</div>}
          </div>
        </Card>
      </div>
    </AppShell>
  )
}

