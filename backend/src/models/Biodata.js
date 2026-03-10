const mongoose = require('mongoose')

const personalDetailsSchema = new mongoose.Schema(
  {
    fullName: String,
    gender: String,
    dateOfBirth: String,
    age: Number,
    height: String,
    religion: String,
    caste: String,
    maritalStatus: String,
    motherTongue: String,
    location: String,
    phone: String,
    email: String,
  },
  { _id: false },
)

const familyDetailsSchema = new mongoose.Schema(
  {
    fatherName: String,
    fatherOccupation: String,
    motherName: String,
    motherOccupation: String,
    brothers: String,
    sisters: String,
    familyType: String,
    familyLocation: String,
  },
  { _id: false },
)

const educationDetailsSchema = new mongoose.Schema(
  {
    highestEducation: String,
    university: String,
    profession: String,
    company: String,
    annualIncome: String,
    workLocation: String,
  },
  { _id: false },
)

const horoscopeSchema = new mongoose.Schema(
  {
    rashi: String,
    nakshatra: String,
    manglik: String,
    timeOfBirth: String,
    placeOfBirth: String,
  },
  { _id: false },
)

const privacySchema = new mongoose.Schema(
  {
    hidePhone: { type: Boolean, default: false },
    hideEmail: { type: Boolean, default: false },
    hideIncome: { type: Boolean, default: false },
  },
  { _id: false },
)

const themeSchema = new mongoose.Schema(
  {
    primaryColor: { type: String, default: '#7c3aed' }, // violet-600
    accentColor: { type: String, default: '#0f172a' }, // slate-900
    fontFamily: { type: String, enum: ['sans', 'serif', 'mono'], default: 'sans' },
  },
  { _id: false },
)

const biodataSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    personalDetails: { type: personalDetailsSchema, default: {} },
    familyDetails: { type: familyDetailsSchema, default: {} },
    educationDetails: { type: educationDetailsSchema, default: {} },
    horoscope: { type: horoscopeSchema, default: {} },
    profilePhoto: { type: String, default: '' },
    template: { type: String, enum: ['classic', 'modern'], default: 'classic' },
    privacy: { type: privacySchema, default: {} },
    theme: { type: themeSchema, default: {} },
  },
  { timestamps: true },
)

const Biodata = mongoose.model('Biodata', biodataSchema)
module.exports = {
  Biodata,
  personalDetailsSchema,
  familyDetailsSchema,
  educationDetailsSchema,
  horoscopeSchema,
  privacySchema,
  themeSchema,
}

