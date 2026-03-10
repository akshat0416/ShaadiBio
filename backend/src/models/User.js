const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true, index: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user', index: true },
    isPremium: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)

userSchema.pre('save', async function hashPassword() {
  if (!this.isModified('password')) return
  const saltRounds = 10
  this.password = await bcrypt.hash(this.password, saltRounds)
})

userSchema.methods.comparePassword = async function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password)
}

const User = mongoose.model('User', userSchema)
module.exports = { User }

