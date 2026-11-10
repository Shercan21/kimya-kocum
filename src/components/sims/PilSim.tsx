import { useState } from 'react'
import { daire, sayi, useAnimasyon, yazi } from './cizim'
import { Deger, Gorev, Not, Secenekler } from './ortak'

// Galvanik hücre (pil): iki metal ve tuz köprüsü. Elektronlar aktif metalden diğerine akar.
// Standart indirgenme potansiyelleri (V): Mg −2,37; Zn −0,76; Fe −0,44; Pb −0,13; Cu +0,34; Ag +0,80

const METALLER = [
  { s: 'Mg', E: -2.37, iyon: 'Mg²⁺', renk: '#c8ccd0' },
  { s: 'Zn', E: -0.76, iyon: 'Zn²⁺', renk: '#9aa0a6' },
  { s: 'Fe', E: -0.44, iyon: 'Fe²⁺', renk: '#8a8f96' },
  { s: 'Pb', E: -0.13, iyon: 'Pb²⁺', renk: '#6b6f75' },
  { s: 'Cu', E: 0.34, iyon: 'Cu²⁺', renk: '#b5651d' },
  { s: 'Ag', E: 0.8, iyon: 'Ag⁺', renk: '#e0e0e0' },
]

export default function PilSim() {
  const [sol, setSol] = useState('Zn')
  const [sag, setSag] = useState('Cu')
  const [kopru, setKopru] = useState(true)
  const a = METALLER.find(m => m.s === sol)!
  const b = METALLER.find(m => m.s === sag)!
  const anot = a.E < b.E ? a : b
  const katot = anot === a ? b : a
  const V = kopru && a !== b ? katot.E - anot.E : 0

  const canvas = useAnimasyon((ctx, W, H, _dt, t) => {
    const bw = Math.min(110, W * 0.32)
    const bh = H * 0.5
    const by = H - bh - 10
    const x1 = 20
    const x2 = W - 20 - bw
    const kap = (x: number, m: typeof a) => {
      ctx.fillStyle = m.s === 'Cu' ? 'rgba(60,140,230,.4)' : 'rgba(180,210,240,.35)'
      ctx.fillRect(x, by + 14, bw, bh - 14)
      ctx.strokeStyle = '#26215c'
      ctx.lineWidth = 2
      ctx.strokeRect(x, by, bw, bh)
      ctx.fillStyle = m.renk
      ctx.fillRect(x + bw / 2 - 8, by - 30, 16, bh - 10)
      ctx.strokeRect(x + bw / 2 - 8, by - 30, 16, bh - 10)
      yazi(ctx, m.s, x + bw / 2, by - 40, { boyut: 13, kalin: true })
      yazi(ctx, `${m.iyon} çözeltisi`, x + bw / 2, by + bh - 10, { boyut: 9 })
    }
    kap(x1, a)
    kap(x2, b)
    // tuz köprüsü
    if (kopru) {
      ctx.strokeStyle = '#d3d1c7'
      ctx.lineWidth = 12
      ctx.beginPath()
      ctx.moveTo(x1 + bw - 20, by + 30)
      ctx.lineTo(x1 + bw - 20, by - 10)
      ctx.lineTo(x2 + 20, by - 10)
      ctx.lineTo(x2 + 20, by + 30)
      ctx.stroke()
      yazi(ctx, 'tuz köprüsü (KNO₃)', W / 2, by - 22, { boyut: 9 })
    }
    // dış devre ve voltmetre
    const tel = 34
    ctx.strokeStyle = '#26215c'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(x1 + bw / 2, by - 30)
    ctx.lineTo(x1 + bw / 2, tel)
    ctx.lineTo(x2 + bw / 2, tel)
    ctx.lineTo(x2 + bw / 2, by - 30)
    ctx.stroke()
    ctx.fillStyle = '#fff'
    ctx.beginPath()
    ctx.arc(W / 2, tel, 20, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    yazi(ctx, `${sayi(V, 2)} V`, W / 2, tel, { boyut: 11, kalin: true, renk: V > 0 ? '#1d9e75' : '#6b6a7a' })
    // elektron akışı
    if (V > 0) {
      const xa = anot === a ? x1 + bw / 2 : x2 + bw / 2
      const xk = anot === a ? x2 + bw / 2 : x1 + bw / 2
      for (let i = 0; i < 6; i++) {
        const f = ((t * 0.4 + i / 6) % 1)
        let x: number
        let y: number
        if (f < 0.2) { x = xa; y = by - 30 - (by - 30 - tel) * (f / 0.2) }
        else if (f < 0.8) { x = xa + (xk - xa) * ((f - 0.2) / 0.6); y = tel }
        else { x = xk; y = tel + (by - 30 - tel) * ((f - 0.8) / 0.2) }
        daire(ctx, x, y, 4, '#378add')
        yazi(ctx, 'e⁻', x, y - 9, { boyut: 8, renk: '#185fa5' })
      }
    }
  })

  return (
    <div className="sim">
      <Gorev>İki metal seç ve pili kur. Voltmetre ne gösteriyor? Elektronlar hangi metalden hangisine akıyor? Tuz köprüsünü kaldırınca ne oluyor?</Gorev>
      <div className="sim-secim">
        <label>Sol elektrot
          <select value={sol} onChange={e => setSol(e.target.value)}>{METALLER.map(m => <option key={m.s} value={m.s}>{m.s}</option>)}</select>
        </label>
        <label>Sağ elektrot
          <select value={sag} onChange={e => setSag(e.target.value)}>{METALLER.map(m => <option key={m.s} value={m.s}>{m.s}</option>)}</select>
        </label>
      </div>
      <canvas ref={canvas} className="sim-canvas uzun" aria-label="Galvanik hücre animasyonu" />
      <Secenekler secenekler={[{ id: 'var', ad: 'Tuz köprüsü takılı' }, { id: 'yok', ad: 'Tuz köprüsü yok' }]} secili={kopru ? 'var' : 'yok'} onSec={v => setKopru(v === 'var')} />
      <div className="sim-degerler">
        <Deger ad="Gerilim" deger={`${sayi(V, 2)} V`} vurgu />
        <Deger ad="Anot (yükseltgenir)" deger={V > 0 ? `${anot.s} → ${anot.iyon} + e⁻` : '—'} />
        <Deger ad="Katot (indirgenir)" deger={V > 0 ? `${katot.iyon} + e⁻ → ${katot.s}` : '—'} />
      </div>
      <Not>Konuyu genişleten deney: indirgenme–yükseltgenme tepkimelerinde elektron aktarımının dış devreden geçirilmesiyle elektrik üretilir. Gerilimler 25 °C ve 1 M çözeltiler içindir.</Not>
    </div>
  )
}
