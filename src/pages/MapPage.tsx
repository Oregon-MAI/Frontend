import Layout from '../components/Layout'
import OfficeMap from '../components/OfficeMap/OfficeMap'
import type { Zone, Desk } from '../types/map'

// ЗАГЛУШКА — заменить на fetch() когда бэкенд готов
// GET /api/v1/floors/11/zones
const MOCK_ZONES: Zone[] = [
  {
    id: 'A',
    name: 'ЗОНА A — РАЗРАБОТКА',
    desks: [
      { id: 'A1',  zone: 'A', zoneName: 'Разработка', status: 'free',  amenities: ['Wi-Fi', 'Монитор'], bookedSlots: [] },
      { id: 'A2',  zone: 'A', zoneName: 'Разработка', status: 'busy',  amenities: [], bookedSlots: ['09:00', '09:15'] },
      { id: 'A3',  zone: 'A', zoneName: 'Разработка', status: 'busy',  amenities: [], bookedSlots: [] },
      { id: 'A4',  zone: 'A', zoneName: 'Разработка', status: 'free',  amenities: ['Wi-Fi'], bookedSlots: [] },
      { id: 'A6',  zone: 'A', zoneName: 'Разработка', status: 'free',  amenities: ['Wi-Fi', 'Монитор'], bookedSlots: [] },
      { id: 'A8',  zone: 'A', zoneName: 'Разработка', status: 'busy',  amenities: [], bookedSlots: [] },
      { id: 'A11', zone: 'A', zoneName: 'Разработка', status: 'free',  amenities: ['Wi-Fi'], bookedSlots: [] },
      { id: 'A15', zone: 'A', zoneName: 'Разработка', status: 'free',  amenities: ['Wi-Fi', 'Монитор'], bookedSlots: [] },
      { id: 'A17', zone: 'A', zoneName: 'Разработка', status: 'busy',  amenities: [], bookedSlots: [] },
    ],
  },
  {
    id: 'B',
    name: 'ЗОНА B — АНАЛИТИКА',
    desks: [
      { id: 'B3',  zone: 'B', zoneName: 'Аналитика', status: 'free',  amenities: ['Wi-Fi'], bookedSlots: [] },
      { id: 'B5',  zone: 'B', zoneName: 'Аналитика', status: 'free',  amenities: ['Wi-Fi', 'Монитор'], bookedSlots: [] },
      { id: 'B7',  zone: 'B', zoneName: 'Аналитика', status: 'mine',  amenities: ['Wi-Fi', 'Монитор', 'Клавиатура', 'Мышь'], bookedSlots: [] },
      { id: 'B13', zone: 'B', zoneName: 'Аналитика', status: 'busy',  amenities: [], bookedSlots: [] },
      { id: 'B15', zone: 'B', zoneName: 'Аналитика', status: 'free',  amenities: ['Wi-Fi'], bookedSlots: [] },
      { id: 'B17', zone: 'B', zoneName: 'Аналитика', status: 'busy',  amenities: [], bookedSlots: [] },
      { id: 'B20', zone: 'B', zoneName: 'Аналитика', status: 'free',  amenities: ['Wi-Fi', 'Монитор'], bookedSlots: [] },
      { id: 'B2`', zone: 'B', zoneName: 'Аналитика', status: 'free',  amenities: ['Wi-Fi', 'Монитор'], bookedSlots: [] },

    ],
  },
  {
    id: 'C',
    name: 'ЗОНА C — ПРОДУКТ',
    desks: [
      { id: 'C1',  zone: 'C', zoneName: 'Продукт', status: 'free',  amenities: ['Wi-Fi'], bookedSlots: [] },
      { id: 'C4',  zone: 'C', zoneName: 'Продукт', status: 'free',  amenities: ['Wi-Fi', 'Монитор'], bookedSlots: [] },
      { id: 'C6',  zone: 'C', zoneName: 'Продукт', status: 'busy',  amenities: [], bookedSlots: [] },
      { id: 'C7',  zone: 'C', zoneName: 'Продукт', status: 'free',  amenities: ['Wi-Fi'], bookedSlots: [] },
      { id: 'C13', zone: 'C', zoneName: 'Продукт', status: 'busy',  amenities: [], bookedSlots: [] },
      { id: 'C15', zone: 'C', zoneName: 'Продукт', status: 'free',  amenities: ['Wi-Fi', 'Монитор'], bookedSlots: [] },
      { id: 'C18', zone: 'C', zoneName: 'Продукт', status: 'free',  amenities: ['Wi-Fi'], bookedSlots: [] },
    ],
  },
  {
    id: 'D',
    name: 'ЗОНА D — ТИХАЯ ЗОНА',
    desks: [
      { id: 'D2',  zone: 'D', zoneName: 'Тихая зона', status: 'free',  amenities: ['Wi-Fi', 'Монитор'], bookedSlots: [] },
      { id: 'D4',  zone: 'D', zoneName: 'Тихая зона', status: 'busy',  amenities: [], bookedSlots: [] },
      { id: 'D5',  zone: 'D', zoneName: 'Тихая зона', status: 'free',  amenities: ['Wi-Fi'], bookedSlots: [] },
      { id: 'D7',  zone: 'D', zoneName: 'Тихая зона', status: 'free',  amenities: ['Wi-Fi', 'Монитор'], bookedSlots: [] },
      { id: 'D11', zone: 'D', zoneName: 'Тихая зона', status: 'busy',  amenities: [], bookedSlots: [] },
      { id: 'D13', zone: 'D', zoneName: 'Тихая зона', status: 'free',  amenities: ['Wi-Fi'], bookedSlots: [] },
      { id: 'D16', zone: 'D', zoneName: 'Тихая зона', status: 'free',  amenities: ['Wi-Fi', 'Монитор'], bookedSlots: [] },
      { id: 'D18', zone: 'D', zoneName: 'Тихая зона', status: 'busy',  amenities: [], bookedSlots: [] },
    ],
  },
]

export default function MapPage() {
  function handleDeskClick(desk: Desk) {
    console.log('Клик на место:', desk.id)
    // TODO: открыть панель бронирования
  }

  return (
    <Layout>
      <OfficeMap zones={MOCK_ZONES} onDeskClick={handleDeskClick} />
    </Layout>
  )
}
