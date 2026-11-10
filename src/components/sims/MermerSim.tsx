import { useEffect, useState } from 'react'
import { daire, sayi, useAnimasyon, yazi } from './cizim'
import { Deger, Gorev, Grafik, Not } from './ortak'

// Temas yüzeyinin hıza etkisi: eşit kütlede (2 g) blok, parça ve toz mermer aynı HCl ile yarışır.
// Hız ∝ yüzey alanı; toplanan CO₂ hacmi zamanla artar.

const ADAYLAR = [
  { ad: 'Blok', k: 0.012, renk: '#5f5e5a' },
  { ad: 'Parçalar', k: 0.08, renk: '#1d9e75' },
  { ad: 'Toz', k: 0.35, renk: '#e8593c' },
]
const MAKS = 480 // mL CO₂ (2 g CaCO₃ ≈ 0,02 mol ≈ 490 mL)

export default function MermerSim() {
  const [t, setT] = useState(0)
  const [calisiyor, setCalisiyor] = useState(false)
  const hacim = (k: number, tt: number) => MAKS * (1 - Math.exp(-k * tt))

  useEffect(() => {
    if (!calisiyor) return
    const id = window.setInterval(() => setT(x => {
      if (x >= 120) { setCalisiyor(false); return 120 }
      return x + 1
    }), 60)
    return () => window.clearInterval(id)
  }, [calisiyor])

  const canvas = useAnimasyon((ctx, W, H, _dt, zt) => {
    const n = ADAYLAR.length
    const w = (W - 20) / n
    ADAYLAR.forEach((a, i) => {
      const x = 10 + i * w + w / 2
      // erlen
      const ey = H - 10
      ctx.fillStyle = 'rgba(133,183,235,.3)'
      ctx.beginPath()
      ctx.moveTo(x - 6, ey - 70)
      ctx.lineTo(x - 30, ey)
      ctx.lineTo(x + 30, ey)
      ctx.lineTo(x + 6, ey - 70)
      ctx.closePath()
      ctx.fill()
      ctx.strokeStyle = '#26215c'
      ctx.lineWidth = 2
      ctx.stroke()
      // mermer
      const kalan = 1 - hacim(a.k, t) / MAKS
      if (a.ad === 'Blok') { ctx.fillStyle = '#e8e6e0'; ctx.fillRect(x - 10 * kalan, ey - 6 - 14 * kalan, 20 * kalan, 14 * kalan) }
      else if (a.ad === 'Parçalar') for (let j = 0; j < 6; j++) daire(ctx, x - 15 + j * 6, ey - 6, 4 * kalan, '#e8e6e0')
      else for (let j = 0; j < 30; j++) daire(ctx, x - 22 + (j % 15) * 3, ey - 4 - Math.floor(j / 15) * 3, 1.4 * kalan, '#e8e6e0')
      // kabarcıklar
      if (calisiyor && kalan > 0.02) {
        const nb = Math.round(a.k * 40)
        for (let j = 0; j < nb; j++) daire(ctx, x - 12 + ((j * 7) % 24), ey - 10 - ((zt * 40 + j * 9) % 50), 2, '#fff')
      }
      // balon (toplanan gaz)
      const r = 6 + Math.sqrt(hacim(a.k, t)) * 1.3
      ctx.fillStyle = a.renk + 'aa'
      ctx.beginPath()
      ctx.arc(x, ey - 76 - r, r, 0, Math.PI * 2)
      ctx.fill()
      yazi(ctx, a.ad, x, ey - 76 - 2 * r - 10, { boyut: 11, kalin: true })
    })
  })

  return (
    <div className="sim">
      <Gorev>Üç erlende eşit kütlede mermer ve aynı derişimde HCl var. Yarışı başlat: hangi balon en hızlı şişiyor? Sonunda toplanan gaz miktarları neden eşit?</Gorev>
      <p className="sim-sabit">CaCO₃(k) + 2HCl(suda) → CaCl₂(suda) + H₂O(s) + CO₂(g)</p>
      <canvas ref={canvas} className="sim-canvas uzun" aria-label="Mermer ve asit yarışı" />
      <div className="row-actions start">
        <button type="button" className="primary-button" onClick={() => { if (t >= 120) setT(0); setCalisiyor(true) }}>Yarışı başlat</button>
        <button type="button" className="btn-secondary" onClick={() => { setT(0); setCalisiyor(false) }}>Baştan</button>
      </div>
      <div className="sim-degerler">
        <Deger ad="Süre" deger={`${t} s`} />
        {ADAYLAR.map(a => <Deger key={a.ad} ad={`${a.ad} (mL CO₂)`} deger={sayi(hacim(a.k, t), 0)} vurgu={a.ad === 'Toz'} />)}
      </div>
      <Grafik
        seriler={ADAYLAR.map(a => ({ ad: a.ad, renk: a.renk, noktalar: Array.from({ length: t + 1 }, (_, i) => [i, hacim(a.k, i)] as [number, number]) }))}
        xEtiket="Zaman (s)"
        yEtiket="CO₂ hacmi (mL)"
        xMax={120}
        yMax={500}
      />
      <Not>Temas yüzeyi arttıkça birim zamandaki çarpışma sayısı artar; tepkime hızlanır. Toplam ürün miktarı, mermer kütlesi aynı olduğu için değişmez. Hızlar temsilidir.</Not>
    </div>
  )
}
