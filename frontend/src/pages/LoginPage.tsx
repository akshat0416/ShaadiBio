import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/app/auth/AuthContext'
import { getErrorMessage } from '@/lib/error'

type FormValues = { email: string; password: string }

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation() as { state?: { from?: string } }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ defaultValues: { email: '', password: '' } })

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 via-white to-white">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2">
        <div>
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-violet-600 text-white">♥</div>
            <span className="text-sm font-semibold">ShaadiBio</span>
          </Link>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight text-slate-900">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-600">Login to create, manage and download your biodata.</p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/60 md:p-8">
          <form
            className="space-y-4"
            onSubmit={handleSubmit(async (values) => {
              try {
                await login(values)
                navigate(location.state?.from || '/app', { replace: true })
              } catch (e: unknown) {
                toast.error(getErrorMessage(e, 'Login failed'))
              }
            })}
          >
            <div>
              <label className="text-xs font-medium text-slate-700">Email</label>
              <div className="mt-1">
                <Input
                  placeholder="you@example.com"
                  type="email"
                  autoComplete="email"
                  error={errors.email?.message}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
                  })}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700">Password</label>
              <div className="mt-1">
                <Input
                  placeholder="••••••••"
                  type="password"
                  autoComplete="current-password"
                  error={errors.password?.message}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Minimum 6 characters' },
                  })}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-xs font-medium text-violet-700 hover:text-violet-800"
              >
                Forgot password?
              </Link>
            </div>

            <Button className="w-full" disabled={isSubmitting} type="submit">
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>

            <p className="text-center text-sm text-slate-600">
              New here?{' '}
              <Link to="/register" className="font-medium text-violet-700 hover:text-violet-800">
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

