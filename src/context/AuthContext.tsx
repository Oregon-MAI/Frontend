import { createContext, useContext, useState, useEffect } from 'react'
import type { Booking } from '../types/map'

interface User {
  name: string
  surname: string
  login: string
  role: 'USER' | 'ADMIN'
}

interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
  bookings: Booking[]
  setBookings: (bookings: Booking[]) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) return

    // ЗАГЛУШКА — заменить на GET /auth/me + GET /bookings/my когда бэкенд готов
    setUser({
      name: 'Алексей',
      surname: 'Иванов',
      email: 'ivanov@t1.ru',
      role: 'USER',
    })
    setBookings([
      {
        id: '1',
        resourceId: 'B-07',
        resourceName: 'Место B-07',
        timeFrom: '09:00',
        timeTo: '18:00',
        date: '2026-03-20',
      },
      {
        id: '2',
        resourceId: 'zaryadye',
        resourceName: 'Зарядье',
        timeFrom: '14:00',
        timeTo: '16:00',
        date: '2026-03-20',
      },
    ])
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, bookings, setBookings }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
