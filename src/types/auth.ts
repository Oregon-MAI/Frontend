export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  user: {
    uuid: string
    name: string
    surname: string
    email: string
    role: 'USER' | 'ADMIN'
  }
}
