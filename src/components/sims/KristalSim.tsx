import { useRef, useState } from 'react'
import { useAnimasyon } from './cizim'
import { Deger, Gorev, Not, Secenekler } from './ortak'

// Kristal örgüler: NaCl (iyonik), elmas ve grafit (kovalent ağ), buz (moleküler), metal (metalik).
// Parmakla sürükleyerek üç boyutlu döndür.

type Tur = 'nacl' | 'elmas' | 'grafit' | 'buz' | 'metal'
type Atom = { x: number; y: number; z: number; renk: string; r: number }
type Yapi = { atomlar: Atom[]; baglar: [number, number][] }

function nacl(): Yapi {
  const atomlar: Atom[] = []
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) for (let k = 0; k < 3; k++) {
    const na = (i + j + k) % 2 === 0
    atomlar.push({ x: i - 1, y: j - 1, z: k - 1, renk: na ? '#7f77dd' : '#1d9e75', r: na ? 0.22 : 0.34 })
  }
  return { atomlar, baglar: komsular(atomlar, 1.01) }
}
function elmas(): Yapi {
  const t: [number, number, number][] = []
  const fcc = [[0, 0, 0], [0, 0.5, 0.5], [0.5, 0, 0.5], [0.5, 0.5, 0]]
  for (const [a, b, c] of fcc) { t.push([a, b, c]); t.push([a + 0.25, b + 0.25, c + 0.25]) }
  for (const [a, b, c] of [[1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 1, 0], [1, 0, 1], [0, 1, 1], [1, 1, 1], [1, 0.5, 0.5], [0.5, 1, 0.5], [0.5, 0.5, 1]]) t.push([a, b, c])
  const atomlar = t.map(([x, y, z]) => ({ x: (x - 0.5) * 2.4, y: (y - 0.5) * 2.4, z: (z - 0.5) * 2.4, renk: '#5f5e5a', r: 0.16 }))
  return { atomlar, baglar: komsular(atomlar, 1.05) }
}
function grafit(): Yapi {
  const atomlar: Atom[] = []
  for (let k = 0; k < 2; k++) for (let i = -2; i <= 2; i++) for (let j = -1; j <= 1; j++) {
    const x = i * 0.87 + (j % 2 ? 0.435 : 0)
    const y = j * 0.75
    atomlar.push({ x: x, y: k * 1.4 - 0.7, z: y, renk: '#3d3d3a', r: 0.13 })
    atomlar.push({ x: x, y: k * 1.4 - 0.7, z: y + 0.5, renk: '#3d3d3a', r: 0.13 })
  }
  return { atomlar, baglar: komsular(atomlar, 0.56).filter(([a, b]) => atomlar[a].y === atomlar[b].y) }
}
function buz(): Yapi {
  const atomlar: Atom[] = []
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2
    atomlar.push({ x: Math.cos(a), y: (i % 2 ? 0.25 : -0.25), z: Math.sin(a), renk: '#e24b4a', r: 0.18 })
    atomlar.push({ x: Math.cos(a) * 1.0, y: (i % 2 ? 0.25 : -0.25) + 0.9, z: Math.sin(a) * 1.0, renk: '#e24b4a', r: 0.18 })
  }
  const baglar = komsular(atomlar, 1.05)
  return { atomlar, baglar }
}
function metal(): Yapi {
  const atomlar: Atom[] = []
  for (const [a, b, c] of [[0, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 1, 0], [1, 0, 1], [0, 1, 1], [1, 1, 1], [0.5, 0.5, 0], [0.5, 0, 0.5], [0, 0.5, 0.5], [0.5, 0.5, 1], [0.5, 1, 0.5], [1, 0.5, 0.5]]) {
    atomlar.push({ x: (a - 0.5) * 2, y: (b - 0.5) * 2, z: (c - 0.5) * 2, renk: '#b4b2a9', r: 0.3 })
  }
  return { atomlar, baglar: [] }
}
function komsular(a: Atom[], d: number): [number, number][] {
  const b: [number, number][] = []
  for (let i = 0; i < a.length; i++) for (let j = i + 1; j < a.length; j++) {
    const m = Math.hypot(a[i].x - a[j].x, a[i].y - a[j].y, a[i].z - a[j].z)
    if (m < d && m > 0.1) b.push([i, j])
  }
  return b
}

const BILGI: Record<Tur, { ad: string; tur: string; etkilesim: string; ozellik: string; yap: () => Yapi }> = {
  nacl: { ad: 'Sodyum klorür (NaCl)', tur: 'İyonik katı', etkilesim: 'İyonik bağ', ozellik: 'Sert, kırılgan, yüksek erime noktası (801 °C); erimiş hâlde iletken', yap: nacl },
  elmas: { ad: 'Elmas (C)', tur: 'Kovalent ağ örgülü', etkilesim: 'Her C dört C\'ye kovalent bağlı', ozellik: 'Bilinen en sert doğal madde, iletken değil', yap: elmas },
  grafit: { ad: 'Grafit (C)', tur: 'Kovalent ağ (katmanlı)', etkilesim: 'Katmanda kovalent, katmanlar arası zayıf', ozellik: 'Yumuşak, kaygan, elektriği iletir', yap: grafit },
  buz: { ad: 'Buz (H₂O)', tur: 'Moleküler katı', etkilesim: 'Hidrojen bağları', ozellik: 'Açık altıgen yapı; sudan az yoğun, suda yüzer', yap: buz },
  metal: { ad: 'Bakır (Cu)', tur: 'Metalik katı', etkilesim: 'Metalik bağ (elektron denizi)', ozellik: 'Dövülebilir, ısıyı ve elektriği iyi iletir', yap: metal },
}

export default function KristalSim() {
  const [tur, setTur] = useState<Tur>('nacl')
  const yapi = BILGI[tur].yap()
  const aci = useRef({ x: 0.5, y: 0.6, surukle: false, sx: 0, sy: 0, oto: true })

  const canvas = useAnimasyon((ctx, W, H, dt) => {
    const a = aci.current
    if (a.oto) a.y += 0.006 * dt
    const cx = W / 2
    const cy = H / 2
    const olcek = Math.min(W, H) * 0.22
    const cosX = Math.cos(a.x), sinX = Math.sin(a.x), cosY = Math.cos(a.y), sinY = Math.sin(a.y)
    const P = yapi.atomlar.map(p => {
      const x1 = p.x * cosY - p.z * sinY
      const z1 = p.x * sinY + p.z * cosY
      const y2 = p.y * cosX - z1 * sinX
      const z2 = p.y * sinX + z1 * cosX
      const per = 4 / (4 + z2)
      return { X: cx + x1 * olcek * per, Y: cy + y2 * olcek * per, z: z2, per, p }
    })
    ctx.strokeStyle = 'rgba(38,33,92,.35)'
    ctx.lineWidth = 2
    for (const [i, j] of yapi.baglar) {
      ctx.beginPath()
      ctx.moveTo(P[i].X, P[i].Y)
      ctx.lineTo(P[j].X, P[j].Y)
      ctx.stroke()
    }
    if (tur === 'metal') {
      for (let k = 0; k < 30; k++) {
        ctx.fillStyle = 'rgba(55,138,221,.7)'
        ctx.beginPath()
        ctx.arc(cx + Math.sin(k * 7 + a.y * 3) * olcek * 1.1, cy + Math.cos(k * 3 + a.y * 2) * olcek * 1.1, 2, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    ;[...P].sort((m, n) => n.z - m.z).forEach(q => {
      const r = q.p.r * olcek * q.per
      const g = ctx.createRadialGradient(q.X - r / 3, q.Y - r / 3, r / 5, q.X, q.Y, r)
      g.addColorStop(0, '#ffffff')
      g.addColorStop(1, q.p.renk)
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(q.X, q.Y, r, 0, Math.PI * 2)
      ctx.fill()
    })
  })

  const b = BILGI[tur]
  return (
    <div className="sim">
      <Gorev>Kristalleri parmağınla döndürerek incele. Örgüdeki tanecikler neler ve onları bir arada tutan etkileşim ne? Elmas ve grafit aynı elementten oluştuğu hâlde özellikleri neden çok farklı?</Gorev>
      <Secenekler secenekler={(Object.keys(BILGI) as Tur[]).map(k => ({ id: k, ad: BILGI[k].ad }))} secili={tur} onSec={setTur} etiket="Katı" />
      <canvas
        ref={canvas}
        className="sim-canvas uzun sim-dondur"
        aria-label={`${b.ad} kristal modeli, döndürülebilir`}
        onPointerDown={e => { const a = aci.current; a.surukle = true; a.oto = false; a.sx = e.clientX; a.sy = e.clientY; e.currentTarget.setPointerCapture(e.pointerId) }}
        onPointerMove={e => { const a = aci.current; if (!a.surukle) return; a.y += (e.clientX - a.sx) * 0.01; a.x += (e.clientY - a.sy) * 0.01; a.sx = e.clientX; a.sy = e.clientY }}
        onPointerUp={() => { aci.current.surukle = false }}
      />
      <div className="sim-degerler">
        <Deger ad="Katı türü" deger={b.tur} vurgu />
        <Deger ad="Tanecikleri tutan" deger={b.etkilesim} />
      </div>
      <p className="sim-sabit"><b>Özellikleri:</b> {b.ozellik}</p>
      <Not>{tur === 'nacl' ? 'Mor küreler Na⁺, yeşil küreler Cl⁻ iyonlarıdır.' : tur === 'buz' ? 'Kırmızı küreler su moleküllerinin O atomlarıdır; çizgiler hidrojen bağlarını gösterir.' : tur === 'metal' ? 'Gri küreler metal katyonları, mavi noktalar serbest elektronlardır.' : 'Gri küreler karbon atomlarıdır; çizgiler kovalent bağlardır.'} Modeller ölçekli değildir.</Not>
    </div>
  )
}
