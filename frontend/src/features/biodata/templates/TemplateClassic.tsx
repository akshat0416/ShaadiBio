import type { BiodataPayload } from '@/features/biodata/types'
import type { CSSProperties } from 'react'

function Row({ label, value }: { label: string; value?: string | number | null }) {
  if (!value) return null
  return (
    <tr className="border-b border-slate-200">
      <td className="w-40 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700">{label}</td>
      <td className="px-3 py-2 text-sm text-slate-900">{value}</td>
    </tr>
  )
}

export function TemplateClassic({ data, photoUrl }: { data: BiodataPayload; photoUrl?: string }) {
  const p = data.personalDetails
  const f = data.familyDetails
  const e = data.educationDetails
  const h = data.horoscope

  const privacy = data.privacy ?? { hidePhone: false, hideEmail: false, hideIncome: false }

  const fontMap: Record<string, string> = {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    serif: "ui-serif, Georgia, 'Times New Roman', serif",
    mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  }

  const style: CSSProperties = {
    fontFamily: fontMap[data.theme?.fontFamily] || fontMap.sans,
  }

  return (
    <div className="w-[820px] max-w-full bg-white p-6 text-slate-900" style={style}>
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1">
          <div
            className="text-center text-sm font-semibold text-slate-800"
            style={{ color: data.theme?.primaryColor }}
          >
            || श्री गणेशाय नमः ||
          </div>
          <div
            className="mt-2 text-center text-2xl font-semibold tracking-tight"
            style={{ color: data.theme?.accentColor }}
          >
            Marriage Biodata
          </div>
        </div>
        {photoUrl ? (
          <img
            src={photoUrl}
            alt="Profile"
            className="h-48 w-40 rounded-lg object-contain ring-1 ring-slate-200"
          />
        ) : null}
      </div>

      <div className="mt-5 grid gap-5">
        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Personal Details
          </div>
          <table className="w-full border border-slate-200">
            <tbody>
              <Row label="Name" value={p.fullName} />
              <Row label="Gender" value={p.gender} />
              <Row label="DOB" value={p.dateOfBirth} />
              <Row label="Age" value={p.age ?? null} />
              <Row label="Height" value={p.height} />
              <Row label="Religion" value={p.religion} />
              <Row label="Caste" value={p.caste} />
              <Row label="Marital Status" value={p.maritalStatus} />
              <Row label="Mother Tongue" value={p.motherTongue} />
              <Row label="Location" value={p.location} />
              <Row label="Phone" value={privacy.hidePhone ? null : p.phone} />
              <Row label="Email" value={privacy.hideEmail ? null : p.email} />
            </tbody>
          </table>
        </div>

        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Family Details</div>
          <table className="w-full border border-slate-200">
            <tbody>
              <Row label="Father Name" value={f.fatherName} />
              <Row label="Father Occupation" value={f.fatherOccupation} />
              <Row label="Mother Name" value={f.motherName} />
              <Row label="Mother Occupation" value={f.motherOccupation} />
              <Row label="Brothers" value={f.brothers} />
              <Row label="Sisters" value={f.sisters} />
              <Row label="Family Type" value={f.familyType} />
              <Row label="Family Location" value={f.familyLocation} />
            </tbody>
          </table>
        </div>

        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Education & Profession
          </div>
          <table className="w-full border border-slate-200">
            <tbody>
              <Row label="Highest Education" value={e.highestEducation} />
              <Row label="University" value={e.university} />
              <Row label="Profession" value={e.profession} />
              <Row label="Company" value={e.company} />
              <Row label="Annual Income" value={privacy.hideIncome ? null : e.annualIncome} />
              <Row label="Work Location" value={e.workLocation} />
            </tbody>
          </table>
        </div>

        {(h.rashi || h.nakshatra || h.manglik || h.timeOfBirth || h.placeOfBirth) && (
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Horoscope</div>
            <table className="w-full border border-slate-200">
              <tbody>
                <Row label="Rashi" value={h.rashi} />
                <Row label="Nakshatra" value={h.nakshatra} />
                <Row label="Manglik" value={h.manglik} />
                <Row label="Time of Birth" value={h.timeOfBirth} />
                <Row label="Place of Birth" value={h.placeOfBirth} />
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

