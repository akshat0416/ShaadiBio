import type { CSSProperties } from 'react'
import type { BiodataPayload } from '@/features/biodata/types'

function Item({ label, value }: { label: string; value?: string | number | null }) {
  if (!value) return null
  return (
    <div className="flex gap-2">
      <div className="w-40 shrink-0 text-xs font-semibold text-slate-500">{label}</div>
      <div className="text-sm text-slate-900">{value}</div>
    </div>
  )
}

export function TemplateModern({ data, photoUrl }: { data: BiodataPayload; photoUrl?: string }) {
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
      <div className="flex items-start gap-6">
        <div className="flex-1">
          <div
            className="text-xs font-semibold uppercase tracking-wide text-violet-700"
            style={{ color: data.theme?.primaryColor }}
          >
            Marriage Biodata
          </div>
          <div className="mt-1 text-3xl font-semibold tracking-tight">{p.fullName || 'Your Name'}</div>
          <div className="mt-2 text-sm text-slate-600">
            {p.location ? <span>{p.location}</span> : null}
            {p.location && (!privacy.hidePhone && p.phone || (!privacy.hideEmail && p.email)) ? (
              <span className="mx-2">•</span>
            ) : null}
            {!privacy.hidePhone && p.phone ? <span>{p.phone}</span> : null}
            {!privacy.hidePhone && p.phone && !privacy.hideEmail && p.email ? (
              <span className="mx-2">•</span>
            ) : null}
            {!privacy.hideEmail && p.email ? <span>{p.email}</span> : null}
          </div>
        </div>

        <div className="shrink-0">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt="Profile"
              className="h-56 w-44 rounded-2xl object-contain ring-1 ring-slate-200"
            />
          ) : (
            <div className="grid h-56 w-44 place-items-center rounded-2xl bg-slate-50 text-slate-400 ring-1 ring-slate-200">
              Photo
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Personal</div>
          <div className="mt-3 grid gap-2">
            <Item label="Gender" value={p.gender} />
            <Item label="DOB" value={p.dateOfBirth} />
            <Item label="Age" value={p.age ?? null} />
            <Item label="Height" value={p.height} />
            <Item label="Religion" value={p.religion} />
            <Item label="Caste" value={p.caste} />
            <Item label="Marital Status" value={p.maritalStatus} />
            <Item label="Mother Tongue" value={p.motherTongue} />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Family</div>
            <div className="mt-3 grid gap-2">
              <Item label="Father" value={f.fatherName} />
              <Item label="Father Occupation" value={f.fatherOccupation} />
              <Item label="Mother" value={f.motherName} />
              <Item label="Mother Occupation" value={f.motherOccupation} />
              <Item label="Brothers" value={f.brothers} />
              <Item label="Sisters" value={f.sisters} />
              <Item label="Family Type" value={f.familyType} />
              <Item label="Family Location" value={f.familyLocation} />
            </div>
          </div>

          <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Education & Work
            </div>
            <div className="mt-3 grid gap-2">
              <Item label="Education" value={e.highestEducation} />
              <Item label="University" value={e.university} />
              <Item label="Profession" value={e.profession} />
              <Item label="Company" value={e.company} />
              <Item label="Annual Income" value={privacy.hideIncome ? null : e.annualIncome} />
              <Item label="Work Location" value={e.workLocation} />
            </div>
          </div>
        </div>

        {(h.rashi || h.nakshatra || h.manglik || h.timeOfBirth || h.placeOfBirth) && (
          <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Horoscope (Optional)</div>
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              <Item label="Rashi" value={h.rashi} />
              <Item label="Nakshatra" value={h.nakshatra} />
              <Item label="Manglik" value={h.manglik} />
              <Item label="Time of Birth" value={h.timeOfBirth} />
              <Item label="Place of Birth" value={h.placeOfBirth} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

