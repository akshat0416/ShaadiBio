const { User } = require('../models/User')

async function adminOnly(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select('role')
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' })
    }
    return next()
  } catch (err) {
    return next(err)
  }
}

module.exports = { adminOnly }

