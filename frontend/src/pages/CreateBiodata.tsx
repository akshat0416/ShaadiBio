import { useEffect, useMemo, useRef, useState, type SelectHTMLAttributes } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Download, Star } from 'lucide-react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { ImageCropDialog } from '@/components/ui/ImageCropDialog'
import { useAuth } from '@/app/auth/AuthContext'
import { createBiodata, listBiodata, updateBiodata } from '@/features/biodata/api'
import { downloadElementAsPdf } from '@/features/biodata/pdf'
import { TemplateRenderer } from '@/features/biodata/templates/TemplateRenderer'
import type {
  PersonalDetails,
  EducationDetails,
  FamilyDetails,
  HoroscopeDetails,
  TemplateId,
  ThemeSettings,
  BiodataPayload,
} from '@/features/biodata/types'
import { emptyBiodata } from '@/features/biodata/types'
import { listBiodataVersions, createBiodataVersion, restoreBiodataVersion } from '@/features/biodata/versionsApi'
import { getErrorMessage } from '@/lib/error'

const steps = [
  { key: 'personal', label: 'Personal' },
  { key: 'family', label: 'Family' },
  { key: 'education', label: 'Education' },
  { key: 'horoscope', label: 'Horoscope' },
  { key: 'photo', label: 'Photo' },
] as const

function calcAge(dobIso: string) {
  const d = new Date(dobIso)
  if (Number.isNaN(d.getTime())) return null
  const now = new Date()
  let age = now.getFullYear() - d.getFullYear()
  const m = now.getMonth() - d.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age -= 1
  return Math.max(0, age)
}

function Label({ children }: { children: string }) {
  return <div className="text-xs font-medium text-slate-700">{children}</div>
}

function Select({
  error,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { error?: string }) {
  return (
    <div className="w-full">
      <select
        className={[
          'h-10 w-full rounded-xl bg-white px-3 text-sm text-slate-900',
          'ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400',
          error ? 'ring-rose-300 focus:ring-rose-400' : '',
        ].join(' ')}
        {...props}
      >
        {children}
      </select>
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </div>
  )
}

export type BiodataFormValues = {
  template: TemplateId
  theme: ThemeSettings
  personalDetails: PersonalDetails & { age: number | null }
  familyDetails: FamilyDetails & { familyType: string; familyValues: string; familyIncome: string; brothers: string; sisters: string }
  educationDetails: EducationDetails & { university: string; company: string; annualIncome: string; workingLocation: string }
  horoscope: HoroscopeDetails & { birthTime: string; birthPlace: string }
  privacy: { hidePhone: boolean; hideEmail: boolean; hideIncome: boolean }
  profilePhoto: string
}

export function CreateBiodata() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token, user } = useAuth()
  const isGuest = !token
  const [step, setStep] = useState(0)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [protectPdf, setProtectPdf] = useState(false)
  const [pdfPassword, setPdfPassword] = useState('')
  const [template, setTemplate] = useState<TemplateId>(() =>
    localStorage.getItem('shaadibio_default_template') === 'modern' ? 'modern' : 'classic',
  )
  const [prefilling, setPrefilling] = useState(false)
  const previewRef = useRef<HTMLDivElement | null>(null)
  const [versionsOpen, setVersionsOpen] = useState(false)
  const [versions, setVersions] = useState<
    { _id: string; createdAt: string; snapshot: BiodataPayload; label?: string }[]
  >([])
  const [cropImageUrl, setCropImageUrl] = useState<string | null>(null)

  const methods = useForm<BiodataFormValues>({
    defaultValues: emptyBiodata() as unknown as BiodataFormValues,
    mode: 'onTouched',
  })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = methods

  const dob = watch('personalDetails.dateOfBirth')
  useEffect(() => {
    const age = dob ? calcAge(dob) : null
    setValue('personalDetails.age', age)
  }, [dob, setValue])

  useEffect(() => {
    setValue('template', template)
  }, [template, setValue])

  const data = watch()

  // Load from local storage or edit
  useEffect(() => {
    async function loadData() {
      if (id) {
        if (isGuest) return
        try {
          const all = await listBiodata()
          const found = all.find((x) => x._id === id)
          if (!found) {
            toast.error('Biodata not found')
            navigate('/app/my', { replace: true })
            return
          }
          const payload: BiodataPayload = {
            personalDetails: found.personalDetails,
            familyDetails: found.familyDetails,
            educationDetails: found.educationDetails,
            horoscope: found.horoscope,
            template: found.template,
            profilePhoto: found.profilePhoto,
            privacy: found.privacy || {
              hidePhone: false,
              hideEmail: false,
              hideIncome: false,
            },
            theme: found.theme || {
              primaryColor: '#7c3aed',
              accentColor: '#0f172a',
              fontFamily: 'sans',
            },
          }
          reset(payload as any)
          setTemplate(found.template as TemplateId)
        } catch (e: unknown) {
          toast.error('Failed to load biodata')
        } finally {
          setPrefilling(false)
        }
      } else {
        const saved = localStorage.getItem('shaadibio_draft')
        if (saved) {
          try {
            const parsed = JSON.parse(saved)
            reset(parsed)
            if (parsed.template) setTemplate(parsed.template)
            if (parsed.profilePhoto) setValue('profilePhoto', parsed.profilePhoto)
          } catch (err) {
            console.error('Failed to parse draft from localStorage', err)
          }
        }
        setPrefilling(false)
      }
    }
    loadData()
  }, [id, isGuest, reset, navigate, setValue])

  // Save to local storage on change
  useEffect(() => {
    if (id) return // Don't auto-save to localstorage if we're editing an existing saved doc
    const subscription = watch((value) => {
      localStorage.setItem('shaadibio_draft', JSON.stringify(value))
    })
    return () => subscription.unsubscribe()
  }, [watch, id])

  const photoUrl = useMemo(() => {
    if (photoFile) return URL.createObjectURL(photoFile)
    return data.profilePhoto || ''
  }, [photoFile, data.profilePhoto])

  useEffect(() => {
    return () => {
      if (photoFile) URL.revokeObjectURL(photoUrl)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photoFile])

  return (
    <AppShell>
      <div>
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">{id ? 'Edit Biodata' : 'Create Biodata'}</h1>
            <p className="mt-1 text-sm text-slate-600">
              {id ? 'Update your saved biodata profile.' : 'Fill in your details step by step.'}
            </p>
            {isGuest && (
              <p className="mt-1 text-xs text-violet-700">
                You are creating biodata in guest mode.{' '}
                <span className="font-semibold">Sign up or log in to save and manage versions.</span>
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex flex-col gap-3 items-end">
              <div className={`flex flex-col gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200 w-72 text-sm mt-3 ${!user?.isPremium ? 'opacity-60' : ''}`}>
                <div className="flex items-center justify-between">
                  <label className={`flex items-center gap-2 cursor-pointer select-none ${!user?.isPremium ? 'pointer-events-none' : ''}`}>
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-violet-600 focus:ring-violet-600"
                      checked={protectPdf}
                      onChange={(e) => user?.isPremium && setProtectPdf(e.target.checked)}
                      disabled={!user?.isPremium}
                    />
                    <span className="text-slate-700 font-medium">Protect PDF with password</span>
                  </label>
                  {!user?.isPremium && (
                    <Link to="/app/premium">
                      <button className="text-xs bg-violet-600 text-white px-2 py-1 rounded hover:bg-violet-700 transition flex items-center gap-1">
                        <Star className="h-3 w-3" /> Upgrade
                      </button>
                    </Link>
                  )}
                </div>
                {protectPdf && user?.isPremium && (
                  <input
                    type="text"
                    placeholder="Enter password"
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                    value={pdfPassword}
                    onChange={(e) => setPdfPassword(e.target.value)}
                  />
                )}
              </div>
              <Button
                variant="secondary"
                disabled={prefilling}
                onClick={async () => {
                  if (protectPdf && !pdfPassword.trim()) {
                    toast.error('Please enter a password')
                    return
                  }
                  if (!previewRef.current) return
                  toast.loading('Generating PDF...', { id: 'pdf3' })
                  try {
                    await downloadElementAsPdf({
                      element: previewRef.current,
                      filename: `${(data.personalDetails.fullName || 'biodata').replace(/\s+/g, '_')}.pdf`,
                      watermarkText: (!user?.isPremium || isGuest) ? 'Generated using ShaadiBio' : undefined,
                      password: (protectPdf && pdfPassword.trim()) ? pdfPassword.trim() : undefined,
                    })
                    toast.success('Downloaded successfully', { id: 'pdf3' })
                  } catch (e) {
                    toast.error('Failed to download PDF', { id: 'pdf3' })
                  }
                }}
                type="button"
              >
                <Download className="mr-2 h-4 w-4" /> Download Biodata
              </Button>
            </div>
            {id && !isGuest && (
              <Button
                type="button"
                variant="secondary"
                onClick={async () => {
                  try {
                    const list = await listBiodataVersions(id)
                    setVersions(list)
                    setVersionsOpen(true)
                  } catch (e) {
                    toast.error(getErrorMessage(e, 'Failed to load versions'))
                  }
                }}
              >
                Version History
              </Button>
            )}
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Card className="p-5 md:p-6">
            <div className="flex flex-wrap items-center gap-2">
              {steps.map((s, idx) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setStep(idx)}
                  className={[
                    'rounded-full px-3 py-1 text-xs font-semibold transition',
                    idx === step ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
                  ].join(' ')}
                >
                  {idx + 1}. {s.label}
                </button>
              ))}
            </div>

            <div className="mt-5">
              <FormProvider {...methods}>
                <form
                  onSubmit={handleSubmit(async (payload) => {
                    try {
                      payload.template = template
                      if (!token) {
                        toast.success('PDF ready. Create an account to save your biodata.')
                        return
                      }
                      const saved = id
                        ? await updateBiodata({ id, payload, profilePhotoFile: photoFile })
                        : await createBiodata({ payload, profilePhotoFile: photoFile })
                      toast.success('Biodata saved')
                      setValue('profilePhoto', saved.profilePhoto || '')
                      setPhotoFile(null)
                    } catch (e: unknown) {
                      toast.error(getErrorMessage(e, 'Failed to save biodata'))
                    }
                  })}
                  className="space-y-6"
                >
                  {step === 0 ? (
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label>Full Name</Label>
                        <Input
                          placeholder="Enter full name"
                          error={errors.personalDetails?.fullName?.message}
                          {...register('personalDetails.fullName', { required: 'Full name is required' })}
                        />
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                          <Label>Gender</Label>
                          <Select
                            error={errors.personalDetails?.gender?.message}
                            {...register('personalDetails.gender', { required: 'Select gender' })}
                            defaultValue=""
                          >
                            <option value="" disabled>
                              Select...
                            </option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </Select>
                        </div>

                        <div className="grid gap-2">
                          <Label>Date of Birth</Label>
                          <Input
                            type="date"
                            error={errors.personalDetails?.dateOfBirth?.message}
                            {...register('personalDetails.dateOfBirth', { required: 'Date of birth is required' })}
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                          <Label>Age (auto calculated)</Label>
                          <Input value={data.personalDetails.age ?? ''} readOnly />
                        </div>
                        <div className="grid gap-2">
                          <Label>Height</Label>
                          <Input placeholder="e.g. 5 ft 8 in" {...register('personalDetails.height')} />
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                          <Label>Religion</Label>
                          <Input placeholder="Religion" {...register('personalDetails.religion')} />
                        </div>
                        <div className="grid gap-2">
                          <Label>Caste</Label>
                          <Input placeholder="Caste" {...register('personalDetails.caste')} />
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                          <Label>Marital Status</Label>
                          <Select {...register('personalDetails.maritalStatus')} defaultValue="">
                            <option value="" disabled>
                              Select...
                            </option>
                            <option value="Never Married">Never Married</option>
                            <option value="Divorced">Divorced</option>
                            <option value="Widowed">Widowed</option>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label>Mother Tongue</Label>
                          <Input placeholder="Mother tongue" {...register('personalDetails.motherTongue')} />
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                          <Label>Location</Label>
                          <Input placeholder="City, State" {...register('personalDetails.location')} />
                        </div>
                        <div className="grid gap-2">
                          <Label>Phone</Label>
                          <Input placeholder="Phone number" {...register('personalDetails.phone')} />
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <Label>Email</Label>
                        <Input placeholder="Email address" type="email" {...register('personalDetails.email')} />
                      </div>
                    </div>
                  ) : null}

                  {step === 1 ? (
                    <div className="grid gap-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                          <Label>Father Name</Label>
                          <Input {...register('familyDetails.fatherName')} />
                        </div>
                        <div className="grid gap-2">
                          <Label>Father Occupation</Label>
                          <Input {...register('familyDetails.fatherOccupation')} />
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                          <Label>Mother Name</Label>
                          <Input {...register('familyDetails.motherName')} />
                        </div>
                        <div className="grid gap-2">
                          <Label>Mother Occupation</Label>
                          <Input {...register('familyDetails.motherOccupation')} />
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                          <Label>Brothers</Label>
                          <Input {...register('familyDetails.brothers')} />
                        </div>
                        <div className="grid gap-2">
                          <Label>Sisters</Label>
                          <Input {...register('familyDetails.sisters')} />
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                          <Label>Family Type</Label>
                          <Input placeholder="Joint/Nuclear" {...register('familyDetails.familyType')} />
                        </div>
                        <div className="grid gap-2">
                          <Label>Family Location</Label>
                          <Input {...register('familyDetails.familyLocation')} />
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {step === 2 ? (
                    <div className="grid gap-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                          <Label>Highest Education</Label>
                          <Input {...register('educationDetails.highestEducation')} />
                        </div>
                        <div className="grid gap-2">
                          <Label>University</Label>
                          <Input {...register('educationDetails.university')} />
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                          <Label>Profession</Label>
                          <Input {...register('educationDetails.profession')} />
                        </div>
                        <div className="grid gap-2">
                          <Label>Company</Label>
                          <Input {...register('educationDetails.company')} />
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                          <Label>Annual Income</Label>
                          <Input {...register('educationDetails.annualIncome')} />
                        </div>
                        <div className="grid gap-2">
                          <Label>Work Location</Label>
                          <Input {...register('educationDetails.workLocation')} />
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {step === 3 ? (
                    <div className="grid gap-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                          <Label>Rashi</Label>
                          <Input {...register('horoscope.rashi')} />
                        </div>
                        <div className="grid gap-2">
                          <Label>Nakshatra</Label>
                          <Input {...register('horoscope.nakshatra')} />
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                          <Label>Manglik</Label>
                          <Select {...register('horoscope.manglik')} defaultValue="">
                            <option value="" disabled>
                              Select...
                            </option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                            <option value="Unknown">Unknown</option>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label>Time of Birth</Label>
                          <Input placeholder="e.g. 07:30 AM" {...register('horoscope.timeOfBirth')} />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label>Place of Birth</Label>
                        <Input {...register('horoscope.placeOfBirth')} />
                      </div>
                    </div>
                  ) : null}

                  {step === 4 ? (
                    <div className="grid gap-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <Button
                          type="button"
                          variant={template === 'classic' ? 'primary' : 'secondary'}
                          onClick={() => {
                            setTemplate('classic')
                            localStorage.setItem('shaadibio_default_template', 'classic')
                          }}
                        >
                          Classic
                        </Button>
                        <Button
                          type="button"
                          variant={template === 'modern' ? 'primary' : 'secondary'}
                          onClick={() => {
                            setTemplate('modern')
                            localStorage.setItem('shaadibio_default_template', 'modern')
                          }}
                        >
                          Modern
                        </Button>
                      </div>

                      <div className="grid gap-2">
                        <Label>Profile Photo Upload</Label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (!file) {
                              setPhotoFile(null)
                              setCropImageUrl(null)
                              return
                            }
                            const url = URL.createObjectURL(file)
                            setCropImageUrl(url)
                          }}
                          className="block w-full text-sm text-slate-700 file:mr-4 file:rounded-xl file:border-0 file:bg-violet-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-violet-700"
                        />
                        <p className="text-xs text-slate-500">PNG/JPG/WebP up to 3MB.</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="h-20 w-20 overflow-hidden rounded-2xl bg-slate-50 ring-1 ring-slate-200">
                          {photoUrl ? (
                            <img src={photoUrl} className="h-full w-full object-cover" alt="Preview" />
                          ) : null}
                        </div>
                        <div className="text-sm text-slate-600">
                          {photoFile ? <div className="font-medium text-slate-900">{photoFile.name}</div> : null}
                          <div>Preview will also appear in the live biodata.</div>
                        </div>
                      </div>

                      <div className="grid gap-3 rounded-xl bg-slate-50 p-3">
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Privacy Controls
                        </div>
                        <label className="flex items-center gap-2 text-xs text-slate-700">
                          <input type="checkbox" className="h-4 w-4" {...register('privacy.hidePhone')} />
                          Hide phone number in biodata
                        </label>
                        <label className="flex items-center gap-2 text-xs text-slate-700">
                          <input type="checkbox" className="h-4 w-4" {...register('privacy.hideEmail')} />
                          Hide email address in biodata
                        </label>
                        <label className="flex items-center gap-2 text-xs text-slate-700">
                          <input type="checkbox" className="h-4 w-4" {...register('privacy.hideIncome')} />
                          Hide annual income in biodata
                        </label>
                      </div>

                      <div className="grid gap-3 rounded-xl bg-slate-50 p-3">
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Template Appearance
                        </div>
                        <div className="grid gap-3 md:grid-cols-3">
                          <div className="grid gap-1">
                            <Label>Primary color</Label>
                            <input
                              type="color"
                              className="h-8 w-full cursor-pointer rounded-lg border border-slate-200 bg-white"
                              {...register('theme.primaryColor')}
                            />
                          </div>
                          <div className="grid gap-1">
                            <Label>Accent color</Label>
                            <input
                              type="color"
                              className="h-8 w-full cursor-pointer rounded-lg border border-slate-200 bg-white"
                              {...register('theme.accentColor')}
                            />
                          </div>
                          <div className="grid gap-1">
                            <Label>Font</Label>
                            <Select {...register('theme.fontFamily')} defaultValue="sans">
                              <option value="sans">Sans</option>
                              <option value="serif">Serif</option>
                              <option value="mono">Mono</option>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  <div className="flex items-center justify-between gap-3">
                    <Button
                      type="button"
                      variant="secondary"
                      disabled={step === 0}
                      onClick={() => setStep((s) => Math.max(0, s - 1))}
                    >
                      Previous
                    </Button>

                    <div className="flex items-center gap-2">
                      {step < steps.length - 1 ? (
                        <Button type="button" onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}>
                          Next
                        </Button>
                      ) : (
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting ? 'Saving...' : id ? 'Update Biodata' : 'Save Biodata'}
                        </Button>
                      )}
                    </div>
                  </div>
                </form>
              </FormProvider>
            </div>
          </Card>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-semibold text-slate-900">Live Preview</div>
              <div className="text-xs text-slate-500">Printable layout</div>
            </div>
            <div className="overflow-auto rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/60">
              <div ref={previewRef} className="mx-auto w-fit">
                <TemplateRenderer template={template} data={data} photoUrl={photoUrl || undefined} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ImageCropDialog
        isOpen={!!cropImageUrl}
        imageUrl={cropImageUrl}
        onClose={() => {
          if (cropImageUrl) URL.revokeObjectURL(cropImageUrl)
          setCropImageUrl(null)
        }}
        onCropped={(file, previewUrl) => {
          if (photoUrl) URL.revokeObjectURL(photoUrl)
          setPhotoFile(file)
          setValue('profilePhoto', previewUrl)
        }}
      />
      {id && !isGuest && (
        <Modal
          title="Version history"
          isOpen={versionsOpen}
          onClose={() => setVersionsOpen(false)}
        >
          <div className="space-y-3 text-xs text-slate-700">
            {versions.length === 0 && <div>No versions saved yet.</div>}
            {versions.map((v) => (
              <div
                key={v._id}
                className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 p-2"
              >
                <div>
                  <div className="font-medium">
                    {v.label || 'Version'} • {new Date(v.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    type="button"
                    onClick={() => {
                      reset(v.snapshot)
                      setTemplate(v.snapshot.template)
                      setPhotoFile(null)
                      setVersionsOpen(false)
                    }}
                  >
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    type="button"
                    onClick={async () => {
                      try {
                        await restoreBiodataVersion({ biodataId: id, versionId: v._id })
                        reset(v.snapshot)
                        setTemplate(v.snapshot.template)
                        setPhotoFile(null)
                        toast.success('Version restored')
                        setVersionsOpen(false)
                      } catch (e) {
                        toast.error(getErrorMessage(e, 'Failed to restore version'))
                      }
                    }}
                  >
                    Restore
                  </Button>
                </div>
              </div>
            ))}
            {id && (
              <Button
                type="button"
                size="sm"
                onClick={async () => {
                  try {
                    await createBiodataVersion({ biodataId: id, payload: data })
                    const list = await listBiodataVersions(id)
                    setVersions(list)
                    toast.success('Version saved')
                  } catch (e) {
                    toast.error(getErrorMessage(e, 'Failed to save version'))
                  }
                }}
              >
                Save Current Version
              </Button>
            )}
          </div>
        </Modal>
      )}
    </AppShell>
  )
}

