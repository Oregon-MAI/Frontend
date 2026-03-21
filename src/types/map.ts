export interface Desk {
  id: string
  zone: string
  zoneName: string
  status: 'free' | 'busy' | 'mine'
  amenities: string[]
  bookedSlots: string[]
}

export interface Zone {
  id: string
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
