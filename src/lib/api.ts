import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

export function apiErrorMessage(error: unknown, fallback = "We couldn't load this page. Please try again.") {
  if (axios.isAxiosError(error)) return error.response?.data?.message ?? fallback
  return fallback
}
