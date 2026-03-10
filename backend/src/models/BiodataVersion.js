const mongoose = require('mongoose')
const {
  personalDetailsSchema,
  familyDetailsSchema,
  educationDetailsSchema,
  horoscopeSchema,
  privacySchema,
  themeSchema,
} = require('./Biodata')

const snapshotSchema = new mongoose.Schema(
  {
    personalDetails: { type: personalDetailsSchema, default: {} },
    familyDetails: { type: familyDetailsSchema, default: {} },
    educationDetails: { type: educationDetailsSchema, default: {} },
    horoscope: { type: horoscopeSchema, default: {} },
    profilePhoto: { type: String, default: '' },
    template: { type: String, enum: ['classic', 'modern'], default: 'classic' },
    privacy: { type: privacySchema, default: {} },
    theme: { type: themeSchema, default: {} },
  },
  { _id: false },
)

const biodataVersionSchema = new mongoose.Schema(
  {
    biodataId: { type: mongoose.Schema.Types.ObjectId, ref: 'Biodata', required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    snapshot: { type: snapshotSchema, required: true },
    label: { type: String, default: '' },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)

const BiodataVersion = mongoose.model('BiodataVersion', biodataVersionSchema)

module.exports = { BiodataVersion }

