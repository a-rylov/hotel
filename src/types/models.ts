// Тип номера в отеле
export interface Room {
    id: number
    title: string
    description: string
    price: number // цена за ночь
    capacity: number // количество гостей
    bedType: 'односпальная' | 'двуспальная' | string
    images: string[]
    availableDates: string[] // ISO строки дат (например: '2025-05-01')
}

// Тип бронирования
export interface Booking {
  id?: number // может быть не указан при отправке на сервер
  roomId: number
  startDate: string // ISO дата
  endDate: string
  guests: number
  contactName: string
  contactEmail: string
}

// Тип фильтров, передаваемых с фильтрующей панели
export interface RoomFilters {
  maxPrice: number | null
  capacity: number | null
  bedType: string
}