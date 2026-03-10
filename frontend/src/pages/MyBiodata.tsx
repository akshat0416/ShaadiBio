import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Download, Eye, Pencil, Trash2 } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { API_ORIGIN } from '@/app/api/http'
import { deleteBiodata, listBiodata } from '@/features/biodata/api'
import { downloadElementAsPdf } from '@/features/biodata/pdf'
import { TemplateRenderer } from '@/features/biodata/templates/TemplateRenderer'
import type { BiodataDoc, TemplateId } from '@/features/biodata/types'
import { getErrorMessage } from '@/lib/error'
import { useAuth } from '@/app/auth/AuthContext'

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString()
  } catch {
    return iso
  }
}

export function MyBiodata() {
  const { user } = useAuth()
  const [items, setItems] = useState<BiodataDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [preview, setPreview] = useState<BiodataDoc | null>(null)
  const [protectPdf, setProtectPdf] = useState(false)
  const [pdfPassword, setPdfPassword] = useState('')
  const previewRef = useRef<HTMLDivElement | null>(null)

  const photoUrl = useMemo(() => {
    if (!preview?.profilePhoto) return undefined
    if (preview.profilePhoto.startsWith('http')) return preview.profilePhoto
    return `${API_ORIGIN}${preview.profilePhoto}`
  }, [preview])

  async function refresh() {
    setLoading(true)
    try {
      const data = await listBiodata()
      setItems(data)
    } catch (e: unknown) {
      toast.error(getErrorMessage(e, 'Failed to load biodata'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  return (
    <AppShell>
      <div>
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">My Biodata</h1>
            <p className="mt-1 text-sm text-slate-600">Manage your saved biodata profiles.</p>
          </div>
          <Link to="/app/create">
            <Button>Create New</Button>
          </Link>
        </div>

        <div className="mt-6">
          {loading ? (
            <Card className="p-6">
              <p className="text-sm text-slate-600">Loading...</p>
            </Card>
          ) : items.length === 0 ? (
            <Card className="p-6">
              <p className="text-sm text-slate-600">No biodata yet. Create your first one.</p>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {items.map((b) => (
                <Card key={b._id} className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">
                        {b.personalDetails.fullName || 'Untitled biodata'}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        {b.template === 'modern' ? 'Modern' : 'Classic'} • {fmtDate(b.createdAt)}
                      </div>
                    </div>
                    {b.profilePhoto ? (
                      <img
                        src={b.profilePhoto.startsWith('http') ? b.profilePhoto : `${API_ORIGIN}${b.profilePhoto}`}
                        alt=""
                        className="h-10 w-10 rounded-xl object-cover ring-1 ring-slate-200"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-xl bg-slate-100 ring-1 ring-slate-200" />
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button variant="secondary" size="sm" onClick={() => setPreview(b)}>
                      <Eye className="h-4 w-4" /> Preview
                    </Button>
                    <Link to={`/app/edit/${b._id}`}>
                      <Button variant="secondary" size="sm">
                        <Pencil className="h-4 w-4" /> Edit
                      </Button>
                    </Link>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={async () => {
                        setPreview(b)
                        setTimeout(async () => {
                          if (!previewRef.current) return
                          toast.loading('Generating PDF...', { id: 'pdf' })
                          try {
                            await downloadElementAsPdf({
                              element: previewRef.current,
                              filename: `${(b.personalDetails.fullName || 'biodata').replace(/\s+/g, '_')}.pdf`,
                              watermarkText: !user?.isPremium ? 'Generated using ShaadiBio' : undefined,
                              // In the list view we just download directly without pw prompt.
                              // They can preview it first if they want to add a pw.
                            })
                            toast.success('Downloaded successfully', { id: 'pdf' })
                          } catch (e) {
                            toast.error('Failed to download PDF', { id: 'pdf' })
                          }
                        }, 0)
                      }}
                    >
                      <Download className="h-4 w-4" /> Download
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={async () => {
                        const ok = window.confirm('Delete this biodata?')
                        if (!ok) return
                        try {
                          await deleteBiodata(b._id)
                          toast.success('Deleted')
                          await refresh()
                        } catch (e: unknown) {
                          toast.error(getErrorMessage(e, 'Delete failed'))
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <Modal
          title={preview?.personalDetails.fullName ? `Preview — ${preview.personalDetails.fullName}` : 'Preview'}
          isOpen={!!preview}
          onClose={() => setPreview(null)}
        >
          {preview ? (
            <div className="flex-1 p-6 flex flex-col items-center bg-slate-50">
              <div className="w-full max-w-2xl bg-white p-6 rounded-xl shadow-sm ring-1 ring-slate-200 relative">
                  <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="text-sm font-medium text-slate-500">
                      Template: {preview.template}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {!user?.isPremium && (
                          <Link to="/app/premium">
                            <span className="text-xs text-amber-600 bg-amber-50 px-3 py-1.5 rounded cursor-pointer hover:bg-amber-100 transition">
                              ⭐ Upgrade to Premium for password protection
                            </span>
                          </Link>
                        )}
                        <label className={`flex items-center gap-1.5 cursor-pointer select-none text-sm ${!user?.isPremium ? 'opacity-50 pointer-events-none' : ''}`}>
                          <input
                            type="checkbox"
                            className="rounded border-slate-300 text-violet-600 focus:ring-violet-600 h-3.5 w-3.5"
                            checked={protectPdf}
                            onChange={(e) => user?.isPremium && setProtectPdf(e.target.checked)}
                            disabled={!user?.isPremium}
                          />
                          <span className="text-slate-700 font-medium whitespace-nowrap">Protect PDF</span>
                        </label>
                        {protectPdf && user?.isPremium && (
                          <input
                            type="text"
                            placeholder="Password"
                            className="w-28 rounded border border-slate-300 bg-white px-2 py-1 text-xs focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                            value={pdfPassword}
                            onChange={(e) => setPdfPassword(e.target.value)}
                          />
                        )}
                      </div>
                      <Button
                        size="sm"
                        onClick={async () => {
                          if (protectPdf && !pdfPassword.trim()) {
                            toast.error('Please enter a password')
                            return
                          }
                          if (!previewRef.current) return
                          toast.loading('Generating PDF...', { id: 'pdf2' })
                          try {
                            await downloadElementAsPdf({
                              element: previewRef.current,
                              filename: `${(preview.personalDetails.fullName || 'biodata').replace(/\s+/g, '_')}.pdf`,
                              watermarkText: !user?.isPremium ? 'Generated using ShaadiBio' : undefined,
                              password: (protectPdf && pdfPassword.trim()) ? pdfPassword.trim() : undefined,
                            })
                            toast.success('Downloaded successfully', { id: 'pdf2' })
                          } catch (e) {
                            toast.error('Failed to download PDF', { id: 'pdf2' })
                          }
                        }}
                      >
                        <Download className="mr-2 h-4 w-4" /> Download
                      </Button>
                    </div>
                  </div>

                <div className="overflow-auto bg-white" style={{ minHeight: '60vh' }}>
                  <div ref={previewRef} className="mx-auto w-fit bg-white">
                    <TemplateRenderer
                      template={preview.template as TemplateId}
                      data={preview}
                      photoUrl={photoUrl}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </Modal>
      </div>
    </AppShell>
  )
}

