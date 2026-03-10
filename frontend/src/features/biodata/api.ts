import { http } from '@/app/api/http'
import type { BiodataDoc, BiodataPayload } from '@/features/biodata/types'

export async function listBiodata() {
  const res = await http.get<BiodataDoc[]>('/biodata')
  return res.data
}

export async function createBiodata(args: { payload: BiodataPayload; profilePhotoFile?: File | null }) {
  const fd = new FormData()
  fd.append('payload', JSON.stringify(args.payload))
  if (args.profilePhotoFile) fd.append('profilePhoto', args.profilePhotoFile)
  const res = await http.post<BiodataDoc>('/biodata', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
  return res.data
}

export async function updateBiodata(args: {
  id: string
  payload: BiodataPayload
  profilePhotoFile?: File | null
}) {
  const fd = new FormData()
  fd.append('payload', JSON.stringify(args.payload))
  if (args.profilePhotoFile) fd.append('profilePhoto', args.profilePhotoFile)
  const res = await http.put<BiodataDoc>(`/biodata/${args.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
  return res.data
}

export async function deleteBiodata(id: string) {
  const res = await http.delete<{ ok: boolean }>(`/biodata/${id}`)
  return res.data
}

