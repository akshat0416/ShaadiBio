import type { ReactNode } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen max-w-[1400px]">
        <div className="hidden min-h-screen md:block">
          <Sidebar />
        </div>
        <main className="flex-1 p-5 md:p-8">
          <div className="mx-auto max-w-[1100px]">{children}</div>
        </main>
      </div>
    </div>
  )
}

