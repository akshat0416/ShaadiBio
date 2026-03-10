import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye } from 'lucide-react'
import toast from 'react-hot-toast'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { TemplateRenderer } from '@/features/biodata/templates/TemplateRenderer'
import { emptyBiodata, type TemplateId } from '@/features/biodata/types'

export function TemplatesPage() {
  const [preview, setPreview] = useState<TemplateId | null>(null)

  const sample = useMemo(() => {
    const d = emptyBiodata()
    d.personalDetails.fullName = 'Rahul Sharma'
    d.personalDetails.gender = 'Male'
    d.personalDetails.location = 'Pune, Maharashtra'
    d.personalDetails.phone = '+91 99999 00000'
    d.personalDetails.email = 'rahul@example.com'
    d.personalDetails.age = 26
    d.educationDetails.highestEducation = 'B.Tech'
    d.educationDetails.profession = 'Software Engineer'
    d.familyDetails.fatherName = 'Mahesh Sharma'
    d.familyDetails.motherName = 'Sunita Sharma'
    return d
  }, [])

  return (
    <AppShell>
      <div>
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Biodata Templates</h1>
            <p className="mt-1 text-sm text-slate-600">Choose a template for your marriage biodata.</p>
          </div>
          <Link to="/app/create">
            <Button>Create Biodata</Button>
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Card className="p-5">
            <div className="text-sm font-semibold text-slate-900">Classic Biodata</div>
            <p className="mt-1 text-sm text-slate-600">Traditional table-style layout with a timeless, formal look.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                onClick={() => {
                  localStorage.setItem('shaadibio_default_template', 'classic')
                  toast.success('Classic template selected')
                }}
              >
                Use Template
              </Button>
              <Button variant="secondary" onClick={() => setPreview('classic')}>
                <Eye className="h-4 w-4" /> Preview
              </Button>
            </div>
          </Card>

          <Card className="p-5">
            <div className="text-sm font-semibold text-slate-900">Modern Biodata</div>
            <p className="mt-1 text-sm text-slate-600">Clean card layout with profile photo on the side.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                onClick={() => {
                  localStorage.setItem('shaadibio_default_template', 'modern')
                  toast.success('Modern template selected')
                }}
              >
                Use Template
              </Button>
              <Button variant="secondary" onClick={() => setPreview('modern')}>
                <Eye className="h-4 w-4" /> Preview
              </Button>
            </div>
          </Card>
        </div>

        <Modal title="Template Preview" isOpen={!!preview} onClose={() => setPreview(null)}>
          {preview ? (
            <div className="overflow-auto rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
              <div className="mx-auto w-fit bg-white">
                <TemplateRenderer template={preview} data={{ ...sample, template: preview }} />
              </div>
            </div>
          ) : null}
        </Modal>
      </div>
    </AppShell>
  )
}

