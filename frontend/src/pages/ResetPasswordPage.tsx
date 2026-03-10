import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { http } from '@/app/api/http'
import { getErrorMessage } from '@/lib/error'

type FormValues = { password: string; confirmPassword: string }

export function ResetPasswordPage() {
  const [params] = useSearchParams()
  const token = params.get('token') || ''
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ defaultValues: { password: '', confirmPassword: '' } })

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
          <h1 className="text-lg font-semibold text-slate-900">Reset password</h1>
          <p className="mt-1 text-sm text-slate-600">Choose a new password for your account.</p>

          <form
            className="mt-4 space-y-4"
            onSubmit={handleSubmit(async (values) => {
              try {
                await http.post('/reset-password', {
                  token,
                  password: values.password,
                })
                toast.success('Password updated. You can now log in.')
                navigate('/login')
              } catch (e) {
                toast.error(getErrorMessage(e, 'Failed to reset password'))
              }
            })}
          >
            <div>
              <label className="text-xs font-medium text-slate-700">New password</label>
              <div className="mt-1">
                <Input
                  type="password"
                  placeholder="Minimum 6 characters"
                  error={errors.password?.message}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Minimum 6 characters' },
                  })}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700">Confirm password</label>
              <div className="mt-1">
                <Input
                  type="password"
                  placeholder="Re-enter password"
                  error={errors.confirmPassword?.message}
                  {...register('confirmPassword', {
                    required: 'Please confirm password',
                    validate: (val) => val === getValues('password') || 'Passwords do not match',
                  })}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting || !token}>
              {isSubmitting ? 'Saving...' : 'Reset password'}
            </Button>

            <p className="text-center text-sm text-slate-600">
              Back to{' '}
              <Link to="/login" className="font-medium text-violet-700 hover:text-violet-800">
                login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

