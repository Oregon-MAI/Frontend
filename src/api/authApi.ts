import axios from 'axios'
import type { LoginRequest, LoginResponse } from '../types/auth'

const BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// POST /auth/login
export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/login', payload)
  return data
}
