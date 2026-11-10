import { useState } from 'react'
import { daire, sayi, useAnimasyon, yazi } from './cizim'
import { ELEMENTLER } from './elementler'
import { Deger, Gorev, Not } from './ortak'

// Bağ türü dedektörü: iki atom seç; elektronegatiflik farkına göre metalik, apolar kovalent,
// polar kovalent ya da iyonik bağ oluşumu animasyonu.

const SECENEK = ['H', 'Li', 'Na', 'K', 'Mg', 'Ca', 'Al', 'Fe', 'Cu', 'C', 'N', 'O', 'F', 'Cl', 'Br', 'S', 'P']
const METALLER = new Set(['Li', 'Na', 'K', 'Mg', 'Ca', 'Al', 'Fe', 'Cu'])

export default function BagSim() {
  const [a, setA] = useState('Na')
  const [b, setB] = useState('Cl')
  const [oynat, setOynat] = useState(0)
  const ea = ELEMENTLER.find(e => e.s === a)!
  const eb = ELEMENTLER.find(e => e.s === b)!
  const fark = Math.abs((ea.en ?? 0) - (eb.en ?? 0))
  const ikisiMetal = METALLER.has(a) && METALLER.has(b)
  const tur = ikisiMetal ? 'Metalik bağ' : fark >= 1.7 || (METALLER.has(a) !== METALLER.has(b) && fark > 1.2) ? 'İyonik bağ' : fark < 0.4 ? 'Apolar kovalent bağ' : 'Polar kovalent bağ'
  const negatif = (ea.en ?? 0) >= (eb.en ?? 0) ? ea : eb
  const pozitif = negatif === ea ? eb : ea

  const canvas = useAnimasyon((ctx, W, H, _dt, t) => {
    const ilerleme = Math.min(1, (performance.now() - oynat) / 2500)
    const cy = H / 2
    if (tur === 'Metalik bağ') {
      // katyonlar ve elektron denizi
      for (let i = 0; i < 6; i++) for (let j = 0; j < 3; j++) {
        const x = 40 + i * ((W - 80) / 5)
        const y = cy - 40 + j * 40
        daire(ctx, x, y, 13, (i + j) % 2 ? '#b4b2a9' : '#d3d1c7')
        yazi(ctx, ((i + j) % 2 ? b : a) + '⁺', x, y, { boyut: 9, kalin: true })
      }
      for (let k = 0; k < 40; k++) {
        const x = (k * 53 + t * 40 * (1 + (k % 3))) % W
        const y = cy - 55 + ((k * 31) % 110) + Math.sin(t * 2 + k) * 5
        daire(ctx, x, y, 2.4, '#378add')
      }
      return
    }
    const ayrik = 1 - ilerleme
    const x1 = W / 2 - 50 - ayrik * 40
    const x2 = W / 2 + 50 + ayrik * 40
    const r1 = 26
    const r2 = 26
    if (tur === 'İyonik bağ') {
      // elektron aktarımı
      const px = pozitif === ea ? x1 : x2
      const nx = pozitif === ea ? x2 : x1
      const ex = px + (nx - px) * Math.min(1, ilerleme * 1.4)
      daire(ctx, x1, cy, r1, negatif === ea ? 'rgba(29,158,117,.25)' : 'rgba(127,119,221,.25)')
      daire(ctx, x2, cy, r2, negatif === eb ? 'rgba(29,158,117,.25)' : 'rgba(127,119,221,.25)')
      daire(ctx, ex, cy - 30, 4, '#378add')
      const bitti = ilerleme > 0.75
      yazi(ctx, a + (bitti ? (negatif === ea ? '⁻' : '⁺') : ''), x1, cy, { boyut: 16, kalin: true })
      yazi(ctx, b + (bitti ? (negatif === eb ? '⁻' : '⁺') : ''), x2, cy, { boyut: 16, kalin: true })
      if (bitti) yazi(ctx, '+ ⟷ − elektrostatik çekim', W / 2, cy + 46, { boyut: 11, renk: '#993c1d' })
    } else {
      // ortaklanmış elektron çifti; çift daha elektronegatif atoma kayar
      const kayma = tur === 'Polar kovalent bağ' ? (negatif === eb ? 1 : -1) * Math.min(18, fark * 18) : 0
      const g = ctx.createRadialGradient(W / 2 + kayma * ilerleme, cy, 4, W / 2 + kayma * ilerleme, cy, 70)
      g.addColorStop(0, 'rgba(55,138,221,.35)')
      g.addColorStop(1, 'rgba(55,138,221,0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, W, H)
      daire(ctx, x1, cy, r1, 'rgba(127,119,221,.25)')
      daire(ctx, x2, cy, r2, 'rgba(127,119,221,.25)')
      const ortaX = (x1 + x2) / 2 + kayma * ilerleme
      daire(ctx, ortaX - 4, cy + Math.sin(t * 3) * 3, 3.5, '#378add')
      daire(ctx, ortaX + 4, cy - Math.sin(t * 3) * 3, 3.5, '#378add')
      yazi(ctx, a, x1, cy, { boyut: 16, kalin: true })
      yazi(ctx, b, x2, cy, { boyut: 16, kalin: true })
      if (tur === 'Polar kovalent bağ' && ilerleme > 0.6) {
        yazi(ctx, 'δ' + (negatif === ea ? '−' : '+'), x1, cy - 40, { boyut: 13, kalin: true, renk: '#993c1d' })
        yazi(ctx, 'δ' + (negatif === eb ? '−' : '+'), x2, cy - 40, { boyut: 13, kalin: true, renk: '#993c1d' })
      }
    }
  })

  return (
    <div className="sim">
      <Gorev>İki atom seç ve bağı oluştur. Elektronegatiflik farkı arttıkça elektronlar nasıl davranıyor: eşit mi paylaşılıyor, bir atoma mı kayıyor, tamamen mi aktarılıyor?</Gorev>
      <div className="sim-secim">
        <label>1. atom
          <select value={a} onChange={e => { setA(e.target.value); setOynat(performance.now()) }}>
            {SECENEK.map(s => <option key={s} value={s}>{s} (EN {String(ELEMENTLER.find(e => e.s === s)!.en).replace('.', ',')})</option>)}
          </select>
        </label>
        <label>2. atom
          <select value={b} onChange={e => { setB(e.target.value); setOynat(performance.now()) }}>
            {SECENEK.map(s => <option key={s} value={s}>{s} (EN {String(ELEMENTLER.find(e => e.s === s)!.en).replace('.', ',')})</option>)}
          </select>
        </label>
      </div>
      <canvas ref={canvas} className="sim-canvas" aria-label="Bağ oluşumu animasyonu" />
      <div className="row-actions start">
        <button type="button" className="primary-button" onClick={() => setOynat(performance.now())}>Bağı oluştur</button>
      </div>
      <div className="sim-degerler">
        <Deger ad="EN farkı" deger={sayi(fark, 2)} />
        <Deger ad="Bağ türü" deger={tur} vurgu />
        {tur !== 'Metalik bağ' && tur !== 'Apolar kovalent bağ' && <Deger ad="Elektronları çeken" deger={negatif.s} />}
        {tur === 'İyonik bağ' && <Deger ad="Elektron veren" deger={pozitif.s} />}
      </div>
      <div className="sim-bag-skala" aria-hidden="true">
        <span>Apolar kovalent</span><span>Polar kovalent</span><span>İyonik</span>
        <i style={{ left: `${Math.min(100, (fark / 3.3) * 100)}%` }} />
      </div>
      <Not>Sınırlar kesin değildir: EN farkı yaklaşık 0,4'ten küçükse apolar, 0,4–1,7 arası polar kovalent, 1,7'den büyükse genellikle iyonik bağ kabul edilir. Metal–ametal bileşikleri çoğunlukla iyoniktir.</Not>
    </div>
  )
}
