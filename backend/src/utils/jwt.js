const jwt = require('jsonwebtoken')

function signToken({ userId }, secret) {
  return jwt.sign({ sub: userId }, secret, { expiresIn: '7d' })
}

module.exports = { signToken }

