export interface Room {
  id: number
  title: string
  description: string
  price: number
  capacity: number
  bedType: string
  images: string[]
  bookings?: Booking[]
}

export interface Booking {
  id?: number
  roomId: number
  startDate: string
  endDate: string
  guests: number
  contactName: string
  contactEmail: string
}

export interface RoomFilters {
  maxPrice: number | null
  capacity: number | null
  bedType: string
}