import axios from 'axios'

export function getErrorMessage(err: unknown, fallback: string) {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data
    if (data && typeof data === 'object' && 'message' in data) {
      const maybe = (data as { message?: unknown }).message
      if (typeof maybe === 'string' && maybe.trim()) return maybe
    }
    if (typeof err.message === 'string' && err.message.trim()) return err.message
    return fallback
  }
  if (err instanceof Error) return err.message || fallback
  return fallback
}

