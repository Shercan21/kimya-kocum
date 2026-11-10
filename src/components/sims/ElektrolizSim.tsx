import { useEffect, useState } from 'react'
import { daire, sayi, useAnimasyon, yazi } from './cizim'
import { Deger, Gorev, Kaydirici, Not, Secenekler } from './ortak'

// Suyun elektrolizi ile hidrojen üretimi: enerji kaynağına göre hidrojenin "rengi"
// ve CO₂ salımı. Katotta H₂, anotta O₂ toplanır (hacim oranı 2 : 1).

type Kaynak = 'gunes' | 'ruzgar' | 'komur'
const KAYNAK: Record<Kaynak, { ad: string; renk: string; co2: number; etiket: string }> = {
  gunes: { ad: 'Güneş paneli', renk: '#1d9e75', co2: 0, etiket: 'Yeşil hidrojen' },
  ruzgar: { ad: 'Rüzgâr türbini', renk: '#1d9e75', co2: 0, etiket: 'Yeşil hidrojen' },
  komur: { ad: 'Kömür santrali elektriği', renk: '#5f5e5a', co2: 1, etiket: 'Fosil kaynaklı (gri) hidrojen' },
}

export default function ElektrolizSim() {
  const [kaynak, setKaynak] = useState<Kaynak>('gunes')
  const [guc, setGuc] = useState(0.7)
  const [h2, setH2] = useState(0) // mL
  const [calisiyor, setCalisiyor] = useState(false)

  useEffect(() => {
    if (!calisiyor) return
    const id = window.setInterval(() => setH2(v => Math.min(60, v + guc * 0.5)), 100)
    return () => window.clearInterval(id)
  }, [calisiyor, guc])

  const o2 = h2 / 2
  // 1 mol H₂ (oda koşullarında ~24,5 L) için ~ 286 kJ elektrik; kömür elektriği ~ 1 kg CO₂ / kWh
  const enerjiKJ = (h2 / 24500) * 286 / 0.7
  const co2g = KAYNAK[kaynak].co2 * (enerjiKJ / 3600) * 1000

  const canvas = useAnimasyon((ctx, W, H) => {
    const t = performance.now() / 1000
    // kaynak
    yazi(ctx, kaynak === 'gunes' ? '☀️' : kaynak === 'ruzgar' ? '🌬️' : '🏭', 30, 30, { boyut: 26 })
    yazi(ctx, KAYNAK[kaynak].ad, 30, 58, { boyut: 9 })
    if (kaynak === 'komur' && calisiyor) {
      for (let i = 0; i < 4; i++) daire(ctx, 34 + Math.sin(t + i) * 4, 14 - ((t * 20 + i * 10) % 30), 5, 'rgba(95,94,90,.35)')
    }
    // kablolar
    ctx.strokeStyle = calisiyor ? '#f2a623' : '#b4b2a9'
    ctx.lineWidth = 2
    const kx1 = W / 2 - 45
    const kx2 = W / 2 + 45
    ctx.beginPath()
    ctx.moveTo(52, 30)
    ctx.lineTo(kx1, 30)
    ctx.lineTo(kx1, 70)
    ctx.moveTo(52, 36)
    ctx.lineTo(W - 20, 36)
    ctx.lineTo(W - 20, 50)
    ctx.lineTo(kx2, 50)
    ctx.lineTo(kx2, 70)
    ctx.stroke()
    // kap
    const ky = 80
    const kh = H - ky - 10
    ctx.fillStyle = 'rgba(120,180,240,.2)'
    ctx.fillRect(W / 2 - 90, ky + 30, 180, kh - 30)
    ctx.strokeStyle = '#26215c'
    ctx.lineWidth = 2
    ctx.strokeRect(W / 2 - 90, ky + 30, 180, kh - 30)
    // toplama tüpleri
    const tupH = kh - 20
    const tup = (x: number, gaz: number, ad: string) => {
      const dolu = (gaz / 60) * (tupH - 10)
      ctx.fillStyle = 'rgba(120,180,240,.35)'
      ctx.fillRect(x - 14, ky + dolu, 28, tupH - dolu)
      ctx.fillStyle = 'rgba(255,255,255,.95)'
      ctx.fillRect(x - 14, ky, 28, dolu)
      ctx.strokeStyle = '#26215c'
      ctx.strokeRect(x - 14, ky, 28, tupH)
      yazi(ctx, ad, x, ky - 8, { boyut: 11, kalin: true })
      yazi(ctx, `${sayi(gaz, 1)} mL`, x, ky + 10, { boyut: 9 })
      if (calisiyor) {
        const n = ad === 'H₂' ? 6 : 3
        for (let i = 0; i < n; i++) daire(ctx, x - 6 + ((i * 7) % 14), ky + tupH - ((t * 40 * guc + i * 17) % (tupH - dolu - 4)), 2, '#fff')
      }
    }
    tup(kx1, h2, 'H₂')
    tup(kx2, o2, 'O₂')
    yazi(ctx, 'Katot (−)', kx1, ky + tupH + 4, { boyut: 9 })
    yazi(ctx, 'Anot (+)', kx2, ky + tupH + 4, { boyut: 9 })
  })

  return (
    <div className="sim">
      <Gorev>Elektrolizi başlat ve iki tüpte toplanan gaz hacimlerini karşılaştır. Enerji kaynağını değiştir: hangi durumda hidrojen "yeşil" sayılır, neden?</Gorev>
      <p className="sim-sabit">2H₂O(s) → 2H₂(g) + O₂(g) (su içine az miktar elektrolit eklenir)</p>
      <Secenekler secenekler={(Object.keys(KAYNAK) as Kaynak[]).map(k => ({ id: k, ad: KAYNAK[k].ad }))} secili={kaynak} onSec={setKaynak} etiket="Enerji kaynağı" />
      <canvas ref={canvas} className="sim-canvas uzun" aria-label="Suyun elektrolizi animasyonu" />
      <div className="sim-degerler">
        <Deger ad="H₂ / O₂" deger={`${sayi(h2, 1)} / ${sayi(o2, 1)} mL`} />
        <Deger ad="Hacim oranı" deger={h2 > 0 ? '2 : 1' : '—'} />
        <Deger ad="Harcanan elektrik" deger={`${sayi(enerjiKJ, 2)} kJ`} />
        <Deger ad="CO₂ salımı" deger={`${sayi(co2g, 2)} g`} vurgu={co2g > 0} />
        <Deger ad="Tür" deger={KAYNAK[kaynak].etiket} />
      </div>
      <Kaydirici etiket={<>Güç (ışık / rüzgâr şiddeti) <b>%{Math.round(guc * 100)}</b></>} deger={guc} min={0.1} max={1} step={0.1} onChange={setGuc} />
      <div className="row-actions start">
        <button type="button" className="primary-button" onClick={() => setCalisiyor(c => !c)}>{calisiyor ? 'Durdur' : 'Elektrolizi başlat'}</button>
        <button type="button" className="btn-secondary" onClick={() => { setH2(0); setCalisiyor(false) }}>Tüpleri boşalt</button>
      </div>
      <Not>Hesaplar yaklaşıktır: oda koşullarında 1 mol H₂ ≈ 24,5 L; elektroliz verimi %70; kömür elektriği için kWh başına ≈ 1 kg CO₂ alınmıştır.</Not>
    </div>
  )
}
