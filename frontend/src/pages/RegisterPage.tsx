import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/app/auth/AuthContext'
import { getErrorMessage } from '@/lib/error'

type FormValues = { name: string; email: string; password: string }

export function RegisterPage() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ defaultValues: { name: '', email: '', password: '' } })

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 via-white to-white">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2">
        <div>
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-violet-600 text-white">♥</div>
            <span className="text-sm font-semibold">ShaadiBio</span>
          </Link>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight text-slate-900">Create your account</h1>
          <p className="mt-2 text-sm text-slate-600">Start building your biodata with beautiful templates.</p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/60 md:p-8">
          <form
            className="space-y-4"
            onSubmit={handleSubmit(async (values) => {
              try {
                await registerUser(values)
                navigate('/app', { replace: true })
              } catch (e: unknown) {
                toast.error(getErrorMessage(e, 'Registration failed'))
              }
            })}
          >
            <div>
              <label className="text-xs font-medium text-slate-700">Name</label>
              <div className="mt-1">
                <Input
                  placeholder="Your name"
                  autoComplete="name"
                  error={errors.name?.message}
                  {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Too short' } })}
                />
              </div>
            </div>

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
                  placeholder="Minimum 6 characters"
                  type="password"
                  autoComplete="new-password"
                  error={errors.password?.message}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Minimum 6 characters' },
                  })}
                />
              </div>
            </div>

            <Button className="w-full" disabled={isSubmitting} type="submit">
              {isSubmitting ? 'Creating...' : 'Create account'}
            </Button>

            <p className="text-center text-sm text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-violet-700 hover:text-violet-800">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

