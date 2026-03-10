import type { ReactNode } from 'react'
import { X } from 'lucide-react'

export function Modal({
  title,
  isOpen,
  onClose,
  children,
}: {
  title?: string
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 overflow-auto p-4">
        <div className="mx-auto w-fit max-w-full rounded-2xl bg-white shadow-xl ring-1 ring-slate-200">
          <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-4 py-3">
            <div className="text-sm font-semibold text-slate-900">{title}</div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-slate-600 hover:bg-slate-100"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-4">{children}</div>
        </div>
      </div>
    </div>
  )
}

