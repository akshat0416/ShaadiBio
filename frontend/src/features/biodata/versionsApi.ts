import { http } from '@/app/api/http'
import type { BiodataPayload } from '@/features/biodata/types'

export type BiodataVersion = {
  _id: string
  biodataId: string
  userId: string
  snapshot: BiodataPayload
  label?: string
  createdAt: string
}

export async function listBiodataVersions(biodataId: string) {
  const res = await http.get<BiodataVersion[]>(`/biodata/${biodataId}/versions`)
  return res.data
}

export async function createBiodataVersion(args: {
  biodataId: string
  payload: BiodataPayload
  label?: string
}) {
  const res = await http.post<BiodataVersion>(`/biodata/${args.biodataId}/versions`, {
    personalDetails: args.payload.personalDetails,
    familyDetails: args.payload.familyDetails,
    educationDetails: args.payload.educationDetails,
    horoscope: args.payload.horoscope,
    profilePhoto: args.payload.profilePhoto,
    template: args.payload.template,
    privacy: args.payload.privacy,
    theme: args.payload.theme,
    label: args.label,
  })
  return res.data
}

export async function restoreBiodataVersion(args: { biodataId: string; versionId: string }) {
  const res = await http.post(`/biodata/${args.biodataId}/restore`, {
    versionId: args.versionId,
  })
  return res.data
}

