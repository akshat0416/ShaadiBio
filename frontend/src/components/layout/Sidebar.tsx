import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, LogOut, PenSquare, Shapes, UserRound, Settings, Languages, Star } from 'lucide-react'
import { useAuth } from '@/app/auth/AuthContext'
import { cn } from '@/lib/cn'
import { useTranslation } from 'react-i18next'

const navItems = [
  { to: '/app', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/app/create', label: 'Create Biodata', icon: PenSquare },
  { to: '/app/my', label: 'My Biodata', icon: UserRound },
  { to: '/app/templates', label: 'Templates', icon: Shapes },
  { to: '/app/premium', label: 'Premium', icon: Star },
  { to: '/app/settings', label: 'Settings', icon: Settings },
] as const

export function Sidebar() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()

  return (
    <aside className="flex h-full w-64 flex-col gap-6 bg-white p-5 shadow-sm ring-1 ring-slate-200/60">
      <div className="flex items-center gap-2">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-violet-600 text-white">♥</div>
        <div className="leading-tight">
          <div className="text-sm font-semibold">ShaadiBio</div>
          <div className="text-xs text-slate-500">Marriage biodata</div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/app'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition',
                isActive ? 'bg-violet-50 text-violet-700' : 'text-slate-700 hover:bg-slate-50',
              )
            }
          >
            <Icon className="h-4 w-4" />
            {t(label)}
          </NavLink>
        ))}
      </nav>

      <div className="flex flex-col gap-2 border-t border-slate-200 pt-4 mt-4">
        <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700">
          <Languages className="h-4 w-4" />
          <select
            className="bg-transparent outline-none cursor-pointer"
            value={i18n.language}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="hi">हिंदी (Hindi)</option>
          </select>
        </div>

        <button
          type="button"
          onClick={() => {
            logout()
            navigate('/')
          }}
          className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <LogOut className="h-4 w-4" />
          {t('Logout')}
        </button>
      </div>
    </aside>
  )
}

