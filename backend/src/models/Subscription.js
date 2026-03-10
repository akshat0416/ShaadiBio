const mongoose = require('mongoose')

const subscriptionSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        plan: { type: String, default: 'premium' },
        status: { type: String, enum: ['active', 'cancelled', 'expired'], default: 'active' },
        paymentId: { type: String, required: true },
    },
    { timestamps: true }
)

const Subscription = mongoose.model('Subscription', subscriptionSchema)
module.exports = { Subscription }
