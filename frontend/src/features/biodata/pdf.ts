import html2pdf from 'html2pdf.js'

type PdfOptions = {
  margin?: number | number[]
  filename?: string
  image?: { type?: 'png' | 'jpeg' | 'webp'; quality?: number }
  html2canvas?: {
    scale?: number
    useCORS?: boolean
    backgroundColor?: string
  }
  jsPDF?: { unit?: string; format?: string; orientation?: string }
}

type PdfWorker = {
  set: (options: PdfOptions) => PdfWorker
  from: (src: HTMLElement | string) => PdfWorker
  save: (filename?: string) => Promise<unknown> | PdfWorker
  output: (type: string) => Promise<Blob>
}

type Html2PdfFn = (source?: HTMLElement | string, options?: PdfOptions) => PdfWorker

import { API_ORIGIN } from '@/app/api/http'

export async function downloadElementAsPdf(args: {
  element: HTMLElement
  filename: string
  watermarkText?: string
  password?: string
}) {
  const html2pdfFn = html2pdf as unknown as Html2PdfFn

  const opt: PdfOptions = {
    margin: 0,
    filename: args.filename,
    image: { type: 'jpeg', quality: 1.0 },
    html2canvas: {
      scale: 4, // good balance of quality & size
      useCORS: true,
      backgroundColor: '#ffffff'
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  }

  let target: HTMLElement = args.element
  let cleanup: (() => void) | undefined

  if (args.watermarkText) {
    const wrapper = document.createElement('div')
    wrapper.style.position = 'relative'
    wrapper.style.backgroundColor = '#ffffff'
    wrapper.style.padding = '16px'
    wrapper.style.display = 'inline-block'

    const clone = args.element.cloneNode(true) as HTMLElement
    wrapper.appendChild(clone)

    const createWatermark = (top: string, opacity = '0.08') => {
      const overlay = document.createElement('div')
      overlay.textContent = args.watermarkText!
      overlay.style.position = 'absolute'
      overlay.style.left = '0'
      overlay.style.right = '0'
      overlay.style.top = top
      overlay.style.display = 'flex'
      overlay.style.alignItems = 'center'
      overlay.style.justifyContent = 'center'
      overlay.style.fontSize = '48px'
      overlay.style.fontWeight = '700'
      overlay.style.color = '#000000'
      overlay.style.opacity = opacity
      overlay.style.pointerEvents = 'none'
      overlay.style.transform = 'rotate(-30deg)'
      overlay.style.whiteSpace = 'nowrap'
      overlay.style.zIndex = '50'
      return overlay
    }

    wrapper.appendChild(createWatermark('20%'))
    wrapper.appendChild(createWatermark('50%', '0.12'))
    wrapper.appendChild(createWatermark('80%'))

    document.body.appendChild(wrapper)

    target = wrapper
    cleanup = () => document.body.removeChild(wrapper)
  }

  try {
    if (args.password) {
      const pdfBlob = await html2pdfFn().set(opt).from(target).output('blob')

      const formData = new FormData()
      formData.append('pdf', pdfBlob, args.filename)
      formData.append('password', args.password)

      const res = await fetch(`${API_ORIGIN}/api/pdf/encrypt`, {
        method: 'POST',
        body: formData
      })

      if (!res.ok) throw new Error('Failed to encrypt PDF')

      const encryptedBlob = await res.blob()
      const url = URL.createObjectURL(encryptedBlob)

      const a = document.createElement('a')
      a.href = url
      a.download = args.filename
      document.body.appendChild(a)
      a.click()
      a.remove()

      URL.revokeObjectURL(url)
    } else {
      await html2pdfFn().set(opt).from(target).save()
    }
  } finally {
    if (cleanup) cleanup()
  }
}