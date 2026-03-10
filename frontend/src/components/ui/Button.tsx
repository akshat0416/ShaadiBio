import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({ className, variant = 'primary', size = 'md', ...props }: Props) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-60',
        size === 'sm' && 'h-9 px-3 text-sm',
        size === 'md' && 'h-10 px-4 text-sm',
        size === 'lg' && 'h-11 px-5 text-base',
        variant === 'primary' &&
          'bg-violet-600 text-white shadow-sm hover:bg-violet-700 active:bg-violet-800',
        variant === 'secondary' &&
          'bg-white text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50 active:bg-slate-100',
        variant === 'ghost' && 'bg-transparent text-slate-700 hover:bg-slate-100 active:bg-slate-200',
        variant === 'danger' &&
          'bg-rose-600 text-white shadow-sm hover:bg-rose-700 active:bg-rose-800',
        className,
      )}
      {...props}
    />
  )
}

