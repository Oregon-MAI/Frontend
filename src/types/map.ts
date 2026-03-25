export interface Desk {
  id: string
  zone: 'A' | 'B' | 'D'
  status: 'free' | 'busy' | 'mine'
  amenities: string[]
  bookedSlots: string[]
}

export interface Zone {
  id: 'A' | 'B' | 'D'
  name: string
  desks: Desk[]
}

export interface Booking {
  id: string
  resourceId: string
  resourceName: string
  timeFrom: string
  timeTo: string
  date: string
}