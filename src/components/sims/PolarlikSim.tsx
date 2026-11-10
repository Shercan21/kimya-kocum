import { useRef, useState } from 'react'
import { daire, useAnimasyon, yazi } from './cizim'
import { Deger, Gorev, Not, Secenekler } from './ortak'

// Lewis yapısı, molekül geometrisi, bağ dipolleri ve molekül polarlığı.
// Elektrik alanı açılınca polar moleküller yönlenir.

type Uc = { s: string; x: number; y: number; ortak: 1 | 2 | 3; ciftler: number }
type Molekul = { id: string; ad: string; merkez: string; merkezCift: number; uclar: Uc[]; polar: boolean; geometri: string; dipol: [number, number]; enMerkez: number; enUc: number }

const r = 46
const MOLEKULLER: Molekul[] = [
  { id: 'H2', ad: 'H₂', merkez: 'H', merkezCift: 0, uclar: [{ s: 'H', x: r, y: 0, ortak: 1, ciftler: 0 }], polar: false, geometri: 'Doğrusal', dipol: [0, 0], enMerkez: 2.2, enUc: 2.2 },
  { id: 'HCl', ad: 'HCl', merkez: 'H', merkezCift: 0, uclar: [{ s: 'Cl', x: r, y: 0, ortak: 1, ciftler: 3 }], polar: true, geometri: 'Doğrusal', dipol: [1, 0], enMerkez: 2.2, enUc: 3.16 },
  { id: 'H2O', ad: 'H₂O', merkez: 'O', merkezCift: 2, uclar: [{ s: 'H', x: -r * 0.8, y: r * 0.6, ortak: 1, ciftler: 0 }, { s: 'H', x: r * 0.8, y: r * 0.6, ortak: 1, ciftler: 0 }], polar: true, geometri: 'Kırık doğru (açısal)', dipol: [0, -1], enMerkez: 3.44, enUc: 2.2 },
  { id: 'CO2', ad: 'CO₂', merkez: 'C', merkezCift: 0, uclar: [{ s: 'O', x: -r, y: 0, ortak: 2, ciftler: 2 }, { s: 'O', x: r, y: 0, ortak: 2, ciftler: 2 }], polar: false, geometri: 'Doğrusal', dipol: [0, 0], enMerkez: 2.55, enUc: 3.44 },
  { id: 'NH3', ad: 'NH₃', merkez: 'N', merkezCift: 1, uclar: [{ s: 'H', x: -r, y: r * 0.55, ortak: 1, ciftler: 0 }, { s: 'H', x: r, y: r * 0.55, ortak: 1, ciftler: 0 }, { s: 'H', x: 0, y: r * 0.9, ortak: 1, ciftler: 0 }], polar: true, geometri: 'Üçgen piramit', dipol: [0, -1], enMerkez: 3.04, enUc: 2.2 },
  { id: 'BF3', ad: 'BF₃', merkez: 'B', merkezCift: 0, uclar: [{ s: 'F', x: 0, y: -r, ortak: 1, ciftler: 3 }, { s: 'F', x: -r * 0.87, y: r * 0.5, ortak: 1, ciftler: 3 }, { s: 'F', x: r * 0.87, y: r * 0.5, ortak: 1, ciftler: 3 }], polar: false, geometri: 'Düzlem üçgen', dipol: [0, 0], enMerkez: 2.04, enUc: 3.98 },
  { id: 'CH4', ad: 'CH₄', merkez: 'C', merkezCift: 0, uclar: [{ s: 'H', x: 0, y: -r, ortak: 1, ciftler: 0 }, { s: 'H', x: 0, y: r, ortak: 1, ciftler: 0 }, { s: 'H', x: -r, y: 0, ortak: 1, ciftler: 0 }, { s: 'H', x: r, y: 0, ortak: 1, ciftler: 0 }], polar: false, geometri: 'Düzgün dörtyüzlü', dipol: [0, 0], enMerkez: 2.55, enUc: 2.2 },
  { id: 'CHCl3', ad: 'CHCl₃', merkez: 'C', merkezCift: 0, uclar: [{ s: 'H', x: 0, y: -r, ortak: 1, ciftler: 0 }, { s: 'Cl', x: 0, y: r, ortak: 1, ciftler: 3 }, { s: 'Cl', x: -r, y: 0, ortak: 1, ciftler: 3 }, { s: 'Cl', x: r, y: 0, ortak: 1, ciftler: 3 }], polar: true, geometri: 'Dörtyüzlü', dipol: [0, 1], enMerkez: 2.55, enUc: 3.16 },
]

function ciftCiz(ctx: CanvasRenderingContext2D, x: number, y: number, aci: number, uzak: number) {
  const px = x + Math.cos(aci) * uzak
  const py = y + Math.sin(aci) * uzak
  const nx = -Math.sin(aci) * 4
  const ny = Math.cos(aci) * 4
  daire(ctx, px + nx, py + ny, 1.8, '#26215c')
  daire(ctx, px - nx, py - ny, 1.8, '#26215c')
}

export default function PolarlikSim() {
  const [id, setId] = useState('H2O')
  const [alan, setAlan] = useState(false)
  const [gorunum, setGorunum] = useState<'lewis' | 'dipol'>('lewis')
  const m = MOLEKULLER.find(x => x.id === id)!
  const yon = useRef<number[]>([0.4, 2.1, 3.7, 5.2, 1.3, 4.6])

  const canvas = useAnimasyon((ctx, W, H, dt, t) => {
    const anaX = W * 0.32
    const cy = H / 2
    // ana molekül
    const ciz = (cx: number, cy2: number, aci: number, olcek: number, detay: boolean) => {
      const cos = Math.cos(aci)
      const sin = Math.sin(aci)
      const P = (x: number, y: number): [number, number] => [cx + (x * cos - y * sin) * olcek, cy2 + (x * sin + y * cos) * olcek]
      for (const u of m.uclar) {
        const [ux, uy] = P(u.x, u.y)
        ctx.strokeStyle = '#26215c'
        ctx.lineWidth = 2 * olcek
        for (let k = 0; k < u.ortak; k++) {
          const off = (k - (u.ortak - 1) / 2) * 5 * olcek
          const nx = -(uy - cy2) / Math.hypot(ux - cx, uy - cy2)
          const ny = (ux - cx) / Math.hypot(ux - cx, uy - cy2)
          ctx.beginPath()
          ctx.moveTo(cx + nx * off, cy2 + ny * off)
          ctx.lineTo(ux + nx * off, uy + ny * off)
          ctx.stroke()
        }
      }
      for (const u of m.uclar) {
        const [ux, uy] = P(u.x, u.y)
        daire(ctx, ux, uy, 13 * olcek, u.s === 'H' ? '#f1efe8' : u.s === 'O' ? '#f7c1c1' : u.s === 'F' || u.s === 'Cl' ? '#c0dd97' : '#cecbf6')
        yazi(ctx, u.s, ux, uy, { boyut: 11 * olcek, kalin: true })
        if (detay && gorunum === 'lewis') {
          const dis = Math.atan2(uy - cy2, ux - cx)
          for (let k = 0; k < u.ciftler; k++) ciftCiz(ctx, ux, uy, dis + (k - (u.ciftler - 1) / 2) * 1.3, 18)
        }
        if (detay && gorunum === 'dipol' && m.enMerkez !== m.enUc) {
          // bağ dipolü: + uçtan − uca ok
          const yonIc = m.enUc > m.enMerkez ? 1 : -1
          const [sx, sy] = yonIc > 0 ? [cx, cy2] : [ux, uy]
          const [ex, ey] = yonIc > 0 ? [ux, uy] : [cx, cy2]
          const ax = sx + (ex - sx) * 0.25
          const ay = sy + (ey - sy) * 0.25
          const bx = sx + (ex - sx) * 0.75
          const by = sy + (ey - sy) * 0.75
          ctx.strokeStyle = '#e8593c'
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(ax, ay - 8)
          ctx.lineTo(bx, by - 8)
          ctx.stroke()
          const a2 = Math.atan2(by - ay, bx - ax)
          ctx.beginPath()
          ctx.moveTo(bx, by - 8)
          ctx.lineTo(bx - Math.cos(a2 - 0.5) * 7, by - 8 - Math.sin(a2 - 0.5) * 7)
          ctx.moveTo(bx, by - 8)
          ctx.lineTo(bx - Math.cos(a2 + 0.5) * 7, by - 8 - Math.sin(a2 + 0.5) * 7)
          ctx.stroke()
        }
      }
      daire(ctx, cx, cy2, 15 * olcek, m.merkez === 'O' ? '#f7c1c1' : m.merkez === 'N' ? '#b5d4f4' : m.merkez === 'H' ? '#f1efe8' : '#d3d1c7')
      yazi(ctx, m.merkez, cx, cy2, { boyut: 12 * olcek, kalin: true })
      if (detay && gorunum === 'lewis') {
        const bos = [-Math.PI / 2, -Math.PI / 2 - 0.9, -Math.PI / 2 + 0.9]
        for (let k = 0; k < m.merkezCift; k++) ciftCiz(ctx, cx, cy2, m.merkezCift === 1 ? -Math.PI / 2 : bos[k + 1], 22)
      }
    }
    ciz(anaX, cy, 0, 1, true)
    // sağda elektrik alanındaki küçük moleküller
    const sx = W * 0.62
    const sw = W - sx - 10
    ctx.fillStyle = alan ? 'rgba(232,89,60,.12)' : 'rgba(0,0,0,.03)'
    ctx.fillRect(sx, 8, sw, H - 16)
    if (alan) {
      yazi(ctx, '+', sx + 8, H / 2, { boyut: 16, kalin: true, renk: '#993c1d' })
      yazi(ctx, '−', sx + sw - 8, H / 2, { boyut: 18, kalin: true, renk: '#185fa5' })
    }
    yon.current.forEach((a, i) => {
      const hedef = m.polar && alan ? Math.atan2(-m.dipol[1], -m.dipol[0]) + Math.PI : a + 0.01 * dt
      const yeni = m.polar && alan ? a + (hedef - a) * 0.05 * dt + Math.sin(t * 3 + i) * 0.02 : a + 0.015 * dt * (i % 2 ? 1 : -1)
      yon.current[i] = yeni
      ciz(sx + sw * 0.3 + (i % 2) * sw * 0.4, 36 + Math.floor(i / 2) * ((H - 60) / 2), yeni, 0.42, false)
    })
  })

  const lewisYazi = gorunum === 'lewis' ? 'Lewis yapısı' : 'Bağ dipolleri'

  return (
    <div className="sim">
      <Gorev>Molekülleri incele: Lewis yapısında ortaklanmış ve ortaklanmamış elektron çiftlerini say. Bağ dipolleri birbirini yok ediyor mu? Elektrik alanını aç: hangi moleküller yönleniyor?</Gorev>
      <Secenekler secenekler={MOLEKULLER.map(x => ({ id: x.id, ad: x.ad }))} secili={id} onSec={setId} etiket="Molekül" />
      <Secenekler secenekler={[{ id: 'lewis', ad: 'Lewis yapısı' }, { id: 'dipol', ad: 'Bağ dipolleri' }]} secili={gorunum} onSec={setGorunum} etiket="Görünüm" />
      <canvas ref={canvas} className="sim-canvas" aria-label={`${m.ad} molekülü, ${lewisYazi}`} />
      <label className="sim-onay"><input type="checkbox" checked={alan} onChange={e => setAlan(e.target.checked)} /> Elektrik alanını aç</label>
      <div className="sim-degerler">
        <Deger ad="Geometri" deger={m.geometri} />
        <Deger ad="Merkez atomda ortaklanmamış çift" deger={m.merkezCift} />
        <Deger ad="Molekül" deger={m.polar ? 'Polar' : 'Apolar'} vurgu />
      </div>
      <Not>Çizimler iki boyutludur; NH₃, CH₄ ve CHCl₃ gerçekte üç boyutludur. Bağlar polar olsa bile simetrik moleküllerde (CO₂, BF₃, CH₄) bağ dipolleri birbirini yok eder ve molekül apolar olur.</Not>
    </div>
  )
}
