import axios from 'axios'
import type { LoginRequest, LoginResponse } from '../types/auth'

const BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// POST /auth/login
export async function login(payload: LoginRequest): Promise<LoginResponse> {
   if (payload.login && payload.password) {
    return {
      access_token: 'mock-jwt-token',
      refresh_token: 'mock-refresh-token',
      user: {
        uuid: '1',
        name: 'Алексей',
        surname: 'Иванов',
        email: payload.login,
        role: 'USER',
      }
    }
  }
  const { data } = await api.post<LoginResponse>('/auth/login', payload)
  return data
}
