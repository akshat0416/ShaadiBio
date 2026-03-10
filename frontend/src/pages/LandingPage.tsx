import { Link } from 'react-router-dom'
import { Download, LayoutTemplate, Lock, Sparkles, Globe } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const features = [
  {
    titleKey: 'feature1_title',
    descKey: 'feature1_desc',
    icon: Sparkles,
  },
  { titleKey: 'feature2_title', descKey: 'feature2_desc', icon: LayoutTemplate },
  { titleKey: 'feature3_title', descKey: 'feature3_desc', icon: Download },
  { titleKey: 'feature4_title', descKey: 'feature4_desc', icon: Lock },
] as const

import { useTranslation } from 'react-i18next'

export function LandingPage() {
  const { t, i18n } = useTranslation()

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 via-white to-white">
      <header className="sticky top-0 z-10 border-b border-slate-200/60 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-violet-600 text-white">♥</div>
            <span className="text-sm font-semibold">ShaadiBio</span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
            <a className="hover:text-slate-900" href="#features">
              {t('Features_Nav')}
            </a>
            <a className="hover:text-slate-900" href="#how">
              {t('How_It_Works_Nav')}
            </a>
            <Link className="hover:text-slate-900" to="/login">
              {t('Login')}
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-slate-600" />
              <select
                className="bg-transparent outline-none cursor-pointer text-sm text-slate-600 hover:text-slate-900"
                value={i18n.language}
                onChange={(e) => i18n.changeLanguage(e.target.value)}
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
              </select>
            </div>
            <Link to="/create">
              <Button size="sm">{t('Get Started')}</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <div className="grid gap-8 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:items-center">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
              {t('heroTitleLeft')} <span className="text-violet-600">{t('heroTitleHighlight')}</span> {t('heroTitleRight')}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600">
              {t('heroSubtitle')}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/create">
                <Button size="lg">{t('Create Biodata Button')}</Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="secondary">
                  {t('Login')}
                </Button>
              </Link>
            </div>

            <div className="mt-8 grid gap-3 text-xs text-slate-500 md:text-sm">
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 shadow-sm ring-1 ring-violet-100">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                {t('heroBadge1')}
              </div>
              <div className="flex flex-wrap gap-3">
                <span className="rounded-full bg-white px-3 py-1 shadow-sm ring-1 ring-slate-200">
                  {t('heroBadge2')}
                </span>
                <span className="rounded-full bg-white px-3 py-1 shadow-sm ring-1 ring-slate-200">
                  {t('heroBadge3')}
                </span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-violet-200/50 to-pink-200/40 blur-2xl" />
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/60">
              <div className="text-xs font-semibold uppercase tracking-wide text-violet-700">{t('livePreview')}</div>
              <div className="mt-3 space-y-3 text-xs text-slate-600">
                <div className="rounded-2xl bg-violet-50 p-3">
                  <div className="text-sm font-semibold text-slate-900">{t('marriageBiodata')}</div>
                  <div className="mt-1 text-xs text-slate-600">{t('marriageBiodataSub')}</div>
                </div>
                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <span>{t('step1')}</span>
                    <span className="text-slate-400">{t('step1Num')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('step2')}</span>
                    <span className="text-slate-400">{t('step2Num')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('step3')}</span>
                    <span className="text-slate-400">{t('step3Num')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('step4')}</span>
                    <span className="text-slate-400">{t('step4Num')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-4 py-14">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">{t('everythingYouNeed')}</h2>
          <p className="mt-2 text-sm text-slate-600">{t('everythingYouNeedSub')}</p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-4">
          {features.map(({ titleKey, descKey, icon: Icon }) => (
            <div
              key={titleKey}
              className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/60 transition hover:shadow-md"
            >
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-violet-600 text-white">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-slate-900">{t(titleKey)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{t(descKey)}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how" className="mx-auto max-w-6xl px-4 pb-16">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">{t('howItWorks')}</h2>
          <p className="mt-2 text-sm text-slate-600">{t('howItWorksSub')}</p>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {[
            { n: 1, titleKey: 'howStep1Title', descKey: 'howStep1Desc' },
            { n: 2, titleKey: 'howStep2Title', descKey: 'howStep2Desc' },
            { n: 3, titleKey: 'howStep3Title', descKey: 'howStep3Desc' },
          ].map((s) => (
            <div key={s.n} className="text-center">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-violet-600 text-white">
                {s.n}
              </div>
              <h3 className="mt-4 text-sm font-semibold text-slate-900">{t(s.titleKey)}</h3>
              <p className="mt-2 text-sm text-slate-600">{t(s.descKey)}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-200/60 bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-violet-600 text-white">♥</div>
              <span className="text-sm font-semibold">ShaadiBio</span>
            </div>
            <p className="mt-3 text-sm text-slate-600">
              {t('footerDesc')}
            </p>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">{t('footerProduct')}</div>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>
                <a href="#features" className="hover:text-slate-900">
                  {t('footerFeatures')}
                </a>
              </li>
              <li>
                <Link to="/app/templates" className="hover:text-slate-900">
                  {t('footerTemplates')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">{t('footerCompany')}</div>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>
                <a className="hover:text-slate-900" href="#">
                  {t('footerAbout')}
                </a>
              </li>
              <li>
                <a className="hover:text-slate-900" href="#">
                  {t('footerContact')}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">{t('footerLegal')}</div>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>
                <a className="hover:text-slate-900" href="#">
                  {t('footerPrivacy')}
                </a>
              </li>
              <li>
                <a className="hover:text-slate-900" href="#">
                  {t('footerTerms')}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-200/60 py-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} ShaadiBio. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

