import { Link } from 'react-router-dom'
import { Download, FileText, PlusCircle } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { Card } from '@/components/ui/Card'
import { useTranslation } from 'react-i18next'

export function Dashboard() {
  const { t } = useTranslation()
  return (
    <AppShell>
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{t('Dashboard')}</h1>
        <p className="mt-1 text-sm text-slate-600">{t('Welcome')}</p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Link to="/app/create">
            <Card className="group p-5 hover:shadow-md">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-violet-600 text-white">
                <PlusCircle className="h-5 w-5" />
              </div>
              <div className="mt-4 text-sm font-semibold text-slate-900">{t('Create New Biodata')}</div>
              <p className="mt-1 text-sm text-slate-600">{t('Start creating')}</p>
            </Card>
          </Link>

          <Link to="/app/my">
            <Card className="group p-5 hover:shadow-md">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-900 text-white">
                <FileText className="h-5 w-5" />
              </div>
              <div className="mt-4 text-sm font-semibold text-slate-900">{t('View Saved Biodata')}</div>
              <p className="mt-1 text-sm text-slate-600">{t('Browse and manage')}</p>
            </Card>
          </Link>

          <Link to="/app/my">
            <Card className="group p-5 hover:shadow-md">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-violet-600 text-white">
                <Download className="h-5 w-5" />
              </div>
              <div className="mt-4 text-sm font-semibold text-slate-900">{t('Download Biodata')}</div>
              <p className="mt-1 text-sm text-slate-600">{t('Download your biodata')}</p>
            </Card>
          </Link>
        </div>
      </div>
    </AppShell>
  )
}

