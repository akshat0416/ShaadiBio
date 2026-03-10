export type PersonalDetails = {
  fullName: string
  gender: string
  dateOfBirth: string
  age: number | null
  height: string
  religion: string
  caste: string
  maritalStatus: string
  motherTongue: string
  location: string
  phone: string
  email: string
}

export type FamilyDetails = {
  fatherName: string
  fatherOccupation: string
  motherName: string
  motherOccupation: string
  brothers: string
  sisters: string
  familyType: string
  familyLocation: string
}

export type EducationDetails = {
  highestEducation: string
  university: string
  profession: string
  company: string
  annualIncome: string
  workLocation: string
}

export type HoroscopeDetails = {
  rashi: string
  nakshatra: string
  manglik: string
  timeOfBirth: string
  placeOfBirth: string
}

export type TemplateId = 'classic' | 'modern'

export type PrivacySettings = {
  hidePhone: boolean
  hideEmail: boolean
  hideIncome: boolean
}

export type ThemeSettings = {
  primaryColor: string
  accentColor: string
  fontFamily: 'sans' | 'serif' | 'mono'
}

export type BiodataPayload = {
  personalDetails: PersonalDetails
  familyDetails: FamilyDetails
  educationDetails: EducationDetails
  horoscope: HoroscopeDetails
  template: TemplateId
  profilePhoto?: string
  privacy: PrivacySettings
  theme: ThemeSettings
}

export type BiodataDoc = BiodataPayload & {
  _id: string
  userId: string
  createdAt: string
  updatedAt: string
  profilePhoto: string
}

export const emptyBiodata = (): BiodataPayload => ({
  personalDetails: {
    fullName: '',
    gender: '',
    dateOfBirth: '',
    age: null,
    height: '',
    religion: '',
    caste: '',
    maritalStatus: '',
    motherTongue: '',
    location: '',
    phone: '',
    email: '',
  },
  familyDetails: {
    fatherName: '',
    fatherOccupation: '',
    motherName: '',
    motherOccupation: '',
    brothers: '',
    sisters: '',
    familyType: '',
    familyLocation: '',
  },
  educationDetails: {
    highestEducation: '',
    university: '',
    profession: '',
    company: '',
    annualIncome: '',
    workLocation: '',
  },
  horoscope: {
    rashi: '',
    nakshatra: '',
    manglik: '',
    timeOfBirth: '',
    placeOfBirth: '',
  },
  template: 'classic',
  profilePhoto: '',
  privacy: {
    hidePhone: false,
    hideEmail: false,
    hideIncome: false,
  },
  theme: {
    primaryColor: '#7c3aed',
    accentColor: '#0f172a',
    fontFamily: 'sans',
  },
})

