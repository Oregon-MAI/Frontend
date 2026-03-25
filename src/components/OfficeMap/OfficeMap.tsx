import type { Zone, Desk } from '../../types/map'
import styles from './OfficeMap.module.css'

// ── Стол зоны A (горизонт + сиденья сверху) ──────────────────────────────────
function DeskA({ desk, onClick }: { desk: Desk; onClick: (d: Desk) => void }) {
  const isBusy = desk.status === 'busy'
  const isMine = desk.status === 'mine'

  const fill = isBusy ? '#F3F5F9' : isMine ? '#1A56DB' : '#fff'
  const stroke = isBusy ? '#E5E7EB' : isMine ? '#1245B5' : '#E5E7EB'
  const textColor = isMine ? '#fff' : '#374151'
  const circleColor = isMine ? '#F97316' : '#D1D5DB'

  return (
    <svg
      width="44" height="44"
      viewBox="0 0 72 72"
      style={{ cursor: isBusy ? 'default' : 'pointer' }}
      onClick={() => !isBusy && onClick(desk)}
    >
      {/* Стол */}
      <rect x="2" y="2" width="68" height="68" rx="10"
        fill={fill} stroke={stroke} strokeWidth="1.5" />

      {/* Если занят — круг внутри */}
      {isBusy && (
        <circle cx="36" cy="36" r="14" fill={circleColor} />
      )}

      {/* Если моё место — оранжевый круг */}
      {isMine && (
        <circle cx="36" cy="36" r="14" fill="#F97316" />
      )}

      {/* ID */}
      {!isBusy && !isMine && (
        <text x="36" y="36"
          textAnchor="middle" dominantBaseline="middle"
          fontSize="11" fontWeight="700"
          fontFamily="Plus Jakarta Sans, sans-serif"
          fill={textColor}>
          {desk.id}
        </text>
      )}
    </svg>
  )
}

function DeskD({ desk, onClick }: { desk: Desk; onClick: (d: Desk) => void }) {
  const isBusy = desk.status === 'busy'
  const isMine = desk.status === 'mine'

  const tableColor = isBusy ? '#E8EBF2' : isMine ? '#1A56DB' : '#fff'
  const tableBorder = isBusy ? '#D1D5DB' : isMine ? '#1245B5' : '#E5E7EB'
  const chairColor = isBusy ? '#D1D5DB' : isMine ? '#D97706' : '#9CA3AF'
  const textColor = isMine ? '#fff' : isBusy ? 'transparent' : '#374151'

  return (
    <svg
      width="54" height="36"
      viewBox="0 0 80 56"
      style={{ cursor: isBusy ? 'default' : 'pointer', overflow: 'visible' }}
      onClick={() => !isBusy && onClick(desk)}
    >
      {/* Стул — полукруг СНИЗУ стола (обрезанной стороной вверх к столу) */}
      <path
        d="M 24 52 A 16 16 0 0 0 56 52"
        fill={chairColor}
      />

      {/* Стол */}
      <rect
        x="2" y="2"
        width="76" height="44"
        rx="8"
        fill={tableColor}
        stroke={tableBorder}
        strokeWidth="1.5"
      />

      {/* ID по центру стола */}
      <text
        x="40" y="24"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="11"
        fontWeight="700"
        fontFamily="Plus Jakarta Sans, sans-serif"
        fill={textColor}
      >
        {desk.id}
      </text>
    </svg>
  )
}

function DeskDTop({ desk, onClick }: { desk: Desk; onClick: (d: Desk) => void }) {
  const isBusy = desk.status === 'busy'
  const isMine = desk.status === 'mine'

  const tableColor = isBusy ? '#E8EBF2' : isMine ? '#1A56DB' : '#fff'
  const tableBorder = isBusy ? '#D1D5DB' : isMine ? '#1245B5' : '#E5E7EB'
  const chairColor = isBusy ? '#D1D5DB' : isMine ? '#D97706' : '#9CA3AF'
  const textColor = isMine ? '#fff' : isBusy ? 'transparent' : '#374151'

  return (
    <svg
      width="54" height="36"
      viewBox="0 0 80 56"
      style={{ cursor: isBusy ? 'default' : 'pointer', overflow: 'visible' }}
      onClick={() => !isBusy && onClick(desk)}
    >
      {/* Стул — полукруг СВЕРХУ (обрезанной стороной вниз к столу) */}
      <path
        d="M 24 4 A 16 16 0 0 1 56 4"
        fill={chairColor}
      />

      {/* Стол */}
      <rect
        x="2" y="10"
        width="76" height="44"
        rx="8"
        fill={tableColor}
        stroke={tableBorder}
        strokeWidth="1.5"
      />

      {/* ID */}
      <text
        x="40" y="32"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="11"
        fontWeight="700"
        fontFamily="Plus Jakarta Sans, sans-serif"
        fill={textColor}
      >
        {desk.id}
      </text>
    </svg>
  )
}

function ZoneD({ zone, onDeskClick }: { zone: Zone; onDeskClick: (d: Desk) => void }) {
  const blocks = chunkArray(zone.desks, 6)
  return (
    <div className={styles.zoneD}>
      <div className={styles.zoneLabel}>{zone.name}</div>
      <div className={styles.zoneDGrid}>
        {blocks.map((block, bi) => (
          <div key={bi} className={styles.blockD}>
            {/* Верхний ряд — стул сверху */}
            <div className={styles.blockDRow}>
              {block.slice(0, 3).map(desk =>
                <DeskDTop key={desk.id} desk={desk} onClick={onDeskClick} />
              )}
            </div>
            {/* Нижний ряд — стул снизу */}
            <div className={styles.blockDRow}>
              {block.slice(3, 6).map(desk =>
                <DeskD key={desk.id} desk={desk} onClick={onDeskClick} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}




// ── Разбить массив на блоки по N ─────────────────────────────────────────────
function chunkArray<T>(arr: T[], size: number): T[][] {
  const result: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size))
  }
  return result
}

// ── Зона A ───────────────────────────────────────────────────────────────────
function ZoneA({ zone, onDeskClick }: { zone: Zone; onDeskClick: (d: Desk) => void }) {
  const blocks = chunkArray(zone.desks, 6)

  return (
    <div className={styles.zoneA}>
      <div className={styles.zoneLabel}>{zone.name}</div>
      <div className={styles.zoneAGrid}>
        {blocks.map((block, bi) => (
          <div key={bi} className={styles.blockA}>
            {block.map(desk => (
              <DeskA key={desk.id} desk={desk} onClick={onDeskClick} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}


function BlockB({ desks, onClick }: {
  desks: Desk[]
  onClick: (d: Desk) => void
}) {
  const [tl, tr, bl, br] = desks

  function getColors(desk: Desk | undefined) {
    if (!desk) return { fill: '#F3F5F9', stroke: '#E5E7EB', text: '#374151' }
    if (desk.status === 'busy') return { fill: '#E8EBF2', stroke: '#D1D5DB', text: 'transparent' }
    if (desk.status === 'mine') return { fill: '#1A56DB', stroke: '#1245B5', text: '#fff' }
    return { fill: '#fff', stroke: '#E5E7EB', text: '#374151' }
  }

  function chairColor(desk: Desk | undefined) {
    if (!desk || desk.status === 'busy') return '#D1D5DB'
    if (desk.status === 'mine') return '#93C5FD'
    return '#9CA3AF'
  }

  const W = 60   // размер стола
  const G = 4    // зазор между столами
  const C = 18   // размер выреза
  const CR = 9   // радиус кресла
  const S = W * 2 + G

  const x1 = 0,     y1 = 0      // TL
  const x2 = W + G, y2 = 0      // TR
  const x3 = 0,     y3 = W + G  // BL
  const x4 = W + G, y4 = W + G  // BR

  const ctl = getColors(tl)
  const ctr = getColors(tr)
  const cbl = getColors(bl)
  const cbr = getColors(br)

  // TL — L-форма, вырез в правом нижнем углу (смотрит к центру блока)
  const pathTL = `
    M ${x1} ${y1}
    H ${x1 + W}
    V ${y1 + W - C}
    Q ${x1 + W} ${y1 + W} ${x1 + W - C} ${y1 + W}
    H ${x1}
    Z
  `

  // TR — L-форма, вырез в левом нижнем углу
  const pathTR = `
    M ${x2} ${y2}
    H ${x2 + W}
    V ${y2 + W}
    H ${x2 + C}
    Q ${x2} ${y2 + W} ${x2} ${y2 + W - C}
    V ${y2}
    Z
  `

  // BL — L-форма, вырез в правом верхнем углу
  const pathBL = `
    M ${x3} ${y3}
    H ${x3 + W - C}
    Q ${x3 + W} ${y3} ${x3 + W} ${y3 + C}
    V ${y3 + W}
    H ${x3}
    Z
  `

  // BR — L-форма, вырез в левом верхнем углу
  const pathBR = `
    M ${x4 + C} ${y4}
    H ${x4 + W}
    V ${y4 + W}
    H ${x4}
    V ${y4 + C}
    Q ${x4} ${y4} ${x4 + C} ${y4}
    Z
  `

  return (
    <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`} style={{ overflow: 'visible' }}>

      {/* ── Столы ── */}
      <path d={pathTL} fill={ctl.fill} stroke={ctl.stroke} strokeWidth="1.5"
        style={{ cursor: tl?.status === 'busy' ? 'default' : 'pointer' }}
        onClick={() => tl && tl.status !== 'busy' && onClick(tl)} />
      <text x={x1 + W * 0.4} y={y1 + W * 0.5}
        textAnchor="middle" dominantBaseline="middle"
        fontSize="10" fontWeight="700" fill={ctl.text}
        fontFamily="Plus Jakarta Sans, sans-serif"
        style={{ pointerEvents: 'none' }}>
        {tl?.status !== 'busy' ? tl?.id : ''}
      </text>

      <path d={pathTR} fill={ctr.fill} stroke={ctr.stroke} strokeWidth="1.5"
        style={{ cursor: tr?.status === 'busy' ? 'default' : 'pointer' }}
        onClick={() => tr && tr.status !== 'busy' && onClick(tr)} />
      <text x={x2 + W * 0.6} y={y2 + W * 0.5}
        textAnchor="middle" dominantBaseline="middle"
        fontSize="10" fontWeight="700" fill={ctr.text}
        fontFamily="Plus Jakarta Sans, sans-serif"
        style={{ pointerEvents: 'none' }}>
        {tr?.status !== 'busy' ? tr?.id : ''}
      </text>

      <path d={pathBL} fill={cbl.fill} stroke={cbl.stroke} strokeWidth="1.5"
        style={{ cursor: bl?.status === 'busy' ? 'default' : 'pointer' }}
        onClick={() => bl && bl.status !== 'busy' && onClick(bl)} />
      <text x={x3 + W * 0.4} y={y3 + W * 0.6}
        textAnchor="middle" dominantBaseline="middle"
        fontSize="10" fontWeight="700" fill={cbl.text}
        fontFamily="Plus Jakarta Sans, sans-serif"
        style={{ pointerEvents: 'none' }}>
        {bl?.status !== 'busy' ? bl?.id : ''}
      </text>

      <path d={pathBR} fill={cbr.fill} stroke={cbr.stroke} strokeWidth="1.5"
        style={{ cursor: br?.status === 'busy' ? 'default' : 'pointer' }}
        onClick={() => br && br.status !== 'busy' && onClick(br)} />
      <text x={x4 + W * 0.6} y={y4 + W * 0.6}
        textAnchor="middle" dominantBaseline="middle"
        fontSize="10" fontWeight="700" fill={cbr.text}
        fontFamily="Plus Jakarta Sans, sans-serif"
        style={{ pointerEvents: 'none' }}>
        {br?.status !== 'busy' ? br?.id : ''}
      </text>

      {/* ── Кресла в вырезах (смотрят к центру блока) ── */}
      {/* TL — кресло в правом нижнем вырезе */}
      <circle cx={x1 + W - C/2} cy={y1 + W - C/2} r={CR} fill={chairColor(tl)} />
      {/* TR — кресло в левом нижнем вырезе */}
      <circle cx={x2 + C/2} cy={y2 + W - C/2} r={CR} fill={chairColor(tr)} />
      {/* BL — кресло в правом верхнем вырезе */}
      <circle cx={x3 + W - C/2} cy={y3 + C/2} r={CR} fill={chairColor(bl)} />
      {/* BR — кресло в левом верхнем вырезе */}
      <circle cx={x4 + C/2} cy={y4 + C/2} r={CR} fill={chairColor(br)} />

    </svg>
  )
}
function ZoneB({ zone, onDeskClick }: { zone: Zone; onDeskClick: (d: Desk) => void }) {
  const blocks = chunkArray(zone.desks, 4)

  return (
    <div className={styles.zoneB}>
      <div className={styles.zoneLabel}>{zone.name}</div>
      <div className={styles.zoneBGrid}>
        {blocks.map((block, bi) => (
          <BlockB key={bi} desks={block} onClick={onDeskClick} />
        ))}
      </div>
    </div>
  )
}

// ── Главный компонент ────────────────────────────────────────────────────────
interface Props {
  zones: Zone[]
  onDeskClick: (desk: Desk) => void
}

export default function OfficeMap({ zones, onDeskClick }: Props) {
  const zoneA = zones.find(z => z.id === 'A')
  const zoneB = zones.find(z => z.id === 'B')
  const zoneD = zones.find(z => z.id === 'D')

  return (
    <div className={styles.map}>
      <div className={styles.left}>
        {zoneA && <ZoneA zone={zoneA} onDeskClick={onDeskClick} />}
      </div>
      <div className={styles.right}>
        {zoneD && <ZoneD zone={zoneD} onDeskClick={onDeskClick} />}
        {zoneB && <ZoneB zone={zoneB} onDeskClick={onDeskClick} />}
      </div>
    </div>
  )
}