import type { ReactNode } from 'react'

// Sanal deneylerin ortak parçaları: canvas animasyonu, kaydırıcı, grafik, görev kutusu.

export function Gorev({ children }: { children: ReactNode }) {
  return <p className="sim-gorev"><b>Görev:</b> {children}</p>
}

export function Not({ children }: { children: ReactNode }) {
  return <p className="sim-not">{children}</p>
}

export function Kaydirici(props: {
  etiket: ReactNode
  deger: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  disabled?: boolean
}) {
  return (
    <label className={props.disabled ? 'sim-kaydirici is-kilitli' : 'sim-kaydirici'}>
      <span>{props.etiket}</span>
      <input
        type="range"
        min={props.min}
        max={props.max}
        step={props.step}
        value={props.deger}
        disabled={props.disabled}
        onChange={e => props.onChange(Number(e.target.value))}
      />
    </label>
  )
}

export function Secenekler<T extends string>(props: { secenekler: { id: NoInfer<T>; ad: string }[]; secili: T; onSec: (id: NoInfer<T>) => void; etiket?: string }) {
  return (
    <div className="sim-modlar" role="group" aria-label={props.etiket ?? 'Seçenekler'}>
      {props.secenekler.map(s => (
        <button key={s.id} type="button" className={s.id === props.secili ? 'chip is-active' : 'chip'} aria-pressed={s.id === props.secili} onClick={() => props.onSec(s.id)}>
          {s.ad}
        </button>
      ))}
    </div>
  )
}

export type Seri = { ad: string; renk: string; noktalar: [number, number][]; kesikli?: boolean }

// Basit çizgi grafiği (SVG)
export function Grafik(props: {
  seriler: Seri[]
  xEtiket: string
  yEtiket: string
  xMin?: number
  xMax: number
  yMin?: number
  yMax: number
  yukseklik?: number
  dikeyCizgi?: { x: number; etiket: string }
  yatayCizgi?: { y: number; etiket: string }
}) {
  const W = 320
  const H = props.yukseklik ?? 180
  const L = 40
  const B = 30
  const T = 10
  const Rr = 10
  const xMin = props.xMin ?? 0
  const yMin = props.yMin ?? 0
  const X = (x: number) => L + ((x - xMin) / (props.xMax - xMin)) * (W - L - Rr)
  const Y = (y: number) => H - B - ((y - yMin) / (props.yMax - yMin)) * (H - B - T)
  const tik = (min: number, max: number) => [0, 0.25, 0.5, 0.75, 1].map(f => min + (max - min) * f)
  const fmt = (v: number) => (Math.abs(v) >= 100 || Number.isInteger(v) ? String(Math.round(v)) : v.toLocaleString('tr-TR', { maximumFractionDigits: 2 }))
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="sim-grafik" role="img" aria-label={`${props.yEtiket} – ${props.xEtiket} grafiği`}>
      {tik(yMin, props.yMax).map(v => (
        <g key={`y${v}`}>
          <line x1={L} x2={W - Rr} y1={Y(v)} y2={Y(v)} stroke="#eceaf8" />
          <text x={L - 4} y={Y(v) + 3} fontSize="9" textAnchor="end" fill="#6b6a7a">{fmt(v)}</text>
        </g>
      ))}
      {tik(xMin, props.xMax).map(v => (
        <text key={`x${v}`} x={X(v)} y={H - B + 12} fontSize="9" textAnchor="middle" fill="#6b6a7a">{fmt(v)}</text>
      ))}
      <line x1={L} x2={L} y1={T} y2={H - B} stroke="#26215c" />
      <line x1={L} x2={W - Rr} y1={H - B} y2={H - B} stroke="#26215c" />
      <text x={(L + W) / 2} y={H - 4} fontSize="10" textAnchor="middle" fill="#26215c">{props.xEtiket}</text>
      <text x={10} y={(H - B) / 2} fontSize="10" textAnchor="middle" fill="#26215c" transform={`rotate(-90 10 ${(H - B) / 2})`}>{props.yEtiket}</text>
      {props.yatayCizgi && (
        <g>
          <line x1={L} x2={W - Rr} y1={Y(props.yatayCizgi.y)} y2={Y(props.yatayCizgi.y)} stroke="#e8593c" strokeDasharray="4 3" />
          <text x={W - Rr - 2} y={Y(props.yatayCizgi.y) - 3} fontSize="9" textAnchor="end" fill="#993c1d">{props.yatayCizgi.etiket}</text>
        </g>
      )}
      {props.dikeyCizgi && (
        <g>
          <line x1={X(props.dikeyCizgi.x)} x2={X(props.dikeyCizgi.x)} y1={T} y2={H - B} stroke="#e8593c" strokeDasharray="4 3" />
          <text x={X(props.dikeyCizgi.x) + 3} y={T + 9} fontSize="9" fill="#993c1d">{props.dikeyCizgi.etiket}</text>
        </g>
      )}
      {props.seriler.map(s => (
        <polyline
          key={s.ad}
          fill="none"
          stroke={s.renk}
          strokeWidth="2.2"
          strokeDasharray={s.kesikli ? '5 4' : undefined}
          points={s.noktalar.map(([x, y]) => `${X(x).toFixed(1)},${Y(Math.max(yMin, Math.min(props.yMax, y))).toFixed(1)}`).join(' ')}
        />
      ))}
      {props.seriler.length > 1 && props.seriler.map((s, i) => (
        <g key={`l${s.ad}`}>
          <rect x={L + 8 + i * 92} y={T + 2} width="10" height="4" fill={s.renk} />
          <text x={L + 22 + i * 92} y={T + 7} fontSize="9" fill="#26215c">{s.ad}</text>
        </g>
      ))}
    </svg>
  )
}

export function Deger({ ad, deger, vurgu }: { ad: string; deger: ReactNode; vurgu?: boolean }) {
  return (
    <div className={vurgu ? 'sim-deger is-vurgu' : 'sim-deger'}>
      <small>{ad}</small>
      <b>{deger}</b>
    </div>
  )
}
