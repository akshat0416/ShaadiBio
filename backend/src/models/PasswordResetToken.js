const mongoose = require('mongoose')

const passwordResetTokenSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    token: { type: String, required: true, unique: true, index: true },
    expiresAt: { type: Date, required: true, index: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)

const PasswordResetToken = mongoose.model('PasswordResetToken', passwordResetTokenSchema)

module.exports = { PasswordResetToken }

