import Layout from '../components/Layout'
import OfficeMap from '../components/OfficeMap/OfficeMap'
import type { Zone, Desk } from '../types/map'
import styles from './MapPage.module.css'
import { useState } from 'react'
import BookingPanel from '../components/BookingPanel/BookingPanel'



// ЗАГЛУШКА — заменить на fetch() когда бэкенд готов
// GET /api/v1/floors/11/zones
const MOCK_ZONES: Zone[] = [
  {
    id: 'A',
    name: 'Зона A',
    desks: [
      { id: 'A1',  zone: 'A', status: 'free',  amenities: ['Wi-Fi', 'Монитор'], bookedSlots: [] },
      { id: 'A2',  zone: 'A', status: 'busy',  amenities: [], bookedSlots: [] },
      { id: 'A3',  zone: 'A', status: 'busy',  amenities: [], bookedSlots: [] },
      { id: 'A4',  zone: 'A', status: 'free',  amenities: ['Wi-Fi'], bookedSlots: [] },
      { id: 'A5',  zone: 'A', status: 'busy',  amenities: [], bookedSlots: [] },
      { id: 'A6',  zone: 'A', status: 'free',  amenities: ['Wi-Fi', 'Монитор'], bookedSlots: [] },
      { id: 'A7',  zone: 'A', status: 'free',  amenities: ['Wi-Fi'], bookedSlots: [] },
      { id: 'A8',  zone: 'A', status: 'busy',  amenities: [], bookedSlots: [] },
      { id: 'A9',  zone: 'A', status: 'free',  amenities: ['Wi-Fi', 'Монитор'], bookedSlots: [] },
      { id: 'A10', zone: 'A', status: 'busy',  amenities: [], bookedSlots: [] },
      { id: 'A11', zone: 'A', status: 'free',  amenities: ['Wi-Fi'], bookedSlots: [] },
      { id: 'A12', zone: 'A', status: 'mine',  amenities: ['Wi-Fi', 'Монитор', 'Клавиатура'], bookedSlots: [] },
      { id: 'A13',  zone: 'A', status: 'free',  amenities: ['Wi-Fi', 'Монитор'], bookedSlots: [] },
      { id: 'A14',  zone: 'A', status: 'busy',  amenities: [], bookedSlots: [] },
      { id: 'A15',  zone: 'A', status: 'busy',  amenities: [], bookedSlots: [] },
      { id: 'A16',  zone: 'A', status: 'free',  amenities: ['Wi-Fi'], bookedSlots: [] },
      { id: 'A17',  zone: 'A', status: 'busy',  amenities: [], bookedSlots: [] },
      { id: 'A18',  zone: 'A', status: 'free',  amenities: ['Wi-Fi', 'Монитор'], bookedSlots: [] },
      { id: 'A19',  zone: 'A', status: 'free',  amenities: ['Wi-Fi'], bookedSlots: [] },
      { id: 'A20',  zone: 'A', status: 'busy',  amenities: [], bookedSlots: [] },
      { id: 'A21',  zone: 'A', status: 'free',  amenities: ['Wi-Fi', 'Монитор'], bookedSlots: [] },
      { id: 'A22',  zone: 'A', status: 'free',  amenities: ['Wi-Fi'], bookedSlots: [] },
      { id: 'A23',  zone: 'A', status: 'busy',  amenities: [], bookedSlots: [] },
      { id: 'A24',  zone: 'A', status: 'mine',  amenities: ['Wi-Fi', 'Монитор', 'Клавиатура'], bookedSlots: [] },
    ],
  },
  {
    id: 'D',
    name: 'Зона D',
    desks: [
      { id: 'D1', zone: 'D', status: 'free',  amenities: ['Wi-Fi'], bookedSlots: [] },
      { id: 'D2', zone: 'D', status: 'busy',  amenities: [], bookedSlots: [] },
      { id: 'D3', zone: 'D', status: 'free',  amenities: ['Wi-Fi', 'Монитор'], bookedSlots: [] },
      { id: 'D4', zone: 'D', status: 'free',  amenities: ['Wi-Fi'], bookedSlots: [] },
      { id: 'D5', zone: 'D', status: 'mine',  amenities: ['Wi-Fi', 'Монитор'], bookedSlots: [] },
      { id: 'D6', zone: 'D', status: 'busy',  amenities: [], bookedSlots: [] },
      { id: 'D7', zone: 'D', status: 'free',  amenities: ['Wi-Fi'], bookedSlots: [] },
      { id: 'D8', zone: 'D', status: 'busy',  amenities: [], bookedSlots: [] },
      { id: 'D9', zone: 'D', status: 'free',  amenities: ['Wi-Fi', 'Монитор'], bookedSlots: [] },
      { id: 'D10', zone: 'D', status: 'free', amenities: ['Wi-Fi'], bookedSlots: [] },
      { id: 'D11', zone: 'D', status: 'busy', amenities: [], bookedSlots: [] },
      { id: 'D12', zone: 'D', status: 'free', amenities: ['Wi-Fi', 'Монитор'], bookedSlots: [] },
      { id: 'D13', zone: 'D', status: 'free',  amenities: ['Wi-Fi'], bookedSlots: [] },
      { id: 'D14', zone: 'D', status: 'busy',  amenities: [], bookedSlots: [] },
      { id: 'D15', zone: 'D', status: 'free',  amenities: ['Wi-Fi', 'Монитор'], bookedSlots: [] },
      { id: 'D16', zone: 'D', status: 'free',  amenities: ['Wi-Fi'], bookedSlots: [] },
      { id: 'D17', zone: 'D', status: 'mine',  amenities: ['Wi-Fi', 'Монитор'], bookedSlots: [] },
      { id: 'D18', zone: 'D', status: 'busy',  amenities: [], bookedSlots: [] },
      { id: 'D19', zone: 'D', status: 'free',  amenities: ['Wi-Fi'], bookedSlots: [] },
      { id: 'D20', zone: 'D', status: 'busy',  amenities: [], bookedSlots: [] },
      { id: 'D21', zone: 'D', status: 'free',  amenities: ['Wi-Fi', 'Монитор'], bookedSlots: [] },
      { id: 'D22', zone: 'D', status: 'free', amenities: ['Wi-Fi'], bookedSlots: [] },
      { id: 'D23', zone: 'D', status: 'busy', amenities: [], bookedSlots: [] },
      { id: 'D24', zone: 'D', status: 'mine', amenities: ['Wi-Fi', 'Монитор'], bookedSlots: [] },
    ],
  },
  {
    id: 'B',
    name: 'Зона B',
    desks: [
      { id: 'B1', zone: 'B', status: 'free',  amenities: ['Wi-Fi'], bookedSlots: [] },
      { id: 'B2', zone: 'B', status: 'busy',  amenities: [], bookedSlots: [] },
      { id: 'B3', zone: 'B', status: 'free',  amenities: ['Wi-Fi', 'Монитор'], bookedSlots: [] },
      { id: 'B4', zone: 'B', status: 'busy',  amenities: [], bookedSlots: [] },
      { id: 'B5', zone: 'B', status: 'free',  amenities: ['Wi-Fi'], bookedSlots: [] },
      { id: 'B6', zone: 'B', status: 'mine',  amenities: ['Wi-Fi', 'Монитор', 'Мышь'], bookedSlots: [] },
      { id: 'B7', zone: 'B', status: 'busy',  amenities: [], bookedSlots: [] },
      { id: 'B8', zone: 'B', status: 'free',  amenities: ['Wi-Fi'], bookedSlots: [] },
    ],
  },
]
export default function MapPage() {
  const [selectedDesk, setSelectedDesk] = useState<Desk | null>(null)

  function handleDeskClick(desk: Desk) {
    setSelectedDesk(desk)
  }
  function IconPin() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  )
}
  return (
  <Layout>
    {/* Заголовок */}
    <div className={styles.pageHeader}>
      <div className={styles.pageHeaderLeft}>
        <h1 className={styles.pageTitle}>Карта офиса</h1>
        <div className={styles.pageLocation}>
          <IconPin />
          БЦ «Арена», 11 этаж
        </div>
      </div>
      <div className={styles.pageHint}>
        Нажмите на стол или переговорную чтобы забронировать
      </div>
    </div>

    {/* Вкладки */}
    <div className={styles.tabs}>
      <button className={`${styles.tab} ${styles.tabActive}`}>Рабочие места</button>
      <button className={styles.tab}>Переговорные</button>
    </div>

    {/* Легенда */}
    <div className={styles.legend}>
      <div className={styles.legendItem}>
        <div className={`${styles.legendDot} ${styles.dotFree}`} />
        Свободно
      </div>
      <div className={styles.legendItem}>
        <div className={`${styles.legendDot} ${styles.dotBusy}`} />
        Занято
      </div>
      <div className={styles.legendItem}>
        <div className={`${styles.legendDot} ${styles.dotMine}`} />
        Моё место
      </div>
      <div className={styles.legendItem}>
        <div className={`${styles.legendDot} ${styles.dotRoom}`} />
        Переговорная
      </div>
    </div>

    <OfficeMap zones={MOCK_ZONES} onDeskClick={handleDeskClick} />
      <BookingPanel
        desk={selectedDesk}
        onClose={() => setSelectedDesk(null)}
      />
    </Layout>
)
}
