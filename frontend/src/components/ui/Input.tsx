import type { InputHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  error?: string
}

export function Input({ className, error, ...props }: Props) {
  return (
    <div className="w-full">
      <input
        className={cn(
          'h-10 w-full rounded-xl bg-white px-3 text-sm text-slate-900',
          'ring-1 ring-slate-200 placeholder:text-slate-400',
          'focus:outline-none focus:ring-2 focus:ring-violet-400',
          error && 'ring-rose-300 focus:ring-rose-400',
          className,
        )}
        {...props}
      />
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </div>
  )
}

