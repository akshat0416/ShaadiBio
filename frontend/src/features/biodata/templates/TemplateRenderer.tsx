import type { BiodataPayload, TemplateId } from '@/features/biodata/types'
import { TemplateClassic } from '@/features/biodata/templates/TemplateClassic'
import { TemplateModern } from '@/features/biodata/templates/TemplateModern'

export function TemplateRenderer({
  template,
  data,
  photoUrl,
}: {
  template: TemplateId
  data: BiodataPayload
  photoUrl?: string
}) {
  if (template === 'modern') return <TemplateModern data={data} photoUrl={photoUrl} />
  return <TemplateClassic data={data} photoUrl={photoUrl} />
}

