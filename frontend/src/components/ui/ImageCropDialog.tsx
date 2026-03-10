import { useState } from 'react'
import Cropper, { type Area } from 'react-easy-crop'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'

type Props = {
  isOpen: boolean
  imageUrl: string | null
  onClose: () => void
  onCropped: (file: File, previewUrl: string) => void
}

async function getCroppedImage(imageSrc: string, crop: Area): Promise<Blob> {
  const image = new Image()
  image.src = imageSrc
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve()
    image.onerror = (e) => reject(e)
  })

  const canvas = document.createElement('canvas')
  canvas.width = crop.width
  canvas.height = crop.height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas context not available')

  const scaleX = image.naturalWidth / image.width
  const scaleY = image.naturalHeight / image.height

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height,
  )

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Canvas is empty'))
          return
        }
        resolve(blob)
      },
      'image/jpeg',
      1.0,
    )
  })
}

export function ImageCropDialog({ isOpen, imageUrl, onClose, onCropped }: Props) {
  const [zoom, setZoom] = useState(1)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  if (!isOpen || !imageUrl) return null

  return (
    <Modal title="Adjust profile photo" isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div className="relative h-64 w-full overflow-hidden rounded-xl bg-slate-900/80">
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={3 / 4}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, areaPixels) => setCroppedAreaPixels(areaPixels)}
          />
        </div>
        <div className="flex items-center justify-between gap-3">
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            disabled={isSaving || !croppedAreaPixels}
            onClick={async () => {
              if (!croppedAreaPixels) return
              setIsSaving(true)
              try {
                const blob = await getCroppedImage(imageUrl, croppedAreaPixels)
                const file = new File([blob], 'profile-photo.jpg', { type: 'image/jpeg' })
                const previewUrl = URL.createObjectURL(blob)
                onCropped(file, previewUrl)
                onClose()
              } finally {
                setIsSaving(false)
              }
            }}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

