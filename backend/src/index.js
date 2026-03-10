require('dotenv').config()

const path = require('path')
const { connectDb } = require('./config/db')
const { required, optional } = require('./config/env')
const { createApp } = require('./app')

async function main() {
  const port = Number(optional('PORT', '5000'))
  const mongoUri = required('MONGO_URI')
  const jwtSecret = required('JWT_SECRET')
  const clientOrigin = optional('CLIENT_ORIGIN', 'http://localhost:5173')
  const uploadDir = path.resolve(__dirname, '..', 'uploads')

  await connectDb(mongoUri)

  const app = createApp({ jwtSecret, clientOrigin, uploadDir })
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on http://localhost:${port}`)
  })
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exit(1)
})

