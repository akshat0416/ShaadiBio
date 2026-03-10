import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { AppShell } from '@/components/layout/AppShell'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { http } from '@/app/api/http'
import { getErrorMessage } from '@/lib/error'

export function SettingsPage() {
    const [loading, setLoading] = useState(false)
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' }
    })

    const onSubmit = async (data: any) => {
        if (data.newPassword !== data.confirmPassword) {
            toast.error('New passwords do not match')
            return
        }
        setLoading(true)
        try {
            await http.post('/change-password', {
                currentPassword: data.currentPassword,
                newPassword: data.newPassword
            })
            toast.success('Password changed successfully')
            reset()
        } catch (e) {
            toast.error(getErrorMessage(e, 'Failed to change password'))
        } finally {
            setLoading(false)
        }
    }

    return (
        <AppShell>
            <div>
                <h1 className="text-2xl font-semibold text-slate-900">Settings</h1>
                <p className="mt-1 text-sm text-slate-600">Manage your account settings and preferences.</p>

                <div className="mt-6">
                    <Card className="p-6 max-w-md">
                        <h2 className="text-lg font-medium text-slate-900 mb-4">Change Password</h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">Current Password</label>
                                <Input
                                    type="password"
                                    placeholder="Enter current password"
                                    error={errors.currentPassword?.message?.toString()}
                                    {...register('currentPassword', { required: 'Current password is required' })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">New Password</label>
                                <Input
                                    type="password"
                                    placeholder="Enter new password"
                                    error={errors.newPassword?.message?.toString()}
                                    {...register('newPassword', {
                                        required: 'New password is required',
                                        minLength: { value: 6, message: 'Must be at least 6 characters' }
                                    })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">Confirm New Password</label>
                                <Input
                                    type="password"
                                    placeholder="Confirm new password"
                                    error={errors.confirmPassword?.message?.toString()}
                                    {...register('confirmPassword', { required: 'Confirm your new password' })}
                                />
                            </div>
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Updating...' : 'Update Password'}
                            </Button>
                        </form>
                    </Card>
                </div>
            </div>
        </AppShell>
    )
}
