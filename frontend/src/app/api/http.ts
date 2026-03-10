import axios from 'axios'

export const API_ORIGIN =
  import.meta.env.VITE_API_URL?.toString().replace(/\/+$/, '') ||
  'http://localhost:5000'

export const http = axios.create({
  baseURL: `${API_ORIGIN}/api`,
})

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('shaadibio_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

