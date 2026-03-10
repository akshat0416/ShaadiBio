const jwt = require('jsonwebtoken')

function authRequired(jwtSecret) {
  return function authMiddleware(req, res, next) {
    const header = req.headers.authorization || ''
    const [, token] = header.split(' ')
    if (!token) return res.status(401).json({ message: 'Unauthorized' })

    try {
      const payload = jwt.verify(token, jwtSecret)
      req.user = { id: payload.sub }
      next()
    } catch {
      return res.status(401).json({ message: 'Invalid token' })
    }
  }
}

module.exports = { authRequired }

