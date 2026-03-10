const express = require('express')
const crypto = require('crypto')
const Razorpay = require('razorpay')
const { User } = require('../models/User')
const { Subscription } = require('../models/Subscription')
const { signToken } = require('../utils/jwt')

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_mockkeyid',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'mockkeysecret'
})

function subscriptionRoutes(jwtSecret) {
    const router = express.Router()

    router.post('/create', async (req, res, next) => {
        try {
            const options = {
                amount: 499 * 100, // amount in smallest currency unit
                currency: 'INR',
                receipt: `receipt_${Date.now()}`
            }
            const order = await razorpay.orders.create(options)
            res.json({ orderId: order.id, amount: order.amount, currency: order.currency })
        } catch (err) {
            next(err)
        }
    })

    router.post('/verify', async (req, res, next) => {
        try {
            const { paymentId, orderId, signature } = req.body || {}
            if (!paymentId || !orderId || !signature) {
                return res.status(400).json({ message: 'Missing payment details' })
            }

            // Verify signature
            const body = orderId + '|' + paymentId
            const expectedSignature = crypto
                .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'mockkeysecret')
                .update(body.toString())
                .digest('hex')

            if (expectedSignature !== signature) {
                return res.status(400).json({ message: 'Invalid payment signature' })
            }

            const user = await User.findById(req.user.id)
            if (!user) return res.status(404).json({ message: 'User not found' })

            // Create subscription record
            await Subscription.create({
                userId: user._id,
                plan: 'premium',
                status: 'active',
                paymentId
            })

            // Upgrade user
            user.isPremium = true
            await user.save()

            // Return updated user and token
            const token = signToken({ userId: user._id.toString() }, jwtSecret)
            res.json({
                ok: true,
                isPremium: true,
                token,
                user: {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    isPremium: user.isPremium
                }
            })
        } catch (err) {
            next(err)
        }
    })

    return router
}

module.exports = { subscriptionRoutes }

