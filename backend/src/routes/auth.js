const express = require('express')
const { User } = require('../models/User')
const { PasswordResetToken } = require('../models/PasswordResetToken')
const crypto = require('crypto')
const { signToken } = require('../utils/jwt')
const { authRequired } = require('../middleware/auth')

function authRoutes({ jwtSecret }) {
  const router = express.Router()

  router.post('/register', async (req, res, next) => {
    try {
      const { name, email, password } = req.body || {}
      if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' })
      if (String(password).length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' })

      const existing = await User.findOne({ email: String(email).toLowerCase().trim() })
      if (existing) return res.status(409).json({ message: 'Email already in use' })

      const user = await User.create({
        name: String(name).trim(),
        email: String(email).toLowerCase().trim(),
        password: String(password),
      })

      const token = signToken({ userId: user._id.toString() }, jwtSecret)
      res.status(201).json({
        token,
        user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role, isPremium: user.isPremium },
      })
    } catch (err) {
      next(err)
    }
  })

  router.post('/login', async (req, res, next) => {
    try {
      const { email, password } = req.body || {}
      if (!email || !password) return res.status(400).json({ message: 'Missing fields' })

      const user = await User.findOne({ email: String(email).toLowerCase().trim() })
      if (!user) return res.status(401).json({ message: 'Invalid email or password' })

      const ok = await user.comparePassword(String(password))
      if (!ok) return res.status(401).json({ message: 'Invalid email or password' })

      const token = signToken({ userId: user._id.toString() }, jwtSecret)
      res.json({
        token,
        user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role, isPremium: user.isPremium },
      })
    } catch (err) {
      next(err)
    }
  })

  router.post('/forgot-password', async (req, res, next) => {
    try {
      const { email } = req.body || {}
      if (!email) return res.status(400).json({ message: 'Email is required' })

      const user = await User.findOne({ email: String(email).toLowerCase().trim() })
      if (user) {
        const token = crypto.randomBytes(24).toString('hex')
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000)
        await PasswordResetToken.create({ userId: user._id, token, expiresAt })
        // Mock email implementation: log reset link to server console.
        // eslint-disable-next-line no-console
        console.log(
          `Password reset link for ${user.email}: http://localhost:5173/reset-password?token=${token}`,
        )
      }

      // Always respond success to avoid leaking which emails exist.
      res.json({ ok: true })
    } catch (err) {
      next(err)
    }
  })

  router.post('/reset-password', async (req, res, next) => {
    try {
      const { token, password } = req.body || {}
      if (!token || !password) return res.status(400).json({ message: 'Missing fields' })
      if (String(password).length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' })
      }

      const reset = await PasswordResetToken.findOne({ token })
      if (!reset || reset.expiresAt.getTime() < Date.now()) {
        return res.status(400).json({ message: 'Reset link is invalid or expired' })
      }

      const user = await User.findById(reset.userId)
      if (!user) return res.status(400).json({ message: 'User no longer exists' })

      user.password = String(password)
      await user.save()
      await PasswordResetToken.deleteMany({ userId: user._id })

      res.json({ ok: true })
    } catch (err) {
      next(err)
    }
  })

  router.post('/change-password', authRequired(jwtSecret), async (req, res, next) => {
    try {
      const { currentPassword, newPassword } = req.body || {}
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Missing fields' })
      }
      if (String(newPassword).length < 6) {
        return res.status(400).json({ message: 'New password must be at least 6 characters' })
      }

      const user = await User.findById(req.user.id)
      if (!user) return res.status(404).json({ message: 'User not found' })

      const isMatch = await user.comparePassword(String(currentPassword))
      if (!isMatch) return res.status(401).json({ message: 'Incorrect current password' })

      user.password = String(newPassword)
      await user.save()

      res.json({ ok: true })
    } catch (err) {
      next(err)
    }
  })

  return router
}

module.exports = { authRoutes }

