import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { http } from '@/app/api/http'
import { getErrorMessage } from '@/lib/error'

type FormValues = { email: string }

export function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ defaultValues: { email: '' } })

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 via-white to-white">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-violet-600 text-white">♥</div>
            <span className="text-sm font-semibold">ShaadiBio</span>
          </Link>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/60 md:p-8">
          <h1 className="text-lg font-semibold text-slate-900">Forgot password</h1>
          <p className="mt-1 text-sm text-slate-600">
            Enter your email address and we will send you a reset link (mock).
          </p>

          <form
            className="mt-4 space-y-4"
            onSubmit={handleSubmit(async (values) => {
              try {
                await http.post('/forgot-password', values)
                toast.success('If this email exists, a reset link has been logged in the server.')
              } catch (e) {
                toast.error(getErrorMessage(e, 'Failed to request reset'))
              }
            })}
          >
            <div>
              <label className="text-xs font-medium text-slate-700">Email</label>
              <div className="mt-1">
                <Input
                  placeholder="you@example.com"
                  type="email"
                  error={errors.email?.message}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
                  })}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Requesting...' : 'Send reset link'}
            </Button>

            <p className="text-center text-sm text-slate-600">
              Remembered your password?{' '}
              <Link to="/login" className="font-medium text-violet-700 hover:text-violet-800">
                Back to login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

