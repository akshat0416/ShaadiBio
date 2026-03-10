import { useState } from 'react'
import toast from 'react-hot-toast'
import { Check, Star } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { http } from '@/app/api/http'
import { useAuth } from '@/app/auth/AuthContext'
import { getErrorMessage } from '@/lib/error'

export function PremiumPage() {
    const { user, setUser } = useAuth()
    const [loading, setLoading] = useState(false)

    const handleUpgrade = async () => {
        setLoading(true)
        try {
            // 1. Create order
            const orderRes = await http.post('/subscription/create')
            const { orderId, amount, currency } = orderRes.data

            // 2. Open Razorpay modal
            const options = {
                key: 'rzp_test_mockkeyid', // usually from env
                amount: amount.toString(),
                currency,
                name: 'ShaadiBio Premium',
                description: 'Lifetime Premium Access',
                order_id: orderId,
                handler: async function (response: any) {
                    try {
                        toast.loading('Verifying payment...', { id: 'payment' })
                        const verifyRes = await http.post('/subscription/verify', {
                            orderId: response.razorpay_order_id,
                            paymentId: response.razorpay_payment_id,
                            signature: response.razorpay_signature,
                        })

                        if (verifyRes.data.isPremium && verifyRes.data.user) {
                            // Update auth context with new user data
                            localStorage.setItem('shaadibio_token', verifyRes.data.token)
                            localStorage.setItem('shaadibio_user', JSON.stringify(verifyRes.data.user))
                            setUser(verifyRes.data.user)
                            
                            toast.success('Payment successful! Welcome to Premium.', { id: 'payment' })
                            setTimeout(() => window.location.reload(), 1500)
                        }
                    } catch (err) {
                        toast.error(getErrorMessage(err, 'Verification failed'), { id: 'payment' })
                    }
                },
                prefill: {
                    name: user?.name,
                    email: user?.email,
                },
                theme: {
                    color: '#7c3aed',
                },
            }

            const rzp = new (window as any).Razorpay(options)
            rzp.on('payment.failed', function (response: any) {
                toast.error(response.error.description || 'Payment Failed')
            })
            rzp.open()

        } catch (err) {
            toast.error(getErrorMessage(err, 'Could not initiate payment'), { id: 'payment' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <AppShell>
            <div className="mx-auto max-w-3xl py-10">
                <div className="text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-violet-100 text-violet-600 mb-4">
                        <Star className="h-8 w-8" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900">Upgrade to Premium</h1>
                    <p className="mt-3 text-lg text-slate-600">Unlock all features and create the perfect biodata.</p>
                </div>

                <div className="mt-12 grid gap-8 md:grid-cols-2">
                    {/* Free Plan */}
                    <Card className="p-8">
                        <h3 className="text-xl font-semibold text-slate-900">Free</h3>
                        <div className="mt-4 flex items-baseline text-4xl font-extrabold text-slate-900">
                            ₹0
                        </div>
                        <p className="mt-2 text-sm text-slate-500">For basic biodata creation</p>
                        <ul className="mt-8 space-y-4 text-sm text-slate-600">
                            <li className="flex items-center gap-3">
                                <Check className="h-5 w-5 text-violet-500" /> Basic templates
                            </li>
                            <li className="flex items-center gap-3">
                                <Check className="h-5 w-5 text-violet-500" /> PDF Downloads
                            </li>
                            <li className="flex items-center gap-3 opacity-50">
                                <span className="h-5 w-5" /> ShaadiBio Watermark
                            </li>
                            <li className="flex items-center gap-3 opacity-50">
                                <span className="h-5 w-5" /> Basic Privacy Controls
                            </li>
                        </ul>
                        <div className="mt-8">
                            <Button variant="secondary" className="w-full text-center" disabled>
                                Current Plan
                            </Button>
                        </div>
                    </Card>

                    {/* Premium Plan */}
                    <Card className="p-8 ring-2 ring-violet-600">
                        <h3 className="text-xl font-semibold text-violet-600">Premium</h3>
                        <div className="mt-4 flex items-baseline text-4xl font-extrabold text-slate-900">
                            ₹499
                            <span className="ml-1 text-xl font-medium text-slate-500">/lifetime</span>
                        </div>
                        <p className="mt-2 text-sm text-slate-500">Best for professional look</p>
                        <ul className="mt-8 space-y-4 text-sm text-slate-600">
                            <li className="flex items-center gap-3 font-medium text-slate-900">
                                <Check className="h-5 w-5 text-violet-600" /> No Watermark
                            </li>
                            <li className="flex items-center gap-3 font-medium text-slate-900">
                                <Check className="h-5 w-5 text-violet-600" /> Password-Protected PDF
                            </li>
                            <li className="flex items-center gap-3">
                                <Check className="h-5 w-5 text-violet-600" /> All Templates & Colors
                            </li>
                            <li className="flex items-center gap-3">
                                <Check className="h-5 w-5 text-violet-600" /> Priority Support
                            </li>
                        </ul>
                        <div className="mt-8">
                            {user?.isPremium ? (
                                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 pointer-events-none">
                                    You are Premium
                                </Button>
                            ) : (
                                <Button className="w-full" onClick={handleUpgrade} disabled={loading}>
                                    {loading ? 'Processing...' : 'Upgrade Now'}
                                </Button>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </AppShell>
    )
}
