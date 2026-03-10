const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const { authRoutes } = require('./routes/auth')
const { biodataRoutes } = require('./routes/biodata')
const { adminRoutes } = require('./routes/admin')
const { pdfRoutes } = require('./routes/pdf')
const { subscriptionRoutes } = require('./routes/subscription')
const { authRequired } = require('./middleware/auth')
const { adminOnly } = require('./middleware/admin')
const { notFound, errorHandler } = require('./middleware/error')

function createApp({ jwtSecret, clientOrigin, uploadDir }) {
  const app = express()

  app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://shaadi-bio-akshats-projects-a071b71d.vercel.app',
    ],
    credentials: true,
  })
)
  app.use(morgan('dev'))
  app.use(express.json({ limit: '2mb' }))

  app.get('/health', (_req, res) => res.json({ ok: true }))

  // Static uploads
  app.use('/uploads', express.static(uploadDir))

  // Routes
  app.use('/api', authRoutes({ jwtSecret }))
  app.use('/api', authRequired(jwtSecret), biodataRoutes({ uploadDir }))
  app.use('/api/pdf', pdfRoutes())
  app.use('/api/subscription', authRequired(jwtSecret), subscriptionRoutes(jwtSecret))
  app.use('/api/admin', authRequired(jwtSecret), adminOnly, adminRoutes())

  app.use(notFound)
  app.use(errorHandler)

  return app
}

module.exports = { createApp }

