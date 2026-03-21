import type { Zone, Desk } from '../../types/map'
import styles from './OfficeMap.module.css'

interface Props {
  zones: Zone[]
  onDeskClick?: (desk: Desk) => void
}

export default function OfficeMap({ zones, onDeskClick }: Props) {
  return (
    <div className={styles.map}>
      {zones.map(zone => (
        <div key={zone.id} className={styles.zone}>
          <div className={styles.zoneLabel}>{zone.name}</div>
          <div className={styles.desksGrid}>
            {zone.desks.map(desk => (
              <div
                key={desk.id}
                className={`${styles.desk} ${styles[desk.status]}`}
                onClick={() => desk.status !== 'busy' && onDeskClick?.(desk)}
              >
                {desk.status !== 'busy' ? desk.id : ''}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
